import React, { useState } from 'react';
import { Product } from '../../types';
import { AdminProductModal } from './AdminProductModal';
import {
  Plus,
  Search,
  AlertCircle,
  CheckCircle2,
  Edit2,
  Trash2,
  Sparkles,
  Droplet,
  Tag,
  Eye,
  EyeOff
} from 'lucide-react';

interface AdminInventoryViewProps {
  products: Product[];
  onOpenNewProductModal: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateStock: (productId: string, newStock: number) => void;
  onToggleLive: (productId: string) => void;
  onTriggerToast: (msg: string) => void;
}

export const AdminInventoryView: React.FC<AdminInventoryViewProps> = ({
  products,
  onOpenNewProductModal,
  onEditProduct,
  onDeleteProduct,
  onUpdateStock,
  onToggleLive,
  onTriggerToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  
  // Modals for Edit and Delete
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const filteredProducts = products.filter((prod) => {
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedCategory === 'ALL') return true;
    return prod.category.toUpperCase() === selectedCategory.toUpperCase();
  });

  const lowStockCount = products.filter((p) => (p.stock ?? 45) < 15).length;

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="bg-white rounded-3xl p-5 border border-[#eae5dc] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-base font-bold text-[#141414] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#8c7138]" />
            Atelier Jewelry Vault Inventory ({products.length} Drops)
          </h3>
          <p className="text-xs text-[#747878] mt-0.5">
            Add new designs, edit prices &amp; descriptions, adjust real-time stock, or remove archived items.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {lowStockCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
              <AlertCircle className="w-3.5 h-3.5" />
              {lowStockCount} Low Stock Alert
            </span>
          )}

          <button
            onClick={onOpenNewProductModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#141414] text-white hover:bg-[#8c7138] text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4 text-[#fed488]" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#747878] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by SKU, Product Name, Category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white pl-10 pr-4 py-2 rounded-full text-xs text-[#141414] border border-[#eae5dc] focus:outline-none focus:border-[#8c7138] shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {['ALL', 'NECKLACES', 'EARRINGS', 'RINGS', 'BRACELETS', 'ANKLETS'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#141414] text-white'
                  : 'bg-white text-[#444748] hover:bg-[#eae5dc] border border-[#eae5dc]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Products Table */}
      <div className="bg-white rounded-3xl border border-[#eae5dc] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#faf8f5] border-b border-[#eae5dc] text-[10px] font-bold uppercase text-[#747878]">
                <th className="py-3 px-5">Product &amp; SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Quality Specs</th>
                <th className="py-3 px-4">Stock In Hand</th>
                <th className="py-3 px-4 text-center">Storefront Status</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f2ee]">
              {filteredProducts.map((product) => {
                const stock = product.stock ?? 45;
                const isLow = stock < 15;
                const isLive = product.isLive !== false;

                return (
                  <tr key={product.id} className="hover:bg-[#faf8f5] transition-colors">
                    
                    {/* Product & SKU */}
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#faf8f5] border border-[#eae5dc] p-1 flex items-center justify-center flex-shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain mix-blend-multiply"
                          />
                        </div>
                        <div>
                          <p className="font-display font-bold text-[#141414]">
                            {product.name}
                          </p>
                          <p className="font-mono text-[11px] text-[#8c7138] mt-0.5">
                            {product.sku}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-[#faf8f5] border border-[#eae5dc] text-[10px] font-bold uppercase text-[#444748]">
                        {product.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-bold text-[#141414] text-sm">
                          ₹{product.price}
                        </span>
                        <span className="text-[#747878] line-through text-[11px]">
                          ₹{product.originalPrice}
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-700 font-bold">
                        SAVE {product.savePercent}%
                      </span>
                    </td>

                    {/* Quality Specs */}
                    <td className="py-3 px-4 text-[#444748]">
                      <div className="flex items-center gap-1 text-[11px]">
                        <Droplet className="w-3.5 h-3.5 text-[#8c7138]" />
                        <span>18K PVD Waterproof</span>
                      </div>
                    </td>

                    {/* Stock Counter with Quick Adjustment */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onUpdateStock(product.id, Math.max(0, stock - 1))}
                          className="w-6 h-6 rounded-full bg-[#f4f2ee] hover:bg-[#eae5dc] text-xs font-bold flex items-center justify-center"
                        >
                          -
                        </button>
                        <span
                          className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                            isLow ? 'bg-amber-100 text-amber-800' : 'text-[#141414]'
                          }`}
                        >
                          {stock} units
                        </span>
                        <button
                          onClick={() => onUpdateStock(product.id, stock + 10)}
                          className="px-1.5 py-0.5 rounded-full bg-[#f4f2ee] hover:bg-[#eae5dc] text-[10px] font-bold text-[#8c7138]"
                        >
                          +10
                        </button>
                      </div>
                    </td>

                    {/* Live Toggle */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onToggleLive(product.id)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                          isLive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-zinc-200 text-zinc-600'
                        }`}
                      >
                        {isLive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{isLive ? 'Active Live' : 'Draft'}</span>
                      </button>
                    </td>

                    {/* Actions: Edit & Delete */}
                    <td className="py-3 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingProduct(product)}
                          title="Edit Product Details"
                          className="p-1.5 rounded-full bg-[#faf8f5] hover:bg-[#eae5dc] text-[#141414] border border-[#eae5dc] transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setProductToDelete(product)}
                          title="Delete / Remove Product"
                          className="p-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <AdminProductModal
          isOpen={true}
          initialProduct={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSaveProduct={(updated) => {
            onEditProduct(updated);
            onTriggerToast(`Updated "${updated.name}" successfully!`);
            setEditingProduct(null);
          }}
        />
      )}

      {/* Delete Product Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#eae5dc] shadow-2xl space-y-4 animate-fadeIn">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h4 className="font-bold text-base text-[#141414]">Remove "{productToDelete.name}"?</h4>
              <p className="text-xs text-[#747878] mt-1">
                Are you sure you want to delete this piece (SKU: {productToDelete.sku}) permanently from the store catalog?
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 rounded-full border border-[#eae5dc] text-xs font-semibold hover:bg-[#faf8f5]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteProduct(productToDelete.id);
                  onTriggerToast(`Removed "${productToDelete.name}" from storefront.`);
                  setProductToDelete(null);
                }}
                className="px-5 py-2 rounded-full bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
