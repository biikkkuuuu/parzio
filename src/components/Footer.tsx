import React, { useState } from 'react';
import { Phone, Mail, MapPin, X, ShieldCheck, Truck, RotateCcw, HelpCircle, Info } from 'lucide-react';
import { Logo } from './Logo';

interface FooterProps {
  onSelectCategory?: (cat: string) => void;
  onOpenAtelierOps?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenAtelierOps }) => {
  const [activeModal, setActiveModal] = useState<'shipping' | 'returns' | 'faq' | 'about' | 'contact' | null>(null);

  return (
    <>
      <footer className="bg-[#161311] text-white border-t border-[#26201b] pt-10 pb-6 font-sans">
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-14">
          
          {/* Main Footer Grid matching screenshot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 pb-8 border-b border-[#2a241f] text-xs">
            
            {/* Column 1: PARZIO Crown Logo */}
            <div className="flex flex-col items-start">
              <Logo className="h-10 w-auto filter brightness-125 mb-3" />
              <p className="text-[11px] text-gray-400 leading-relaxed max-w-[220px]">
                Aapke Shringar, Hamari Pehchaan. Timeless demi-fine jewellery, fragrances, and beauty essentials.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">
                Quick Links
              </h3>
              <ul className="space-y-2 text-gray-300">
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
                {onOpenAtelierOps && (
                  <li>
                    <button
                      onClick={onOpenAtelierOps}
                      className="hover:text-[#c5a059] transition-colors cursor-pointer text-left text-gray-400"
                    >
                      Admin Atelier Ops
                    </button>
                  </li>
                )}
              </ul>
            </div>

            {/* Column 3: Customer Care */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">
                Customer Care
              </h3>
              <ul className="space-y-2 text-gray-300">
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
                    onClick={() => setActiveModal('faq')}
                    className="hover:text-[#c5a059] transition-colors cursor-pointer text-left"
                  >
                    FAQ
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Get in Touch */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">
                Get in Touch
              </h3>
              <ul className="space-y-2.5 text-gray-300">
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

            {/* Column 5: We're Also Available On (Clickable Live Links) */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">
                We're Also Available On
              </h3>
              <div className="flex items-center gap-2.5">
                {/* Meesho Official Store Link */}
                <a
                  href="https://www.meesho.com/Parzio?_ms=3.0.1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 px-3 rounded-md bg-[#841a54] hover:bg-[#9e1f64] flex items-center justify-center font-bold text-white text-xs tracking-tight shadow-sm transition-all transform hover:-translate-y-0.5 cursor-pointer"
                  title="Visit Parzio Official Shop on Meesho"
                >
                  meesho
                </a>

                {/* Flipkart Badge */}
                <a
                  href="https://www.flipkart.com/search?q=Parzio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 px-3 rounded-md bg-[#2874f0] hover:bg-[#1a66e0] flex items-center justify-center font-bold text-[#ffe500] text-xs italic tracking-tight shadow-sm transition-all transform hover:-translate-y-0.5 cursor-pointer"
                  title="Shop Parzio on Flipkart"
                >
                  Flipkart
                </a>

                {/* Amazon Badge */}
                <a
                  href="https://www.amazon.in/s?k=Parzio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 px-3 rounded-md bg-[#1f2124] hover:bg-[#2d3035] border border-gray-700 flex items-center justify-center font-bold text-white text-xs tracking-tight shadow-sm transition-all transform hover:-translate-y-0.5 cursor-pointer"
                  title="Shop Parzio on Amazon"
                >
                  amazon
                </a>
              </div>
            </div>

          </div>

          {/* Bottom Bar: Copyright on Left, Tagline on Right */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-400">
            <p>© 2025 Parzio. All Rights Reserved.</p>
            <p className="font-serif italic text-gray-300">
              Beautiful Products. Happier You. <span className="text-[#c5a059]">♡</span>
            </p>
          </div>

        </div>
      </footer>

      {/* Interactive Information Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-[#eae5dc] text-[#141414]">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {activeModal === 'shipping' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#f4efe8] flex items-center justify-center text-[#9e7144]">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-[#141414]">Shipping Policy</h3>
                    <p className="text-xs text-[#747878]">Fast, Insured & Tracked Express Delivery</p>
                  </div>
                </div>
                <div className="space-y-2.5 text-xs text-[#444] leading-relaxed">
                  <p>• <strong>Free Delivery:</strong> All prepaid and COD orders above ₹499 qualify for complimentary insured shipping across India.</p>
                  <p>• <strong>Dispatch Time:</strong> Orders placed before 3:00 PM are packed and dispatched on the same business day from our Giridih / Mumbai ateliers.</p>
                  <p>• <strong>Delivery Timeframe:</strong> Metro cities: 2-4 days. Other locations: 4-6 business days with SMS tracking link sent via BlueDart / Delhivery.</p>
                  <p>• <strong>Cash On Delivery (COD):</strong> COD is available across 26,000+ pincodes. Check package before making cash payment.</p>
                </div>
              </div>
            )}

            {activeModal === 'returns' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#f4efe8] flex items-center justify-center text-[#9e7144]">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-[#141414]">Return &amp; Refund Policy</h3>
                    <p className="text-xs text-[#747878]">7-Day Hassle-Free Exchange &amp; Refunds</p>
                  </div>
                </div>
                <div className="space-y-2.5 text-xs text-[#444] leading-relaxed">
                  <p>• <strong>7 Days Easy Return:</strong> If you receive a damaged or incorrect piece, initiate return within 7 days of delivery.</p>
                  <p>• <strong>Doorstep Pickup:</strong> Our courier partner will pick up the package from your address with zero reverse shipping fees.</p>
                  <p>• <strong>Instant Refunds:</strong> Prepaid refunds processed back to original UPI/Card in 24-48 hours. For COD, bank transfer/UPI refund is issued.</p>
                </div>
              </div>
            )}

            {activeModal === 'faq' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#f4efe8] flex items-center justify-center text-[#9e7144]">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-[#141414]">Frequently Asked Questions</h3>
                    <p className="text-xs text-[#747878]">Quick answers to common queries</p>
                  </div>
                </div>
                <div className="space-y-3 text-xs text-[#444] max-h-[60vh] overflow-y-auto pr-1">
                  <div>
                    <h4 className="font-bold text-[#141414]">Q: Is PARZIO jewellery waterproof?</h4>
                    <p className="mt-0.5 text-[#666]">Yes, all our jewellery is crafted in surgical grade 316L stainless steel with 18K micro-plating. It won't tarnish or turn black in water, sweat, or perfumes.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#141414]">Q: How do I track my order?</h4>
                    <p className="mt-0.5 text-[#666]">Click the Track Order tab or enter your Order ID in the track section to see real-time updates.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#141414]">Q: Can I buy on Meesho directly?</h4>
                    <p className="mt-0.5 text-[#666]">Yes! You can click our Meesho button in the footer to visit our verified shop on Meesho.</p>
                  </div>
                </div>
              </div>
            )}

            {activeModal === 'about' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#f4efe8] flex items-center justify-center text-[#9e7144]">
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-[#141414]">About PARZIO</h3>
                    <p className="text-xs text-[#747878]">Aapke Shringar, Hamari Pehchaan</p>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-[#444] leading-relaxed">
                  <p>PARZIO was born out of a desire to make luxury demi-fine jewellery, cosmetics, and beauty accessories accessible to every woman across India without the hefty designer markups.</p>
                  <p>Every piece in our catalog is engineered to withstand daily wear—100% waterproof, sweatproof, and hypoallergenic. Over 50,000+ happy shoppers across India trust PARZIO for their festive and everyday elegance.</p>
                </div>
              </div>
            )}

            {activeModal === 'contact' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#f4efe8] flex items-center justify-center text-[#9e7144]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-[#141414]">Contact Support</h3>
                    <p className="text-xs text-[#747878]">We're here to help you 7 days a week</p>
                  </div>
                </div>
                <div className="space-y-3 text-xs text-[#444]">
                  <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#eae5dc]">
                    <span className="font-bold text-[#141414] block mb-1">Phone / WhatsApp Support</span>
                    <a href="tel:+917033656752" className="text-[#9e7144] font-semibold text-sm hover:underline">
                      +91 7033656752
                    </a>
                  </div>
                  <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#eae5dc]">
                    <span className="font-bold text-[#141414] block mb-1">Email Concierge</span>
                    <a href="mailto:jitendrapandit1764@gmail.com" className="text-[#9e7144] font-semibold hover:underline break-all">
                      jitendrapandit1764@gmail.com
                    </a>
                  </div>
                  <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#eae5dc]">
                    <span className="font-bold text-[#141414] block mb-1">Headquarters &amp; Dispatch Hub</span>
                    <p className="text-[#666]">Giridih, Jharkhand - 815316, India</p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setActiveModal(null)}
              className="mt-5 w-full py-2.5 rounded-full bg-[#141414] hover:bg-[#9e7144] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
