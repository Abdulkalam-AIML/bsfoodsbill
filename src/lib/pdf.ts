// ============================================
// BS FOODS - Premium PDF System
// High-fidelity thermal receipts & advanced reports
// ============================================

import jsPDF from 'jspdf';
import type { Bill, CafeSettings, DailyReport } from '@/types';
import { DEFAULT_SETTINGS } from '@/types';
import { useStore } from '@/lib/store';

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

// ---- Helper functions for Monospace Receipt ----
function centerText(text: string, width = 42): string {
  const cleanText = text.replace(/[\u200B-\u200D\uFEFF]/g, ''); // strip zero-width chars
  if (cleanText.length >= width) return cleanText.substring(0, width);
  const totalSpaces = width - cleanText.length;
  const leftSpaces = Math.floor(totalSpaces / 2);
  const rightSpaces = totalSpaces - leftSpaces;
  return ' '.repeat(leftSpaces) + cleanText + ' '.repeat(rightSpaces);
}

function formatRow(left: string, right: string, width = 42): string {
  const cleanLeft = left.replace(/[\u200B-\u200D\uFEFF]/g, '');
  const cleanRight = right.replace(/[\u200B-\u200D\uFEFF]/g, '');
  const spaces = width - cleanLeft.length - cleanRight.length;
  if (spaces <= 0) return cleanLeft + ' ' + cleanRight;
  return cleanLeft + ' '.repeat(spaces) + cleanRight;
}

function formatReceiptItemRow(no: string, name: string, qty: string, rate: string, amount: string, width = 42): string[] {
  const cleanNo = no.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
  const cleanName = name.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
  const cleanQty = qty.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
  const cleanRate = rate.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
  const cleanAmount = amount.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();

  const noWidth = 3;
  const nameWidth = 19;
  const qtyWidth = 5;
  const rateWidth = 7;
  const amountWidth = 8;

  // Split name into words and wrap
  const words = cleanName.split(' ');
  let currentLine = '';
  const nameLines: string[] = [];
  
  words.forEach(word => {
    if (currentLine === '') {
      currentLine = word;
    } else if ((currentLine + ' ' + word).length <= nameWidth) {
      currentLine += ' ' + word;
    } else {
      nameLines.push(currentLine);
      currentLine = word;
    }
  });
  if (currentLine) {
    nameLines.push(currentLine);
  }
  
  if (nameLines.length === 0) {
    nameLines.push('');
  }

  // Format Qty centered
  let qtyFormatted = cleanQty;
  if (cleanQty.length < qtyWidth) {
    const totalSpaces = qtyWidth - cleanQty.length;
    const leftSpaces = Math.floor(totalSpaces / 2);
    qtyFormatted = ' '.repeat(leftSpaces) + cleanQty + ' '.repeat(totalSpaces - leftSpaces);
  }

  const rows: string[] = [];
  
  // Format the first line with all columns
  rows.push(
    cleanNo.padEnd(noWidth, ' ') + 
    nameLines[0].padEnd(nameWidth, ' ') + 
    qtyFormatted + 
    cleanRate.padStart(rateWidth, ' ') + 
    cleanAmount.padStart(amountWidth, ' ')
  );
  
  // Format subsequent lines (only containing the wrapped name)
  for (let i = 1; i < nameLines.length; i++) {
    rows.push(
      ' '.repeat(noWidth) + 
      nameLines[i].padEnd(nameWidth, ' ') + 
      ' '.repeat(qtyWidth + rateWidth + amountWidth)
    );
  }
  
  return rows;
}

function wrapText(text: string, width = 42): string[] {
  const cleanText = text.replace(/[\u200B-\u200D\uFEFF]/g, '');
  const words = cleanText.split(' ');
  const lines: string[] = [];
  let current = '';
  words.forEach(w => {
    if ((current + ' ' + w).trim().length <= width) {
      current = (current + ' ' + w).trim();
    } else {
      if (current) lines.push(current);
      current = w;
    }
  });
  if (current) lines.push(current);
  return lines;
}

function drawHeart(doc: jsPDF, x: number, y: number, size = 3) {
  doc.setFillColor(239, 68, 68);
  doc.setDrawColor(239, 68, 68);
  const r = size / 4;
  doc.ellipse(x - r, y - r, r, r, 'F');
  doc.ellipse(x + r, y - r, r, r, 'F');
  doc.triangle(
    x - 2 * r, y - r / 2,
    x + 2 * r, y - r / 2,
    x, y + size / 2,
    'F'
  );
}

// ---- Premium Thermal Receipt (80mm) ----
export function generateThermalReceipt(bill: Bill, settings?: CafeSettings): jsPDF {
  const s = settings || DEFAULT_SETTINGS;
  const pageWidth = 80;
  
  // Dynamic Cashier Retrieval
  const cashierRole = useStore.getState().userRole;
  const cashierName = cashierRole ? cashierRole.charAt(0).toUpperCase() + cashierRole.slice(1) : 'Staff';
  
  const lines: string[] = [];
  
  // Header Info
  lines.push(centerText(s.cafeName, 42));
  if (s.address) {
    const addressLines = wrapText(s.address, 42);
    addressLines.forEach(l => lines.push(centerText(l, 42)));
  }
  if (s.phone) {
    lines.push(centerText(`Mo : ${s.phone}`, 42));
  }
  
  // Double rule
  lines.push('==========================================');
  
  // Name
  lines.push(`Name: ${bill.customerName || ''}`);
  
  // Single rule
  lines.push('------------------------------------------');
  
  // Date, Time, Order Type
  const date = new Date(bill.createdAt);
  const dateStr = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  
  lines.push(formatRow(`Date: ${dateStr} ${timeStr}`, bill.orderType.toUpperCase(), 42));
  
  // Cashier and Bill Number (Tbl if Dine-In)
  const tblInfo = bill.orderType === 'dine-in' ? ` (Tbl ${bill.tableNumber})` : '';
  lines.push(formatRow(`Cashier: ${cashierName}${tblInfo}`, `Bill No: ${bill.billNumber}`, 42));
  
  // Single rule
  lines.push('------------------------------------------');
  
  // Item Table Header
  lines.push(formatReceiptItemRow('No.', 'Item', 'Qty', 'Rate', 'Amount', 42)[0]);
  
  // Single rule
  lines.push('------------------------------------------');
  
  // Item rows
  let totalQty = 0;
  bill.items.forEach((item, index) => {
    totalQty += item.quantity;
    const rateStr = item.price.toFixed(2);
    const amtStr = (item.price * item.quantity).toFixed(2);
    const itemRows = formatReceiptItemRow((index + 1).toString(), item.name, item.quantity.toString(), rateStr, amtStr, 42);
    itemRows.forEach(r => lines.push(r));
  });
  
  // Single rule
  lines.push('------------------------------------------');
  
  // Total Section
  lines.push(formatRow(`Total Qty: ${totalQty}`, `Subtotal: ${bill.subtotal.toFixed(2)}`, 42));
  
  const isOffer = bill.discountType === 'fixed' && (bill.discountValue === 99 || bill.discountValue === 150);
  if (bill.discount > 0) {
    if (isOffer) {
      lines.push(formatRow('', `Offer Discount: -${bill.discount.toFixed(2)}`, 42));
    } else {
      const discPercent = bill.discountType === 'percentage' ? ` (${bill.discountValue}%)` : '';
      lines.push(formatRow('', `Discount${discPercent}: -${bill.discount.toFixed(2)}`, 42));
    }
  }
  
  // Double rule
  lines.push('==========================================');
  lines.push(formatRow('GRAND TOTAL', `₹${bill.total.toFixed(2)}`, 42));
  lines.push('------------------------------------------');
  lines.push(formatRow('Payment Method', bill.paymentMethod.toUpperCase(), 42));
  lines.push('------------------------------------------');
  
  // Footer
  lines.push(centerText('Thank You For Visiting!', 42));
  lines.push(centerText('Visit Again', 42));
  lines.push('------------------------------------------');
  lines.push(centerText('Powered By', 42));
  lines.push(centerText(s.developerName || 'NexLayer Private Limited', 42));

  const lineCount = lines.length;
  const lineSpacing = 3.2; // mm per line
  const margin = 4.5; // mm left margin (fits 42 chars width at 8pt Courier)
  const topBottomMargin = 5; // mm total margins
  const pageHeight = ((lineCount - 1) * lineSpacing) + topBottomMargin;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [pageWidth, pageHeight],
  });

  // Set Courier Font
  doc.setFont('courier', 'normal');
  doc.setFontSize(8); // Reduced to 8pt to fit 42 columns perfectly on 80mm
  
  let y = 3.5;
  lines.forEach(line => {
    // Check if it's the GRAND TOTAL row, Cafe Name, or rules to style in bold
    const isBold = line.startsWith('GRAND TOTAL') || 
                   line.includes('==========================================') || 
                   line.includes('------------------------------------------') || 
                   line.includes(s.cafeName.substring(0, 10));
    
    if (isBold) {
      doc.setFont('courier', 'bold');
    } else {
      doc.setFont('courier', 'normal');
    }
    
    doc.text(line, margin, y);
    
    // Draw heart icon if this is the "Visit Again" line
    if (line.includes('Visit Again')) {
      // Place red heart at x = 52.0 mm, y = y - 1.0 mm
      drawHeart(doc, 52.0, y - 1.0, 2.5);
    }
    
    y += lineSpacing;
  });

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
    const revenue = report.itemsRevenue?.[name] || 0;
    doc.text(`${s.currency}${revenue.toLocaleString('en-IN')}`, 180, y, { align: 'right' });
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
  doc.text(`Kitchen Tickets Printed: ${report.kitchenTicketsPrinted || 0}`, margin, y);
  y += 6;
  doc.text(`Customer Bills Printed: ${report.customerBillsPrinted || 0}`, margin, y);
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

// ---- KOT Receipt (80mm) ----
export function generateKOTReceipt(bill: Bill, settings?: CafeSettings): jsPDF {
  const s = settings || DEFAULT_SETTINGS;
  const pageWidth = 80;
  
  const lines: string[] = [];
  lines.push('------------------------------------------------');
  lines.push(centerText(s.cafeName.toUpperCase(), 48));
  lines.push(centerText('KITCHEN ORDER TICKET', 48));
  lines.push('------------------------------------------------');
  
  lines.push(`TABLE: ${bill.tableNumber || 'Takeaway'}`);
  const timeStr = formatTime(bill.createdAt).toUpperCase();
  lines.push(`TIME: ${timeStr}`);
  lines.push('------------------------------------------------');
  
  bill.items.forEach((item, index) => {
    lines.push(`${item.quantity} x ${item.name}`);
    if (index < bill.items.length - 1) {
      lines.push('');
    }
  });
  
  lines.push('------------------------------------------------');
  lines.push(`Print Time: ${timeStr}`);
  lines.push('------------------------------------------------');

  const lineCount = lines.length;
  const lineSpacing = 3.6; // mm per line
  const margin = 2; // mm left margin
  const topBottomMargin = 6; // mm total margins
  const pageHeight = ((lineCount - 1) * lineSpacing) + topBottomMargin;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [pageWidth, pageHeight],
  });

  doc.setFont('courier', 'bold');
  doc.setFontSize(9);
  
  let y = 4.5;
  lines.forEach(line => {
    doc.text(line, margin, y);
    y += lineSpacing;
  });

  return doc;
}

// ---- Export Helpers ----
export function downloadThermalReceipt(bill: Bill, settings?: CafeSettings): void {
  const doc = generateThermalReceipt(bill, settings);
  doc.save(`BS-Bill-${bill.billNumber}.pdf`);
}

export function downloadKOTReceipt(bill: Bill, settings?: CafeSettings): void {
  const doc = generateKOTReceipt(bill, settings);
  doc.save(`BS-KOT-${bill.billNumber}.pdf`);
}

export function downloadReportPDF(report: DailyReport, settings?: CafeSettings): void {
  const doc = generateDailyReportPDF(report, settings);
  doc.save(`BS-Daily-Report-${report.date}.pdf`);
}

export function printPDFViaIframe(doc: jsPDF): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);
    
    const blob = doc.output('blob');
    const blobUrl = URL.createObjectURL(blob);
    iframe.src = blobUrl;
    
    iframe.onload = () => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (e) {
        console.error('Failed to print via iframe', e);
        // Fallback
        const newTab = window.open(blobUrl, '_blank');
        if (newTab) newTab.focus();
      }
      setTimeout(() => {
        document.body.removeChild(iframe);
        URL.revokeObjectURL(blobUrl);
        resolve();
      }, 1500);
    };
  });
}

function getKOTHtml(bill: Bill, s: CafeSettings): string {
  const timeStr = formatTime(bill.createdAt).toUpperCase();
  
  return `
    <div class="kot" style="font-family: monospace !important; font-size: 11px; line-height: 1.25; padding: 2mm; padding-left: 4mm; margin: 0 auto; box-sizing: border-box; width: 76mm; text-align: left; overflow: visible;">
      <div class="receipt-single-line"></div>
      
      <div class="bold-text" style="text-align: center; font-size: 12px; margin: 2px 0 1px 0;">${s.cafeName.toUpperCase()}</div>
      <div class="bold-text" style="text-align: center; font-size: 12px; margin: 1px 0 2px 0;">KITCHEN ORDER TICKET</div>
      
      <div class="receipt-single-line"></div>
      
      <div class="bold-text" style="font-size: 12px; margin: 4px 0 2px 0; text-transform: uppercase;">TABLE: ${bill.tableNumber || 'Takeaway'}</div>
      <div class="bold-text" style="font-size: 12px; margin: 2px 0 4px 0; text-transform: uppercase;">TIME: ${timeStr}</div>
      
      <div class="receipt-single-line"></div>
      
      <div style="margin: 4px 0;">
        ${bill.items.map(item => `
          <div class="bold-text" style="font-size: 11px; margin: 6px 0; word-break: break-word; overflow-wrap: break-word; white-space: normal;">
            ${item.quantity} x ${item.name}
          </div>
        `).join('')}
      </div>
      
      <div class="receipt-single-line"></div>
      
      <div class="bold-text" style="font-size: 11px; margin: 4px 0;">
        Print Time: ${timeStr}
      </div>
      
      <div class="receipt-single-line"></div>
    </div>
  `;
}

function getCustomerReceiptHtml(bill: Bill, s: CafeSettings): string {
  const dateStr = formatDate(bill.createdAt);
  const timeStr = formatTime(bill.createdAt).toUpperCase();
  
  // Dynamic Cashier Retrieval
  const cashierRole = useStore.getState().userRole;
  const cashierName = cashierRole ? cashierRole.charAt(0).toUpperCase() + cashierRole.slice(1) : 'Staff';
  
  const totalQty = bill.items.reduce((sum, item) => sum + item.quantity, 0);
  const isOffer = bill.discountType === 'fixed' && (bill.discountValue === 99 || bill.discountValue === 150);

  const tblInfo = bill.orderType === 'dine-in' ? ` (Tbl ${bill.tableNumber})` : '';

  return `
    <div class="receipt" style="font-family: monospace !important; font-size: 11px; line-height: 1.25; padding: 2mm; padding-left: 4mm; margin: 0 auto; box-sizing: border-box; width: 76mm; text-align: left; word-break: break-word; overflow: visible;">
      <!-- Header -->
      <div class="bold-text" style="text-align: center; font-size: 12px; margin: 2px 0 1px 0;">${s.cafeName.toUpperCase()}</div>
      ${s.address ? `<div style="text-align: center; font-size: 11px; line-height: 1.2; margin: 1px 0;">${s.address}</div>` : ''}
      ${s.phone ? `<div style="text-align: center; font-size: 11px; margin: 1px 0;">Mo: ${s.phone}</div>` : ''}
      
      <div class="receipt-double-line"></div>
      
      <!-- Customer Info -->
      <div class="bold-text" style="margin: 2px 0; font-size: 11px;">Name: ${bill.customerName || ''}</div>
      
      <div class="receipt-single-line"></div>
      
      <!-- Bill Meta Info -->
      <div class="bold-text" style="display: flex; justify-content: space-between; margin: 2px 0; font-size: 11px;">
        <span>Date: ${dateStr} ${timeStr}</span>
        <span>${bill.orderType.toUpperCase()}</span>
      </div>
      <div class="bold-text" style="display: flex; justify-content: space-between; margin: 2px 0; font-size: 11px;">
        <span>Cashier: ${cashierName}${tblInfo}</span>
        <span>Bill No: ${bill.billNumber}</span>
      </div>
      
      <div class="receipt-single-line"></div>
      
      <!-- Items Table -->
      <table class="receipt-table" style="font-size: 11px;">
        <thead>
          <tr class="bold-text" style="font-size: 12px;">
            <th style="width: 40%; text-align: left;">Item</th>
            <th style="width: 15%; text-align: center;">Qty</th>
            <th style="width: 20%; text-align: right;">Rate</th>
            <th style="width: 25%; text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${bill.items.map((item) => `
            <tr class="bold-text" style="font-weight: 700; font-size: 11px;">
              <td style="text-align: left; width: 40%; white-space: normal; word-break: break-word; overflow-wrap: break-word;">${item.name}</td>
              <td style="text-align: center; width: 15%;">${item.quantity}</td>
              <td style="text-align: right; width: 20%;">${item.price.toFixed(2)}</td>
              <td style="text-align: right; width: 25%;">${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="receipt-single-line"></div>
      
      <!-- Totals Section -->
      <div class="bold-text" style="display: flex; justify-content: space-between; margin: 2px 0; font-size: 11px;">
        <span>Total Qty: ${totalQty}</span>
        <span>Subtotal: ₹${bill.subtotal.toFixed(2)}</span>
      </div>
      
      ${bill.discount > 0 ? `
        <div class="bold-text" style="display: flex; justify-content: space-between; margin: 2px 0; font-size: 11px;">
          <span></span>
          <span>
            ${isOffer ? 'Offer Discount' : `Discount${bill.discountType === 'percentage' ? ` (${bill.discountValue}%)` : ''}`}: 
            -₹${bill.discount.toFixed(2)}
          </span>
        </div>
      ` : ''}
      
      <div class="receipt-double-line"></div>
      
      <!-- Grand Total -->
      <div class="bold-text" style="display: flex; justify-content: space-between; font-size: 13px; margin: 4px 0;">
        <span>GRAND TOTAL</span>
        <span>₹${bill.total.toFixed(2)}</span>
      </div>
      
      <div class="receipt-single-line"></div>
      
      <div class="bold-text" style="display: flex; justify-content: space-between; margin: 2px 0; font-size: 11px;">
        <span>Payment Method:</span>
        <span>${bill.paymentMethod.toUpperCase()}</span>
      </div>
      
      <div class="receipt-single-line"></div>
      
      <!-- Footer -->
      <div class="bold-text" style="text-align: center; line-height: 1.3; margin-top: 4px; font-size: 11px;">
        <div>Thank You For Visiting!</div>
        <div style="font-size: 11px; margin-top: 1px;">Visit Again ❤️</div>
        <div style="font-size: 8.5px; font-weight: normal; margin-top: 4px; color: #000000 !important; line-height: 1.2;">
          Powered By<br/>
          <strong>NexLayer Private Limited</strong>
        </div>
      </div>
    </div>
  `;
}

export async function printBill(
  bill: Bill,
  settings?: CafeSettings,
  options?: { printKOT?: boolean; printCustomer?: boolean }
): Promise<void> {
  if (typeof window === 'undefined') return;

  const opts = options || { printKOT: true, printCustomer: true };
  const s = settings || DEFAULT_SETTINGS;

  // Fallback to PDF if printing function is not supported natively
  if (typeof window.print !== 'function') {
    if (opts.printKOT) {
      const kotDoc = generateKOTReceipt(bill, settings);
      await printPDFViaIframe(kotDoc);
    }
    if (opts.printCustomer) {
      const customerDoc = generateThermalReceipt(bill, settings);
      await printPDFViaIframe(customerDoc);
    }
    return;
  }

  // 1. Build receipt(s) HTML
  let html = '';
  if (opts.printKOT) {
    html += getKOTHtml(bill, s);
  }
  if (opts.printKOT && opts.printCustomer) {
    html += '<div class="page-break"></div>';
  }
  if (opts.printCustomer) {
    html += getCustomerReceiptHtml(bill, s);
  }

  // 2. Append print container to document body
  const container = document.createElement('div');
  container.id = 'thermal-print-container';
  container.innerHTML = html;
  document.body.appendChild(container);

  // 3. Pause briefly to guarantee browser layout engines complete rendering
  await new Promise((resolve) => setTimeout(resolve, 50));

  // Debug Sizing Logs
  try {
    const pContainer = document.getElementById('thermal-print-container');
    if (pContainer) {
      console.log('=== THERMAL PRINT DEBUG ===');
      console.log('Container Offset Width:', pContainer.offsetWidth + 'px (' + (pContainer.offsetWidth * 0.264583).toFixed(1) + 'mm)');
      const receiptEl = pContainer.querySelector('.receipt');
      if (receiptEl) {
        console.log('Receipt Wrapper Width:', (receiptEl as HTMLElement).offsetWidth + 'px (' + ((receiptEl as HTMLElement).offsetWidth * 0.264583).toFixed(1) + 'mm)');
      }
      const kotEl = pContainer.querySelector('.kot');
      if (kotEl) {
        console.log('KOT Wrapper Width:', (kotEl as HTMLElement).offsetWidth + 'px (' + ((kotEl as HTMLElement).offsetWidth * 0.264583).toFixed(1) + 'mm)');
      }
      console.log('===========================');
    }
  } catch (logErr) {
    console.error('Failed to log print sizing metrics', logErr);
  }

  // 4. Trigger browser print interface
  try {
    window.print();
  } catch (err) {
    console.error('HTML print failed, falling back to PDF printing', err);
    if (opts.printKOT) {
      const kotDoc = generateKOTReceipt(bill, settings);
      await printPDFViaIframe(kotDoc);
    }
    if (opts.printCustomer) {
      const customerDoc = generateThermalReceipt(bill, settings);
      await printPDFViaIframe(customerDoc);
    }
  } finally {
    // 5. Clean up DOM by removing the container
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}
