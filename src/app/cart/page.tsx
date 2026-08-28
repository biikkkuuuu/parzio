"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  getCart,
  getCartProducts,
  removeFromCart,
  updateCartQuantity,
  type CartItem,
} from "@/lib/cart";
import { products } from "@/lib/products";
import styles from "./cart.module.css";

const shipping = 0;

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setCartItems(getCart());
    setMounted(true);
  }, []);

  const items = useMemo(() => {
    if (!mounted) return [];
    return getCartProducts(products);
  }, [cartItems, mounted]);

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const total = subtotal + shipping;

  const changeQuantity = (productId: number, change: number) => {
    const current = cartItems.find((item) => item.productId === productId);

    if (!current) return;

    const updated = updateCartQuantity(
      productId,
      Math.max(1, current.quantity + change),
    );

    setCartItems(updated);
  };

  const removeItem = (productId: number) => {
    const updated = removeFromCart(productId);
    setCartItems(updated);
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.brand}>
            PARZIO
          </Link>

          <nav className={styles.nav}>
            <Link href="/products">Shop</Link>
            <Link href="/offers">Offers</Link>
            <Link href="/account">Account</Link>
          </nav>

          <div className={styles.secureCheckout}>
            <span>🔒</span>
            Secure Checkout
          </div>
        </div>
      </header>

      <section className={styles.container}>
        <div className={styles.breadcrumbs}>
          <Link href="/">Home</Link>
          <span>›</span>
          <span>Cart</span>
        </div>

        <div className={styles.titleRow}>
          <div>
            <h1>Your Cart</h1>
            <p>
              {items.length} {items.length === 1 ? "item" : "items"} in your
              cart
            </p>
          </div>

          <Link href="/products" className={styles.continueShopping}>
            ← Continue Shopping
          </Link>
        </div>

        {!mounted ? (
          <div className={styles.emptyCart}>
            <p>Loading your cart...</p>
          </div>
        ) : items.length === 0 ? (
          <section className={styles.emptyCart}>
            <div>🛍</div>
            <h2>Your cart is empty</h2>
            <p>Add some products to your cart and come back here.</p>

            <Link href="/products">Start Shopping</Link>
          </section>
        ) : (
          <div className={styles.cartLayout}>
            <section className={styles.itemsCard}>
              {items.map((item) => (
                <article key={item.id} className={styles.cartItem}>
                  <Link
                    href={`/products/${item.id}`}
                    className={styles.productImage}
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="160px"
                    />
                  </Link>

                  <div className={styles.itemDetails}>
                    <p className={styles.brandName}>{item.brand}</p>

                    <Link
                      href={`/products/${item.id}`}
                      className={styles.productName}
                    >
                      {item.name}
                    </Link>

                    <p className={styles.size}>
                      {item.category} · Qty {item.quantity}
                    </p>

                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>

                  <div className={styles.itemControls}>
                    <div className={styles.quantity}>
                      <button
                        type="button"
                        onClick={() => changeQuantity(item.id, -1)}
                        aria-label={`Decrease ${item.name} quantity`}
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        type="button"
                        onClick={() => changeQuantity(item.id, 1)}
                        aria-label={`Increase ${item.name} quantity`}
                      >
                        +
                      </button>
                    </div>

                    <strong>
                      {formatPrice(item.price * item.quantity)}
                    </strong>
                  </div>
                </article>
              ))}

              <div className={styles.coupon}>
                <div>
                  <h3>Have a coupon?</h3>
                  <p>Apply your promo code before checkout.</p>
                </div>

                <div className={styles.couponForm}>
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    aria-label="Coupon code"
                  />
                  <button type="button">Apply</button>
                </div>
              </div>
            </section>

            <aside className={styles.summary}>
              <h2>Order Summary</h2>

              <div className={styles.summaryLine}>
                <span>Subtotal</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>

              <div className={styles.summaryLine}>
                <span>Shipping</span>
                <strong>
                  {shipping === 0 ? "FREE" : formatPrice(shipping)}
                </strong>
              </div>

              <div className={styles.divider} />

              <div className={styles.total}>
                <span>Total</span>
                <strong>{formatPrice(total)}</strong>
              </div>

              <p className={styles.taxNote}>
                Inclusive of all applicable taxes.
              </p>

              <Link href="/checkout" className={styles.checkoutButton}>
                Proceed to Checkout
              </Link>
            </aside>
          </div>
        )}
      </section>

      <nav className={styles.mobileBottomNav}>
        <Link href="/">
          <span>⌂</span>
          Home
        </Link>

        <Link href="/products">
          <span>⌕</span>
          Shop
        </Link>

        <Link href="/offers">
          <span>⌁</span>
          Offers
        </Link>

        <Link href="/cart" className={styles.activeNav}>
          <span>🛍</span>
          Cart
        </Link>

        <Link href="/account">
          <span>◯</span>
          Account
        </Link>
      </nav>
    </main>
  );
}
