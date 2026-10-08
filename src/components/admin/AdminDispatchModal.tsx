import React, { useState } from 'react';
import { OrderItem } from '../../types';
import { smsService } from '../../services/smsService';
import {
  Truck,
  X,
  Send,
  Package,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Sparkles,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface AdminDispatchModalProps {
  order: OrderItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmDispatch: (orderId: string, courier: string, trackingNumber: string) => Promise<void> | void;
}

const COURIER_PRESETS = [
  'BlueDart Air Express',
  'Delhivery Express',
  'Delhivery Surface',
  'DTDC Express',
  'India Post Speed Post',
  'Ekart Logistics',
  'Shadowfax',
  'Xpressbees',
  'Other / Custom Courier'
];

export const AdminDispatchModal: React.FC<AdminDispatchModalProps> = ({
  order,
  isOpen,
  onClose,
  onConfirmDispatch
}) => {
  if (!isOpen || !order) return null;

  const [selectedCourier, setSelectedCourier] = useState<string>(
    order.courier && order.courier !== 'Pending Dispatch' && order.courier !== 'Preparing for Dispatch'
      ? order.courier
      : 'Delhivery Express'
  );
  const [customCourierName, setCustomCourierName] = useState('');
  const [trackingNumber, setTrackingNumber] = useState<string>(order.trackingNumber || '');
  const [sendSmsNotification, setSendSmsNotification] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const effectiveCourier = selectedCourier === 'Other / Custom Courier'
    ? (customCourierName.trim() || 'Custom Courier')
    : selectedCourier;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanAwb = trackingNumber.trim();
    if (!cleanAwb) {
      setErrorMessage('Please enter the Courier Tracking / AWB Number.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Trigger parent dispatch handler (updates order in state and database)
      await onConfirmDispatch(order.id, effectiveCourier, cleanAwb);

      // 2. If SMS toggle is enabled, send instant Dispatch SMS via Fast2SMS
      if (sendSmsNotification && order.phone) {
        try {
          await smsService.sendOrderDispatchedSms({
            id: order.id,
            customerName: order.customerName,
            phone: order.phone,
            courier: effectiveCourier,
            trackingNumber: cleanAwb
          });
        } catch (smsErr) {
          console.warn('Dispatch SMS notice:', smsErr);
        }
      }

      setIsSubmitting(false);
      onClose();
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err?.message || 'Failed to dispatch order. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-amber-300 font-bold uppercase">Ship & Dispatch</span>
                <span className="text-xs text-neutral-400 font-mono">#{order.id}</span>
              </div>
              <h3 className="text-lg font-serif font-semibold text-white">
                Assign Courier & AWB
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Order Summary Snapshot */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-1.5 text-xs text-neutral-600">
            <div className="flex justify-between items-center text-neutral-900 font-semibold">
              <span>Customer:</span>
              <span>{order.customerName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Destination:</span>
              <span className="truncate max-w-[240px] font-medium">{order.location || order.pincode}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Order Value:</span>
              <span className="font-semibold text-neutral-900 font-serif">₹{order.amount} ({order.paymentMethod})</span>
            </div>
          </div>

          {/* Courier Partner Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
              1. Courier Partner
            </label>
            <select
              value={selectedCourier}
              onChange={(e) => setSelectedCourier(e.target.value)}
              className="w-full p-3 bg-white border border-neutral-300 rounded-xl text-sm font-medium text-neutral-900 focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 outline-none cursor-pointer"
            >
              {COURIER_PRESETS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {selectedCourier === 'Other / Custom Courier' && (
              <input
                type="text"
                placeholder="Enter courier name (e.g. Speedex, Local Rider)..."
                value={customCourierName}
                onChange={(e) => setCustomCourierName(e.target.value)}
                className="w-full mt-2 p-3 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:bg-white focus:ring-2 focus:ring-neutral-900 outline-none"
                required
              />
            )}
          </div>

          {/* Tracking Number / AWB */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
                2. Tracking ID / AWB Number <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-neutral-400">Waybill barcode</span>
            </div>
            <input
              type="text"
              placeholder="e.g. 142890472910, BD882910, or DEL98104"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="w-full p-3.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm font-mono font-semibold text-neutral-900 focus:bg-white focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 outline-none transition-all placeholder:text-neutral-400 uppercase"
              required
              autoFocus
            />
            <p className="text-[11px] text-neutral-500">
              This exact tracking code will be shown to the customer in their <strong>Track Order</strong> tab.
            </p>
          </div>

          {/* Send SMS Notification Checkbox */}
          <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/80 flex items-start gap-3 cursor-pointer" onClick={() => setSendSmsNotification(!sendSmsNotification)}>
            <input
              type="checkbox"
              id="sendSmsToggle"
              checked={sendSmsNotification}
              onChange={(e) => setSendSmsNotification(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-neutral-900 rounded accent-neutral-900 cursor-pointer"
            />
            <label htmlFor="sendSmsToggle" className="text-xs text-neutral-700 cursor-pointer leading-relaxed">
              <strong className="text-neutral-900 block font-semibold">Send Fast2SMS Dispatch Notification</strong>
              Instantly SMS the customer ({order.phone || 'Phone Pending'}) with courier name, AWB code, and live tracking link.
            </label>
          </div>

          {/* Error notice */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Modal Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-neutral-600 hover:text-neutral-900 text-sm font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              {isSubmitting ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5 text-amber-300" />
              )}
              Confirm Dispatch & Save AWB
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
