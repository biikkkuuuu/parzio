import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../../types';
import { X, Sparkles, Image, Tag, Droplet, ShieldCheck, DollarSign, Package, Plus, Check } from 'lucide-react';

interface AdminProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProduct: (product: Product) => void;
  initialProduct?: Product | null; // If present, edit mode; otherwise create mode
  categories?: (string | { name: string })[];
  defaultCategory?: string;
  onAddNewCategory?: (name: string) => void;
}

const DEFAULT_CATEGORIES = [
  'Necklaces',
  'Earrings',
  'Rings',
  'Bracelets',
  'Anklets'
];

export const AdminProductModal: React.FC<AdminProductModalProps> = ({
  isOpen,
  onClose,
  onSaveProduct,
  initialProduct,
  categories,
  defaultCategory,
  onAddNewCategory
}) => {
  const isEditing = !!initialProduct;

  const [name, setName] = useState('');
  const [category, setCategory] = useState<string>('Necklaces');
  const [isAddingNewCat, setIsAddingNewCat] = useState(false);
  const [newCatInput, setNewCatInput] = useState('');
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [price, setPrice] = useState('99');
  const [originalPrice, setOriginalPrice] = useState('1499');
  const [sku, setSku] = useState('PRZ-DROP-01');
  const [image, setImage] = useState('');
  const [stock, setStock] = useState('50');
  const [material, setMaterial] = useState('316L Surgical Stainless Steel • 18K Real Gold PVD Plating');
  const [isWaterproof, setIsWaterproof] = useState(true);
  const [isAntiTarnish, setIsAntiTarnish] = useState(true);
  const [badge, setBadge] = useState('₹99 VAULT SPECIAL');
  const [description, setDescription] = useState('Anti-tarnish, sweat-proof, perfume-safe demi-fine jewelry designed for daily luxury.');

  const allCategories = useMemo(() => {
    const set = new Set<string>(DEFAULT_CATEGORIES);
    if (categories) {
      categories.forEach((c) => {
        const catName = typeof c === 'string' ? c : c.name;
        if (catName) set.add(catName);
      });
    }
    customCategories.forEach((c) => set.add(c));
    if (category) set.add(category);
    return Array.from(set);
  }, [categories, customCategories, category]);

  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name);
      setCategory(initialProduct.category);
      setPrice(String(initialProduct.price));
      setOriginalPrice(String(initialProduct.originalPrice));
      setSku(initialProduct.sku);
      setImage(initialProduct.image);
      setStock(String(initialProduct.stock ?? 45));
      setMaterial(initialProduct.material);
      setIsWaterproof(initialProduct.isWaterproof);
      setIsAntiTarnish(initialProduct.isAntiTarnish);
      setBadge(initialProduct.badge || '');
      setDescription(initialProduct.description);
    } else {
      setName('');
      setCategory(defaultCategory || 'Necklaces');
      setPrice('99');
      setOriginalPrice('1499');
      setSku(`PRZ-${Date.now().toString().slice(-5)}`);
      setImage('https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80');
      setStock('50');
      setMaterial('316L Surgical Stainless Steel • 18K Real Gold PVD Plating');
      setIsWaterproof(true);
      setIsAntiTarnish(true);
      setBadge('₹99 VAULT SPECIAL');
      setDescription('Anti-tarnish, sweat-proof, perfume-safe demi-fine jewelry designed for daily luxury.');
    }
  }, [initialProduct, isOpen, defaultCategory]);

  if (!isOpen) return null;

  const numPrice = Number(price) || 99;
  const numOrig = Number(originalPrice) || 1499;
  const savePercent = numOrig > numPrice ? Math.round(((numOrig - numPrice) / numOrig) * 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const savedProduct: Product = {
      id: initialProduct?.id || `prod-custom-${Date.now()}`,
      name: name.trim(),
      category,
      price: numPrice,
      originalPrice: numOrig,
      savePercent,
      rating: initialProduct?.rating || 4.9,
      reviewsCount: initialProduct?.reviewsCount || 128,
      colorways: initialProduct?.colorways || 1,
      image: image.trim() || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
      hoverImage: initialProduct?.hoverImage,
      description: description.trim(),
      sku: sku.trim() || `PRZ-${Date.now().toString().slice(-5)}`,
      material,
      isWaterproof,
      isAntiTarnish,
      badge: badge.trim() || undefined,
      quote: initialProduct?.quote || 'Handcrafted in limited batches at Mumbai Atelier.',
      stock: Number(stock) || 50,
      isLive: initialProduct?.isLive !== false
    };

    onSaveProduct(savedProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-[#eae5dc] shadow-2xl overflow-hidden my-6 animate-fadeIn">
        
        {/* Header */}
        <div className="bg-[#141414] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[#fed488]" />
            <div>
              <h3 className="font-display text-base font-bold text-white">
                {isEditing ? `Edit Product: ${initialProduct.name}` : 'Add New Atelier Drop to Storefront'}
              </h3>
              <p className="text-[11px] text-[#fed488]">
                {isEditing ? 'Update pricing, stock ledger, images, or details' : 'Direct live storefront synchronization'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto">
          
          {/* Row 1: Product Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
                Product Title / Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. PARZIO Byzantine 18K Chain"
                className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 text-xs font-bold text-[#141414] focus:outline-none focus:border-[#8c7138]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[10px] font-bold uppercase text-[#747878]">
                  Category *
                </label>
                {!isAddingNewCat ? (
                  <button
                    type="button"
                    onClick={() => setIsAddingNewCat(true)}
                    className="text-[10px] text-[#8c7138] hover:text-[#141414] font-bold flex items-center gap-0.5 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>New</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsAddingNewCat(false)}
                    className="text-[10px] text-[#747878] hover:text-rose-600 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {isAddingNewCat ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={newCatInput}
                    onChange={(e) => setNewCatInput(e.target.value)}
                    placeholder="New category..."
                    className="flex-1 bg-[#faf8f5] border border-[#8c7138] rounded-xl px-2.5 py-1.5 text-xs font-semibold text-[#141414] focus:outline-none"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newCatInput.trim()) {
                          const formatted = newCatInput.trim();
                          setCustomCategories((prev) => [...prev, formatted]);
                          setCategory(formatted);
                          if (onAddNewCategory) onAddNewCategory(formatted);
                          setNewCatInput('');
                          setIsAddingNewCat(false);
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newCatInput.trim()) {
                        const formatted = newCatInput.trim();
                        setCustomCategories((prev) => [...prev, formatted]);
                        setCategory(formatted);
                        if (onAddNewCategory) onAddNewCategory(formatted);
                        setNewCatInput('');
                        setIsAddingNewCat(false);
                      }
                    }}
                    className="p-2 rounded-xl bg-[#8c7138] text-white hover:bg-[#141414] transition-colors cursor-pointer"
                    title="Add Category"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 text-xs font-semibold text-[#141414] focus:outline-none focus:border-[#8c7138]"
                >
                  {allCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Row 2: Price, Original Price & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
                Selling Price (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-xs text-[#8c7138]">₹</span>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl pl-7 pr-3 py-2 text-xs font-bold text-[#141414] focus:outline-none focus:border-[#8c7138]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
                Original MRP (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-xs text-[#747878]">₹</span>
                <input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl pl-7 pr-3 py-2 text-xs text-[#747878] focus:outline-none focus:border-[#8c7138]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
                Stock In Hand
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 text-xs font-bold text-[#141414] focus:outline-none focus:border-[#8c7138]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
                SKU Identifier *
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#8c7138] focus:outline-none focus:border-[#8c7138]"
              />
            </div>
          </div>

          {/* Row 3: Image URL with live preview */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
              Image URL *
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="url"
                required
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 text-xs text-[#141414] focus:outline-none focus:border-[#8c7138]"
              />
              <div className="w-10 h-10 rounded-xl bg-[#faf8f5] border border-[#eae5dc] flex items-center justify-center overflow-hidden flex-shrink-0">
                {image ? (
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Image className="w-4 h-4 text-[#747878]" />
                )}
              </div>
            </div>
          </div>

          {/* Row 4: Description */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
              Description &amp; Highlights
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 text-xs text-[#141414] focus:outline-none focus:border-[#8c7138]"
            />
          </div>

          {/* Row 5: Material & Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
                Material &amp; Plating
              </label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 text-xs text-[#141414] focus:outline-none focus:border-[#8c7138]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
                Promo Badge Text
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. ₹99 VAULT SPECIAL or BEST SELLER"
                className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 text-xs text-[#141414] focus:outline-none focus:border-[#8c7138]"
              />
            </div>
          </div>

          {/* Row 6: Quality Switches */}
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#141414]">
              <input
                type="checkbox"
                checked={isWaterproof}
                onChange={(e) => setIsWaterproof(e.target.checked)}
                className="rounded text-[#8c7138] focus:ring-[#8c7138]"
              />
              <span className="flex items-center gap-1">
                <Droplet className="w-3.5 h-3.5 text-[#8c7138]" /> 100% Waterproof Certified
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#141414]">
              <input
                type="checkbox"
                checked={isAntiTarnish}
                onChange={(e) => setIsAntiTarnish(e.target.checked)}
                className="rounded text-[#8c7138] focus:ring-[#8c7138]"
              />
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8c7138]" /> Lifetime Anti-Tarnish
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#eae5dc]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full border border-[#eae5dc] text-xs font-semibold hover:bg-[#faf8f5] text-[#444748] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-[#141414] hover:bg-[#8c7138] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#fed488]" />
              <span>{isEditing ? 'Save Changes' : 'Publish Product Drop'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
