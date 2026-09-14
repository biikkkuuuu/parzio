import React, { useState } from 'react';
import { Logo } from './Logo';
import { ShieldCheck, Truck, RotateCcw, CreditCard, Instagram, Facebook, Youtube, Send, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onSelectCategory: (cat: string) => void;
  onOpenQualityModal: () => void;
  onOpenAtelierOps?: () => void;
  onOpenPolicy?: (tab?: 'privacy' | 'terms' | 'refund' | 'shipping' | 'contact') => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenQualityModal, onOpenAtelierOps, onOpenPolicy }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#141414] text-[#e3e2e0] border-t border-[#2e3131]">
      
      {/* 4 Trust Badges Strip */}
      <div className="border-b border-[#2e3131] bg-[#1a1b1b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#222424] border border-[#2e3131] flex items-center justify-center text-[#fed488] flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">Anti-Tarnish 18K Finish</h4>
                <p className="text-[11px] text-[#c4c7c7]">Waterproof for daily wear</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#222424] border border-[#2e3131] flex items-center justify-center text-[#fed488] flex-shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">Free Shipping ₹500+</h4>
                <p className="text-[11px] text-[#c4c7c7]">Delivered swiftly across India</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#222424] border border-[#2e3131] flex items-center justify-center text-[#fed488] flex-shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">COD Available</h4>
                <p className="text-[11px] text-[#c4c7c7]">Pay upon doorstep delivery</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#222424] border border-[#2e3131] flex items-center justify-center text-[#fed488] flex-shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">Easy 7-Day Exchange</h4>
                <p className="text-[11px] text-[#c4c7c7]">Hassle-free guarantee</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Logo className="h-8 w-auto text-white" />
            <p className="text-xs text-[#c4c7c7] leading-relaxed max-w-sm">
              PARZIO brings you high quality 18K gold-plated jewellery at honest prices. Made for
              everyone who loves long-lasting shine, skin-safe pieces, and daily style without overpaying.
            </p>
            <div className="flex items-center gap-3 pt-2 text-[#e3e2e0]">
              <a
                href="#instagram"
                className="w-8 h-8 rounded-full bg-[#222424] border border-[#2e3131] flex items-center justify-center hover:bg-[#8c7138] hover:text-white transition-colors"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#facebook"
                className="w-8 h-8 rounded-full bg-[#222424] border border-[#2e3131] flex items-center justify-center hover:bg-[#8c7138] hover:text-white transition-colors"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#youtube"
                className="w-8 h-8 rounded-full bg-[#222424] border border-[#2e3131] flex items-center justify-center hover:bg-[#8c7138] hover:text-white transition-colors"
                title="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8c7138]">Quick Links</h4>
            <ul className="space-y-2 text-xs text-[#c4c7c7]">
              {['New Arrivals', 'Best Sellers', 'Necklaces', 'Earrings', 'Rings', 'Bracelets'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => onSelectCategory(item.toUpperCase())}
                    className="hover:text-white transition-colors"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8c7138]">Customer Care</h4>
            <ul className="space-y-2 text-xs text-[#c4c7c7]">
              <li>
                <button
                  onClick={onOpenQualityModal}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  5-Step Quality Check
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy?.('refund')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Easy 7-Day Returns &amp; Refunds
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy?.('shipping')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Express Shipping &amp; Delivery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy?.('privacy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy &amp; DPDPA
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy?.('terms')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Terms &amp; Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy?.('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Official Contact &amp; Concierge
                </button>
              </li>
            </ul>
          </div>

          {/* Stay Inspired Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8c7138]">Stay Inspired</h4>
            <p className="text-xs text-[#c4c7c7] leading-relaxed">
              Receive exclusive access to new drops, anti-tarnish innovations, and private boutique sales.
            </p>
            {subscribed ? (
              <div className="p-3 rounded-2xl bg-[#8c7138]/20 text-[#fed488] text-xs font-bold flex items-center gap-1.5 border border-[#8c7138]/40">
                <CheckCircle2 className="w-4 h-4 text-[#fed488]" />
                <span>Thank you! You are on our VIP drop list.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-full bg-[#222424] border border-[#2e3131] text-xs focus:outline-none focus:border-[#8c7138] transition-colors text-white placeholder:text-[#747878]"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#8c7138] text-white flex items-center justify-center hover:bg-[#775a19] transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Copyright & Guarantee */}
        <div className="mt-12 pt-8 border-t border-[#2e3131] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#747878]">
          <div className="flex items-center gap-3">
            <p>© 2026 PARZIO Demi-Fine Jewellery. All rights reserved.</p>
            {onOpenAtelierOps && (
              <button
                onClick={onOpenAtelierOps}
                className="text-[10px] text-[#8c7138] hover:text-[#fed488] transition-colors underline"
              >
                Staff / Atelier Ops
              </button>
            )}
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[#8c7138]">
            <span>100% SECURE CHECKOUT</span>
            <span>•</span>
            <span>RAZORPAY &amp; CASH ON DELIVERY</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
