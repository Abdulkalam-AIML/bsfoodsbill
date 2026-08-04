// ============================================
// BS FOODS - WhatsApp Integration (FREE)
// Uses wa.me/ deep links — zero API cost
// ============================================

import type { Bill, CafeSettings } from '@/types';
import { DEFAULT_SETTINGS } from '@/types';

function formatCurrency(amount: number, currency = '₹'): string {
  return `${currency}${amount.toFixed(2)}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function generateBillMessage(bill: Bill, settings?: CafeSettings): string {
  const s = settings || DEFAULT_SETTINGS;

  const date = new Date(bill.createdAt);
  const dateStr = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  let message = `🍽️ *${s.cafeName}*\n`;
  message += `_${s.tagline}_\n\n`;
  message += `━━━━━━━━━━━━━━━━━━\n\n`;
  message += `🧾 *Bill #${bill.billNumber}*\n`;
  if (bill.tableNumber) message += `🪑 Table: ${bill.tableNumber}\n`;
  message += `📅 ${dateStr}\n`;
  message += `⏰ ${timeStr}\n`;
  message += `🍴 ${bill.orderType.toUpperCase()}\n\n`;
  message += `━━━━━━━━━━━━━━━━━━\n\n`;

  bill.items.forEach((item) => {
    message += `${getEmojiForItem(item)} *${item.name}*\n`;
    message += `${item.quantity} × ₹${item.price} = ₹${item.price * item.quantity}\n\n`;
  });

  message += `━━━━━━━━━━━━━━━━━━\n\n`;
  message += `💰 Subtotal: ₹${bill.subtotal}\n`;
  if (bill.deliveryCharge && bill.deliveryCharge > 0) message += `🛵 Delivery Charge: ₹${bill.deliveryCharge}\n`;
  if (bill.packingCharge && bill.packingCharge > 0) message += `📦 Packing Charge: ₹${bill.packingCharge}\n`;
  if (bill.extraCharge && bill.extraCharge > 0) message += `➕ Extra Charge: ₹${bill.extraCharge}\n`;
  if (bill.discount && bill.discount !== 0) message += `🎁 Discount: ${bill.discount < 0 ? '+' : '-'}₹${Math.abs(bill.discount)}\n`;
  message += `✅ *TOTAL: ₹${bill.grandTotal || bill.total}*\n\n`;
  message += `💳 Payment: ${bill.paymentMethod.toUpperCase()}\n\n`;
  message += `━━━━━━━━━━━━━━━━━━\n\n`;
  message += `🙏 Thank you for visiting BS FOODS!\n\n`;
  message += `✨ Powered by\n`;
  message += `*NexLayer Private Limited*`;

  return message;
}

function getEmojiForItem(item: import('@/types').MenuItem): string {
  const name = item.name.toLowerCase();
  const cat = item.category.toLowerCase();
  
  if (name.includes('water bottle')) return '💧';
  if (name.includes('offer')) return '🎁';
  if (name.includes('extra charge') || name.includes('extra')) return '➕';
  
  if (name.includes('blue blast')) return '🧃';
  if (name.includes('red wine')) return '🍷';
  
  if (cat.includes('mocktails')) return '🍹';
  if (cat.includes('desserts')) return '🍦';
  if (cat.includes('chai') || cat.includes('juice')) return '🧃';
  if (cat.includes('pizza')) return '🍕';
  if (cat.includes('sandwich')) return '🥪';
  if (cat.includes('snacks') || cat.includes('burger')) return '🍔';
  if (cat.includes('shakes')) return '🥤';
  if (cat.includes('offers')) return '🎁';
  if (cat.includes('extras')) return '➕';
  if (cat.includes('utility')) return '💧';
  
  return '🍴';
}

export function sendWhatsApp(phone: string, bill: Bill, settings?: CafeSettings): void {
  const message = generateBillMessage(bill, settings);
  // Clean phone number
  let cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '91' + cleanPhone.substring(1);
  }
  if (!cleanPhone.startsWith('91') && !cleanPhone.startsWith('+')) {
    cleanPhone = '91' + cleanPhone;
  }
  cleanPhone = cleanPhone.replace('+', '');

  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

export function shareWhatsAppNoNumber(bill: Bill, settings?: CafeSettings): void {
  const message = generateBillMessage(bill, settings);
  const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}
