import React, { useState } from 'react';
import { OrderItem } from '../types';
import { Search, CheckCircle2, Truck, Package, Clock, ShieldCheck, MapPin } from 'lucide-react';

interface TrackOrderViewProps {
  orders: OrderItem[];
}

export const TrackOrderView: React.FC<TrackOrderViewProps> = ({ orders }) => {
  const [searchInput, setSearchInput] = useState(orders[0]?.id || 'PARZIO-98241');
  const [activeOrder, setActiveOrder] = useState<OrderItem | null>(orders[0] || null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim().toUpperCase();
    const found = orders.find(
      (o) =>
        o.id.toUpperCase() === query ||
        o.id.replace('#', '').toUpperCase() === query ||
        o.customerName.toUpperCase().includes(query)
    );
    if (found) {
      setActiveOrder(found);
    } else {
      setActiveOrder(null);
    }
  };

  return (
    <div className="min-h-[80vh] bg-[#fbf9f6] pb-24 px-4 pt-4 max-w-md mx-auto">
      {/* Title */}
      <div className="text-center mb-6">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8c7138] block mb-1">
          Real-Time Courier Telemetry
        </span>
        <h2 className="font-display text-2xl font-bold text-[#141414]">
          Track Your Order
        </h2>
        <p className="text-xs text-[#444748] mt-1">
          Monitor your jewellery from our Mumbai Atelier to your doorstep.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Enter Order ID (e.g. PARZIO-98241)..."
            className="w-full bg-white pl-10 pr-24 py-3 rounded-2xl border border-[#eae5dc] text-xs font-semibold text-[#141414] focus:outline-none focus:border-[#8c7138] shadow-xs"
          />
          <Search className="w-4 h-4 text-[#747878] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl bg-[#141414] text-white text-xs font-bold uppercase hover:bg-[#8c7138] transition-colors"
          >
            Track
          </button>
        </div>
      </form>

      {/* Quick Suggestions Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-3 mb-4">
        <span className="text-[10px] text-[#747878] font-bold uppercase whitespace-nowrap">Recent:</span>
        {orders.map((ord) => (
          <button
            key={ord.id}
            onClick={() => {
              setSearchInput(ord.id);
              setActiveOrder(ord);
            }}
            className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border transition-colors whitespace-nowrap ${
              activeOrder?.id === ord.id
                ? 'bg-[#141414] text-white border-[#141414]'
                : 'bg-white text-[#444748] border-[#eae5dc]'
            }`}
          >
            #{ord.id}
          </button>
        ))}
      </div>

      {/* Order Status Display */}
      {activeOrder ? (
        <div className="space-y-4">
          {/* Order Header Card */}
          <div className="bg-white rounded-3xl p-4 border border-[#eae5dc] shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#eae5dc]">
              <div>
                <span className="font-mono text-xs font-bold text-[#8c7138]">
                  #{activeOrder.id}
                </span>
                <h3 className="font-display text-base font-bold text-[#141414]">
                  {activeOrder.customerName}
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#fed488]/30 text-[#775a19] text-[10px] font-bold uppercase tracking-wider">
                {activeOrder.status}
              </span>
            </div>

            <div className="flex items-center gap-3 py-3">
              <img
                src={activeOrder.image}
                alt={activeOrder.productName}
                className="w-14 h-14 object-contain rounded-xl bg-[#faf8f5] p-1 border border-[#eae5dc]"
              />
              <div className="flex-1">
                <h4 className="text-xs font-bold text-[#141414] leading-snug line-clamp-1">
                  {activeOrder.productName}
                </h4>
                <p className="text-[11px] text-[#747878] mt-0.5">{activeOrder.sku}</p>
                <div className="flex items-center gap-2 mt-1 text-[11px]">
                  <span className="font-bold text-[#141414]">₹{activeOrder.amount}</span>
                  <span className="text-[#747878]">• {activeOrder.paymentMethod}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#eae5dc] flex items-center justify-between text-[11px] text-[#747878]">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#8c7138]" /> {activeOrder.location}
              </span>
              <span className="font-semibold text-[#141414]">{activeOrder.courier}</span>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="bg-white rounded-3xl p-5 border border-[#eae5dc] shadow-sm space-y-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#141414] flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#8c7138]" /> Live Journey
            </h4>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#eae5dc]">
              {/* Step 1 */}
              <div className="relative">
                <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-xs flex items-center justify-center text-white">
                  <CheckCircle2 className="w-3 h-3" />
                </div>
                <h5 className="text-xs font-bold text-[#141414]">Order Confirmed &amp; Logged</h5>
                <p className="text-[11px] text-[#747878]">Doorstep delivery details verified</p>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-xs flex items-center justify-center text-white">
                  <CheckCircle2 className="w-3 h-3" />
                </div>
                <h5 className="text-xs font-bold text-[#141414]">5-Step Quality Check Passed</h5>
                <p className="text-[11px] text-[#747878]">18K PVD coating and saline test certified</p>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-xs flex items-center justify-center text-white">
                  <Package className="w-2.5 h-2.5" />
                </div>
                <h5 className="text-xs font-bold text-[#141414]">Packed in Anti-Tarnish Velvet Pouch</h5>
                <p className="text-[11px] text-[#747878]">Sealed at Mumbai Atelier Hub 01</p>
              </div>

              {/* Step 4 */}
              <div className="relative">
                <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-[#8c7138] border-2 border-white shadow-xs flex items-center justify-center text-white animate-pulse">
                  <Truck className="w-2.5 h-2.5" />
                </div>
                <h5 className="text-xs font-bold text-[#8c7138]">Handed over to BlueDart Express</h5>
                <p className="text-[11px] text-[#747878]">In Transit • Expected in 48-72 hours</p>
              </div>

              {/* Step 5 */}
              <div className="relative opacity-50">
                <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-[#eae5dc] border-2 border-white" />
                <h5 className="text-xs font-bold text-[#444748]">Doorstep Delivery &amp; Handover</h5>
                <p className="text-[11px] text-[#747878]">Zero-contact verification available</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 text-center border border-[#eae5dc] shadow-sm">
          <Truck className="w-10 h-10 text-[#c4c7c7] mx-auto mb-2" />
          <h4 className="font-display text-base font-bold text-[#141414]">Order Not Found</h4>
          <p className="text-xs text-[#747878] mt-1">
            Please check the Order ID or phone number and try again.
          </p>
        </div>
      )}
    </div>
  );
};
