// ============================================
// BS FOODS BILLING SYSTEM - Type Definitions
// ============================================

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;        // URL (Unsplash / CDN)
  imageAlt?: string;    // accessibility text
  description: string;
  available: boolean;
  bestSeller: boolean;
  badge?: string;       // e.g. "Normal ₹89 / Thick ₹149"
}

export interface CartItem extends MenuItem {
  quantity: number;
  notes: string;
  itemDiscount: number;
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
  customerName: string;
  customerPhone: string;
  orderType: 'dine-in' | 'takeaway';
  tableNumber: string;
  orderNotes: string;
  paymentMethod: 'cash' | 'upi' | 'card';
  createdAt: string;
  printed: boolean;
  whatsappSent: boolean;
}

export interface DailyReport {
  date: string;
  totalBills: number;
  totalSales: number;
  totalDiscount: number;
  totalRevenue: number;
  itemsSold: Record<string, number>;
  paymentMethods: Record<string, number>;
  printCount: number;
  whatsappCount: number;
  peakHour: string;
  hourlyData: Record<string, number>;
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

export type MenuCategory =
  | 'Mocktails'
  | 'Desserts & Ice Cream Scoops'
  | 'Chai & Juice'
  | 'Pizza'
  | 'Sandwich & Wraps'
  | 'Snacks & Burgers'
  | 'Thick Shakes & Milk Shakes';

export interface TableState {
  id: string;
  number: number;
  items: CartItem[];
  customerName: string;
  customerPhone: string;
  orderType: 'dine-in' | 'takeaway';
  orderNotes: string;
  status: 'available' | 'occupied';
  startedAt?: string;
  lastUpdated?: string;
}

export const MENU_CATEGORIES: MenuCategory[] = [
  'Mocktails',
  'Desserts & Ice Cream Scoops',
  'Chai & Juice',
  'Pizza',
  'Sandwich & Wraps',
  'Snacks & Burgers',
  'Thick Shakes & Milk Shakes',
];

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
