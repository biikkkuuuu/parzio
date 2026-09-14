import React, { useState } from 'react';
import { OrderItem, OrderStatus, Product } from '../../types';
import { AdminOrderModal } from './AdminOrderModal';
import {
  Search,
  Filter,
  Package,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  PhoneCall,
  Truck,
  RefreshCw,
  Eye,
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  XCircle
} from 'lucide-react';

interface AdminOrdersViewProps {
  orders: OrderItem[];
  products: Product[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onAddOrder: (order: OrderItem) => void;
  onEditOrder: (order: OrderItem) => void;
  onDeleteOrder: (orderId: string) => void;
  onPrintOrder: (order: OrderItem) => void;
  onTriggerToast: (msg: string) => void;
}

export const AdminOrdersView: React.FC<AdminOrdersViewProps> = ({
  orders,
  products,
  onUpdateOrderStatus,
  onAddOrder,
  onEditOrder,
  onDeleteOrder,
  onPrintOrder,
  onTriggerToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [packingOrderId, setPackingOrderId] = useState<string | null>(null);
  const [verifiedPhones, setVerifiedPhones] = useState<string[]>([]);
  
  // Modals
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<OrderItem | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<OrderItem | null>(null);

  // Filter Orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.phone && order.phone.includes(searchQuery)) ||
      order.pincode.includes(searchQuery);

    if (!matchesSearch) return false;

    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'COD') return order.paymentMethod === 'COD';
    if (statusFilter === 'PREPAID') return order.paymentMethod.includes('Prepaid');
    if (statusFilter === 'HIGH_RTO') return order.rtoRisk === 'High';
    if (statusFilter === 'PACKED') return order.status === 'Packed';
    if (statusFilter === 'DISPATCHED') return order.status === 'Dispatched' || order.status === 'In Transit';
    if (statusFilter === 'DELIVERED') return order.status === 'Delivered';
    if (statusFilter === 'CANCELLED') return order.status === 'Cancelled';
    return true;
  });

  // Select all or toggle single
  const handleSelectAll = () => {
    if (selectedOrderIds.length === filteredOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(filteredOrders.map((o) => o.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Pack & Dispatch Flow
  const handlePack = (orderId: string) => {
    setPackingOrderId(orderId);
    setTimeout(() => {
      onUpdateOrderStatus(orderId, 'Dispatched');
      setPackingOrderId(null);
      onTriggerToast(`Order #${orderId} packed & BlueDart AWB generated!`);
    }, 700);
  };

  // Bulk Pack & Generate Manifest
  const handleBulkPack = () => {
    if (selectedOrderIds.length === 0) return;
    selectedOrderIds.forEach((id) => onUpdateOrderStatus(id, 'Dispatched'));
    onTriggerToast(`Bulk packed ${selectedOrderIds.length} orders & manifest generated!`);
    setSelectedOrderIds([]);
  };

  // Bulk Delete
  const handleBulkDelete = () => {
    if (selectedOrderIds.length === 0) return;
    selectedOrderIds.forEach((id) => onDeleteOrder(id));
    onTriggerToast(`Deleted ${selectedOrderIds.length} orders from queue.`);
    setSelectedOrderIds([]);
  };

  // WhatsApp OTP Verification
  const handleVerifyWhatsapp = (orderId: string) => {
    setVerifiedPhones((prev) => [...prev, orderId]);
    onTriggerToast(`WhatsApp verification OTP dispatched for Order #${orderId}.`);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = 'Order ID,Customer,Phone,Location,Pincode,Amount,Payment,Status,Product,SKU,Courier\n';
    const rows = filteredOrders
      .map(
        (o) =>
          `"${o.id}","${o.customerName}","${o.phone || ''}","${o.location}","${o.pincode}",${o.amount},"${o.paymentMethod}","${o.status}","${o.productName}","${o.sku}","${o.courier}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PARZIO_Dispatches_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    onTriggerToast('Orders exported to BlueDart dispatch manifest CSV.');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Workspace Controls */}
      <div className="bg-white rounded-3xl p-5 border border-[#eae5dc] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-base font-bold text-[#141414] flex items-center gap-2">
            <Package className="w-4 h-4 text-[#8c7138]" />
            Orders List ({filteredOrders.length} Orders)
          </h3>
          <p className="text-xs text-[#747878] mt-0.5">
            Add new orders, change customer address, mark as shipped, or print shipping slips.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              setEditingOrder(null);
              setIsOrderModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#141414] text-white hover:bg-[#8c7138] text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-[#fed488]" />
            <span>Add New Order</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#faf8f5] hover:bg-[#eae5dc] border border-[#eae5dc] text-xs font-bold text-[#141414] transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
            <span>Export to Excel</span>
          </button>

          {selectedOrderIds.length > 0 && (
            <>
              <button
                onClick={handleBulkPack}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95"
              >
                <Package className="w-3.5 h-3.5" />
                <span>Mark as Shipped ({selectedOrderIds.length})</span>
              </button>

              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete ({selectedOrderIds.length})</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#747878] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Order ID, Customer, Phone, SKU, Pincode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white pl-10 pr-4 py-2 rounded-full text-xs text-[#141414] border border-[#eae5dc] focus:outline-none focus:border-[#8c7138] shadow-xs"
          />
        </div>

        {/* Status Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'ALL', label: 'All Orders' },
            { id: 'COD', label: 'COD' },
            { id: 'PREPAID', label: 'Prepaid UPI' },
            { id: 'HIGH_RTO', label: 'High RTO' },
            { id: 'PACKED', label: 'Packed' },
            { id: 'DISPATCHED', label: 'Dispatched' },
            { id: 'DELIVERED', label: 'Delivered' },
            { id: 'CANCELLED', label: 'Cancelled' }
          ].map((flt) => (
            <button
              key={flt.id}
              onClick={() => setStatusFilter(flt.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                statusFilter === flt.id
                  ? 'bg-[#141414] text-white'
                  : 'bg-white text-[#444748] hover:bg-[#eae5dc] border border-[#eae5dc]'
              }`}
            >
              {flt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table List */}
      <div className="bg-white rounded-3xl border border-[#eae5dc] shadow-sm overflow-hidden">
        
        {/* Table Controls Header */}
        <div className="p-4 bg-[#faf8f5] border-b border-[#eae5dc] flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={
                filteredOrders.length > 0 &&
                selectedOrderIds.length === filteredOrders.length
              }
              onChange={handleSelectAll}
              className="rounded text-[#8c7138] focus:ring-[#8c7138]"
            />
            <span className="font-bold text-[#141414]">
              Select All ({filteredOrders.length})
            </span>
          </div>
          <span className="text-[#747878] text-[11px]">
            Sorted by velocity: Newest First
          </span>
        </div>

        {/* Orders List Items */}
        <div className="divide-y divide-[#f4f2ee]">
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-[#747878] space-y-2">
              <Package className="w-8 h-8 text-[#8c7138] mx-auto opacity-50" />
              <p className="font-bold text-sm text-[#141414]">No orders match your filter</p>
              <p className="text-xs">Try searching another term or click "Create Manual Order".</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const isSelected = selectedOrderIds.includes(order.id);
              const isHighRTO = order.rtoRisk === 'High';
              const isPhoneVerified = order.phoneVerified || verifiedPhones.includes(order.id);
              const isDispatched = order.status === 'Dispatched' || order.status === 'Delivered';
              const isCancelled = order.status === 'Cancelled';

              return (
                <div
                  key={order.id}
                  className={`p-4 sm:p-5 transition-colors ${
                    isSelected ? 'bg-[#faf6ee]' : isCancelled ? 'bg-rose-50/40 opacity-75' : 'hover:bg-[#faf8f5]'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    
                    {/* Left: Checkbox + Product Thumb + Order Meta */}
                    <div className="flex items-start gap-3.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(order.id)}
                        className="mt-1 rounded text-[#8c7138] focus:ring-[#8c7138]"
                      />

                      <div className="w-14 h-14 rounded-2xl bg-[#faf8f5] border border-[#eae5dc] p-1 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        <img
                          src={order.image}
                          alt={order.productName}
                          className="w-full h-full object-contain mix-blend-multiply"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#141414]">
                            #{order.id}
                          </span>
                          <span className="text-[#747878]">•</span>
                          <span className="font-semibold text-xs text-[#141414]">
                            {order.customerName}
                          </span>
                          {order.phone && (
                            <span className="font-mono text-[11px] text-[#747878]">
                              ({order.phone})
                            </span>
                          )}
                          <span className="text-[#747878]">•</span>
                          <span className="text-xs text-[#747878]">
                            {order.location} ({order.pincode})
                          </span>
                        </div>

                        <p className="font-display font-medium text-sm text-[#141414]">
                          {order.productName} (Qty: {order.quantity})
                        </p>

                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#747878]">
                          <span className="font-mono text-[#8c7138]">{order.sku}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Truck className="w-3 h-3 text-[#8c7138]" />
                            {order.courier}
                          </span>
                          <span>•</span>
                          <span className="font-bold text-[#141414]">
                            ₹{order.amount} ({order.paymentMethod})
                          </span>
                          {order.notes && (
                            <>
                              <span>•</span>
                              <span className="italic text-[#747878]">"{order.notes}"</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Badges, WhatsApp OTP, Status Dropdown & Actions */}
                    <div className="flex flex-wrap items-center gap-2.5 lg:justify-end pl-8 lg:pl-0">
                      
                      {/* RTO Risk Badge */}
                      {isHighRTO ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                          <AlertTriangle className="w-3 h-3" />
                          RTO Risk {order.rtoPercent || 41}%
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          <ShieldCheck className="w-3 h-3" />
                          Low Risk
                        </span>
                      )}

                      {/* WhatsApp Verification */}
                      {isPhoneVerified ? (
                        <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Phone Verified
                        </span>
                      ) : (
                        <button
                          onClick={() => handleVerifyWhatsapp(order.id)}
                          className="text-[11px] font-bold text-[#8c7138] hover:text-[#141414] flex items-center gap-1 bg-[#fed488]/20 px-2.5 py-1 rounded-full border border-[#fed488]/60 transition-colors"
                        >
                          <PhoneCall className="w-3 h-3" />
                          Verify OTP
                        </button>
                      )}

                      {/* Status Dropdown */}
                      <select
                        value={order.status}
                        onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className={`border rounded-full px-3 py-1 text-xs font-bold focus:outline-none focus:border-[#8c7138] ${
                          isCancelled
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : 'bg-[#faf8f5] text-[#141414] border-[#eae5dc]'
                        }`}
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

                      {/* Edit Order Button */}
                      <button
                        onClick={() => {
                          setEditingOrder(order);
                          setIsOrderModalOpen(true);
                        }}
                        title="Edit Order Details"
                        className="p-1.5 rounded-full bg-[#faf8f5] hover:bg-[#eae5dc] text-[#141414] transition-colors border border-[#eae5dc]"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#141414]" />
                      </button>

                      {/* Print Invoice/AWB Button */}
                      <button
                        onClick={() => onPrintOrder(order)}
                        title="Print Shipping Label & Tax Invoice"
                        className="p-1.5 rounded-full bg-[#faf8f5] hover:bg-[#eae5dc] text-[#141414] transition-colors border border-[#eae5dc]"
                      >
                        <Printer className="w-3.5 h-3.5 text-[#8c7138]" />
                      </button>

                      {/* Delete / Remove Order */}
                      <button
                        onClick={() => setOrderToDelete(order)}
                        title="Delete Order from Queue"
                        className="p-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors border border-rose-200"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Pack & Dispatch Trigger */}
                      {isDispatched ? (
                        <span className="px-3.5 py-1.5 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Dispatched
                        </span>
                      ) : (
                        <button
                          disabled={packingOrderId === order.id}
                          onClick={() => handlePack(order.id)}
                          className="px-4 py-1.5 rounded-full bg-[#141414] hover:bg-[#8c7138] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                        >
                          {packingOrderId === order.id ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Packing...</span>
                            </>
                          ) : (
                            <>
                              <Package className="w-3.5 h-3.5 text-[#fed488]" />
                              <span>Pack &amp; Ship</span>
                            </>
                          )}
                        </button>
                      )}

                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Add / Edit Order Modal */}
      <AdminOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => {
          setIsOrderModalOpen(false);
          setEditingOrder(null);
        }}
        initialOrder={editingOrder}
        products={products}
        onSaveOrder={(savedOrder) => {
          if (editingOrder) {
            onEditOrder(savedOrder);
            onTriggerToast(`Updated Order #${savedOrder.id} successfully!`);
          } else {
            onAddOrder(savedOrder);
            onTriggerToast(`Manual Order #${savedOrder.id} added to live queue!`);
          }
        }}
      />

      {/* Delete Confirmation Modal */}
      {orderToDelete && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#eae5dc] shadow-2xl space-y-4 animate-fadeIn">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h4 className="font-bold text-base text-[#141414]">Delete Order #{orderToDelete.id}?</h4>
              <p className="text-xs text-[#747878] mt-1">
                Are you sure you want to remove this order from {orderToDelete.customerName} (₹{orderToDelete.amount})? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setOrderToDelete(null)}
                className="px-4 py-2 rounded-full border border-[#eae5dc] text-xs font-semibold hover:bg-[#faf8f5]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteOrder(orderToDelete.id);
                  onTriggerToast(`Order #${orderToDelete.id} removed from system.`);
                  setOrderToDelete(null);
                }}
                className="px-5 py-2 rounded-full bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold"
              >
                Delete Order
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
