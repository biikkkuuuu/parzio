import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles, Truck, ShieldCheck, PhoneCall, ExternalLink } from 'lucide-react';

interface WhatsAppSupportProps {
  onNavigateTrackOrder?: () => void;
}

export const WhatsAppSupport: React.FC<WhatsAppSupportProps> = ({ onNavigateTrackOrder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFaqAnswer, setActiveFaqAnswer] = useState<string | null>(null);

  const WHATSAPP_NUMBER = '919876543210';
  const DEFAULT_MESSAGE = encodeURIComponent('Hi Parzio! I need help with jewellery and placing my order.');

  const faqs = [
    {
      q: 'Is Cash on Delivery available?',
      icon: <Truck className="w-3.5 h-3.5 text-[#8c7138]" />,
      a: 'Yes! Cash on Delivery (COD) is available across India. Orders above ₹500 get 100% Free Delivery.'
    },
    {
      q: 'Is it real 18K Anti-Tarnish & Waterproof?',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-[#8c7138]" />,
      a: 'Yes! Every piece is plated in real 18K gold over strong stainless steel. 100% safe in the shower, gym, and with perfume.'
    },
    {
      q: 'What is the return / exchange policy?',
      icon: <Sparkles className="w-3.5 h-3.5 text-[#8c7138]" />,
      a: 'We offer an easy 7-Day Exchange. Simply select Exchange with your order ID and our courier will pick it up from your home.'
    }
  ];

  return (
    <div className="fixed bottom-16 md:bottom-6 right-3 sm:right-6 z-30 flex flex-col items-end">
      
      {/* Concierge Popover Window */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 bg-[#fbf9f6] rounded-3xl shadow-2xl border border-[#eae5dc] overflow-hidden animate-slideUp text-[#141414]">
          {/* Concierge Header */}
          <div className="bg-[#141414] text-white p-4 flex items-center justify-between border-b border-[#2e3131]">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  <MessageCircle className="w-5 h-5 fill-white text-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#141414] animate-pulse" />
              </div>
              <div>
                <h4 className="font-display text-sm font-bold text-white tracking-wide">
                  PARZIO WhatsApp Help
                </h4>
                <p className="text-[11px] text-[#fed488] flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Support Online • Fast Reply
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick FAQ / Assistance Body */}
          <div className="p-4 space-y-3 max-h-72 overflow-y-auto no-scrollbar bg-[#fbf9f6]">
            <div className="p-3 rounded-2xl bg-white border border-[#eae5dc] text-xs text-[#444748] shadow-xs">
              <p className="font-medium">
                Namaste! Welcome to <strong>PARZIO</strong>. How can we help you with your order today?
              </p>
            </div>

            {/* FAQs */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8c7138] px-1">
                Frequently Asked:
              </p>
              {faqs.map((faq, idx) => (
                <div key={idx} className="space-y-1">
                  <button
                    onClick={() => setActiveFaqAnswer(activeFaqAnswer === faq.a ? null : faq.a)}
                    className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-[#faf8f5] border border-[#eae5dc] text-xs font-semibold text-[#141414] flex items-center justify-between transition-colors shadow-xs"
                  >
                    <span className="flex items-center gap-2">
                      {faq.icon}
                      <span className="line-clamp-1">{faq.q}</span>
                    </span>
                    <span className="text-xs text-[#8c7138]">{activeFaqAnswer === faq.a ? '−' : '+'}</span>
                  </button>
                  {activeFaqAnswer === faq.a && (
                    <div className="p-2.5 rounded-xl bg-[#faf8f5] border border-[#eae5dc] text-xs text-[#444748] animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Direct WhatsApp Action */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${DEFAULT_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
            >
              <MessageCircle className="w-4 h-4 fill-white text-white" />
              <span>Chat on WhatsApp Directly</span>
              <ExternalLink className="w-3 h-3 text-white/80" />
            </a>
          </div>

          {/* Footer note */}
          <div className="px-4 py-2 bg-[#f3efe9] border-t border-[#eae5dc] text-center text-[10px] text-[#747878] font-medium">
            Atelier Customer Care: 10:00 AM – 9:00 PM IST
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Chat with Atelier Concierge on WhatsApp"
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#141414] text-white border border-[#8c7138]/40 hover:border-[#fed488] shadow-2xl hover:bg-[#202222] transition-all group active:scale-95"
      >
        <div className="w-6 h-6 rounded-full bg-[#25D366] text-white flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
          <MessageCircle className="w-3.5 h-3.5 fill-white text-white" />
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-[10px] uppercase tracking-wider text-[#fed488] font-bold leading-none">
            Help &amp; WhatsApp
          </p>
          <p className="text-xs font-bold text-white leading-tight">
            PARZIO Concierge
          </p>
        </div>
        <span className="sm:hidden font-bold text-xs text-[#fed488]">Help</span>
      </button>

    </div>
  );
};
