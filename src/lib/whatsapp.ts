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

  let message = `🧾 *${s.cafeName}*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n`;
  message += `📋 Bill #${bill.billNumber}\n`;
  message += `📅 ${formatDate(bill.createdAt)} | ⏰ ${formatTime(bill.createdAt)}\n`;

  if (bill.customerName) {
    message += `👤 ${bill.customerName}\n`;
  }
  message += `🍽️ ${bill.orderType === 'dine-in' ? 'Dine-In' : 'Takeaway'}`;
  if (bill.tableNumber) message += ` | Table ${bill.tableNumber}`;
  message += `\n`;

  message += `━━━━━━━━━━━━━━━━━━━━\n`;
  message += `📝 *Order Details:*\n\n`;

  bill.items.forEach((item, idx) => {
    const total = item.price * item.quantity;
    message += `${idx + 1}. ${item.name}\n`;
    message += `   ${item.quantity} × ${formatCurrency(item.price, s.currency)} = ${formatCurrency(total, s.currency)}\n`;
  });

  message += `\n━━━━━━━━━━━━━━━━━━━━\n`;
  message += `Subtotal: ${formatCurrency(bill.subtotal, s.currency)}\n`;

  if (bill.discount > 0) {
    message += `Discount: -${formatCurrency(bill.discount, s.currency)}\n`;
  }

  message += `*💰 TOTAL: ${formatCurrency(bill.total, s.currency)}*\n`;
  message += `💳 Payment: ${bill.paymentMethod.toUpperCase()}\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  message += `${s.receiptFooter}\n`;
  message += `_Powered by ${s.developerName}_`;

  return message;
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
