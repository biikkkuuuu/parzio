import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem } from '../types';

interface CartState {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedColor?: string, selectedColorImage?: string) => void;
  removeFromCart: (productId: string, selectedColor?: string) => void;
  updateQuantity: (productId: string, delta: number, selectedColor?: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      
      addToCart: (product, quantity = 1, selectedColor, selectedColorImage) => {
        set((state) => {
          const colorKey = selectedColor || undefined;
          const existingIndex = state.cartItems.findIndex(
            (item) => item.product.id === product.id && item.selectedColor === colorKey
          );

          if (existingIndex >= 0) {
            const updated = [...state.cartItems];
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity + quantity
            };
            return { cartItems: updated };
          }

          return {
            cartItems: [
              ...state.cartItems,
              {
                product,
                quantity,
                selectedColor: colorKey,
                selectedColorImage: selectedColorImage || (colorKey && product.colorVariants?.find(v => v.name === colorKey)?.image) || product.image
              }
            ]
          };
        });
      },
      
      removeFromCart: (productId, selectedColor) => {
        set((state) => ({
          cartItems: state.cartItems.filter(
            (item) => !(item.product.id === productId && (!selectedColor || item.selectedColor === selectedColor))
          )
        }));
      },
      
      updateQuantity: (productId, delta, selectedColor) => {
        set((state) => {
          const existingIndex = state.cartItems.findIndex(
            (item) => item.product.id === productId && (!selectedColor || item.selectedColor === selectedColor)
          );
          if (existingIndex === -1) return state;

          const currentItem = state.cartItems[existingIndex];
          const newQty = currentItem.quantity + delta;
          if (newQty <= 0) {
            return {
              cartItems: state.cartItems.filter((_, idx) => idx !== existingIndex)
            };
          }

          const updated = [...state.cartItems];
          updated[existingIndex] = {
            ...currentItem,
            quantity: newQty
          };
          return { cartItems: updated };
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
