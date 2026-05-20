// ============================================
// BS FOODS - LocalStorage Manager
// Zero-database, lightweight storage system
// ============================================

const KEYS = {
  BILLS: 'bsfoods_today_bills',
  MENU: 'bsfoods_menu',
  SETTINGS: 'bsfoods_settings',
  REPORT: 'bsfoods_today_report',
  BILL_COUNTER: 'bsfoods_bill_counter',
  LAST_CLEANUP: 'bsfoods_last_cleanup',
  AUTH: 'bsfoods_auth',
  HELD_TABLES: 'bsfoods_held_tables',
} as const;

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

// ---- Generic helpers ----
function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full — clear old data and retry
    autoCleanup(true);
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.error('Storage is full even after cleanup');
    }
  }
}

// ---- Auto Cleanup ----
export function autoCleanup(force = false): void {
  const lastCleanup = getItem<string>(KEYS.LAST_CLEANUP, '');
  const today = getToday();

  if (!force && lastCleanup === today) return;

  // Only keep today's data
  const bills = getTodayBills();
  const todayBills = bills.filter((b) => b.createdAt.startsWith(today));

  setItem(KEYS.BILLS, todayBills);
  setItem(KEYS.LAST_CLEANUP, today);
}

// ---- Bills ----
export function getTodayBills(): import('@/types').Bill[] {
  return getItem(KEYS.BILLS, []);
}

export function saveBill(bill: import('@/types').Bill): void {
  const bills = getTodayBills();
  bills.push(bill);
  setItem(KEYS.BILLS, bills);
}

export function saveAllBills(bills: import('@/types').Bill[]): void {
  setItem(KEYS.BILLS, bills);
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

// ---- Menu ----
export function getMenu(): import('@/types').MenuItem[] {
  return getItem(KEYS.MENU, []);
}

export function saveMenu(menu: import('@/types').MenuItem[]): void {
  setItem(KEYS.MENU, menu);
}

// ---- Settings ----
export function getSettings(): import('@/types').CafeSettings {
  const fallback: import('@/types').CafeSettings = {
    cafeName: 'BS FOODS CAFE',
    tagline: 'Smart Billing Experience for Modern Cafes',
    phone: '',
    address: '',
    logoUrl: '',
    currency: '₹',
    receiptFooter: 'Thank you for visiting BS FOODS! See you again soon.',
    developerName: 'NexLayer Private Limited',
    developerUrl: 'https://nexlayer.in',
  };
  return getItem(KEYS.SETTINGS, fallback);
}

export function saveSettings(settings: import('@/types').CafeSettings): void {
  setItem(KEYS.SETTINGS, settings);
}

// ---- Tables ----
export function getHeldTables(): import('@/types').TableState[] {
  return getItem(KEYS.HELD_TABLES, []);
}

export function saveHeldTables(tables: import('@/types').TableState[]): void {
  setItem(KEYS.HELD_TABLES, tables);
}

// ---- Auth ----
export function getAuth(): { loggedIn: boolean; role: string; pin: string } {
  return getItem(KEYS.AUTH, { loggedIn: false, role: '', pin: '' });
}

export function setAuth(auth: { loggedIn: boolean; role: string; pin: string }): void {
  setItem(KEYS.AUTH, auth);
}

export function logout(): void {
  setItem(KEYS.AUTH, { loggedIn: false, role: '', pin: '' });
}

// ---- Daily Report Helpers ----
export function generateDailyReport(): import('@/types').DailyReport {
  const today = getToday();
  const bills = getTodayBills().filter((b) => b.createdAt.startsWith(today));

  const itemsSold: Record<string, number> = {};
  const itemsRevenue: Record<string, number> = {};
  const hourlyData: Record<string, number> = {};
  const paymentMethods: Record<string, number> = { cash: 0, upi: 0, card: 0 };
  let totalDiscount = 0;
  let printCount = 0;
  let whatsappCount = 0;

  bills.forEach((bill) => {
    // Items sold & revenue
    bill.items.forEach((item) => {
      itemsSold[item.name] = (itemsSold[item.name] || 0) + item.quantity;
      itemsRevenue[item.name] = (itemsRevenue[item.name] || 0) + (item.price * item.quantity);
    });
    // Hourly
    const hour = new Date(bill.createdAt).getHours();
    const hourKey = `${hour}:00`;
    hourlyData[hourKey] = (hourlyData[hourKey] || 0) + bill.total;
    // Payment
    paymentMethods[bill.paymentMethod] = (paymentMethods[bill.paymentMethod] || 0) + 1;
    // Discount
    totalDiscount += bill.discount;
    // Counts
    if (bill.printed) printCount++;
    if (bill.whatsappSent) whatsappCount++;
  });

  const totalSales = bills.reduce((sum, b) => sum + b.total, 0);

  // Find peak hour
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
    paymentMethods,
    printCount,
    whatsappCount,
    peakHour,
    hourlyData,
  };
}

// ---- Clear all today data (after report download) ----
export function clearTodayData(): void {
  const keys = [KEYS.BILLS, KEYS.REPORT, KEYS.BILL_COUNTER];
  keys.forEach((k) => localStorage.removeItem(k));
}

// Run auto cleanup on load
if (typeof window !== 'undefined') {
  autoCleanup();
}
