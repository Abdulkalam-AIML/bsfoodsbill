'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ShoppingCart, Plus, Minus, Trash2, User, Phone,
  Hash, FileText, Printer, MessageCircle,
  UtensilsCrossed, Percent, X, ArrowLeft, ImageOff, CheckCircle2
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { downloadThermalReceipt, downloadKOTReceipt, printBill } from '@/lib/pdf';
import { sendWhatsApp, shareWhatsAppNoNumber } from '@/lib/whatsapp';
import { toast } from 'sonner';
import type { MenuItem } from '@/types';

import Image from 'next/image';

/* ─────────── Optimized image card with Next.js ─────────── */
function MenuItemImage({ src, alt }: { src: string; alt: string }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full h-28 overflow-hidden rounded-xl bg-white/[0.04]">
      {!loaded && (
        <div className="absolute inset-0 skeleton rounded-xl z-10" />
      )}
      <Image
        src={imgSrc}
        alt={alt}
        width={400}
        height={300}
        className={`object-cover w-full h-full transition-all duration-500 ${
          loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
        }`}
        onLoad={() => setLoaded(true)}
        onError={() => setImgSrc('/fallback-food.jpg')}
        loading="lazy"
        unoptimized={false}
      />
    </div>
  );
}

/* ─────────── Menu item card ─────────── */
function MenuCard({
  item,
  inCart,
  qty,
  currency,
  onAdd,
}: {
  item: MenuItem;
  inCart: boolean;
  qty: number;
  currency: string;
  onAdd: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onAdd}
      className={`relative flex flex-col glass-card overflow-hidden text-left transition-all duration-200 group
        hover:border-primary-500/40 hover:-translate-y-0.5 hover:shadow-card-hover
        ${inCart ? 'border-primary-500/50 bg-primary-500/[0.05] shadow-neon' : ''}
      `}
    >
      {/* Image */}
      <MenuItemImage src={item.image} alt={item.imageAlt || item.name} />

      {/* Badges */}
      <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
        {item.bestSeller && (
          <span className="badge badge-orange text-[9px] px-1.5 py-0.5 backdrop-blur-sm">★ Best</span>
        )}
        {item.badge && (
          <span className="badge badge-cyan text-[9px] px-1.5 py-0.5 backdrop-blur-sm">{item.badge}</span>
        )}
      </div>

      {/* Cart qty indicator */}
      {inCart && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary-500 text-[11px] font-bold text-white flex items-center justify-center shadow-neon"
        >
          {qty}
        </motion.div>
      )}

      {/* Info */}
      <div className="p-3 flex flex-col gap-1 flex-1">
        <p className="text-xs font-semibold text-white leading-tight line-clamp-2 group-hover:text-primary-200 transition-colors">
          {item.name}
        </p>
        <p className="text-[10px] text-white/35 truncate">{item.category}</p>
        <div className="flex items-center justify-between mt-auto pt-1">
          <span className="text-sm font-bold text-primary-400">{currency}{item.price}</span>
          <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
            inCart
              ? 'bg-primary-500 text-white'
              : 'bg-white/[0.06] text-white/40 group-hover:bg-primary-500/20 group-hover:text-primary-400'
          }`}>
            <Plus className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </motion.button>
  );
}

/* ─────────── Table Selection Grid ─────────── */
function TableGrid({ 
  tables, 
  activeTable, 
  onSelect, 
  onClear 
}: { 
  tables: import('@/types').TableState[];
  activeTable: string;
  onSelect: (num: number) => void;
  onClear: (num: number) => void;
}) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 p-3 shrink-0">
      {tables.map((table) => {
        const isOccupied = table.status === 'occupied';
        const isActive = activeTable === table.number.toString();
        
        return (
          <motion.button
            key={table.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(table.number)}
            className={`relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-300 ${
              isActive 
                ? 'border-primary-500 bg-primary-500/10 shadow-neon' 
                : isOccupied
                  ? 'border-orange-500/50 bg-orange-500/5 shadow-[0_0_15px_rgba(249,115,22,0.1)]'
                  : 'border-white/5 bg-white/[0.02] hover:bg-white/5'
            }`}
          >
            <span className={`text-[10px] font-bold uppercase tracking-wider ${
              isOccupied ? 'text-orange-400' : 'text-white/40'
            }`}>
              Table {table.number}
            </span>
            {isOccupied && (
              <div className="mt-1 flex flex-col items-center">
                <span className="text-[9px] text-orange-200/60 leading-none">
                  {table.items.length} items
                </span>
                <span className="text-[10px] font-black text-orange-400 mt-0.5">
                  ₹{table.items.reduce((s, i) => s + (i.price * i.quantity), 0)}
                </span>
              </div>
            )}
            {!isOccupied && <span className="text-[9px] text-emerald-400/40 mt-1">Available</span>}
            
            {isOccupied && isActive && (
              <button 
                onClick={(e) => { e.stopPropagation(); onClear(table.number); }}
                className="absolute -top-1 -right-1 p-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500 transition-all hover:text-white"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

/* ─────────── Main POS Billing ─────────── */
export default function POSBilling({ onNavigate }: { onNavigate: (v: string) => void }) {
  const {
    menu, cart, addToCart, removeFromCart, updateQuantity, clearCart,
    orderType, setOrderType, tableNumber, setTableNumber,
    paymentMethod, setPaymentMethod,
    discountType, setDiscountType, discountValue, setDiscountValue,
    subtotal, discountAmount, total, createBill, updateBill, settings, userRole,
    searchQuery, setSearchQuery, activeCategory, setActiveCategory,
    tables, holdTable, resumeTable, clearTable, completeOrder, loadTables,
    billPrinted, billWhatsappSent, setBillStatus, resetBillStatus
  } = useStore();

  const [showCart, setShowCart] = useState(false);
  const [printKOT, setPrintKOT] = useState(true);
  const [printCustomer, setPrintCustomer] = useState(true);

  // Initialize tables on mount
  useState(() => {
    loadTables();
  });

  const handleTableSelect = (num: number) => {
    if (tableNumber === num.toString()) return;
    
    // If current cart has items and no table is assigned, or a different table is assigned, 
    // maybe prompt to hold? For simplicity, we just resume the selected table.
    resumeTable(num);
  };

  // Categories from live menu
  const categories = useMemo(() => {
    const cats = Array.from(new Set(menu.map((m) => m.category)));
    return ['All', ...cats];
  }, [menu]);

  // Filtered menu
  const filteredMenu = useMemo(() => {
    let items = menu.filter((m) => m.available);
    if (activeCategory !== 'All') {
      items = items.filter((m) => m.category === activeCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (m) => m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q),
      );
    }
    return items;
  }, [menu, activeCategory, searchQuery]);

  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);
  const sub = subtotal();
  const disc = discountAmount();
  const tot = total();

  const handleFinalize = useCallback(
    async (print: boolean, whatsapp: boolean) => {
      if (cart.length === 0) {
        toast.error('Cart is empty!');
        return;
      }

      const storeState = useStore.getState();

      // 1. Create or update existing bill
      let bill;
      if (!storeState.currentBillId) {
        bill = createBill(false, false);
        storeState.setBillStatus(false, false);
        // @ts-ignore
        storeState.currentBillId = bill.id;
      } else {
        const billId = storeState.currentBillId;
        bill = updateBill(billId, {
          items: cart,
          subtotal: sub,
          discount: disc,
          discountType,
          discountValue,
          total: tot,
          orderType,
          tableNumber,
          paymentMethod,
        });
      }

      if (!bill) return;

      // 2. Perform requested actions
      if (print) {
        if (!printKOT && !printCustomer) {
          toast.error('Please enable at least one print option!');
          return;
        }
        try {
          await printBill(bill, settings, { printKOT, printCustomer });
          if (printCustomer) {
            setBillStatus(true, undefined);
          }
          useStore.getState().updateBillStatus(bill.id, printCustomer ? true : undefined, undefined, printKOT, printCustomer);
          toast.success('Receipt sent to printer');
        } catch (e) {
          console.error(e);
          if (printKOT) downloadKOTReceipt(bill, settings);
          if (printCustomer) downloadThermalReceipt(bill, settings);
          if (printCustomer) {
            setBillStatus(true, undefined);
          }
          useStore.getState().updateBillStatus(bill.id, printCustomer ? true : undefined, undefined, printKOT, printCustomer);
          toast.success('Receipt downloaded');
        }
      }

      if (whatsapp) {
        shareWhatsAppNoNumber(bill, settings);
        setBillStatus(undefined, true);
        useStore.getState().updateBillStatus(bill.id, undefined, true);
        toast.success('WhatsApp bill shared');
      }

      // 3. Check for full completion
      const updatedStoreState = useStore.getState();
      if (updatedStoreState.billPrinted && updatedStoreState.billWhatsappSent) {
        completeOrder();
        resetBillStatus();
        setShowCart(false);
        toast.success(`✅ Bill #${bill.billNumber} Completed Successfully!`, {
          duration: 5000,
          icon: '🎉',
        });
      } else {
        const remaining = !updatedStoreState.billPrinted ? 'Print' : 'WhatsApp';
        toast.info(`Please complete ${remaining} to finish the bill.`, {
          icon: '⏳',
        });
      }
    },
    [cart, createBill, updateBill, settings, completeOrder, setBillStatus, resetBillStatus, printKOT, printCustomer, sub, disc, tot, discountType, discountValue, orderType, tableNumber, paymentMethod],
  );

  const cartPanelProps = {
    cart, updateQuantity, removeFromCart, clearCart,
    sub, disc, tot, settings,
    orderType, setOrderType,
    tableNumber, setTableNumber,
    paymentMethod, setPaymentMethod,
    discountType, setDiscountType,
    discountValue, setDiscountValue,
    userRole, onFinalize: handleFinalize,
    printKOT, setPrintKOT,
    printCustomer, setPrintCustomer,
    onHold: () => {
      const num = parseInt(tableNumber);
      if (isNaN(num)) { toast.error('Please select a table first!'); return; }
      holdTable(num);
      toast.success(`Bill held for Table ${num}`);
    }
  };

  return (
    <div className="flex flex-col h-full -m-4 md:-m-6">
      {/* Top Bar */}
      <div className="flex items-center gap-3 p-3 md:p-4 border-b border-white/[0.06] shrink-0">
        <button onClick={() => onNavigate('dashboard')} className="lg:hidden p-2 rounded-xl hover:bg-white/5">
          <ArrowLeft className="w-5 h-5 text-white/60" />
        </button>
        <div className="flex-1">
          <h1 className="font-display text-lg md:text-xl font-bold text-white">POS Billing</h1>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCart(true)}
          className="lg:hidden relative p-2.5 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-400"
        >
          <ShoppingCart className="w-5 h-5" />
          {cartCount > 0 && (
            <motion.span
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary-500 text-[10px] font-bold text-white flex items-center justify-center"
            >
              {cartCount}
            </motion.span>
          )}
        </motion.button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Left: Menu Area ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Table Management */}
          <TableGrid 
            tables={tables} 
            activeTable={tableNumber} 
            onSelect={handleTableSelect} 
            onClear={clearTable} 
          />

          <div className="border-t border-white/[0.06] pt-1">
            {/* Search */}
            <div className="p-3 pb-2 shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="glass-input pl-10 py-2.5"
                />
              </div>
            </div>

            {/* Category chips */}
            <div className="px-3 py-2 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all duration-200 whitespace-nowrap ${
                    activeCategory === cat
                      ? 'bg-primary-500 text-white shadow-neon'
                      : 'bg-white/[0.04] text-white/50 border border-white/[0.06] hover:bg-white/[0.08] hover:text-white/80'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Menu grid */}
          <div className="flex-1 overflow-y-auto p-3 pt-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
              {filteredMenu.map((item) => {
                const inCart = !!cart.find((c) => c.id === item.id);
                const qty = cart.find((c) => c.id === item.id)?.quantity || 0;
                return (
                  <MenuCard
                    key={item.id}
                    item={item}
                    inCart={inCart}
                    qty={qty}
                    currency={settings.currency}
                    onAdd={() => {
                      addToCart(item);
                      toast.success(`Added!`, { duration: 800 });
                    }}
                  />
                );
              })}
            </div>

            {filteredMenu.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-white/30">
                <UtensilsCrossed className="w-12 h-12 mb-3 opacity-50" />
                <p className="text-sm">No items found</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Cart (Desktop) ── */}
        <div className="hidden lg:flex w-[360px] flex-col border-l border-white/[0.06] bg-white/[0.01] shrink-0">
          <CartPanelContent {...cartPanelProps} />
        </div>
      </div>

      {/* Mobile Cart Drawer */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-navy-900 z-50 flex flex-col lg:hidden border-l border-white/[0.06]"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
                <h2 className="font-display text-lg font-bold text-white">
                  Cart {cartCount > 0 && <span className="text-primary-400">({cartCount})</span>}
                </h2>
                <button onClick={() => setShowCart(false)} className="p-2 rounded-xl hover:bg-white/5">
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <CartPanelContent {...cartPanelProps} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────── Cart Panel ─────────── */
interface CartPanelProps {
  cart: import('@/lib/store').AppState['cart'];
  updateQuantity: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  sub: number;
  disc: number;
  tot: number;
  settings: import('@/lib/store').AppState['settings'];
  orderType: 'dine-in' | 'takeaway';
  setOrderType: (v: 'dine-in' | 'takeaway') => void;
  tableNumber: string;
  setTableNumber: (v: string) => void;
  paymentMethod: 'cash' | 'upi' | 'card';
  setPaymentMethod: (v: 'cash' | 'upi' | 'card') => void;
  discountType: 'percentage' | 'fixed';
  setDiscountType: (v: 'percentage' | 'fixed') => void;
  discountValue: number;
  setDiscountValue: (v: number) => void;
  userRole: string;
  onFinalize: (print: boolean, whatsapp: boolean) => void;
  printKOT: boolean;
  setPrintKOT: (v: boolean) => void;
  printCustomer: boolean;
  setPrintCustomer: (v: boolean) => void;
  onHold: () => void;
}

function CartPanelContent({
  cart, updateQuantity, removeFromCart, clearCart,
  sub, disc, tot, settings,
  orderType, setOrderType, tableNumber, setTableNumber,
  paymentMethod, setPaymentMethod,
  discountType, setDiscountType, discountValue, setDiscountValue,
  userRole, onFinalize, printKOT, setPrintKOT, printCustomer, setPrintCustomer, onHold
}: CartPanelProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-white/30">
            <ShoppingCart className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm font-medium">Cart is empty</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/40 uppercase tracking-wider font-semibold">
                {cart.reduce((s, c) => s + c.quantity, 0)} items
              </span>
              <button onClick={onHold} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-400 text-xs font-bold border border-orange-500/20 hover:bg-orange-500/20 transition-all">
                <UtensilsCrossed className="w-3 h-3" /> Hold Bill
              </button>
            </div>
            <AnimatePresence mode="popLayout">
              {cart.map((item) => (
                <motion.div
                  key={item.id} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]"
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-white/[0.04]">
                    <Image src={item.image} alt={item.name} width={40} height={40} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate leading-tight">{item.name}</p>
                    <p className="text-xs text-primary-400 font-semibold mt-0.5">
                      {settings.currency}{(item.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                      <Minus className="w-3 h-3 text-white/60" />
                    </button>
                    <span className="w-5 text-center text-xs font-bold text-white">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 rounded-lg bg-primary-500/20 hover:bg-primary-500/30 flex items-center justify-center transition-colors">
                      <Plus className="w-3 h-3 text-primary-400" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Order Details */}
            <div className="space-y-2.5 pt-3 border-t border-white/[0.06] mt-3">
              <div className="flex gap-2">
                {(['dine-in', 'takeaway'] as const).map((t) => (
                  <button key={t} onClick={() => setOrderType(t)}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                      orderType === t ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'bg-white/[0.03] text-white/40 border border-white/[0.06]'
                    }`}
                  >
                    {t === 'dine-in' ? '🍽️ Dine-In' : '📦 Takeaway'}
                  </button>
                ))}
              </div>

              <div className="flex gap-1.5">
                {(['cash', 'upi', 'card'] as const).map((m) => (
                  <button key={m} onClick={() => setPaymentMethod(m)}
                    className={`flex-1 py-2 rounded-lg text-[11px] font-semibold transition-all ${
                      paymentMethod === m ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/[0.03] text-white/40 border border-white/[0.06]'
                    }`}
                  >
                    {m.toUpperCase()}
                  </button>
                ))}
              </div>

              {userRole === 'owner' && (
                <div className="space-y-2">
                  <div className="flex gap-2 items-center">
                    <Percent className="w-3.5 h-3.5 text-white/30 shrink-0" />
                    <input type="number" placeholder="Discount" value={discountValue || ''}
                      onChange={(e) => setDiscountValue(Number(e.target.value))}
                      className="glass-input py-2 text-xs flex-1" min={0} />
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setDiscountType('fixed');
                        setDiscountValue(99);
                      }}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-semibold transition-all border ${
                        discountType === 'fixed' && discountValue === 99
                          ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                          : 'bg-white/[0.03] text-white/40 border-white/[0.06] hover:bg-white/[0.06]'
                      }`}
                    >
                      🎁 ₹99 Offer
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDiscountType('fixed');
                        setDiscountValue(150);
                      }}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-semibold transition-all border ${
                        discountType === 'fixed' && discountValue === 150
                          ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                          : 'bg-white/[0.03] text-white/40 border-white/[0.06] hover:bg-white/[0.06]'
                      }`}
                    >
                      🎁 ₹150 Offer
                    </button>
                    {(discountValue === 99 || discountValue === 150) && (
                      <button
                        type="button"
                        onClick={() => {
                          setDiscountValue(0);
                        }}
                        className="py-1.5 px-2 rounded-lg text-[10px] font-semibold transition-all border bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Cart Footer */}
      {cart.length > 0 && (
        <div className="p-4 border-t border-white/[0.06] bg-white/[0.02] space-y-3 shrink-0">
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-white/50">
              <span>Subtotal</span>
              <span>{settings.currency}{sub.toLocaleString('en-IN')}</span>
            </div>
            {disc > 0 && (
              <div className="flex justify-between text-red-400 text-sm">
                <span>Discount</span>
                <span>-{settings.currency}{disc.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-white font-display text-lg font-bold pt-1.5 border-t border-white/[0.06]">
              <span>Total</span>
              <span className="text-primary-400">{settings.currency}{tot.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Print Toggles */}
          <div className="flex flex-col gap-2.5 p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl my-1.5">
            <label className="flex items-center gap-2 text-xs text-white/70 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={printKOT} 
                onChange={(e) => setPrintKOT(e.target.checked)} 
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-primary-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <span>Print Kitchen Ticket (KOT)</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-white/70 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={printCustomer} 
                onChange={(e) => setPrintCustomer(e.target.checked)} 
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-primary-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <span>Print Customer Bill</span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <motion.button 
              whileTap={{ scale: 0.95 }} 
              onClick={() => onFinalize(true, false)} 
              className={`btn-primary py-3 text-xs flex items-center justify-center gap-2 ${
                useStore.getState().billPrinted ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : ''
              }`}
            >
              {useStore.getState().billPrinted ? <CheckCircle2 className="w-4 h-4" /> : <Printer className="w-4 h-4" />}
              {useStore.getState().billPrinted ? 'Printed' : 'Print'}
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.95 }} 
              onClick={() => onFinalize(false, true)} 
              className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs font-semibold transition-all ${
                useStore.getState().billWhatsappSent 
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                  : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20'
              }`}
            >
              {useStore.getState().billWhatsappSent ? <CheckCircle2 className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
              {useStore.getState().billWhatsappSent ? 'Sent' : 'WhatsApp'}
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
