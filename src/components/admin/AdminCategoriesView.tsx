import React, { useState } from 'react';
import { CategoryItem, Product } from '../../types';
import { AdminProductModal } from './AdminProductModal';
import { DeviceImageUpload } from './DeviceImageUpload';
import {
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  Package,
  Layers,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Tag,
  Flame,
  Crown,
  Grid,
  ListFilter
} from 'lucide-react';

interface AdminCategoriesViewProps {
  categories: CategoryItem[];
  products: Product[];
  onAddCategory: (category: CategoryItem) => void;
  onEditCategory: (oldName: string, updatedCategory: CategoryItem) => void;
  onDeleteCategory: (categoryName: string) => void;
  onAddProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onTriggerToast: (msg: string) => void;
}

const PRESET_IMAGES = [
  {
    label: 'Necklaces & Chains',
    url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80'
  },
  {
    label: 'Earrings & Studs',
    url: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=400&q=80'
  },
  {
    label: 'Rings & Bands',
    url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&q=80'
  },
  {
    label: 'Bracelets & Cuffs',
    url: 'https://images.unsplash.com/photo-1611591475806-231908078ef4?auto=format&fit=crop&w=400&q=80'
  },
  {
    label: 'Anklets & Charms',
    url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80'
  }
];

const PROMO_TAGS = [
  {
    id: 'NEW LAUNCH',
    label: '✨ NEW LAUNCH',
    colorClass: 'bg-[#141414] text-[#fed488] border border-[#fed488]/50 shadow-xs'
  },
  {
    id: 'BEST SELLER',
    label: '🔥 BEST SELLER',
    colorClass: 'bg-rose-950 text-rose-200 border border-rose-600/60 shadow-xs'
  },
  {
    id: 'NEW COLLECTION',
    label: '👑 NEW COLLECTION',
    colorClass: 'bg-[#0d211a] text-[#7de3bf] border border-[#2e6d57] shadow-xs'
  }
];

export const AdminCategoriesView: React.FC<AdminCategoriesViewProps> = ({
  categories,
  products,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onAddProduct,
  onEditProduct,
  onTriggerToast
}) => {
  // View mode: 'products-by-category' | 'category-cards'
  const [activeViewMode, setActiveViewMode] = useState<'products-by-category' | 'category-cards'>('products-by-category');

  // Tag filter for quick filtering
  const [tagFilter, setTagFilter] = useState<'ALL' | 'NEW LAUNCH' | 'BEST SELLER' | 'NEW COLLECTION' | 'UNTAGGED'>('ALL');

  // Modals state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  // Expanded categories for viewing products in card mode
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Add product to specific category state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [targetCategoryForProduct, setTargetCategoryForProduct] = useState<string>('Necklaces');

  // Category Form State
  const [catName, setCatName] = useState('');
  const [catSubtitle, setCatSubtitle] = useState('');
  const [catImage, setCatImage] = useState('');

  const openAddCategoryModal = () => {
    setEditingCategory(null);
    setCatName('');
    setCatSubtitle('');
    setCatImage(PRESET_IMAGES[0].url);
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatSubtitle(cat.subtitle);
    setCatImage(cat.image);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) {
      onTriggerToast('Category name cannot be empty.');
      return;
    }

    const trimmedName = catName.trim();
    const newCategory: CategoryItem = {
      name: trimmedName,
      subtitle: catSubtitle.trim() || `${trimmedName} Collection`,
      image: catImage.trim() || PRESET_IMAGES[0].url
    };

    if (editingCategory) {
      onEditCategory(editingCategory.name, newCategory);
      onTriggerToast(`Updated category "${trimmedName}" successfully!`);
    } else {
      const exists = categories.some((c) => c.name.toLowerCase() === trimmedName.toLowerCase());
      if (exists) {
        onTriggerToast(`A category named "${trimmedName}" already exists.`);
        return;
      }
      onAddCategory(newCategory);
      onTriggerToast(`Created new category "${trimmedName}"!`);
    }

    setIsCategoryModalOpen(false);
  };

  const handleOpenAddProductForCategory = (categoryName: string) => {
    setTargetCategoryForProduct(categoryName);
    setIsProductModalOpen(true);
  };

  // Quick 1-Click Badge Tagger
  const handleQuickSetBadge = (product: Product, newBadge: string | undefined) => {
    onEditProduct({ ...product, badge: newBadge });
    onTriggerToast(
      newBadge
        ? `Tagged "${product.name}" with "${newBadge}"!`
        : `Removed tag from "${product.name}".`
    );
  };

  // Counts for summary
  const newLaunchCount = products.filter((p) => p.badge?.toUpperCase().includes('NEW LAUNCH')).length;
  const bestSellerCount = products.filter((p) => p.badge?.toUpperCase().includes('BEST SELLER')).length;
  const newCollectionCount = products.filter((p) => p.badge?.toUpperCase().includes('NEW COLLECTION')).length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Mode Switcher */}
      <div className="bg-white rounded-3xl p-5 border border-[#eae5dc] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-base font-bold text-[#141414] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#8c7138]" />
            Category &amp; Product Tag Manager ({categories.length} Collections • {products.length} Products)
          </h3>
          <p className="text-xs text-[#747878] mt-0.5">
            Assign products to categories, give 1-click tags (New Launch, Best Seller, New Collection), or add new categories.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Mode Switcher Buttons */}
          <div className="flex items-center gap-1 p-1 bg-[#faf8f5] border border-[#eae5dc] rounded-full text-xs">
            <button
              type="button"
              onClick={() => setActiveViewMode('products-by-category')}
              className={`px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                activeViewMode === 'products-by-category'
                  ? 'bg-[#141414] text-[#fed488] shadow-2xs'
                  : 'text-[#747878] hover:text-[#141414]'
              }`}
            >
              Products By Category &amp; Tags
            </button>
            <button
              type="button"
              onClick={() => setActiveViewMode('category-cards')}
              className={`px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                activeViewMode === 'category-cards'
                  ? 'bg-[#141414] text-[#fed488] shadow-2xs'
                  : 'text-[#747878] hover:text-[#141414]'
              }`}
            >
              Category Cards
            </button>
          </div>

          <button
            type="button"
            onClick={openAddCategoryModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#141414] text-white hover:bg-[#8c7138] text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 text-[#fed488]" />
            <span>Add New Category</span>
          </button>
        </div>
      </div>

      {/* Tag Summary & Filter Strip */}
      <div className="bg-white rounded-2xl p-4 border border-[#eae5dc] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-[#8c7138]" />
          <span className="text-xs font-bold text-[#141414] uppercase tracking-wider">
            Filter Products by Tag:
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            type="button"
            onClick={() => setTagFilter('ALL')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
              tagFilter === 'ALL'
                ? 'bg-[#141414] text-white shadow-2xs'
                : 'bg-[#faf8f5] text-[#747878] hover:text-[#141414] border border-[#eae5dc]'
            }`}
          >
            All Products ({products.length})
          </button>

          <button
            type="button"
            onClick={() => setTagFilter('NEW LAUNCH')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
              tagFilter === 'NEW LAUNCH'
                ? 'bg-[#141414] text-[#fed488] border border-[#fed488] shadow-2xs'
                : 'bg-[#faf8f5] text-[#8c7138] border border-[#eae5dc] hover:border-[#8c7138]'
            }`}
          >
            ✨ New Launch ({newLaunchCount})
          </button>

          <button
            type="button"
            onClick={() => setTagFilter('BEST SELLER')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
              tagFilter === 'BEST SELLER'
                ? 'bg-rose-950 text-rose-200 border border-rose-600 shadow-2xs'
                : 'bg-[#faf8f5] text-rose-700 border border-[#eae5dc] hover:border-rose-400'
            }`}
          >
            🔥 Best Seller ({bestSellerCount})
          </button>

          <button
            type="button"
            onClick={() => setTagFilter('NEW COLLECTION')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
              tagFilter === 'NEW COLLECTION'
                ? 'bg-[#0d211a] text-[#7de3bf] border border-[#2e6d57] shadow-2xs'
                : 'bg-[#faf8f5] text-emerald-800 border border-[#eae5dc] hover:border-emerald-400'
            }`}
          >
            👑 New Collection ({newCollectionCount})
          </button>
        </div>
      </div>

      {/* MODE 1: PRODUCTS BY CATEGORY WITH 1-CLICK TAGGING */}
      {activeViewMode === 'products-by-category' ? (
        <div className="space-y-6">
          {categories.map((category) => {
            let catProducts = products.filter(
              (p) => p.category.toLowerCase() === category.name.toLowerCase()
            );

            // Apply tag filter if active
            if (tagFilter !== 'ALL') {
              if (tagFilter === 'UNTAGGED') {
                catProducts = catProducts.filter((p) => !p.badge);
              } else {
                catProducts = catProducts.filter(
                  (p) => p.badge?.toUpperCase().includes(tagFilter)
                );
              }
            }

            return (
              <div
                key={category.name}
                className="bg-white rounded-3xl border border-[#eae5dc] overflow-hidden shadow-xs"
              >
                {/* Category Header Row */}
                <div className="p-4 sm:p-5 bg-[#fbf9f6] border-b border-[#eae5dc] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    {/* Category Thumbnail */}
                    <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-b from-[#c5a059] to-[#8c7138] shrink-0">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full rounded-full object-cover bg-white"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-[#141414] uppercase tracking-wide">
                          {category.name}
                        </h4>
                        <span className="text-[10px] font-mono font-bold bg-white border border-[#eae5dc] text-[#8c7138] px-2 py-0.5 rounded-full">
                          {catProducts.length} items
                        </span>
                      </div>
                      <p className="text-xs text-[#747878] mt-0.5">
                        {category.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenAddProductForCategory(category.name)}
                      className="px-3.5 py-1.5 rounded-full bg-[#141414] hover:bg-[#8c7138] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#fed488]" />
                      <span>Add Product to {category.name}</span>
                    </button>
                  </div>
                </div>

                {/* Products Table under this Category */}
                {catProducts.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#747878]">
                    No products matching current filter in {category.name}. Click "Add Product" above to create one!
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-[#faf8f5] border-b border-[#eae5dc] text-[10px] font-bold uppercase text-[#747878]">
                          <th className="py-2.5 px-4">Product</th>
                          <th className="py-2.5 px-3">Price</th>
                          <th className="py-2.5 px-3">Stock</th>
                          <th className="py-2.5 px-3">Assign Promo Tag</th>
                          <th className="py-2.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f4f2ee]">
                        {catProducts.map((p) => {
                          const currentBadge = p.badge?.toUpperCase() || '';
                          return (
                            <tr key={p.id} className="hover:bg-[#faf8f5]/60 transition-colors">
                              {/* Product Info */}
                              <td className="py-2.5 px-4">
                                <div className="flex items-center gap-2.5">
                                  <img
                                    src={p.image}
                                    alt={p.name}
                                    className="w-10 h-10 rounded-xl object-cover border border-[#eae5dc] bg-white shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <p className="font-bold text-[#141414] truncate max-w-xs sm:max-w-sm">
                                      {p.name}
                                    </p>
                                    <p className="text-[10px] font-mono text-[#747878]">
                                      SKU: {p.sku}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              {/* Price */}
                              <td className="py-2.5 px-3 font-bold text-[#141414] whitespace-nowrap">
                                ₹{p.price}{' '}
                                <span className="text-[10px] font-normal text-[#a3a3a3] line-through">
                                  ₹{p.originalPrice}
                                </span>
                              </td>

                              {/* Stock */}
                              <td className="py-2.5 px-3 font-mono font-semibold text-[#555] whitespace-nowrap">
                                {p.stock ?? 50} pcs
                              </td>

                              {/* 1-Click Promo Tag Buttons */}
                              <td className="py-2.5 px-3">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  {PROMO_TAGS.map((tag) => {
                                    const isTagged = currentBadge.includes(tag.id);
                                    return (
                                      <button
                                        key={tag.id}
                                        type="button"
                                        onClick={() =>
                                          handleQuickSetBadge(
                                            p,
                                            isTagged ? undefined : tag.id
                                          )
                                        }
                                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                                          isTagged
                                            ? `${tag.colorClass} ring-1 ring-[#8c7138] scale-105`
                                            : 'bg-white text-[#747878] border border-[#eae5dc] hover:border-[#8c7138] hover:text-[#141414]'
                                        }`}
                                        title={
                                          isTagged
                                            ? `Click to remove ${tag.id} tag`
                                            : `Click to set as ${tag.id}`
                                        }
                                      >
                                        {tag.label}
                                      </button>
                                    );
                                  })}

                                  {p.badge && (
                                    <button
                                      type="button"
                                      onClick={() => handleQuickSetBadge(p, undefined)}
                                      className="p-1 text-rose-500 hover:text-rose-700 cursor-pointer"
                                      title="Remove Tag"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              </td>

                              {/* Actions */}
                              <td className="py-2.5 px-4 text-right whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => onEditProduct(p)}
                                  className="text-xs font-semibold text-[#8c7138] hover:underline cursor-pointer"
                                >
                                  Edit Details
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* MODE 2: CATEGORY CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((category) => {
            const categoryProducts = products.filter(
              (p) => p.category.toLowerCase() === category.name.toLowerCase()
            );
            const isExpanded = expandedCategory === category.name;

            return (
              <div
                key={category.name}
                className="bg-white rounded-2xl border border-[#eae5dc] overflow-hidden shadow-xs hover:border-[#8c7138]/40 transition-all flex flex-col justify-between"
              >
                {/* Category Header Card */}
                <div className="p-4 sm:p-5">
                  <div className="flex items-start gap-4">
                    {/* Category Image Circle */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-gradient-to-b from-[#eadeca] via-[#c5a059]/40 to-[#eadeca] shrink-0">
                      <div className="w-full h-full rounded-full overflow-hidden bg-white shadow-inner">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover object-center"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = PRESET_IMAGES[0].url;
                          }}
                        />
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-sm sm:text-base font-bold text-[#141414] uppercase tracking-wide truncate">
                          {category.name}
                        </h4>
                        <span className="text-[10px] font-mono font-bold bg-[#faf8f5] border border-[#eae5dc] text-[#8c7138] px-2 py-0.5 rounded-full shrink-0">
                          {categoryProducts.length} items
                        </span>
                      </div>

                      <p className="text-xs text-[#747878] mt-1 line-clamp-2">
                        {category.subtitle}
                      </p>

                      {/* Quick Edit & Delete Icons */}
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#f4efea]">
                        <button
                          type="button"
                          onClick={() => openEditCategoryModal(category)}
                          className="text-[11px] font-semibold text-[#747878] hover:text-[#8c7138] flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>

                        <span className="text-[#e2ded6]">•</span>

                        <button
                          type="button"
                          onClick={() => setCategoryToDelete(category.name)}
                          className="text-[11px] font-semibold text-[#747878] hover:text-rose-600 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="bg-[#faf8f5] border-t border-[#eae5dc] p-3 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedCategory(isExpanded ? null : category.name)
                    }
                    className="text-xs font-semibold text-[#555] hover:text-[#141414] flex items-center gap-1 cursor-pointer"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-3.5 h-3.5 text-[#8c7138]" />
                        <span>Hide Products</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3.5 h-3.5 text-[#8c7138]" />
                        <span>View Products ({categoryProducts.length})</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenAddProductForCategory(category.name)}
                    className="px-3 py-1.5 rounded-lg bg-[#141414] hover:bg-[#8c7138] text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer active:scale-95"
                  >
                    <Plus className="w-3 h-3 text-[#fed488]" />
                    <span>Add Product</span>
                  </button>
                </div>

                {/* Expanded Product List for Category */}
                {isExpanded && (
                  <div className="p-3 bg-white border-t border-[#eae5dc] max-h-64 overflow-y-auto space-y-2">
                    {categoryProducts.length === 0 ? (
                      <div className="text-center py-4 text-xs text-[#747878]">
                        No products in this category yet. Click "Add Product" above to create one!
                      </div>
                    ) : (
                      categoryProducts.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#faf8f5] border border-[#eae5dc]"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-9 h-9 rounded-lg object-cover shrink-0 bg-white border border-[#eae5dc]"
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-[#141414] truncate">
                                {p.name}
                              </p>
                              <p className="text-[10px] text-[#747878]">
                                ₹{p.price} • SKU: {p.sku}
                              </p>
                            </div>
                          </div>

                          {/* Quick Tag Selector in Card view */}
                          <div className="flex items-center gap-1 shrink-0">
                            <select
                              value={p.badge || ''}
                              onChange={(e) => handleQuickSetBadge(p, e.target.value || undefined)}
                              className="text-[10px] font-bold bg-white border border-[#eae5dc] rounded-lg px-1.5 py-1 text-[#8c7138] focus:outline-none cursor-pointer"
                            >
                              <option value="">No Tag</option>
                              <option value="NEW LAUNCH">✨ NEW LAUNCH</option>
                              <option value="BEST SELLER">🔥 BEST SELLER</option>
                              <option value="NEW COLLECTION">👑 NEW COLLECTION</option>
                            </select>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#eae5dc] shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-[#eae5dc]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#faf8f5] border border-[#eae5dc] text-[#8c7138] flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <h4 className="font-display font-bold text-base text-[#141414]">
                  {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Create New Category'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1 rounded-full text-[#747878] hover:text-[#141414] hover:bg-[#faf8f5]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              {/* Category Name */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#747878] mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pendants, Chokers, Bangles, Sets"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 text-xs font-semibold text-[#141414] focus:outline-none focus:border-[#8c7138]"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#747878] mb-1">
                  Tagline / Subtitle
                </label>
                <input
                  type="text"
                  placeholder="e.g. 18K Real Gold Solitaires & Charms"
                  value={catSubtitle}
                  onChange={(e) => setCatSubtitle(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 text-xs font-medium text-[#141414] focus:outline-none focus:border-[#8c7138]"
                />
              </div>

              {/* Cover Photo Upload from Device */}
              <DeviceImageUpload
                label="Category Cover Photo"
                required
                value={catImage}
                onChange={setCatImage}
                recommendedSize="1:1 Square (400 × 400px) • Max 3MB"
                aspectRatio="circle"
                maxSizeMB={3}
              />

              {/* Quick Presets */}
              <div className="mt-2">
                <span className="text-[10px] text-[#747878] font-bold uppercase tracking-wider block mb-1">
                  Or Pick a Sample Preset:
                </span>
                <div className="grid grid-cols-5 gap-1.5">
                  {PRESET_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCatImage(preset.url)}
                      className={`w-full aspect-square rounded-lg overflow-hidden border transition-all cursor-pointer ${
                        catImage === preset.url
                          ? 'ring-2 ring-[#8c7138] border-transparent'
                          : 'border-[#eae5dc] opacity-70 hover:opacity-100'
                      }`}
                      title={preset.label}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#eae5dc]">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#eae5dc] text-xs font-semibold text-[#747878] hover:bg-[#faf8f5] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#141414] hover:bg-[#8c7138] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs active:scale-95"
                >
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Category Confirmation Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#eae5dc] shadow-2xl space-y-4 animate-fadeIn">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h4 className="font-bold text-base text-[#141414]">
                Delete "{categoryToDelete}"?
              </h4>
              <p className="text-xs text-[#747878] mt-1">
                Are you sure you want to remove this category from the store? Products in this category will not be deleted but can be reassigned.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="px-4 py-2 rounded-full border border-[#eae5dc] text-xs font-semibold hover:bg-[#faf8f5] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteCategory(categoryToDelete);
                  onTriggerToast(`Deleted category "${categoryToDelete}".`);
                  setCategoryToDelete(null);
                }}
                className="px-5 py-2 rounded-full bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal targeting this category */}
      <AdminProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        defaultCategory={targetCategoryForProduct}
        categories={categories}
        onSaveProduct={(newProd) => {
          onAddProduct(newProd);
          setIsProductModalOpen(false);
          onTriggerToast(`Added "${newProd.name}" to category "${newProd.category}"!`);
        }}
        onAddNewCategory={(newCat) => {
          onAddCategory({
            name: newCat,
            subtitle: `${newCat} Collection`,
            image: PRESET_IMAGES[0].url
          });
        }}
      />
    </div>
  );
};
