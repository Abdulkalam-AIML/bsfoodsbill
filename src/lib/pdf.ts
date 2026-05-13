// ============================================
// BS FOODS - Premium PDF System
// High-fidelity thermal receipts & advanced reports
// ============================================

import jsPDF from 'jspdf';
import type { Bill, CafeSettings, DailyReport } from '@/types';
import { DEFAULT_SETTINGS } from '@/types';

const CURRENCY = '₹';

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

// ---- Premium Thermal Receipt (80mm) ----
export function generateThermalReceipt(bill: Bill, settings?: CafeSettings): jsPDF {
  const s = settings || DEFAULT_SETTINGS;
  const pageWidth = 80;
  // Dynamic height based on items
  const itemHeight = bill.items.length * 8;
  const pageHeight = 110 + itemHeight;
  
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [pageWidth, pageHeight],
  });

  let y = 10;
  const margin = 5;
  const innerWidth = pageWidth - (margin * 2);
  const centerX = pageWidth / 2;

  // Header / Logo
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('BS', centerX, y, { align: 'center' });
  y += 7;
  
  doc.setFontSize(16);
  doc.text(s.cafeName, centerX, y, { align: 'center' });
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(s.tagline, centerX, y, { align: 'center' });
  y += 8;

  // Info Section
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`Bill No: #${bill.billNumber}`, margin, y);
  doc.text(`Table: ${bill.tableNumber || '—'}`, pageWidth - margin, y, { align: 'right' });
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.text(`Customer: ${bill.customerName || 'Guest'}`, margin, y);
  y += 5;

  const date = new Date(bill.createdAt);
  const dateStr = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  
  doc.text(`Date: ${dateStr}`, margin, y);
  doc.text(`Time: ${timeStr}`, pageWidth - margin, y, { align: 'right' });
  y += 5;
  
  doc.text(`Type: ${bill.orderType.toUpperCase()}`, margin, y);
  y += 5;

  // Table Header
  y += 2;
  doc.setLineWidth(0.2);
  doc.line(margin, y, pageWidth - margin, y);
  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.text('ITEM', margin, y);
  doc.text('QTY', 42, y, { align: 'center' });
  doc.text('RATE', 58, y, { align: 'center' });
  doc.text('TOTAL', pageWidth - margin, y, { align: 'right' });
  y += 3;
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  // Items
  doc.setFont('helvetica', 'normal');
  bill.items.forEach((item) => {
    // If name is too long, split it
    const nameLines = doc.splitTextToSize(item.name, 35);
    doc.text(nameLines, margin, y);
    
    const qtyX = 42;
    const rateX = 58;
    const totalX = pageWidth - margin;
    
    doc.text(item.quantity.toString(), qtyX, y, { align: 'center' });
    doc.text(item.price.toFixed(0), rateX, y, { align: 'center' });
    doc.text((item.price * item.quantity).toFixed(0), totalX, y, { align: 'right' });
    
    y += (nameLines.length * 4) + 2;
  });

  // Totals Section
  y += 2;
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  doc.setFontSize(10);
  doc.text('Subtotal:', margin, y);
  doc.text(`Rs. ${bill.subtotal.toLocaleString()}`, pageWidth - margin, y, { align: 'right' });
  y += 6;

  if (bill.discount > 0) {
    doc.text('Discount:', margin, y);
    doc.text(`-Rs. ${bill.discount.toLocaleString()}`, pageWidth - margin, y, { align: 'right' });
    y += 6;
  }

  y += 1;
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Grand Total:', margin, y);
  doc.text(`Rs. ${bill.total.toLocaleString()}`, pageWidth - margin, y, { align: 'right' });
  y += 8;
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // Payment
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Payment: ${bill.paymentMethod.toUpperCase()}`, centerX, y, { align: 'center' });
  y += 12;

  // Footer
  doc.setFontSize(10);
  doc.text('🙏 Thank you for visiting BS FOODS!', centerX, y, { align: 'center' });
  y += 6;
  doc.setFontSize(9);
  doc.text('Visit Again ❤️', centerX, y, { align: 'center' });
  y += 10;

  doc.setFontSize(7);
  doc.setTextColor(100);
  doc.text(`Powered by ${s.developerName}`, centerX, y, { align: 'center' });

  return doc;
}

// ---- Advanced Daily Report PDF ----
export function generateDailyReportPDF(report: DailyReport, settings?: CafeSettings): jsPDF {
  const s = settings || DEFAULT_SETTINGS;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = 210;
  const margin = 20;
  let y = 20;

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(10, 14, 39);
  doc.text(s.cafeName, 105, y, { align: 'center' });
  y += 10;

  doc.setFontSize(16);
  doc.setTextColor(100);
  doc.text('DAILY SALES REPORT', 105, y, { align: 'center' });
  y += 8;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${formatDate(report.date)}`, 105, y, { align: 'center' });
  y += 15;

  // Summary Cards (Row 1)
  const cardWidth = 40;
  const cardGap = 10;
  let currentX = margin;

  const cards = [
    { label: 'Total Bills', value: report.totalBills, color: [0, 212, 255] },
    { label: 'Total Sales', value: `${CURRENCY}${report.totalSales.toLocaleString()}`, color: [16, 185, 129] },
    { label: 'Total Revenue', value: `${CURRENCY}${report.totalRevenue.toLocaleString()}`, color: [245, 158, 11] },
    { label: 'Total Discount', value: `${CURRENCY}${report.totalDiscount.toLocaleString()}`, color: [239, 68, 68] },
  ];

  cards.forEach((card) => {
    doc.setDrawColor(230);
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(currentX, y, cardWidth, 25, 2, 2, 'FD');
    
    // Color bar
    const [r, g, b] = card.color;
    doc.setFillColor(r, g, b);
    doc.rect(currentX, y, 2, 25, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(card.label.toUpperCase(), currentX + 5, y + 8);
    
    doc.setFontSize(12);
    doc.setTextColor(20);
    doc.text(card.value.toString(), currentX + 5, y + 18);

    currentX += cardWidth + cardGap;
  });

  y += 35;

  // Item Sales Table
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(10, 14, 39);
  doc.text('ITEM-WISE SALES', margin, y);
  y += 8;

  doc.setFillColor(10, 14, 39);
  doc.rect(margin, y, 170, 8, 'F');
  doc.setTextColor(255);
  doc.setFontSize(9);
  doc.text('ITEM NAME', margin + 5, y + 5.5);
  doc.text('QUANTITY SOLD', 100, y + 5.5, { align: 'center' });
  doc.text('REVENUE', 180, y + 5.5, { align: 'right' });
  y += 12;

  doc.setTextColor(40);
  doc.setFont('helvetica', 'normal');
  Object.entries(report.itemsSold).sort((a, b) => b[1] - a[1]).forEach(([name, qty], idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(245, 247, 250);
      doc.rect(margin, y - 4, 170, 8, 'F');
    }
    doc.text(name, margin + 5, y);
    doc.text(qty.toString(), 100, y, { align: 'center' });
    // Assuming revenue is handled elsewhere or just show qty
    // For now we just have qty in the report object
    y += 8;
  });

  y += 15;

  // Analytics Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(10, 14, 39);
  doc.text('PERFORMANCE ANALYTICS', margin, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Peak Sales Hour: ${report.peakHour}`, margin, y);
  y += 6;
  doc.text(`WhatsApp Bills Sent: ${report.whatsappCount}`, margin, y);
  y += 6;
  doc.text(`Physical Bills Printed: ${report.printCount}`, margin, y);
  y += 15;

  // Payment Methods
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYMENT METHODS', margin, y);
  y += 8;

  Object.entries(report.paymentMethods).forEach(([method, count]) => {
    doc.setFont('helvetica', 'normal');
    doc.text(`${method.toUpperCase()}:`, margin, y);
    doc.text(count.toString(), 60, y);
    y += 6;
  });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text(`Generated by BS FOODS Smart Billing | Powered by ${s.developerName}`, 105, 285, { align: 'center' });

  return doc;
}

// ---- Export Helpers ----
export function downloadThermalReceipt(bill: Bill, settings?: CafeSettings): void {
  const doc = generateThermalReceipt(bill, settings);
  doc.save(`BS-Bill-${bill.billNumber}.pdf`);
}

export function downloadReportPDF(report: DailyReport, settings?: CafeSettings): void {
  const doc = generateDailyReportPDF(report, settings);
  doc.save(`BS-Daily-Report-${report.date}.pdf`);
}

export function printBill(bill: Bill, settings?: CafeSettings): void {
  const doc = generateThermalReceipt(bill, settings);
  const blobUrl = doc.output('bloburl');
  window.open(blobUrl as unknown as string);
}
