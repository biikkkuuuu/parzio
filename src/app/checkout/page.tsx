import Link from "next/link";
import styles from "./checkout.module.css";

export default function CheckoutPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.brand}>
            PARZIO
          </Link>

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

        <div className={styles.checkoutLayout}>
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

              <label className={styles.checkbox}>
                <input type="checkbox" />
                <span>Send me order updates and offers</span>
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
                    <option>Maharashtra</option>
                    <option>Delhi</option>
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
                    inputMode="tel"
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
                  <p>All transactions are securely encrypted.</p>
                </div>
              </div>

              <div className={styles.paymentOptions}>
                <label className={styles.paymentOption}>
                  <input
                    type="radio"
                    name="payment"
                    defaultChecked
                  />
                  <span>
                    <strong>UPI</strong>
                    <small>Google Pay, PhonePe, Paytm and more</small>
                  </span>
                </label>

                <label className={styles.paymentOption}>
                  <input type="radio" name="payment" />
                  <span>
                    <strong>Credit / Debit Card</strong>
                    <small>Visa, Mastercard, RuPay and more</small>
                  </span>
                </label>

                <label className={styles.paymentOption}>
                  <input type="radio" name="payment" />
                  <span>
                    <strong>Cash on Delivery</strong>
                    <small>Pay when your order arrives</small>
                  </span>
                </label>
              </div>
            </div>

            <button className={styles.placeOrder}>
              Place Order
            </button>
          </section>

          <aside className={styles.summaryCard}>
            <h2>Order Summary</h2>

            <div className={styles.summaryItem}>
              <div>
                <strong>LUMINA</strong>
                <span>Radiance Glow Serum · 30ml × 1</span>
              </div>
              <strong>₹1,499</strong>
            </div>

            <div className={styles.summaryItem}>
              <div>
                <strong>BOTANICA</strong>
                <span>Hydrating Skin Cream · 50ml × 1</span>
              </div>
              <strong>₹1,199</strong>
            </div>

            <div className={styles.divider} />

            <div className={styles.priceLine}>
              <span>Subtotal</span>
              <strong>₹2,698</strong>
            </div>

            <div className={styles.priceLine}>
              <span>Shipping</span>
              <strong className={styles.free}>FREE</strong>
            </div>

            <div className={styles.divider} />

            <div className={styles.total}>
              <span>Total</span>
              <strong>₹2,698</strong>
            </div>

            <p className={styles.taxNote}>
              Inclusive of all applicable taxes.
            </p>

            <div className={styles.trust}>
              <span>✓</span>
              <div>
                <strong>Secure Checkout</strong>
                <p>Your payment information is protected.</p>
              </div>
            </div>

            <Link href="/cart" className={styles.backToCart}>
              ← Edit Cart
            </Link>
          </aside>
        </div>
      </section>

      <footer className={styles.footer}>
        <div>
          <strong>PARZIO</strong>
          <p>Premium beauty marketplace.</p>
        </div>

        <div>
          <Link href="/help">Help Center</Link>
          <Link href="#">Shipping & Returns</Link>
        </div>

        <div>
          <Link href="#">Privacy Policy</Link>
          <Link href="#">Terms of Service</Link>
        </div>
      </footer>
    </main>
  );
}