import React, { useState, useEffect } from 'react';
import { OrderItem, OrderStatus, Product } from '../../types';
import { X, Package, User, Phone, MapPin, DollarSign, Truck, FileText } from 'lucide-react';

interface AdminOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveOrder: (order: OrderItem) => void;
  initialOrder?: OrderItem | null;
  products: Product[];
}

const ORDER_STATUSES: OrderStatus[] = [
  'COD Confirmed',
  'COD Pending',
  'Prepaid UPI',
  'Packed',
  'In Transit',
  'Dispatched',
  'Delivered',
  'Cancelled'
];

export const AdminOrderModal: React.FC<AdminOrderModalProps> = ({
  isOpen,
  onClose,
  onSaveOrder,
  initialOrder,
  products
}) => {
  const isEditing = !!initialOrder;

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [location, setLocation] = useState('');
  const [pincode, setPincode] = useState('400001');
  const [productName, setProductName] = useState('');
  const [sku, setSku] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [amount, setAmount] = useState('99');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Prepaid UPI'>('COD');
  const [status, setStatus] = useState<OrderStatus>('COD Confirmed');
  const [courier, setCourier] = useState('BlueDart Express Air');
  const [rtoRisk, setRtoRisk] = useState<'Low' | 'Medium' | 'High'>('Low');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialOrder) {
      setCustomerName(initialOrder.customerName);
      setPhone(initialOrder.phone || '+91 98200 12345');
      setLocation(initialOrder.location);
      setPincode(initialOrder.pincode);
      setProductName(initialOrder.productName);
      setSku(initialOrder.sku);
      setQuantity(String(initialOrder.quantity));
      setAmount(String(initialOrder.amount));
      setPaymentMethod(initialOrder.paymentMethod);
      setStatus(initialOrder.status);
      setCourier(initialOrder.courier);
      setRtoRisk(initialOrder.rtoRisk);
      setNotes(initialOrder.notes || '');
    } else {
      setCustomerName('');
      setPhone('+91 ');
      setLocation('Bandra West, Mumbai');
      setPincode('400050');
      const defaultProd = products[0] || { name: 'PARZIO Byzantine 18K Chain', sku: 'PRZ-BYZ-01', price: 99 };
      setProductName(defaultProd.name);
      setSku(defaultProd.sku);
      setQuantity('1');
      setAmount(String(defaultProd.price));
      setPaymentMethod('COD');
      setStatus('COD Confirmed');
      setCourier('BlueDart Express Air');
      setRtoRisk('Low');
      setNotes('Direct phone/WhatsApp order created via Atelier Console.');
    }
  }, [initialOrder, isOpen, products]);

  if (!isOpen) return null;

  const handleSelectProduct = (prodName: string) => {
    setProductName(prodName);
    const found = products.find((p) => p.name === prodName);
    if (found) {
      setSku(found.sku);
      setAmount(String(found.price * (Number(quantity) || 1)));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !productName.trim()) return;

    const matchedProd = products.find((p) => p.name === productName);

    const savedOrder: OrderItem = {
      id: initialOrder?.id || `PARZIO-${Math.floor(10000 + Math.random() * 90000)}`,
      customerName: customerName.trim(),
      phone: phone.trim(),
      location: location.trim(),
      pincode: pincode.trim(),
      productName: productName.trim(),
      sku: sku.trim() || 'PRZ-ITEM-01',
      quantity: Number(quantity) || 1,
      amount: Number(amount) || 99,
      paymentMethod,
      status,
      rtoRisk,
      rtoPercent: rtoRisk === 'High' ? 44 : rtoRisk === 'Medium' ? 18 : 2,
      tag: initialOrder?.tag || '₹99 Flash Vault',
      courier,
      phoneVerified: true,
      image: matchedProd?.image || initialOrder?.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80',
      notes: notes.trim()
    };

    onSaveOrder(savedOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-[#eae5dc] shadow-2xl overflow-hidden my-6 animate-fadeIn">
        
        {/* Header */}
        <div className="bg-[#141414] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Package className="w-5 h-5 text-[#fed488]" />
            <div>
              <h3 className="font-display text-base font-bold text-white">
                {isEditing ? `Edit Order #${initialOrder.id}` : 'Create Manual Order (WhatsApp / Counter)'}
              </h3>
              <p className="text-[11px] text-[#fed488]">
                {isEditing ? 'Modify address, fulfillment status, or customer notes' : 'Inject new order directly into the packing queue'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto">
          
          {/* Row 1: Customer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
                Customer Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#747878] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Sneha Patel"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-[#141414] focus:outline-none focus:border-[#8c7138]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
                WhatsApp / Mobile Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#747878] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-[#141414] focus:outline-none focus:border-[#8c7138]"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Location & Pincode */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
                Delivery Address &amp; City *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#747878] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Flat No, Street, City"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl pl-9 pr-3 py-2 text-xs text-[#141414] focus:outline-none focus:border-[#8c7138]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
                PIN Code *
              </label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="400050"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#141414] focus:outline-none focus:border-[#8c7138]"
              />
            </div>
          </div>

          {/* Row 3: Product Ordered */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
                Jewellery Piece *
              </label>
              <select
                value={productName}
                onChange={(e) => handleSelectProduct(e.target.value)}
                className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 text-xs font-semibold text-[#141414] focus:outline-none focus:border-[#8c7138]"
              >
                {products.map((prod) => (
                  <option key={prod.id} value={prod.name}>
                    {prod.name} (₹{prod.price})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
                Quantity
              </label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                  const matched = products.find((p) => p.name === productName);
                  if (matched) {
                    setAmount(String(matched.price * (Number(e.target.value) || 1)));
                  }
                }}
                className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 text-xs font-bold text-[#141414] focus:outline-none focus:border-[#8c7138]"
              />
            </div>
          </div>

          {/* Row 4: Amount & Payment Method & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
                Total Amount (₹) *
              </label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 text-xs font-bold text-[#8c7138] focus:outline-none focus:border-[#8c7138]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
                Payment Mode
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as 'COD' | 'Prepaid UPI')}
                className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 text-xs font-semibold text-[#141414] focus:outline-none focus:border-[#8c7138]"
              >
                <option value="COD">Cash on Delivery (COD)</option>
                <option value="Prepaid UPI">Prepaid UPI / QR</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
                Current Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 text-xs font-bold text-[#141414] focus:outline-none focus:border-[#8c7138]"
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 5: Courier Partner & RTO Risk */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
                Logistics Courier
              </label>
              <select
                value={courier}
                onChange={(e) => setCourier(e.target.value)}
                className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 text-xs font-semibold text-[#141414] focus:outline-none focus:border-[#8c7138]"
              >
                <option value="BlueDart Express Air">BlueDart Express Air</option>
                <option value="Delhivery Surface">Delhivery Surface</option>
                <option value="Shiprocket Direct">Shiprocket Direct</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
                RTO Risk Assessment
              </label>
              <select
                value={rtoRisk}
                onChange={(e) => setRtoRisk(e.target.value as 'Low' | 'Medium' | 'High')}
                className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 text-xs font-semibold text-[#141414] focus:outline-none focus:border-[#8c7138]"
              >
                <option value="Low">Low Risk (&lt;5% RTO)</option>
                <option value="Medium">Medium Risk (Watchlist)</option>
                <option value="High">High Risk (Requires WhatsApp OTP)</option>
              </select>
            </div>
          </div>

          {/* Row 6: Dispatch Notes */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
              Fulfillment &amp; Packaging Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Include Velvet Suede Pouch + 18K Anti-Tarnish Certificate"
              className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 text-xs text-[#141414] focus:outline-none focus:border-[#8c7138]"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#eae5dc]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full border border-[#eae5dc] text-xs font-semibold hover:bg-[#faf8f5] text-[#444748] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-[#141414] hover:bg-[#8c7138] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
            >
              <Package className="w-3.5 h-3.5 text-[#fed488]" />
              <span>{isEditing ? 'Save Order Updates' : 'Add Order to Queue'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
