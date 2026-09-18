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
import { lookupPincode } from '../services/postalService';
import { UserProfile } from '../services/userService';

interface AccountViewProps {
  orders: OrderItem[];
  userProfile?: UserProfile | null;
  onLogout?: () => void;
  onLoginClick?: () => void;
  onOpenWishlist: () => void;
  onOpenAtelierOps: () => void;
  onTrackOrder: () => void;
  onUpdateProfile?: (updated: UserProfile) => void;
}

interface AddressItem {
  id: string;
  name: string;
  type: 'HOME' | 'WORK' | 'OTHER';
  phone: string;
  address: string;
  postOffice?: string;
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
  userProfile,
  onLogout,
  onLoginClick,
  onOpenWishlist,
  onOpenAtelierOps,
  onTrackOrder,
  onUpdateProfile
}) => {
  const [activeModal, setActiveModal] = useState<
    'profile' | 'coupons' | 'address' | 'help' | 'privacy' | null
  >(null);

  const [editName, setEditName] = useState(userProfile?.name || 'Guest User');

  useEffect(() => {
    if (userProfile?.name) {
      setEditName(userProfile.name);
    }
  }, [userProfile?.name]);

  const userName = userProfile?.name || editName || 'Guest User';
  const userPhone = userProfile?.phone || '';
  const userEmail = userProfile ? `${userName.toLowerCase().replace(/\s+/g, '')}@parzio.in` : '';
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
  const [newAddrPostOffice, setNewAddrPostOffice] = useState('');
  const [postOfficeList, setPostOfficeList] = useState<string[]>([]);
  const [isLoadingPostal, setIsLoadingPostal] = useState(false);
  const [newAddrCity, setNewAddrCity] = useState('');
  const [newAddrState, setNewAddrState] = useState('');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrType, setNewAddrType] = useState<'HOME' | 'WORK' | 'OTHER'>('HOME');
  const [newAddrIsDefault, setNewAddrIsDefault] = useState(false);

  const handlePincodeChange = async (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 6);
    setNewAddrPincode(cleaned);

    if (cleaned.length === 6) {
      setIsLoadingPostal(true);
      const info = await lookupPincode(cleaned);
      setIsLoadingPostal(false);
      if (info) {
        if (info.district) setNewAddrCity(info.district);
        if (info.state) setNewAddrState(info.state);
        if (info.postOffices && info.postOffices.length > 0) {
          setPostOfficeList(info.postOffices);
          setNewAddrPostOffice(info.postOffices[0]);
        } else {
          setPostOfficeList([]);
          setNewAddrPostOffice('');
        }
      }
    } else {
      setPostOfficeList([]);
      setNewAddrPostOffice('');
    }
  };

  const handleSaveNewAddress = (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newAddrName.trim() || !newAddrStreet.trim() || !newAddrPhone.trim()) return;

    const newAddress: AddressItem = {
      id: `addr-${Date.now()}`,
      name: newAddrName.trim(),
      phone: newAddrPhone.trim(),
      pincode: newAddrPincode.trim() || '400001',
      postOffice: newAddrPostOffice.trim() || undefined,
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
    setNewAddrPostOffice('');
    setPostOfficeList([]);
    setNewAddrCity('');
    setNewAddrState('');
    setNewAddrStreet('');
    setNewAddrType('HOME');
    setNewAddrIsDefault(false);
    setIsAddingAddress(false);
  };

  const handleSaveAddress = (e?: any) => {
    handleSaveNewAddress(e);
  };

  const handleSetDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id
      }))
    );
  };

  const [confirmDeleteAddressId, setConfirmDeleteAddressId] = useState<string | null>(null);
  const [isConfirmLogoutOpen, setIsConfirmLogoutOpen] = useState(false);

  const handleConfirmDeleteAddress = () => {
    if (confirmDeleteAddressId) {
      setAddresses((prev) => prev.filter((a) => a.id !== confirmDeleteAddressId));
      setConfirmDeleteAddressId(null);
    }
  };

  const handleConfirmLogout = () => {
    setIsConfirmLogoutOpen(false);
    setShowLogoutToast(true);
    try {
      localStorage.removeItem('parzio_user_profile');
    } catch {}
    if (onLogout) {
      onLogout();
    }
    setTimeout(() => setShowLogoutToast(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#f1f2f4] pb-28 font-sans">
      <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-8 lg:px-14 pt-4 sm:pt-6 space-y-5">

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
            className="text-xs font-semibold text-[#8c7138] hover:text-[#705220] transition-colors cursor-pointer flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#e4e6eb] shadow-2xs hover:border-[#8c7138]"
          >
            ← Back to Store
          </button>
        </div>

        {/* Row 1: Profile Header Card (4 cols on lg) + Quick Action Tiles (8 cols on lg) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
          {/* 1. Flipkart-Grade Profile Header Card */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-4 sm:p-5 border border-[#e4e6eb] shadow-2xs flex flex-col justify-center">
            {userProfile ? (
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
                    {userEmail && <p className="text-[11px] text-[#717478] break-all">{userEmail}</p>}
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
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center font-bold text-lg border border-neutral-200">
                    <User className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#141414]">Guest User</h2>
                    <p className="text-xs text-[#717478] mt-0.5">Please login to view account</p>
                  </div>
                </div>
                {onLoginClick && (
                  <button
                    onClick={onLoginClick}
                    className="px-3.5 py-2 rounded-xl bg-[#141414] text-[#fed488] text-xs font-bold shadow-md hover:bg-[#2a2a2a] transition-all cursor-pointer"
                  >
                    Log In
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 2. Top 4 Core Quick Action Tiles (8 cols on lg: 4 columns in 1 row) */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 items-stretch">
            {/* Orders */}
            <button
              onClick={onTrackOrder}
              className="p-3.5 rounded-xl bg-white border border-[#e4e6eb] shadow-2xs text-left hover:border-[#8c7138] transition-all cursor-pointer flex items-center gap-2.5"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Package className="w-5 h-5" />
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
              className="p-3.5 rounded-xl bg-white border border-[#e4e6eb] shadow-2xs text-left hover:border-[#8c7138] transition-all cursor-pointer flex items-center gap-2.5"
            >
              <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-[#141414] leading-tight">Wishlist</h3>
                <p className="text-[10px] text-[#717478] mt-0.5 whitespace-nowrap">Saved Items</p>
              </div>
            </button>

            {/* Coupons */}
            <button
              onClick={() => setActiveModal('coupons')}
              className="p-3.5 rounded-xl bg-white border border-[#e4e6eb] shadow-2xs text-left hover:border-[#8c7138] transition-all cursor-pointer flex items-center gap-2.5"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Tag className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-[#141414] leading-tight">Coupons</h3>
                <p className="text-[10px] text-[#717478] mt-0.5 whitespace-nowrap">View Offers</p>
              </div>
            </button>

            {/* Help Center */}
            <button
              onClick={() => setActiveModal('help')}
              className="p-3.5 rounded-xl bg-white border border-[#e4e6eb] shadow-2xs text-left hover:border-[#8c7138] transition-all cursor-pointer flex items-center gap-2.5"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-[#141414] leading-tight">Help Center</h3>
                <p className="text-[10px] text-[#717478] mt-0.5 whitespace-nowrap">24×7 Support</p>
              </div>
            </button>
          </div>
        </div>

        {/* Row 2: Left column (Account Menu, Feedback, Admin, Logout) + Right column on Desktop (Saved Addresses Panel) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
          {/* Left Column (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-4">
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
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#141414] text-white hover:bg-[#8c7138] transition-colors text-xs font-bold cursor-pointer shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="w-4 h-4 text-[#fed488]" />
                  <span>Admin Atelier Ops Hub (Inventory &amp; Orders)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </button>
            </div>

            {/* 6. Flipkart-Style Log Out / Log In Button */}
            <div className="pt-1">
              {userProfile ? (
                <button
                  type="button"
                  onClick={() => setIsConfirmLogoutOpen(true)}
                  className="w-full py-2.5 rounded-xl bg-white border border-[#e4e6eb] text-rose-600 font-bold text-xs flex items-center justify-center gap-2 hover:bg-rose-50 transition-colors shadow-2xs cursor-pointer active:scale-98"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out of PARZIO</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onLoginClick}
                  className="w-full py-2.5 rounded-xl bg-[#141414] text-[#fed488] font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#2a2a2a] transition-colors shadow-2xs cursor-pointer active:scale-98"
                >
                  <User className="w-4 h-4" />
                  <span>Log In to Your Account</span>
                </button>
              )}
              <p className="text-[10px] text-center text-[#a0a3a8] mt-2">
                PARZIO App Version 2.4.0 • Crafted with care in Giridih &amp; Mumbai
              </p>
            </div>
          </div>

          {/* Right Column on Desktop (8 cols on lg): Interactive Address Book & Assurance */}
          <div className="hidden lg:block lg:col-span-8 space-y-4">
            {/* Saved Delivery Addresses Direct Panel */}
            <div className="bg-white rounded-2xl p-5 border border-[#e4e6eb] shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#f0f1f3] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#faf8f5] text-[#8c7138] flex items-center justify-center border border-[#eae5dc]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#141414]">Saved Delivery Addresses</h3>
                    <p className="text-[11px] text-[#717478]">Manage your home, office and atelier delivery locations</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsAddingAddress(true)}
                  className="px-3 py-1.5 rounded-full bg-[#8c7138] text-white text-xs font-bold hover:bg-[#705220] transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              {/* Add Address Form on Desktop */}
              {isAddingAddress && (
                <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#eae5dc] space-y-3">
                  <h4 className="text-xs font-bold text-[#141414]">New Delivery Address</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-[10px] font-bold text-[#717478] uppercase block mb-1">Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Pooja Sharma"
                        value={newAddrName}
                        onChange={(e) => setNewAddrName(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#eae5dc] text-xs focus:outline-none focus:border-[#8c7138]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#717478] uppercase block mb-1">Phone Number</label>
                      <input
                        type="text"
                        placeholder="10-digit mobile"
                        value={newAddrPhone}
                        onChange={(e) => setNewAddrPhone(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#eae5dc] text-xs focus:outline-none focus:border-[#8c7138]"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] font-bold text-[#717478] uppercase block mb-1">Street Address / House No.</label>
                      <input
                        type="text"
                        placeholder="Flat, Road, Area, Landmark"
                        value={newAddrStreet}
                        onChange={(e) => setNewAddrStreet(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#eae5dc] text-xs focus:outline-none focus:border-[#8c7138]"
                      />
                    </div>
                    {/* Pincode with Postal Auto-Detection */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] font-bold text-[#717478] uppercase block">
                          Pincode *
                        </label>
                        {isLoadingPostal && (
                          <span className="text-[9px] text-[#8c7138] font-bold animate-pulse">
                            Detecting Post...
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="6-digit Pincode"
                        maxLength={6}
                        value={newAddrPincode}
                        onChange={(e) => handlePincodeChange(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#eae5dc] text-xs font-semibold focus:outline-none focus:border-[#8c7138]"
                      />
                    </div>

                    {/* Post Office Dropdown / Input */}
                    <div>
                      <label className="text-[10px] font-bold text-[#717478] uppercase block mb-1">
                        Post Office / Area
                      </label>
                      {postOfficeList.length > 0 ? (
                        <select
                          value={newAddrPostOffice}
                          onChange={(e) => setNewAddrPostOffice(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#8c7138] text-xs font-semibold text-[#141414] focus:outline-none cursor-pointer"
                        >
                          {postOfficeList.map((po) => (
                            <option key={po} value={po}>
                              {po}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          placeholder={isLoadingPostal ? "Fetching Post Office..." : "Post Office / Area"}
                          value={newAddrPostOffice}
                          onChange={(e) => setNewAddrPostOffice(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#eae5dc] text-xs focus:outline-none focus:border-[#8c7138]"
                        />
                      )}
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-[#717478] uppercase block mb-1">City / District</label>
                      <input
                        type="text"
                        placeholder="City"
                        value={newAddrCity}
                        onChange={(e) => setNewAddrCity(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#eae5dc] text-xs focus:outline-none focus:border-[#8c7138]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-[#717478] uppercase block mb-1">State</label>
                      <input
                        type="text"
                        placeholder="State"
                        value={newAddrState}
                        onChange={(e) => setNewAddrState(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#eae5dc] text-xs focus:outline-none focus:border-[#8c7138]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setNewAddrType('HOME')}
                        className={`px-3 py-1 rounded text-xs font-bold ${newAddrType === 'HOME' ? 'bg-[#8c7138] text-white' : 'bg-white border text-neutral-600'}`}
                      >
                        Home
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewAddrType('WORK')}
                        className={`px-3 py-1 rounded text-xs font-bold ${newAddrType === 'WORK' ? 'bg-[#8c7138] text-white' : 'bg-white border text-neutral-600'}`}
                      >
                        Work
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsAddingAddress(false)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-600 hover:bg-neutral-100"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveAddress}
                        className="px-4 py-1.5 rounded-lg bg-[#8c7138] text-white text-xs font-bold hover:bg-[#705220]"
                      >
                        Save Address
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Saved Address Cards Grid on Desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      addr.isDefault
                        ? 'border-[#8c7138] bg-[#faf8f5]/60 shadow-2xs'
                        : 'border-[#eae5dc] bg-white hover:border-[#8c7138]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#141414]">{addr.name}</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-neutral-100 text-neutral-600">
                          {addr.type}
                        </span>
                      </div>
                      {addr.isDefault && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                          <Check className="w-3 h-3" /> Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#141414] leading-relaxed">
                      {addr.address}
                      {addr.postOffice ? `, Post: ${addr.postOffice}` : ''}, {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    <p className="text-xs text-[#717478] mt-1">Phone: {addr.phone}</p>

                    <div className="mt-3 pt-2 border-t border-[#f0f1f3] flex items-center justify-between text-xs">
                      {!addr.isDefault ? (
                        <button
                          onClick={() => handleSetDefaultAddress(addr.id)}
                          className="text-[11px] font-bold text-[#8c7138] hover:underline"
                        >
                          Set as Default
                        </button>
                      ) : (
                        <span className="text-[10px] text-emerald-700 font-semibold">Primary Address</span>
                      )}

                      <button
                        type="button"
                        onClick={() => setConfirmDeleteAddressId(addr.id)}
                        className="text-[11px] text-rose-600 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Personal Info & Warranty Assurance Summary on Desktop */}
            <div className="bg-white rounded-2xl p-5 border border-[#e4e6eb] shadow-2xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#141414]">316L Surgical Stainless Steel Guarantee</h4>
                  <p className="text-[11px] text-[#717478]">
                    All jewelry is 100% waterproof, anti-tarnish &amp; skin safe with lifetime polish retention.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveModal('help')}
                className="px-3.5 py-1.5 rounded-full border border-[#eae5dc] text-xs font-semibold text-[#141414] hover:border-[#8c7138] hover:text-[#8c7138] transition-colors whitespace-nowrap shrink-0"
              >
                View Warranty
              </button>
            </div>
          </div>
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
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-3 py-2 rounded-lg bg-[#faf8f5] border border-[#eae5dc] font-semibold text-[#141414] focus:outline-none focus:border-[#8c7138]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold text-[#717478] uppercase">Registered Mobile Number</label>
                  <span className="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded flex items-center gap-1">
                    🔒 Permanent ID
                  </span>
                </div>
                <input
                  type="text"
                  value={userPhone}
                  readOnly
                  disabled
                  className="w-full px-3 py-2 rounded-lg bg-neutral-100 border border-[#eae5dc] font-mono font-semibold text-neutral-500 cursor-not-allowed select-none"
                />
                <p className="text-[10px] text-[#8c7138] mt-1">
                  Registered phone number is your verified login identity and cannot be changed.
                </p>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#717478] uppercase block mb-1">Email Address</label>
                <input
                  type="email"
                  value={userEmail}
                  readOnly
                  disabled
                  className="w-full px-3 py-2 rounded-lg bg-neutral-100 border border-[#eae5dc] font-semibold text-neutral-500 cursor-not-allowed select-none"
                />
              </div>
            </div>

            <button
              onClick={async () => {
                if (!editName.trim()) return;
                if (userProfile) {
                  const updated: UserProfile = {
                    ...userProfile,
                    name: editName.trim()
                  };
                  try {
                    localStorage.setItem('parzio_user_profile', JSON.stringify(updated));
                    await userService.saveUserProfile(updated);
                  } catch (err) {
                    console.error('Failed to update profile', err);
                  }
                  if (onUpdateProfile) {
                    onUpdateProfile(updated);
                  }
                }
                setActiveModal(null);
              }}
              className="w-full py-2.5 rounded-xl bg-[#8c7138] text-white font-bold text-xs shadow-xs hover:bg-[#6e582a] transition-colors cursor-pointer"
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

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {/* Mobile Pincode input */}
                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <label className="text-[9px] font-bold uppercase text-[#717478] block">Pincode *</label>
                        {isLoadingPostal && (
                          <span className="text-[8px] text-[#8c7138] font-bold animate-pulse">Detecting...</span>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="6 digits"
                        maxLength={6}
                        value={newAddrPincode}
                        onChange={(e) => handlePincodeChange(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-md bg-white border border-[#eae5dc] text-xs font-semibold focus:outline-none focus:border-[#8c7138]"
                      />
                    </div>

                    {/* Mobile Post Office Selector */}
                    <div>
                      <label className="text-[9px] font-bold uppercase text-[#717478] block mb-0.5">Post Office</label>
                      {postOfficeList.length > 0 ? (
                        <select
                          value={newAddrPostOffice}
                          onChange={(e) => setNewAddrPostOffice(e.target.value)}
                          className="w-full px-2 py-1.5 rounded-md bg-white border border-[#8c7138] text-xs font-semibold text-[#141414] focus:outline-none cursor-pointer"
                        >
                          {postOfficeList.map((po) => (
                            <option key={po} value={po}>
                              {po}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          placeholder={isLoadingPostal ? "Fetching..." : "Post Office"}
                          value={newAddrPostOffice}
                          onChange={(e) => setNewAddrPostOffice(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-md bg-white border border-[#eae5dc] text-xs focus:outline-none focus:border-[#8c7138]"
                        />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[9px] font-bold uppercase text-[#717478] block mb-0.5">City / District</label>
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
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteAddressId(addr.id)}
                          className="text-neutral-400 hover:text-rose-600 cursor-pointer p-1 transition-colors"
                          title="Delete address"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                      <p className="text-xs text-[#141414] leading-relaxed">
                        {addr.address}
                        {addr.postOffice ? `, Post: ${addr.postOffice}` : ''}, {addr.city}, {addr.state} - {addr.pincode}
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

      {/* Confirmation Modal: Delete Delivery Address */}
      {confirmDeleteAddressId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 border border-[#eae5dc] shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-[#141414]">Delete Delivery Address?</h3>
                <p className="text-xs text-[#717478] mt-1 leading-relaxed">
                  Are you sure you want to delete this address? You will need to add it again for future deliveries.
                </p>
                {(() => {
                  const targetAddr = addresses.find((a) => a.id === confirmDeleteAddressId);
                  if (!targetAddr) return null;
                  return (
                    <div className="mt-3 p-2.5 rounded-xl bg-[#faf8f5] border border-[#eae5dc] text-[11px] text-[#141414] space-y-0.5">
                      <div className="font-bold flex items-center gap-1.5">
                        <span>{targetAddr.name}</span>
                        <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-white border border-[#eae5dc] text-[#8c7138]">
                          {targetAddr.type}
                        </span>
                        {targetAddr.isDefault && (
                          <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                            Primary
                          </span>
                        )}
                      </div>
                      <p className="text-[#717478] line-clamp-2">
                        {targetAddr.address}
                        {targetAddr.postOffice ? `, Post: ${targetAddr.postOffice}` : ''}, {targetAddr.city}, {targetAddr.state} - {targetAddr.pincode}
                      </p>
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-[#f0f1f3]">
              <button
                type="button"
                onClick={() => setConfirmDeleteAddressId(null)}
                className="flex-1 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-[#141414] font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteAddress}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Log Out */}
      {isConfirmLogoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 border border-[#eae5dc] shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-[#8c7138] flex items-center justify-center shrink-0">
                <LogOut className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-[#141414]">Log Out of PARZIO?</h3>
                <p className="text-xs text-[#717478] mt-1 leading-relaxed">
                  Are you sure you want to log out from this device? You can easily log back in anytime with your phone number.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-[#f0f1f3]">
              <button
                type="button"
                onClick={() => setIsConfirmLogoutOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-[#141414] font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="flex-1 py-2.5 rounded-xl bg-[#141414] hover:bg-black text-white font-bold text-xs transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Yes, Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
