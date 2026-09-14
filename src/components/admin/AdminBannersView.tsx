import React, { useState } from 'react';
import { MarqueeItem, StoreBanner } from '../../types';
import {
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Eye,
  Check,
  X,
  Truck,
  ShieldCheck,
  Star,
  Heart,
  Tag,
  Gift,
  ArrowRight,
  MoveRight,
  Image as ImageIcon,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { MarqueeBar } from '../MarqueeBar';

interface AdminBannersViewProps {
  topMarqueeItems: MarqueeItem[];
  bannerMarqueeItems: MarqueeItem[];
  banners: StoreBanner[];
  onUpdateTopMarquee: (items: MarqueeItem[]) => void;
  onUpdateBannerMarquee: (items: MarqueeItem[]) => void;
  onUpdateBanners: (banners: StoreBanner[]) => void;
  onTriggerToast: (msg: string) => void;
}

export const AdminBannersView: React.FC<AdminBannersViewProps> = ({
  topMarqueeItems,
  bannerMarqueeItems,
  banners,
  onUpdateTopMarquee,
  onUpdateBannerMarquee,
  onUpdateBanners,
  onTriggerToast
}) => {
  // Active Tab within Banners Manager: 'top-marquee' | 'hero-banners' | 'promo-marquee'
  const [activeSection, setActiveSection] = useState<'top-marquee' | 'hero-banners' | 'promo-marquee'>('top-marquee');

  // --- TOP MARQUEE MODAL/STATE ---
  const [editingMarqueeId, setEditingMarqueeId] = useState<string | null>(null);
  const [marqueeText, setMarqueeText] = useState('');
  const [marqueeIcon, setMarqueeIcon] = useState<'truck' | 'shield' | 'sparkles' | 'star' | 'heart' | 'tag' | 'gift'>('sparkles');
  const [isAddingTopMarquee, setIsAddingTopMarquee] = useState(false);

  // --- HERO BANNER MODAL/STATE ---
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);

  const [bannerForm, setBannerForm] = useState<Omit<StoreBanner, 'id'>>({
    title: 'Everything For',
    highlightText: 'Just ₹99',
    subtitle: 'Anti-Tarnish Daily Wear Jewellery',
    description: 'Enjoy 18K gold-finished necklaces, beautiful rings, and shining pearls. Water, sweat and perfume safe.',
    badge: 'SPECIAL SALE • FLAT ₹99',
    subBadge: '100% WATERPROOF',
    priceText: '₹99',
    stat1Value: '₹99',
    stat1Label: 'Fixed Price',
    stat2Value: '18K',
    stat2Label: 'Real Gold Plated',
    stat3Value: '5 Lac+',
    stat3Label: 'Happy Shoppers',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    buttonText: 'Shop ₹99 Vault',
    active: true
  });

  // --- TOP MARQUEE HANDLERS ---
  const handleSaveTopMarquee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!marqueeText.trim()) return;

    if (editingMarqueeId) {
      // Edit existing
      const updated = topMarqueeItems.map((item) =>
        item.id === editingMarqueeId ? { ...item, text: marqueeText.trim(), icon: marqueeIcon } : item
      );
      onUpdateTopMarquee(updated);
      onTriggerToast('Marquee announcement updated successfully!');
      setEditingMarqueeId(null);
    } else {
      // Add new
      const newItem: MarqueeItem = {
        id: `marq-${Date.now()}`,
        text: marqueeText.trim(),
        icon: marqueeIcon,
        active: true
      };
      onUpdateTopMarquee([...topMarqueeItems, newItem]);
      onTriggerToast('New announcement added to Top Marquee!');
      setIsAddingTopMarquee(false);
    }

    setMarqueeText('');
  };

  const handleStartEditMarquee = (item: MarqueeItem) => {
    setEditingMarqueeId(item.id);
    setMarqueeText(item.text);
    setMarqueeIcon(item.icon || 'sparkles');
    setIsAddingTopMarquee(false);
  };

  const handleDeleteTopMarquee = (id: string) => {
    if (topMarqueeItems.length <= 1) {
      onTriggerToast('Keep at least 1 marquee message active.');
      return;
    }
    const filtered = topMarqueeItems.filter((i) => i.id !== id);
    onUpdateTopMarquee(filtered);
    onTriggerToast('Marquee announcement deleted.');
  };

  const handleToggleTopMarqueeActive = (id: string) => {
    const updated = topMarqueeItems.map((item) =>
      item.id === id ? { ...item, active: !item.active } : item
    );
    onUpdateTopMarquee(updated);
    onTriggerToast('Marquee item status updated.');
  };

  // --- PROMO MARQUEE HANDLERS ---
  const [promoText, setPromoText] = useState('');
  const [isAddingPromo, setIsAddingPromo] = useState(false);

  const handleAddPromoMarquee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoText.trim()) return;
    const newItem: MarqueeItem = {
      id: `bmarq-${Date.now()}`,
      text: promoText.trim(),
      icon: 'sparkles',
      active: true
    };
    onUpdateBannerMarquee([...bannerMarqueeItems, newItem]);
    setPromoText('');
    setIsAddingPromo(false);
    onTriggerToast('Added new banner ticker message!');
  };

  const handleDeletePromoMarquee = (id: string) => {
    if (bannerMarqueeItems.length <= 1) {
      onTriggerToast('Keep at least 1 banner ticker item.');
      return;
    }
    onUpdateBannerMarquee(bannerMarqueeItems.filter((i) => i.id !== id));
    onTriggerToast('Banner ticker message deleted.');
  };

  // --- HERO BANNER HANDLERS ---
  const handleOpenAddBannerModal = () => {
    setEditingBannerId(null);
    setBannerForm({
      title: 'New Festive Drop',
      highlightText: 'At ₹99',
      subtitle: 'Waterproof Luxury Jewellery',
      description: 'Exclusive 18K gold plated pieces designed for daily wear, anti-tarnish and 100% skin safe.',
      badge: 'LIMITED TIME DROP',
      subBadge: '100% WATERPROOF',
      priceText: '₹99',
      stat1Value: '₹99',
      stat1Label: 'Intro Price',
      stat2Value: '18K',
      stat2Label: 'Gold Plated',
      stat3Value: 'Free',
      stat3Label: 'Shipping ₹500+',
      image: 'https://images.unsplash.com/photo-1611591475819-79b8b730ab8b?auto=format&fit=crop&w=800&q=80',
      buttonText: 'Explore Vault',
      active: true
    });
    setIsBannerModalOpen(true);
  };

  const handleOpenEditBannerModal = (banner: StoreBanner) => {
    setEditingBannerId(banner.id);
    setBannerForm({
      title: banner.title,
      highlightText: banner.highlightText,
      subtitle: banner.subtitle,
      description: banner.description,
      badge: banner.badge,
      subBadge: banner.subBadge || '',
      priceText: banner.priceText,
      stat1Value: banner.stat1Value,
      stat1Label: banner.stat1Label,
      stat2Value: banner.stat2Value,
      stat2Label: banner.stat2Label,
      stat3Value: banner.stat3Value,
      stat3Label: banner.stat3Label,
      image: banner.image,
      buttonText: banner.buttonText,
      active: banner.active
    });
    setIsBannerModalOpen(true);
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBannerId) {
      const updated = banners.map((b) =>
        b.id === editingBannerId ? { ...bannerForm, id: editingBannerId } : b
      );
      onUpdateBanners(updated);
      onTriggerToast('Storefront banner updated successfully!');
    } else {
      const newBanner: StoreBanner = {
        ...bannerForm,
        id: `ban-${Date.now()}`
      };
      onUpdateBanners([newBanner, ...banners]);
      onTriggerToast('New storefront banner added and live!');
    }
    setIsBannerModalOpen(false);
  };

  const handleDeleteBanner = (id: string) => {
    if (banners.length <= 1) {
      onTriggerToast('You must keep at least 1 hero banner active.');
      return;
    }
    const filtered = banners.filter((b) => b.id !== id);
    onUpdateBanners(filtered);
    onTriggerToast('Banner removed from storefront.');
  };

  const handleToggleBannerActive = (id: string) => {
    const updated = banners.map((b) =>
      b.id === id ? { ...b, active: !b.active } : b
    );
    onUpdateBanners(updated);
    onTriggerToast('Banner visibility updated.');
  };

  return (
    <div className="space-y-6">

      {/* Header Bar */}
      <div className="bg-white rounded-3xl p-5 border border-[#eae5dc] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-base font-bold text-[#141414] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#8c7138]" />
            Banners &amp; Running Marquee Management
          </h3>
          <p className="text-xs text-[#747878] mt-0.5">
            Customize top announcement ticker, hero banners, and promotional strips with live Right-to-Left animation.
          </p>
        </div>

        {/* Section Navigation Pills */}
        <div className="flex items-center gap-2 bg-[#faf8f5] p-1 rounded-full border border-[#eae5dc]">
          <button
            type="button"
            onClick={() => setActiveSection('top-marquee')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeSection === 'top-marquee'
                ? 'bg-[#141414] text-[#fed488] shadow-xs'
                : 'text-[#747878] hover:text-[#141414]'
            }`}
          >
            Top Marquee ({topMarqueeItems.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('hero-banners')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeSection === 'hero-banners'
                ? 'bg-[#141414] text-[#fed488] shadow-xs'
                : 'text-[#747878] hover:text-[#141414]'
            }`}
          >
            Hero Banners ({banners.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('promo-marquee')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeSection === 'promo-marquee'
                ? 'bg-[#141414] text-[#fed488] shadow-xs'
                : 'text-[#747878] hover:text-[#141414]'
            }`}
          >
            Banner Ticker ({bannerMarqueeItems.length})
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 1: TOP ANNOUNCEMENT MARQUEE                      */}
      {/* ======================================================== */}
      {activeSection === 'top-marquee' && (
        <div className="space-y-5">
          {/* Live Preview Box */}
          <div className="bg-white rounded-3xl p-5 border border-[#eae5dc] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#141414] flex items-center gap-1.5 uppercase tracking-wider">
                <Eye className="w-4 h-4 text-[#8c7138]" /> Live Storefront Marquee Preview (Right to Left)
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                Auto-Moving Right to Left
              </span>
            </div>

            {/* Render Marquee */}
            <div className="rounded-2xl overflow-hidden shadow-inner border border-[#2e3131]">
              <MarqueeBar items={topMarqueeItems} variant="dark" />
            </div>
            <p className="text-[11px] text-[#747878] text-center italic">
              Changes made below instantly reflect on both desktop header and mobile header in real time.
            </p>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between">
            <h4 className="font-display text-sm font-bold text-[#141414]">
              Active Announcement Messages ({topMarqueeItems.filter((i) => i.active).length} of {topMarqueeItems.length})
            </h4>

            {!isAddingTopMarquee && !editingMarqueeId && (
              <button
                type="button"
                onClick={() => {
                  setIsAddingTopMarquee(true);
                  setMarqueeText('');
                  setMarqueeIcon('sparkles');
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#141414] text-[#fed488] hover:bg-[#8c7138] hover:text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Announcement</span>
              </button>
            )}
          </div>

          {/* Add / Edit Form Drawer */}
          {(isAddingTopMarquee || editingMarqueeId) && (
            <form onSubmit={handleSaveTopMarquee} className="bg-white rounded-3xl p-5 border-2 border-[#8c7138] shadow-md space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-[#eae5dc]">
                <h5 className="font-display text-sm font-bold text-[#141414]">
                  {editingMarqueeId ? 'Edit Announcement Message' : 'Add New Marquee Announcement'}
                </h5>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingTopMarquee(false);
                    setEditingMarqueeId(null);
                  }}
                  className="p-1 rounded-full text-[#747878] hover:text-[#141414]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141414] mb-1">
                  Announcement Text
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FLAT ₹99 FLASH DROP LIVE NOW"
                  value={marqueeText}
                  onChange={(e) => setMarqueeText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#eae5dc] text-xs font-semibold text-[#141414] focus:outline-none focus:border-[#8c7138]"
                />
              </div>

              {/* Icon Selector */}
              <div>
                <label className="block text-xs font-bold text-[#141414] mb-1">
                  Prefix Icon
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'truck', label: 'Truck', icon: <Truck className="w-3.5 h-3.5" /> },
                    { id: 'shield', label: 'Shield', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
                    { id: 'sparkles', label: 'Sparkles', icon: <Sparkles className="w-3.5 h-3.5" /> },
                    { id: 'star', label: 'Star', icon: <Star className="w-3.5 h-3.5" /> },
                    { id: 'heart', label: 'Heart', icon: <Heart className="w-3.5 h-3.5" /> },
                    { id: 'tag', label: 'Tag', icon: <Tag className="w-3.5 h-3.5" /> },
                    { id: 'gift', label: 'Gift', icon: <Gift className="w-3.5 h-3.5" /> }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setMarqueeIcon(item.id as any)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                        marqueeIcon === item.id
                          ? 'bg-[#141414] text-[#fed488] border-[#141414]'
                          : 'bg-white text-[#747878] border-[#eae5dc] hover:border-[#8c7138]'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingTopMarquee(false);
                    setEditingMarqueeId(null);
                  }}
                  className="px-4 py-2 rounded-full border border-[#eae5dc] text-xs font-bold text-[#747878] hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#141414] text-[#fed488] hover:bg-[#8c7138] hover:text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
                >
                  {editingMarqueeId ? 'Save Changes' : 'Add to Marquee'}
                </button>
              </div>
            </form>
          )}

          {/* List of Marquee Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {topMarqueeItems.map((item, index) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  item.active
                    ? 'bg-white border-[#eae5dc] shadow-xs'
                    : 'bg-neutral-50/70 border-dashed border-neutral-300 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-8 h-8 rounded-xl bg-[#faf8f5] border border-[#eae5dc] flex items-center justify-center text-[#8c7138] flex-shrink-0">
                    {item.icon === 'truck' && <Truck className="w-4 h-4" />}
                    {item.icon === 'shield' && <ShieldCheck className="w-4 h-4" />}
                    {item.icon === 'sparkles' && <Sparkles className="w-4 h-4" />}
                    {item.icon === 'star' && <Star className="w-4 h-4" />}
                    {item.icon === 'heart' && <Heart className="w-4 h-4" />}
                    {item.icon === 'tag' && <Tag className="w-4 h-4" />}
                    {item.icon === 'gift' && <Gift className="w-4 h-4" />}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-[#141414] truncate">{item.text}</p>
                    <span className="text-[10px] text-[#747878]">Position #{index + 1}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {/* Active / Inactive Toggle */}
                  <button
                    type="button"
                    onClick={() => handleToggleTopMarqueeActive(item.id)}
                    className={`px-2 py-1 rounded-md text-[10px] font-bold transition-colors cursor-pointer ${
                      item.active
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-neutral-200 text-neutral-600'
                    }`}
                  >
                    {item.active ? 'Active' : 'Paused'}
                  </button>

                  {/* Edit Button */}
                  <button
                    type="button"
                    onClick={() => handleStartEditMarquee(item)}
                    className="p-1.5 rounded-lg text-[#747878] hover:text-[#141414] hover:bg-[#faf8f5] transition-colors cursor-pointer"
                    title="Edit text"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleDeleteTopMarquee(item.id)}
                    className="p-1.5 rounded-lg text-[#747878] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 2: HERO STOREFRONT BANNERS                       */}
      {/* ======================================================== */}
      {activeSection === 'hero-banners' && (
        <div className="space-y-5">
          {/* Action Row */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-display text-sm font-bold text-[#141414]">
                Storefront Hero Banners
              </h4>
              <p className="text-xs text-[#747878]">
                Add, edit or remove prominent hero promotional slides shown at the top of the storefront.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenAddBannerModal}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#141414] text-[#fed488] hover:bg-[#8c7138] hover:text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Hero Banner</span>
            </button>
          </div>

          {/* Banners Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`bg-white rounded-3xl overflow-hidden border transition-all flex flex-col justify-between ${
                  banner.active ? 'border-[#eae5dc] shadow-sm' : 'border-neutral-300 opacity-60'
                }`}
              >
                {/* Banner Preview Card */}
                <div className="p-5 flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border border-[#eae5dc] flex-shrink-0 bg-[#faf8f5]">
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content Preview */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-full bg-[#141414] text-[#fed488] text-[9px] font-bold tracking-wider uppercase">
                          {banner.badge}
                        </span>
                        {banner.active && (
                          <span className="text-[10px] text-emerald-700 font-bold">
                            ✓ Live on Store
                          </span>
                        )}
                      </div>

                      <h4 className="font-display text-base font-bold text-[#141414] leading-snug truncate">
                        {banner.title} <span className="text-[#8c7138]">{banner.highlightText}</span>
                      </h4>
                      <p className="text-xs text-[#747878] font-medium mt-0.5 truncate">
                        {banner.subtitle}
                      </p>
                      <p className="text-[11px] text-[#444748] mt-1 line-clamp-2 leading-relaxed">
                        {banner.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#eae5dc]">
                      <span className="text-xs font-bold text-[#141414]">
                        Price Tag: <strong className="text-[#8c7138]">{banner.priceText}</strong>
                      </span>
                      <span className="text-[10px] text-[#747878]">• CTA: "{banner.buttonText}"</span>
                    </div>
                  </div>
                </div>

                {/* Card Controls Footer */}
                <div className="px-5 py-3 bg-[#faf8f5] border-t border-[#eae5dc] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleBannerActive(banner.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                        banner.active
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                          : 'bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      {banner.active ? 'Visible on Store' : 'Hidden'}
                    </button>
                    <span className="text-[11px] text-[#747878]">Slide #{index + 1}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditBannerModal(banner)}
                      className="flex items-center gap-1 px-3 py-1 rounded-full border border-[#eae5dc] bg-white text-xs font-bold text-[#141414] hover:bg-[#8c7138] hover:text-white transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteBanner(banner.id)}
                      className="p-1.5 rounded-full text-[#747878] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Remove banner"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 3: PROMOTIONAL BANNER TICKER                     */}
      {/* ======================================================== */}
      {activeSection === 'promo-marquee' && (
        <div className="space-y-5">
          {/* Live Preview Box */}
          <div className="bg-white rounded-3xl p-5 border border-[#eae5dc] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#141414] flex items-center gap-1.5 uppercase tracking-wider">
                <Eye className="w-4 h-4 text-[#8c7138]" /> Secondary Banner Ticker Preview
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                Moves Right to Left
              </span>
            </div>

            {/* Render Marquee in Gold Style */}
            <div className="rounded-2xl overflow-hidden shadow-xs">
              <MarqueeBar items={bannerMarqueeItems} variant="gold" speed="fast" />
            </div>
            <p className="text-[11px] text-[#747878] text-center italic">
              Appears directly below the hero banner to highlight quality promises and fast courier features.
            </p>
          </div>

          {/* Quick Add Form */}
          <form onSubmit={handleAddPromoMarquee} className="bg-white rounded-3xl p-4 border border-[#eae5dc] flex items-center gap-3">
            <input
              type="text"
              required
              placeholder="e.g. 💎 100-HOUR SHOWER TESTED"
              value={promoText}
              onChange={(e) => setPromoText(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl bg-[#faf8f5] border border-[#eae5dc] text-xs font-semibold text-[#141414] focus:outline-none focus:border-[#8c7138]"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#141414] text-[#fed488] hover:bg-[#8c7138] hover:text-white text-xs font-bold transition-colors cursor-pointer shadow-sm flex-shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Ticker Item</span>
            </button>
          </form>

          {/* List of Ticker Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {bannerMarqueeItems.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-white rounded-2xl border border-[#eae5dc] flex items-center justify-between shadow-xs"
              >
                <span className="text-xs font-bold text-[#141414]">{item.text}</span>
                <button
                  type="button"
                  onClick={() => handleDeletePromoMarquee(item.id)}
                  className="p-1 text-[#747878] hover:text-rose-600 transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT STOREFRONT BANNER                      */}
      {/* ======================================================== */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div
            className="relative w-full max-w-xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#eae5dc] max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#eae5dc] bg-[#faf8f5] flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-base text-[#141414]">
                  {editingBannerId ? 'Edit Hero Banner' : 'Create New Hero Banner'}
                </h3>
                <p className="text-[11px] text-[#747878]">
                  Update headline, image, pricing tag, and call-to-action button.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsBannerModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-neutral-200 text-[#747878] hover:text-[#141414] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveBanner} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 no-scrollbar">
              
              {/* Headlines */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#141414] mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={bannerForm.title}
                    onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                    placeholder="e.g. Everything For"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#faf8f5] border border-[#eae5dc] text-xs font-semibold text-[#141414] focus:outline-none focus:border-[#8c7138]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#141414] mb-1">Highlight Gold Text</label>
                  <input
                    type="text"
                    required
                    value={bannerForm.highlightText}
                    onChange={(e) => setBannerForm({ ...bannerForm, highlightText: e.target.value })}
                    placeholder="e.g. Just ₹99"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#faf8f5] border border-[#eae5dc] text-xs font-semibold text-[#8c7138] focus:outline-none focus:border-[#8c7138]"
                  />
                </div>
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-xs font-bold text-[#141414] mb-1">Subtitle</label>
                <input
                  type="text"
                  required
                  value={bannerForm.subtitle}
                  onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                  placeholder="e.g. Anti-Tarnish Daily Wear Jewellery"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#faf8f5] border border-[#eae5dc] text-xs text-[#141414] focus:outline-none focus:border-[#8c7138]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-[#141414] mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={bannerForm.description}
                  onChange={(e) => setBannerForm({ ...bannerForm, description: e.target.value })}
                  placeholder="Detailed description of collection"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#faf8f5] border border-[#eae5dc] text-xs text-[#141414] focus:outline-none focus:border-[#8c7138]"
                />
              </div>

              {/* Badges & Button */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#141414] mb-1">Top Badge</label>
                  <input
                    type="text"
                    value={bannerForm.badge}
                    onChange={(e) => setBannerForm({ ...bannerForm, badge: e.target.value })}
                    placeholder="SPECIAL SALE • FLAT ₹99"
                    className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#eae5dc] text-xs text-[#141414] focus:outline-none focus:border-[#8c7138]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#141414] mb-1">Sub Badge</label>
                  <input
                    type="text"
                    value={bannerForm.subBadge}
                    onChange={(e) => setBannerForm({ ...bannerForm, subBadge: e.target.value })}
                    placeholder="100% WATERPROOF"
                    className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#eae5dc] text-xs text-[#141414] focus:outline-none focus:border-[#8c7138]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#141414] mb-1">Button Text</label>
                  <input
                    type="text"
                    value={bannerForm.buttonText}
                    onChange={(e) => setBannerForm({ ...bannerForm, buttonText: e.target.value })}
                    placeholder="Shop ₹99 Vault"
                    className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#eae5dc] text-xs font-bold text-[#141414] focus:outline-none focus:border-[#8c7138]"
                  />
                </div>
              </div>

              {/* Image URL with live preview */}
              <div>
                <label className="block text-xs font-bold text-[#141414] mb-1 flex items-center justify-between">
                  <span>Banner Image URL</span>
                  <span className="text-[10px] text-[#8c7138] font-bold">Unsplash / Direct Photo Link</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    value={bannerForm.image}
                    onChange={(e) => setBannerForm({ ...bannerForm, image: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-[#faf8f5] border border-[#eae5dc] text-xs font-mono text-[#141414] focus:outline-none focus:border-[#8c7138]"
                  />
                </div>
                {bannerForm.image && (
                  <div className="mt-2 w-full h-32 rounded-xl overflow-hidden border border-[#eae5dc] bg-[#faf8f5]">
                    <img
                      src={bannerForm.image}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* 3 Metric Stats */}
              <div className="pt-2 border-t border-[#eae5dc]">
                <label className="block text-xs font-bold text-[#141414] mb-2">3 Highlight Counters</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <input
                      type="text"
                      placeholder="Stat 1: ₹99"
                      value={bannerForm.stat1Value}
                      onChange={(e) => setBannerForm({ ...bannerForm, stat1Value: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#eae5dc] text-center font-bold"
                    />
                    <input
                      type="text"
                      placeholder="Label 1"
                      value={bannerForm.stat1Label}
                      onChange={(e) => setBannerForm({ ...bannerForm, stat1Label: e.target.value })}
                      className="w-full px-2 py-1 text-[10px] text-center text-[#747878] mt-1"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Stat 2: 18K"
                      value={bannerForm.stat2Value}
                      onChange={(e) => setBannerForm({ ...bannerForm, stat2Value: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#eae5dc] text-center font-bold"
                    />
                    <input
                      type="text"
                      placeholder="Label 2"
                      value={bannerForm.stat2Label}
                      onChange={(e) => setBannerForm({ ...bannerForm, stat2Label: e.target.value })}
                      className="w-full px-2 py-1 text-[10px] text-center text-[#747878] mt-1"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Stat 3: 5 Lac+"
                      value={bannerForm.stat3Value}
                      onChange={(e) => setBannerForm({ ...bannerForm, stat3Value: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#eae5dc] text-center font-bold"
                    />
                    <input
                      type="text"
                      placeholder="Label 3"
                      value={bannerForm.stat3Label}
                      onChange={(e) => setBannerForm({ ...bannerForm, stat3Label: e.target.value })}
                      className="w-full px-2 py-1 text-[10px] text-center text-[#747878] mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-3 border-t border-[#eae5dc] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-[#eae5dc] text-xs font-bold text-[#747878] hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#141414] text-[#fed488] hover:bg-[#8c7138] hover:text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  {editingBannerId ? 'Save & Update Banner' : 'Publish Banner to Store'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
