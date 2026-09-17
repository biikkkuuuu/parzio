import React, { useState } from 'react';
import { RotateCcw, CheckCircle2, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { OrderItem } from '../types';

interface ExchangeViewProps {
  orders: OrderItem[];
}

export const ExchangeView: React.FC<ExchangeViewProps> = ({ orders }) => {
  const [selectedOrder, setSelectedOrder] = useState<string>(orders[0]?.id || '');
  const [reason, setReason] = useState('Ring Size Adjustment');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-[80vh] bg-[#fbf9f6] pb-24 px-4 pt-4 max-w-md mx-auto">
      {/* Title matching Home page */}
      <div className="text-center mb-6">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#9e7144] block mb-1 font-sans">
          Hassle-Free Guarantee
        </span>
        <h2 className="font-display text-2xl sm:text-3xl text-[#1a1714] font-normal tracking-tight">
          7-Day Easy Exchange
        </h2>
        <p className="text-xs text-[#747878] mt-1 font-sans">
          Swap sizes or styles with complimentary doorstep reverse pickup.
        </p>
      </div>

      {submitted ? (
        <div className="bg-white rounded-3xl p-6 text-center border border-[#eae5dc] shadow-sm space-y-4 animate-fadeIn">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="font-display text-xl font-bold text-[#141414]">
            Exchange Request Initiated!
          </h3>
          <p className="text-xs text-[#444748]">
            We have generated return ticket <strong>#EXCH-4092</strong> for order{' '}
            <strong>#{selectedOrder}</strong>. Our courier partner will pick up the piece in its original velvet pouch within 24–48 hours.
          </p>
          <div className="p-3 rounded-2xl bg-[#faf8f5] border border-[#eae5dc] text-[11px] font-semibold text-[#8c7138]">
            ✓ Replacement item will be dispatched immediately once pickup is verified.
          </div>
          <button
            onClick={() => setSubmitted(false)}
            className="px-6 py-2 rounded-full bg-[#141414] text-white text-xs font-bold uppercase hover:bg-[#8c7138] transition-colors"
          >
            Create Another Request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Order Selection */}
          <div className="bg-white rounded-3xl p-4 border border-[#eae5dc] shadow-sm space-y-2">
            <label className="block text-xs font-bold text-[#141414]">
              Select Order for Exchange
            </label>
            <select
              value={selectedOrder}
              onChange={(e) => setSelectedOrder(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#faf8f5] border border-[#eae5dc] text-xs font-semibold text-[#141414] focus:outline-none focus:border-[#8c7138]"
            >
              {orders.map((ord) => (
                <option key={ord.id} value={ord.id}>
                  #{ord.id} — {ord.productName} (₹{ord.amount})
                </option>
              ))}
            </select>
          </div>

          {/* Reason Selection */}
          <div className="bg-white rounded-3xl p-4 border border-[#eae5dc] shadow-sm space-y-2">
            <label className="block text-xs font-bold text-[#141414]">
              Reason for Replacement / Exchange
            </label>
            <div className="space-y-1.5">
              {[
                'Ring Size Adjustment',
                'Chain / Bracelet Length Change',
                'Exchange for a Different ₹99 Silhouette',
                'Anti-Tarnish Lifetime Warranty Claim',
                'Gift Preference Exchange'
              ].map((r) => (
                <label
                  key={r}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                    reason === r
                      ? 'border-[#8c7138] bg-[#fed488]/15 font-semibold text-[#141414]'
                      : 'border-[#eae5dc] bg-white text-[#444748]'
                  }`}
                >
                  <input
                    type="radio"
                    name="exchange-reason"
                    checked={reason === r}
                    onChange={() => setReason(r)}
                    className="accent-[#8c7138]"
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Notes */}
          <div className="bg-white rounded-3xl p-4 border border-[#eae5dc] shadow-sm space-y-2">
            <label className="block text-xs font-bold text-[#141414]">
              Exchange Instructions (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Please swap Ring Size 6 with Size 7..."
              className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#eae5dc] text-xs focus:outline-none focus:border-[#8c7138]"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-[#141414] text-white hover:bg-[#8c7138] text-xs font-bold uppercase tracking-wider shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 text-[#fed488]" />
            <span>Schedule Doorstep Pickup</span>
          </button>
        </form>
      )}

      {/* Trust Guarantee Cards */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-[#eae5dc] text-center shadow-xs">
          <Truck className="w-5 h-5 text-[#8c7138] mx-auto mb-1" />
          <h4 className="text-xs font-bold text-[#141414]">Free Reverse Pickup</h4>
          <p className="text-[10px] text-[#747878] mt-0.5">No courier fees charged</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-[#eae5dc] text-center shadow-xs">
          <ShieldCheck className="w-5 h-5 text-[#8c7138] mx-auto mb-1" />
          <h4 className="text-xs font-bold text-[#141414]">Anti-Tarnish Guard</h4>
          <p className="text-[10px] text-[#747878] mt-0.5">Lifetime color protection</p>
        </div>
      </div>
    </div>
  );
};
