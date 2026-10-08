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
  ArrowLeft,
  LayoutDashboard
} from 'lucide-react';
import { OrderItem } from '../types';
import { lookupPincode } from '../services/postalService';
import { UserProfile, userService } from '../services/userService';

interface AccountViewProps {
  orders: OrderItem[];
  userProfile?: UserProfile | null;
  onLogout?: () => void;
  onLoginClick?: () => void;
  onOpenWishlist: () => void;
  onOpenAtelierOps?: () => void;
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

const DEFAULT_ADDRESSES: AddressItem[] = [];

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

  // Addresses State with LocalStorage Persistence & Mock Filter
  const [addresses, setAddresses] = useState<AddressItem[]>(() => {
    try {
      const saved = localStorage.getItem('parzio_saved_addresses');
      if (saved) {
        const parsed: AddressItem[] = JSON.parse(saved);
        return parsed.filter(
          (a) =>
            a.id !== 'addr-1' &&
            a.id !== 'addr-2' &&
            !a.name.toLowerCase().includes('pooja sharma')
        );
      }
    } catch {}
    return [];
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
                  onClick={() => {
                    if (!userProfile && onLoginClick) {
                      onLoginClick();
                    } else {
                      setActiveModal('address');
                    }
                  }}
                  className="py-2.5 flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-[#8c7138]" />
                    <div>
                      <h4 className="text-xs font-semibold text-[#141414] group-hover:text-[#8c7138] transition-colors">
                        Saved Delivery Addresses
                      </h4>
                      <p className="text-[10px] text-[#717478]">
                        {userProfile
                          ? (addresses.length > 0
                              ? `${addresses.length} ${addresses.length === 1 ? 'address' : 'addresses'} saved`
                              : 'No saved addresses')
                          : 'Login required'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#a0a3a8] group-hover:text-[#8c7138]" />
                </div>

                {/* Edit Profile */}
                <div
                  onClick={() => {
                    if (!userProfile && onLoginClick) {
                      onLoginClick();
                    } else {
                      setActiveModal('profile');
                    }
                  }}
                  className="py-2.5 flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-[#8c7138]" />
                    <div>
                      <h4 className="text-xs font-semibold text-[#141414] group-hover:text-[#8c7138] transition-colors">
                        Personal Information
                      </h4>
                      <p className="text-[10px] text-[#717478]">
                        {userProfile ? 'Name, Phone number & Email' : 'Login to manage profile'}
                      </p>
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


            {/* 5. Flipkart-Style Log Out / Log In Button */}
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
              {!userProfile ? (
                <div className="text-center py-10 bg-[#faf8f5] rounded-xl border border-[#eae5dc] text-xs text-[#717478] space-y-2.5">
                  <MapPin className="w-8 h-8 text-[#9e7144]/60 mx-auto" />
                  <p className="font-bold text-sm text-[#141414]">Login to View Saved Addresses</p>
                  <p className="text-xs text-[#717478] max-w-xs mx-auto">
                    Please log in with your mobile number to access and manage your delivery addresses.
                  </p>
                  <button
                    type="button"
                    onClick={onLoginClick}
                    className="px-6 py-2.5 rounded-full bg-[#141414] hover:bg-[#9e7144] text-[#fed488] font-bold text-xs uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
                  >
                    Log In / Sign Up
                  </button>
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-10 bg-[#faf8f5] rounded-xl border border-[#eae5dc] text-xs text-[#717478] space-y-1">
                  <MapPin className="w-7 h-7 text-[#9e7144]/50 mx-auto mb-1" />
                  <p className="font-bold text-[#141414]">No saved delivery addresses</p>
                  <p className="text-[11px] text-[#717478]">Click "+ Add New Address" above to save your first location.</p>
                </div>
              ) : (
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
              )}
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

      {/* Interactive Sub-Pages (Replacing Popups) */}

      {/* 1. Edit Profile Page */}
      {activeModal === 'profile' && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto animate-fadeIn flex flex-col">
          <header className="sticky top-0 z-40 bg-white border-b border-[#eae5dc] px-4 sm:px-8 py-3.5">
            <div className="max-w-xl mx-auto flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="flex items-center gap-2 text-xs font-bold text-[#141414] hover:text-[#9e7144] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-[#141414]" />
                <span>Back</span>
              </button>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#9e7144]">Personal Information</h3>
            </div>
          </header>

          <main className="flex-1 max-w-xl w-full mx-auto px-4 sm:px-6 py-6">
            {!userProfile ? (
              <div className="text-center py-12 px-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#faf7f2] border border-[#eae5dc] text-[#9e7144] flex items-center justify-center mx-auto">
                  <User className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-[#141414]">Login to Edit Profile</h3>
                <p className="text-xs text-[#717478] max-w-sm mx-auto leading-relaxed">
                  You are currently browsing as a guest. Please log in with your registered mobile number to view and update your personal details.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveModal(null);
                    if (onLoginClick) onLoginClick();
                  }}
                  className="px-8 py-3 rounded-full bg-[#141414] hover:bg-[#9e7144] text-[#fed488] font-bold text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer"
                >
                  Log In / Sign Up
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-[#141414]">Personal Details</h2>
                  <p className="text-xs text-[#717478] mt-0.5">Manage your verified profile information</p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="text-[11px] font-bold text-[#141414] uppercase block mb-1.5">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#eae5dc] font-medium text-xs text-[#141414] focus:outline-none focus:border-[#9e7144] focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-bold text-[#141414] uppercase">
                        Registered Mobile Number
                      </label>
                      <span className="text-[9px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                        🔒 Permanent ID
                      </span>
                    </div>
                    <input
                      type="text"
                      value={userPhone || 'Not Registered'}
                      readOnly
                      disabled
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-100 border border-[#eae5dc] font-mono text-xs text-neutral-500 cursor-not-allowed select-none"
                    />
                  </div>

                  {userEmail && (
                    <div>
                      <label className="text-[11px] font-bold text-[#141414] uppercase block mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={userEmail}
                        readOnly
                        disabled
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-100 border border-[#eae5dc] text-xs text-neutral-500 cursor-not-allowed select-none"
                      />
                    </div>
                  )}
                </div>

                <button
                  type="button"
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
                  className="w-full py-3 rounded-full bg-[#141414] hover:bg-[#9e7144] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
                >
                  Save Details
                </button>
              </div>
            )}
          </main>
        </div>
      )}

      {/* 2. Coupons Page */}
      {activeModal === 'coupons' && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto animate-fadeIn flex flex-col">
          <header className="sticky top-0 z-40 bg-white border-b border-[#eae5dc] px-4 sm:px-8 py-3.5">
            <div className="max-w-xl mx-auto flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="flex items-center gap-2 text-xs font-bold text-[#141414] hover:text-[#9e7144] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-[#141414]" />
                <span>Back to Account</span>
              </button>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#9e7144]">Discount Coupons</h3>
            </div>
          </header>

          <main className="flex-1 max-w-xl w-full mx-auto px-4 sm:px-6 py-6">
            <div className="space-y-4">
              <div className="border-b border-[#f0f1f3] pb-3">
                <h2 className="text-lg font-bold text-[#141414]">Active Discount Vouchers</h2>
                <p className="text-xs text-[#717478] mt-0.5">Apply these codes during checkout for instant savings</p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-dashed border-[#9e7144] bg-[#faf7f2] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-[#9e7144] px-2.5 py-0.5 bg-[#fed488]/40 rounded-full">
                      PARZIO99
                    </span>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">FLAT 92% OFF</span>
                  </div>
                  <p className="text-xs text-[#444748]">Buy Any 3 Jewellery pieces @ Flat ₹99 Each</p>
                </div>

                <div className="p-4 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-[#141414] px-2.5 py-0.5 bg-neutral-200 rounded-full">
                      FREESHIP
                    </span>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">FREE COURIER</span>
                  </div>
                  <p className="text-xs text-[#444748]">Free express shipping on all orders above ₹499</p>
                </div>

                <div className="p-4 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-[#141414] px-2.5 py-0.5 bg-neutral-200 rounded-full">
                      FESTIVE10
                    </span>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">EXTRA 10% OFF</span>
                  </div>
                  <p className="text-xs text-[#444748]">Extra 10% off on all gift boxes &amp; sets</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}

      {/* 3. Saved Addresses Page with "Add Address" Option */}
      {activeModal === 'address' && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto animate-fadeIn flex flex-col">
          <header className="sticky top-0 z-40 bg-white border-b border-[#eae5dc] px-4 sm:px-8 py-3.5">
            <div className="max-w-xl mx-auto flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setActiveModal(null);
                  setIsAddingAddress(false);
                }}
                className="flex items-center gap-2 text-xs font-bold text-[#141414] hover:text-[#9e7144] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-[#141414]" />
                <span>Back</span>
              </button>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#9e7144]">Saved Addresses</h3>
            </div>
          </header>

          <main className="flex-1 max-w-xl w-full mx-auto px-4 sm:px-6 py-6">
            {!userProfile ? (
              <div className="text-center py-12 px-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#faf7f2] border border-[#eae5dc] text-[#9e7144] flex items-center justify-center mx-auto">
                  <MapPin className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-[#141414]">Login to View Saved Addresses</h3>
                <p className="text-xs text-[#717478] max-w-sm mx-auto leading-relaxed">
                  Your delivery addresses are securely linked to your account. Log in with your registered phone number to access and manage your addresses.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveModal(null);
                    if (onLoginClick) onLoginClick();
                  }}
                  className="px-8 py-3 rounded-full bg-[#141414] hover:bg-[#9e7144] text-[#fed488] font-bold text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer"
                >
                  Log In / Sign Up
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-[#141414]">Saved Delivery Addresses</h2>
                    <p className="text-xs text-[#717478] mt-0.5">Manage your doorstep delivery locations</p>
                  </div>
                  {!isAddingAddress && (
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(true)}
                      className="px-3.5 py-1.5 rounded-full bg-[#9e7144] hover:bg-[#865d34] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New</span>
                    </button>
                  )}
                </div>

                {/* Add New Address Form */}
                {isAddingAddress && (
                  <form
                    onSubmit={handleSaveNewAddress}
                    className="p-4 rounded-2xl border border-[#9e7144] bg-[#faf8f5] space-y-3 animate-fadeIn"
                  >
                    <div className="flex items-center justify-between border-b border-[#eae5dc] pb-2">
                      <span className="text-xs font-bold text-[#141414]">Add New Address</span>
                      <button
                        type="button"
                        onClick={() => setIsAddingAddress(false)}
                        className="text-xs text-[#717478] hover:text-[#141414]"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#717478] block mb-1">Full Name *</label>
                        <input
                          type="text"
                          placeholder="Recipient Name"
                          value={newAddrName}
                          onChange={(e) => setNewAddrName(e.target.value)}
                          required
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#eae5dc] text-xs focus:outline-none focus:border-[#9e7144]"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#717478] block mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          placeholder="+91 10-digit number"
                          value={newAddrPhone}
                          onChange={(e) => setNewAddrPhone(e.target.value)}
                          required
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#eae5dc] text-xs focus:outline-none focus:border-[#9e7144]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#717478] block mb-1">Flat, House no., Building, Street *</label>
                      <input
                        type="text"
                        placeholder="e.g. Flat 302, Royal Residency, Station Road"
                        value={newAddrStreet}
                        onChange={(e) => setNewAddrStreet(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#eae5dc] text-xs focus:outline-none focus:border-[#9e7144]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {/* Mobile Pincode input */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] font-bold uppercase text-[#717478] block">Pincode *</label>
                          {isLoadingPostal && (
                            <span className="text-[9px] text-[#9e7144] font-bold animate-pulse">Detecting...</span>
                          )}
                        </div>
                        <input
                          type="text"
                          placeholder="6 digits"
                          maxLength={6}
                          value={newAddrPincode}
                          onChange={(e) => handlePincodeChange(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#eae5dc] text-xs font-semibold focus:outline-none focus:border-[#9e7144]"
                        />
                      </div>

                      {/* Mobile Post Office Selector */}
                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#717478] block mb-1">Post Office</label>
                        {postOfficeList.length > 0 ? (
                          <select
                            value={newAddrPostOffice}
                            onChange={(e) => setNewAddrPostOffice(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-[#9e7144] text-xs font-semibold text-[#141414] focus:outline-none cursor-pointer"
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
                            className="w-full px-3 py-2 rounded-xl bg-white border border-[#eae5dc] text-xs focus:outline-none focus:border-[#9e7144]"
                          />
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#717478] block mb-1">City / District</label>
                        <input
                          type="text"
                          placeholder="City"
                          value={newAddrCity}
                          onChange={(e) => setNewAddrCity(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#eae5dc] text-xs focus:outline-none focus:border-[#9e7144]"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#717478] block mb-1">State</label>
                        <input
                          type="text"
                          placeholder="State"
                          value={newAddrState}
                          onChange={(e) => setNewAddrState(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#eae5dc] text-xs focus:outline-none focus:border-[#9e7144]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1.5 text-xs">
                        {(['HOME', 'WORK', 'OTHER'] as const).map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setNewAddrType(t)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                              newAddrType === t
                                ? 'bg-[#9e7144] text-white'
                                : 'bg-white border border-[#eae5dc] text-[#717478]'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>

                      <label className="flex items-center gap-1.5 text-xs text-[#444748] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newAddrIsDefault}
                          onChange={(e) => setNewAddrIsDefault(e.target.checked)}
                          className="rounded accent-[#9e7144]"
                        />
                        <span>Make Default</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-2 py-3 rounded-full bg-[#141414] hover:bg-[#9e7144] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Save Address
                    </button>
                  </form>
                )}

                {/* Saved Address List */}
                <div className="space-y-3">
                  {addresses.length === 0 && !isAddingAddress ? (
                    <div className="text-center py-12 bg-[#faf8f5] rounded-2xl border border-[#eae5dc] text-xs text-[#717478] space-y-1.5">
                      <MapPin className="w-8 h-8 text-[#9e7144]/60 mx-auto mb-1" />
                      <p className="font-bold text-sm text-[#141414]">No saved delivery addresses</p>
                      <p className="text-[11px] text-[#717478]">Click "+ Add New" above or add an address during checkout.</p>
                    </div>
                  ) : (
                    addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`p-4 rounded-xl border text-xs space-y-2 relative transition-all ${
                          addr.isDefault ? 'border-[#9e7144] bg-[#faf8f5]' : 'border-[#e4e6eb] bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#141414] flex items-center gap-2">
                            {addr.name}
                            <span className="px-2 py-0.5 rounded-full bg-neutral-200 text-[9px] font-bold uppercase text-neutral-700">
                              {addr.type}
                            </span>
                          </span>

                          <div className="flex items-center gap-3">
                            {addr.isDefault ? (
                              <span className="text-[10px] font-bold text-[#9e7144] uppercase">Default</span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSetDefaultAddress(addr.id)}
                                className="text-[10px] font-bold text-neutral-500 hover:text-[#9e7144] underline cursor-pointer"
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
                    ))
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {/* 4. Help Center Page */}
      {activeModal === 'help' && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto animate-fadeIn flex flex-col">
          <header className="sticky top-0 z-40 bg-white border-b border-[#eae5dc] px-4 sm:px-8 py-3.5">
            <div className="max-w-xl mx-auto flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="flex items-center gap-2 text-xs font-bold text-[#141414] hover:text-[#9e7144] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-[#141414]" />
                <span>Back</span>
              </button>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#9e7144]">Help Center</h3>
            </div>
          </header>

          <main className="flex-1 max-w-xl w-full mx-auto px-4 sm:px-6 py-6">
            <div className="space-y-4">
              <div className="border-b border-[#f0f1f3] pb-3">
                <h2 className="text-lg font-bold text-[#141414]">PARZIO 24×7 Help Center</h2>
                <p className="text-xs text-[#717478] mt-0.5">Direct concierge support &amp; order assistance</p>
              </div>

              <div className="space-y-4 text-xs text-[#444748]">
                <div className="p-4 bg-[#faf7f2] rounded-xl border border-[#eae5dc] space-y-1.5">
                  <p className="font-bold text-xs text-[#141414]">WhatsApp Support</p>
                  <p className="text-[11px] text-[#717478]">Instant assistance for order, delivery tracking, and returns</p>
                  <a
                    href="https://wa.me/917033656752"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline pt-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>+91 7033656752</span>
                  </a>
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#eae5dc] space-y-2 text-xs leading-relaxed">
                  <p>• <strong>Delivery:</strong> 2–4 business days via BlueDart / Delhivery</p>
                  <p>• <strong>Warranty:</strong> 316L Surgical Steel shower, sweat &amp; perfume safe</p>
                  <p>• <strong>Returns:</strong> 7-day hassle-free doorstep reverse pickup</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}

      {/* 5. Privacy Policy Page (Govt of India E-Commerce & DPDP Act Compliant) */}
      {activeModal === 'privacy' && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto animate-fadeIn flex flex-col">
          <header className="sticky top-0 z-40 bg-white border-b border-[#eae5dc] px-4 sm:px-8 py-3.5">
            <div className="max-w-2xl mx-auto flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="flex items-center gap-2 text-xs font-bold text-[#141414] hover:text-[#9e7144] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-[#141414]" />
                <span>Back</span>
              </button>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#9e7144]">Privacy Policy</h3>
            </div>
          </header>

          <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-6 text-xs text-[#333]">
            <div className="space-y-5 leading-relaxed">
              <div className="border-b border-[#f0f1f3] pb-3">
                <h1 className="text-lg sm:text-xl font-bold text-[#141414]">PARZIO Privacy &amp; Data Protection Policy</h1>
                <p className="text-xs text-[#717478] mt-1">
                  Compliant with the Information Technology Act, 2000, Consumer Protection (E-Commerce) Rules, 2020 &amp; DPDP Act.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-sm text-[#141414] mb-1">1. Information We Collect</h3>
                  <p className="text-[#555]">
                    When you place an order or create an account, we collect necessary transactional details including your name, delivery address, pincode, mobile number, and email. We do not store credit/debit card numbers or UPI MPINs.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-[#141414] mb-1">2. Purpose of Data Processing</h3>
                  <p className="text-[#555]">
                    Your information is utilized solely for:
                  </p>
                  <ul className="list-disc pl-4 mt-1.5 space-y-1 text-[#555]">
                    <li>Fulfillment and doorstep delivery of your orders via BlueDart &amp; Delhivery.</li>
                    <li>SMS and WhatsApp dispatch notifications and live tracking.</li>
                    <li>Processing payments, tax invoices, and 7-day doorstep returns or exchanges.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-[#141414] mb-1">3. Payment Security &amp; 256-Bit Encryption</h3>
                  <p className="text-[#555]">
                    All online payments (Razorpay &amp; UPI) are processed over end-to-end 256-bit SSL encrypted bank channels. PARZIO never accesses or stores sensitive financial credentials.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-[#141414] mb-1">4. Disclosure &amp; Third-Party Sharing</h3>
                  <p className="text-[#555]">
                    We strictly do not sell, rent, or trade your personal data with third-party advertisers. Data is shared exclusively with licensed logistics couriers for delivery purposes.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-[#141414] mb-1">5. Grievance Redressal Mechanism</h3>
                  <p className="text-[#555]">
                    In accordance with Rule 5(9) of Consumer Protection (E-Commerce) Rules, 2020:
                  </p>
                  <div className="p-4 bg-[#faf8f5] rounded-xl border border-[#eae5dc] mt-2 space-y-1 text-xs">
                    <p><strong>Grievance Officer:</strong> Jitendra Pandit</p>
                    <p><strong>Email:</strong> <a href="mailto:jitendrapandit1764@gmail.com" className="text-[#9e7144] font-semibold underline">jitendrapandit1764@gmail.com</a></p>
                    <p><strong>Phone:</strong> +91 7033656752</p>
                    <p><strong>Operating Address:</strong> Giridih, Jharkhand - 815316, India</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
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
