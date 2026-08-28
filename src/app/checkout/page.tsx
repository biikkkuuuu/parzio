"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getCart, getCartProducts, clearCart, type CartItem } from "@/lib/cart";
import { products } from "@/lib/products";
import styles from "./checkout.module.css";

const shipping = 0;

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [placed, setPlaced] = useState(false);
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
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const total = subtotal + shipping;

  const handlePlaceOrder = () => {
    if (items.length === 0) return;

    clearCart();
    setPlaced(true);
  };

  if (!mounted) {
    return (
      <main className={styles.page}>
        <section className={styles.successPage}>
          <p>Loading checkout...</p>
        </section>
      </main>
    );
  }

  if (items.length === 0 && !placed) {
    return (
      <main className={styles.page}>
        <section className={styles.successPage}>
          <div className={styles.successIcon}>🛍</div>

          <span className={styles.eyebrow}>YOUR CART IS EMPTY</span>

          <h1>No items to checkout.</h1>

          <p>
            Add a product to your cart before proceeding to checkout.
          </p>

          <div className={styles.successActions}>
            <Link href="/products">Continue Shopping</Link>
            <Link href="/cart">View Cart</Link>
          </div>
        </section>
      </main>
    );
  }

  if (placed) {
    return (
      <main className={styles.page}>
        <section className={styles.successPage}>
          <div className={styles.successIcon}>✓</div>

          <span className={styles.eyebrow}>ORDER CONFIRMED</span>

          <h1>Thank you for your order.</h1>

          <p>
            Your PARZIO order has been placed successfully. Your order
            confirmation and tracking details will be available in your
            account.
          </p>

          <div className={styles.orderNumber}>
            <span>ORDER ID</span>
            <strong>PRZ-{Math.floor(10000 + Math.random() * 89999)}</strong>
          </div>

          <div className={styles.successActions}>
            <Link href="/orders">View My Orders</Link>
            <Link href="/products">Continue Shopping</Link>
          </div>
        </section>
      </main>
    );
  }

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

          <div className={styles.secure}>
            <span>🔒</span>
            Secure Checkout
          </div>
        </div>
      </header>

      <section className={styles.container}>
        <div className={styles.breadcrumbs}>
          <Link href="/cart">Cart</Link>
          <span>›</span>
          <span>Checkout</span>
        </div>

        <div className={styles.titleBlock}>
          <h1>Checkout</h1>
          <p>Complete your order securely.</p>
        </div>

        <div className={styles.layout}>
          <section className={styles.formArea}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.step}>1</span>
                <div>
                  <h2>Contact Information</h2>
                  <p>We&apos;ll use this to send your order updates.</p>
                </div>
              </div>

              <label>
                Email Address
                <input type="email" placeholder="you@example.com" />
              </label>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.step}>2</span>
                <div>
                  <h2>Delivery Address</h2>
                  <p>Where should we deliver your order?</p>
                </div>
              </div>

              <div className={styles.formGrid}>
                <label>
                  First Name
                  <input type="text" placeholder="First name" />
                </label>

                <label>
                  Last Name
                  <input type="text" placeholder="Last name" />
                </label>

                <label className={styles.full}>
                  Address
                  <input
                    type="text"
                    placeholder="House number, street, area"
                  />
                </label>

                <label>
                  City
                  <input type="text" placeholder="City" />
                </label>

                <label>
                  State
                  <select defaultValue="">
                    <option value="" disabled>
                      Select state
                    </option>
                    <option>Jharkhand</option>
                    <option>Madhya Pradesh</option>
                    <option>Delhi</option>
                    <option>Maharashtra</option>
                    <option>West Bengal</option>
                    <option>Uttar Pradesh</option>
                  </select>
                </label>

                <label>
                  Pincode
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="000000"
                  />
                </label>

                <label>
                  Phone
                  <input
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </label>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.step}>3</span>
                <div>
                  <h2>Payment Method</h2>
                  <p>Choose your preferred payment option.</p>
                </div>
              </div>

              <div className={styles.paymentOptions}>
                <label className={styles.paymentOption}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "upi"}
                    onChange={() => setPaymentMethod("upi")}
                  />

                  <span>
                    <strong>UPI</strong>
                    <small>Google Pay, PhonePe, Paytm and more</small>
                  </span>
                </label>

                <label className={styles.paymentOption}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                  />

                  <span>
                    <strong>Credit / Debit Card</strong>
                    <small>Visa, Mastercard, RuPay and more</small>
                  </span>
                </label>

                <label className={styles.paymentOption}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                  />

                  <span>
                    <strong>Cash on Delivery</strong>
                    <small>Pay when your order arrives</small>
                  </span>
                </label>
              </div>
            </div>

            <button
              type="button"
              className={styles.placeOrder}
              onClick={handlePlaceOrder}
            >
              Place Order · {formatPrice(total)}
            </button>
          </section>

          <aside className={styles.summaryCard}>
            <h2>Order Summary</h2>

            {items.map((item) => (
              <div key={item.id} className={styles.summaryItem}>
                <div>
                  <strong>{item.brand}</strong>
                  <span>
                    {item.name} · Qty {item.quantity}
                  </span>
                </div>

                <strong>
                  {formatPrice(item.price * item.quantity)}
                </strong>
              </div>
            ))}

            <div className={styles.divider} />

            <div className={styles.priceLine}>
              <span>Subtotal</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>

            <div className={styles.priceLine}>
              <span>Shipping</span>
              <strong className={styles.free}>
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

            <Link href="/cart" className={styles.editCart}>
              ← Edit Cart
            </Link>

            <div className={styles.trust}>
              <span>✓</span>
              <div>
                <strong>Secure Checkout</strong>
                <p>Your payment information is protected.</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <footer className={styles.footer}>
        <strong>PARZIO</strong>
        <p>Premium beauty marketplace.</p>
      </footer>
    </main>
  );
}
