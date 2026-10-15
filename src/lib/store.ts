// ============================================
// BS FOODS - Zustand Store
// Single global store for fast POS operations
// ============================================

import { create } from 'zustand';
import type { MenuItem, CartItem, Bill, CafeSettings, DailyReport } from '@/types';
import { DEFAULT_SETTINGS } from '@/types';
import {
  getTodayBills,
  saveBill,
  getNextBillNumber,
  getMenu,
  saveMenu,
  saveCustomMenuItem,
  removeMenuItem,
  recordItemOverride,
  getCustomMenuItems,
  getMenuOverrides,
  getDeletedItemIds,
  CURRENT_MENU_VERSION,
  KEYS,
  getSettings,
  saveSettings as persistSettings,
  generateDailyReport,
  getAuth,
  setAuth as persistAuth,
  logout as doLogout,
  getHeldTables,
  saveHeldTables,
  saveAllBills,
} from '@/lib/storage';
import { DEFAULT_MENU, migrateMenu } from '@/lib/menu-data';
import type { TableState } from '@/types';

export interface AppState {
  // Auth
  isLoggedIn: boolean;
  userRole: string;
  login: (pin: string) => boolean;
  logout: () => void;
  initAuth: () => void;

  // Menu
  menu: MenuItem[];
  loadMenu: () => void;
  addMenuItem: (item: MenuItem) => boolean;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => boolean;
  deleteMenuItem: (id: string) => boolean;
  toggleAvailability: (id: string) => boolean;

  // Cart
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateCartItemNotes: (id: string, notes: string) => void;
  clearCart: () => void;

  // Order details
  orderType: 'dine-in' | 'takeaway';
  tableNumber: string;
  orderNotes: string;
  paymentMethod: 'cash' | 'upi' | 'card';
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  deliveryCharge: number;
  packingCharge: number;
  extraCharge: number;
  cartDiscount: number;
  setOrderType: (type: 'dine-in' | 'takeaway') => void;
  setTableNumber: (num: string) => void;
  setOrderNotes: (notes: string) => void;
  setPaymentMethod: (method: 'cash' | 'upi' | 'card') => void;
  setDiscountType: (type: 'percentage' | 'fixed') => void;
  setDiscountValue: (value: number) => void;
  setDeliveryCharge: (val: number) => void;
  setPackingCharge: (val: number) => void;
  setExtraCharge: (val: number) => void;
  setCartDiscount: (val: number) => void;

  // Tables
  tables: TableState[];
  loadTables: () => void;
  holdTable: (number: number) => void;
  resumeTable: (number: number) => void;
  clearTable: (number: number) => void;
  completeOrder: () => void;

  // Computed
  subtotal: () => number;
  discountAmount: () => number;
  total: () => number;

  // Bills
  bills: Bill[];
  loadBills: () => void;
  createBill: (printed: boolean, whatsappSent: boolean) => Bill;
  updateBill: (id: string, updates: Partial<Bill>) => Bill | undefined;
  updateBillStatus: (
    id: string,
    printed?: boolean,
    whatsappSent?: boolean,
    kitchenTicketPrinted?: boolean,
    customerBillPrinted?: boolean
  ) => void;

  // Reports
  report: DailyReport | null;
  generateReport: () => void;

  // Settings
  settings: CafeSettings;
  loadSettings: () => void;
  updateSettings: (s: Partial<CafeSettings>) => void;

  // UI
  darkMode: boolean;
  toggleDarkMode: () => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Bill Completion Flow
  currentBillId: string | null;
  billPrinted: boolean;
  billWhatsappSent: boolean;
  setBillStatus: (printed?: boolean, whatsappSent?: boolean) => void;
  resetBillStatus: () => void;
}

// Default PIN codes
const PINS: Record<string, string> = {
  owner: '1234',
  admin: '5678',
  staff: '0000',
};

export const useStore = create<AppState>((set, get) => ({
  // ---- Auth ----
  isLoggedIn: false,
  userRole: '',
  initAuth: () => {
    const auth = getAuth();
    if (auth && auth.loggedIn && auth.role) {
      set({ isLoggedIn: true, userRole: auth.role });
    }
  },
  login: (pin: string) => {
    const role = Object.entries(PINS).find(([, p]) => p === pin)?.[0];
    if (role) {
      persistAuth({ loggedIn: true, role, pin });
      set({ isLoggedIn: true, userRole: role });
      return true;
    }
    return false;
  },
  logout: () => {
    doLogout();
    set({ isLoggedIn: false, userRole: '' });
  },

  // ---- Menu ----
  menu: [],
  loadMenu: () => {
    let menu = getMenu();
    const customItems = getCustomMenuItems();
    const overrides = getMenuOverrides();
    const deletedIds = getDeletedItemIds();

    if (!menu || menu.length === 0) {
      menu = migrateMenu(DEFAULT_MENU, customItems, overrides, deletedIds);
      saveMenu(menu);
      if (typeof window !== 'undefined') {
        localStorage.setItem(KEYS.MENU_VERSION, CURRENT_MENU_VERSION);
      }
    } else {
      // Re-apply any custom items or overrides that might not be in active menu
      const updated = migrateMenu(menu, customItems, overrides, deletedIds);
      if (updated.length !== menu.length) {
        menu = updated;
        saveMenu(menu);
      }
    }
    set({ menu });
  },
  addMenuItem: (item) => {
    const ok = saveCustomMenuItem(item);
    if (ok) {
      const updatedMenu = getMenu();
      set({ menu: updatedMenu });
      return true;
    }
    return false;
  },
  updateMenuItem: (id, updates) => {
    recordItemOverride(id, updates);
    const menu = get().menu.map((m) => (m.id === id ? { ...m, ...updates } : m));
    const ok = saveMenu(menu);
    if (ok) {
      set({ menu });
      return true;
    }
    return false;
  },
  deleteMenuItem: (id) => {
    const ok = removeMenuItem(id);
    if (ok) {
      const updatedMenu = getMenu();
      set({ menu: updatedMenu });
      return true;
    }
    return false;
  },
  toggleAvailability: (id) => {
    const target = get().menu.find((m) => m.id === id);
    if (!target) return false;
    const newAvail = !target.available;
    recordItemOverride(id, { available: newAvail });
    const menu = get().menu.map((m) =>
      m.id === id ? { ...m, available: newAvail } : m,
    );
    const ok = saveMenu(menu);
    if (ok) {
      set({ menu });
      return true;
    }
    return false;
  },

  // ---- Cart ----
  cart: [],
  addToCart: (item) => {
    const cart = get().cart;
    // Differentiate items with different variants or combo component selections
    const existing = cart.find((c) => {
      if (c.id !== item.id) return false;
      const cComps = (c.selectedComponents || []).join('|');
      const itemComps = (item.selectedComponents || []).join('|');
      return cComps === itemComps;
    });

    if (existing) {
      set({
        cart: cart.map((c) =>
          c === existing ? { ...c, quantity: c.quantity + 1 } : c,
        ),
      });
    } else {
      set({
        cart: [...cart, { ...item, quantity: 1, notes: '', itemDiscount: 0 }],
      });
    }
  },
  removeFromCart: (id) => {
    set({ cart: get().cart.filter((c) => c.id !== id) });
  },
  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      set({ cart: get().cart.filter((c) => c.id !== id) });
    } else {
      set({
        cart: get().cart.map((c) => (c.id === id ? { ...c, quantity } : c)),
      });
    }
  },
  updateCartItemNotes: (id, notes) => {
    set({
      cart: get().cart.map((c) => (c.id === id ? { ...c, notes } : c)),
    });
  },
  clearCart: () => {
    set({
      cart: [],
      orderType: 'dine-in',
      tableNumber: '',
      orderNotes: '',
      discountType: 'percentage',
      discountValue: 0,
      currentBillId: null,
      billPrinted: false,
      billWhatsappSent: false,
      deliveryCharge: 0,
      packingCharge: 0,
      extraCharge: 0,
      cartDiscount: 0,
    });
  },

  // ---- Order details ----
  orderType: 'dine-in',
  tableNumber: '',
  orderNotes: '',
  paymentMethod: 'cash',
  discountType: 'percentage',
  discountValue: 0,
  deliveryCharge: 0,
  packingCharge: 0,
  extraCharge: 0,
  cartDiscount: 0,
  setOrderType: (type) => set({ orderType: type }),
  setTableNumber: (num) => set({ tableNumber: num }),
  setOrderNotes: (notes) => set({ orderNotes: notes }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  setDiscountType: (type) => set({ discountType: type }),
  setDiscountValue: (value) => set({ discountValue: value }),
  setDeliveryCharge: (val) => set({ deliveryCharge: val }),
  setPackingCharge: (val) => set({ packingCharge: val }),
  setExtraCharge: (val) => set({ extraCharge: val }),
  setCartDiscount: (val) => set({ cartDiscount: val }),

  // ---- Computed ----
  subtotal: () => {
    return get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },
  discountAmount: () => {
    const { cartDiscount } = get();
    if (cartDiscount !== 0) {
      return cartDiscount;
    }
    const { discountType, discountValue } = get();
    const sub = get().subtotal();
    if (discountType === 'percentage') {
      return Math.round((sub * discountValue) / 100);
    }
    return Math.min(discountValue, sub);
  },
  total: () => {
    const sub = get().subtotal();
    const disc = get().discountAmount();
    const delivery = get().deliveryCharge || 0;
    const packing = get().packingCharge || 0;
    const extra = get().extraCharge || 0;
    return sub + delivery + packing + extra - disc;
  },

  // ---- Bills ----
  bills: [],
  loadBills: () => {
    const bills = getTodayBills();
    set({ bills });
  },
  createBill: (printed, whatsappSent) => {
    const state = get();
    const billNumber = getNextBillNumber();
    const disc = state.discountAmount();
    const bill: Bill = {
      id: `BSF-${Date.now()}`,
      billNumber,
      items: state.cart,
      subtotal: state.subtotal(),
      discount: disc,
      discountType: state.cartDiscount !== 0 ? 'fixed' : state.discountType,
      discountValue: state.cartDiscount !== 0 ? state.cartDiscount : state.discountValue,
      total: state.total(),
      orderType: state.orderType,
      tableNumber: state.tableNumber,
      orderNotes: state.orderNotes,
      paymentMethod: state.paymentMethod,
      createdAt: new Date().toISOString(),
      printed,
      whatsappSent,
      kitchenTicketPrinted: false,
      customerBillPrinted: false,
      status: 'PENDING',
      kotPrinted: false,
      billPrinted: false,
      reportAdded: false,
      deliveryCharge: state.deliveryCharge || 0,
      packingCharge: state.packingCharge || 0,
      extraCharge: state.extraCharge || 0,
      grandTotal: state.total(),
    };
    saveBill(bill);
    const bills = [...state.bills, bill];
    set({ bills });
    return bill;
  },
  updateBill: (id, updates) => {
    let updatedBill: Bill | undefined;
    const bills = get().bills.map((b) => {
      if (b.id === id) {
        updatedBill = { ...b, ...updates };
        return updatedBill;
      }
      return b;
    });
    if (updatedBill) {
      saveAllBills(bills);
      set({ bills });
    }
    return updatedBill;
  },
  updateBillStatus: (id, printed, whatsappSent, kitchenTicketPrinted, customerBillPrinted) => {
    const bills = get().bills.map((b) => {
      if (b.id === id) {
        // Resolve printed states
        const nextKotPrinted = kitchenTicketPrinted === true ? true : (b.kotPrinted || b.kitchenTicketPrinted || false);
        const nextBillPrinted = customerBillPrinted === true ? true : (b.billPrinted || b.customerBillPrinted || false);
        const nextWhatsappSent = whatsappSent !== undefined ? whatsappSent : b.whatsappSent;
        const nextPrinted = printed !== undefined ? printed : b.printed;

        // Transition status
        let nextStatus = b.status || 'PENDING';
        if (nextKotPrinted && nextStatus === 'PENDING') {
          nextStatus = 'KOT_PRINTED';
        }
        if (nextBillPrinted || nextWhatsappSent) {
          nextStatus = 'COMPLETED';
        }

        // reportAdded logic
        let nextReportAdded = b.reportAdded || false;
        if (nextStatus === 'COMPLETED' && !nextReportAdded) {
          nextReportAdded = true;
        }

        return {
          ...b,
          printed: nextPrinted,
          whatsappSent: nextWhatsappSent,
          kitchenTicketPrinted: nextKotPrinted,
          customerBillPrinted: nextBillPrinted,
          kotPrinted: nextKotPrinted,
          billPrinted: nextBillPrinted,
          status: nextStatus,
          reportAdded: nextReportAdded,
        };
      }
      return b;
    });
    saveAllBills(bills);
    set({ bills });
  },

  // ---- Tables ----
  tables: Array.from({ length: 6 }, (_, i) => ({
    id: `table-${i + 1}`,
    number: i + 1,
    items: [],
    orderType: 'dine-in',
    orderNotes: '',
    status: 'available',
  })),
  loadTables: () => {
    const held = getHeldTables();
    if (held.length > 0) {
      set({ tables: held });
    }
  },
  holdTable: (num) => {
    const state = get();
    const newTables = state.tables.map((t) =>
      t.number === num
        ? {
            ...t,
            items: state.cart,
            orderType: state.orderType,
            orderNotes: state.orderNotes,
            status: 'occupied' as const,
            lastUpdated: new Date().toISOString(),
            startedAt: t.startedAt || new Date().toISOString(),
            currentBillId: state.currentBillId,
            deliveryCharge: state.deliveryCharge,
            packingCharge: state.packingCharge,
            extraCharge: state.extraCharge,
            discount: state.cartDiscount,
          }
        : t,
    );
    saveHeldTables(newTables);
    set({ tables: newTables });
    state.clearCart();
  },
  resumeTable: (num) => {
    const state = get();
    const table = state.tables.find((t) => t.number === num);
    if (!table) return;

    const bill = table.currentBillId ? state.bills.find((b) => b.id === table.currentBillId) : null;

    set({
      cart: table.items,
      orderType: table.orderType,
      tableNumber: table.number.toString(),
      orderNotes: table.orderNotes,
      currentBillId: table.currentBillId || null,
      billPrinted: bill ? (bill.customerBillPrinted || bill.billPrinted || false) : false,
      billWhatsappSent: bill ? bill.whatsappSent : false,
      deliveryCharge: table.deliveryCharge || 0,
      packingCharge: table.packingCharge || 0,
      extraCharge: table.extraCharge || 0,
      cartDiscount: table.discount || 0,
    });
  },
  clearTable: (num) => {
    const newTables = get().tables.map((t) =>
      t.number === num
        ? {
            ...t,
            items: [],
            status: 'available' as const,
            startedAt: undefined,
            lastUpdated: undefined,
          }
        : t,
    );
    saveHeldTables(newTables);
    set({ tables: newTables });
  },
  completeOrder: () => {
    const state = get();
    const tableNum = parseInt(state.tableNumber);
    if (!isNaN(tableNum)) {
      state.clearTable(tableNum);
    }
    state.clearCart();
  },

  // ---- Reports ----
  report: null,
  generateReport: () => {
    const report = generateDailyReport();
    set({ report });
  },

  // ---- Settings ----
  settings: DEFAULT_SETTINGS,
  loadSettings: () => {
    const settings = getSettings();
    set({ settings });
  },
  updateSettings: (s) => {
    const settings = { ...get().settings, ...s };
    persistSettings(settings);
    set({ settings });
  },

  // ---- UI ----
  darkMode: true,
  toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
  activeCategory: 'All',
  setActiveCategory: (cat) => set({ activeCategory: cat }),
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),

  // ---- Bill Completion Flow ----
  currentBillId: null,
  billPrinted: false,
  billWhatsappSent: false,
  setBillStatus: (printed, whatsappSent) => {
    const { billPrinted, billWhatsappSent } = get();
    set({
      billPrinted: printed !== undefined ? printed : billPrinted,
      billWhatsappSent: whatsappSent !== undefined ? whatsappSent : billWhatsappSent,
    });
  },
  resetBillStatus: () => {
    set({
      currentBillId: null,
      billPrinted: false,
      billWhatsappSent: false,
    });
  },
}));
