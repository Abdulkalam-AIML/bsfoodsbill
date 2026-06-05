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

// ---- Helper functions for Monospace Receipt ----
function centerText(text: string, width = 32): string {
  const cleanText = text.replace(/[\u200B-\u200D\uFEFF]/g, ''); // strip zero-width chars
  if (cleanText.length >= width) return cleanText.substring(0, width);
  const totalSpaces = width - cleanText.length;
  const leftSpaces = Math.floor(totalSpaces / 2);
  const rightSpaces = totalSpaces - leftSpaces;
  return ' '.repeat(leftSpaces) + cleanText + ' '.repeat(rightSpaces);
}

function formatRow(left: string, right: string, width = 32): string {
  const cleanLeft = left.replace(/[\u200B-\u200D\uFEFF]/g, '');
  const cleanRight = right.replace(/[\u200B-\u200D\uFEFF]/g, '');
  const spaces = width - cleanLeft.length - cleanRight.length;
  if (spaces <= 0) return cleanLeft + ' ' + cleanRight;
  return cleanLeft + ' '.repeat(spaces) + cleanRight;
}

function formatItemRows(name: string, qty: string, amount: string, width = 32): string[] {
  const cleanName = name.replace(/[\u200B-\u200D\uFEFF]/g, '');
  const cleanQty = qty.replace(/[\u200B-\u200D\uFEFF]/g, '');
  const cleanAmount = amount.replace(/[\u200B-\u200D\uFEFF]/g, '');
  
  const maxNameLen = 17;
  const rows: string[] = [];
  
  // Split name into words and wrap
  const words = cleanName.split(' ');
  let currentLine = '';
  const nameLines: string[] = [];
  
  words.forEach(word => {
    if (currentLine === '') {
      currentLine = word;
    } else if ((currentLine + ' ' + word).length <= maxNameLen) {
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
  
  // Format the first line with QTY and AMOUNT
  rows.push(
    nameLines[0].padEnd(18, ' ') + 
    cleanQty.padStart(4, ' ') + 
    cleanAmount.padStart(10, ' ')
  );
  
  // Format subsequent lines (just the item name, padded to 32)
  for (let i = 1; i < nameLines.length; i++) {
    rows.push(nameLines[i].padEnd(32, ' '));
  }
  
  return rows;
}

function wrapText(text: string, width = 32): string[] {
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
  
  // Generate all text lines first to determine page height
  const lines: string[] = [];
  
  lines.push(centerText(s.cafeName, 32));
  
  if (s.tagline) {
    const taglineLines = wrapText(s.tagline, 32);
    taglineLines.forEach(tl => {
      lines.push(centerText(tl, 32));
    });
  }
  lines.push('--------------------------------');
  lines.push(formatRow(`Bill No: #${bill.billNumber}`, `Table: ${bill.tableNumber || '1'}`, 32));
  
  const date = new Date(bill.createdAt);
  const dateStr = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  lines.push(formatRow(`Date: ${dateStr}`, `Time: ${timeStr}`, 32));
  lines.push('--------------------------------');
  lines.push(formatItemRows('ITEM', 'QTY', 'AMOUNT', 32)[0]);
  lines.push('--------------------------------');
  
  bill.items.forEach(item => {
    const amtStr = `Rs. ${item.price * item.quantity}`;
    const itemRows = formatItemRows(item.name, item.quantity.toString(), amtStr, 32);
    itemRows.forEach(r => lines.push(r));
  });
  
  lines.push('--------------------------------');
  lines.push(formatRow('Subtotal', `Rs. ${bill.subtotal}`, 32));
  if (bill.discount > 0) {
    lines.push(formatRow('Discount', `Rs. ${bill.discount}`, 32));
  }
  lines.push('--------------------------------');
  lines.push(formatRow('TOTAL', `Rs. ${bill.total}`, 32));
  lines.push('--------------------------------');
  lines.push(formatRow('Payment Method', bill.paymentMethod.toUpperCase(), 32));
  lines.push('--------------------------------');
  lines.push(centerText('Thank You For Visiting', 32));
  lines.push(centerText('Visit Again', 32));
  lines.push('--------------------------------');
  lines.push(centerText('Powered By', 32));
  lines.push(centerText(s.developerName || 'NexLayer Private Limited', 32));

  const lineCount = lines.length;
  const lineSpacing = 3.6; // mm per line (20% reduction from 4.5)
  const margin = 5; // mm left margin
  const topBottomMargin = 8; // 4mm top and 4mm bottom margin
  const pageHeight = ((lineCount - 1) * lineSpacing) + topBottomMargin;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [pageWidth, pageHeight],
  });

  // Set Courier Font
  doc.setFont('courier', 'normal');
  doc.setFontSize(10);
  
  let y = 4; // Start at 4mm top margin
  lines.forEach(line => {
    // Check if it's the TOTAL row or headers to style in bold
    const isBold = line.startsWith('TOTAL') || 
                   line.includes('================================') || 
                   line.includes('--------------------------------') || 
                   line.includes(s.cafeName.substring(0, 10));
    
    if (isBold) {
      doc.setFont('courier', 'bold');
    } else {
      doc.setFont('courier', 'normal');
    }
    
    doc.text(line, margin, y);
    
    // Draw heart icon if this is the "Visit Again" line
    if (line.includes('Visit Again')) {
      // "Visit Again" is 11 chars. Centered in 32 chars: starts at index 10.
      // 10 chars offset = 10 * 2.116 mm = 21.16 mm.
      // Text starts at margin + 21.16 mm = 26.16 mm.
      // Text ends at 26.16 + (11 * 2.116) = 49.43 mm.
      // Place red heart at x = 52.5 mm, y = y - 1.2 mm
      drawHeart(doc, 52.5, y - 1.2, 3);
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
  lines.push(centerText('BS FOODS KITCHEN', 32));
  lines.push(centerText(`KOT #${bill.billNumber}`, 32));
  lines.push('--------------------------------');
  lines.push(formatRow(`Table: ${bill.tableNumber || '1'}`, `Time: ${formatTime(bill.createdAt)}`, 32));
  lines.push('--------------------------------');
  lines.push('Items:');
  lines.push('');
  
  bill.items.forEach(item => {
    lines.push(`${item.quantity} x ${item.name}`);
  });
  lines.push('--------------------------------');

  const lineCount = lines.length;
  const lineSpacing = 3.0; // mm per line
  const margin = 5; // mm left margin
  const topBottomMargin = 5; // mm
  const pageHeight = Math.max(30, ((lineCount - 1) * lineSpacing) + topBottomMargin); // target: 3cm to 4cm

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [pageWidth, pageHeight],
  });

  doc.setFont('courier', 'bold');
  doc.setFontSize(10);
  
  let y = 3.5;
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
  const separator32 = '='.repeat(32);
  const separator20 = '='.repeat(20);

  return `
    <div class="kot-receipt-wrapper" style="width: 100%; box-sizing: border-box; text-align: left; word-break: break-word;">
      <div style="text-align: center; white-space: pre; font-weight: 700; margin: 0;">${separator32}</div>
      <div class="bold-text" style="text-align: center; font-size: 16px; margin: 2px 0;">BS FOODS CAFE</div>
      <div class="bold-text" style="text-align: center; font-size: 13px; margin: 2px 0;">KITCHEN ORDER TICKET</div>
      <div style="text-align: center; white-space: pre; font-weight: 700; margin: 0;">${separator20}</div>
      
      <div style="margin: 12px 0 6px 0;">
        <span class="bold-text">Table: ${bill.tableNumber || '1'}</span>
      </div>
      
      <div style="margin: 6px 0 12px 0;">
        <span class="bold-text">Time: ${timeStr}</span>
      </div>
      
      <div style="text-align: center; white-space: pre; font-weight: 700; margin: 0 0 12px 0;">${separator32}</div>
      
      <table class="receipt-table">
        <tbody>
          ${bill.items.map(item => `
            <tr class="bold-text" style="font-size: 14px;">
              <td style="width: 15%; vertical-align: top; padding: 3px 0;">${item.quantity} x</td>
              <td style="width: 85%; vertical-align: top; padding: 3px 0; white-space: normal;">${item.name}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div style="text-align: center; white-space: pre; font-weight: 700; margin: 12px 0 0 0;">${separator32}</div>
    </div>
  `;
}

function getCustomerReceiptHtml(bill: Bill, s: CafeSettings): string {
  const dateStr = formatDate(bill.createdAt);
  const timeStr = formatTime(bill.createdAt).toUpperCase();
  const separator32 = '='.repeat(32);
  const separator16 = '='.repeat(16);
  
  // Format tagline (split standard text for beautiful aesthetic)
  const tagline = s.tagline || 'Smart Billing Experience for Modern Cafes';
  const taglineHtml = tagline
    .replace(/for/i, '<br/>For')
    .replace(/\n/g, '<br/>');

  return `
    <div class="customer-receipt-wrapper" style="width: 100%; box-sizing: border-box; text-align: left; word-break: break-word;">
      <div style="text-align: center; white-space: pre; font-weight: 700; margin: 0;">${separator32}</div>
      <div class="bold-text" style="text-align: center; font-size: 16px; margin: 2px 0;">BS FOODS CAFE</div>
      <div style="text-align: center; font-size: 12px; margin: 2px 0; font-weight: 700; line-height: 1.3;">
        ${taglineHtml}
      </div>
      <div style="text-align: center; white-space: pre; font-weight: 700; margin: 0 0 12px 0;">${separator16}</div>
      
      <div class="bold-text" style="font-size: 14px; margin: 12px 0 6px 0;">Bill #${bill.billNumber}</div>
      <div style="margin: 6px 0 6px 0; font-weight: 700;">Table: ${bill.tableNumber || '1'}</div>
      
      <div style="margin: 6px 0 6px 0; font-weight: 700;">Date: ${dateStr}</div>
      <div style="margin: 6px 0 12px 0; font-weight: 700;">Time: ${timeStr}</div>
      
      <div style="text-align: center; white-space: pre; font-weight: 700; margin: 0 0 8px 0;">${separator32}</div>
      
      <table class="receipt-table">
        <thead>
          <tr class="bold-text">
            <th style="width: 60%; text-align: left; padding-bottom: 6px;">ITEM</th>
            <th style="width: 15%; text-align: center; padding-bottom: 6px;">QTY</th>
            <th style="width: 10%; text-align: right; padding-bottom: 6px;">RATE</th>
            <th style="width: 15%; text-align: right; padding-bottom: 6px;">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          ${bill.items.map(item => `
            <tr class="bold-text" style="font-weight: 700;">
              <td style="width: 60%; text-align: left; vertical-align: top; padding: 4px 0;">${item.name}</td>
              <td style="width: 15%; text-align: center; vertical-align: top; padding: 4px 0;">${item.quantity}</td>
              <td style="width: 10%; text-align: right; vertical-align: top; padding: 4px 0;">₹${item.price}</td>
              <td style="width: 15%; text-align: right; vertical-align: top; padding: 4px 0;">₹${item.price * item.quantity}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div style="text-align: center; white-space: pre; font-weight: 700; margin: 8px 0 8px 0;">${separator32}</div>
      
      <table style="width: 100%; font-weight: 700; border-collapse: collapse; font-size: 13px;">
        <tr>
          <td style="text-align: left; padding: 3px 0;">Subtotal</td>
          <td style="text-align: right; padding: 3px 0;">₹${bill.subtotal}</td>
        </tr>
        <tr>
          <td style="text-align: left; padding: 3px 0;">Discount</td>
          <td style="text-align: right; padding: 3px 0;">₹${bill.discount}</td>
        </tr>
      </table>
      
      <div style="text-align: center; white-space: pre; font-weight: 700; margin: 8px 0 8px 0;">${separator32}</div>
      
      <div class="bold-text" style="display: flex; justify-content: space-between; font-size: 15px; margin: 6px 0;">
        <span># GRAND TOTAL</span>
        <span>₹${bill.total}</span>
      </div>
      
      <div style="margin: 6px 0 12px 0; font-weight: 700;">Payment: ${bill.paymentMethod.toUpperCase()}</div>
      
      <div style="text-align: center; white-space: pre; font-weight: 700; margin: 12px 0 12px 0;">${separator32}</div>
      
      <div style="text-align: center; font-weight: 700; line-height: 1.4; margin-top: 12px;">
        <div style="margin-bottom: 8px;">Thank You For Visiting</div>
        <div class="bold-text" style="font-size: 14px; margin-bottom: 12px;">BS FOODS CAFE</div>
        <div style="font-size: 10px; font-weight: normal; margin-bottom: 12px; line-height: 1.2;">
          Powered By<br/>
          <strong>NexLayer Private Limited</strong>
        </div>
        <div style="margin-top: 8px;">Visit Again ❤️</div>
      </div>
      
      <div style="text-align: center; white-space: pre; font-weight: 700; margin: 12px 0 0 0;">${separator32}</div>
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
