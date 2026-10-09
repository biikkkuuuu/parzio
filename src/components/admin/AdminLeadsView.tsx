import React, { useState, useMemo } from 'react';
import {
  Phone,
  MessageCircle,
  Send,
  CheckCircle2,
  Clock,
  ShoppingBag,
  Sparkles,
  Trash2,
  Search,
  Filter,
  Gift,
  ExternalLink,
  Copy,
  Check,
  Flame,
  User,
  MapPin,
  IndianRupee,
  AlertCircle,
  X,
  ChevronDown,
  RefreshCw,
  Eye
} from 'lucide-react';
import { AbandonedLead } from '../../types';
import { smsService } from '../../services/smsService';
import { dbService } from '../../services/dbService';

interface AdminLeadsViewProps {
  leads: AbandonedLead[];
  onRefresh?: () => void;
}

const TEMPLATES = [
  {
    id: 'vip-discount',
    title: 'VIP 15% Privileged Discount (LUXE15)',
    category: 'Discount',
    badge: 'High Conversion',
    text: (name: string) =>
      `Hello ${name || 'there'}! ✨ Your handpicked pieces at PARZIO Jewellery have been held in your private tray. As a VIP welcome privilege, use exclusive code LUXE15 for an instant 15% OFF + Free BlueDart Air Express delivery today. Explore & complete your collection here: https://parzio.in`
  },
  {
    id: 'limited-stock',
    title: 'Artisan Vault Reservation (Stock Alert)',
    category: 'Urgency',
    badge: 'Low Stock',
    text: (name: string) =>
      `Hi ${name || 'there'}! 💎 Our PARZIO atelier team has reserved your selected PARZIO anti-tarnish waterproof pieces for the next 4 hours before vault restocking. Would you like us to priority-dispatch your order with our signature complimentary velvet travel pouch?`
  },
  {
    id: 'free-warranty',
    title: 'Free Lifetime Anti-Tarnish Assurance Card',
    category: 'Value Add',
    badge: 'Popular',
    text: (name: string) =>
      `Hello ${name || 'there'}! ✨ For your chosen PARZIO pieces, we are upgrading your order with our complimentary 1-Year Anti-Tarnish Guarantee Card & Jewellery Care Polishing Cloth at zero cost if dispatched today. Let us know if you would like your order prepared!`
  },
  {
    id: 'stylist-concierge',
    title: 'Atelier Stylist & Sizing Concierge',
    category: 'Support',
    badge: 'Personal Touch',
    text: (name: string) =>
      `Hi ${name || 'there'}, this is Rhea from the PARZIO Jewellery Atelier. 🌸 I noticed you were curating our waterproof luxury collection. Can I assist you with custom ring sizing, chain length layering, or luxury gift packaging?`
  }
];

export const AdminLeadsView: React.FC<AdminLeadsViewProps> = ({ leads = [], onRefresh }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'contacted' | 'converted' | 'dismissed'>('all');
  const [selectedLead, setSelectedLead] = useState<AbandonedLead | null>(null);
  
  // Messaging Modal State
  const [messageModalLead, setMessageModalLead] = useState<AbandonedLead | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('vip-discount');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        if (statusFilter !== 'all' && lead.status !== statusFilter) return false;
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        const phone = lead.phone || '';
        const name = lead.customerName || '';
        const city = lead.address?.city || '';
        const pincode = lead.address?.pincode || '';
        const itemNames = lead.items.map((i) => i.productName).join(' ').toLowerCase();
        return (
          phone.includes(q) ||
          name.toLowerCase().includes(q) ||
          city.toLowerCase().includes(q) ||
          pincode.includes(q) ||
          itemNames.includes(q)
        );
      })
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }, [leads, statusFilter, searchQuery]);

  // Lead Statistics
  const stats = useMemo(() => {
    const total = leads.length;
    const pending = leads.filter((l) => l.status === 'pending').length;
    const contacted = leads.filter((l) => l.status === 'contacted').length;
    const converted = leads.filter((l) => l.status === 'converted').length;
    const potentialRev = leads
      .filter((l) => l.status === 'pending' || l.status === 'contacted')
      .reduce((sum, l) => sum + (l.totalAmount || 0), 0);
    const recoveredRev = leads
      .filter((l) => l.status === 'converted')
      .reduce((sum, l) => sum + (l.totalAmount || 0), 0);

    return { total, pending, contacted, converted, potentialRev, recoveredRev };
  }, [leads]);

  // Open Message Modal for a Lead
  const handleOpenMessageModal = (lead: AbandonedLead) => {
    setMessageModalLead(lead);
    const initialTpl = TEMPLATES[0];
    setSelectedTemplateId(initialTpl.id);
    setCustomMessage(initialTpl.text(lead.customerName));
    setActionSuccessMsg(null);
    setCopiedText(false);
  };

  // Switch Template in Modal
  const handleSelectTemplate = (tplId: string) => {
    setSelectedTemplateId(tplId);
    if (!messageModalLead) return;
    const tpl = TEMPLATES.find((t) => t.id === tplId);
    if (tpl) {
      setCustomMessage(tpl.text(messageModalLead.customerName));
    }
  };

  // Launch WhatsApp Web / App
  const handleSendWhatsApp = async () => {
    if (!messageModalLead) return;
    const cleanPhone = messageModalLead.phone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      alert('Invalid phone number on this lead');
      return;
    }

    const encoded = encodeURIComponent(customMessage);
    const waUrl = `https://api.whatsapp.com/send?phone=91${cleanPhone}&text=${encoded}`;
    window.open(waUrl, '_blank');

    // Auto-update lead status to contacted
    if (messageModalLead.status === 'pending') {
      await dbService.updateAbandonedLeadStatus(messageModalLead.id, 'contacted', 'Contacted via WhatsApp');
      if (onRefresh) onRefresh();
    }
    setActionSuccessMsg('WhatsApp opened! Lead marked as Contacted.');
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  // Direct Fast2SMS Dispatch
  const handleSendFast2Sms = async () => {
    if (!messageModalLead) return;
    const cleanPhone = messageModalLead.phone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      alert('Invalid phone number for Fast2SMS');
      return;
    }

    setIsSendingSms(true);
    setActionSuccessMsg(null);

    const res = await smsService.sendCustomSms(cleanPhone, customMessage);
    setIsSendingSms(false);

    if (res.success) {
      if (messageModalLead.status === 'pending') {
        await dbService.updateAbandonedLeadStatus(messageModalLead.id, 'contacted', 'Contacted via Fast2SMS');
        if (onRefresh) onRefresh();
      }
      setActionSuccessMsg('SMS successfully delivered via Fast2SMS gateway!');
      setTimeout(() => {
        setActionSuccessMsg(null);
        setMessageModalLead(null);
      }, 2000);
    } else {
      alert(`SMS Sending Notice: ${res.error || 'Failed to dispatch SMS. Please try WhatsApp.'}`);
    }
  };

  // Copy Message to Clipboard
  const handleCopyMessage = () => {
    navigator.clipboard.writeText(customMessage);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Update Status directly
  const handleStatusChange = async (leadId: string, newStatus: AbandonedLead['status']) => {
    await dbService.updateAbandonedLeadStatus(leadId, newStatus);
    if (onRefresh) onRefresh();
  };

  // Delete Lead
  const handleDeleteLead = async (leadId: string) => {
    if (confirm('Are you sure you want to remove this lead record?')) {
      await dbService.deleteAbandonedLead(leadId);
      if (selectedLead?.id === leadId) setSelectedLead(null);
      if (onRefresh) onRefresh();
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Workspace Controls */}
      <div className="bg-white rounded-3xl p-5 border border-[#eae5dc] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#faf6ef] border border-[#ebd7be] flex items-center justify-center text-[#8c7138] shrink-0 shadow-2xs">
            <Flame className="w-5 h-5 text-[#8c7138]" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-[#141414] flex items-center gap-2">
              Abandoned Checkout Leads ({filteredLeads.length} Leads)
            </h3>
            <p className="text-xs text-[#747878] mt-0.5">
              High-intent visitors who entered details or selected address at checkout but dropped off before completing payment.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#faf8f5] hover:bg-[#eae5dc] border border-[#eae5dc] text-xs font-bold text-[#141414] transition-colors cursor-pointer active:scale-95 shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#8c7138]" />
              <span>Refresh Queue</span>
            </button>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Total Drop-offs</span>
            <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-serif text-neutral-900 mt-2">{stats.total}</p>
          <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
            Captured from checkout
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200/80 bg-amber-50/20 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Pending Action</span>
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-serif text-amber-900 mt-2">{stats.pending}</p>
          <p className="text-xs text-amber-700/80 mt-1">Ready for re-engagement</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-blue-200/80 bg-blue-50/20 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Recoverable Value</span>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-serif text-blue-900 mt-2">
            ₹{stats.potentialRev.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-blue-700/80 mt-1">Active basket value</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 bg-emerald-50/20 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Converted</span>
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-serif text-emerald-900 mt-2">{stats.converted}</p>
          <p className="text-xs text-emerald-700 mt-1">₹{stats.recoveredRev.toLocaleString('en-IN')} recovered</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by name, phone, city, or product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all placeholder:text-neutral-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto p-1 bg-neutral-100 rounded-xl">
          {(['all', 'pending', 'contacted', 'converted', 'dismissed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all whitespace-nowrap ${
                statusFilter === tab
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {tab === 'all' ? 'All Leads' : tab}
              {tab === 'pending' && stats.pending > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px]">
                  {stats.pending}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table / Cards */}
      {filteredLeads.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-neutral-300 p-12 text-center">
          <div className="w-14 h-14 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3 text-neutral-400">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-medium text-neutral-800">No Abandoned Leads Found</h3>
          <p className="text-sm text-neutral-500 max-w-md mx-auto mt-1">
            {searchQuery
              ? `No results matching "${searchQuery}". Try clearing search.`
              : `When visitors add items to cart, enter their address, and reach checkout without finalizing, they will automatically appear here.`}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/60 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Customer Details</th>
                  <th className="py-3.5 px-4">Drop-off Cart</th>
                  <th className="py-3.5 px-4">Cart Total</th>
                  <th className="py-3.5 px-4">Recorded At</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Quick Dispatch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-sm">
                {filteredLeads.map((lead) => {
                  const cleanPhone = lead.phone.replace(/\D/g, '').slice(-10);

                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-neutral-50/70 transition-colors group cursor-pointer"
                      onClick={() => setSelectedLead(lead)}
                    >
                      {/* Customer Info */}
                      <td className="py-4 px-4">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-full bg-neutral-900 text-amber-300 font-serif font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
                            {lead.customerName ? lead.customerName.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <p className="font-semibold text-neutral-900 flex items-center gap-1.5">
                              {lead.customerName || 'Guest User'}
                              {lead.phone && (
                                <span className="font-mono text-xs font-normal text-neutral-500">
                                  (+91 {cleanPhone})
                                </span>
                              )}
                            </p>
                            {lead.address && (
                              <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5 line-clamp-1">
                                <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                                {lead.address.city}, {lead.address.state} ({lead.address.pincode})
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Items */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2 overflow-hidden shrink-0">
                            {lead.items.slice(0, 3).map((item, idx) => (
                              <img
                                key={idx}
                                src={item.image || 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=100&q=80'}
                                alt={item.productName}
                                className="w-8 h-8 rounded-lg object-cover border-2 border-white shadow-sm"
                              />
                            ))}
                          </div>
                          <div className="text-xs">
                            <p className="font-medium text-neutral-800 line-clamp-1">
                              {lead.items[0]?.productName || 'Jewellery Item'}
                            </p>
                            {lead.items.length > 1 && (
                              <p className="text-neutral-400">+{lead.items.length - 1} other item(s)</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Total Amount */}
                      <td className="py-4 px-4">
                        <span className="font-serif font-semibold text-neutral-900 text-base">
                          ₹{lead.totalAmount.toLocaleString('en-IN')}
                        </span>
                      </td>

                      {/* Time */}
                      <td className="py-4 px-4 text-xs text-neutral-500">
                        <p>{new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                        <p className="text-neutral-400">
                          {new Date(lead.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value as AbandonedLead['status'])}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer outline-none transition-all ${
                            lead.status === 'pending'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : lead.status === 'contacted'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : lead.status === 'converted'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="contacted">Contacted</option>
                          <option value="converted">Converted</option>
                          <option value="dismissed">Dismissed</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenMessageModal(lead)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
                            title="Send WhatsApp or Fast2SMS"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-white/20" />
                            Recover
                          </button>
                          <button
                            onClick={() => handleDeleteLead(lead.id)}
                            className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Message Recovery Modal */}
      {messageModalLead && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Luxury Re-Engagement
                  </span>
                  <span className="text-xs text-neutral-400">Non-intrusive recovery</span>
                </div>
                <h3 className="text-xl font-serif text-white mt-1">
                  Send Recovery Message to {messageModalLead.customerName || 'Customer'}
                </h3>
                <p className="text-xs text-neutral-300 mt-0.5">
                  Mobile: +91 {messageModalLead.phone.replace(/\D/g, '').slice(-10)} • Cart: ₹{messageModalLead.totalAmount.toLocaleString('en-IN')}
                </p>
              </div>
              <button
                onClick={() => setMessageModalLead(null)}
                className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {/* Template Selector Cards */}
              <div>
                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-2">
                  Select High-Converting Message Angle:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => handleSelectTemplate(tpl.id)}
                      className={`text-left p-3 rounded-2xl border transition-all flex flex-col justify-between ${
                        selectedTemplateId === tpl.id
                          ? 'border-neutral-900 bg-neutral-900 text-white shadow-md'
                          : 'border-neutral-200 bg-neutral-50 hover:bg-white text-neutral-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            selectedTemplateId === tpl.id
                              ? 'bg-amber-400 text-neutral-900'
                              : 'bg-neutral-200 text-neutral-700'
                          }`}
                        >
                          {tpl.badge}
                        </span>
                        {selectedTemplateId === tpl.id && <Check className="w-3.5 h-3.5 text-amber-300" />}
                      </div>
                      <p className="text-xs font-semibold">{tpl.title}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Preview / Editor */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Customized Message Content:
                  </label>
                  <button
                    onClick={handleCopyMessage}
                    className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1 transition-colors"
                  >
                    {copiedText ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    {copiedText ? 'Copied!' : 'Copy Text'}
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full p-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm font-sans text-neutral-900 focus:bg-white focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 outline-none leading-relaxed resize-none transition-all"
                  placeholder="Type message here..."
                />
                <p className="text-[11px] text-neutral-400 mt-1">
                  💡 <em>Never mention "Payment Failed" or "Unfinished Checkout"</em>. Always emphasize VIP privileges, artisan holds, or free styling assistance.
                </p>
              </div>

              {/* Notification Banner */}
              {actionSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  {actionSuccessMsg}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-5 bg-neutral-50 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setMessageModalLead(null)}
                className="w-full sm:w-auto px-4 py-2.5 text-neutral-600 hover:text-neutral-900 text-sm font-medium transition-colors"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                {/* Fast2SMS Instant Dispatch */}
                <button
                  type="button"
                  disabled={isSendingSms}
                  onClick={handleSendFast2Sms}
                  className="flex-1 sm:flex-initial px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
                >
                  {isSendingSms ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5 text-amber-300" />
                  )}
                  Send Fast2SMS
                </button>

                {/* WhatsApp Web / App Dispatch */}
                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  className="flex-1 sm:flex-initial px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-white/20" />
                  Open in WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lead Detail Slide-over / Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div>
                <span className="text-[11px] font-mono uppercase text-neutral-500">Drop-off Reference</span>
                <h3 className="text-lg font-serif font-semibold text-neutral-900">{selectedLead.id}</h3>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1.5 text-neutral-400 hover:text-neutral-800 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 flex-1 text-sm">
              {/* Customer */}
              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 space-y-2">
                <p className="text-xs font-semibold uppercase text-neutral-500">Customer Information</p>
                <div className="flex items-center gap-2 text-neutral-900 font-semibold">
                  <User className="w-4 h-4 text-neutral-500" />
                  {selectedLead.customerName || 'Anonymous Guest'}
                </div>
                <div className="flex items-center gap-2 text-neutral-700">
                  <Phone className="w-4 h-4 text-neutral-500" />
                  +91 {selectedLead.phone.replace(/\D/g, '').slice(-10)}
                </div>
                {selectedLead.address && (
                  <div className="flex items-start gap-2 text-neutral-600 text-xs mt-1">
                    <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                    <span>
                      {selectedLead.address.street}, {selectedLead.address.city}, {selectedLead.address.state} - {selectedLead.address.pincode}
                    </span>
                  </div>
                )}
              </div>

              {/* Items in Cart */}
              <div>
                <p className="text-xs font-semibold uppercase text-neutral-500 mb-2.5">
                  Items Left in Cart ({selectedLead.items.length})
                </p>
                <div className="space-y-2">
                  {selectedLead.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-xl border border-neutral-100 bg-white hover:bg-neutral-50/50"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image || 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=100&q=80'}
                          alt={item.productName}
                          className="w-10 h-10 rounded-lg object-cover border border-neutral-200"
                        />
                        <div>
                          <p className="font-medium text-neutral-900 text-xs">{item.productName}</p>
                          <p className="text-[11px] text-neutral-400">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-serif font-semibold text-neutral-800 text-xs">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-neutral-200 flex justify-between items-center text-sm font-semibold">
                  <span>Cart Total</span>
                  <span className="font-serif text-base text-neutral-900">
                    ₹{selectedLead.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  const leadToMsg = selectedLead;
                  setSelectedLead(null);
                  handleOpenMessageModal(leadToMsg);
                }}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                Open WhatsApp / Fast2SMS Recovery
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
