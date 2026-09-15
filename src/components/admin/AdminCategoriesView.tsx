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
  Image as ImageIcon,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  ExternalLink
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
  // Modals state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  // Expanded categories for viewing products
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
      // Check duplicate
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

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 border border-[#eae5dc] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-base font-bold text-[#141414] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#8c7138]" />
            Category &amp; Collection Manager ({categories.length} Categories)
          </h3>
          <p className="text-xs text-[#747878] mt-0.5">
            Create new categories, customize collection images, and assign products directly to each category.
          </p>
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

      {/* Categories Grid */}
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
                          // Fallback to placeholder if broken image URL
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
                <div className="p-3 bg-white border-t border-[#eae5dc] max-h-60 overflow-y-auto space-y-2">
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
                              ₹{p.price} • SKU: {p.sku} • Stock: {p.stock ?? 50}
                            </p>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded shrink-0">
                          Active
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

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
