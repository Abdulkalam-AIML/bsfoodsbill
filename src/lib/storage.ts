// ============================================
// BS FOODS - Robust Multi-Tier Storage Engine
// High-reliability persistent storage for Cafe POS
// Developed by NexLayer Private Limited
// ============================================

import type { MenuItem, Bill, CafeSettings, DailyReport, TableState } from '@/types';

export const KEYS = {
  BILLS: 'bsfoods_today_bills',
  ALL_BILLS: 'bsfoods_all_bills',
  MENU: 'bsfoods_menu',
  CUSTOM_ITEMS: 'bsfoods_custom_menu_items',
  OVERRIDES: 'bsfoods_menu_overrides',
  DELETED_IDS: 'bsfoods_deleted_item_ids',
  MENU_VERSION: 'bsfoods_menu_version',
  SETTINGS: 'bsfoods_settings',
  REPORT: 'bsfoods_today_report',
  BILL_COUNTER: 'bsfoods_bill_counter',
  LAST_CLEANUP: 'bsfoods_last_cleanup',
  AUTH: 'bsfoods_auth',
  HELD_TABLES: 'bsfoods_held_tables',
} as const;

export const CURRENT_MENU_VERSION = 'v7-poster-83';

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

// ---- Generic Safe LocalStorage Helpers ----
function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.warn(`Error reading key ${key} from storage:`, err);
    return fallback;
  }
}

function setItem<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    // Verification read-back
    const verify = localStorage.getItem(key);
    return verify !== null && verify.length === serialized.length;
  } catch (err: any) {
    console.error(`Storage write failed for key ${key}:`, err);
    // If quota exceeded, clean up old non-critical cache and retry once
    try {
      autoCleanup(true);
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
      return localStorage.getItem(key) !== null;
    } catch (retryErr) {
      console.error(`Storage full even after cleanup for key ${key}:`, retryErr);
      return false;
    }
  }
}

// ---- IndexedDB Secondary Mirror ----
function mirrorToIndexedDB(menu: MenuItem[]): void {
  if (typeof window === 'undefined' || !window.indexedDB) return;
  try {
    const request = indexedDB.open('bsfoods_pos_offline_db', 1);
    request.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('menu_store')) {
        db.createObjectStore('menu_store', { keyPath: 'id' });
      }
    };
    request.onsuccess = (e: any) => {
      const db = e.target.result;
      const tx = db.transaction('menu_store', 'readwrite');
      const store = tx.objectStore('menu_store');
      store.clear();
      menu.forEach((item) => store.put(item));
    };
  } catch {
    // Non-blocking secondary sync
  }
}

// ---- Auto Cleanup (Strictly bills only - never touches menu or settings) ----
export function autoCleanup(force = false): void {
  const lastCleanup = getItem<string>(KEYS.LAST_CLEANUP, '');
  const today = getToday();

  if (!force && lastCleanup === today) return;

  // Only keep today's bills in today's active cache
  const bills = getTodayBills();
  const todayBills = bills.filter((b) => b.createdAt.startsWith(today));

  setItem(KEYS.BILLS, todayBills);
  setItem(KEYS.LAST_CLEANUP, today);
}

// ---- Bills ----
export function getTodayBills(): Bill[] {
  return getItem<Bill[]>(KEYS.BILLS, []);
}

export function getAllBills(): Bill[] {
  return getItem<Bill[]>(KEYS.ALL_BILLS, []);
}

export function saveBill(bill: Bill): boolean {
  const bills = getTodayBills();
  bills.push(bill);
  const ok1 = setItem(KEYS.BILLS, bills);

  const allBills = getAllBills();
  allBills.push(bill);
  const ok2 = setItem(KEYS.ALL_BILLS, allBills);

  return ok1 && ok2;
}

export function saveAllBills(bills: Bill[]): boolean {
  const ok1 = setItem(KEYS.BILLS, bills);

  const allBills = getAllBills();
  const updatedAllBills = allBills.map((b) => {
    const updated = bills.find((tb) => tb.id === b.id);
    return updated ? updated : b;
  });
  bills.forEach((tb) => {
    if (!allBills.some((b) => b.id === tb.id)) {
      updatedAllBills.push(tb);
    }
  });
  const ok2 = setItem(KEYS.ALL_BILLS, updatedAllBills);

  return ok1 && ok2;
}

export function getNextBillNumber(): number {
  const data = getItem<{ date: string; counter: number }>(KEYS.BILL_COUNTER, {
    date: '',
    counter: 0,
  });
  const today = getToday();
  if (data.date !== today) {
    setItem(KEYS.BILL_COUNTER, { date: today, counter: 1 });
    return 1;
  }
  const next = data.counter + 1;
  setItem(KEYS.BILL_COUNTER, { date: today, counter: next });
  return next;
}

// ---- Permanent Menu Persistence Engine ----

/**
 * Retrieves the full active menu from persistent storage.
 */
export function getMenu(): MenuItem[] {
  return getItem<MenuItem[]>(KEYS.MENU, []);
}

/**
 * Retrieves isolated owner-created custom items.
 */
export function getCustomMenuItems(): MenuItem[] {
  return getItem<MenuItem[]>(KEYS.CUSTOM_ITEMS, []);
}

/**
 * Retrieves owner price/availability overrides on existing products.
 */
export function getMenuOverrides(): Record<string, Partial<MenuItem>> {
  return getItem<Record<string, Partial<MenuItem>>>(KEYS.OVERRIDES, {});
}

/**
 * Retrieves explicitly deleted item IDs.
 */
export function getDeletedItemIds(): string[] {
  return getItem<string[]>(KEYS.DELETED_IDS, []);
}

/**
 * Persists the entire menu with write verification, secondary mirroring,
 * and isolated custom item preservation.
 */
export function saveMenu(menu: MenuItem[]): boolean {
  if (typeof window === 'undefined') return false;

  // 1. Write to main menu key
  const okMain = setItem(KEYS.MENU, menu);

  // 2. Extract and preserve custom items in dedicated key
  const customItems = menu.filter(
    (m) => m.isCustom || m.id.startsWith('item-') || m.id.startsWith('custom-')
  );
  setItem(KEYS.CUSTOM_ITEMS, customItems);

  // 3. Mirror to IndexedDB
  mirrorToIndexedDB(menu);

  return okMain;
}

/**
 * Saves or updates a single custom menu item with guaranteed persistence.
 */
export function saveCustomMenuItem(item: MenuItem): boolean {
  if (typeof window === 'undefined') return false;

  const taggedItem: MenuItem = { ...item, isCustom: true };

  // Save to isolated custom items list
  const customList = getCustomMenuItems();
  const existingIdx = customList.findIndex((c) => c.id === item.id);
  if (existingIdx !== -1) {
    customList[existingIdx] = taggedItem;
  } else {
    customList.push(taggedItem);
  }
  const okCustom = setItem(KEYS.CUSTOM_ITEMS, customList);

  // Also update active menu
  const menu = getMenu();
  const menuIdx = menu.findIndex((m) => m.id === item.id);
  if (menuIdx !== -1) {
    menu[menuIdx] = taggedItem;
  } else {
    menu.push(taggedItem);
  }
  const okMenu = saveMenu(menu);

  return okCustom && okMenu;
}

/**
 * Deletes a menu item permanently:
 * If it's a custom item, removes it from custom list.
 * If it's a default item, adds it to deleted list to prevent resurrection.
 */
export function removeMenuItem(id: string): boolean {
  if (typeof window === 'undefined') return false;

  // Remove from custom list if present
  const customList = getCustomMenuItems().filter((c) => c.id !== id);
  setItem(KEYS.CUSTOM_ITEMS, customList);

  // Add to deleted IDs list
  const deletedIds = getDeletedItemIds();
  if (!deletedIds.includes(id)) {
    deletedIds.push(id);
    setItem(KEYS.DELETED_IDS, deletedIds);
  }

  // Remove from active menu
  const menu = getMenu().filter((m) => m.id !== id);
  return saveMenu(menu);
}

/**
 * Records an owner price or availability override on an existing item.
 */
export function recordItemOverride(id: string, updates: Partial<MenuItem>): boolean {
  const overrides = getMenuOverrides();
  overrides[id] = { ...(overrides[id] || {}), ...updates };
  return setItem(KEYS.OVERRIDES, overrides);
}

// ---- Backup & Export / Import (Multi-Device Sync Support) ----

export function exportMenuBackupJSON(): string {
  const data = {
    exportedAt: new Date().toISOString(),
    version: CURRENT_MENU_VERSION,
    menu: getMenu(),
    customItems: getCustomMenuItems(),
    overrides: getMenuOverrides(),
    settings: getSettings(),
  };
  return JSON.stringify(data, null, 2);
}

export function importMenuBackupJSON(jsonStr: string): boolean {
  try {
    const data = JSON.parse(jsonStr);
    if (!data.menu || !Array.isArray(data.menu)) {
      throw new Error('Invalid backup file structure');
    }
    if (data.customItems && Array.isArray(data.customItems)) {
      setItem(KEYS.CUSTOM_ITEMS, data.customItems);
    }
    if (data.overrides && typeof data.overrides === 'object') {
      setItem(KEYS.OVERRIDES, data.overrides);
    }
    if (data.settings) {
      setItem(KEYS.SETTINGS, data.settings);
    }
    return saveMenu(data.menu);
  } catch (err) {
    console.error('Failed to import menu backup:', err);
    return false;
  }
}

// ---- Settings ----
export function getSettings(): CafeSettings {
  const fallback: CafeSettings = {
    cafeName: 'BS FOODS CAFE',
    tagline: 'Smart Billing Experience for Modern Cafes',
    phone: '',
    address: '',
    logoUrl: '/logo.png',
    currency: '₹',
    receiptFooter: 'Thank you for visiting BS FOODS! See you again soon.',
    developerName: 'NexLayer Private Limited',
    developerUrl: 'https://nexlayer.in',
  };
  return getItem(KEYS.SETTINGS, fallback);
}

export function saveSettings(settings: CafeSettings): boolean {
  return setItem(KEYS.SETTINGS, settings);
}

// ---- Tables ----
export function getHeldTables(): TableState[] {
  return getItem(KEYS.HELD_TABLES, []);
}

export function saveHeldTables(tables: TableState[]): boolean {
  return setItem(KEYS.HELD_TABLES, tables);
}

// ---- Auth ----
export function getAuth(): { loggedIn: boolean; role: string; pin: string } {
  return getItem(KEYS.AUTH, { loggedIn: false, role: '', pin: '' });
}

export function setAuth(auth: { loggedIn: boolean; role: string; pin: string }): boolean {
  return setItem(KEYS.AUTH, auth);
}

export function logout(): void {
  setItem(KEYS.AUTH, { loggedIn: false, role: '', pin: '' });
}

// ---- Daily Report Generator ----
export function generateDailyReport(): DailyReport {
  const today = getToday();
  const bills = getTodayBills().filter((b) => b.createdAt.startsWith(today) && b.status === 'COMPLETED');

  const itemsSold: Record<string, number> = {};
  const itemsRevenue: Record<string, number> = {};
  const categorySales: Record<string, { qty: number; revenue: number }> = {};
  const hourlyData: Record<string, number> = {};
  const paymentMethods: Record<string, number> = { cash: 0, upi: 0, card: 0 };
  let totalDiscount = 0;
  let printCount = 0;
  let whatsappCount = 0;
  let kitchenTicketsPrinted = 0;
  let customerBillsPrinted = 0;

  let totalDeliveryCharges = 0;
  let totalPackingCharges = 0;
  let totalExtraCharges = 0;
  let totalFoodSales = 0;

  bills.forEach((bill) => {
    // Items sold & revenue (combo sold counted once under its category)
    bill.items.forEach((item) => {
      itemsSold[item.name] = (itemsSold[item.name] || 0) + item.quantity;
      itemsRevenue[item.name] = (itemsRevenue[item.name] || 0) + (item.price * item.quantity);

      const cat = item.category || 'Other';
      if (!categorySales[cat]) {
        categorySales[cat] = { qty: 0, revenue: 0 };
      }
      categorySales[cat].qty += item.quantity;
      categorySales[cat].revenue += item.price * item.quantity;
    });

    // Hourly
    const hour = new Date(bill.createdAt).getHours();
    const hourKey = `${hour}:00`;
    hourlyData[hourKey] = (hourlyData[hourKey] || 0) + (bill.grandTotal || bill.total);

    // Payment
    paymentMethods[bill.paymentMethod] = (paymentMethods[bill.paymentMethod] || 0) + 1;

    // Discount
    totalDiscount += bill.discount || 0;

    // Charges & Food sales
    totalDeliveryCharges += bill.deliveryCharge || 0;
    totalPackingCharges += bill.packingCharge || 0;
    totalExtraCharges += bill.extraCharge || 0;
    totalFoodSales += bill.subtotal || 0;

    // Counts
    if (bill.printed) printCount++;
    if (bill.whatsappSent) whatsappCount++;
    if (bill.kitchenTicketPrinted || bill.kotPrinted) kitchenTicketsPrinted++;
    if (bill.customerBillPrinted || bill.billPrinted) customerBillsPrinted++;
  });

  const totalSales = bills.reduce((sum, b) => sum + (b.grandTotal || b.total), 0);

  // Peak hour
  let peakHour = '';
  let peakValue = 0;
  Object.entries(hourlyData).forEach(([h, v]) => {
    if (v > peakValue) {
      peakValue = v;
      peakHour = h;
    }
  });

  return {
    date: today,
    totalBills: bills.length,
    totalSales,
    totalDiscount,
    totalRevenue: totalSales,
    itemsSold,
    itemsRevenue,
    categorySales,
    paymentMethods,
    printCount,
    whatsappCount,
    peakHour,
    hourlyData,
    kitchenTicketsPrinted,
    customerBillsPrinted,
    totalDeliveryCharges,
    totalPackingCharges,
    totalExtraCharges,
    totalFoodSales,
  };
}

// ---- Clear Today Data (Bills only - NEVER touches menu, categories, or settings) ----
export function clearTodayData(): void {
  const keys = [KEYS.BILLS, KEYS.REPORT, KEYS.BILL_COUNTER];
  keys.forEach((k) => {
    try {
      localStorage.removeItem(k);
    } catch {
      // Ignored
    }
  });
}

// Run auto cleanup on load
if (typeof window !== 'undefined') {
  autoCleanup();
}
