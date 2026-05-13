'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Delete, ArrowRight, Coffee } from 'lucide-react';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';

export default function LoginScreen() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const login = useStore((s) => s.login);

  const handleDigit = useCallback((d: string) => {
    if (pin.length < 4) {
      setPin((p) => p + d);
      setError(false);
    }
  }, [pin]);

  const handleDelete = useCallback(() => {
    setPin((p) => p.slice(0, -1));
    setError(false);
  }, []);

  const handleSubmit = useCallback(() => {
    if (pin.length !== 4) return;
    const ok = login(pin);
    if (ok) {
      toast.success('Welcome to BS FOODS!');
    } else {
      setError(true);
      setPin('');
      toast.error('Invalid PIN');
    }
  }, [pin, login]);

  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', ''];

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-electric/10 rounded-full blur-3xl animate-float" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="glass-card w-full max-w-sm p-8 relative z-10"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="flex flex-col items-center mb-8"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-electric flex items-center justify-center mb-4 shadow-neon">
            <Coffee className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold gradient-text">BS FOODS</h1>
          <p className="text-white/40 text-sm mt-1">Smart Billing System</p>
        </motion.div>

        {/* PIN display */}
        <div className="flex justify-center gap-3 mb-8">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={error ? { x: [0, -8, 8, -4, 4, 0] } : {}}
              transition={{ duration: 0.4 }}
              className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-xl font-bold transition-all duration-200 ${
                pin.length > i
                  ? 'border-primary-500 bg-primary-500/20 text-primary-400 shadow-neon'
                  : error
                  ? 'border-red-500/50 bg-red-500/10'
                  : 'border-white/10 bg-white/[0.03]'
              }`}
            >
              {pin.length > i ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-3 h-3 rounded-full bg-primary-400"
                />
              ) : null}
            </motion.div>
          ))}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {digits.map((d, i) => {
            if (d === '' && i === 9) {
              return (
                <button
                  key="del"
                  onClick={handleDelete}
                  className="h-14 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-all duration-200 active:scale-95"
                >
                  <Delete className="w-5 h-5" />
                </button>
              );
            }
            if (d === '' && i === 11) {
              return (
                <button
                  key="go"
                  onClick={handleSubmit}
                  disabled={pin.length !== 4}
                  className="h-14 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center text-white disabled:opacity-30 hover:shadow-neon transition-all duration-200 active:scale-95"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              );
            }
            return (
              <motion.button
                key={d}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleDigit(d)}
                className="h-14 rounded-xl border border-white/10 bg-white/[0.04] text-white text-lg font-semibold hover:bg-white/[0.08] hover:border-primary-500/30 transition-all duration-200"
              >
                {d}
              </motion.button>
            );
          })}
        </div>

        {/* Hints */}
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2 text-white/30 text-xs">
            <Shield className="w-3 h-3" />
            <span>Owner: 1234 · Admin: 5678 · Staff: 0000</span>
          </div>
          <p className="text-white/20 text-[10px]">
            Powered by NexLayer Private Limited
          </p>
        </div>
      </motion.div>
    </div>
  );
}
