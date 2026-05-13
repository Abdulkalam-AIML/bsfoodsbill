'use client';

import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Receipt, IndianRupee, TrendingUp, Percent,
  ShoppingBag, Clock, CreditCard, Wallet,
  Smartphone, Star, ArrowUpRight, Settings2, Coffee
} from 'lucide-react';
import { useStore } from '@/lib/store';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const PIE_COLORS = ['#00d4ff', '#6366f1', '#ff6b35'];

export default function Dashboard({ onNavigate }: { onNavigate: (v: string) => void }) {
  const { bills, report, generateReport, settings } = useStore();

  useEffect(() => {
    generateReport();
  }, [bills, generateReport]);

  const hourlyChartData = useMemo(() => {
    if (!report?.hourlyData) return [];
    return Object.entries(report.hourlyData)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .map(([hour, amount]) => ({
        hour,
        amount,
      }));
  }, [report]);

  const paymentPieData = useMemo(() => {
    if (!report?.paymentMethods) return [];
    return Object.entries(report.paymentMethods)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      }));
  }, [report]);

  const topItems = useMemo(() => {
    if (!report?.itemsSold) return [];
    return Object.entries(report.itemsSold)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [report]);

  const stats = [
    {
      label: 'Total Sales',
      value: `${settings.currency}${(report?.totalSales || 0).toLocaleString('en-IN')}`,
      icon: IndianRupee,
      color: 'from-primary-500 to-primary-600',
      bg: 'bg-primary-500/10',
      text: 'text-primary-400',
    },
    {
      label: 'Total Bills',
      value: `${report?.totalBills || 0}`,
      icon: Receipt,
      color: 'from-accent-electric to-purple-600',
      bg: 'bg-accent-electric/10',
      text: 'text-accent-electric',
    },
    {
      label: 'Discount Given',
      value: `${settings.currency}${(report?.totalDiscount || 0).toLocaleString('en-IN')}`,
      icon: Percent,
      color: 'from-accent-orange to-yellow-500',
      bg: 'bg-accent-orange/10',
      text: 'text-accent-orange',
    },
    {
      label: 'Revenue',
      value: `${settings.currency}${(report?.totalRevenue || 0).toLocaleString('en-IN')}`,
      icon: TrendingUp,
      color: 'from-emerald-500 to-green-500',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
    },
  ];

  const paymentIcons: Record<string, typeof Wallet> = {
    Cash: Wallet,
    Upi: Smartphone,
    Card: CreditCard,
  };

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-white">
            Dashboard
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate('pos')}
          className="btn-primary"
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="hidden sm:inline">New Bill</span>
        </motion.button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            className="glass-card p-4 md:p-5 group hover:border-primary-500/20 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.text}`} />
              </div>
              <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-primary-400 transition-colors" />
            </div>
            <p className="text-white/50 text-xs font-medium uppercase tracking-wider">{stat.label}</p>
            <p className="text-white font-display text-xl md:text-2xl font-bold mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sales Chart */}
        <motion.div variants={fadeUp} className="glass-card p-5 lg:col-span-2">
          <h3 className="section-title mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary-400" />
            Hourly Sales
          </h3>
          {hourlyChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={hourlyChartData}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" stroke="#8892b0" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#8892b0" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(10,14,39,0.95)',
                    border: '1px solid rgba(0,212,255,0.2)',
                    borderRadius: '12px',
                    color: '#f0f4ff',
                    fontSize: '12px',
                  }}
                  formatter={(v: number) => [`${settings.currency}${v}`, 'Sales']}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#00d4ff"
                  strokeWidth={2}
                  fill="url(#salesGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-white/30 text-sm">
              No sales data yet today
            </div>
          )}
        </motion.div>

        {/* Payment Methods */}
        <motion.div variants={fadeUp} className="glass-card p-5">
          <h3 className="section-title mb-4">Payment Split</h3>
          {paymentPieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={paymentPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {paymentPieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {paymentPieData.map((p, i) => {
                  const Icon = paymentIcons[p.name] || Wallet;
                  return (
                    <div key={p.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} />
                        <Icon className="w-3.5 h-3.5 text-white/40" />
                        <span className="text-white/70">{p.name}</span>
                      </div>
                      <span className="font-semibold text-white">{p.value}</span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-white/30 text-sm">
              No payments yet
            </div>
          )}
        </motion.div>
      </div>

      {/* Top Items & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Selling */}
        <motion.div variants={fadeUp} className="glass-card p-5">
          <h3 className="section-title mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            Top Selling Items
          </h3>
          {topItems.length > 0 ? (
            <div className="space-y-3">
              {topItems.map(([name, qty], i) => (
                <div key={name} className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                    i === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                    i === 1 ? 'bg-white/10 text-white/60' :
                    'bg-white/5 text-white/40'
                  }`}>
                    {i + 1}
                  </span>
                  <span className="flex-1 text-sm text-white/80 truncate">{name}</span>
                  <span className="text-sm font-mono font-semibold text-primary-400">{qty}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/30 text-sm py-6 text-center">No items sold yet</p>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={fadeUp} className="glass-card p-5">
          <h3 className="section-title mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'New Bill', icon: ShoppingBag, view: 'pos', color: 'from-primary-500/20 to-primary-600/20 text-primary-400 border-primary-500/20' },
              { label: 'Reports', icon: TrendingUp, view: 'reports', color: 'from-emerald-500/20 to-green-500/20 text-emerald-400 border-emerald-500/20' },
              { label: 'Menu', icon: Coffee, view: 'menu', color: 'from-accent-orange/20 to-yellow-500/20 text-accent-orange border-accent-orange/20' },
              { label: 'Settings', icon: Settings2, view: 'settings', color: 'from-accent-electric/20 to-purple-500/20 text-accent-electric border-accent-electric/20' },
            ].map((a) => (
              <motion.button
                key={a.label}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onNavigate(a.view)}
                className={`p-4 rounded-xl border bg-gradient-to-br ${a.color} flex flex-col items-center gap-2 transition-all duration-200`}
              >
                <a.icon className="w-6 h-6" />
                <span className="text-xs font-medium">{a.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

