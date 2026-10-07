import React, { useState } from 'react';
import { INITIAL_COUPONS } from '../../data/adminData';
import { Coupon } from '../../types';
import {
  Tag,
  Plus,
  CheckCircle2,
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
  Info,
  ArrowLeft,
  ShieldCheck,
  AlertCircle
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

  // Full Page view mode: 'list' | 'editor' (NO POPUPS)
  const [viewMode, setViewMode] = useState<'list' | 'editor'>('list');
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [inlineDeleteId, setInlineDeleteId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copiedShareMsg, setCopiedShareMsg] = useState(false);

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

  // Open Full-Page Editor for Secret Customer Voucher (for Meesho / WhatsApp buyers)
  const handleOpenCreateSecret = () => {
    setEditingCoupon(null);
    setCode('PAR' + Math.floor(100 + Math.random() * 900));
    setTitle('Direct Customer Exclusive Privilege');
    setDescription('Private discount voucher for direct order on official Parzio store.');
    setBadge('SECRET DEAL');
    setDiscountType('fixed');
    setDiscountValue('100');
    setMinOrder('499');
    setIsPrivateSecret(true);
    setSingleUseOnly(true);
    setUsageLimit('1');
    setExpiresAt('2026-12-31');
    setViewMode('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Full-Page Editor for Public Promo Code
  const handleOpenCreatePublic = () => {
    setEditingCoupon(null);
    setCode('PARZIO' + Math.floor(10 + Math.random() * 90));
    setTitle('Special Storewide Welcome Offer');
    setDescription('Use code during checkout for instant savings across all collections.');
    setBadge('EXCLUSIVE OFFER');
    setDiscountType('fixed');
    setDiscountValue('99');
    setMinOrder('499');
    setIsPrivateSecret(false);
    setSingleUseOnly(false);
    setUsageLimit('1000');
    setExpiresAt('2026-12-31');
    setViewMode('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Full-Page Editor for Existing Coupon
  const handleOpenEdit = (coupon: Coupon) => {
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
    setViewMode('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    if (!code.trim()) {
      onTriggerToast('Please enter a valid coupon code.');
      return;
    }

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
      onTriggerToast(`Coupon "${code.toUpperCase()}" updated successfully!`);
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
          ? `Secret voucher "${newCoupon.code}" created! Share code with your customer.`
          : `Promo code "${newCoupon.code}" published successfully!`
      );
    }

    setViewMode('list');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteCoupon = (id: string) => {
    const updated = coupons.filter((c) => c.id !== id);
    updateAndNotify(updated);
    onTriggerToast('Coupon code deleted permanently.');
    setInlineDeleteId(null);
  };

  // Filter coupons based on active tab
  const filteredCoupons = coupons.filter((coupon) => {
    if (activeTab === 'secret') return coupon.isPrivateSecret === true;
    if (activeTab === 'public') return !coupon.isPrivateSecret;
    return true;
  });

  const secretCouponsCount = coupons.filter((c) => c.isPrivateSecret).length;
  const publicCouponsCount = coupons.filter((c) => !c.isPrivateSecret).length;

  // Generated share message for WhatsApp / Meesho customer
  const shareMessage = `Special Offer from PARZIO! Buy directly on our official store https://parzio.in and use exclusive coupon code "${code.toUpperCase() || 'PAR123'}" to get ₹${discountValue} OFF on orders above ₹${minOrder}!`;

  const handleCopyShareMessage = () => {
    navigator.clipboard.writeText(shareMessage);
    setCopiedShareMsg(true);
    onTriggerToast('Customer WhatsApp message copied to clipboard!');
    setTimeout(() => setCopiedShareMsg(false), 2500);
  };

  // =========================================================================
  // VIEW 1: FULL-PAGE EDITOR (NO POPUPS)
  // =========================================================================
  if (viewMode === 'editor') {
    return (
      <div className="space-y-6 animate-fadeIn pb-12">
        {/* Top Navigation & Breadcrumbs */}
        <div className="bg-white rounded-3xl p-5 border border-[#eae5dc] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="p-2 rounded-2xl bg-[#faf8f5] hover:bg-[#eae5dc] border border-[#eae5dc] text-[#141414] transition-colors cursor-pointer flex items-center justify-center shrink-0"
              title="Return to Coupons List"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#8c7138] bg-[#faf8f5] px-2 py-0.5 rounded-full border border-[#eae5dc]">
                  Coupon Management
                </span>
                <span className="text-xs text-[#747878]">/</span>
                <span className="text-xs font-semibold text-[#747878]">
                  {editingCoupon ? 'Edit Mode' : isPrivateSecret ? 'Secret Client Voucher' : 'Public Promo'}
                </span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#141414] mt-0.5">
                {editingCoupon
                  ? `Edit Coupon: ${editingCoupon.code}`
                  : isPrivateSecret
                  ? 'Create Secret Customer Voucher'
                  : 'Create Public Promo Code'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="px-4 py-2 rounded-full border border-[#eae5dc] bg-white hover:bg-[#faf8f5] text-xs font-semibold text-[#141414] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveCoupon}
              className="px-6 py-2.5 rounded-full bg-[#141414] hover:bg-[#8c7138] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-[#fed488]" />
              <span>{editingCoupon ? 'Save Changes' : 'Activate & Save Coupon'}</span>
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Full Page Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Comprehensive Form Controls (8 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-[#eae5dc] shadow-sm space-y-6">
            
            {/* Step 1: Privacy & Visibility Mode (Secret vs Public) */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#141414]">
                1. Voucher Privacy &amp; Visibility Mode
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsPrivateSecret(true);
                    setBadge('SECRET DEAL');
                    setSingleUseOnly(true);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isPrivateSecret
                      ? 'bg-[#faf8f5] border-[#8c7138] ring-2 ring-[#8c7138]/30 shadow-xs'
                      : 'bg-white border-[#eae5dc] hover:border-[#8c7138]/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xs text-[#141414]">
                      <div className="w-7 h-7 rounded-lg bg-[#8c7138] text-white flex items-center justify-center">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                      <span>Secret Client Voucher</span>
                    </div>
                    {isPrivateSecret && <CheckCircle2 className="w-4 h-4 text-[#8c7138]" />}
                  </div>
                  <p className="text-[11px] text-[#747878] mt-2 leading-relaxed">
                    <strong>Hidden from website.</strong> Create a private code (e.g. PAR123) to share directly with your WhatsApp or Meesho buyer.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsPrivateSecret(false);
                    setBadge('EXCLUSIVE OFFER');
                    setSingleUseOnly(false);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    !isPrivateSecret
                      ? 'bg-[#faf8f5] border-[#141414] ring-2 ring-[#141414]/20 shadow-xs'
                      : 'bg-white border-[#eae5dc] hover:border-[#141414]/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xs text-[#141414]">
                      <div className="w-7 h-7 rounded-lg bg-[#141414] text-[#fed488] flex items-center justify-center">
                        <Globe className="w-3.5 h-3.5" />
                      </div>
                      <span>Public Store Promo</span>
                    </div>
                    {!isPrivateSecret && <CheckCircle2 className="w-4 h-4 text-[#141414]" />}
                  </div>
                  <p className="text-[11px] text-[#747878] mt-2 leading-relaxed">
                    <strong>Visible to all visitors.</strong> Displayed in the store Offers page for every customer to discover and use.
                  </p>
                </button>
              </div>
            </div>

            {/* Step 2: Coupon Code */}
            <div className="space-y-1.5 pt-4 border-t border-[#f5f2eb]">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#141414]">
                  2. Coupon Code *
                </label>
                <button
                  type="button"
                  onClick={() => setCode('PAR' + Math.floor(100 + Math.random() * 900))}
                  className="text-[11px] font-bold text-[#8c7138] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Generate Code</span>
                </button>
              </div>
              <div className="relative">
                <Tag className="w-4 h-4 text-[#747878] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. PAR123 or MEESHO100"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase().replace(/\s+/g, ''))}
                  className="w-full pl-10 pr-4 py-3 bg-[#faf8f5] border border-[#eae5dc] rounded-2xl font-mono text-sm font-bold text-[#141414] uppercase focus:outline-none focus:border-[#8c7138] focus:bg-white transition-all"
                />
              </div>
              <p className="text-[11px] text-[#747878]">
                Letters and numbers only. The customer will type this exact code on checkout.
              </p>
            </div>

            {/* Step 3: Discount Type & Amount */}
            <div className="space-y-2 pt-4 border-t border-[#f5f2eb]">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#141414]">
                3. Discount Value &amp; Minimum Order Rules
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Discount Type */}
                <div className="space-y-1">
                  <span className="block text-[11px] font-semibold text-[#747878]">Discount Type</span>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2.5 text-xs font-bold text-[#141414] focus:outline-none focus:border-[#8c7138]"
                  >
                    <option value="fixed">Fixed ₹ Amount Off</option>
                    <option value="percentage">Percentage % Off</option>
                  </select>
                </div>

                {/* Discount Amount */}
                <div className="space-y-1">
                  <span className="block text-[11px] font-semibold text-[#747878]">
                    {discountType === 'fixed' ? 'Discount (₹) *' : 'Discount (%) *'}
                  </span>
                  <div className="relative">
                    {discountType === 'fixed' ? (
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#747878]">₹</span>
                    ) : (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#747878]">%</span>
                    )}
                    <input
                      type="number"
                      required
                      min="1"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      className={`w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl py-2.5 text-xs font-bold text-[#141414] focus:outline-none focus:border-[#8c7138] ${
                        discountType === 'fixed' ? 'pl-7 pr-3' : 'pl-3 pr-7'
                      }`}
                      placeholder={discountType === 'fixed' ? '100' : '10'}
                    />
                  </div>
                </div>

                {/* Min Order Value */}
                <div className="space-y-1">
                  <span className="block text-[11px] font-semibold text-[#747878]">Min Order (₹) *</span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#747878]">₹</span>
                    <input
                      type="number"
                      min="0"
                      value={minOrder}
                      onChange={(e) => setMinOrder(e.target.value)}
                      className="w-full pl-7 pr-3 py-2.5 bg-[#faf8f5] border border-[#eae5dc] rounded-xl text-xs font-bold text-[#141414] focus:outline-none focus:border-[#8c7138]"
                      placeholder="499"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: Redemption Rules (Single Use vs Multi) */}
            <div className="space-y-2 pt-4 border-t border-[#f5f2eb]">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#141414]">
                4. Customer Usage Limits
              </label>

              <div className="bg-[#faf8f5] p-3.5 rounded-2xl border border-[#eae5dc] space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={singleUseOnly}
                    onChange={(e) => {
                      setSingleUseOnly(e.target.checked);
                      if (e.target.checked) setUsageLimit('1');
                    }}
                    className="mt-0.5 w-4 h-4 accent-[#8c7138] rounded cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#141414] block">
                      Single-Use Only (1-Time Redemption)
                    </span>
                    <p className="text-[11px] text-[#747878] mt-0.5 leading-snug">
                      Recommended for individual WhatsApp / Meesho clients. Once redeemed by the customer, the code expires automatically.
                    </p>
                  </div>
                </label>

                {!singleUseOnly && (
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#eae5dc]/60">
                    <div className="space-y-1">
                      <span className="block text-[11px] font-semibold text-[#747878]">Total Max Redemptions</span>
                      <input
                        type="number"
                        min="1"
                        value={usageLimit}
                        onChange={(e) => setUsageLimit(e.target.value)}
                        className="w-full bg-white border border-[#eae5dc] rounded-xl px-3 py-2 text-xs font-bold text-[#141414] focus:outline-none focus:border-[#8c7138]"
                        placeholder="100"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="block text-[11px] font-semibold text-[#747878]">Expiry Date</span>
                      <input
                        type="date"
                        value={expiresAt}
                        onChange={(e) => setExpiresAt(e.target.value)}
                        className="w-full bg-white border border-[#eae5dc] rounded-xl px-3 py-2 text-xs font-bold text-[#141414] focus:outline-none focus:border-[#8c7138]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Step 5: Titles, Badges & Customer Terms */}
            <div className="space-y-3 pt-4 border-t border-[#f5f2eb]">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#141414]">
                5. Title &amp; Description (Displayed to Customer)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="block text-[11px] font-semibold text-[#747878]">Offer Headline / Title</span>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2.5 text-xs text-[#141414] focus:outline-none focus:border-[#8c7138]"
                    placeholder="e.g. Exclusive Client Welcome Offer"
                  />
                </div>

                <div className="space-y-1">
                  <span className="block text-[11px] font-semibold text-[#747878]">Highlight Badge</span>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value.toUpperCase())}
                    className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2.5 text-xs uppercase font-bold text-[#141414] focus:outline-none focus:border-[#8c7138]"
                    placeholder="e.g. SECRET DEAL"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <span className="block text-[11px] font-semibold text-[#747878]">Offer Terms / Description</span>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl p-3 text-xs text-[#141414] focus:outline-none focus:border-[#8c7138]"
                  placeholder="e.g. Valid on all waterproof 18K gold plated necklaces, bangles & rings."
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#eae5dc]">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className="px-5 py-2.5 rounded-full border border-[#eae5dc] text-xs font-semibold text-[#141414] hover:bg-[#faf8f5] cursor-pointer"
              >
                Back to List
              </button>
              <button
                type="button"
                onClick={handleSaveCoupon}
                className="px-7 py-3 rounded-full bg-[#141414] hover:bg-[#8c7138] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <Check className="w-4 h-4 text-[#fed488]" />
                <span>{editingCoupon ? 'Save Changes' : 'Activate & Save Coupon'}</span>
              </button>
            </div>

          </div>

          {/* Right Column: Live Voucher Ticket Preview & Share Assistant (5 Cols) */}
          <div className="lg:col-span-5 space-y-5 sticky top-24">
            
            {/* Live Voucher Card Preview */}
            <div className="bg-[#faf8f5] rounded-3xl p-5 border border-[#eae5dc] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c7138] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Real-Time Customer Preview</span>
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  Live Preview
                </span>
              </div>

              {/* Luxury Ticket Preview */}
              <div className="bg-white rounded-2xl p-5 border border-[#eae5dc] shadow-xs relative overflow-hidden space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#8c7138] bg-[#fed488]/30 px-2 py-0.5 rounded">
                      {badge || 'EXCLUSIVE OFFER'}
                    </span>
                    <h4 className="font-display font-bold text-base text-[#141414] mt-1.5 leading-snug">
                      {title || `Special Offer on Orders Above ₹${minOrder || '499'}`}
                    </h4>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-display font-black text-lg text-[#8c7138]">
                      {discountType === 'fixed' ? `₹${discountValue || '100'} OFF` : `${discountValue || '10'}% OFF`}
                    </span>
                    <span className="block text-[10px] text-[#747878]">
                      {minOrder ? `Min. ₹${minOrder}` : 'No Min.'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#747878] leading-relaxed">
                  {description || `Use this voucher on checkout for instant savings.`}
                </p>

                <div className="pt-3 border-t border-dashed border-[#eae5dc] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-[#141414] bg-[#faf8f5] px-3 py-1 rounded-lg border border-[#eae5dc]">
                      {code.toUpperCase() || 'PAR123'}
                    </span>
                    {isPrivateSecret && (
                      <span className="text-[9px] bg-[#141414] text-[#fed488] px-2 py-0.5 rounded font-bold uppercase flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Secret</span>
                      </span>
                    )}
                    {singleUseOnly && (
                      <span className="text-[9px] bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded font-bold uppercase">
                        1-Time
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#747878]">
                    Expires: {expiresAt}
                  </span>
                </div>
              </div>
            </div>

            {/* Meesho / WhatsApp Direct Sharing Assistant */}
            <div className="bg-gradient-to-tr from-[#141414] to-[#262016] text-white rounded-3xl p-5 border border-[#8c7138]/40 shadow-md space-y-3.5">
              <div className="flex items-center gap-2 text-[#fed488]">
                <Share2 className="w-4 h-4" />
                <h4 className="font-bold text-xs uppercase tracking-wider">
                  How to send to WhatsApp / Meesho Customer
                </h4>
              </div>

              <p className="text-[11px] text-neutral-300 leading-relaxed">
                Copy the pre-written message below and send it directly in your customer's WhatsApp chat or Meesho inbox.
              </p>

              <div className="bg-black/40 p-3 rounded-2xl border border-white/10 text-xs font-mono text-[#fed488] leading-relaxed">
                "{shareMessage}"
              </div>

              <button
                type="button"
                onClick={handleCopyShareMessage}
                className="w-full py-2.5 rounded-full bg-[#fed488] hover:bg-white text-[#141414] font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                {copiedShareMsg ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-700" />
                    <span>Copied WhatsApp Message!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Customer WhatsApp Message</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: FULL-PAGE LISTING (NO POPUPS)
  // =========================================================================
  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Top Banner Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#eae5dc] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="w-9 h-9 rounded-2xl bg-[#faf8f5] border border-[#eae5dc] flex items-center justify-center text-[#8c7138] shadow-2xs">
              <Tag className="w-4.5 h-4.5" />
            </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-bold text-[#141414]">
                    Coupons &amp; Custom Client Vouchers
                  </h3>
                  <span className="text-[10px] bg-[#faf8f5] text-[#8c7138] border border-[#eae5dc] px-2.5 py-0.5 rounded-full font-bold">
                    {coupons.length} Total
                  </span>
                </div>
              </div>
          </div>
        </div>

        {/* Action Buttons: Opens Full-Page Editor Directly */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleOpenCreateSecret}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#8c7138] text-white hover:bg-[#725a2a] text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer"
            title="Create a secret private code for Meesho / WhatsApp customers"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>+ Secret Client Voucher</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreatePublic}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#141414] text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer"
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
                ? 'Create your first private secret voucher code like PAR123 to send directly to your customer.'
                : 'Create your first promotional discount voucher to reward buyers during checkout.'}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={handleOpenCreateSecret}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#8c7138] hover:bg-[#725a2a] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Create Secret Voucher</span>
            </button>
            <button
              type="button"
              onClick={handleOpenCreatePublic}
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
                      onClick={() => handleOpenEdit(coupon)}
                      className="p-1.5 rounded-xl hover:bg-[#faf8f5] text-[#747878] hover:text-[#141414] transition-colors cursor-pointer"
                      title="Edit coupon"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setInlineDeleteId(coupon.id)}
                      className="p-1.5 rounded-xl hover:bg-rose-50 text-[#747878] hover:text-rose-600 transition-colors cursor-pointer"
                      title="Delete coupon"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Offer Headline */}
                <h4 className="font-display text-sm font-bold text-[#141414] leading-snug">
                  {coupon.title || `Special Offer on Orders Above ₹${coupon.minOrderValue}`}
                </h4>
              </div>

              {/* Inline Delete Confirmation Bar (NO POPUP) */}
              {inlineDeleteId === coupon.id && (
                <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between gap-2 text-xs">
                  <span className="text-rose-800 font-bold">
                    Delete coupon {coupon.code}?
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setInlineDeleteId(null)}
                      className="px-2.5 py-1 rounded-lg bg-white border border-rose-200 text-rose-900 font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCoupon(coupon.id)}
                      className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold cursor-pointer"
                    >
                      Yes, Delete
                    </button>
                  </div>
                </div>
              )}

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

                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#747878] block">
                      Redemptions
                    </span>
                    <span className="font-mono text-xs font-bold text-[#141414]">
                      {coupon.usageCount || 0} / {coupon.singleUseOnly ? 1 : coupon.usageLimit}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-[#747878] block">
                      Status
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggle(coupon.id)}
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                        coupon.active
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-neutral-200 text-neutral-600'
                      }`}
                    >
                      {coupon.active ? 'ACTIVE' : 'PAUSED'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#747878] pt-1">
                  <span>Expiry: {coupon.expiresAt}</span>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(coupon)}
                    className="font-bold text-[#8c7138] hover:underline cursor-pointer"
                  >
                    Configure Details →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
