import React from 'react';
import { OrderItem } from '../../types';
import { Printer, X, ShieldCheck, QrCode, CheckCircle2 } from 'lucide-react';

interface AdminInvoiceModalProps {
  order: OrderItem | null;
  onClose: () => void;
}

export const AdminInvoiceModal: React.FC<AdminInvoiceModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#eae5dc] overflow-hidden my-8 animate-fadeIn">
        
        {/* Header Bar */}
        <div className="bg-[#141414] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#fed488]" />
            <span className="font-display text-sm font-bold uppercase tracking-wider text-[#fed488]">
              PARZIO ATELIER SHIPPING MANIFEST &amp; TAX INVOICE
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fed488] text-[#141414] hover:bg-white text-xs font-bold transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print AWB / Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/20 text-white/70 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice & Label Container */}
        <div id="printable-label" className="p-6 sm:p-8 text-[#141414] space-y-6 text-xs">
          
          {/* Top Label Badge */}
          <div className="border-2 border-dashed border-[#141414] p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#faf8f5]">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-xl tracking-widest text-[#141414]">
                  PARZIO
                </span>
                <span className="px-2 py-0.5 rounded bg-[#141414] text-white font-mono text-[10px] font-bold">
                  AIR PRIORITY
                </span>
              </div>
              <p className="text-[10px] text-[#747878] mt-1 font-mono">
                AWB #: BLUEDART-{order.id.replace('PARZIO-', '')}-AIR • ROUTE: BOM/DEL-SURF
              </p>
            </div>

            <div className="text-right sm:text-right">
              <span className="font-mono text-2xl font-black text-[#141414] tracking-wider">
                {order.paymentMethod === 'COD' ? `COD: ₹${order.amount}` : 'PREPAID'}
              </span>
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                {order.paymentMethod === 'COD' ? 'Collect Cash at Doorstep' : 'DO NOT COLLECT CASH'}
              </p>
            </div>
          </div>

          {/* Barcode Graphic */}
          <div className="flex flex-col items-center justify-center p-3 bg-white border border-[#eae5dc] rounded-xl">
            <div className="font-mono text-2xl font-black tracking-[0.35em] text-[#141414] select-none py-1">
              ||| | |||| | || ||||| ||| | |||
            </div>
            <span className="font-mono text-[10px] tracking-widest text-[#747878]">
              *{order.id}*
            </span>
          </div>

          {/* Addresses Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-y border-[#eae5dc] py-4">
            <div>
              <p className="font-bold text-[10px] uppercase text-[#747878] tracking-wider">
                SHIPPED FROM (CONSIGNOR):
              </p>
              <p className="font-bold text-[#141414] mt-1 text-xs">
                PARZIO ATELIER FULFILLMENT CENTER
              </p>
              <p className="text-[#444748] mt-0.5 leading-relaxed">
                Unit 402, Lotus Grandeur, Veera Desai Rd,<br />
                Andheri West, Mumbai, MH - 400053<br />
                GSTIN: 27AABCP9918K1Z3 • Phone: +91 98765 43210
              </p>
            </div>

            <div>
              <p className="font-bold text-[10px] uppercase text-[#747878] tracking-wider">
                DELIVER TO (CONSIGNEE):
              </p>
              <p className="font-bold text-[#141414] mt-1 text-xs">
                {order.customerName}
              </p>
              <p className="text-[#444748] mt-0.5 leading-relaxed">
                {order.location}<br />
                Pin Code: <strong className="text-[#141414]">{order.pincode}</strong><br />
                Phone: Verified WhatsApp (+91 ••••• ••••)
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#eae5dc] text-[10px] font-bold uppercase text-[#747878]">
                  <th className="py-2">Item Description</th>
                  <th className="py-2">SKU</th>
                  <th className="py-2">HSN</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Taxable</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f4f2ee]">
                <tr>
                  <td className="py-2.5 font-medium text-[#141414]">
                    {order.productName}
                    <div className="text-[10px] text-[#747878]">18K Anti-Tarnish Demi-Fine</div>
                  </td>
                  <td className="py-2.5 font-mono text-[#8c7138]">{order.sku}</td>
                  <td className="py-2.5 font-mono text-[#747878]">71171990</td>
                  <td className="py-2.5 text-center font-bold">{order.quantity}</td>
                  <td className="py-2.5 text-right">₹{Math.round(order.amount / 1.03)}</td>
                  <td className="py-2.5 text-right font-bold text-[#141414]">₹{order.amount}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tax Breakdown & Security Footer */}
          <div className="bg-[#faf8f5] p-4 rounded-2xl border border-[#eae5dc] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>5-Step Atelier Quality Check: PASSED</span>
              </div>
              <p className="text-[10px] text-[#747878]">
                Includes Velvet Anti-Tarnish Pouch + 18K Certificate of Authenticity.
              </p>
            </div>

            <div className="text-right">
              <p className="text-[10px] text-[#747878]">GST (3% Imitation Jewellery Included)</p>
              <p className="text-base font-bold font-display text-[#141414]">
                Total Amount: ₹{order.amount}
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
