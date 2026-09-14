import React from 'react';
import { EmergencyShutdownConfig } from '../types';
import { Logo } from './Logo';
import {
  AlertOctagon,
  ShieldCheck,
  PhoneCall,
  Clock,
  Lock,
  MessageCircle,
  KeyRound,
  Sparkles
} from 'lucide-react';

interface EmergencyStorefrontLockdownProps {
  config: EmergencyShutdownConfig;
  onOpenAdmin: () => void;
}

export const EmergencyStorefrontLockdown: React.FC<EmergencyStorefrontLockdownProps> = ({
  config,
  onOpenAdmin
}) => {
  const handleOpenWhatsApp = () => {
    window.open('https://wa.me/919876543210?text=Hi%20Parzio%20Jewellery%20Concierge,%20inquiring%20about%20my%20order', '_blank');
  };

  return (
    <div className="min-h-screen bg-[#141414] text-[#f4f2ee] flex flex-col justify-between selection:bg-[#fed488] selection:text-[#141414] relative overflow-hidden">
      
      {/* Background Subtle Gradient & Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-rose-600/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#8c7138]/20 rounded-full blur-3xl" />
      </div>

      {/* Top Bar */}
      <header className="relative z-10 px-6 py-5 border-b border-white/10 flex items-center justify-between max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <Logo className="h-7 w-auto" isLight />
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold border border-rose-500/40 animate-pulse">
            ATELIER EMERGENCY LOCKDOWN
          </span>
        </div>

        <button
          onClick={onOpenAdmin}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/10"
        >
          <KeyRound className="w-3.5 h-3.5 text-[#fed488]" />
          <span>Admin Access</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-2xl mx-auto px-6 py-12 text-center flex-1 flex flex-col justify-center items-center">
        
        {/* Pulsing Emergency Shield Icon */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-3xl bg-rose-950/80 border border-rose-600/60 flex items-center justify-center text-rose-400 mx-auto shadow-2xl animate-pulse">
            <AlertOctagon className="w-10 h-10" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#141414] border border-white/20 flex items-center justify-center text-[#fed488]">
            <Lock className="w-3.5 h-3.5" />
          </div>
        </div>

        <span className="text-[11px] font-mono tracking-widest text-[#fed488] uppercase mb-2 block font-semibold">
          SECURITY &amp; SYSTEM INTEGRITY AUDIT
        </span>

        <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white mb-4">
          PARZIO ATELIER IS CURRENTLY PAUSED
        </h1>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8 text-left space-y-3 backdrop-blur-sm max-w-lg w-full">
          <div className="flex items-start gap-2.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 flex-shrink-0 animate-ping" />
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">
                Reason: {config.reason}
              </p>
              <p className="text-xs text-white/80 mt-1 leading-relaxed">
                {config.customMessage}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/60">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#fed488]" />
              Triggered: {config.activatedAt || 'Today'}
            </span>
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Placed Orders Safe
            </span>
          </div>
        </div>

        {/* Customer Assurance Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg mb-8 text-left text-xs">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white text-xs">Orders In Transit Protected</p>
              <p className="text-[11px] text-white/50">BlueDart &amp; Delhivery dispatches continue on schedule.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-[#fed488] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white text-xs">Resuming Shortly</p>
              <p className="text-[11px] text-white/50">Our vault engineers are working to restore full access.</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm">
          <button
            onClick={handleOpenWhatsApp}
            className="w-full py-3 px-5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat With Concierge on WhatsApp</span>
          </button>

          <button
            onClick={onOpenAdmin}
            className="w-full py-3 px-5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider transition-all border border-white/10 flex items-center justify-center gap-2"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#fed488]" />
            <span>Admin Operator Login</span>
          </button>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-4 border-t border-white/10 text-center text-xs text-white/40 max-w-6xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>&copy; {new Date().getFullYear()} PARZIO LUXURY ATELIER INDIA. ALL RIGHTS RESERVED.</span>
        <span className="font-mono text-[11px] text-[#fed488]">ATELIER ENCRYPTION 256-BIT</span>
      </footer>

    </div>
  );
};
