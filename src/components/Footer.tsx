import React, { useState } from 'react';
import { Phone, Mail, MapPin, X, ShieldCheck, Truck, RotateCcw, HelpCircle, Info } from 'lucide-react';
import { Logo } from './Logo';

interface FooterProps {
  onSelectCategory?: (cat: string) => void;
  onOpenAtelierOps?: () => void;
  onOpenQualityModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenAtelierOps }) => {
  const [activeModal, setActiveModal] = useState<'shipping' | 'returns' | 'faq' | 'about' | 'contact' | null>(null);

  return (
    <>
      <footer className="bg-[#161311] text-white border-t border-[#26201b] pt-4 sm:pt-6 pb-6 sm:pb-5 font-sans">
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-14">
          
          {/* Brand Header: Logo and text in one line */}
          <div className="flex items-center gap-3 pb-3.5 mb-4 border-b border-[#2a241f]">
            <Logo className="h-8 sm:h-9 w-auto filter brightness-125 shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs text-gray-400 leading-snug">
                Aapke Shringar, Hamari Pehchaan. Timeless demi-fine jewellery, fragrances, and beauty essentials.
              </p>
            </div>
          </div>

          {/* Main Footer Grid (2 cols mobile, 4 cols desktop) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-5 sm:gap-6 pb-4 sm:pb-6 border-b border-[#2a241f] text-xs">
            
            {/* Column 1: Quick Links */}
            <div className="col-span-1">
              <h3 className="text-xs font-semibold text-white mb-1.5 sm:mb-2 uppercase tracking-wider">
                Quick Links
              </h3>
              <ul className="space-y-1 sm:space-y-1.5 text-gray-300 text-[11px]">
                <li>
                  <button
                    onClick={() => {
                      if (onSelectCategory) onSelectCategory('ALL');
                      document.getElementById('vault-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-[#c5a059] transition-colors cursor-pointer text-left"
                  >
                    Shop All Products
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      window.location.hash = '#/account';
                    }}
                    className="hover:text-[#c5a059] transition-colors cursor-pointer text-left"
                  >
                    My Account
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal('about')}
                    className="hover:text-[#c5a059] transition-colors cursor-pointer text-left"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal('contact')}
                    className="hover:text-[#c5a059] transition-colors cursor-pointer text-left"
                  >
                    Contact Us
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenAtelierOps) onOpenAtelierOps();
                      else window.location.hash = '#/admin';
                    }}
                    className="hover:text-[#c5a059] transition-colors cursor-pointer text-left text-gray-400"
                  >
                    Admin Login
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 2: Customer Care */}
            <div className="col-span-1">
              <h3 className="text-xs font-semibold text-white mb-1.5 sm:mb-2 uppercase tracking-wider">
                Customer Care
              </h3>
              <ul className="space-y-1 sm:space-y-1.5 text-gray-300 text-[11px]">
                <li>
                  <button
                    onClick={() => setActiveModal('shipping')}
                    className="hover:text-[#c5a059] transition-colors cursor-pointer text-left"
                  >
                    Shipping Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal('returns')}
                    className="hover:text-[#c5a059] transition-colors cursor-pointer text-left"
                  >
                    Return &amp; Refund
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal('contact')}
                    className="hover:text-[#c5a059] transition-colors cursor-pointer text-left"
                  >
                    Help &amp; Support
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Get in Touch */}
            <div className="col-span-1">
              <h3 className="text-xs font-semibold text-white mb-1.5 sm:mb-2 uppercase tracking-wider">
                Get in Touch
              </h3>
              <ul className="space-y-1 sm:space-y-1.5 text-gray-300 text-[11px]">
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
                  <a href="tel:+917033656752" className="hover:text-white transition-colors">
                    +91 7033656752
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
                  <a href="mailto:jitendrapandit1764@gmail.com" className="hover:text-white transition-colors break-all">
                    jitendrapandit1764@gmail.com
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#c5a059] shrink-0 mt-0.5" />
                  <span>Giridih, Jharkhand - 815316</span>
                </li>
              </ul>
            </div>

            {/* Column 4: Available On (Compact Brand Pills) */}
            <div className="col-span-1">
              <h3 className="text-xs font-semibold text-white mb-1.5 sm:mb-2 uppercase tracking-wider">
                Available On
              </h3>
              <div className="flex flex-col gap-1.5">
                {/* Meesho */}
                <a
                  href="https://www.meesho.com/Parzio?_ms=3.0.1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 py-1 px-2.5 rounded-md bg-[#22131c] hover:bg-[#321929] border border-[#f43397]/30 hover:border-[#f43397] transition-all text-gray-200 hover:text-white text-[11px] font-medium w-fit cursor-pointer"
                  title="Shop Parzio on Meesho"
                >
                  <span className="w-3.5 h-3.5 rounded-full bg-[#f43397] flex items-center justify-center text-[9px] font-black text-white leading-none shrink-0">m</span>
                  <span>Meesho</span>
                </a>

                {/* Flipkart */}
                <a
                  href="https://www.flipkart.com/search?q=Parzio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 py-1 px-2.5 rounded-md bg-[#0e1726] hover:bg-[#15233a] border border-[#2874f0]/30 hover:border-[#2874f0] transition-all text-gray-200 hover:text-white text-[11px] font-medium w-fit cursor-pointer"
                  title="Shop Parzio on Flipkart"
                >
                  <span className="w-3.5 h-3.5 rounded bg-[#2874f0] flex items-center justify-center text-[10px] font-black italic text-[#ffe500] leading-none shrink-0">f</span>
                  <span>Flipkart</span>
                </a>

                {/* Amazon */}
                <a
                  href="https://www.amazon.in/s?k=Parzio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 py-1 px-2.5 rounded-md bg-[#191c20] hover:bg-[#262b32] border border-[#ff9900]/30 hover:border-[#ff9900] transition-all text-gray-200 hover:text-white text-[11px] font-medium w-fit cursor-pointer"
                  title="Shop Parzio on Amazon"
                >
                  <span className="w-3.5 h-3.5 rounded bg-[#ff9900] flex items-center justify-center text-[9px] font-bold text-[#141414] leading-none shrink-0">a</span>
                  <span>Amazon</span>
                </a>
              </div>
            </div>

          </div>

          {/* Bottom Bar: Copyright on Left, Tagline on Right */}
          <div className="pt-2.5 flex flex-col sm:flex-row items-center justify-between gap-1 text-[10px] sm:text-[11px] text-gray-400">
            <div className="flex items-center gap-2 sm:gap-3">
              <p>© 2025 Parzio. All Rights Reserved.</p>
              <span className="text-gray-600">•</span>
              <button
                type="button"
                onClick={() => {
                  if (onOpenAtelierOps) onOpenAtelierOps();
                  else window.location.hash = '#/admin';
                }}
                className="hover:text-[#fed488] text-gray-500 transition-colors cursor-pointer"
              >
                Admin Login
              </button>
            </div>
            <p className="font-serif italic text-gray-300">
              Beautiful Products. Happier You. <span className="text-[#c5a059]">♡</span>
            </p>
          </div>

        </div>
      </footer>

      {/* Interactive Information Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl border border-[#eae5dc] text-[#141414]">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-black transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {activeModal === 'shipping' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#f4efe8] flex items-center justify-center text-[#9e7144]">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#141414]">Shipping Policy</h3>
                    <p className="text-[11px] text-[#747878]">Express Insured Delivery Across India</p>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-[#444]">
                  <p>• <strong>Free Shipping:</strong> Free express delivery on all prepaid and COD orders above ₹499.</p>
                  <p>• <strong>Dispatch:</strong> Packed &amp; dispatched same business day via BlueDart / Delhivery.</p>
                  <p>• <strong>Delivery Time:</strong> 2–4 days (Metro cities) | 4–6 days (Rest of India).</p>
                  <p>• <strong>COD:</strong> Available across 26,000+ Indian pincodes.</p>
                </div>
              </div>
            )}

            {activeModal === 'returns' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#f4efe8] flex items-center justify-center text-[#9e7144]">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#141414]">Return &amp; Refund Policy</h3>
                    <p className="text-[11px] text-[#747878]">7-Day Hassle-Free Guarantee</p>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-[#444]">
                  <p>• <strong>7-Day Returns:</strong> Easy returns for any damaged or incorrect items.</p>
                  <p>• <strong>Doorstep Pickup:</strong> Free reverse pickup from your address.</p>
                  <p>• <strong>Quick Refund:</strong> Processed in 24–48 hours directly to your UPI/Bank.</p>
                </div>
              </div>
            )}

            {activeModal === 'about' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#f4efe8] flex items-center justify-center text-[#9e7144]">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#141414]">About PARZIO</h3>
                    <p className="text-[11px] text-[#747878]">Aapke Shringar, Hamari Pehchaan</p>
                  </div>
                </div>
                <p className="text-xs text-[#444] leading-relaxed">
                  PARZIO crafts 100% waterproof, anti-tarnish demi-fine jewellery and cosmetics designed for daily luxury without high designer markups.
                </p>
              </div>
            )}

            {activeModal === 'contact' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#f4efe8] flex items-center justify-center text-[#9e7144]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#141414]">Contact Support</h3>
                    <p className="text-[11px] text-[#747878]">Available 7 days a week</p>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-[#444]">
                  <div className="p-2.5 bg-[#faf8f5] rounded-lg border border-[#eae5dc]">
                    <span className="font-bold text-[#141414] block text-[11px]">Phone / WhatsApp</span>
                    <a href="tel:+917033656752" className="text-[#9e7144] font-semibold text-xs hover:underline">
                      +91 7033656752
                    </a>
                  </div>
                  <div className="p-2.5 bg-[#faf8f5] rounded-lg border border-[#eae5dc]">
                    <span className="font-bold text-[#141414] block text-[11px]">Email</span>
                    <a href="mailto:jitendrapandit1764@gmail.com" className="text-[#9e7144] font-semibold text-xs hover:underline break-all">
                      jitendrapandit1764@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setActiveModal(null)}
              className="mt-4 w-full py-2 rounded-xl bg-[#141414] hover:bg-[#9e7144] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
