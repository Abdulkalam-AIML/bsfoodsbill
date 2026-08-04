'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download, FileSpreadsheet, Trash2, Receipt, IndianRupee,
  Percent, TrendingUp, Clock, CheckCircle2, Calendar,
  X, Printer, MessageCircle, ChevronRight, Utensils
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { downloadReportPDF } from '@/lib/pdf';
import { downloadCSV } from '@/lib/reports';
import { clearTodayData, getAllBills } from '@/lib/storage';
import { toast } from 'sonner';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ReportsView() {
  const { report, generateReport, bills, settings, loadBills } = useStore();
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly'>('daily');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    return `${today.getFullYear()}-${mm}`;
  });
  const [selectedBill, setSelectedBill] = useState<import('@/types').Bill | null>(null);

  const completedBills = bills.filter(b => b.status === 'COMPLETED');

  // Load all bills for monthly reports
  const allBills = useMemo(() => {
    return getAllBills();
  }, [bills]); // Refresh all bills when today's bills list changes

  // Monthly stats calculations
  const monthlyData = useMemo(() => {
    const filtered = allBills.filter(
      b => b.createdAt.startsWith(selectedMonth) && b.status === 'COMPLETED'
    );

    let foodSales = 0;
    let deliveryChargeRevenue = 0;
    let packingChargeRevenue = 0;
    let extraChargeRevenue = 0;
    let discountTotal = 0;
    let netRevenue = 0;

    filtered.forEach(b => {
      foodSales += b.subtotal || 0;
      deliveryChargeRevenue += b.deliveryCharge || 0;
      packingChargeRevenue += b.packingCharge || 0;
      extraChargeRevenue += b.extraCharge || 0;
      discountTotal += b.discount || 0;
      netRevenue += b.grandTotal || b.total || 0;
    });

    return {
      bills: filtered,
      foodSales,
      deliveryChargeRevenue,
      packingChargeRevenue,
      extraChargeRevenue,
      discountTotal,
      netRevenue,
      totalBillsCount: filtered.length
    };
  }, [allBills, selectedMonth]);

  useEffect(() => {
    generateReport();
  }, [bills, generateReport]);

  const handleDownloadPDF = () => {
    if (!report || report.totalBills === 0) {
      toast.error('No data to generate report');
      return;
    }
    downloadReportPDF(report, settings);
    toast.success('Daily Report PDF downloaded!');
  };

  const handleDownloadCSV = () => {
    if (!report || report.totalBills === 0) {
      toast.error('No data to export');
      return;
    }
    downloadCSV(report);
    toast.success('CSV exported!');
  };

  const handleDownloadMonthlyCSV = () => {
    const { bills: mBills, foodSales, deliveryChargeRevenue, packingChargeRevenue, extraChargeRevenue, discountTotal, netRevenue, totalBillsCount } = monthlyData;
    if (mBills.length === 0) {
      toast.error('No data to export for this month');
      return;
    }
    const rows = [
      `BS FOODS - Monthly Sales Report (${selectedMonth})`,
      '',
      `Total Bills,${totalBillsCount}`,
      `Food Sales (Subtotal),${settings.currency}${foodSales.toFixed(2)}`,
      `Delivery Charge Revenue,${settings.currency}${deliveryChargeRevenue.toFixed(2)}`,
      `Packing Charge Revenue,${settings.currency}${packingChargeRevenue.toFixed(2)}`,
      `Extra Charge Revenue,${settings.currency}${extraChargeRevenue.toFixed(2)}`,
      `Discount Total,${settings.currency}${discountTotal.toFixed(2)}`,
      `Net Revenue (Grand Total),${settings.currency}${netRevenue.toFixed(2)}`,
      '',
      'Bill No,Date,Items,Subtotal,Delivery,Packing,Extra,Discount,Grand Total,Payment Method',
      ...mBills.map(b => {
        const dateStr = new Date(b.createdAt).toLocaleDateString('en-IN');
        return `${b.billNumber},${dateStr},${b.items.length},${b.subtotal},${b.deliveryCharge || 0},${b.packingCharge || 0},${b.extraCharge || 0},${b.discount || 0},${b.grandTotal || b.total},${b.paymentMethod}`;
      })
    ];
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BS-Foods-Monthly-Report-${selectedMonth}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Monthly CSV exported!');
  };

  const handleCleanup = () => {
    if (!report || report.totalBills === 0) {
      toast.info('No data to clear');
      return;
    }
    if (!window.confirm('Download report first! This will clear ALL today\'s data. Continue?')) return;
    downloadReportPDF(report, settings);
    clearTodayData();
    loadBills();
    generateReport();
    toast.success('Data cleared! Starting fresh.');
  };

  const statCards = [
    { label: 'Total Bills', value: report?.totalBills || 0, icon: Receipt, color: 'text-primary-400', bg: 'bg-primary-500/10' },
    { label: 'Total Sales', value: `${settings.currency}${(report?.totalSales || 0).toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Discount', value: `${settings.currency}${(report?.totalDiscount || 0).toLocaleString('en-IN')}`, icon: Percent, color: 'text-accent-orange', bg: 'bg-accent-orange/10' },
    { label: 'Revenue', value: `${settings.currency}${(report?.totalRevenue || 0).toLocaleString('en-IN')}`, icon: TrendingUp, color: 'text-primary-400', bg: 'bg-primary-500/10' },
  ];

  const topItems = report?.itemsSold
    ? Object.entries(report.itemsSold).sort((a, b) => b[1] - a[1]).slice(0, 10)
    : [];

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06 } } }} className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-white">Reports & Analytics</h1>
          <p className="text-white/40 text-sm mt-1">View performance records and sales breakdown</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {activeTab === 'daily' ? (
            <>
              <motion.button whileTap={{ scale: 0.95 }} onClick={handleDownloadPDF} className="btn-primary text-xs">
                <Download className="w-4 h-4" /> PDF Report
              </motion.button>
              <motion.button whileTap={{ scale: 0.95 }} onClick={handleDownloadCSV} className="btn-ghost text-xs">
                <FileSpreadsheet className="w-4 h-4" /> CSV
              </motion.button>
              <motion.button whileTap={{ scale: 0.95 }} onClick={handleCleanup} className="btn-danger text-xs">
                <Trash2 className="w-4 h-4" /> Clear & Reset
              </motion.button>
            </>
          ) : (
            <motion.button whileTap={{ scale: 0.95 }} onClick={handleDownloadMonthlyCSV} className="btn-primary text-xs">
              <Download className="w-4 h-4" /> Export CSV
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={fadeUp} className="flex gap-2 p-1 bg-white/[0.02] border border-white/[0.06] rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('daily')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'daily'
              ? 'bg-primary-500 text-white shadow-neon'
              : 'text-white/40 hover:text-white/80'
          }`}
        >
          Daily Report
        </button>
        <button
          onClick={() => setActiveTab('monthly')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'monthly'
              ? 'bg-primary-500 text-white shadow-neon'
              : 'text-white/40 hover:text-white/80'
          }`}
        >
          Monthly Report
        </button>
      </motion.div>

      {activeTab === 'daily' ? (
        <>
          {/* Daily Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {statCards.map((s) => (
              <motion.div key={s.label} variants={fadeUp} className="glass-card p-4">
                <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                  <s.icon className={`w-4.5 h-4.5 ${s.color}`} />
                </div>
                <p className="text-white/40 text-xs uppercase tracking-wider">{s.label}</p>
                <p className="text-white font-display text-xl font-bold mt-1">{s.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Peak Hour & Payment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div variants={fadeUp} className="glass-card p-5">
              <h3 className="section-title mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary-400" />
                Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/50">Peak Hour</span>
                  <span className="text-white font-semibold">{report?.peakHour || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Kitchen Tickets Printed</span>
                  <span className="text-white font-semibold">{report?.kitchenTicketsPrinted || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Customer Bills Printed</span>
                  <span className="text-white font-semibold">{report?.customerBillsPrinted || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">WhatsApp Sent</span>
                  <span className="text-white font-semibold">{report?.whatsappCount || 0}</span>
                </div>
                {report?.paymentMethods && Object.entries(report.paymentMethods).map(([m, c]) => (
                  <div key={m} className="flex justify-between">
                    <span className="text-white/50">{m.toUpperCase()} Payments</span>
                    <span className="text-white font-semibold">{c}</span>
                  </div>
                ))}

                {/* Additional Charges Collected */}
                <div className="pt-3 border-t border-white/[0.06] mt-2 space-y-3">
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
                    Additional Charges Breakdown
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Total Delivery Charges</span>
                    <span className="text-white font-semibold">{settings.currency}{(report?.totalDeliveryCharges || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Total Packing Charges</span>
                    <span className="text-white font-semibold">{settings.currency}{(report?.totalPackingCharges || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Total Extra Charges</span>
                    <span className="text-white font-semibold">{settings.currency}{(report?.totalExtraCharges || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-red-400/80">
                    <span>Total Discounts Given</span>
                    <span className="font-semibold">-{settings.currency}{(report?.totalDiscount || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="glass-card p-5">
              <h3 className="section-title mb-4">Top Items Sold</h3>
              {topItems.length > 0 ? (
                <div className="space-y-2">
                  {topItems.map(([name, qty], i) => (
                    <div key={name} className="flex items-center gap-3">
                      <span className={`w-5 h-5 rounded text-xs flex items-center justify-center font-bold ${
                        i === 0 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/5 text-white/40'
                      }`}>{i + 1}</span>
                      <span className="flex-1 text-sm text-white/70 truncate">{name}</span>
                      <span className="text-sm font-mono text-primary-400 font-semibold">{qty}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/30 text-sm text-center py-6">No items sold today</p>
              )}
            </motion.div>
          </div>

          {/* Today's Bills List */}
          <motion.div variants={fadeUp} className="glass-card p-5">
            <h3 className="section-title mb-4">Today&apos;s Bills ({completedBills.length}) — Click row to view</h3>
            {completedBills.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-white/40 text-xs uppercase border-b border-white/[0.06]">
                      <th className="text-left py-2 pr-4">#</th>
                      <th className="text-left py-2 pr-4">Items</th>
                      <th className="text-right py-2 pr-4">Grand Total</th>
                      <th className="text-center py-2 pr-4">Payment</th>
                      <th className="text-center py-2">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {[...completedBills].reverse().map((bill) => (
                      <tr
                        key={bill.id}
                        onClick={() => setSelectedBill(bill)}
                        className="hover:bg-white/[0.02] cursor-pointer transition-colors group"
                      >
                        <td className="py-2.5 pr-4 font-mono text-primary-400 font-semibold group-hover:text-primary-300">
                          #{bill.billNumber}
                        </td>
                        <td className="py-2.5 pr-4 text-white/50">{bill.items.length} items</td>
                        <td className="py-2.5 pr-4 text-right font-semibold text-white">
                          {settings.currency}{(bill.grandTotal !== undefined ? bill.grandTotal : bill.total).toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 pr-4 text-center">
                          <span className="badge badge-cyan">{bill.paymentMethod}</span>
                        </td>
                        <td className="py-2.5 text-center text-white/40 text-xs">
                          {new Date(bill.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 text-white/30">
                <CheckCircle2 className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p>No bills yet today</p>
              </div>
            )}
          </motion.div>
        </>
      ) : (
        <>
          {/* Monthly Month Selector */}
          <motion.div variants={fadeUp} className="glass-card p-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <label className="text-xs font-semibold text-white/50 flex items-center gap-1.5 shrink-0">
              <Calendar className="w-4 h-4 text-primary-400" /> Selected Sales Month:
            </label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="glass-input text-xs py-2 px-3 max-w-[200px]"
            />
          </motion.div>

          {/* Monthly Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            <motion.div variants={fadeUp} className="glass-card p-4">
              <div className="w-9 h-9 rounded-xl bg-primary-500/10 flex items-center justify-center mb-3">
                <Utensils className="w-4.5 h-4.5 text-primary-400" />
              </div>
              <p className="text-white/40 text-xs uppercase tracking-wider">Food Sales (Subtotal)</p>
              <p className="text-white font-display text-xl font-bold mt-1">
                {settings.currency}{monthlyData.foodSales.toLocaleString('en-IN')}
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="glass-card p-4">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-3">
                <TrendingUp className="w-4.5 h-4.5 text-emerald-400" />
              </div>
              <p className="text-white/40 text-xs uppercase tracking-wider">Net Monthly Revenue</p>
              <p className="text-white font-display text-xl font-bold mt-1">
                {settings.currency}{monthlyData.netRevenue.toLocaleString('en-IN')}
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="glass-card p-4">
              <div className="w-9 h-9 rounded-xl bg-accent-electric/10 flex items-center justify-center mb-3">
                <Receipt className="w-4.5 h-4.5 text-accent-electric" />
              </div>
              <p className="text-white/40 text-xs uppercase tracking-wider">Total Orders Completed</p>
              <p className="text-white font-display text-xl font-bold mt-1">
                {monthlyData.totalBillsCount}
              </p>
            </motion.div>
          </div>

          {/* Monthly Charges Split */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <motion.div variants={fadeUp} className="glass-card p-4 border-white/[0.04]">
              <p className="text-white/40 text-[10px] uppercase tracking-wider font-semibold">Delivery Charge Revenue</p>
              <p className="text-white font-display text-lg font-bold mt-1">
                {settings.currency}{monthlyData.deliveryChargeRevenue.toLocaleString('en-IN')}
              </p>
            </motion.div>
            <motion.div variants={fadeUp} className="glass-card p-4 border-white/[0.04]">
              <p className="text-white/40 text-[10px] uppercase tracking-wider font-semibold">Packing Charge Revenue</p>
              <p className="text-white font-display text-lg font-bold mt-1">
                {settings.currency}{monthlyData.packingChargeRevenue.toLocaleString('en-IN')}
              </p>
            </motion.div>
            <motion.div variants={fadeUp} className="glass-card p-4 border-white/[0.04]">
              <p className="text-white/40 text-[10px] uppercase tracking-wider font-semibold">Extra Charge Revenue</p>
              <p className="text-white font-display text-lg font-bold mt-1">
                {settings.currency}{monthlyData.extraChargeRevenue.toLocaleString('en-IN')}
              </p>
            </motion.div>
            <motion.div variants={fadeUp} className="glass-card p-4 border-red-500/10 bg-red-500/[0.01]">
              <p className="text-red-400/50 text-[10px] uppercase tracking-wider font-semibold">Discount Total</p>
              <p className="text-red-400 font-display text-lg font-bold mt-1">
                -{settings.currency}{monthlyData.discountTotal.toLocaleString('en-IN')}
              </p>
            </motion.div>
          </div>

          {/* Monthly Bills List */}
          <motion.div variants={fadeUp} className="glass-card p-5">
            <h3 className="section-title mb-4">Orders of Month {selectedMonth} ({monthlyData.totalBillsCount}) — Click row to view</h3>
            {monthlyData.bills.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-white/40 text-xs uppercase border-b border-white/[0.06]">
                      <th className="text-left py-2 pr-4">#</th>
                      <th className="text-left py-2 pr-4">Date</th>
                      <th className="text-left py-2 pr-4">Items</th>
                      <th className="text-right py-2 pr-4">Grand Total</th>
                      <th className="text-center py-2 pr-4">Payment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {[...monthlyData.bills].reverse().map((bill) => (
                      <tr
                        key={bill.id}
                        onClick={() => setSelectedBill(bill)}
                        className="hover:bg-white/[0.02] cursor-pointer transition-colors group"
                      >
                        <td className="py-2.5 pr-4 font-mono text-primary-400 font-semibold group-hover:text-primary-300">
                          #{bill.billNumber}
                        </td>
                        <td className="py-2.5 pr-4 text-white/50">
                          {new Date(bill.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                          })}
                        </td>
                        <td className="py-2.5 pr-4 text-white/50">{bill.items.length} items</td>
                        <td className="py-2.5 pr-4 text-right font-semibold text-white">
                          {settings.currency}{(bill.grandTotal !== undefined ? bill.grandTotal : bill.total).toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 pr-4 text-center">
                          <span className="badge badge-cyan">{bill.paymentMethod}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 text-white/30">
                <Calendar className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p>No orders registered for this month</p>
              </div>
            )}
          </motion.div>
        </>
      )}

      {/* Order Detail Modal (Order History) */}
      <AnimatePresence>
        {selectedBill && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card max-w-md w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto relative"
            >
              <button
                onClick={() => setSelectedBill(null)}
                className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/5 text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-primary-400" />
                Bill Details #{selectedBill.billNumber}
              </h2>

              <div className="grid grid-cols-2 gap-y-1.5 text-xs text-white/50 border-b border-white/[0.06] pb-3">
                <div>Date & Time:</div>
                <div className="text-white text-right">
                  {new Date(selectedBill.createdAt).toLocaleString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
                <div>Order Type:</div>
                <div className="text-white text-right capitalize">{selectedBill.orderType}</div>
                {selectedBill.tableNumber && (
                  <>
                    <div>Table Number:</div>
                    <div className="text-white text-right">Table {selectedBill.tableNumber}</div>
                  </>
                )}
                <div>Payment Method:</div>
                <div className="text-white text-right uppercase font-semibold text-emerald-400">
                  {selectedBill.paymentMethod}
                </div>
              </div>

              {/* Items list */}
              <div className="space-y-2 border-b border-white/[0.06] pb-3">
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
                  Items Ordered
                </div>
                {selectedBill.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <div className="text-white/80 font-medium">
                      {item.name} <span className="text-white/30 text-[10px]">x {item.quantity}</span>
                    </div>
                    <div className="text-white font-semibold">
                      {settings.currency}{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Charges & Grand Total breakdown */}
              <div className="space-y-1.5 text-xs border-b border-white/[0.06] pb-3">
                <div className="flex justify-between text-white/50">
                  <span>Food Total</span>
                  <span>{settings.currency}{selectedBill.subtotal.toLocaleString('en-IN')}</span>
                </div>
                {selectedBill.deliveryCharge !== undefined && selectedBill.deliveryCharge > 0 && (
                  <div className="flex justify-between text-white/50">
                    <span>Delivery Charge</span>
                    <span>{settings.currency}{selectedBill.deliveryCharge.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {selectedBill.packingCharge !== undefined && selectedBill.packingCharge > 0 && (
                  <div className="flex justify-between text-white/50">
                    <span>Packing Charge</span>
                    <span>{settings.currency}{selectedBill.packingCharge.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {selectedBill.extraCharge !== undefined && selectedBill.extraCharge > 0 && (
                  <div className="flex justify-between text-white/50">
                    <span>Extra Charge</span>
                    <span>{settings.currency}{selectedBill.extraCharge.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {selectedBill.discount !== undefined && selectedBill.discount !== 0 && (
                  <div className="flex justify-between text-red-400">
                    <span>Discount</span>
                    <span>
                      {selectedBill.discount < 0 ? '+' : '-'}{settings.currency}
                      {Math.abs(selectedBill.discount).toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-white font-bold text-sm pt-1.5">
                  <span>Grand Total</span>
                  <span className="text-primary-400">
                    {settings.currency}
                    {(selectedBill.grandTotal !== undefined ? selectedBill.grandTotal : selectedBill.total).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1.5">
                <button
                  onClick={async () => {
                    try {
                      const { printBill } = await import('@/lib/pdf');
                      await printBill(selectedBill, settings, { printCustomer: true });
                      toast.success('Reprint request sent');
                    } catch (e) {
                      console.error(e);
                      const { downloadThermalReceipt } = await import('@/lib/pdf');
                      downloadThermalReceipt(selectedBill, settings);
                      toast.success('Receipt downloaded');
                    }
                  }}
                  className="flex-1 btn-primary py-2.5 text-xs flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-4 h-4" /> Reprint
                </button>
                <button
                  onClick={async () => {
                    const { shareWhatsAppNoNumber } = await import('@/lib/whatsapp');
                    shareWhatsAppNoNumber(selectedBill, settings);
                    toast.success('WhatsApp shared');
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 py-2.5 text-xs font-semibold hover:bg-emerald-500/20 transition-all"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </button>
                <button
                  onClick={() => setSelectedBill(null)}
                  className="flex-1 btn-ghost py-2.5 text-xs"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
