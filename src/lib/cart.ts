import type { Product } from "@/types/product";

export type CartItem = {
  productId: number;
  quantity: number;
};

const CART_STORAGE_KEY = "parzio-cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item): item is CartItem =>
        typeof item?.productId === "number" &&
        typeof item?.quantity === "number" &&
        item.quantity > 0,
    );
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart-updated"));
}

export function addToCart(productId: number, quantity = 1) {
  const cart = getCart();

  const existing = cart.find((item) => item.productId === productId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      productId,
      quantity,
    });
  }

  saveCart(cart);

  return cart;
}

export function updateCartQuantity(
  productId: number,
  quantity: number,
) {
  const cart = getCart();

  const updated = cart
    .map((item) =>
      item.productId === productId
        ? { ...item, quantity }
        : item,
    )
    .filter((item) => item.quantity > 0);

  saveCart(updated);

  return updated;
}

export function removeFromCart(productId: number) {
  const cart = getCart().filter(
    (item) => item.productId !== productId,
  );

  saveCart(cart);

  return cart;
}

export function clearCart() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(CART_STORAGE_KEY);
}

export function getCartProducts(products: Product[]) {
  return getCart()
    .map((cartItem) => {
      const product = products.find(
        (item) => item.id === cartItem.productId,
      );

      if (!product) {
        return null;
      }

      return {
        ...product,
        quantity: cartItem.quantity,
      };
    })
    .filter(
      (
        item,
      ): item is Product & { quantity: number } => item !== null,
    );
}