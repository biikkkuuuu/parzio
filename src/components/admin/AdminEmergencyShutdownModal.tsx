import React, { useState, useEffect } from 'react';
import { EmergencyShutdownConfig } from '../../types';
import {
  AlertOctagon,
  ShieldAlert,
  Power,
  X,
  CheckCircle2,
  AlertTriangle,
  Lock,
  PauseCircle,
  RefreshCw,
  MessageSquare
} from 'lucide-react';

interface AdminEmergencyShutdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: EmergencyShutdownConfig;
  onSaveConfig: (newConfig: EmergencyShutdownConfig) => void;
}

export const AdminEmergencyShutdownModal: React.FC<AdminEmergencyShutdownModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig
}) => {
  const [isActive, setIsActive] = useState(config.isActive);
  const [mode, setMode] = useState<'full-lockdown' | 'checkout-paused'>(config.mode);
  const [reason, setReason] = useState(config.reason);
  const [customMessage, setCustomMessage] = useState(config.customMessage);

  useEffect(() => {
    setIsActive(config.isActive);
    setMode(config.mode);
    setReason(config.reason);
    setCustomMessage(config.customMessage);
  }, [config, isOpen]);

  if (!isOpen) return null;

  const handleActivateShutdown = () => {
    onSaveConfig({
      isActive: true,
      mode,
      reason,
      customMessage: customMessage.trim() || 'Our digital vault and order processing are temporarily paused for security maintenance. Placed orders are secure.',
      activatedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    });
    onClose();
  };

  const handleDeactivate = () => {
    onSaveConfig({
      ...config,
      isActive: false
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#141414] text-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-rose-900/60 shadow-2xl space-y-5 animate-fadeIn relative">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
              config.isActive ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}>
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base sm:text-lg tracking-wide uppercase text-white">
                  Emergency Storefront Shutdown
                </h3>
                {config.isActive && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-mono font-bold animate-pulse">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-white/60">
                Atelier Master Kill-Switch &amp; Instant Maintenance Lockdown
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current State Indicator */}
        {config.isActive ? (
          <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800/80 text-xs space-y-2">
            <div className="flex items-center gap-2 text-rose-300 font-bold uppercase tracking-wider text-[11px]">
              <AlertTriangle className="w-4 h-4" />
              <span>STOREFRONT IS CURRENTLY SHUT DOWN</span>
            </div>
            <p className="text-rose-200/80 text-xs leading-relaxed">
              Customers cannot place orders. The emergency broadcast message is visible to all visitors.
              Active since: <strong className="text-white">{config.activatedAt || 'Recently'}</strong>.
            </p>
            <button
              type="button"
              onClick={handleDeactivate}
              className="mt-2 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Power className="w-4 h-4" />
              <span>Deactivate &amp; Resume Live Storefront</span>
            </button>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs flex items-center gap-2.5 text-emerald-400">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span className="text-white/80">
              Live storefront is currently online and accepting orders without restrictions.
            </span>
          </div>
        )}

        {/* Configuration Form */}
        <div className="space-y-4 text-xs">
          
          {/* Shutdown Mode Selection */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70">
              Choose Shutdown Severity Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setMode('full-lockdown')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  mode === 'full-lockdown'
                    ? 'bg-rose-950/40 border-rose-500 text-white shadow-inner'
                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs text-rose-400 mb-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Full Store Lockdown</span>
                </div>
                <p className="text-[11px] text-white/60 leading-tight">
                  Replaces entire storefront with high-end Atelier Emergency Maintenance screen.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setMode('checkout-paused')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  mode === 'checkout-paused'
                    ? 'bg-amber-950/40 border-amber-500 text-white shadow-inner'
                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs text-amber-400 mb-1">
                  <PauseCircle className="w-3.5 h-3.5" />
                  <span>Pause Checkout Only</span>
                </div>
                <p className="text-[11px] text-white/60 leading-tight">
                  Visitors can browse products, but Cart checkout and payments are frozen.
                </p>
              </button>
            </div>
          </div>

          {/* Reason Preset */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70">
              Reason for Shutdown
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-[#fed488]"
            >
              <option value="Security & Gateway Audit" className="bg-[#1e1e1e]">Security &amp; Gateway Audit</option>
              <option value="RTO Spike / Suspicious Orders Wave" className="bg-[#1e1e1e]">RTO Spike / Suspicious Orders Wave</option>
              <option value="Vault Physical Stock Count & Relocation" className="bg-[#1e1e1e]">Vault Physical Stock Count &amp; Relocation</option>
              <option value="Flash Sale Demand Surge / Server Cooldown" className="bg-[#1e1e1e]">Flash Sale Demand Surge / Server Cooldown</option>
              <option value="Scheduled Emergency Maintenance" className="bg-[#1e1e1e]">Scheduled Emergency Maintenance</option>
            </select>
          </div>

          {/* Custom Message to Customers */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 flex items-center justify-between">
              <span>Customer Broadcast Banner Notice</span>
              <span className="text-[10px] text-white/40">Visible to all users</span>
            </label>
            <textarea
              rows={3}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Enter the notification text to display on the storefront..."
              className="w-full bg-white/10 border border-white/15 rounded-xl p-3 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-[#fed488]"
            />
          </div>

          {/* Safety Safeguards Note */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-white/60 space-y-1">
            <p className="font-semibold text-white/80 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-[#fed488]" />
              Safe State Guarantee:
            </p>
            <p>
              • All existing orders ({`already placed`}) remain intact and printable.
              <br />
              • Admin panel access remains completely functional via your credentials.
              <br />
              • You can bring the store back online at any second.
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 text-white/80 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>

          {config.isActive ? (
            <button
              type="button"
              onClick={handleActivateShutdown}
              className="px-5 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-[#141414] text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Update Emergency Notice</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleActivateShutdown}
              className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-lg shadow-rose-900/40 active:scale-95"
            >
              <AlertOctagon className="w-4 h-4" />
              <span>Activate Emergency Shutdown</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
