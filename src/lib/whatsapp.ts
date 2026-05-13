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

  let message = `🍽️ *${s.cafeName}*\n\n`;
  message += `━━━━━━━━━━━━━━\n\n`;
  message += `🧾 *Bill #${bill.billNumber}*\n`;
  if (bill.tableNumber) message += `🪑 Table: ${bill.tableNumber}\n`;
  message += `📅 ${dateStr}\n`;
  message += `⏰ ${timeStr}\n`;
  message += `🍴 ${bill.orderType.toUpperCase()}\n\n`;
  message += `━━━━━━━━━━━━━━\n\n`;

  bill.items.forEach((item) => {
    message += `${getEmojiForCategory(item.category)} ${item.name}\n`;
    message += `${item.quantity} × ₹${item.price} = ₹${item.price * item.quantity}\n\n`;
  });

  message += `━━━━━━━━━━━━━━\n\n`;
  message += `💰 Subtotal: ₹${bill.subtotal}\n`;
  if (bill.discount > 0) message += `🎁 Discount: ₹${bill.discount}\n`;
  message += `✅ *TOTAL: ₹${bill.total}*\n\n`;
  message += `💳 Payment: ${bill.paymentMethod.toUpperCase()}\n\n`;
  message += `━━━━━━━━━━━━━━\n\n`;
  message += `🙏 Thank you for visiting BS FOODS!\n\n`;
  message += `✨ Powered by ${s.developerName}`;

  return message;
}

function getEmojiForCategory(category: string): string {
  if (category.includes('Mocktails')) return '🍹';
  if (category.includes('Desserts')) return '🍦';
  if (category.includes('Chai')) return '☕';
  if (category.includes('Pizza')) return '🍕';
  if (category.includes('Sandwich')) return '🥪';
  if (category.includes('Snacks')) return '🍔';
  if (category.includes('Shakes')) return '🥤';
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
