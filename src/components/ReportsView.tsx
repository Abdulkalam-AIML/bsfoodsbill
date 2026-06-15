'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Download, FileSpreadsheet, Trash2, Receipt, IndianRupee,
  Percent, TrendingUp, Clock, AlertTriangle, CheckCircle2
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { downloadReportPDF } from '@/lib/pdf';
import { downloadCSV } from '@/lib/reports';
import { clearTodayData } from '@/lib/storage';
import { toast } from 'sonner';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ReportsView() {
  const { report, generateReport, bills, settings, loadBills } = useStore();
  const completedBills = bills.filter(b => b.status === 'COMPLETED');

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
          <h1 className="font-display text-2xl md:text-3xl font-bold text-white">Daily Report</h1>
          <p className="text-white/40 text-sm mt-1">{report?.date || new Date().toISOString().split('T')[0]}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <motion.button whileTap={{ scale: 0.95 }} onClick={handleDownloadPDF} className="btn-primary text-xs">
            <Download className="w-4 h-4" /> PDF Report
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }} onClick={handleDownloadCSV} className="btn-ghost text-xs">
            <FileSpreadsheet className="w-4 h-4" /> CSV
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }} onClick={handleCleanup} className="btn-danger text-xs">
            <Trash2 className="w-4 h-4" /> Clear & Reset
          </motion.button>
        </div>
      </motion.div>

      {/* Stat Cards */}
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
            Info
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
                <span className="text-white/50">{m.charAt(0).toUpperCase() + m.slice(1)} Payments</span>
                <span className="text-white font-semibold">{c}</span>
              </div>
            ))}
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
        <h3 className="section-title mb-4">Today&apos;s Bills ({completedBills.length})</h3>
        {completedBills.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/40 text-xs uppercase border-b border-white/[0.06]">
                  <th className="text-left py-2 pr-4">#</th>
                  <th className="text-left py-2 pr-4">Items</th>
                  <th className="text-right py-2 pr-4">Total</th>
                  <th className="text-center py-2 pr-4">Payment</th>
                  <th className="text-center py-2">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {[...completedBills].reverse().map((bill) => (
                  <tr key={bill.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-2.5 pr-4 font-mono text-primary-400 font-semibold">#{bill.billNumber}</td>
                    <td className="py-2.5 pr-4 text-white/50">{bill.items.length} items</td>
                    <td className="py-2.5 pr-4 text-right font-semibold text-white">
                      {settings.currency}{bill.total}
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
    </motion.div>
  );
}
