"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { products } from "@/lib/products";
import styles from "./cart.module.css";

type CartItem = {
  productId: number;
  quantity: number;
};

const initialCart: CartItem[] = [
  {
    productId: 1,
    quantity: 1,
  },
  {
    productId: 3,
    quantity: 1,
  },
];

const shipping = 0;

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCart);

  const items = useMemo(() => {
    return cartItems
      .map((cartItem) => {
        const product = products.find(
          (item) => item.id === cartItem.productId,
        );

        if (!product) return null;

        return {
          ...product,
          quantity: cartItem.quantity,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [cartItems]);

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const total = subtotal + shipping;

  const updateQuantity = (productId: number, change: number) => {
    setCartItems((current) =>
      current.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + change),
            }
          : item,
      ),
    );
  };

  const removeItem = (productId: number) => {
    setCartItems((current) =>
      current.filter((item) => item.productId !== productId),
    );
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

        {items.length > 0 ? (
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
                        aria-label={`Decrease ${item.name} quantity`}
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        type="button"
                        aria-label={`Increase ${item.name} quantity`}
                        onClick={() => updateQuantity(item.id, 1)}
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

              <div className={styles.trust}>
                <div>
                  <span>✓</span>
                  <p>
                    <strong>Authenticity Guaranteed</strong>
                    100% genuine products
                  </p>
                </div>

                <div>
                  <span>✓</span>
                  <p>
                    <strong>Secure Payments</strong>
                    Safe & encrypted checkout
                  </p>
                </div>

                <div>
                  <span>✓</span>
                  <p>
                    <strong>Easy Returns</strong>
                    Hassle-free returns
                  </p>
                </div>
              </div>
            </aside>
          </div>
        ) : (
          <section className={styles.emptyCart}>
            <div>🛍</div>
            <h2>Your cart is empty</h2>
            <p>Add some products to your cart and come back here.</p>
            <Link href="/products">Start Shopping</Link>
          </section>
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
