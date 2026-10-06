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
  X,
  Lock,
  Globe,
  Copy,
  Check,
  Share2,
  Zap,
  Info
} from 'lucide-react';

interface AdminCouponsViewProps {
  coupons?: Coupon[];
  onUpdateCoupons?: (coupons: Coupon[]) => void;
  onTriggerToast: (msg: string) => void;
}

export const AdminCouponsView: React.FC<AdminCouponsViewProps> = ({
  coupons: propCoupons,
  onUpdateCoupons,
  onTriggerToast
}) => {
  const [coupons, setCoupons] = useState<Coupon[]>(() => propCoupons || INITIAL_COUPONS);
  const [activeTab, setActiveTab] = useState<'all' | 'secret' | 'public'>('all');

  // Sync if parent updates
  React.useEffect(() => {
    if (propCoupons) {
      setCoupons(propCoupons);
    }
  }, [propCoupons]);

  const updateAndNotify = (updated: Coupon[]) => {
    setCoupons(updated);
    if (onUpdateCoupons) {
      onUpdateCoupons(updated);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState('EXCLUSIVE OFFER');
  const [discountType, setDiscountType] = useState<'fixed' | 'percentage'>('fixed');
  const [discountValue, setDiscountValue] = useState('100');
  const [minOrder, setMinOrder] = useState('499');
  const [isPrivateSecret, setIsPrivateSecret] = useState(false);
  const [singleUseOnly, setSingleUseOnly] = useState(false);
  const [usageLimit, setUsageLimit] = useState('1');
  const [expiresAt, setExpiresAt] = useState('2026-12-31');

  // Open modal pre-configured for a Secret Customer Voucher (e.g. for Meesho / WhatsApp deals)
  const openCreateSecretModal = () => {
    setEditingCoupon(null);
    setCode('PAR');
    setTitle('Direct Customer Exclusive Discount');
    setDescription('Private discount voucher for direct order on official store.');
    setBadge('SECRET DEAL');
    setDiscountType('fixed');
    setDiscountValue('100');
    setMinOrder('499');
    setIsPrivateSecret(true);
    setSingleUseOnly(true);
    setUsageLimit('1');
    setExpiresAt('2026-12-31');
    setIsModalOpen(true);
  };

  // Open modal for standard public promo code
  const openCreatePublicModal = () => {
    setEditingCoupon(null);
    setCode('');
    setTitle('');
    setDescription('');
    setBadge('EXCLUSIVE OFFER');
    setDiscountType('fixed');
    setDiscountValue('99');
    setMinOrder('499');
    setIsPrivateSecret(false);
    setSingleUseOnly(false);
    setUsageLimit('1000');
    setExpiresAt('2026-12-31');
    setIsModalOpen(true);
  };

  const openEditModal = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setCode(coupon.code);
    setTitle(coupon.title || '');
    setDescription(coupon.description || '');
    setBadge(coupon.badge || 'EXCLUSIVE OFFER');
    setDiscountType(coupon.discountType);
    setDiscountValue(String(coupon.discountValue));
    setMinOrder(String(coupon.minOrderValue));
    setIsPrivateSecret(coupon.isPrivateSecret || false);
    setSingleUseOnly(coupon.singleUseOnly || coupon.usageLimit === 1);
    setUsageLimit(String(coupon.usageLimit));
    setExpiresAt(coupon.expiresAt);
    setIsModalOpen(true);
  };

  const handleToggle = (id: string) => {
    const updated = coupons.map((c) =>
      c.id === id ? { ...c, active: !c.active } : c
    );
    updateAndNotify(updated);
    onTriggerToast('Coupon activation status updated.');
  };

  const handleCopyCode = (couponCode: string) => {
    navigator.clipboard.writeText(couponCode);
    setCopiedCode(couponCode);
    onTriggerToast(`Copied code "${couponCode}" to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const finalUsageLimit = singleUseOnly ? 1 : (Number(usageLimit) || 100);

    if (editingCoupon) {
      const updated = coupons.map((c) =>
        c.id === editingCoupon.id
          ? {
              ...c,
              code: code.trim().toUpperCase(),
              title: title.trim() || `Special Offer on Orders Above ₹${minOrder}`,
              description: description.trim() || `Use code ${code.toUpperCase()} for instant savings on checkout.`,
              badge: badge.trim() || (isPrivateSecret ? 'SECRET DEAL' : 'EXCLUSIVE OFFER'),
              discountType,
              discountValue: Number(discountValue) || 100,
              minOrderValue: Number(minOrder) || 0,
              isPrivateSecret,
              singleUseOnly,
              usageLimit: finalUsageLimit,
              expiresAt
            }
          : c
      );
      updateAndNotify(updated);
      onTriggerToast(`Promo coupon ${code.toUpperCase()} updated successfully!`);
    } else {
      const newCoupon: Coupon = {
        id: `coup-${Date.now()}`,
        code: code.trim().toUpperCase(),
        title: title.trim() || `Special Offer on Orders Above ₹${minOrder}`,
        description: description.trim() || `Use code ${code.toUpperCase()} for instant savings on checkout.`,
        badge: badge.trim() || (isPrivateSecret ? 'SECRET DEAL' : 'EXCLUSIVE OFFER'),
        discountType,
        discountValue: Number(discountValue) || 100,
        minOrderValue: Number(minOrder) || 0,
        usageCount: 0,
        usageLimit: finalUsageLimit,
        isPrivateSecret,
        singleUseOnly,
        active: true,
        expiresAt
      };
      const updated = [newCoupon, ...coupons];
      updateAndNotify(updated);
      onTriggerToast(
        isPrivateSecret
          ? `Secret voucher "${newCoupon.code}" created! Share this code with your customer.`
          : `Promo code "${newCoupon.code}" published successfully!`
      );
    }

    setIsModalOpen(false);
  };

  const handleDeleteCoupon = (id: string) => {
    const updated = coupons.filter((c) => c.id !== id);
    updateAndNotify(updated);
    onTriggerToast('Coupon code deleted permanently.');
    setCouponToDelete(null);
  };

  // Filter coupons based on active tab
  const filteredCoupons = coupons.filter((coupon) => {
    if (activeTab === 'secret') return coupon.isPrivateSecret === true;
    if (activeTab === 'public') return !coupon.isPrivateSecret;
    return true;
  });

  const secretCouponsCount = coupons.filter((c) => c.isPrivateSecret).length;
  const publicCouponsCount = coupons.filter((c) => !c.isPrivateSecret).length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner Header */}
      <div className="bg-white rounded-3xl p-5 border border-[#eae5dc] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#8c7138]" />
            <h3 className="font-display text-base font-bold text-[#141414]">
              Coupons &amp; Custom Client Vouchers
            </h3>
            <span className="text-[10px] bg-[#faf8f5] text-[#8c7138] border border-[#eae5dc] px-2.5 py-0.5 rounded-full font-bold">
              {coupons.length} Total Codes
            </span>
          </div>
          <p className="text-xs text-[#747878] mt-0.5">
            Create public store discounts or secret 1-time vouchers to convert Meesho, WhatsApp &amp; Instagram customers directly.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={openCreateSecretModal}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#8c7138] text-white hover:bg-[#725a2a] text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer"
            title="Create a secret private code to give directly to a customer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>+ New Secret Voucher</span>
          </button>

          <button
            type="button"
            onClick={openCreatePublicModal}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#141414] text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#fed488]" />
            <span>+ Public Promo Code</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-[#faf8f5] p-1.5 rounded-2xl border border-[#eae5dc] w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-[#141414] text-[#fed488] shadow-xs'
              : 'text-[#747878] hover:text-[#141414]'
          }`}
        >
          All Codes ({coupons.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('secret')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'secret'
              ? 'bg-[#8c7138] text-white shadow-xs'
              : 'text-[#747878] hover:text-[#141414]'
          }`}
        >
          <Lock className="w-3 h-3" />
          <span>Secret Client Vouchers ({secretCouponsCount})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('public')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'public'
              ? 'bg-[#141414] text-white shadow-xs'
              : 'text-[#747878] hover:text-[#141414]'
          }`}
        >
          <Globe className="w-3 h-3" />
          <span>Public Store Promos ({publicCouponsCount})</span>
        </button>
      </div>

      {/* Secret Vouchers Quick Guide Box */}
      <div className="bg-gradient-to-r from-[#faf8f5] via-white to-[#faf8f5] rounded-2xl border border-[#eae5dc] p-4 flex items-start gap-3 shadow-2xs">
        <div className="w-8 h-8 rounded-xl bg-[#8c7138] text-white flex items-center justify-center shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="text-xs space-y-0.5">
          <p className="font-bold text-[#141414]">
            How to use Secret Vouchers for Marketplace (Meesho / WhatsApp) Customers:
          </p>
          <p className="text-[#747878] leading-relaxed">
            Create a code like <strong>PAR123</strong> with your desired discount (e.g. ₹100 OFF) and minimum purchase requirement (e.g. Min ₹499). Send this code directly to your customer. It will <strong>NOT</strong> appear on your public website offers page, ensuring only that specific customer can redeem it!
          </p>
        </div>
      </div>

      {/* Coupons Grid */}
      {filteredCoupons.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#eae5dc] p-10 sm:p-14 text-center shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#faf8f5] border border-[#eae5dc] text-[#8c7138] flex items-center justify-center mx-auto shadow-2xs">
            <Tag className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h4 className="font-display text-lg font-bold text-[#141414]">
              {activeTab === 'secret' ? 'No Secret Vouchers Created' : 'No Discount Coupons Found'}
            </h4>
            <p className="text-xs text-[#747878] leading-relaxed">
              {activeTab === 'secret'
                ? 'Create a private secret voucher code like PAR123 to send directly to your customer.'
                : 'Create your first promotional discount voucher to reward buyers during checkout.'}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={openCreateSecretModal}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#8c7138] hover:bg-[#725a2a] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Create Secret Voucher</span>
            </button>
            <button
              type="button"
              onClick={openCreatePublicModal}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#141414] hover:bg-[#8c7138] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#fed488]" />
              <span>Create Public Promo</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCoupons.map((coupon) => (
            <div
              key={coupon.id}
              className={`p-5 rounded-3xl border transition-all shadow-sm flex flex-col justify-between ${
                coupon.active
                  ? coupon.isPrivateSecret
                    ? 'bg-white border-[#8c7138]/40 shadow-xs'
                    : 'bg-white border-[#eae5dc]'
                  : 'bg-neutral-50/80 border-neutral-300 opacity-60'
              }`}
            >
              <div>
                {/* Header row: Code & Badges */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sm font-black tracking-wider px-3 py-1 rounded-xl bg-[#faf8f5] border border-[#eae5dc] text-[#141414] flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#8c7138]" />
                      <span>{coupon.code}</span>
                    </span>

                    {/* Secret vs Public Badge */}
                    {coupon.isPrivateSecret ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#141414] text-[#fed488] text-[9px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-2xs">
                        <Lock className="w-2.5 h-2.5 text-[#fed488]" />
                        <span>SECRET VOUCHER</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[9px] font-bold tracking-wider uppercase flex items-center gap-1">
                        <Globe className="w-2.5 h-2.5" />
                        <span>PUBLIC PROMO</span>
                      </span>
                    )}

                    {/* Single Use Badge */}
                    {coupon.singleUseOnly && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[9px] font-bold tracking-wider uppercase flex items-center gap-1">
                        <Zap className="w-2.5 h-2.5" />
                        <span>1-TIME USE</span>
                      </span>
                    )}
                  </div>

                  {/* Actions: Copy, Edit, Delete */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopyCode(coupon.code)}
                      className="p-1.5 rounded-xl border border-[#eae5dc] hover:border-[#8c7138] hover:bg-[#faf8f5] text-[#141414] transition-colors cursor-pointer"
                      title="Copy code to share with customer"
                    >
                      {copiedCode === coupon.code ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-[#747878]" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => openEditModal(coupon)}
                      className="p-1.5 rounded-xl hover:bg-[#faf8f5] text-[#747878] hover:text-[#141414] transition-colors cursor-pointer"
                      title="Edit coupon"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setCouponToDelete(coupon)}
                      className="p-1.5 rounded-xl hover:bg-rose-50 text-[#747878] hover:text-rose-600 transition-colors cursor-pointer"
                      title="Delete coupon"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Offer Headline & Description */}
                <h4 className="font-display text-sm font-bold text-[#141414] leading-snug">
                  {coupon.title || `Special Offer on Orders Above ₹${coupon.minOrderValue}`}
                </h4>
                <p className="text-xs text-[#747878] mt-1 leading-relaxed line-clamp-2">
                  {coupon.description || `Use code ${coupon.code} on checkout.`}
                </p>
              </div>

              {/* Specs & Status Footer */}
              <div className="pt-3 mt-3 border-t border-[#eae5dc] space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#747878] block">
                      Discount Value
                    </span>
                    <strong className="text-sm font-bold text-[#8c7138]">
                      {coupon.discountType === 'fixed'
                        ? `₹${coupon.discountValue} OFF`
                        : `${coupon.discountValue}% OFF`}
                    </strong>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#747878] block">
                      Min. Purchase
                    </span>
                    <span className="font-bold text-[#141414]">
                      {coupon.minOrderValue > 0 ? `₹${coupon.minOrderValue}` : 'No Min.'}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-[#747878] block">
                      Usage Status
                    </span>
                    <span className="font-mono font-bold text-xs text-[#141414]">
                      {coupon.usageCount} / {coupon.usageLimit}
                    </span>
                  </div>
                </div>

                {/* Active Toggle & Share Bar */}
                <div className="flex items-center justify-between pt-2 border-t border-[#eae5dc]/60">
                  <button
                    type="button"
                    onClick={() => handleCopyCode(coupon.code)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8c7138] hover:underline cursor-pointer"
                  >
                    <Share2 className="w-3 h-3" />
                    <span>Copy Code for Customer</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-[#747878] font-bold">Active:</span>
                    <div className="inline-flex items-center gap-0.5 bg-[#faf8f5] p-0.5 rounded-full border border-[#eae5dc]">
                      <button
                        type="button"
                        onClick={() => {
                          if (!coupon.active) handleToggle(coupon.id);
                        }}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                          coupon.active
                            ? 'bg-emerald-700 text-white shadow-xs'
                            : 'text-[#747878] hover:text-[#141414]'
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (coupon.active) handleToggle(coupon.id);
                        }}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                          !coupon.active
                            ? 'bg-neutral-800 text-white shadow-xs'
                            : 'text-[#747878] hover:text-[#141414]'
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-[#eae5dc] shadow-2xl space-y-4 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#eae5dc]">
              <div className="flex items-center gap-2">
                {isPrivateSecret ? (
                  <div className="w-8 h-8 rounded-xl bg-[#8c7138] text-white flex items-center justify-center shadow-xs">
                    <Lock className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-[#141414] text-[#fed488] flex items-center justify-center shadow-xs">
                    <Tag className="w-4 h-4" />
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-sm text-[#141414]">
                    {editingCoupon
                      ? `Edit Coupon: ${editingCoupon.code}`
                      : isPrivateSecret
                      ? 'Create Secret Customer Voucher'
                      : 'Create Public Promo Code'}
                  </h4>
                  <p className="text-[11px] text-[#747878]">
                    {isPrivateSecret
                      ? 'Secret code hidden from storefront offers, given directly to your customer.'
                      : 'Public code shown in the website Offers directory.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-[#747878] hover:text-[#141414]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-3.5 text-xs">
              
              {/* Privacy Mode Selector (Secret vs Public) */}
              <div className="bg-[#faf8f5] p-3 rounded-2xl border border-[#eae5dc] space-y-2">
                <span className="block text-[10px] font-bold uppercase text-[#747878]">
                  Voucher Privacy &amp; Visibility Mode
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPrivateSecret(true);
                      setBadge('SECRET DEAL');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isPrivateSecret
                        ? 'bg-white border-[#8c7138] ring-1 ring-[#8c7138] shadow-xs'
                        : 'bg-white/50 border-[#eae5dc] text-[#747878] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-[#141414]">
                      <Lock className="w-3.5 h-3.5 text-[#8c7138]" />
                      <span>Secret Voucher</span>
                    </div>
                    <p className="text-[10px] text-[#747878] mt-0.5">
                      Hidden from website. Send code to Meesho / WhatsApp customer.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsPrivateSecret(false);
                      setBadge('EXCLUSIVE OFFER');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      !isPrivateSecret
                        ? 'bg-white border-[#141414] ring-1 ring-[#141414] shadow-xs'
                        : 'bg-white/50 border-[#eae5dc] text-[#747878] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-[#141414]">
                      <Globe className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Public Store Promo</span>
                    </div>
                    <p className="text-[10px] text-[#747878] mt-0.5">
                      Visible to all visitors in the website Offers tab.
                    </p>
                  </button>
                </div>
              </div>

              {/* Coupon Code Input */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PAR123, MEESHO99, VIP100"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3.5 py-2.5 uppercase font-mono font-bold text-sm text-[#8c7138] focus:outline-none focus:border-[#8c7138]"
                />
                <span className="text-[10px] text-[#747878] mt-0.5 block">
                  Customers enter this exact code during checkout.
                </span>
              </div>

              {/* Discount Type & Value */}
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
                    <option value="fixed">Flat ₹ Amount OFF</option>
                    <option value="percentage">Percentage % OFF</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
                    Discount Amount ({discountType === 'fixed' ? '₹' : '%'}) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 font-bold text-[#141414] focus:outline-none focus:border-[#8c7138]"
                    placeholder="e.g. 100"
                  />
                </div>
              </div>

              {/* Minimum Purchase Requirement */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
                    Minimum Cart Subtotal (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={minOrder}
                    onChange={(e) => setMinOrder(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 font-bold text-[#141414] focus:outline-none focus:border-[#8c7138]"
                    placeholder="e.g. 499"
                  />
                  <span className="text-[10px] text-[#747878] mt-0.5 block">
                    Code will only apply if cart is ≥ ₹{minOrder || '0'}.
                  </span>
                </div>

                {/* Single-Use vs Multi-Use */}
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
                    Usage Limit *
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setSingleUseOnly(true);
                        setUsageLimit('1');
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        singleUseOnly
                          ? 'bg-[#141414] text-white shadow-xs'
                          : 'bg-[#faf8f5] text-[#747878] border border-[#eae5dc]'
                      }`}
                    >
                      1-Time Use
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSingleUseOnly(false);
                        setUsageLimit('100');
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        !singleUseOnly
                          ? 'bg-[#141414] text-white shadow-xs'
                          : 'bg-[#faf8f5] text-[#747878] border border-[#eae5dc]'
                      }`}
                    >
                      Multi-Use
                    </button>
                  </div>
                  {!singleUseOnly && (
                    <input
                      type="number"
                      min="1"
                      value={usageLimit}
                      onChange={(e) => setUsageLimit(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-1.5 mt-1 text-[#141414]"
                      placeholder="Max usage cap"
                    />
                  )}
                </div>
              </div>

              {/* Title & Terms */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
                  Offer Title / Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Exclusive ₹100 Off on orders above ₹499"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 text-[#141414] focus:outline-none focus:border-[#8c7138]"
                />
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

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#eae5dc]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#eae5dc] text-xs font-semibold hover:bg-[#faf8f5] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#141414] hover:bg-[#8c7138] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                >
                  {editingCoupon
                    ? 'Save Changes'
                    : isPrivateSecret
                    ? 'Create Secret Voucher'
                    : 'Publish Promo Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Yes / No Delete Confirmation Modal */}
      {couponToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#eae5dc] shadow-2xl space-y-4 animate-scaleUp">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="font-display font-bold text-base text-[#141414]">
                Delete Coupon "{couponToDelete.code}"?
              </h4>
              <p className="text-xs text-[#747878] leading-relaxed">
                Are you sure you want to delete this coupon? Customers will no longer be able to redeem it.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setCouponToDelete(null)}
                className="w-full py-2.5 rounded-full border border-[#eae5dc] bg-white hover:bg-neutral-100 text-xs font-bold text-[#141414] transition-colors cursor-pointer"
              >
                No, Keep Coupon
              </button>
              <button
                type="button"
                onClick={() => handleDeleteCoupon(couponToDelete.id)}
                className="w-full py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
