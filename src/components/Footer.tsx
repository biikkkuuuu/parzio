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

            {/* Column 4: Available On (Official Brand Vector Logos) */}
            <div className="col-span-1">
              <h3 className="text-xs font-semibold text-white mb-1.5 sm:mb-2 uppercase tracking-wider">
                Available On
              </h3>
              <div className="flex flex-col gap-1.5 max-w-[125px]">
                {/* Meesho Official Logo */}
                <a
                  href="https://www.meesho.com/Parzio?_ms=3.0.1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1 px-2.5 rounded-md bg-[#22131c] hover:bg-[#321929] border border-[#f43397]/30 hover:border-[#f43397] transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                  title="Shop Parzio on Meesho"
                >
                  <svg className="h-3.5 w-auto shrink-0" viewBox="0 0 100 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="28" height="28" rx="7" fill="#f43397"/>
                    <path d="M7 19.5V10c0-1.4 1-2.4 2.3-2.4 1.1 0 1.9.7 2.2 1.6.3-.9 1.1-1.6 2.2-1.6 1.3 0 2.3 1 2.3 2.4v9.5h-2.1v-8.5c0-.6-.4-1-.9-1s-.9.4-.9 1v8.5H10v-8.5c0-.6-.4-1-.9-1s-.9.4-.9 1v8.5H7z" fill="#FFFFFF"/>
                    <text x="34" y="19" fontFamily="system-ui, -apple-system, sans-serif" fontSize="14" fontWeight="800" fill="#FFFFFF" letterSpacing="-0.2">
                      meesho
                    </text>
                  </svg>
                </a>

                {/* Flipkart Official Logo */}
                <a
                  href="https://www.flipkart.com/search?q=Parzio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1 px-2.5 rounded-md bg-[#0e1726] hover:bg-[#15233a] border border-[#2874f0]/30 hover:border-[#2874f0] transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                  title="Shop Parzio on Flipkart"
                >
                  <svg className="h-3.5 w-auto shrink-0" viewBox="0 0 105 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 4.5h-3.2V3.2C17.8 1.4 16.4 0 14.7 0h-1.9C11.1 0 9.7 1.4 9.7 3.2v1.3H6.5C5.1 4.5 4 5.6 4 7l1.5 15.5c.1 1.4 1.3 2.5 2.7 2.5h11.5c1.4 0 2.6-1.1 2.7-2.5L24 7c0-1.4-1.1-2.5-2.5-2.5zm-9.8-1.3c0-.9.7-1.6 1.6-1.6h1.9c.9 0 1.6.7 1.6 1.6v1.3h-5.1V3.2z" fill="#2874F0"/>
                    <path d="M14 10h-3.8c-.3 0-.6.3-.6.6v2c0 .3.3.6.6.6h1.9v1.8c0 .3.3.6.6.6h1.3c.3 0 .6-.3.6-.6V13.2h1.9c.3 0 .6-.3.6-.6v-2c0-.3-.3-.6-.6-.6H14V8.2c0-.3.3-.6.6-.6h2c.3 0 .6-.3.6-.6V5.4c0-.3-.3-.6-.6-.6H14.6c-2.1 0-3.6 1.5-3.6 3.6V10z" fill="#FFE500"/>
                    <text x="30" y="19" fontFamily="system-ui, -apple-system, sans-serif" fontSize="14" fontWeight="800" fontStyle="italic" fill="#FFFFFF" letterSpacing="-0.3">
                      Flipkart<tspan fill="#FFE500" fontSize="15">.</tspan>
                    </text>
                  </svg>
                </a>

                {/* Amazon Official Logo */}
                <a
                  href="https://www.amazon.in/s?k=Parzio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1 px-2.5 rounded-md bg-[#191c20] hover:bg-[#262b32] border border-[#ff9900]/30 hover:border-[#ff9900] transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                  title="Shop Parzio on Amazon"
                >
                  <svg className="h-3.5 w-auto shrink-0" viewBox="0 0 95 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.5 16.5c-1.9 1.4-4.5 2.1-6.8 2.1-5.2 0-8.3-3.1-8.3-7.8 0-4.8 3.3-8 8.6-8 2.2 0 4.6.7 6.3 1.9l-1.5 2.6c-1.3-.9-2.9-1.4-4.6-1.4-3.3 0-5.4 2-5.4 4.9 0 3 2 4.9 5.4 4.9 1.5 0 3.1-.4 4.5-1.2l1.8 2zm8.7 1.9h-3.7V3h3.7v15.4zm14.9 0h-3.6V10.5c0-2.7-1.3-4-3.5-4-2.4 0-3.9 1.6-3.9 4.4v7.5h-3.7V3h3.5v2.3c1.2-1.6 3.1-2.5 5.3-2.5 3.7 0 5.9 2.2 5.9 6.4v9.2zm14.6-7.4c0 4.6-3.1 7.7-7.8 7.7s-7.8-3.1-7.8-7.7c0-4.5 3.1-7.7 7.8-7.7 4.7 0 7.8 3.2 7.8 7.7zm-3.7 0c0-2.9-1.8-4.7-4.1-4.7s-4.1 1.8-4.1 4.7c0 2.9 1.8 4.7 4.1 4.7s4.1-1.8 4.1-4.7zm14.5 7.4h-3.7V9.1c0-2.3-1.2-3.4-3.2-3.4-2.2 0-3.7 1.5-3.7 4.1v8.4h-3.7V6h3.5v2c1.1-1.5 2.9-2.2 4.8-2.2 3.4 0 6 2 6 5.8v6.6z" fill="#FFFFFF"/>
                    <path d="M10 20c12.4 3.3 25.9 1.5 37.1-5.5.4-.2.7.3.4.7-11.7 7.7-26.2 9.5-39.1 6-.6-.2-.2-1.2 1.6-1.2z" fill="#FF9900"/>
                    <path d="M48.5 13.6c-.7.9-2 1.7-3 2-.3.1-.2-.3.1-.6 1.1-.7 2.4-1.5 3.1-2.1.2-.3.6.3-.2.7z" fill="#FF9900"/>
                  </svg>
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
