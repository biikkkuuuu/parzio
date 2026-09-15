import React, { useState } from 'react';
import { OrderItem } from '../types';
import {
  ArrowLeft,
  CheckCircle2,
  Truck,
  Package,
  Clock,
  MapPin,
  ExternalLink,
  Copy,
  Check,
  Phone,
  ChevronRight
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
  const [copiedAwb, setCopiedAwb] = useState(false);

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
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#eae5dc]">
          <button
            onClick={() => {
              setSelectedOrder(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-[#141414] hover:text-[#8c7138] transition-colors py-1.5 px-3.5 rounded-full bg-white border border-[#eae5dc] shadow-2xs cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#8c7138]" />
            <span>All Orders</span>
          </button>

          {/* Status Badge */}
          <span className={`text-[11px] font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${getStatusColor(selectedOrder.status)}`}>
            {selectedOrder.status}
          </span>
        </div>

        {/* Order Header Summary Card */}
        <div className="bg-white rounded-3xl p-5 border border-[#eae5dc] shadow-xs mb-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] text-[#747878] font-medium block">Order Number</span>
              <h2 className="font-mono text-lg font-bold text-[#141414] mt-0.5">
                #{selectedOrder.id}
              </h2>
              <p className="text-xs text-[#747878] mt-1">
                For <strong className="text-[#141414]">{selectedOrder.customerName}</strong>
              </p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-[#747878] font-medium block">Total</span>
              <span className="font-display text-xl font-bold text-[#141414]">
                ₹{selectedOrder.amount}
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">
                {selectedOrder.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Prepaid (UPI)'}
              </span>
            </div>
          </div>
        </div>

        {/* Courier & Tracking Card */}
        <div className="bg-white rounded-3xl p-5 border border-[#eae5dc] shadow-xs mb-4 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#eae5dc]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#faf6ef] border border-[#ebd7be] flex items-center justify-center text-[#8c7138]">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#141414]">Courier Delivery</h4>
                <p className="text-[11px] text-[#747878]">{selectedOrder.courier || 'BlueDart Express'}</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live
            </span>
          </div>

          {/* Tracking Number AWB Box */}
          <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#eae5dc] space-y-1.5">
            <span className="text-[10px] font-bold text-[#747878] uppercase tracking-wider block">
              Tracking Number (AWB)
            </span>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-sm font-bold text-[#141414] select-all">
                {selectedOrder.trackingNumber || `BD-${selectedOrder.id.replace(/[^0-9]/g, '')}729`}
              </span>
              <button
                onClick={() => handleCopyAwb(selectedOrder.trackingNumber || `BD-${selectedOrder.id.replace(/[^0-9]/g, '')}729`)}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white hover:bg-neutral-100 border border-[#eae5dc] text-[11px] font-bold text-[#141414] transition-colors cursor-pointer active:scale-95"
              >
                {copiedAwb ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700">Copied</span>
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

          {/* Estimated Delivery */}
          <div className="flex items-center gap-2 text-xs text-[#747878] pt-1">
            <Clock className="w-4 h-4 text-[#8c7138] flex-shrink-0" />
            <span>
              Estimated Delivery: <strong className="text-[#141414]">2 - 3 Business Days</strong>
            </span>
          </div>
        </div>

        {/* Live Delivery Journey */}
        <div className="bg-white rounded-3xl p-5 border border-[#eae5dc] shadow-xs mb-4 space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-[#eae5dc]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#141414] flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#8c7138]" /> Order Journey
            </h4>
            <span className="text-[11px] font-semibold text-[#8c7138]">Step {currentStep} of 5</span>
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
              <h5 className="text-xs font-bold text-[#141414]">Order Confirmed</h5>
              <p className="text-[11px] text-[#747878]">Order details received and verified</p>
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
              <h5 className="text-xs font-bold text-[#141414]">Quality Check Passed</h5>
              <p className="text-[11px] text-[#747878]">18K gold coating &amp; anti-tarnish verified</p>
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
              <h5 className="text-xs font-bold text-[#141414]">Packed &amp; Sealed</h5>
              <p className="text-[11px] text-[#747878]">Secured in anti-tarnish luxury velvet pouch</p>
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
                In Transit with {selectedOrder.courier?.split(' ')[0] || 'Courier'}
              </h5>
              <p className="text-[11px] text-[#747878]">
                {currentStep >= 4 ? 'Package is on its way to your destination' : 'Ready for courier dispatch pickup'}
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
              <h5 className="text-xs font-bold text-[#141414]">Out for Delivery</h5>
              <p className="text-[11px] text-[#747878]">
                {currentStep >= 5 ? 'Delivered successfully' : 'Arriving at your doorstep soon'}
              </p>
            </div>
          </div>
        </div>

        {/* Ordered Item Details */}
        <div className="bg-white rounded-3xl p-5 border border-[#eae5dc] shadow-xs mb-4 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#141414] flex items-center gap-1.5 pb-2 border-b border-[#eae5dc]">
            <Package className="w-4 h-4 text-[#8c7138]" /> Ordered Item
          </h4>

          <div className="flex items-center gap-3.5 py-1">
            <img
              src={selectedOrder.image}
              alt={selectedOrder.productName}
              className="w-16 h-16 object-cover rounded-2xl bg-[#faf8f5] p-1 border border-[#eae5dc]"
            />
            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-bold text-[#141414] leading-snug line-clamp-2">
                {selectedOrder.productName}
              </h5>
              <p className="text-[11px] text-[#747878] font-mono mt-0.5">{selectedOrder.sku}</p>
              <div className="flex items-center gap-2 mt-1.5 text-xs">
                <span className="font-bold text-[#141414]">₹{selectedOrder.amount}</span>
                <span className="text-[#747878]">• Qty: {selectedOrder.quantity || 1}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-3xl p-5 border border-[#eae5dc] shadow-xs mb-4 space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-[#eae5dc]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#141414] flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#8c7138]" /> Shipping Address
            </h4>
            <span className="text-[10px] font-mono font-bold text-[#8c7138]">PIN: {selectedOrder.pincode}</span>
          </div>

          <div className="text-xs space-y-1">
            <p className="font-bold text-[#141414]">{selectedOrder.customerName}</p>
            <p className="text-[#747878] leading-relaxed">{selectedOrder.location}</p>
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
            <span>Need Help? Chat on WhatsApp</span>
          </a>

          <button
            onClick={() => {
              setSelectedOrder(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-neutral-50 border border-[#eae5dc] text-neutral-800 text-xs font-bold transition-colors cursor-pointer"
          >
            Back to Orders List
          </button>
        </div>
      </div>
    );
  }

  /* ========================================================================= */
  /* SCREEN 2: CLEAN ALL ORDERS LIST VIEW (Real E-Commerce Standard)          */
  /* ========================================================================= */
  return (
    <div className="min-h-[85vh] bg-[#fbf9f6] pb-28 px-4 pt-4 max-w-lg mx-auto animate-fadeIn">
      {/* Clean Header */}
      <div className="mb-4 px-1">
        <h2 className="font-display text-2xl font-bold text-[#141414] tracking-tight">
          My Orders
        </h2>
      </div>

      {/* Orders List Cards */}
      {orders.length > 0 ? (
        <div className="space-y-3.5">
          {orders.map((order) => (
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
                  <span className="text-[11px] font-medium text-[#747878] truncate max-w-[150px]">
                    {order.customerName}
                  </span>
                </div>
                <span className="text-xs font-bold text-[#8c7138] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  <span>Track</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Order Item Details */}
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
                      {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Prepaid'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Card Footer */}
              <div className="pt-2.5 border-t border-[#f3efe8] flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1 text-[#747878]">
                  <Truck className="w-3.5 h-3.5 text-[#8c7138]" />
                  <span>{order.courier || 'BlueDart Express'}</span>
                </span>
                <span className="text-xs font-bold text-[#141414] group-hover:text-[#8c7138] flex items-center gap-0.5">
                  View Status &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Clean Empty State */
        <div className="bg-white rounded-3xl p-8 text-center border border-[#eae5dc] shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#faf6ef] text-[#8c7138] flex items-center justify-center mx-auto mb-3">
            <Package className="w-6 h-6" />
          </div>
          <h4 className="font-display text-base font-bold text-[#141414]">No Orders Yet</h4>
          <p className="text-xs text-[#747878] mt-1 max-w-xs mx-auto">
            Your placed orders will appear here.
          </p>
        </div>
      )}
    </div>
  );
};
