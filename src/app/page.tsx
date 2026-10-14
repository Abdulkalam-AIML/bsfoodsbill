'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ShoppingBag, BarChart3, UtensilsCrossed,
  Settings, LogOut, Coffee, Menu, X
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { DEFAULT_MENU } from '@/lib/menu-data';
import { autoCleanup } from '@/lib/storage';

import LoginScreen from '@/components/LoginScreen';
import Dashboard from '@/components/Dashboard';
import POSBilling from '@/components/POSBilling';
import ReportsView from '@/components/ReportsView';
import MenuManagement from '@/components/MenuManagement';
import SettingsView from '@/components/SettingsView';

type View = 'dashboard' | 'pos' | 'reports' | 'menu' | 'settings';

const NAV_ITEMS: { id: View; label: string; icon: typeof LayoutDashboard; roles?: string[] }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'pos', label: 'POS', icon: ShoppingBag },
  { id: 'reports', label: 'Reports', icon: BarChart3, roles: ['owner', 'admin'] },
  { id: 'menu', label: 'Menu', icon: UtensilsCrossed, roles: ['owner', 'admin'] },
  { id: 'settings', label: 'Settings', icon: Settings, roles: ['owner'] },
];

export default function Home() {
  const {
    isLoggedIn, userRole, logout, loadMenu, loadBills, loadSettings, menu,
  } = useStore();
  const [view, setView] = useState<View>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      loadSettings();
      loadBills();
      loadMenu();
      autoCleanup();
    }
  }, [isLoggedIn, loadSettings, loadBills, loadMenu]);

  // Force-refresh menu to latest version (checks version key in localStorage)
  useEffect(() => {
    if (!isLoggedIn) return;
    const MENU_VERSION = 'v6'; // bump this whenever menu-data.ts changes
    const storedVersion = typeof window !== 'undefined'
      ? localStorage.getItem('bsfoods_menu_version')
      : null;
    if (storedVersion !== MENU_VERSION || menu.length === 0) {
      Promise.all([import('@/lib/storage'), import('@/lib/menu-data')]).then(
        ([{ getMenu, saveMenu }, { migrateMenu }]) => {
          const currentMenu = getMenu();
          const updatedMenu = migrateMenu(currentMenu);
          saveMenu(updatedMenu);
          if (typeof window !== 'undefined') {
            localStorage.setItem('bsfoods_menu_version', MENU_VERSION);
          }
          loadMenu();
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, loadMenu]); // intentionally omit menu.length to run once on login

  const handleNavigate = useCallback((v: string) => {
    setView(v as View);
    setSidebarOpen(false);
  }, []);

  // Filter nav items by role
  const visibleNav = NAV_ITEMS.filter(
    (n) => !n.roles || n.roles.includes(userRole),
  );

  // SSR guard
  if (!mounted) {
    return (
      <div className="min-h-screen bg-mesh flex items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-electric flex items-center justify-center animate-pulse">
          <Coffee className="w-6 h-6 text-white" />
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-mesh">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-white/[0.06] bg-white/[0.01] backdrop-blur-sm">
        {/* Logo */}
        <div className="p-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-electric flex items-center justify-center shadow-neon">
              <Coffee className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold gradient-text">BS FOODS</h1>
              <p className="text-white/30 text-[10px] uppercase tracking-widest">Billing System</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {visibleNav.map((item) => (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                view === item.id
                  ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20 shadow-neon'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </motion.button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-white/[0.06] space-y-3">
          <div className="flex items-center gap-2 text-xs text-white/30">
            <div className={`w-2 h-2 rounded-full ${
              userRole === 'owner' ? 'bg-yellow-400' : userRole === 'admin' ? 'bg-primary-400' : 'bg-emerald-400'
            }`} />
            <span className="capitalize">{userRole}</span>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-navy-900 z-50 flex flex-col border-r border-white/[0.06] lg:hidden"
            >
              <div className="p-6 border-b border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-electric flex items-center justify-center">
                    <Coffee className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-display text-lg font-bold gradient-text">BS FOODS</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-xl hover:bg-white/5">
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-1">
                {visibleNav.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      view === item.id
                        ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                        : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ))}
              </nav>
              <div className="p-4 border-t border-white/[0.06]">
                <button
                  onClick={() => { logout(); setSidebarOpen(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-white/[0.06]">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl hover:bg-white/5">
            <Menu className="w-5 h-5 text-white/60" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent-electric flex items-center justify-center">
              <Coffee className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display text-sm font-bold gradient-text">BS FOODS</span>
          </div>
          <div className={`w-2 h-2 rounded-full ${
            userRole === 'owner' ? 'bg-yellow-400' : userRole === 'admin' ? 'bg-primary-400' : 'bg-emerald-400'
          }`} />
        </header>

        {/* Content Area */}
        <div className={`flex-1 overflow-y-auto ${view === 'pos' ? 'p-0' : 'p-4 md:p-6'}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={view === 'pos' ? 'h-full p-4 md:p-6' : ''}
            >
              {view === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}
              {view === 'pos' && <POSBilling onNavigate={handleNavigate} />}
              {view === 'reports' && <ReportsView />}
              {view === 'menu' && <MenuManagement />}
              {view === 'settings' && <SettingsView />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="lg:hidden flex items-center border-t border-white/[0.06] bg-navy-950/80 backdrop-blur-xl safe-area-bottom">
          {visibleNav.slice(0, 5).map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-3 transition-all ${
                view === item.id ? 'text-primary-400' : 'text-white/30'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
              {view === item.id && (
                <motion.div
                  layoutId="bottomNavDot"
                  className="w-1 h-1 rounded-full bg-primary-400 mt-0.5"
                />
              )}
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
}
