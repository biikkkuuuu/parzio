import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Sparkles, Truck, ShieldCheck, ExternalLink, GripVertical, Move } from 'lucide-react';

interface WhatsAppSupportProps {
  onNavigateTrackOrder?: () => void;
}

export const WhatsAppSupport: React.FC<WhatsAppSupportProps> = ({ onNavigateTrackOrder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFaqAnswer, setActiveFaqAnswer] = useState<string | null>(null);

  // Draggable position state
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number; moved: boolean }>({
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
    moved: false
  });
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleStart = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const currentX = position ? position.x : rect.left;
    const currentY = position ? position.y : rect.top;

    dragRef.current = {
      startX: clientX,
      startY: clientY,
      initialX: currentX,
      initialY: currentY,
      moved: false
    };
    setIsDragging(true);
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging || !containerRef.current) return;
    const dx = clientX - dragRef.current.startX;
    const dy = clientY - dragRef.current.startY;

    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      dragRef.current.moved = true;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const newX = Math.max(10, Math.min(window.innerWidth - rect.width - 10, dragRef.current.initialX + dx));
    const newY = Math.max(10, Math.min(window.innerHeight - rect.height - 10, dragRef.current.initialY + dy));

    setPosition({ x: newX, y: newY });
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const onTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX, e.clientY);
      }
    };
    const onEnd = () => {
      handleEnd();
    };

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onEnd);
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', onEnd);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [isDragging, position]);

  const handleButtonClick = () => {
    if (!dragRef.current.moved) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div
      ref={containerRef}
      style={
        position
          ? { left: `${position.x}px`, top: `${position.y}px`, bottom: 'auto', right: 'auto' }
          : undefined
      }
      className={`fixed z-50 flex flex-col items-end select-none ${
        !position ? 'bottom-20 md:bottom-6 right-4 sm:right-6' : ''
      }`}
    >
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
          <div className="px-4 py-2 bg-[#f3efe9] border-t border-[#eae5dc] text-center text-[10px] text-[#747878] font-medium flex items-center justify-between">
            <span>Atelier Customer Care: 10 AM – 9 PM</span>
            <span className="text-[#8c7138] flex items-center gap-1 font-bold">
              <Move className="w-3 h-3" /> Drag to move
            </span>
          </div>
        </div>
      )}

      {/* Floating Draggable Trigger Button */}
      <div
        onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
        onTouchStart={(e) => {
          if (e.touches.length > 0) {
            handleStart(e.touches[0].clientX, e.touches[0].clientY);
          }
        }}
        onClick={handleButtonClick}
        title="Drag anywhere or click for Help"
        className={`flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#141414] text-white border border-[#8c7138]/50 hover:border-[#fed488] shadow-2xl hover:bg-[#202222] transition-shadow cursor-grab active:cursor-grabbing touch-none group ${
          isDragging ? 'scale-105 ring-2 ring-[#fed488]' : ''
        }`}
      >
        <GripVertical className="w-3.5 h-3.5 text-[#8c7138] group-hover:text-[#fed488] transition-colors shrink-0" />
        <div className="w-6 h-6 rounded-full bg-[#25D366] text-white flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
          <MessageCircle className="w-3.5 h-3.5 fill-white text-white" />
        </div>
        <div className="text-left hidden sm:block pr-1">
          <p className="text-[9px] uppercase tracking-wider text-[#fed488] font-bold leading-none">
            Help &amp; WhatsApp
          </p>
          <p className="text-xs font-bold text-white leading-tight">
            PARZIO Concierge
          </p>
        </div>
        <span className="sm:hidden font-bold text-xs text-[#fed488]">Help</span>
      </div>
    </div>
  );
};
