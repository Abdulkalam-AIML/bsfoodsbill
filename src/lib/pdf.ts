// ============================================
// BS FOODS - PDF Receipt Generator
// Uses jsPDF for thermal & A4 receipts
// ============================================

import jsPDF from 'jspdf';
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

// ---- Thermal Receipt (80mm width) ----
export function generateThermalReceipt(bill: Bill, settings?: CafeSettings): jsPDF {
  const s = settings || DEFAULT_SETTINGS;
  const pageWidth = 80;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [pageWidth, 200],
  });

  let y = 8;
  const leftMargin = 4;
  const rightMargin = pageWidth - 4;
  const centerX = pageWidth / 2;

  // Header
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(s.cafeName, centerX, y, { align: 'center' });
  y += 5;

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(s.tagline, centerX, y, { align: 'center' });
  y += 4;

  if (s.address) {
    doc.text(s.address, centerX, y, { align: 'center' });
    y += 3;
  }
  if (s.phone) {
    doc.text(`Ph: ${s.phone}`, centerX, y, { align: 'center' });
    y += 3;
  }

  // Divider
  y += 1;
  doc.setLineWidth(0.3);
  doc.setDrawColor(150);
  doc.line(leftMargin, y, rightMargin, y);
  y += 4;

  // Bill info
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(`Bill #${bill.billNumber}`, leftMargin, y);
  doc.text(bill.orderType.toUpperCase(), rightMargin, y, { align: 'right' });
  y += 4;

  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${formatDate(bill.createdAt)}`, leftMargin, y);
  doc.text(`Time: ${formatTime(bill.createdAt)}`, rightMargin, y, { align: 'right' });
  y += 4;

  if (bill.customerName) {
    doc.text(`Customer: ${bill.customerName}`, leftMargin, y);
    y += 3.5;
  }
  if (bill.customerPhone) {
    doc.text(`Phone: ${bill.customerPhone}`, leftMargin, y);
    y += 3.5;
  }
  if (bill.tableNumber && bill.orderType === 'dine-in') {
    doc.text(`Table: ${bill.tableNumber}`, leftMargin, y);
    y += 3.5;
  }

  // Divider
  y += 1;
  doc.line(leftMargin, y, rightMargin, y);
  y += 4;

  // Column headers
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('Item', leftMargin, y);
  doc.text('Qty', 48, y, { align: 'center' });
  doc.text('Price', 60, y, { align: 'center' });
  doc.text('Total', rightMargin, y, { align: 'right' });
  y += 3;
  doc.line(leftMargin, y, rightMargin, y);
  y += 4;

  // Items
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  bill.items.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    const name = item.name.length > 22 ? item.name.substring(0, 22) + '…' : item.name;
    doc.text(name, leftMargin, y);
    doc.text(`${item.quantity}`, 48, y, { align: 'center' });
    doc.text(formatCurrency(item.price, s.currency), 60, y, { align: 'center' });
    doc.text(formatCurrency(itemTotal, s.currency), rightMargin, y, { align: 'right' });
    y += 4;
  });

  // Divider
  doc.line(leftMargin, y, rightMargin, y);
  y += 4;

  // Subtotal
  doc.setFontSize(8);
  doc.text('Subtotal:', leftMargin, y);
  doc.text(formatCurrency(bill.subtotal, s.currency), rightMargin, y, { align: 'right' });
  y += 4;

  // Discount
  if (bill.discount > 0) {
    doc.text('Discount:', leftMargin, y);
    doc.text(`-${formatCurrency(bill.discount, s.currency)}`, rightMargin, y, {
      align: 'right',
    });
    y += 4;
  }

  // Total
  doc.line(leftMargin, y, rightMargin, y);
  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('TOTAL:', leftMargin, y);
  doc.text(formatCurrency(bill.total, s.currency), rightMargin, y, { align: 'right' });
  y += 4;
  doc.line(leftMargin, y, rightMargin, y);
  y += 5;

  // Payment method
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(`Payment: ${bill.paymentMethod.toUpperCase()}`, centerX, y, { align: 'center' });
  y += 6;

  // Footer
  doc.setFontSize(8);
  doc.text(s.receiptFooter, centerX, y, { align: 'center', maxWidth: pageWidth - 10 });
  y += 8;

  doc.setFontSize(6);
  doc.setTextColor(130);
  doc.text(`Powered by ${s.developerName}`, centerX, y, { align: 'center' });

  return doc;
}

// ---- A4 Invoice ----
export function generateA4Invoice(bill: Bill, settings?: CafeSettings): jsPDF {
  const s = settings || DEFAULT_SETTINGS;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = 210;
  const leftMargin = 20;
  const rightMargin = pageWidth - 20;
  let y = 25;

  // Header
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(10, 14, 39);
  doc.text(s.cafeName, pageWidth / 2, y, { align: 'center' });
  y += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  doc.text(s.tagline, pageWidth / 2, y, { align: 'center' });
  y += 12;

  // Bill details box
  doc.setDrawColor(0, 212, 255);
  doc.setLineWidth(0.5);
  doc.roundedRect(leftMargin, y, rightMargin - leftMargin, 28, 3, 3);

  doc.setFontSize(9);
  doc.setTextColor(60);
  doc.setFont('helvetica', 'bold');
  doc.text(`INVOICE #BSF-${bill.billNumber}`, leftMargin + 5, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${formatDate(bill.createdAt)}`, leftMargin + 5, y + 13);
  doc.text(`Time: ${formatTime(bill.createdAt)}`, leftMargin + 5, y + 19);
  doc.text(`Type: ${bill.orderType.toUpperCase()}`, leftMargin + 5, y + 25);

  if (bill.customerName) {
    doc.text(`Customer: ${bill.customerName}`, rightMargin - 70, y + 7);
  }
  if (bill.customerPhone) {
    doc.text(`Phone: ${bill.customerPhone}`, rightMargin - 70, y + 13);
  }
  if (bill.tableNumber) {
    doc.text(`Table: ${bill.tableNumber}`, rightMargin - 70, y + 19);
  }
  doc.text(`Payment: ${bill.paymentMethod.toUpperCase()}`, rightMargin - 70, y + 25);

  y += 36;

  // Table header
  doc.setFillColor(10, 14, 39);
  doc.roundedRect(leftMargin, y, rightMargin - leftMargin, 8, 1, 1, 'F');
  doc.setTextColor(255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('S.No', leftMargin + 5, y + 5.5);
  doc.text('Item Name', leftMargin + 20, y + 5.5);
  doc.text('Qty', 120, y + 5.5, { align: 'center' });
  doc.text('Price', 145, y + 5.5, { align: 'center' });
  doc.text('Amount', rightMargin - 5, y + 5.5, { align: 'right' });
  y += 12;

  // Table rows
  doc.setTextColor(40);
  doc.setFont('helvetica', 'normal');
  bill.items.forEach((item, idx) => {
    const itemTotal = item.price * item.quantity;
    if (idx % 2 === 0) {
      doc.setFillColor(245, 247, 250);
      doc.rect(leftMargin, y - 4, rightMargin - leftMargin, 8, 'F');
    }
    doc.text(`${idx + 1}`, leftMargin + 5, y);
    doc.text(item.name, leftMargin + 20, y);
    doc.text(`${item.quantity}`, 120, y, { align: 'center' });
    doc.text(formatCurrency(item.price, s.currency), 145, y, { align: 'center' });
    doc.text(formatCurrency(itemTotal, s.currency), rightMargin - 5, y, { align: 'right' });
    y += 8;
  });

  y += 4;
  doc.setDrawColor(200);
  doc.line(120, y, rightMargin, y);
  y += 8;

  // Totals
  doc.setFontSize(10);
  doc.text('Subtotal:', 130, y);
  doc.text(formatCurrency(bill.subtotal, s.currency), rightMargin - 5, y, { align: 'right' });
  y += 7;

  if (bill.discount > 0) {
    doc.setTextColor(220, 50, 50);
    doc.text('Discount:', 130, y);
    doc.text(`-${formatCurrency(bill.discount, s.currency)}`, rightMargin - 5, y, {
      align: 'right',
    });
    y += 7;
    doc.setTextColor(40);
  }

  doc.setDrawColor(0, 212, 255);
  doc.setLineWidth(0.8);
  doc.line(120, y, rightMargin, y);
  y += 8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('TOTAL:', 130, y);
  doc.text(formatCurrency(bill.total, s.currency), rightMargin - 5, y, { align: 'right' });
  y += 20;

  // Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(s.receiptFooter, pageWidth / 2, y, { align: 'center' });
  y += 12;

  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text(`Powered by ${s.developerName}`, pageWidth / 2, y, { align: 'center' });

  return doc;
}

// ---- Download helpers ----
export function downloadReceipt(bill: Bill, settings?: CafeSettings): void {
  const doc = generateThermalReceipt(bill, settings);
  doc.save(`BS-Foods-Bill-${bill.billNumber}.pdf`);
}

export function downloadInvoice(bill: Bill, settings?: CafeSettings): void {
  const doc = generateA4Invoice(bill, settings);
  doc.save(`BS-Foods-Invoice-${bill.billNumber}.pdf`);
}

export function printReceipt(bill: Bill, settings?: CafeSettings): void {
  const doc = generateThermalReceipt(bill, settings);
  const blobUrl = doc.output('bloburl');
  const printWindow = window.open(blobUrl as unknown as string);
  if (printWindow) {
    printWindow.addEventListener('load', () => {
      printWindow.print();
    });
  }
}
