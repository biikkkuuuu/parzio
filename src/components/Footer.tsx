import React, { useState } from 'react';
import { Logo } from './Logo';
import { ShieldCheck, Truck, RotateCcw, CreditCard, Instagram, Facebook, Youtube, Send, CheckCircle2, LayoutDashboard } from 'lucide-react';

interface FooterProps {
  onSelectCategory: (cat: string) => void;
  onOpenQualityModal: () => void;
  onOpenAtelierOps?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenQualityModal, onOpenAtelierOps }) => {
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
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 py-4 sm:py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#222424]/50 border border-[#2e3131]/60">
              <div className="w-8 h-8 rounded-xl bg-[#222424] border border-[#2e3131] flex items-center justify-center text-[#fed488] flex-shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-[11px] sm:text-sm font-bold text-white leading-tight">18K Anti-Tarnish</h4>
                <p className="text-[10px] sm:text-[11px] text-[#c4c7c7]">Waterproof wear</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#222424]/50 border border-[#2e3131]/60">
              <div className="w-8 h-8 rounded-xl bg-[#222424] border border-[#2e3131] flex items-center justify-center text-[#fed488] flex-shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-[11px] sm:text-sm font-bold text-white leading-tight">Free Shipping ₹500+</h4>
                <p className="text-[10px] sm:text-[11px] text-[#c4c7c7]">All over India</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#222424]/50 border border-[#2e3131]/60">
              <div className="w-8 h-8 rounded-xl bg-[#222424] border border-[#2e3131] flex items-center justify-center text-[#fed488] flex-shrink-0">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-[11px] sm:text-sm font-bold text-white leading-tight">COD Available</h4>
                <p className="text-[10px] sm:text-[11px] text-[#c4c7c7]">Pay at delivery</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#222424]/50 border border-[#2e3131]/60">
              <div className="w-8 h-8 rounded-xl bg-[#222424] border border-[#2e3131] flex items-center justify-center text-[#fed488] flex-shrink-0">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-[11px] sm:text-sm font-bold text-white leading-tight">Easy Exchange</h4>
                <p className="text-[10px] sm:text-[11px] text-[#c4c7c7]">7-Day guarantee</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-3">
            <Logo className="h-7 w-auto text-white" />
            <p className="text-xs text-[#c4c7c7] leading-relaxed max-w-sm">
              PARZIO brings you high quality 316L stainless steel & 18K gold-plated jewellery at honest prices. 100% waterproof & anti-tarnish.
            </p>
            <div className="flex items-center gap-2.5 pt-1 text-[#e3e2e0]">
              <a
                href="#instagram"
                className="w-7 h-7 rounded-full bg-[#222424] border border-[#2e3131] flex items-center justify-center hover:bg-[#8c7138] hover:text-white transition-colors"
                title="Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="#facebook"
                className="w-7 h-7 rounded-full bg-[#222424] border border-[#2e3131] flex items-center justify-center hover:bg-[#8c7138] hover:text-white transition-colors"
                title="Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href="#youtube"
                className="w-7 h-7 rounded-full bg-[#222424] border border-[#2e3131] flex items-center justify-center hover:bg-[#8c7138] hover:text-white transition-colors"
                title="YouTube"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Quick Links & Customer Care in 2-Col layout on mobile */}
          <div className="grid grid-cols-2 gap-4 lg:contents">
            
            {/* Quick Links */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#8c7138]">Quick Links</h4>
              <ul className="space-y-1.5 text-[11px] sm:text-xs text-[#c4c7c7]">
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
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#8c7138]">Customer Care</h4>
              <ul className="space-y-1.5 text-[11px] sm:text-xs text-[#c4c7c7]">
                <li>
                  <button
                    onClick={onOpenQualityModal}
                    className="hover:text-white transition-colors text-left"
                  >
                    Quality Guarantee
                  </button>
                </li>
                <li>
                  <span className="hover:text-white cursor-pointer">Track Your Order</span>
                </li>
                <li>
                  <span className="hover:text-white cursor-pointer">Easy Returns</span>
                </li>
                <li>
                  <span className="hover:text-white cursor-pointer">Shipping Policy</span>
                </li>
                <li>
                  <span className="hover:text-white cursor-pointer">Jewellery Care</span>
                </li>
                {onOpenAtelierOps && (
                  <li className="pt-1 border-t border-[#2e3131]">
                    <button
                      onClick={onOpenAtelierOps}
                      className="hover:text-white text-[#fed488] font-bold flex items-center gap-1 transition-colors text-[11px]"
                    >
                      <LayoutDashboard className="w-3 h-3 text-[#8c7138]" />
                      <span>Admin Hub</span>
                    </button>
                  </li>
                )}
              </ul>
            </div>

          </div>

          {/* Stay Inspired Newsletter */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8c7138]">Stay Connected</h4>
            <p className="text-[11px] sm:text-xs text-[#c4c7c7] leading-relaxed">
              Subscribe for private sales and new drop alerts.
            </p>
            {subscribed ? (
              <div className="p-2.5 rounded-xl bg-[#8c7138]/20 text-[#fed488] text-[11px] font-bold flex items-center gap-1.5 border border-[#8c7138]/40">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#fed488]" />
                <span>Subscribed successfully!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <div className="relative max-w-sm">
                  <input
                    type="email"
                    required
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#222424] border border-[#2e3131] text-[11px] focus:outline-none focus:border-[#8c7138] transition-colors text-white placeholder:text-[#747878]"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-[#8c7138] text-white text-[10px] font-bold hover:bg-[#775a19] transition-colors flex items-center gap-1"
                  >
                    <span>Join</span>
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Copyright & Guarantee */}
        <div className="mt-6 sm:mt-10 pt-4 border-t border-[#2e3131] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-[10px] sm:text-xs text-[#747878]">
          <p>© 2026 PARZIO Jewellery. All rights reserved. Made with pride in India.</p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] text-[#8c7138] font-semibold">
            <span>100% SECURE CHECKOUT</span>
            <span>•</span>
            <span>COD AVAILABLE</span>
            {onOpenAtelierOps && (
              <>
                <span>•</span>
                <button
                  onClick={onOpenAtelierOps}
                  className="px-2 py-0.5 rounded-md bg-[#222424] text-[#fed488] hover:bg-[#8c7138] hover:text-white border border-[#2e3131] font-bold transition-all flex items-center gap-1"
                  title="Atelier Admin Hub"
                >
                  <LayoutDashboard className="w-3 h-3 text-[#8c7138]" />
                  <span>Admin</span>
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
