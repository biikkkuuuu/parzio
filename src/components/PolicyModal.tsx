import React, { useState } from 'react';
import { X, ShieldCheck, FileText, RotateCcw, Truck, Mail } from 'lucide-react';

export type PolicyTab = 'privacy' | 'terms' | 'refund' | 'shipping' | 'contact';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: PolicyTab;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'privacy'
}) => {
  const [activeTab, setActiveTab] = useState<PolicyTab>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#eae5dc] max-h-[88vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#eae5dc] bg-[#faf8f5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#141414] text-[#fed488] flex items-center justify-center font-bold text-xs">
              P
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-[#141414]">
                Legal &amp; Customer Protection
              </h3>
              <p className="text-[11px] text-[#747878]">
                PARZIO Demi-Fine Jewellery • Compliance Guidelines
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#eae5dc] text-[#747878] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#eae5dc] bg-white overflow-x-auto text-xs font-semibold">
          {[
            { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck },
            { id: 'terms', label: 'Terms & Conditions', icon: FileText },
            { id: 'refund', label: 'Returns & Refunds', icon: RotateCcw },
            { id: 'shipping', label: 'Shipping Policy', icon: Truck },
            { id: 'contact', label: 'Contact Us', icon: Mail }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as PolicyTab)}
                className={`flex items-center gap-1.5 px-4 py-3 whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                  isActive
                    ? 'border-[#8c7138] text-[#8c7138] bg-[#faf8f5]'
                    : 'border-transparent text-[#747878] hover:text-[#141414]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Container */}
        <div className="p-5 sm:p-6 overflow-y-auto text-xs text-[#4a4d4d] leading-relaxed space-y-4">
          {activeTab === 'privacy' && (
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-[#141414]">1. Privacy &amp; Data Protection (DPDPA 2023 Compliant)</h4>
              <p>
                At PARZIO (operating as PARZIO Demi-Fine Atelier), accessible from <strong>https://parzio.in</strong>, we prioritize the privacy of our visitors. This policy outlines what data we collect and how we safeguard it.
              </p>
              <h5 className="font-bold text-[#141414]">Information We Collect:</h5>
              <ul className="list-disc pl-5 space-y-1">
                <li>Contact Information: Full Name, mobile telephone number, and email address.</li>
                <li>Delivery Particulars: Doorstep shipping address, city, state, and 6-digit postal code.</li>
                <li>Order History: Purchased Demi-fine items, order timestamp, and payment status.</li>
              </ul>
              <h5 className="font-bold text-[#141414]">Payment Security:</h5>
              <p>
                All online transactions (UPI, Credit/Debit cards, NetBanking) are processed through RBI-authorized payment aggregator <strong>Razorpay</strong>. PARZIO does not collect, store, or process complete credit card numbers or banking passwords.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-[#141414]">Terms and Conditions of Service</h4>
              <p>
                By accessing <strong>parzio.in</strong> and placing an order, you agree to be bound by these website terms and all applicable Indian consumer protection laws.
              </p>
              <h5 className="font-bold text-[#141414]">Demi-Fine Jewellery Authenticity:</h5>
              <p>
                All items in our vault are manufactured from anti-tarnish stainless alloy or copper base electroplated with authentic 18K gold layer. Our products are hypoallergenic, lead-free, and nickel-free.
              </p>
              <h5 className="font-bold text-[#141414]">Order Placement &amp; Right to Cancel:</h5>
              <p>
                We reserve the right to decline or cancel orders in cases of suspicious bot transactions, incorrect pricing errors, or unverified Cash-on-Delivery mobile numbers.
              </p>
            </div>
          )}

          {activeTab === 'refund' && (
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-[#141414]">Hassle-Free 7-Day Exchange &amp; Return Policy</h4>
              <p>
                We stand behind the craftsmanship of every piece. If your jewellery arrives damaged or does not match specifications, we offer a 100% replacement or refund.
              </p>
              <h5 className="font-bold text-[#141414]">Conditions for Return:</h5>
              <ul className="list-disc pl-5 space-y-1">
                <li>Returns must be requested within 7 calendar days of delivery.</li>
                <li>Items must be unworn, undamaged, and inside original velvet pouch or box packaging.</li>
                <li>Refunds for prepaid orders are credited back to the original source account via Razorpay within 5-7 business days.</li>
              </ul>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-[#141414]">Express Courier &amp; Shipping Policy</h4>
              <p>
                Every PARZIO order is dispatched via premium air express couriers (BlueDart, Delhivery, Xpressbees).
              </p>
              <h5 className="font-bold text-[#141414]">Delivery Timelines:</h5>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Metro Cities (Mumbai, Delhi, Bengaluru, etc.):</strong> 2 to 3 Business Days.</li>
                <li><strong>Rest of India:</strong> 3 to 5 Business Days.</li>
                <li><strong>Tracking:</strong> Live tracking SMS and WhatsApp notifications are shared upon parcel dispatch.</li>
              </ul>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-[#141414]">Official Atelier Contact &amp; Concierge</h4>
              <p>Have questions regarding your order, bulk corporate gifting, or sizing?</p>
              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#eae5dc] space-y-2">
                <p><strong>Brand:</strong> PARZIO Demi-Fine Jewellery</p>
                <p><strong>Website:</strong> https://parzio.in</p>
                <p><strong>Concierge WhatsApp:</strong> +91 91066 94317</p>
                <p><strong>Email Support:</strong> concierge@parzio.in / support@parzio.in</p>
                <p><strong>Hours:</strong> Mon – Sat: 10:00 AM – 7:00 PM IST</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#eae5dc] bg-[#faf8f5] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-[#141414] text-white font-bold text-xs hover:bg-[#8c7138] transition-colors cursor-pointer"
          >
            I Understand &amp; Agree
          </button>
        </div>
      </div>
    </div>
  );
};
