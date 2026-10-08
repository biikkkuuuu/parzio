import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem } from '../types';

interface CartState {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      
      addToCart: (product, quantity = 1) => {
        set((state) => {
          const existing = state.cartItems.find(item => item.product.id === product.id);
          if (existing) {
            return {
              cartItems: state.cartItems.map(item =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            };
          }
          return { cartItems: [...state.cartItems, { product, quantity }] };
        });
      },
      
      removeFromCart: (productId) => {
        set((state) => ({
          cartItems: state.cartItems.filter(item => item.product.id !== productId)
        }));
      },
      
      updateQuantity: (productId, delta) => {
        set((state) => {
          const existing = state.cartItems.find(item => item.product.id === productId);
          if (!existing) return state;
          const newQty = existing.quantity + delta;
          if (newQty <= 0) {
            return {
              cartItems: state.cartItems.filter(item => item.product.id !== productId)
            };
          }
          return {
            cartItems: state.cartItems.map(item =>
              item.product.id === productId ? { ...item, quantity: newQty } : item
            )
          };
        });
      },
      
      clearCart: () => set({ cartItems: [] }),
      
      getCartTotal: () => {
        return get().cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
      }
    }),
    {
      name: 'parzio_cart_items',
    }
  )
);
