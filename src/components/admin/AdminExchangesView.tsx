import React, { useState } from 'react';
import { INITIAL_EXCHANGES } from '../../data/adminData';
import { ExchangeRequest } from '../../types';
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  Truck,
  Eye,
  AlertCircle,
  Clock,
  Plus,
  Edit2,
  Trash2,
  X
} from 'lucide-react';

interface AdminExchangesViewProps {
  exchanges?: ExchangeRequest[];
  onAddExchange?: (req: ExchangeRequest) => void;
  onEditExchange?: (req: ExchangeRequest) => void;
  onDeleteExchange?: (id: string) => void;
  onTriggerToast: (msg: string) => void;
}

export const AdminExchangesView: React.FC<AdminExchangesViewProps> = ({
  exchanges: propExchanges,
  onAddExchange,
  onEditExchange,
  onDeleteExchange,
  onTriggerToast
}) => {
  const [exchanges, setExchanges] = useState<ExchangeRequest[]>(propExchanges || INITIAL_EXCHANGES);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  React.useEffect(() => {
    if (propExchanges) {
      setExchanges(propExchanges);
    }
  }, [propExchanges]);
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExchange, setEditingExchange] = useState<ExchangeRequest | null>(null);
  const [exchangeToDelete, setExchangeToDelete] = useState<ExchangeRequest | null>(null);

  // Form State
  const [orderId, setOrderId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [productName, setProductName] = useState('');
  const [reason, setReason] = useState<ExchangeRequest['reason']>('Ring Size Mismatch');
  const [requestedExchangeItem, setRequestedExchangeItem] = useState('');
  const [status, setStatus] = useState<ExchangeRequest['status']>('Pending Review');

  const openCreateModal = () => {
    setEditingExchange(null);
    setOrderId('PARZIO-10842');
    setCustomerName('');
    setPhone('+91 ');
    setProductName('Byzantine Ring');
    setReason('Ring Size Mismatch');
    setRequestedExchangeItem('Size 18 Replacement');
    setStatus('Pending Review');
    setIsModalOpen(true);
  };

  const openEditModal = (req: ExchangeRequest) => {
    setEditingExchange(req);
    setOrderId(req.orderId);
    setCustomerName(req.customerName);
    setPhone(req.phone);
    setProductName(req.productName);
    setReason(req.reason);
    setRequestedExchangeItem(req.requestedExchangeItem);
    setStatus(req.status);
    setIsModalOpen(true);
  };

  const handleApprove = (id: string) => {
    const target = exchanges.find((e) => e.id === id);
    if (target) {
      const updated = { ...target, status: 'Approved & Pickup Scheduled' as const };
      if (onEditExchange) onEditExchange(updated);
    }
    setExchanges((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status: 'Approved & Pickup Scheduled' } : e
      )
    );
    onTriggerToast(`Reverse Pickup approved (YES) for Ticket #${id}! Courier dispatched.`);
  };

  const handleReject = (id: string) => {
    const target = exchanges.find((e) => e.id === id);
    if (target) {
      const updated = { ...target, status: 'Rejected' as const };
      if (onEditExchange) onEditExchange(updated);
    }
    setExchanges((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status: 'Rejected' } : e
      )
    );
    onTriggerToast(`Return request rejected (NO) for Ticket #${id}.`);
  };

  const handleDispatchReplacement = (id: string) => {
    const target = exchanges.find((e) => e.id === id);
    if (target) {
      const updated = { ...target, status: 'Replacement Dispatched' as const };
      if (onEditExchange) onEditExchange(updated);
    }
    setExchanges((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status: 'Replacement Dispatched' } : e
      )
    );
    onTriggerToast(`Replacement dispatched (YES) for Exchange #${id}.`);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;

    if (editingExchange) {
      const updatedReq: ExchangeRequest = {
        ...editingExchange,
        orderId,
        customerName: customerName.trim(),
        phone: phone.trim(),
        productName: productName.trim(),
        reason,
        requestedExchangeItem: requestedExchangeItem.trim(),
        status
      };
      if (onEditExchange) onEditExchange(updatedReq);
      setExchanges((prev) =>
        prev.map((e) => (e.id === editingExchange.id ? updatedReq : e))
      );
      onTriggerToast(`Exchange ticket #${editingExchange.id} updated.`);
    } else {
      const newReq: ExchangeRequest = {
        id: `EXC-${Math.floor(100 + Math.random() * 900)}`,
        orderId: orderId.trim(),
        customerName: customerName.trim(),
        phone: phone.trim(),
        productName: productName.trim(),
        reason,
        requestedExchangeItem: requestedExchangeItem.trim(),
        status,
        date: new Date().toISOString().slice(0, 10),
        evidencePhoto: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80'
      };
      if (onAddExchange) onAddExchange(newReq);
      setExchanges([newReq, ...exchanges]);
      onTriggerToast(`Created Exchange Request #${newReq.id}!`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (onDeleteExchange) onDeleteExchange(id);
    setExchanges((prev) => prev.filter((e) => e.id !== id));
    onTriggerToast('Exchange ticket deleted.');
    setExchangeToDelete(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 border border-[#eae5dc] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-base font-bold text-[#141414] flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-[#8c7138]" />
            Customer Exchanges &amp; Quality Returns ({exchanges.length} Tickets)
          </h3>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#141414] text-white hover:bg-[#8c7138] text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-[#fed488]" />
            <span>Create Return Ticket</span>
          </button>
        </div>
      </div>

      {/* Exchanges List */}
      <div className="bg-white rounded-3xl border border-[#eae5dc] shadow-sm overflow-hidden">
        {exchanges.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#faf8f5] border border-[#eae5dc] flex items-center justify-center text-[#8c7138] shadow-inner">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h4 className="font-display text-base font-bold text-[#141414]">No Return / Exchange Tickets</h4>
              <p className="text-xs text-[#747878] leading-relaxed">
                When customers report sizing mismatches or damage claims, return pickup requests will appear here.
              </p>
            </div>
            <button
              onClick={openCreateModal}
              className="mt-2 flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#141414] text-[#fed488] hover:bg-[#8c7138] hover:text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Return Ticket</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#eae5dc]">
            {exchanges.map((req) => {
              const isPending = req.status === 'Pending Review';
              const isApproved = req.status === 'Approved & Pickup Scheduled';
              const isDispatched = req.status === 'Replacement Dispatched';

              return (
                <div key={req.id} className="p-5 space-y-4 hover:bg-[#faf8f5] transition-colors">
                  
                  {/* Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-[#141414]">
                        #{req.id}
                      </span>
                      <span className="text-[#747878]">•</span>
                      <span className="font-mono text-xs text-[#8c7138]">
                        Ref: {req.orderId}
                      </span>
                      <span className="text-[#747878]">•</span>
                      <span className="font-semibold text-xs text-[#141414]">
                        {req.customerName} ({req.phone})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isPending
                            ? 'bg-amber-100 text-amber-800'
                            : isApproved
                            ? 'bg-blue-100 text-blue-800'
                            : req.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {req.status}
                      </span>

                      <button
                        onClick={() => openEditModal(req)}
                        title="Edit Ticket"
                        className="p-1 rounded-full hover:bg-[#eae5dc] text-[#141414]"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setExchangeToDelete(req)}
                        title="Delete Ticket"
                        className="p-1 rounded-full hover:bg-rose-100 text-rose-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <p className="font-display font-medium text-sm text-[#141414]">
                        Item: {req.productName}
                      </p>
                      <p className="text-[#747878]">
                        Reason: <span className="font-semibold text-[#141414]">{req.reason}</span>
                      </p>
                      <p className="text-[#8c7138] font-semibold">
                        Requested Replacement: {req.requestedExchangeItem}
                      </p>
                    </div>

                    {/* Proof & Action: Yes / No Decision Box */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      {req.evidencePhoto && (
                        <button
                          onClick={() => setSelectedPhoto(req.evidencePhoto || null)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#faf8f5] hover:bg-[#eae5dc] border border-[#eae5dc] text-xs font-semibold text-[#141414] transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#8c7138]" />
                          <span>View Proof</span>
                        </button>
                      )}

                      {/* Reverse Pickup Decision (YES / NO) */}
                      {isPending && (
                        <div className="flex items-center gap-1.5 bg-[#faf8f5] p-1 rounded-full border border-[#eae5dc]">
                          <span className="text-[10px] uppercase font-bold text-[#747878] px-2">Reverse Pickup?</span>
                          
                          {/* YES Button */}
                          <button
                            onClick={() => handleApprove(req.id)}
                            title="Approve reverse courier pickup"
                            className="px-3 py-1 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Yes (Approve)</span>
                          </button>

                          {/* NO Button */}
                          <button
                            onClick={() => handleReject(req.id)}
                            title="Reject return request"
                            className="px-3 py-1 rounded-full bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                          >
                            <XCircle className="w-3 h-3" />
                            <span>No (Reject)</span>
                          </button>
                        </div>
                      )}

                      {/* Approved & Waiting for replacement dispatch */}
                      {isApproved && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDispatchReplacement(req.id)}
                            className="px-4 py-1.5 rounded-full bg-[#141414] hover:bg-[#8c7138] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                          >
                            <Truck className="w-3.5 h-3.5 text-[#fed488]" />
                            <span>Dispatch Replacement (Yes)</span>
                          </button>

                          <button
                            onClick={() => handleReject(req.id)}
                            className="px-3 py-1.5 rounded-full border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-all cursor-pointer"
                          >
                            Cancel Pickup (No)
                          </button>
                        </div>
                      )}

                      {req.status === 'Rejected' && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                            ✕ Pickup Disallowed (NO)
                          </span>
                          <button
                            onClick={() => handleApprove(req.id)}
                            className="text-[11px] font-bold text-[#8c7138] underline hover:text-[#141414] cursor-pointer"
                          >
                            Re-approve (Yes)
                          </button>
                        </div>
                      )}

                      {req.status === 'Replacement Dispatched' && (
                        <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Replacement Completed
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Photo Preview Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-4 max-w-md w-full border border-[#eae5dc] shadow-2xl space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-[#eae5dc]">
              <h4 className="font-bold text-sm text-[#141414]">Customer Uploaded Image Proof</h4>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-1 rounded-full hover:bg-[#eae5dc]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden bg-black/5 aspect-square flex items-center justify-center">
              <img src={selectedPhoto} alt="Proof" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#eae5dc] shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-[#eae5dc]">
              <h4 className="font-bold text-sm text-[#141414]">
                {editingExchange ? `Edit Ticket #${editingExchange.id}` : 'Create Exchange Ticket'}
              </h4>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full hover:bg-[#eae5dc]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
                  Reference Order ID
                </label>
                <input
                  type="text"
                  required
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 font-mono font-bold text-[#141414]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 text-[#141414]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
                    Mobile / WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 font-mono text-[#141414]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 text-[#141414]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
                    Reason
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value as ExchangeRequest['reason'])}
                    className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 text-[#141414]"
                  >
                    <option value="Ring Size Mismatch">Ring Size Mismatch</option>
                    <option value="Defective Clasp">Defective Clasp</option>
                    <option value="Style Exchange">Style Exchange</option>
                    <option value="Transit Damage">Transit Damage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ExchangeRequest['status'])}
                    className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 font-bold text-[#141414]"
                  >
                    <option value="Pending Review">Pending Review</option>
                    <option value="Approved & Pickup Scheduled">Approved &amp; Scheduled</option>
                    <option value="Replacement Dispatched">Replacement Dispatched</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#747878] mb-1">
                  Requested Replacement
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Byzantine Ring Size 18"
                  value={requestedExchangeItem}
                  onChange={(e) => setRequestedExchangeItem(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-xl px-3 py-2 text-[#141414]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#eae5dc]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-1.5 rounded-full border border-[#eae5dc] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-full bg-[#141414] hover:bg-[#8c7138] text-white text-xs font-bold"
                >
                  Save Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {exchangeToDelete && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#eae5dc] shadow-2xl space-y-4 animate-fadeIn">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h4 className="font-bold text-base text-[#141414]">Delete Ticket #{exchangeToDelete.id}?</h4>
              <p className="text-xs text-[#747878] mt-1">
                Are you sure you want to delete this exchange ticket for {exchangeToDelete.customerName}?
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setExchangeToDelete(null)}
                className="px-4 py-2 rounded-full border border-[#eae5dc] text-xs font-semibold hover:bg-[#faf8f5]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(exchangeToDelete.id)}
                className="px-5 py-2 rounded-full bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold"
              >
                Delete Ticket
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
