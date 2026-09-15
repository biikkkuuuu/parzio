import React, { useState } from 'react';
import { OrderItem } from '../types';
import {
  ArrowLeft,
  Search,
  CheckCircle2,
  Truck,
  Package,
  Clock,
  ShieldCheck,
  MapPin,
  ExternalLink,
  Copy,
  Check,
  Phone,
  Printer,
  ChevronRight,
  Sparkles,
  AlertCircle,
  X,
  CreditCard
} from 'lucide-react';

interface TrackOrderViewProps {
  orders: OrderItem[];
  initialOrderId?: string | null;
}

export const TrackOrderView: React.FC<TrackOrderViewProps> = ({
  orders,
  initialOrderId = null
}) => {
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(
    initialOrderId ? orders.find((o) => o.id === initialOrderId) || null : null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Confirmed' | 'In Transit' | 'Delivered'>('All');
  const [copiedAwb, setCopiedAwb] = useState(false);

  // Filter orders based on search and status
  const filteredOrders = orders.filter((order) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      order.id.toLowerCase().includes(query) ||
      order.customerName.toLowerCase().includes(query) ||
      order.productName.toLowerCase().includes(query) ||
      (order.trackingNumber && order.trackingNumber.toLowerCase().includes(query));

    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Confirmed' && (order.status === 'COD Confirmed' || order.status === 'Prepaid UPI')) ||
      (statusFilter === 'In Transit' && (order.status === 'In Transit' || order.status === 'Dispatched' || order.status === 'Packed')) ||
      (statusFilter === 'Delivered' && order.status === 'Delivered');

    return matchesSearch && matchesStatus;
  });

  const handleCopyAwb = (awb: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(awb);
      setCopiedAwb(true);
      setTimeout(() => setCopiedAwb(false), 2000);
    }
  };

  const getTrackingUrl = (courier: string, awb?: string) => {
    if (!awb) return 'https://www.bluedart.com';
    const c = courier.toLowerCase();
    if (c.includes('bluedart')) {
      return `https://www.bluedart.com/tracking?trackNumber=${encodeURIComponent(awb)}`;
    }
    if (c.includes('delhivery')) {
      return `https://www.delhivery.com/tracking?waybill=${encodeURIComponent(awb)}`;
    }
    return `https://trackcourier.io/track-and-trace/${encodeURIComponent(awb)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'In Transit':
      case 'Dispatched':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'COD Confirmed':
      case 'Prepaid UPI':
      case 'Packed':
        return 'bg-[#faf6ef] text-[#8c7138] border-[#ebd7be]';
      case 'COD Pending':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  // Determine active step in the journey based on order status
  const getJourneyStep = (status: string) => {
    switch (status) {
      case 'COD Pending':
        return 1;
      case 'COD Confirmed':
      case 'Prepaid UPI':
        return 2;
      case 'Packed':
        return 3;
      case 'Dispatched':
      case 'In Transit':
        return 4;
      case 'Delivered':
        return 5;
      default:
        return 2;
    }
  };

  /* ========================================================================= */
  /* SCREEN 1: DEDICATED ORDER DETAILS & TRACKING PAGE                        */
  /* ========================================================================= */
  if (selectedOrder) {
    const currentStep = getJourneyStep(selectedOrder.status);
    const trackingUrl = getTrackingUrl(selectedOrder.courier, selectedOrder.trackingNumber);

    return (
      <div className="min-h-screen bg-[#fbf9f6] pb-28 pt-4 px-4 max-w-lg mx-auto animate-fadeIn">
        {/* Top Back Navigation Bar */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#eae5dc]">
          <button
            onClick={() => {
              setSelectedOrder(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-[#141414] hover:text-[#8c7138] transition-colors py-1.5 px-3 rounded-full bg-white border border-[#eae5dc] shadow-2xs cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#8c7138]" />
            <span>Back to Orders</span>
          </button>

          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${getStatusColor(selectedOrder.status)}`}>
            {selectedOrder.status}
          </span>
        </div>

        {/* Order Header Summary Card */}
        <div className="bg-white rounded-3xl p-5 border border-[#eae5dc] shadow-xs mb-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#8c7138] uppercase tracking-wider block">
                Order ID
              </span>
              <h2 className="font-mono text-lg font-bold text-[#141414]">
                #{selectedOrder.id}
              </h2>
              <p className="text-xs text-[#747878] mt-0.5">
                Placed by <strong className="text-[#141414]">{selectedOrder.customerName}</strong>
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-semibold text-[#747878] block">Total Amount</span>
              <span className="font-display text-xl font-bold text-[#141414]">
                ₹{selectedOrder.amount}
              </span>
              <span className="text-[10px] text-emerald-700 font-bold block">
                {selectedOrder.paymentMethod === 'COD' ? 'Cash on Delivery' : '100% Prepaid UPI'}
              </span>
            </div>
          </div>
        </div>

        {/* Courier & Live Tracking Details Card */}
        <div className="bg-white rounded-3xl p-5 border border-[#eae5dc] shadow-xs mb-4 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#eae5dc]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#faf6ef] border border-[#ebd7be] flex items-center justify-center text-[#8c7138]">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#141414]">Courier Partner</h4>
                <p className="text-[11px] text-[#747878]">{selectedOrder.courier || 'BlueDart Surface Express'}</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active Telemetry
            </span>
          </div>

          {/* AWB Tracking Code Box */}
          <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#eae5dc] space-y-2">
            <span className="text-[10px] font-bold text-[#747878] uppercase tracking-wider block">
              Air Waybill (AWB) Tracking Number
            </span>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-sm font-bold text-[#141414] tracking-wider select-all">
                {selectedOrder.trackingNumber || `BD-${selectedOrder.id.replace(/[^0-9]/g, '')}729`}
              </span>
              <button
                onClick={() => handleCopyAwb(selectedOrder.trackingNumber || `BD-${selectedOrder.id.replace(/[^0-9]/g, '')}729`)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-neutral-100 border border-[#eae5dc] text-[11px] font-bold text-[#141414] transition-colors cursor-pointer active:scale-95"
              >
                {copiedAwb ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-[#747878]" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Official Tracking Link Button */}
          <a
            href={trackingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-2xl bg-[#141414] hover:bg-[#8c7138] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98 cursor-pointer"
          >
            <span>Track on {selectedOrder.courier?.split(' ')[0] || 'Courier'} Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#fed488]" />
          </a>

          {/* Delivery Estimate Banner */}
          <div className="flex items-center gap-2 text-xs text-[#747878] pt-1">
            <Clock className="w-4 h-4 text-[#8c7138] flex-shrink-0" />
            <span>
              Estimated Doorstep Delivery: <strong className="text-[#141414]">2 - 3 Business Days</strong>
            </span>
          </div>
        </div>

        {/* Visual Live Journey Timeline Stepper */}
        <div className="bg-white rounded-3xl p-5 border border-[#eae5dc] shadow-xs mb-4 space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-[#eae5dc]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#141414] flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#8c7138]" /> Live Journey
            </h4>
            <span className="text-[10px] font-bold text-[#8c7138]">Step {currentStep} of 5</span>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#eae5dc]">
            {/* Step 1: Confirmed */}
            <div className="relative">
              <div
                className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 border-white shadow-xs flex items-center justify-center text-white ${
                  currentStep >= 1 ? 'bg-emerald-500' : 'bg-neutral-300'
                }`}
              >
                <CheckCircle2 className="w-3 h-3" />
              </div>
              <h5 className="text-xs font-bold text-[#141414]">Order Confirmed &amp; Logged</h5>
              <p className="text-[11px] text-[#747878]">Customer details &amp; order payload verified</p>
            </div>

            {/* Step 2: Quality Check */}
            <div className="relative">
              <div
                className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 border-white shadow-xs flex items-center justify-center text-white ${
                  currentStep >= 2 ? 'bg-emerald-500' : 'bg-neutral-300'
                }`}
              >
                <CheckCircle2 className="w-3 h-3" />
              </div>
              <h5 className="text-xs font-bold text-[#141414]">5-Step Quality Check Passed</h5>
              <p className="text-[11px] text-[#747878]">18K PVD coating, skin-safe &amp; saline test certified</p>
            </div>

            {/* Step 3: Packed */}
            <div className="relative">
              <div
                className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 border-white shadow-xs flex items-center justify-center text-white ${
                  currentStep >= 3 ? 'bg-emerald-500' : 'bg-neutral-300'
                }`}
              >
                {currentStep >= 3 ? <CheckCircle2 className="w-3 h-3" /> : <Package className="w-2.5 h-2.5" />}
              </div>
              <h5 className="text-xs font-bold text-[#141414]">Packed in Anti-Tarnish Velvet Pouch</h5>
              <p className="text-[11px] text-[#747878]">Sealed at Mumbai Atelier Hub 01</p>
            </div>

            {/* Step 4: Dispatched / In Transit */}
            <div className="relative">
              <div
                className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 border-white shadow-xs flex items-center justify-center text-white ${
                  currentStep >= 4 ? 'bg-[#8c7138] animate-pulse' : 'bg-neutral-300'
                }`}
              >
                <Truck className="w-2.5 h-2.5" />
              </div>
              <h5 className={`text-xs font-bold ${currentStep >= 4 ? 'text-[#8c7138]' : 'text-neutral-500'}`}>
                Handed over to {selectedOrder.courier?.split(' ')[0] || 'BlueDart'} Express
              </h5>
              <p className="text-[11px] text-[#747878]">
                {currentStep >= 4 ? 'In Transit • Tracking AWB active' : 'Scheduled for dispatch pickup'}
              </p>
            </div>

            {/* Step 5: Doorstep Delivery */}
            <div className={`relative ${currentStep < 5 ? 'opacity-60' : ''}`}>
              <div
                className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 border-white shadow-xs flex items-center justify-center text-white ${
                  currentStep >= 5 ? 'bg-emerald-500' : 'bg-[#eae5dc]'
                }`}
              >
                {currentStep >= 5 && <CheckCircle2 className="w-3 h-3" />}
              </div>
              <h5 className="text-xs font-bold text-[#141414]">Doorstep Delivery &amp; Handover</h5>
              <p className="text-[11px] text-[#747878]">
                {currentStep >= 5 ? 'Successfully delivered to customer' : 'Zero-contact verification available on delivery'}
              </p>
            </div>
          </div>
        </div>

        {/* Ordered Item Particulars */}
        <div className="bg-white rounded-3xl p-5 border border-[#eae5dc] shadow-xs mb-4 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#141414] flex items-center gap-1.5 pb-2 border-b border-[#eae5dc]">
            <Package className="w-4 h-4 text-[#8c7138]" /> Ordered Items ({selectedOrder.quantity || 1})
          </h4>

          <div className="flex items-center gap-3.5 py-2">
            <img
              src={selectedOrder.image}
              alt={selectedOrder.productName}
              className="w-16 h-16 object-cover rounded-2xl bg-[#faf8f5] p-1 border border-[#eae5dc]"
            />
            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-bold text-[#141414] leading-snug truncate">
                {selectedOrder.productName}
              </h5>
              <p className="text-[11px] text-[#747878] font-mono mt-0.5">{selectedOrder.sku}</p>
              <div className="flex items-center gap-2 mt-1.5 text-xs">
                <span className="font-bold text-[#141414]">₹{selectedOrder.amount}</span>
                <span className="text-[#747878]">• Qty: {selectedOrder.quantity || 1}</span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                  {selectedOrder.tag || '18K PVD Verified'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Address & Customer Details */}
        <div className="bg-white rounded-3xl p-5 border border-[#eae5dc] shadow-xs mb-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#eae5dc]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#141414] flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#8c7138]" /> Delivery Address
            </h4>
            <span className="text-[10px] font-mono font-bold text-[#8c7138]">PIN: {selectedOrder.pincode}</span>
          </div>

          <div className="text-xs space-y-1">
            <p className="font-bold text-[#141414]">{selectedOrder.customerName}</p>
            <p className="text-[#747878]">{selectedOrder.location}</p>
            {selectedOrder.phone && (
              <p className="text-[#747878] flex items-center gap-1 pt-1">
                <Phone className="w-3 h-3 text-[#8c7138]" /> {selectedOrder.phone}
              </p>
            )}
          </div>
        </div>

        {/* Support & Actions Footer */}
        <div className="space-y-2.5 pt-1">
          <a
            href={`https://wa.me/919106694317?text=Hi%20PARZIO,%20I%20need%20assistance%20with%20my%20Order%20%23${selectedOrder.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-2xl bg-[#faf6ef] hover:bg-[#ebd7be] border border-[#ebd7be] text-[#8c7138] text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Need Help? Chat with Mumbai Atelier on WhatsApp</span>
          </a>

          <button
            onClick={() => {
              setSelectedOrder(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-neutral-50 border border-[#eae5dc] text-neutral-800 text-xs font-bold transition-colors cursor-pointer"
          >
            View All Other Orders
          </button>
        </div>
      </div>
    );
  }

  /* ========================================================================= */
  /* SCREEN 2: ALL ORDERS LIST VIEW                                           */
  /* ========================================================================= */
  return (
    <div className="min-h-[85vh] bg-[#fbf9f6] pb-28 px-4 pt-4 max-w-lg mx-auto animate-fadeIn">
      {/* Page Header */}
      <div className="text-center mb-6">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8c7138] block mb-1">
          PARZIO ATELIER LOGISTICS
        </span>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#141414]">
          My Orders &amp; Tracking
        </h2>
        <p className="text-xs text-[#747878] mt-1 max-w-xs mx-auto leading-relaxed">
          Select any order to view live parcel journey, AWB tracking link, and doorstep telemetry.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative mb-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Order ID (e.g. 98241), item, or AWB..."
          className="w-full bg-white pl-10 pr-10 py-3 rounded-2xl border border-[#eae5dc] text-xs font-medium text-[#141414] placeholder-[#9ca3af] focus:outline-none focus:border-[#8c7138] shadow-2xs"
        />
        <Search className="w-4 h-4 text-[#747878] absolute left-3.5 top-1/2 -translate-y-1/2" />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#747878] hover:text-[#141414]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-3 mb-3">
        {(['All', 'Confirmed', 'In Transit', 'Delivered'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              statusFilter === tab
                ? 'bg-[#141414] text-white shadow-2xs'
                : 'bg-white text-[#747878] border border-[#eae5dc] hover:border-[#8c7138]'
            }`}
          >
            {tab === 'All' ? `All Orders (${orders.length})` : tab}
          </button>
        ))}
      </div>

      {/* Orders List Cards */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-3.5">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => {
                setSelectedOrder(order);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group bg-white rounded-3xl p-4 border border-[#eae5dc] hover:border-[#8c7138] shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer text-left relative overflow-hidden active:scale-99"
            >
              {/* Order Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#eae5dc]">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#8c7138]">
                    #{order.id}
                  </span>
                  <span className="text-[10px] text-[#9ca3af]">•</span>
                  <span className="text-[11px] font-medium text-[#747878] truncate max-w-[120px]">
                    {order.customerName}
                  </span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              {/* Order Product Particulars */}
              <div className="flex items-center gap-3 py-3">
                <img
                  src={order.image}
                  alt={order.productName}
                  className="w-14 h-14 object-cover rounded-2xl bg-[#faf8f5] p-1 border border-[#eae5dc] flex-shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-[#141414] leading-snug line-clamp-1 group-hover:text-[#8c7138] transition-colors">
                    {order.productName}
                  </h4>
                  <p className="text-[11px] text-[#747878] font-mono mt-0.5">{order.sku}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <span className="font-bold text-[#141414]">₹{order.amount}</span>
                    <span className="text-[#9ca3af]">•</span>
                    <span className="text-[10px] text-[#747878] font-medium">
                      {order.paymentMethod === 'COD' ? 'COD' : 'Prepaid UPI'}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#9ca3af] group-hover:text-[#8c7138] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </div>

              {/* Order Card Footer with Courier Preview */}
              <div className="pt-2.5 border-t border-[#f3efe8] flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1 text-[#747878]">
                  <Truck className="w-3.5 h-3.5 text-[#8c7138]" />
                  <span>{order.courier?.split(' ')[0] || 'BlueDart'}</span>
                  {order.trackingNumber && (
                    <span className="font-mono text-[10px] font-bold text-[#141414]">
                      • {order.trackingNumber}
                    </span>
                  )}
                </span>
                <span className="text-xs font-bold text-[#8c7138] group-hover:underline flex items-center gap-0.5">
                  Track Journey &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-8 text-center border border-[#eae5dc] shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#faf6ef] text-[#8c7138] flex items-center justify-center mx-auto mb-3">
            <Package className="w-6 h-6" />
          </div>
          <h4 className="font-display text-base font-bold text-[#141414]">No Orders Found</h4>
          <p className="text-xs text-[#747878] mt-1 max-w-xs mx-auto">
            {searchQuery
              ? `No shipments matched "${searchQuery}". Try searching with another ID or customer name.`
              : 'You have no active orders in this filter category.'}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="mt-3 px-4 py-1.5 rounded-full bg-[#141414] text-white text-xs font-bold hover:bg-[#8c7138] transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>
      )}
    </div>
  );
};
