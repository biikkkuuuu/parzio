import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../../types';
import { DeviceImageUpload } from './DeviceImageUpload';
import { X, Sparkles, Image, Tag, Droplet, ShieldCheck, DollarSign, Package, Plus, Check, ArrowLeft, Trash2, Layers } from 'lucide-react';

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
  const [extraImages, setExtraImages] = useState<string[]>([]);
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
      const otherImages = initialProduct.images && initialProduct.images.length > 0
        ? initialProduct.images.filter((img) => img !== initialProduct.image)
        : (initialProduct.hoverImage && initialProduct.hoverImage !== initialProduct.image ? [initialProduct.hoverImage] : []);
      setExtraImages(otherImages);
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
      setImage('');
      setExtraImages([]);
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

    const mainImg = image.trim() || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80';
    const validExtraImages = extraImages.filter((img) => Boolean(img && img.trim()));
    const allProductImages = [mainImg, ...validExtraImages];

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
      image: mainImg,
      images: allProductImages,
      hoverImage: validExtraImages[0] || initialProduct?.hoverImage || mainImg,
      description: description.trim(),
      sku: sku.trim() || `PRZ-${Date.now().toString().slice(-5)}`,
      material,
      isWaterproof,
      isAntiTarnish,
      badge: badge.trim() || undefined,
      quote: initialProduct?.quote || 'Premium handcrafted demi-fine daily luxury jewelry.',
      stock: Number(stock) || 50,
      isLive: initialProduct?.isLive !== false
    };

    onSaveProduct(savedProduct);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#fbf9f6] text-[#141414] overflow-y-auto animate-fadeIn min-h-screen">
      {/* Sticky Top Header Bar */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#eae5dc] shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-2xl bg-[#faf8f5] border border-[#eae5dc] hover:border-[#8c7138] hover:bg-[#8c7138]/10 text-[#141414] hover:text-[#8c7138] flex items-center justify-center transition-all cursor-pointer shadow-2xs shrink-0"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c7138] bg-[#faf8f5] px-2.5 py-0.5 rounded-full border border-[#eae5dc]">
                  Store Catalog
                </span>
                <span className="text-[#eae5dc]">•</span>
                <span className="text-[11px] font-semibold text-[#747878]">
                  {isEditing ? 'Edit Product' : 'Add New Product'}
                </span>
              </div>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-[#141414] mt-0.5">
                {isEditing ? `Edit: ${initialProduct.name}` : 'Add New Product to Store'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-[#eae5dc] text-xs font-semibold text-[#747878] hover:bg-[#faf8f5] hover:text-[#141414] transition-colors cursor-pointer"
            >
              Discard &amp; Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-7 py-2.5 rounded-full bg-[#141414] hover:bg-[#8c7138] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md active:scale-95 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#fed488]" />
              <span>{isEditing ? 'Save Changes' : 'Save & Publish Product'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Page Body */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-24">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Product Essential Info (Title, Category, Price, Stock, SKU, Material, Features) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Product Basic Info Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#eae5dc] shadow-xs space-y-5">
                <h3 className="text-sm font-bold text-[#141414] uppercase tracking-wider flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#8c7138]" />
                  <span>General Information</span>
                </h3>

                {/* Product Title */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#747878] mb-1.5">
                    Product Title / Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. PARZIO Byzantine 18K Chain"
                    className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-4 py-3 text-sm font-bold text-[#141414] placeholder-[#a09e97] focus:outline-none focus:border-[#8c7138] focus:bg-white transition-all shadow-2xs"
                  />
                </div>

                {/* Category Selection */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#747878]">
                      Assigned Category <span className="text-rose-500">*</span>
                    </label>
                    {!isAddingNewCat ? (
                      <button
                        type="button"
                        onClick={() => setIsAddingNewCat(true)}
                        className="text-xs text-[#8c7138] hover:text-[#141414] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Create New Category</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsAddingNewCat(false)}
                        className="text-xs text-[#747878] hover:text-rose-600 font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  {isAddingNewCat ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newCatInput}
                        onChange={(e) => setNewCatInput(e.target.value)}
                        placeholder="Type new category name..."
                        className="flex-1 bg-[#faf8f5] border border-[#8c7138] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#141414] focus:outline-none"
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
                        className="px-4 py-2.5 rounded-xl bg-[#8c7138] text-white hover:bg-[#141414] transition-colors cursor-pointer text-xs font-bold flex items-center gap-1"
                      >
                        <Check className="w-4 h-4" />
                        <span>Add</span>
                      </button>
                    </div>
                  ) : (
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-4 py-3 text-xs font-semibold text-[#141414] focus:outline-none focus:border-[#8c7138] focus:bg-white cursor-pointer"
                    >
                      {allCategories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#747878] mb-1.5">
                    Description &amp; Highlights
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Anti-tarnish, sweat-proof, perfume-safe demi-fine jewelry designed for daily luxury."
                    className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-4 py-3 text-xs text-[#141414] focus:outline-none focus:border-[#8c7138] focus:bg-white leading-relaxed"
                  />
                </div>
              </div>

              {/* Pricing & Inventory Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#eae5dc] shadow-xs space-y-5">
                <h3 className="text-sm font-bold text-[#141414] uppercase tracking-wider flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#8c7138]" />
                  <span>Pricing &amp; Inventory</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#747878] mb-1.5">
                      Selling Price (₹) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-sm text-[#8c7138]">₹</span>
                      <input
                        type="number"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl pl-8 pr-4 py-3 text-sm font-bold text-[#141414] focus:outline-none focus:border-[#8c7138] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#747878] mb-1.5">
                      Original MRP (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-sm text-[#747878]">₹</span>
                      <input
                        type="number"
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(e.target.value)}
                        className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl pl-8 pr-4 py-3 text-sm text-[#747878] focus:outline-none focus:border-[#8c7138] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#747878] mb-1.5">
                      Stock In Hand
                    </label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-4 py-3 text-sm font-bold text-[#141414] focus:outline-none focus:border-[#8c7138] focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#747878] mb-1.5">
                      SKU Identifier <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-4 py-3 text-xs font-mono font-bold text-[#8c7138] focus:outline-none focus:border-[#8c7138] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#747878] mb-1.5">
                      Material &amp; Plating
                    </label>
                    <input
                      type="text"
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-4 py-3 text-xs text-[#141414] focus:outline-none focus:border-[#8c7138] focus:bg-white"
                    />
                  </div>
                </div>

                {/* Quality Switches */}
                <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-[#eae5dc]">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-[#141414]">
                    <input
                      type="checkbox"
                      checked={isWaterproof}
                      onChange={(e) => setIsWaterproof(e.target.checked)}
                      className="rounded text-[#8c7138] focus:ring-[#8c7138] w-4 h-4"
                    />
                    <span className="flex items-center gap-1.5">
                      <Droplet className="w-4 h-4 text-[#8c7138]" /> 100% Waterproof Certified
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-[#141414]">
                    <input
                      type="checkbox"
                      checked={isAntiTarnish}
                      onChange={(e) => setIsAntiTarnish(e.target.checked)}
                      className="rounded text-[#8c7138] focus:ring-[#8c7138] w-4 h-4"
                    />
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#8c7138]" /> Lifetime Anti-Tarnish
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Imagery & Promotional Badging */}
            <div className="lg:col-span-5 space-y-6">
              {/* Product Photo Upload Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#eae5dc] shadow-xs space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#141414] uppercase tracking-wider flex items-center gap-2">
                    <Image className="w-4 h-4 text-[#8c7138]" />
                    <span>Product Visual Assets</span>
                  </h3>
                  <span className="text-[11px] font-bold text-[#8c7138] bg-[#faf8f5] px-2.5 py-0.5 rounded-full border border-[#eae5dc]">
                    {1 + extraImages.filter(Boolean).length} Photos
                  </span>
                </div>

                {/* Primary / Cover Image */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#141414]">
                    <span className="w-2 h-2 rounded-full bg-[#8c7138]"></span>
                    <span>Primary Cover Photo <span className="text-rose-500">*</span></span>
                    <span className="text-[10px] text-[#747878] font-normal">(Shown on Storefront Grid)</span>
                  </div>
                  <DeviceImageUpload
                    label=""
                    required
                    value={image}
                    onChange={setImage}
                    recommendedSize="1:1 Square • 800 × 800px"
                    aspectRatio="square"
                  />
                </div>

                {/* Additional Gallery Photos */}
                <div className="pt-2 border-t border-[#eae5dc] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[#141414] uppercase tracking-wider flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-[#8c7138]" />
                        <span>Additional Product Photos</span>
                      </h4>
                      <p className="text-[11px] text-[#747878] mt-0.5">
                        Add alternate angles, on-model look, or detail shots (swipeable slider on product page).
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setExtraImages((prev) => [...prev, ''])}
                      className="px-3 py-1.5 rounded-xl bg-[#faf8f5] hover:bg-[#8c7138] text-[#8c7138] hover:text-white border border-[#eae5dc] hover:border-[#8c7138] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Photo</span>
                    </button>
                  </div>

                  {/* List of Extra Image Slots */}
                  {extraImages.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-[#faf8f5] border border-dashed border-[#dfd7ca] text-center space-y-2">
                      <p className="text-xs font-medium text-[#747878]">
                        No additional photos added yet.
                      </p>
                      <button
                        type="button"
                        onClick={() => setExtraImages([''])}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8c7138] hover:underline cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Click here to add Photo #2</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {extraImages.map((extraImg, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-[#faf8f5] rounded-2xl border border-[#eae5dc] space-y-2 relative group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8c7138] flex items-center gap-1">
                              <span>Photo #{idx + 2} (Gallery View)</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setExtraImages((prev) => prev.filter((_, i) => i !== idx));
                              }}
                              className="text-xs font-semibold text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer transition-colors p-1"
                              title="Delete this photo slot"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          </div>

                          <DeviceImageUpload
                            label=""
                            value={extraImg}
                            onChange={(newVal) => {
                              setExtraImages((prev) => {
                                const copy = [...prev];
                                copy[idx] = newVal;
                                return copy;
                              });
                            }}
                            recommendedSize="1:1 Square • 800 × 800px"
                            aspectRatio="square"
                          />
                        </div>
                      ))}

                      <div className="text-right">
                        <button
                          type="button"
                          onClick={() => setExtraImages((prev) => [...prev, ''])}
                          className="text-xs font-bold text-[#8c7138] hover:text-[#141414] inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Add Another Angle Photo</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Size Specifications Guide */}
                <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#eae5dc] space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs">📐</span>
                    <h5 className="text-xs font-bold text-[#141414] uppercase tracking-wider">
                      Product Photo Specifications
                    </h5>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5 text-[11px]">
                    <div className="bg-white p-2.5 rounded-xl border border-[#eae5dc]">
                      <span className="text-[#8c7138] font-bold block uppercase text-[10px]">Resolution</span>
                      <strong className="text-[#141414] text-xs">800 × 800 px</strong>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-[#eae5dc]">
                      <span className="text-[#8c7138] font-bold block uppercase text-[10px]">Ratio</span>
                      <strong className="text-[#141414] text-xs">1:1 Square</strong>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-[#eae5dc]">
                      <span className="text-[#8c7138] font-bold block uppercase text-[10px]">Format</span>
                      <strong className="text-[#141414] text-xs">JPG / PNG / WebP</strong>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-[#eae5dc]">
                      <span className="text-[#8c7138] font-bold block uppercase text-[10px]">Max Size</span>
                      <strong className="text-[#141414] text-xs">Under 4 MB</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Promo Badge / Tag Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#eae5dc] shadow-xs space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#141414] uppercase tracking-wider flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#8c7138]" />
                    <span>Product Tag &amp; Badge</span>
                  </h3>
                  {badge && (
                    <button
                      type="button"
                      onClick={() => setBadge('')}
                      className="text-[11px] font-bold text-rose-500 hover:underline cursor-pointer"
                    >
                      Clear Tag
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <p className="text-xs text-[#747878]">
                    Click a preset badge below or type your custom promo badge:
                  </p>

                  {/* 1-Click Tag Presets */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: '✨ NEW LAUNCH', value: 'NEW LAUNCH' },
                      { label: '🔥 BEST SELLER', value: 'BEST SELLER' },
                      { label: '👑 NEW COLLECTION', value: 'NEW COLLECTION' },
                      { label: '⚡ ₹99 SPECIAL', value: '₹99 VAULT SPECIAL' }
                    ].map((tag) => (
                      <button
                        key={tag.value}
                        type="button"
                        onClick={() => setBadge(tag.value)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          badge === tag.value
                            ? 'bg-[#8c7138] text-white shadow-xs'
                            : 'bg-[#faf8f5] text-[#747878] border border-[#eae5dc] hover:border-[#8c7138] hover:text-[#141414]'
                        }`}
                      >
                        {tag.label}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="Or type custom badge..."
                    className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-4 py-3 text-xs font-semibold text-[#141414] focus:outline-none focus:border-[#8c7138] focus:bg-white shadow-2xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#eae5dc]">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-full border border-[#eae5dc] text-xs font-semibold hover:bg-[#faf8f5] text-[#444748] transition-colors cursor-pointer"
            >
              Discard &amp; Back
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 rounded-full bg-[#141414] hover:bg-[#8c7138] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#fed488]" />
              <span>{isEditing ? 'Save Changes' : 'Save & Publish Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
