import React, { useState } from 'react';
import { HIGH_RISK_PINCODES } from '../../data/adminData';
import {
  ShieldCheck,
  AlertTriangle,
  Send,
  Lock,
  PhoneCall,
  CheckCircle2,
  Plus,
  ArrowRight,
  Edit2,
  Trash2,
  X
} from 'lucide-react';

interface PincodeItem {
  pincode: string;
  area: string;
  rtoRate: number;
  status: string;
  action: string;
}

interface AdminRtoShieldViewProps {
  onTriggerToast: (msg: string) => void;
}

export const AdminRtoShieldView: React.FC<AdminRtoShieldViewProps> = ({ onTriggerToast }) => {
  const [pincodes, setPincodes] = useState<PincodeItem[]>(HIGH_RISK_PINCODES);
  const [newPincode, setNewPincode] = useState('');
  const [newArea, setNewArea] = useState('');
  const [phoneToConvert, setPhoneToConvert] = useState('');

  // Editing state
  const [editingPincode, setEditingPincode] = useState<PincodeItem | null>(null);
  const [confirmDeletePincode, setConfirmDeletePincode] = useState<string | null>(null);

  const handleAddPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPincode || newPincode.length !== 6) {
      onTriggerToast('Please enter a valid 6-digit Indian PIN code.');
      return;
    }
    const item: PincodeItem = {
      pincode: newPincode.trim(),
      area: newArea.trim() || 'Custom Watchlist Pincode',
      rtoRate: 45,
      status: 'High RTO',
      action: 'Require WhatsApp OTP'
    };
    setPincodes([item, ...pincodes]);
    setNewPincode('');
    setNewArea('');
    onTriggerToast(`Pincode ${newPincode} added to RTO Risk Shield!`);
  };

  const handleSaveEditPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPincode) return;

    setPincodes((prev) =>
      prev.map((p) => (p.pincode === editingPincode.pincode ? editingPincode : p))
    );
    onTriggerToast(`Pincode ${editingPincode.pincode} rule updated!`);
    setEditingPincode(null);
  };

  const handleDeletePincode = (code: string) => {
    setPincodes((prev) => prev.filter((p) => p.pincode !== code));
    onTriggerToast(`Pincode ${code} removed from high-risk watchlist.`);
    setConfirmDeletePincode(null);
  };

  const handleSendPrepaidIncentive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneToConvert) return;
    onTriggerToast(`Prepaid ₹20 incentive link dispatched via WhatsApp to ${phoneToConvert}!`);
    setPhoneToConvert('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-[#141414] text-white rounded-3xl p-6 shadow-sm border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#fed488] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#fed488]" />
            PARZIO AI RTO SHIELD (ACTIVE V3.4)
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-bold mt-1 text-white">
            Pre-Dispatch Fraud &amp; Bogus Address Prevention
          </h3>
          <p className="text-xs text-white/70 mt-1 max-w-2xl">
            Automatically scans delivery addresses, unverified phone numbers, and repeat COD refuse patterns across 26,000+ Indian pincodes to protect atelier profit margins.
          </p>
        </div>

        <div className="bg-white/10 p-4 rounded-2xl border border-white/15 text-center flex-shrink-0">
          <p className="font-mono text-2xl font-bold text-emerald-400">₹18,450</p>
          <p className="text-[10px] text-white/80 font-bold uppercase tracking-wider mt-0.5">
            Saved This Week
          </p>
        </div>
      </div>

      {/* 2-Column Grid: Watchlist + Converter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: High-Risk Pincodes Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-[#eae5dc] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#eae5dc]">
            <div>
              <h4 className="font-display text-base font-bold text-[#141414] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Monitored High-RTO Indian Pincodes ({pincodes.length})
              </h4>
              <p className="text-xs text-[#747878] mt-0.5">
                Add, edit rules, or remove verified postal codes from the pre-dispatch watchlist.
              </p>
            </div>
          </div>

          {/* Quick Add Form */}
          <form onSubmit={handleAddPincode} className="flex flex-col sm:flex-row gap-2 pt-1">
            <input
              type="text"
              placeholder="6-digit Pincode (e.g. 110085)"
              maxLength={6}
              value={newPincode}
              onChange={(e) => setNewPincode(e.target.value)}
              className="w-48 bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 text-xs font-mono text-[#141414] focus:outline-none focus:border-[#8c7138]"
            />
            <input
              type="text"
              placeholder="Area / City (e.g. Rohini Sec 14, Delhi)"
              value={newArea}
              onChange={(e) => setNewArea(e.target.value)}
              className="flex-1 bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 text-xs text-[#141414] focus:outline-none focus:border-[#8c7138]"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#141414] hover:bg-[#8c7138] text-white text-xs font-bold flex items-center gap-1.5 transition-colors flex-shrink-0"
            >
              <Plus className="w-3.5 h-3.5 text-[#fed488]" />
              Add Pincode
            </button>
          </form>

          {/* Table */}
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#eae5dc] text-[10px] font-bold uppercase text-[#747878]">
                  <th className="py-2.5">Pincode</th>
                  <th className="py-2.5">Area / City</th>
                  <th className="py-2.5">RTO Rate</th>
                  <th className="py-2.5">Rule Enforcement</th>
                  <th className="py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f4f2ee]">
                {pincodes.map((pin) => (
                  <tr key={pin.pincode} className="hover:bg-[#faf8f5]">
                    <td className="py-3 font-mono font-bold text-[#141414]">{pin.pincode}</td>
                    <td className="py-3 text-[#444748]">{pin.area}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">
                        {pin.rtoRate}% Returns
                      </span>
                    </td>
                    <td className="py-3 text-xs font-semibold text-emerald-800">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {pin.action}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingPincode(pin)}
                          title="Edit Rule"
                          className="p-1 rounded-full hover:bg-[#eae5dc] text-[#141414]"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setConfirmDeletePincode(pin.pincode)}
                          title="Delete Pincode"
                          className="p-1 rounded-full hover:bg-rose-100 text-rose-700 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Convert COD to Prepaid */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 border border-[#eae5dc] shadow-sm space-y-4">
            <h4 className="font-display text-base font-bold text-[#141414] flex items-center gap-2 pb-2 border-b border-[#eae5dc]">
              <PhoneCall className="w-4 h-4 text-[#8c7138]" />
              COD to UPI Converter
            </h4>
            <p className="text-xs text-[#444748] leading-relaxed">
              Send an automated WhatsApp payment link offering customer an extra <strong>₹20 instant cashback</strong> if they prepay before order packing.
            </p>

            <form onSubmit={handleSendPrepaidIncentive} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
                  Customer Mobile Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phoneToConvert}
                  onChange={(e) => setPhoneToConvert(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 text-xs font-mono text-[#141414] focus:outline-none focus:border-[#8c7138]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-[#141414] hover:bg-[#8c7138] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <Send className="w-3.5 h-3.5 text-[#fed488]" />
                Send ₹20 Prepaid Link
              </button>
            </form>
          </div>

          {/* Verification Protocol Rule */}
          <div className="p-5 rounded-3xl bg-[#faf8f5] border border-[#eae5dc] text-xs space-y-2">
            <h5 className="font-bold text-[#141414] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#8c7138]" />
              Automated OTP Rule
            </h5>
            <p className="text-[#747878] text-[11px] leading-relaxed">
              All COD orders exceeding ₹1,500 automatically receive an IVR call or WhatsApp confirmation before inventory packing.
            </p>
          </div>

        </div>

      </div>

      {/* Edit Pincode Modal */}
      {editingPincode && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#eae5dc] shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-[#eae5dc]">
              <h4 className="font-bold text-sm text-[#141414]">
                Edit Rule: PIN {editingPincode.pincode}
              </h4>
              <button onClick={() => setEditingPincode(null)} className="p-1 rounded-full hover:bg-[#eae5dc]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditPincode} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
                  Area / City
                </label>
                <input
                  type="text"
                  required
                  value={editingPincode.area}
                  onChange={(e) => setEditingPincode({ ...editingPincode, area: e.target.value })}
                  className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 text-xs font-semibold text-[#141414]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
                  Historical Return Rate (%)
                </label>
                <input
                  type="number"
                  value={editingPincode.rtoRate}
                  onChange={(e) => setEditingPincode({ ...editingPincode, rtoRate: Number(e.target.value) })}
                  className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 text-xs font-bold text-[#141414]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
                  Action Rule
                </label>
                <select
                  value={editingPincode.action}
                  onChange={(e) => setEditingPincode({ ...editingPincode, action: e.target.value })}
                  className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 text-xs font-semibold text-[#141414]"
                >
                  <option value="Require WhatsApp OTP">Require WhatsApp OTP</option>
                  <option value="Address re-confirm">Address re-confirm</option>
                  <option value="Prepaid-Only Recommended">Prepaid-Only Recommended</option>
                  <option value="Courier priority routing">Courier priority routing</option>
                  <option value="Block fake numbers">Block fake numbers</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#eae5dc]">
                <button
                  type="button"
                  onClick={() => setEditingPincode(null)}
                  className="px-4 py-1.5 rounded-full border border-[#eae5dc] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-full bg-[#141414] hover:bg-[#8c7138] text-white text-xs font-bold"
                >
                  Save Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Delete Pincode from Watchlist */}
      {confirmDeletePincode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 border border-[#eae5dc] shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-[#141414]">Remove Pincode {confirmDeletePincode}?</h3>
                <p className="text-xs text-[#717478] mt-1 leading-relaxed">
                  Are you sure you want to remove pincode <span className="font-semibold text-[#141414]">{confirmDeletePincode}</span> from the high-risk RTO watchlist?
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-[#f0f1f3]">
              <button
                type="button"
                onClick={() => setConfirmDeletePincode(null)}
                className="flex-1 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-[#141414] font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeletePincode(confirmDeletePincode)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Remove</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
