// ============================================
// BS FOODS BILLING SYSTEM - Type Definitions
// ============================================

export interface MenuItemVariant {
  name: string;         // e.g. "Regular", "Thick", "Veg", "Non-Veg", "Steamed", "Fried"
  price?: number;       // variant-specific price (overrides base price)
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;        // URL (Unsplash / CDN / local)
  imageAlt?: string;    // accessibility text
  description: string;
  available: boolean;
  bestSeller: boolean;
  badge?: string;       // e.g. "Regular ₹99 / Thick ₹149"
  itemType?: 'Item' | 'Combo';
  contains?: string[];
  variants?: MenuItemVariant[];
  selectedVariant?: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
  notes: string;
  itemDiscount: number;
  selectedVariant?: string;
}

export interface Bill {
  id: string;
  billNumber: number;
  items: CartItem[];
  subtotal: number;
  discount: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  total: number;
  orderType: 'dine-in' | 'takeaway';
  tableNumber: string;
  orderNotes: string;
  paymentMethod: 'cash' | 'upi' | 'card';
  createdAt: string;
  printed: boolean;
  whatsappSent: boolean;
  kitchenTicketPrinted?: boolean;
  customerBillPrinted?: boolean;
  status?: 'PENDING' | 'KOT_PRINTED' | 'COMPLETED';
  kotPrinted?: boolean;
  billPrinted?: boolean;
  reportAdded?: boolean;
  deliveryCharge?: number;
  packingCharge?: number;
  extraCharge?: number;
  grandTotal?: number;
}

export interface DailyReport {
  date: string;
  totalBills: number;
  totalSales: number;
  totalDiscount: number;
  totalRevenue: number;
  itemsSold: Record<string, number>;
  itemsRevenue: Record<string, number>;
  categorySales?: Record<string, { qty: number; revenue: number }>;
  paymentMethods: Record<string, number>;
  printCount: number;
  whatsappCount: number;
  peakHour: string;
  hourlyData: Record<string, number>;
  kitchenTicketsPrinted: number;
  customerBillsPrinted: number;
  totalDeliveryCharges?: number;
  totalPackingCharges?: number;
  totalExtraCharges?: number;
  totalFoodSales?: number;
}

export interface CafeSettings {
  cafeName: string;
  tagline: string;
  phone: string;
  address: string;
  logoUrl: string;
  currency: string;
  receiptFooter: string;
  developerName: string;
  developerUrl: string;
}

export const MENU_CATEGORIES = [
  'Pop-up Snacks',
  'Housie Cheesy Snacks',
  'Hot & Crispy',
  'Banquet Burgers',
  'Pasta Punch (Macaroni)',
  'Magic Masala Munch',
  'Steam & Creamy',
  'Wrap & Grab',
  'Madly Match Sandwich',
  'Milk Shakes & Thick Shakes',
  'Sip & Refresh',
  'Dazzling Desserts',
  "Hot Soup's",
  'Pizza',
  'Combo Blasters',
  'Beverages',
  'Offers',
  'Extras',
  'Utility',
  'Snacks',
  'Sandwich',
  'Burgers',
  'Mocktails',
  'Desserts & Ice Cream Scoops',
] as const;

export type MenuCategory = typeof MENU_CATEGORIES[number] | string;

export type TableState = {
  id: string;
  number: number;
  items: CartItem[];
  orderType: 'dine-in' | 'takeaway';
  orderNotes: string;
  status: 'available' | 'occupied';
  startedAt?: string;
  lastUpdated?: string;
  currentBillId?: string | null;
  deliveryCharge?: number;
  packingCharge?: number;
  extraCharge?: number;
  discount?: number;
};

export const DEFAULT_SETTINGS: CafeSettings = {
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
