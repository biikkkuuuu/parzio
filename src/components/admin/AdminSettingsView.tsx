import React, { useState } from 'react';
import {
  Truck,
  ShieldCheck,
  CreditCard,
  PhoneCall,
  Save,
  CheckCircle2,
  Lock,
  Sparkles
} from 'lucide-react';

interface AdminSettingsViewProps {
  onTriggerToast: (msg: string) => void;
}

export const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({ onTriggerToast }) => {
  const [freeShippingThreshold, setFreeShippingThreshold] = useState('500');
  const [codFee, setCodFee] = useState('0');
  const [blueDartKey, setBlueDartKey] = useState('BLUEDART_PROD_LIVE_88329');
  const [delhiveryKey, setDelhiveryKey] = useState('DELHIVERY_TOKEN_SEC_99182');
  const [whatsappApi, setWhatsappApi] = useState('META_WHATSAPP_CLOUD_PROD_4412');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onTriggerToast('Atelier operational settings & logistics keys securely saved!');
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      
      {/* Top Bar */}
      <div className="bg-white rounded-3xl p-5 border border-[#eae5dc] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-base font-bold text-[#141414] flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#8c7138]" />
            Atelier Gateway Configurations &amp; Policies
          </h3>
          <p className="text-xs text-[#747878] mt-0.5">
            Manage live logistics courier webhooks, automated WhatsApp triggers, and pricing rules.
          </p>
        </div>

        <button
          type="submit"
          className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#141414] text-white hover:bg-[#8c7138] text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95"
        >
          <Save className="w-3.5 h-3.5 text-[#fed488]" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Grid: Gateways & Policies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Logistics & Airway Bill Gateways */}
        <div className="bg-white rounded-3xl p-6 border border-[#eae5dc] shadow-sm space-y-4">
          <h4 className="font-display text-base font-bold text-[#141414] flex items-center gap-2 pb-2 border-b border-[#eae5dc]">
            <Truck className="w-4 h-4 text-[#8c7138]" />
            Logistics &amp; Courier Webhooks
          </h4>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
                BlueDart Express Air API Token
              </label>
              <input
                type="password"
                value={blueDartKey}
                onChange={(e) => setBlueDartKey(e.target.value)}
                className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 font-mono text-[#141414] focus:outline-none focus:border-[#8c7138]"
              />
              <span className="text-[10px] text-emerald-700 flex items-center gap-1 mt-1 font-semibold">
                <CheckCircle2 className="w-3 h-3" /> Webhook Connected • 98.4% On-time Pickup
              </span>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
                Delhivery Surface B2C Token
              </label>
              <input
                type="password"
                value={delhiveryKey}
                onChange={(e) => setDelhiveryKey(e.target.value)}
                className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 font-mono text-[#141414] focus:outline-none focus:border-[#8c7138]"
              />
              <span className="text-[10px] text-emerald-700 flex items-center gap-1 mt-1 font-semibold">
                <CheckCircle2 className="w-3 h-3" /> Real-time Tracking Webhook Active
              </span>
            </div>
          </div>
        </div>

        {/* Automated WhatsApp & Customer Communication */}
        <div className="bg-white rounded-3xl p-6 border border-[#eae5dc] shadow-sm space-y-4">
          <h4 className="font-display text-base font-bold text-[#141414] flex items-center gap-2 pb-2 border-b border-[#eae5dc]">
            <PhoneCall className="w-4 h-4 text-[#8c7138]" />
            WhatsApp Business API (OTP &amp; Updates)
          </h4>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
                Meta Cloud API Key
              </label>
              <input
                type="password"
                value={whatsappApi}
                onChange={(e) => setWhatsappApi(e.target.value)}
                className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 font-mono text-[#141414] focus:outline-none focus:border-[#8c7138]"
              />
              <span className="text-[10px] text-emerald-700 flex items-center gap-1 mt-1 font-semibold">
                <CheckCircle2 className="w-3 h-3" /> Green Tick WhatsApp Verified • @parzio_official
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#faf8f5] border border-[#eae5dc] text-[11px] text-[#444748]">
              Automated notifications sent upon: Order Placed, WhatsApp COD OTP Confirmation, Dispatch AWB Generated, and Out For Delivery.
            </div>
          </div>
        </div>

        {/* Store Commercial Policies */}
        <div className="bg-white rounded-3xl p-6 border border-[#eae5dc] shadow-sm space-y-4">
          <h4 className="font-display text-base font-bold text-[#141414] flex items-center gap-2 pb-2 border-b border-[#eae5dc]">
            <CreditCard className="w-4 h-4 text-[#8c7138]" />
            Store Delivery &amp; COD Fees
          </h4>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
                Free Delivery Above (₹)
              </label>
              <input
                type="number"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(e.target.value)}
                className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 font-bold text-[#141414] focus:outline-none focus:border-[#8c7138]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
                COD Extra Charge (₹)
              </label>
              <input
                type="number"
                value={codFee}
                onChange={(e) => setCodFee(e.target.value)}
                className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 font-bold text-[#141414] focus:outline-none focus:border-[#8c7138]"
              />
            </div>
          </div>
        </div>

        {/* Shift Lead & Security Access */}
        <div className="bg-white rounded-3xl p-6 border border-[#eae5dc] shadow-sm space-y-4">
          <h4 className="font-display text-base font-bold text-[#141414] flex items-center gap-2 pb-2 border-b border-[#eae5dc]">
            <ShieldCheck className="w-4 h-4 text-[#8c7138]" />
            Fulfillment Center Lead
          </h4>

          <div className="text-xs space-y-2">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#faf8f5] border border-[#eae5dc]">
              <div>
                <p className="font-bold text-[#141414]">Priya K. (Master Jeweller)</p>
                <p className="text-[11px] text-[#747878]">Shift #04 • Mumbai Atelier Hub</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Admin Role
              </span>
            </div>

            <p className="text-[11px] text-[#747878] italic">
              All barcode scanners, packaging scales, and BlueDart dispatch thermal printers synchronized.
            </p>
          </div>
        </div>

      </div>

    </form>
  );
};
