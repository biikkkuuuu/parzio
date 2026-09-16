import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { Logo } from './Logo';

interface FooterProps {
  onSelectCategory?: (cat: string) => void;
  onOpenAtelierOps?: () => void;
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="bg-[#161311] text-white border-t border-[#26201b] pt-10 pb-6 font-sans">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-14">
        
        {/* Main Footer Grid matching screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 pb-8 border-b border-[#2a241f] text-xs">
          
          {/* Column 1: PARZIO Crown Logo */}
          <div className="flex flex-col items-start">
            <Logo className="h-9 w-auto text-[#c5a059] filter brightness-125 mb-3" />
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#vault-section" className="hover:text-[#c5a059] transition-colors">
                  Shop
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#c5a059] transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#c5a059] transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">
              Customer Care
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#shipping" className="hover:text-[#c5a059] transition-colors">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#returns" className="hover:text-[#c5a059] transition-colors">
                  Return &amp; Refund
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#c5a059] transition-colors">
                  FAQ
                </a>
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

          {/* Column 5: We're Also Available On */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">
              We're Also Available On
            </h3>
            <div className="flex items-center gap-2.5">
              {/* Meesho Badge */}
              <div className="h-9 px-3 rounded-md bg-[#841a54] flex items-center justify-center font-bold text-white text-xs tracking-tight shadow-sm cursor-pointer hover:opacity-90">
                meesho
              </div>

              {/* Flipkart Badge */}
              <div className="h-9 px-3 rounded-md bg-[#2874f0] flex items-center justify-center font-bold text-[#ffe500] text-xs italic tracking-tight shadow-sm cursor-pointer hover:opacity-90">
                Flipkart
              </div>

              {/* Amazon Badge */}
              <div className="h-9 px-3 rounded-md bg-[#1f2124] border border-gray-700 flex items-center justify-center font-bold text-white text-xs tracking-tight shadow-sm cursor-pointer hover:opacity-90">
                amazon
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright on Left, Tagline on Right matching screenshot */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-400">
          <p>© 2025 Parzio. All Rights Reserved.</p>
          <p className="font-serif italic text-gray-300">
            Beautiful Products. Happier You. <span className="text-[#c5a059]">♡</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
