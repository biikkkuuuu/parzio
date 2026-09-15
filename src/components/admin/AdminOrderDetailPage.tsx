import React, { useState } from 'react';
import { OrderItem, OrderStatus } from '../../types';
import {
  ArrowLeft,
  Package,
  User,
  Phone,
  MapPin,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Edit2,
  MessageCircle,
  ShieldCheck,
  CreditCard,
  Clock,
  Trash2,
  FileText,
  RefreshCw,
  Save,
  Check
} from 'lucide-react';

interface AdminOrderDetailPageProps {
  order: OrderItem;
  onBack: () => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onEditOrder: (order: OrderItem) => void;
  onDeleteOrder: (orderId: string) => void;
  onPrintOrder: (order: OrderItem) => void;
  onTriggerToast: (msg: string) => void;
}

const ALL_STATUSES: { id: OrderStatus; label: string }[] = [
  { id: 'COD Confirmed', label: '1. Confirmed' },
  { id: 'Packed', label: '2. Packed' },
  { id: 'Dispatched', label: '3. Dispatched' },
  { id: 'In Transit', label: '4. In Transit' },
  { id: 'Delivered', label: '5. Delivered' },
  { id: 'Cancelled', label: 'Cancelled' }
];

export const AdminOrderDetailPage: React.FC<AdminOrderDetailPageProps> = ({
  order,
  onBack,
  onUpdateOrderStatus,
  onEditOrder,
  onDeleteOrder,
  onPrintOrder,
  onTriggerToast
}) => {
  const [loadingStatus, setLoadingStatus] = useState<string | null>(null);
  const [editingAwb, setEditingAwb] = useState<string>(
    order.trackingNumber || `BD-${order.id.replace(/[^0-9]/g, '') || '982410'}729`
  );
  const [editingCourier, setEditingCourier] = useState<string>(
    order.courier || 'BlueDart Air Express'
  );

  const handleStatusChangeWithAnimation = (newStatus: OrderStatus) => {
    setLoadingStatus(newStatus);
    setTimeout(() => {
      onUpdateOrderStatus(order.id, newStatus);
      setLoadingStatus(null);
      onTriggerToast(`Order #${order.id} status updated to: ${newStatus}`);
    }, 700);
  };

  const handleSaveTracking = () => {
    const updated = {
      ...order,
      trackingNumber: editingAwb.trim(),
      courier: editingCourier.trim()
    };
    onEditOrder(updated);
    onTriggerToast(`Updated AWB Tracking Number to ${editingAwb.trim()}`);
  };

  const isHighRTO = order.rtoRisk === 'High';
  const isCancelled = order.status === 'Cancelled';
  const isDelivered = order.status === 'Delivered';

  const whatsappUrl = order.phone
    ? `https://wa.me/${order.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
        `Hi ${order.customerName}! Update regarding your PARZIO Order #${order.id}: Status is now ${order.status}. Tracking AWB: ${order.trackingNumber || editingAwb}`
      )}`
    : '#';

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Top Header / Breadcrumb Nav */}
      <div className="bg-white rounded-2xl p-5 border border-[#eae5dc] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onBack}
            className="px-3.5 py-2 rounded-full bg-[#faf8f5] hover:bg-[#eae5dc] text-[#141414] transition-colors border border-[#eae5dc] flex items-center gap-1.5 text-xs font-bold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#8c7138]" />
            <span>Back to Orders</span>
          </button>

          <div className="h-6 w-px bg-[#eae5dc] hidden sm:block" />

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-[#747878] font-mono">Orders /</span>
              <h2 className="font-mono text-base sm:text-lg font-bold text-[#141414]">#{order.id}</h2>
              <span className={`px-3.5 py-1 rounded-full text-xs font-bold border ${
                isDelivered
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : isCancelled
                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                  : 'bg-[#141414] text-white border-[#141414]'
              }`}>
                {order.status}
              </span>
            </div>
            <p className="text-xs text-[#747878] mt-0.5">
              Customer: <strong className="text-[#141414]">{order.customerName}</strong> • Placed via Atelier Checkout
            </p>
          </div>
        </div>

        {/* Action Buttons Header */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onPrintOrder(order)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#faf8f5] hover:bg-[#eae5dc] text-[#141414] border border-[#eae5dc] text-xs font-bold transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#8c7138]" />
            <span>Print Invoice &amp; AWB</span>
          </button>

          <button
            onClick={() => onEditOrder(order)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#faf8f5] text-[#141414] border border-[#eae5dc] text-xs font-bold transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5 text-[#747878]" />
            <span>Edit Order</span>
          </button>

          <button
            onClick={() => onDeleteOrder(order.id)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Interactive Status Management & Fulfillment Lifecycle Panel */}
      <div className="bg-white rounded-2xl p-5 border border-[#eae5dc] shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eae5dc] pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#8c7138]" />
            <h3 className="font-display text-sm font-bold text-[#141414]">
              Order Fulfillment Lifecycle &amp; Status Confirmation
            </h3>
          </div>

          {/* Detailed Status Select Dropdown Inside Order Page */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#747878]">Update Status:</span>
            <select
              value={order.status}
              disabled={loadingStatus !== null}
              onChange={(e) => handleStatusChangeWithAnimation(e.target.value as OrderStatus)}
              className="bg-[#faf8f5] text-[#141414] border border-[#eae5dc] rounded-full px-4 py-1.5 text-xs font-bold focus:outline-none focus:border-[#8c7138] cursor-pointer shadow-xs"
            >
              <option value="COD Confirmed">COD Confirmed</option>
              <option value="COD Pending">COD Pending</option>
              <option value="Prepaid UPI">Prepaid UPI</option>
              <option value="Packed">Packed</option>
              <option value="Dispatched">Dispatched</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Status Buttons Segmented Grid with Loading Animations */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {ALL_STATUSES.map((st) => {
            const isActive = order.status === st.id;
            const isLoading = loadingStatus === st.id;
            const isCanc = st.id === 'Cancelled';

            return (
              <button
                key={st.id}
                disabled={loadingStatus !== null}
                onClick={() => handleStatusChangeWithAnimation(st.id)}
                className={`px-3 py-3 rounded-2xl text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1.5 border cursor-pointer active:scale-95 ${
                  isLoading
                    ? 'bg-[#8c7138] text-white border-[#8c7138] shadow-sm animate-pulse'
                    : isActive
                    ? isCanc
                      ? 'bg-rose-700 text-white border-rose-700 shadow-sm'
                      : 'bg-[#141414] text-white border-[#141414] shadow-sm'
                    : isCanc
                    ? 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                    : 'bg-[#faf8f5] text-[#141414] border-[#eae5dc] hover:border-[#8c7138] hover:text-[#8c7138] hover:bg-white'
                }`}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#fed488]" />
                    <span className="text-[10px] uppercase font-bold">Packing...</span>
                  </>
                ) : isActive ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#fed488]" />
                    <span>{st.label}</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 rounded-full bg-current opacity-40" />
                    <span>{st.label}</span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 2-Column Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Purchased Products & Financial Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Product Items Card */}
          <div className="bg-white rounded-2xl p-6 border border-[#eae5dc] shadow-xs space-y-4">
            <h3 className="font-display text-base font-bold text-[#141414] flex items-center justify-between border-b border-[#eae5dc] pb-3">
              <span className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#8c7138]" /> Ordered Jewellery Items
              </span>
              <span className="text-xs font-mono font-bold text-[#747878]">1 Item</span>
            </h3>

            <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#eae5dc] flex flex-col sm:flex-row items-center gap-4">
              <div className="w-20 h-20 rounded-xl bg-white border border-[#eae5dc] p-2 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                <img
                  src={order.image}
                  alt={order.productName}
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              </div>

              <div className="flex-1 space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-xs font-mono font-bold text-[#8c7138] px-2.5 py-0.5 rounded-md bg-white border border-[#eae5dc]">
                    SKU: {order.sku}
                  </span>
                  <span className="text-xs text-[#747878] font-medium">{order.tag || 'Atelier Vault'}</span>
                </div>
                <h4 className="font-display font-bold text-base text-[#141414]">
                  {order.productName}
                </h4>
                <p className="text-xs text-[#747878]">
                  316L Stainless Steel • 18K Anti-Tarnish Gold Plated • Waterproof
                </p>
                <div className="pt-2 flex items-center justify-center sm:justify-start gap-3 text-xs font-bold text-[#141414]">
                  <span>Qty: {order.quantity}</span>
                  <span>•</span>
                  <span>Unit Price: ₹{order.amount}</span>
                </div>
              </div>

              <div className="text-center sm:text-right border-t sm:border-t-0 sm:border-l border-[#eae5dc] pt-3 sm:pt-0 sm:pl-4 min-w-[120px]">
                <span className="text-xs text-[#747878] block">Item Total</span>
                <span className="font-display font-bold text-xl text-emerald-700">₹{order.amount}</span>
              </div>
            </div>

            {/* Financial Summary Calculation */}
            <div className="p-4 rounded-xl bg-[#141414] text-white space-y-2 text-xs">
              <div className="flex justify-between text-white/70">
                <span>Items Subtotal:</span>
                <span className="font-mono">₹{order.amount}</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Express Courier Shipping:</span>
                <span className="text-emerald-400 font-bold uppercase">FREE</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Payment Mode:</span>
                <span className="font-bold text-[#fed488]">{order.paymentMethod}</span>
              </div>
              <div className="pt-2 border-t border-white/20 flex justify-between text-sm font-bold text-white">
                <span>Total Amount Collected:</span>
                <span className="font-mono text-base text-[#fed488]">₹{order.amount}</span>
              </div>
            </div>
          </div>

          {/* Notes & Audit Log */}
          <div className="bg-white rounded-2xl p-6 border border-[#eae5dc] shadow-xs space-y-3">
            <h3 className="font-display text-sm font-bold text-[#141414] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#8c7138]" /> Customer Instructions &amp; Admin Notes
            </h3>

            <p className="text-xs text-[#444748] bg-[#faf8f5] p-3.5 rounded-xl border border-[#eae5dc] italic">
              "{order.notes || 'Order placed directly via online store. No special delivery notes specified.'}"
            </p>

            <div className="text-[11px] text-[#747878] pt-2 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Anti-Fraud System Check Passed • Verified Order Queue</span>
            </div>
          </div>

        </div>

        {/* Right Column: Customer Details & Shipping Logistics */}
        <div className="space-y-6">
          
          {/* Customer Profile Card */}
          <div className="bg-white rounded-2xl p-6 border border-[#eae5dc] shadow-xs space-y-4">
            <h3 className="font-display text-base font-bold text-[#141414] flex items-center gap-2 border-b border-[#eae5dc] pb-3">
              <User className="w-4 h-4 text-[#8c7138]" /> Customer Profile
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[#747878] text-[10px] uppercase tracking-wider font-bold block">
                  Full Name
                </span>
                <p className="font-bold text-base text-[#141414] mt-0.5">{order.customerName}</p>
              </div>

              {order.phone && (
                <div>
                  <span className="text-[#747878] text-[10px] uppercase tracking-wider font-bold block">
                    Contact Phone
                  </span>
                  <div className="flex flex-wrap items-center justify-between gap-2 mt-1">
                    <p className="font-mono text-sm font-bold text-[#141414]">{order.phone}</p>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-[#25D366] text-white font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-600 transition-colors shadow-xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-white" /> WhatsApp
                    </a>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-[#eae5dc]">
                <span className="text-[#747878] text-[10px] uppercase tracking-wider font-bold block">
                  Shipping Address
                </span>
                <p className="font-medium text-xs text-[#141414] mt-1 leading-relaxed flex items-start gap-1.5 bg-[#faf8f5] p-3 rounded-xl border border-[#eae5dc]">
                  <MapPin className="w-4 h-4 text-[#8c7138] shrink-0 mt-0.5" />
                  <span>
                    {order.location} <br />
                    Pincode: <strong className="font-mono text-[#141414]">{order.pincode}</strong>
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Logistics & Delivery Card */}
          <div className="bg-white rounded-2xl p-6 border border-[#eae5dc] shadow-xs space-y-4">
            <h3 className="font-display text-base font-bold text-[#141414] flex items-center gap-2 border-b border-[#eae5dc] pb-3">
              <Truck className="w-4 h-4 text-[#8c7138]" /> Courier &amp; AWB Tracking
            </h3>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="text-[#747878] text-[10px] uppercase tracking-wider font-bold block mb-1">
                  Shipping Courier
                </label>
                <input
                  type="text"
                  value={editingCourier}
                  onChange={(e) => setEditingCourier(e.target.value)}
                  placeholder="e.g. BlueDart Air Express"
                  className="w-full bg-[#faf8f5] text-[#141414] border border-[#eae5dc] rounded-full px-3.5 py-1.5 text-xs font-bold focus:outline-none focus:border-[#8c7138]"
                />
              </div>

              <div>
                <label className="text-[#747878] text-[10px] uppercase tracking-wider font-bold block mb-1">
                  Airway Bill (AWB) Tracking Number
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editingAwb}
                    onChange={(e) => setEditingAwb(e.target.value)}
                    placeholder="e.g. BD-982410729"
                    className="flex-1 font-mono font-bold text-xs text-[#8c7138] bg-[#faf8f5] px-3.5 py-1.5 rounded-full border border-[#eae5dc] focus:outline-none focus:border-[#8c7138]"
                  />
                  <button
                    onClick={handleSaveTracking}
                    title="Save Tracking Number"
                    className="px-3.5 py-1.5 rounded-full bg-[#141414] hover:bg-[#8c7138] text-white font-bold text-xs flex items-center gap-1 transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    <Save className="w-3.5 h-3.5 text-[#fed488]" />
                    <span>Save AWB</span>
                  </button>
                </div>
              </div>

              {/* Live Tracking Link Preview */}
              <div className="p-3 rounded-2xl bg-[#faf8f5] border border-[#eae5dc] space-y-1">
                <span className="text-[10px] text-[#747878] font-bold uppercase tracking-wider block">
                  Customer Tracking Preview
                </span>
                <p className="font-mono text-xs font-bold text-[#141414] flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-blue-600" />
                  <span>{editingCourier} • {editingAwb}</span>
                </p>
              </div>

              {/* RTO Risk Card */}
              <div className="pt-2 border-t border-[#eae5dc]">
                <span className="text-[#747878] text-[10px] uppercase tracking-wider font-bold block mb-1">
                  AI RTO Risk Analysis
                </span>
                {isHighRTO ? (
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      High RTO Risk ({order.rtoPercent || 44}%)
                    </div>
                    <p className="text-[11px] text-amber-800">
                      Call or WhatsApp customer to re-confirm address before shipping.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Verified Low RTO Risk (Safe Dispatch)
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
