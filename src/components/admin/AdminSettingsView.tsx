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

import { GlobalStoreSettings } from '../../services/dbService';

interface AdminSettingsViewProps {
  settings?: GlobalStoreSettings;
  onUpdateSettings?: (settings: GlobalStoreSettings) => void;
  onTriggerToast: (msg: string) => void;
}

export const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onTriggerToast
}) => {
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(
    settings ? String(settings.freeShippingThreshold) : '500'
  );
  const [codFee, setCodFee] = useState(settings ? String(settings.codFee) : '0');
  const [blueDartKey, setBlueDartKey] = useState(
    settings ? settings.blueDartKey : 'BLUEDART_PROD_LIVE_88329'
  );
  const [delhiveryKey, setDelhiveryKey] = useState(
    settings ? settings.delhiveryKey : 'DELHIVERY_TOKEN_SEC_99182'
  );
  const [whatsappApi, setWhatsappApi] = useState(
    settings ? settings.whatsappApi : 'META_WHATSAPP_CLOUD_PROD_4412'
  );
  const [allowReversePickup, setAllowReversePickup] = useState(
    settings ? settings.allowReversePickup : true
  );
  const [acceptCod, setAcceptCod] = useState(
    settings ? settings.acceptCod : true
  );

  React.useEffect(() => {
    if (settings) {
      setFreeShippingThreshold(String(settings.freeShippingThreshold));
      setCodFee(String(settings.codFee));
      setBlueDartKey(settings.blueDartKey);
      setDelhiveryKey(settings.delhiveryKey);
      setWhatsappApi(settings.whatsappApi);
      setAllowReversePickup(settings.allowReversePickup);
      setAcceptCod(settings.acceptCod);
    }
  }, [settings]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: GlobalStoreSettings = {
      freeShippingThreshold: Number(freeShippingThreshold) || 500,
      codFee: Number(codFee) || 0,
      blueDartKey: blueDartKey.trim(),
      delhiveryKey: delhiveryKey.trim(),
      whatsappApi: whatsappApi.trim(),
      allowReversePickup,
      acceptCod,
    };
    if (onUpdateSettings) onUpdateSettings(updated);
    onTriggerToast('Store settings & logistics keys securely saved to cloud database!');
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      
      {/* Top Bar */}
      <div className="bg-white rounded-3xl p-5 border border-[#eae5dc] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-base font-bold text-[#141414] flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#8c7138]" />
            Store Gateway Configurations &amp; Policies
          </h3>
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
          </div>
        </div>

        {/* Store Commercial Policies */}
        <div className="bg-white rounded-3xl p-6 border border-[#eae5dc] shadow-sm space-y-4">
          <h4 className="font-display text-base font-bold text-[#141414] flex items-center gap-2 pb-2 border-b border-[#eae5dc]">
            <CreditCard className="w-4 h-4 text-[#8c7138]" />
            Store Delivery, Reverse Pickup &amp; COD Policies
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

          {/* Yes / No Global Policies */}
          <div className="pt-2 border-t border-[#eae5dc] space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#faf8f5] border border-[#eae5dc]">
              <div>
                <p className="font-bold text-[#141414]">Allow Reverse Pickup Courier</p>
              </div>
              <div className="inline-flex items-center gap-1 bg-white p-0.5 rounded-full border border-[#eae5dc]">
                <button
                  type="button"
                  onClick={() => setAllowReversePickup(true)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${
                    allowReversePickup
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-[#747878] hover:text-[#141414]'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setAllowReversePickup(false)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${
                    !allowReversePickup
                      ? 'bg-rose-700 text-white shadow-xs'
                      : 'text-[#747878] hover:text-[#141414]'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#faf8f5] border border-[#eae5dc]">
              <div>
                <p className="font-bold text-[#141414]">Accept Cash On Delivery (COD)</p>
              </div>
              <div className="inline-flex items-center gap-1 bg-white p-0.5 rounded-full border border-[#eae5dc]">
                <button
                  type="button"
                  onClick={() => setAcceptCod(true)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${
                    acceptCod
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-[#747878] hover:text-[#141414]'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setAcceptCod(false)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${
                    !acceptCod
                      ? 'bg-rose-700 text-white shadow-xs'
                      : 'text-[#747878] hover:text-[#141414]'
                  }`}
                >
                  No
                </button>
              </div>
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
                <p className="font-bold text-[#141414]">Operations Lead</p>
                <p className="text-[11px] text-[#747878]">Shift #04 • Fulfillment Hub</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Admin Role
              </span>
            </div>
          </div>
        </div>

      </div>

    </form>
  );
};
