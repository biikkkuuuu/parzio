import React, { useState } from 'react';
import { INITIAL_COUPONS } from '../../data/adminData';
import { Coupon } from '../../types';
import {
  Tag,
  Plus,
  CheckCircle2,
  XCircle,
  Sparkles,
  Calendar,
  Percent,
  Banknote,
  Edit2,
  Trash2,
  X
} from 'lucide-react';

interface AdminCouponsViewProps {
  onTriggerToast: (msg: string) => void;
}

export const AdminCouponsView: React.FC<AdminCouponsViewProps> = ({ onTriggerToast }) => {
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'fixed' | 'percentage'>('fixed');
  const [discountValue, setDiscountValue] = useState('99');
  const [minOrder, setMinOrder] = useState('499');
  const [usageLimit, setUsageLimit] = useState('1000');
  const [expiresAt, setExpiresAt] = useState('2026-12-31');

  const openCreateModal = () => {
    setEditingCoupon(null);
    setCode('');
    setDiscountType('fixed');
    setDiscountValue('99');
    setMinOrder('499');
    setUsageLimit('1000');
    setExpiresAt('2026-12-31');
    setIsModalOpen(true);
  };

  const openEditModal = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setCode(coupon.code);
    setDiscountType(coupon.discountType);
    setDiscountValue(String(coupon.discountValue));
    setMinOrder(String(coupon.minOrderValue));
    setUsageLimit(String(coupon.usageLimit));
    setExpiresAt(coupon.expiresAt);
    setIsModalOpen(true);
  };

  const handleToggle = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
    onTriggerToast('Coupon activation status toggled.');
  };

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    if (editingCoupon) {
      setCoupons((prev) =>
        prev.map((c) =>
          c.id === editingCoupon.id
            ? {
                ...c,
                code: code.trim().toUpperCase(),
                discountType,
                discountValue: Number(discountValue) || 99,
                minOrderValue: Number(minOrder) || 499,
                usageLimit: Number(usageLimit) || 1000,
                expiresAt
              }
            : c
        )
      );
      onTriggerToast(`Promo code ${code.toUpperCase()} updated successfully!`);
    } else {
      const newCoupon: Coupon = {
        id: `coup-${Date.now()}`,
        code: code.trim().toUpperCase(),
        discountType,
        discountValue: Number(discountValue) || 99,
        minOrderValue: Number(minOrder) || 499,
        usageCount: 0,
        usageLimit: Number(usageLimit) || 1000,
        active: true,
        expiresAt
      };
      setCoupons([newCoupon, ...coupons]);
      onTriggerToast(`Promo code ${newCoupon.code} created & activated!`);
    }

    setIsModalOpen(false);
  };

  const handleDeleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    onTriggerToast('Coupon code deleted permanently.');
    setCouponToDelete(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 border border-[#eae5dc] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-base font-bold text-[#141414] flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#8c7138]" />
            Promotions &amp; Flash Drop Coupons ({coupons.length} Codes)
          </h3>
          <p className="text-xs text-[#747878] mt-0.5">
            Add promotional discount codes, modify minimum purchase limits, or remove expired vouchers.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#141414] text-white hover:bg-[#8c7138] text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 text-[#fed488]" />
          <span>Add New Coupon</span>
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className={`p-5 rounded-3xl border transition-all shadow-sm ${
              coupon.active
                ? 'bg-white border-[#eae5dc] hover:border-[#8c7138]'
                : 'bg-[#faf8f5] border-[#eae5dc] opacity-60'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#eae5dc]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold tracking-wider px-3 py-1 rounded-xl bg-[#faf8f5] border border-[#eae5dc] text-[#141414]">
                  {coupon.code}
                </span>
                {coupon.active && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Active
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEditModal(coupon)}
                  title="Edit Coupon"
                  className="p-1.5 rounded-full hover:bg-[#eae5dc] text-[#141414] transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setCouponToDelete(coupon)}
                  title="Delete Coupon"
                  className="p-1.5 rounded-full hover:bg-rose-100 text-rose-700 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleToggle(coupon.id)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                    coupon.active
                      ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  {coupon.active ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-[#141414]">
                  {coupon.discountType === 'fixed'
                    ? `Flat ₹${coupon.discountValue} Off`
                    : `${coupon.discountValue}% Off`}
                </p>
                <p className="text-[11px] text-[#747878] mt-0.5">
                  Valid on orders above ₹{coupon.minOrderValue} • Expires {coupon.expiresAt}
                </p>
              </div>

              <div className="text-right">
                <span className="font-mono text-xs font-bold text-[#8c7138]">
                  {coupon.usageCount} / {coupon.usageLimit}
                </span>
                <p className="text-[10px] text-[#747878]">Redeemed</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#eae5dc] shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-[#eae5dc]">
              <h4 className="font-bold text-sm text-[#141414] flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#8c7138]" />
                {editingCoupon ? `Edit Coupon: ${editingCoupon.code}` : 'Create New Promo Code'}
              </h4>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full hover:bg-[#eae5dc]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FLASH99"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 uppercase font-mono font-bold text-[#8c7138] focus:outline-none focus:border-[#8c7138]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
                    Discount Type
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 text-[#141414] focus:outline-none focus:border-[#8c7138]"
                  >
                    <option value="fixed">Fixed ₹ Off</option>
                    <option value="percentage">Percentage % Off</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 font-bold text-[#141414] focus:outline-none focus:border-[#8c7138]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
                    Min Order (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={minOrder}
                    onChange={(e) => setMinOrder(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 font-bold text-[#141414] focus:outline-none focus:border-[#8c7138]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
                    Usage Cap Limit
                  </label>
                  <input
                    type="number"
                    required
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 font-bold text-[#141414] focus:outline-none focus:border-[#8c7138]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 text-[#141414] focus:outline-none focus:border-[#8c7138]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#eae5dc]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-1.5 rounded-full border border-[#eae5dc] text-xs font-semibold hover:bg-[#faf8f5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-full bg-[#141414] hover:bg-[#8c7138] text-white text-xs font-bold uppercase tracking-wider"
                >
                  {editingCoupon ? 'Update Coupon' : 'Activate Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {couponToDelete && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#eae5dc] shadow-2xl space-y-4 animate-fadeIn">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h4 className="font-bold text-base text-[#141414]">Delete Coupon {couponToDelete.code}?</h4>
              <p className="text-xs text-[#747878] mt-1">
                Are you sure you want to permanently remove this discount code? Customers will no longer be able to redeem it.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setCouponToDelete(null)}
                className="px-4 py-2 rounded-full border border-[#eae5dc] text-xs font-semibold hover:bg-[#faf8f5]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCoupon(couponToDelete.id)}
                className="px-5 py-2 rounded-full bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold"
              >
                Delete Code
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
