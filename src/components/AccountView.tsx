import React from 'react';
import { User, Phone, MapPin, Package, Heart, Sparkles, LayoutDashboard, ChevronRight, Award } from 'lucide-react';
import { OrderItem } from '../types';

interface AccountViewProps {
  orders: OrderItem[];
  onOpenWishlist: () => void;
  onOpenAtelierOps: () => void;
  onTrackOrder: () => void;
}

export const AccountView: React.FC<AccountViewProps> = ({
  orders,
  onOpenWishlist,
  onOpenAtelierOps,
  onTrackOrder
}) => {
  return (
    <div className="min-h-[80vh] bg-[#fbf9f6] pb-24 px-4 pt-4 max-w-md mx-auto space-y-4">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-5 border border-[#eae5dc] shadow-sm flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#faf8f5] border border-[#eae5dc] flex items-center justify-center text-[#8c7138] font-display text-xl font-bold">
          PS
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="font-display text-lg font-bold text-[#141414]">
              Pooja Sharma
            </h3>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <p className="text-xs text-[#747878]">+91 98765 43210</p>
          <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-[#8c7138]">
            <Award className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>PARZIO Gold Circle • 1,240 Pts</span>
          </div>
        </div>
      </div>

      {/* Quick Action Tiles */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onTrackOrder}
          className="p-4 rounded-3xl bg-white border border-[#eae5dc] shadow-xs text-left hover:border-[#8c7138] transition-colors"
        >
          <Package className="w-5 h-5 text-[#8c7138] mb-2" />
          <h4 className="text-xs font-bold text-[#141414]">My Orders</h4>
          <p className="text-[10px] text-[#747878] mt-0.5">{orders.length} Active Shipments</p>
        </button>

        <button
          onClick={onOpenWishlist}
          className="p-4 rounded-3xl bg-white border border-[#eae5dc] shadow-xs text-left hover:border-[#8c7138] transition-colors"
        >
          <Heart className="w-5 h-5 text-red-500 mb-2" />
          <h4 className="text-xs font-bold text-[#141414]">Saved Wishlist</h4>
          <p className="text-[10px] text-[#747878] mt-0.5">Explore saved pieces</p>
        </button>
      </div>

      {/* Saved Delivery Addresses */}
      <div className="bg-white rounded-3xl p-5 border border-[#eae5dc] shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#eae5dc]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#141414] flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#8c7138]" /> Saved Address
          </h4>
          <span className="text-[10px] text-[#8c7138] font-bold uppercase">Primary</span>
        </div>
        <p className="text-xs font-bold text-[#141414]">Flat 402, Lotus Towers, Andheri West</p>
        <p className="text-xs text-[#747878]">Mumbai, Maharashtra — 400053</p>
      </div>

      {/* Customer Concierge */}
      <div className="bg-[#faefe3] rounded-3xl p-5 border border-[#ebdccd] shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-[#8c7138]" />
          <h4 className="text-xs font-bold text-[#141414]">WhatsApp VIP Concierge</h4>
        </div>
        <p className="text-xs text-[#444748]">
          Have questions about your jewellery sizing or anti-tarnish warranty? Chat directly with our Mumbai stylists.
        </p>
        <a
          href="https://wa.me/919876543210"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#141414] text-white text-xs font-bold uppercase hover:bg-[#8c7138] transition-colors"
        >
          <span>Chat on WhatsApp</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Atelier Ops Hub Link */}
      <div className="pt-2">
        <button
          onClick={onOpenAtelierOps}
          className="w-full flex items-center justify-between p-4 rounded-3xl bg-[#141414] text-white hover:bg-[#8c7138] transition-colors text-xs font-bold"
        >
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4 text-[#fed488]" />
            <span>Enter Atelier Ops &amp; Admin Hub (Enterprise)</span>
          </div>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
