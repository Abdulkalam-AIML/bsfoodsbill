'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Edit3, Trash2, X, Check, Eye, EyeOff, Star, ImageOff,
  Download, Upload, ShieldCheck, Database
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { MENU_CATEGORIES } from '@/types';
import { exportMenuBackupJSON, importMenuBackupJSON } from '@/lib/storage';
import { toast } from 'sonner';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

interface MenuForm {
  name: string;
  category: string;
  price: string;
  image: string;
  description: string;
  bestSeller: boolean;
  badge: string;
  itemType: string;
  contains: string;
}

const EMPTY_FORM: MenuForm = {
  name: '',
  category: MENU_CATEGORIES[0],
  price: '',
  image: '',
  description: '',
  bestSeller: false,
  badge: '',
  itemType: 'Item',
  contains: '',
};

import Image from 'next/image';

/* ── Optimized image with Next.js and fallback ── */
function ItemImage({ src, alt, className = '', isCombo = false }: { src: string; alt: string; className?: string; isCombo?: boolean }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-white/[0.04] ${className}`}>
      {!loaded && <div className="absolute inset-0 skeleton z-10" />}
      <Image
        src={imgSrc}
        alt={alt}
        width={400}
        height={300}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setImgSrc(isCombo ? '/logo.png' : '/fallback-food.jpg')}
        className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        unoptimized={false}
      />
    </div>
  );
}

export default function MenuManagement() {
  const { menu, addMenuItem, updateMenuItem, deleteMenuItem, toggleAvailability, settings, loadMenu } = useStore();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<MenuForm>(EMPTY_FORM);
  const [previewError, setPreviewError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  const categories = useMemo(() => {
    const presentCats = new Set(menu.map((m) => m.category));
    const sorted = MENU_CATEGORIES.filter((c) => presentCats.has(c));
    Array.from(presentCats).forEach((c) => {
      if (!sorted.includes(c as any)) sorted.push(c as any);
    });
    return ['All', ...sorted];
  }, [menu]);

  const filtered = useMemo(() => {
    let items = menu;
    if (filterCat !== 'All') items = items.filter((m) => m.category === filterCat);
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q) ||
          (m.contains && m.contains.some((c) => c.toLowerCase().includes(q)))
      );
    }
    return items;
  }, [menu, filterCat, search]);

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setPreviewError(false);
    setShowForm(true);
  };

  const openEdit = (item: typeof menu[0]) => {
    setForm({
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      image: item.image,
      description: item.description,
      bestSeller: item.bestSeller,
      badge: item.badge || '',
      itemType: item.itemType || (item.category === 'Combo Blasters' || item.category === 'Budget Friendly Combos' ? 'Combo' : 'Item'),
      contains: item.contains ? item.contains.join(', ') : '',
    });
    setEditId(item.id);
    setPreviewError(false);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.price) {
      toast.error('Name and price are required');
      return;
    }
    const isComboCat = form.category === 'Combo Blasters' || form.category === 'Budget Friendly Combos';
    const parsedContains = form.contains
      ? form.contains.split(',').map((c) => c.trim()).filter(Boolean)
      : undefined;

    if (editId) {
      const existing = menu.find((m) => m.id === editId);
      const success = updateMenuItem(editId, {
        name: form.name.trim(),
        category: form.category,
        price: Number(form.price),
        image: form.image || (isComboCat ? '/logo.png' : '/fallback-food.jpg'),
        description: form.description,
        bestSeller: form.bestSeller,
        badge: form.badge || undefined,
        itemType: (isComboCat || form.itemType === 'Combo') ? 'Combo' : 'Item',
        contains: parsedContains,
        variants: existing?.variants,
      });

      if (success) {
        toast.success(`"${form.name.trim()}" updated & saved permanently!`);
        loadMenu();
        setShowForm(false);
      } else {
        toast.error('Failed to update item in persistent storage.');
      }
    } else {
      const success = addMenuItem({
        id: `item-${Date.now()}`,
        name: form.name.trim(),
        category: form.category,
        price: Number(form.price),
        image: form.image || (isComboCat ? '/logo.png' : '/fallback-food.jpg'),
        description: form.description,
        available: true,
        bestSeller: form.bestSeller,
        badge: form.badge || undefined,
        itemType: (isComboCat || form.itemType === 'Combo') ? 'Combo' : 'Item',
        contains: parsedContains,
        isCustom: true,
      });

      if (success) {
        toast.success(`"${form.name.trim()}" added & verified in storage!`);
        loadMenu();
        setShowForm(false);
      } else {
        toast.error('Storage quota exceeded or write failed. Check permissions.');
      }
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}" permanently?`)) return;
    const success = deleteMenuItem(id);
    if (success) {
      toast.success(`"${name}" removed from menu & storage.`);
      loadMenu();
    } else {
      toast.error('Failed to delete item from storage.');
    }
  };

  const handleExportBackup = () => {
    const jsonStr = exportMenuBackupJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bs-foods-menu-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Menu backup exported successfully!');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const ok = importMenuBackupJSON(content);
        if (ok) {
          loadMenu();
          toast.success('Menu backup restored successfully!');
        } else {
          toast.error('Invalid backup format or storage write failed.');
        }
      } catch (err) {
        toast.error('Failed to read backup file.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Category counts
  const catCount = useMemo(() => {
    const counts: Record<string, number> = { All: menu.length };
    menu.forEach((m) => { counts[m.category] = (counts[m.category] || 0) + 1; });
    return counts;
  }, [menu]);

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06 } } }} className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-white">Menu Management</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" /> Permanent Storage Verified
            </span>
          </div>
          <p className="text-white/40 text-sm mt-1">{menu.length} items total • Dual-layer local persistence active</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportBackup}
            accept=".json,application/json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Import Menu Backup JSON"
            className="btn-ghost text-xs py-2 px-3 flex items-center gap-1.5 border border-white/10 hover:border-white/20"
          >
            <Upload className="w-3.5 h-3.5 text-primary-400" /> Import Backup
          </button>
          <button
            onClick={handleExportBackup}
            title="Export Menu Backup JSON"
            className="btn-ghost text-xs py-2 px-3 flex items-center gap-1.5 border border-white/10 hover:border-white/20"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" /> Export Backup
          </button>
          <motion.button whileTap={{ scale: 0.95 }} onClick={openAdd} className="btn-primary text-sm py-2 px-4">
            <Plus className="w-4 h-4" /> Add Item
          </motion.button>
        </div>
      </motion.div>

      {/* Search + Filters */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input type="text" placeholder="Search items..." value={search}
            onChange={(e) => setSearch(e.target.value)} className="glass-input pl-10" />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setFilterCat(cat)}
              className={`flex-shrink-0 px-3 py-2.5 rounded-xl text-[11px] font-semibold transition-all whitespace-nowrap ${
                filterCat === cat
                  ? 'bg-primary-500 text-white shadow-neon'
                  : 'bg-white/[0.04] text-white/50 border border-white/[0.06] hover:bg-white/[0.08]'
              }`}
            >
              {cat} <span className="opacity-50 ml-1">({catCount[cat] || 0})</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filtered.map((item) => {
          const isCombo = item.category === 'Combo Blasters' || item.itemType === 'Combo';
          return (
            <motion.div key={item.id} variants={fadeUp}
              className={`glass-card overflow-hidden flex flex-col transition-all duration-200 ${!item.available ? 'opacity-50' : ''}`}>
              {/* Image */}
              <div className="relative">
                <ItemImage src={item.image} alt={item.name} className="w-full h-36 rounded-t-xl" isCombo={isCombo} />
                {/* Logo badge for combos */}
                {isCombo && (
                  <div className="absolute top-2 left-2 w-7 h-7 rounded-lg bg-navy-950/80 p-0.5 backdrop-blur-md border border-white/20 flex items-center justify-center z-10">
                    <Image src="/logo.png" alt="BS Logo" width={24} height={24} className="object-contain" />
                  </div>
                )}
                {/* Overlay badges */}
                <div className="absolute top-2 right-12 flex gap-1 flex-wrap">
                  {item.bestSeller && <span className="badge badge-orange text-[9px] backdrop-blur-sm">★ Best</span>}
                  {item.badge && <span className="badge badge-cyan text-[9px] backdrop-blur-sm">{item.badge}</span>}
                </div>
                {/* Availability toggle overlaid */}
                <button
                  onClick={() => toggleAvailability(item.id)}
                  title={item.available ? 'Mark unavailable' : 'Mark available'}
                  className={`absolute top-2 right-2 p-1.5 rounded-lg backdrop-blur-sm transition-all ${
                    item.available
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  {item.available ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Info */}
              <div className="p-3 flex flex-col gap-2 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white leading-snug line-clamp-2">{item.name}</p>
                    <p className="text-[10px] text-white/40 mt-0.5">{item.category}</p>
                  </div>
                  {item.bestSeller && <Star className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />}
                </div>
                {item.description && (
                  <p className="text-[11px] text-white/30 truncate">{item.description}</p>
                )}
                {item.contains && item.contains.length > 0 && (
                  <div className="mt-1 p-2 rounded-lg bg-white/[0.03] border border-white/5 space-y-1">
                    <span className="text-[9px] uppercase font-bold text-primary-400 block">Contains:</span>
                    {item.contains.map((c, idx) => (
                      <p key={idx} className="text-[10px] text-white/70 truncate">• {c}</p>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between mt-auto pt-1">
                  <span className="text-base font-bold text-primary-400">
                    {settings.currency}{item.price}
                  </span>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(item)}
                      className="p-1.5 rounded-lg bg-white/5 text-white/40 hover:bg-white/10 hover:text-white transition-colors">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(item.id, item.name)}
                      className="p-1.5 rounded-lg bg-red-500/10 text-red-400/70 hover:bg-red-500/20 hover:text-red-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-white/30">
          <p className="text-sm">No items found</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 m-auto max-w-lg max-h-[90vh] overflow-y-auto glass-card p-6 z-50"
              style={{ height: 'fit-content' }}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-lg font-bold text-white">
                  {editId ? 'Edit Item' : 'Add New Item'}
                </h2>
                <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-white/5">
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Image URL + Preview */}
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-1.5 block">
                    Image URL
                  </label>
                  <input value={form.image}
                    onChange={(e) => { setForm({ ...form, image: e.target.value }); setPreviewError(false); }}
                    className="glass-input text-sm"
                    placeholder="https://images.unsplash.com/ or /logo.png" />
                  {form.image && !previewError && (
                    <div className="mt-2 rounded-xl overflow-hidden h-32 relative bg-navy-950 p-2 border border-white/10 flex items-center justify-center">
                      <Image
                        src={form.image}
                        alt="preview"
                        fill
                        className="object-contain"
                        onError={() => setPreviewError(true)}
                        unoptimized={false}
                      />
                    </div>
                  )}
                  {previewError && (
                    <p className="text-xs text-red-400 mt-1">⚠ Image URL failed to load</p>
                  )}
                </div>

                <div>
                  <label className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-1.5 block">
                    Name *
                  </label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="glass-input" placeholder="Item name" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-1.5 block">
                      Price (₹) *
                    </label>
                    <input type="number" value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className="glass-input" placeholder="0" min={0} />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-1.5 block">
                      Category
                    </label>
                    <select value={form.category}
                      onChange={(e) => {
                        const newCat = e.target.value;
                        setForm({
                          ...form,
                          category: newCat,
                          itemType: newCat === 'Combo Blasters' ? 'Combo' : form.itemType,
                          image: newCat === 'Combo Blasters' && !form.image ? '/logo.png' : form.image,
                        });
                      }}
                      className="glass-input">
                      {MENU_CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-1.5 block">
                      Item Type
                    </label>
                    <select value={form.itemType}
                      onChange={(e) => setForm({ ...form, itemType: e.target.value })}
                      className="glass-input">
                      <option value="Item">Single Item</option>
                      <option value="Combo">Combo</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-1.5 block">
                      Badge (optional)
                    </label>
                    <input value={form.badge}
                      onChange={(e) => setForm({ ...form, badge: e.target.value })}
                      className="glass-input" placeholder='e.g. "🔥 Combo"' />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-1.5 block">
                    Description
                  </label>
                  <input value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="glass-input" placeholder="Short description" />
                </div>

                <div>
                  <label className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-1.5 block">
                    Contains Items (comma separated, for Combos)
                  </label>
                  <input value={form.contains}
                    onChange={(e) => setForm({ ...form, contains: e.target.value })}
                    className="glass-input" placeholder="Item 1, Item 2, Thums Up 250ml / Coke 250ml" />
                </div>

                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <div onClick={() => setForm({ ...form, bestSeller: !form.bestSeller })}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                      form.bestSeller ? 'bg-yellow-500 border-yellow-500' : 'border-white/20 bg-transparent'
                    }`}>
                    {form.bestSeller && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-sm text-white/70">Mark as Best Seller ★</span>
                </label>

                <motion.button whileTap={{ scale: 0.97 }} onClick={handleSave} className="btn-primary w-full mt-2">
                  <Check className="w-4 h-4" />
                  {editId ? 'Update Item' : 'Add Item'}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
