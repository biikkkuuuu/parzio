import Image from "next/image";
import Link from "next/link";
import styles from "./cart.module.css";

const cartItems = [
  {
    id: 1,
    brand: "LUMINA",
    name: "Radiance Glow Serum",
    size: "30ml",
    price: 1499,
    quantity: 1,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBL1yaFv08PJ3axK16QzPEMdzTbGNBONmdH6_Sv0zspPbj1gtyqViIJFwt2afYiqYCYMFs6cJ-0ksBf5EEHG0doP-j16YESlTZY8W1_huFQOrv2hmivdMPy4170ES36o6PGJY-i8en9i1rGzYP6E7m3FsuaJHMGgNWSUDEz08bJubOqv9YNNbBk_DEYDCoX7DZ3-ZwYmdON-bEe5jJzM2euEHq9U_NZsmDBo0Y_xkRnlTgbkU4sfqOu",
  },
  {
    id: 2,
    brand: "BOTANICA",
    name: "Hydrating Skin Cream",
    size: "50ml",
    price: 1199,
    quantity: 1,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAprxoZl6cvq_VALB5FRKww091uHtSRhBXdTgeq_1MgKkD8u9KF61CLXIsmhJo33JbnznNoaED1-ao2NqIGQJztU5mZMIFGnqpZ2VJQlVfqkqH7tFKrDPXTS9gh3sUQdXZln3l1Z1eN7QrPdqH4bZkIIJKYXnGmh66uZ4w-_b-BktJ8WqGA32GC5Boi3RWgqyQ6Z_mLfr7XJ4Xj1oDXyLHhOt8zMC5lKfHxBM2eXs9oY-a-Y5yOcLJL",
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
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const total = subtotal + shipping;

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
            <p>{cartItems.length} items in your cart</p>
          </div>

          <Link href="/products" className={styles.continueShopping}>
            ← Continue Shopping
          </Link>
        </div>

        <div className={styles.cartLayout}>
          <section className={styles.itemsCard}>
            {cartItems.map((item) => (
              <article key={item.id} className={styles.cartItem}>
                <div className={styles.productImage}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="160px"
                  />
                </div>

                <div className={styles.itemDetails}>
                  <p className={styles.brandName}>{item.brand}</p>
                  <h2>{item.name}</h2>
                  <p className={styles.size}>Size: {item.size}</p>

                  <button type="button" className={styles.removeButton}>
                    Remove
                  </button>
                </div>

                <div className={styles.itemControls}>
                  <div className={styles.quantity}>
                    <button type="button" aria-label="Decrease quantity">
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button type="button" aria-label="Increase quantity">
                      +
                    </button>
                  </div>

                  <strong>{formatPrice(item.price * item.quantity)}</strong>
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
              <strong>{shipping === 0 ? "FREE" : formatPrice(shipping)}</strong>
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