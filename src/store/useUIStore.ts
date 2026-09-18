import { create } from 'zustand';
import { ActiveScreen } from '../types';

interface UIState {
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (isOpen: boolean) => void;
  
  isSearchOpen: boolean;
  setIsSearchOpen: (isOpen: boolean) => void;
  
  isWishlistOpen: boolean;
  setIsWishlistOpen: (isOpen: boolean) => void;
  
  isDrawerOpen: boolean;
  setIsDrawerOpen: (isOpen: boolean) => void;
  
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCartOpen: false,
  setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
  
  isCheckoutOpen: false,
  setIsCheckoutOpen: (isOpen) => set({ isCheckoutOpen: isOpen }),
  
  isSearchOpen: false,
  setIsSearchOpen: (isOpen) => set({ isSearchOpen: isOpen }),
  
  isWishlistOpen: false,
  setIsWishlistOpen: (isOpen) => set({ isWishlistOpen: isOpen }),
  
  isDrawerOpen: false,
  setIsDrawerOpen: (isOpen) => set({ isDrawerOpen: isOpen }),
  
  activeScreen: 'storefront',
  setActiveScreen: (screen) => set({ activeScreen: screen }),
}));
