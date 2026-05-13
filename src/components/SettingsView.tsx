'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Store, Phone, MapPin, FileText, Palette, Shield,
  Save, RotateCcw, ExternalLink
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function SettingsView() {
  const { settings, updateSettings, userRole } = useStore();
  const [form, setForm] = useState({ ...settings });
  const [changed, setChanged] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setChanged(true);
  };

  const handleSave = () => {
    updateSettings(form);
    setChanged(false);
    toast.success('Settings saved!');
  };

  const handleReset = () => {
    setForm({ ...settings });
    setChanged(false);
  };

  const fields = [
    { key: 'cafeName', label: 'Cafe Name', icon: Store, placeholder: 'BS FOODS CAFE' },
    { key: 'tagline', label: 'Tagline', icon: FileText, placeholder: 'Smart Billing Experience' },
    { key: 'phone', label: 'Phone Number', icon: Phone, placeholder: '+91 98765 43210' },
    { key: 'address', label: 'Address', icon: MapPin, placeholder: 'Your cafe address' },
    { key: 'receiptFooter', label: 'Receipt Footer', icon: FileText, placeholder: 'Thank you message' },
    { key: 'currency', label: 'Currency Symbol', icon: Palette, placeholder: '₹' },
  ];

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06 } } }} className="space-y-6 max-w-2xl">
      {/* Header */}
      <motion.div variants={fadeUp}>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-white">Settings</h1>
        <p className="text-white/40 text-sm mt-1">Configure your billing system</p>
      </motion.div>

      {/* Cafe Settings */}
      <motion.div variants={fadeUp} className="glass-card p-6 space-y-5">
        <h2 className="section-title flex items-center gap-2">
          <Store className="w-5 h-5 text-primary-400" />
          Cafe Details
        </h2>
        <div className="space-y-4">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-1.5 block">
                {f.label}
              </label>
              <div className="relative">
                <f.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  value={(form as Record<string, string>)[f.key] || ''}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="glass-input pl-10"
                  disabled={userRole !== 'owner' && f.key !== 'phone'}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Security Info */}
      <motion.div variants={fadeUp} className="glass-card p-6 space-y-4">
        <h2 className="section-title flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary-400" />
          Access Control
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div>
              <p className="text-white font-medium">Owner PIN</p>
              <p className="text-white/40 text-xs">Full access — can apply discounts</p>
            </div>
            <span className="font-mono text-primary-400">1234</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div>
              <p className="text-white font-medium">Admin PIN</p>
              <p className="text-white/40 text-xs">Billing & reports access</p>
            </div>
            <span className="font-mono text-primary-400">5678</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div>
              <p className="text-white font-medium">Staff PIN</p>
              <p className="text-white/40 text-xs">POS billing only</p>
            </div>
            <span className="font-mono text-primary-400">0000</span>
          </div>
        </div>
      </motion.div>

      {/* Branding */}
      <motion.div variants={fadeUp} className="glass-card p-6">
        <h2 className="section-title mb-4">About</h2>
        <div className="space-y-2 text-sm text-white/50">
          <p>Developed by <span className="text-primary-400 font-semibold">{settings.developerName}</span></p>
          <a
            href={settings.developerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary-400 hover:text-primary-300 transition-colors"
          >
            Visit Website <ExternalLink className="w-3 h-3" />
          </a>
          <p className="text-white/30 text-xs mt-3">BS Foods Billing System v1.0.0</p>
        </div>
      </motion.div>

      {/* Save / Reset */}
      {changed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 sticky bottom-4"
        >
          <motion.button whileTap={{ scale: 0.95 }} onClick={handleSave} className="btn-primary flex-1">
            <Save className="w-4 h-4" /> Save Changes
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }} onClick={handleReset} className="btn-ghost">
            <RotateCcw className="w-4 h-4" /> Reset
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}
