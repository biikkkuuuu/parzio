import React, { useState } from 'react';
import { Product } from '../../types';
import { X, Sparkles, Plus, Image as ImageIcon } from 'lucide-react';

interface AdminNewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Product) => void;
}

export const AdminNewProductModal: React.FC<AdminNewProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Necklaces' | 'Earrings' | 'Rings' | 'Bracelets' | 'Anklets'>('Necklaces');
  const [price, setPrice] = useState('99');
  const [originalPrice, setOriginalPrice] = useState('1299');
  const [sku, setSku] = useState(`PARZIO-${Math.floor(100 + Math.random() * 900)}`);
  const [material, setMaterial] = useState('18K Gold PVD on 316L Stainless Steel');
  const [stock, setStock] = useState('50');
  const [image, setImage] = useState(
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80'
  );
  const [description, setDescription] = useState(
    '18K gold finished anti-tarnish demi-fine piece designed for everyday hypoallergenic wear with triple-layer moisture seal.'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const pPrice = Number(price) || 99;
    const pOrig = Number(originalPrice) || 1299;
    const pSave = Math.max(1, Math.round(((pOrig - pPrice) / pOrig) * 100));

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: name.startsWith('PARZIO') ? name : `PARZIO ${name}`,
      category,
      price: pPrice,
      originalPrice: pOrig,
      savePercent: pSave,
      rating: 4.9,
      reviewsCount: 12,
      colorways: 1,
      image: image.trim() || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
      description,
      sku,
      material,
      isWaterproof: true,
      isAntiTarnish: true,
      badge: 'NEW DROP',
      stock: Number(stock) || 50,
      isLive: true
    };

    onAddProduct(newProd);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#eae5dc] overflow-hidden my-8 animate-fadeIn">
        
        {/* Header */}
        <div className="bg-[#141414] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#fed488]" />
            <h3 className="font-display text-base font-bold uppercase tracking-wider text-[#fed488]">
              Add New Atelier Jewellery Drop
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 text-white/70 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          <div>
            <label className="block font-bold text-[#141414] uppercase tracking-wider text-[10px] mb-1">
              Product Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Baroque Pearl Drop Earrings"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3.5 py-2.5 text-xs text-[#141414] focus:outline-none focus:border-[#8c7138]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#141414] uppercase tracking-wider text-[10px] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 text-xs text-[#141414] focus:outline-none focus:border-[#8c7138]"
              >
                <option value="Necklaces">Necklaces</option>
                <option value="Earrings">Earrings</option>
                <option value="Rings">Rings</option>
                <option value="Bracelets">Bracelets</option>
                <option value="Anklets">Anklets</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#141414] uppercase tracking-wider text-[10px] mb-1">
                SKU Code
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 text-xs font-mono text-[#8c7138] focus:outline-none focus:border-[#8c7138]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-[#141414] uppercase tracking-wider text-[10px] mb-1">
                Vault Price (₹) *
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 text-xs font-bold text-[#141414] focus:outline-none focus:border-[#8c7138]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#141414] uppercase tracking-wider text-[10px] mb-1">
                MRP Price (₹)
              </label>
              <input
                type="number"
                required
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 text-xs text-[#747878] focus:outline-none focus:border-[#8c7138]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#141414] uppercase tracking-wider text-[10px] mb-1">
                Initial Stock
              </label>
              <input
                type="number"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 text-xs font-bold text-emerald-800 focus:outline-none focus:border-[#8c7138]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#141414] uppercase tracking-wider text-[10px] mb-1">
              High-Res Image URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="flex-1 bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 text-xs text-[#141414] focus:outline-none focus:border-[#8c7138]"
              />
              <div className="w-9 h-9 rounded-xl border border-[#eae5dc] bg-[#faf8f5] overflow-hidden flex items-center justify-center flex-shrink-0">
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#141414] uppercase tracking-wider text-[10px] mb-1">
              Material &amp; Plating Specs
            </label>
            <input
              type="text"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 text-xs text-[#141414] focus:outline-none focus:border-[#8c7138]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#141414] uppercase tracking-wider text-[10px] mb-1">
              Short Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 text-xs text-[#141414] focus:outline-none focus:border-[#8c7138]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#eae5dc]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-[#eae5dc] text-xs font-semibold hover:bg-[#f4f2ee] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-[#141414] text-white hover:bg-[#8c7138] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-[#fed488]" />
              Publish To Vault
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
