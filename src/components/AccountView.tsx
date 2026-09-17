import React, { useState, useEffect } from 'react';
import {
  User,
  Phone,
  MapPin,
  Package,
  Heart,
  Tag,
  Headphones,
  LogOut,
  Bell,
  FileText,
  ShieldCheck,
  Check,
  X,
  Edit2,
  Globe,
  Plus,
  Trash2,
  ChevronRight,
  LayoutDashboard
} from 'lucide-react';
import { OrderItem } from '../types';

interface AccountViewProps {
  orders: OrderItem[];
  onOpenWishlist: () => void;
  onOpenAtelierOps: () => void;
  onTrackOrder: () => void;
}

interface AddressItem {
  id: string;
  name: string;
  type: 'HOME' | 'WORK' | 'OTHER';
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

const DEFAULT_ADDRESSES: AddressItem[] = [
  {
    id: 'addr-1',
    name: 'Pooja Sharma',
    type: 'HOME',
    phone: '+91 98765 43210',
    address: 'Flat 402, Lotus Towers, Andheri West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400053',
    isDefault: true
  },
  {
    id: 'addr-2',
    name: 'Pooja Sharma',
    type: 'WORK',
    phone: '+91 98765 43210',
    address: 'Mindspace IT Park, Building 4, Malad West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400064',
    isDefault: false
  }
];

export const AccountView: React.FC<AccountViewProps> = ({
  orders,
  onOpenWishlist,
  onOpenAtelierOps,
  onTrackOrder
}) => {
  const [activeModal, setActiveModal] = useState<
    'profile' | 'coupons' | 'address' | 'help' | 'privacy' | null
  >(null);

  const [userName, setUserName] = useState('Pooja Sharma');
  const [userPhone, setUserPhone] = useState('+91 98765 43210');
  const [userEmail, setUserEmail] = useState('pooja.sharma@parzio.in');
  const [showLogoutToast, setShowLogoutToast] = useState(false);

  // Addresses State with LocalStorage Persistence
  const [addresses, setAddresses] = useState<AddressItem[]>(() => {
    try {
      const saved = localStorage.getItem('parzio_saved_addresses');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_ADDRESSES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('parzio_saved_addresses', JSON.stringify(addresses));
    } catch {}
  }, [addresses]);

  // Add Address Form State
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddrName, setNewAddrName] = useState('');
  const [newAddrPhone, setNewAddrPhone] = useState('');
  const [newAddrPincode, setNewAddrPincode] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('');
  const [newAddrState, setNewAddrState] = useState('');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrType, setNewAddrType] = useState<'HOME' | 'WORK' | 'OTHER'>('HOME');
  const [newAddrIsDefault, setNewAddrIsDefault] = useState(false);

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrName.trim() || !newAddrStreet.trim() || !newAddrPhone.trim()) return;

    const newAddress: AddressItem = {
      id: `addr-${Date.now()}`,
      name: newAddrName.trim(),
      phone: newAddrPhone.trim(),
      pincode: newAddrPincode.trim() || '400001',
      city: newAddrCity.trim() || 'Mumbai',
      state: newAddrState.trim() || 'Maharashtra',
      address: newAddrStreet.trim(),
      type: newAddrType,
      isDefault: newAddrIsDefault || addresses.length === 0
    };

    setAddresses((prev) => {
      const updated = newAddress.isDefault
        ? prev.map((a) => ({ ...a, isDefault: false }))
        : [...prev];
      return [newAddress, ...updated];
    });

    // Reset Form
    setNewAddrName('');
    setNewAddrPhone('');
    setNewAddrPincode('');
    setNewAddrCity('');
    setNewAddrState('');
    setNewAddrStreet('');
    setNewAddrType('HOME');
    setNewAddrIsDefault(false);
    setIsAddingAddress(false);
  };

  const handleSetDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id
      }))
    );
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleLogout = () => {
    setShowLogoutToast(true);
    setTimeout(() => setShowLogoutToast(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#f1f2f4] pb-28 font-sans">
      <div className="max-w-2xl lg:max-w-3xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6 space-y-3.5">

        {/* PC Desktop Top Navigation Bar */}
        <div className="hidden sm:flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#141414]">My Account</h1>
            <span className="text-[#8c7138] font-light">—</span>
            <span className="text-xs text-[#717478]">Manage your profile, orders &amp; addresses</span>
          </div>
          <button
            onClick={() => {
              window.location.hash = '#/';
            }}
            className="text-xs font-semibold text-[#8c7138] hover:text-[#705220] transition-colors cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#e4e6eb] shadow-2xs hover:border-[#8c7138]"
          >
            ← Back to Store
          </button>
        </div>

        {/* 1. Flipkart-Grade Profile Header Card */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e4e6eb] shadow-2xs">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#8c7138] to-[#d4af37] text-white flex items-center justify-center font-bold text-lg shadow-xs">
                  {userName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-base sm:text-lg font-bold text-[#141414] leading-tight">
                    {userName}
                  </h2>
                </div>
                <p className="text-xs text-[#717478] mt-0.5">{userPhone}</p>
                <p className="text-[11px] text-[#717478] break-all">{userEmail}</p>
              </div>
            </div>

            <button
              onClick={() => setActiveModal('profile')}
              className="p-2 rounded-full hover:bg-neutral-100 text-[#717478] hover:text-[#141414] transition-colors cursor-pointer"
              title="Edit Profile"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Top 4 Core Quick Action Tiles (2x2 on Mobile, 4x1 on PC Desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Orders */}
          <button
            onClick={onTrackOrder}
            className="p-3 rounded-xl bg-white border border-[#e4e6eb] shadow-2xs text-left hover:border-[#8c7138] transition-all cursor-pointer flex items-center gap-2.5"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Package className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-[#141414] leading-tight">Orders</h3>
              <p className="text-[10px] text-[#717478] mt-0.5 whitespace-nowrap">
                {orders.length > 0 ? `${orders.length} Orders` : 'Track Orders'}
              </p>
            </div>
          </button>

          {/* Wishlist */}
          <button
            onClick={onOpenWishlist}
            className="p-3 rounded-xl bg-white border border-[#e4e6eb] shadow-2xs text-left hover:border-[#8c7138] transition-all cursor-pointer flex items-center gap-2.5"
          >
            <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
              <Heart className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-[#141414] leading-tight">Wishlist</h3>
              <p className="text-[10px] text-[#717478] mt-0.5 whitespace-nowrap">Saved Items</p>
            </div>
          </button>

          {/* Coupons */}
          <button
            onClick={() => setActiveModal('coupons')}
            className="p-3 rounded-xl bg-white border border-[#e4e6eb] shadow-2xs text-left hover:border-[#8c7138] transition-all cursor-pointer flex items-center gap-2.5"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Tag className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-[#141414] leading-tight">Coupons</h3>
              <p className="text-[10px] text-[#717478] mt-0.5 whitespace-nowrap">View Offers</p>
            </div>
          </button>

          {/* Help Center */}
          <button
            onClick={() => setActiveModal('help')}
            className="p-3 rounded-xl bg-white border border-[#e4e6eb] shadow-2xs text-left hover:border-[#8c7138] transition-all cursor-pointer flex items-center gap-2.5"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Headphones className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-[#141414] leading-tight">Help Center</h3>
              <p className="text-[10px] text-[#717478] mt-0.5 whitespace-nowrap">24×7 Support</p>
            </div>
          </button>
        </div>

        {/* 3. Account Settings (Flipkart List Menu) */}
        <div className="bg-white rounded-2xl p-4 border border-[#e4e6eb] shadow-2xs space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#717478] px-1">
            Account Settings
          </h3>

          <div className="divide-y divide-[#f0f1f3]">
            {/* Saved Addresses */}
            <div
              onClick={() => setActiveModal('address')}
              className="py-2.5 flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#8c7138]" />
                <div>
                  <h4 className="text-xs font-semibold text-[#141414] group-hover:text-[#8c7138] transition-colors">
                    Saved Delivery Addresses
                  </h4>
                  <p className="text-[10px] text-[#717478]">{addresses.length} addresses saved</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#a0a3a8] group-hover:text-[#8c7138]" />
            </div>

            {/* Edit Profile */}
            <div
              onClick={() => setActiveModal('profile')}
              className="py-2.5 flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-[#8c7138]" />
                <div>
                  <h4 className="text-xs font-semibold text-[#141414] group-hover:text-[#8c7138] transition-colors">
                    Personal Information
                  </h4>
                  <p className="text-[10px] text-[#717478]">Name, Phone number &amp; Email</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#a0a3a8] group-hover:text-[#8c7138]" />
            </div>

            {/* Notification Preferences */}
            <div className="py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-[#8c7138]" />
                <div>
                  <h4 className="text-xs font-semibold text-[#141414]">Order WhatsApp Alerts</h4>
                  <p className="text-[10px] text-[#717478]">Instant tracking updates via WhatsApp</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Enabled</span>
            </div>

            {/* Language */}
            <div className="py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-[#8c7138]" />
                <div>
                  <h4 className="text-xs font-semibold text-[#141414]">Language Selection</h4>
                  <p className="text-[10px] text-[#717478]">English &amp; Hinglish</p>
                </div>
              </div>
              <span className="text-[10px] text-[#717478] font-medium">Default</span>
            </div>
          </div>
        </div>

        {/* 4. Feedback & Legal Information */}
        <div className="bg-white rounded-2xl p-4 border border-[#e4e6eb] shadow-2xs space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#717478] px-1">
            Feedback &amp; Policies
          </h3>

          <div className="divide-y divide-[#f0f1f3]">
            <div
              onClick={() => setActiveModal('privacy')}
              className="py-2.5 flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-[#8c7138]" />
                <h4 className="text-xs font-semibold text-[#141414] group-hover:text-[#8c7138] transition-colors">
                  Privacy Policy &amp; Terms of Service
                </h4>
              </div>
              <ChevronRight className="w-4 h-4 text-[#a0a3a8] group-hover:text-[#8c7138]" />
            </div>

            <div
              onClick={() => setActiveModal('help')}
              className="py-2.5 flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-[#8c7138]" />
                <h4 className="text-xs font-semibold text-[#141414] group-hover:text-[#8c7138] transition-colors">
                  316L Anti-Tarnish Lifetime Warranty Policy
                </h4>
              </div>
              <ChevronRight className="w-4 h-4 text-[#a0a3a8] group-hover:text-[#8c7138]" />
            </div>
          </div>
        </div>

        {/* 5. Atelier Ops / Enterprise Portal */}
        <div className="pt-1">
          <button
            onClick={onOpenAtelierOps}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#141414] text-white hover:bg-[#8c7138] transition-colors text-xs font-bold cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4 text-[#fed488]" />
              <span>Admin Atelier Ops Hub (Inventory &amp; Orders)</span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </button>
        </div>

        {/* 6. Flipkart-Style Log Out Button */}
        <div className="pt-1">
          <button
            onClick={handleLogout}
            className="w-full py-2.5 rounded-xl bg-white border border-[#e4e6eb] text-rose-600 font-bold text-xs flex items-center justify-center gap-2 hover:bg-rose-50 transition-colors shadow-2xs cursor-pointer active:scale-98"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out of PARZIO</span>
          </button>
          <p className="text-[10px] text-center text-[#a0a3a8] mt-2">
            PARZIO App Version 2.4.0 • Crafted with care in Giridih &amp; Mumbai
          </p>
        </div>

      </div>

      {/* Interactive Modals */}

      {/* 1. Edit Profile Modal */}
      {activeModal === 'profile' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 border border-[#eae5dc] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#f0f1f3]">
              <h3 className="text-sm font-bold text-[#141414]">Edit Personal Details</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full hover:bg-neutral-100 text-neutral-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-[#717478] uppercase block mb-1">Full Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#faf8f5] border border-[#eae5dc] font-semibold text-[#141414] focus:outline-none focus:border-[#8c7138]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#717478] uppercase block mb-1">Mobile Number</label>
                <input
                  type="text"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#faf8f5] border border-[#eae5dc] font-semibold text-[#141414] focus:outline-none focus:border-[#8c7138]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#717478] uppercase block mb-1">Email Address</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#faf8f5] border border-[#eae5dc] font-semibold text-[#141414] focus:outline-none focus:border-[#8c7138]"
                />
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-[#8c7138] text-white font-bold text-xs shadow-xs hover:bg-[#6e582a] transition-colors"
            >
              Save Details
            </button>
          </div>
        </div>
      )}

      {/* 2. Coupons Modal */}
      {activeModal === 'coupons' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 border border-[#eae5dc] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#f0f1f3]">
              <h3 className="text-sm font-bold text-[#141414]">Active Discount Vouchers</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full hover:bg-neutral-100 text-neutral-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl border border-dashed border-[#8c7138] bg-[#faf7f2] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-[#8c7138] px-2 py-0.5 bg-[#fed488]/40 rounded">
                    PARZIO99
                  </span>
                  <span className="text-[10px] font-extrabold text-emerald-700">FLAT 92% OFF</span>
                </div>
                <p className="text-[11px] text-[#444748]">Buy Any 3 Jewellery pieces @ Flat ₹99 Each</p>
              </div>

              <div className="p-3 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-[#141414] px-2 py-0.5 bg-neutral-200 rounded">
                    FREESHIP
                  </span>
                  <span className="text-[10px] font-extrabold text-emerald-700">FREE COURIER</span>
                </div>
                <p className="text-[11px] text-[#444748]">Free express shipping on all orders above ₹499</p>
              </div>

              <div className="p-3 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-[#141414] px-2 py-0.5 bg-neutral-200 rounded">
                    FESTIVE10
                  </span>
                  <span className="text-[10px] font-extrabold text-emerald-700">EXTRA 10% OFF</span>
                </div>
                <p className="text-[11px] text-[#444748]">Extra 10% off on all gift boxes &amp; sets</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Saved Addresses Modal with "Add Address" Option */}
      {activeModal === 'address' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-2xl p-5 border border-[#eae5dc] shadow-2xl space-y-4 max-h-[88vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-[#f0f1f3] shrink-0">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#8c7138]" />
                <h3 className="text-sm font-bold text-[#141414]">Saved Delivery Addresses</h3>
              </div>
              <button
                onClick={() => {
                  setActiveModal(null);
                  setIsAddingAddress(false);
                }}
                className="p-1 rounded-full hover:bg-neutral-100 text-neutral-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Address Content */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-0.5">
              {!isAddingAddress && (
                <button
                  type="button"
                  onClick={() => setIsAddingAddress(true)}
                  className="w-full py-2.5 px-3 rounded-xl border border-dashed border-[#8c7138] text-[#8c7138] hover:bg-[#faf7f2] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add New Address</span>
                </button>
              )}

              {/* Add New Address Form */}
              {isAddingAddress && (
                <form
                  onSubmit={handleSaveNewAddress}
                  className="p-3.5 rounded-xl border border-[#8c7138] bg-[#faf8f5] space-y-2.5 animate-fadeIn"
                >
                  <div className="flex items-center justify-between border-b border-[#eae5dc] pb-1.5">
                    <span className="text-xs font-bold text-[#141414]">Add New Address</span>
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="text-[11px] text-[#717478] hover:text-[#141414]"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[9px] font-bold uppercase text-[#717478] block mb-0.5">Full Name *</label>
                      <input
                        type="text"
                        placeholder="Recipient Name"
                        value={newAddrName}
                        onChange={(e) => setNewAddrName(e.target.value)}
                        required
                        className="w-full px-2.5 py-1.5 rounded-md bg-white border border-[#eae5dc] text-xs focus:outline-none focus:border-[#8c7138]"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] font-bold uppercase text-[#717478] block mb-0.5">Phone Number *</label>
                      <input
                        type="tel"
                        placeholder="+91 10-digit number"
                        value={newAddrPhone}
                        onChange={(e) => setNewAddrPhone(e.target.value)}
                        required
                        className="w-full px-2.5 py-1.5 rounded-md bg-white border border-[#eae5dc] text-xs focus:outline-none focus:border-[#8c7138]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-bold uppercase text-[#717478] block mb-0.5">Flat, House no., Building, Street *</label>
                    <input
                      type="text"
                      placeholder="e.g. Flat 302, Royal Residency, Station Road"
                      value={newAddrStreet}
                      onChange={(e) => setNewAddrStreet(e.target.value)}
                      required
                      className="w-full px-2.5 py-1.5 rounded-md bg-white border border-[#eae5dc] text-xs focus:outline-none focus:border-[#8c7138]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <label className="text-[9px] font-bold uppercase text-[#717478] block mb-0.5">City</label>
                      <input
                        type="text"
                        placeholder="City"
                        value={newAddrCity}
                        onChange={(e) => setNewAddrCity(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-md bg-white border border-[#eae5dc] text-xs focus:outline-none focus:border-[#8c7138]"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] font-bold uppercase text-[#717478] block mb-0.5">State</label>
                      <input
                        type="text"
                        placeholder="State"
                        value={newAddrState}
                        onChange={(e) => setNewAddrState(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-md bg-white border border-[#eae5dc] text-xs focus:outline-none focus:border-[#8c7138]"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] font-bold uppercase text-[#717478] block mb-0.5">Pincode</label>
                      <input
                        type="text"
                        placeholder="6 digits"
                        value={newAddrPincode}
                        onChange={(e) => setNewAddrPincode(e.target.value)}
                        maxLength={6}
                        className="w-full px-2.5 py-1.5 rounded-md bg-white border border-[#eae5dc] text-xs focus:outline-none focus:border-[#8c7138]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5 text-xs">
                      {(['HOME', 'WORK', 'OTHER'] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setNewAddrType(t)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                            newAddrType === t
                              ? 'bg-[#8c7138] text-white'
                              : 'bg-white border border-[#eae5dc] text-[#717478]'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>

                    <label className="flex items-center gap-1 text-[11px] text-[#444748] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newAddrIsDefault}
                        onChange={(e) => setNewAddrIsDefault(e.target.checked)}
                        className="rounded accent-[#8c7138]"
                      />
                      <span>Make Default</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-1.5 py-2 rounded-lg bg-[#8c7138] hover:bg-[#6e582a] text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Save Address
                  </button>
                </form>
              )}

              {/* Saved Address List */}
              <div className="space-y-2.5 pt-1">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-3.5 rounded-xl border text-xs space-y-1.5 relative transition-all ${
                      addr.isDefault ? 'border-[#8c7138] bg-[#faf7f2]' : 'border-[#e4e6eb] bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#141414] flex items-center gap-1.5">
                        {addr.name}
                        <span className="px-1.5 py-0.2 rounded bg-neutral-200 text-[9px] font-bold uppercase text-neutral-700">
                          {addr.type}
                        </span>
                      </span>

                      <div className="flex items-center gap-2">
                        {addr.isDefault ? (
                          <span className="text-[10px] font-bold text-[#8c7138] uppercase">Default</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetDefaultAddress(addr.id)}
                            className="text-[10px] font-bold text-neutral-500 hover:text-[#8c7138] underline cursor-pointer"
                          >
                            Set Default
                          </button>
                        )}
                        {addresses.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="text-neutral-400 hover:text-rose-600 cursor-pointer"
                            title="Delete address"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-[#444748] leading-relaxed">{addr.address}</p>
                    <p className="text-[#717478]">
                      {addr.city}, {addr.state} — {addr.pincode}
                    </p>
                    <p className="text-[#717478] font-medium">Phone: {addr.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Help Center Modal */}
      {activeModal === 'help' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 border border-[#eae5dc] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#f0f1f3]">
              <h3 className="text-sm font-bold text-[#141414]">PARZIO 24x7 Help Center</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full hover:bg-neutral-100 text-neutral-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#444748]">
              <div className="p-3 bg-[#faf7f2] rounded-xl border border-[#eae5dc] space-y-1">
                <p className="font-bold text-[#141414]">Quick WhatsApp Concierge</p>
                <p className="text-[11px] text-[#717478]">Get instant response from our stylist support team</p>
                <a
                  href="https://wa.me/917033656752"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline pt-1"
                >
                  <Phone className="w-3 h-3" />
                  <span>Chat on WhatsApp: +91 7033656752</span>
                </a>
              </div>

              <div className="space-y-1.5 pt-1">
                <p className="font-bold text-[#141414]">Frequently Asked Questions:</p>
                <p>• <strong>Delivery Time:</strong> 2–4 business days across India</p>
                <p>• <strong>Anti-Tarnish Proof:</strong> 316L Surgical Steel shower &amp; perfume safe</p>
                <p>• <strong>Returns:</strong> 7-day hassle-free doorstep reverse pickup</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Privacy & Policy Modal */}
      {activeModal === 'privacy' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 border border-[#eae5dc] shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#f0f1f3]">
              <h3 className="text-sm font-bold text-[#141414]">PARZIO Trust &amp; Privacy</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full hover:bg-neutral-100 text-neutral-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-[#444748] space-y-2 leading-relaxed">
              <p>Your payment details, address, and phone numbers are encrypted with 256-bit bank-grade SSL security.</p>
              <p>We do not share your personal information with third parties. All courier updates are sent safely through verified business WhatsApp channels.</p>
            </div>
          </div>
        </div>
      )}

      {/* Logout Toast Notification */}
      {showLogoutToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-[#141414] text-white text-xs font-bold shadow-lg animate-bounce flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Logged out successfully. Browsing as Guest.</span>
        </div>
      )}

    </div>
  );
};
