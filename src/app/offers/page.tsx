"use client";

import Link from "next/link";
import styles from "./offers.module.css";

const offers = [
  {
    title: "Glow Essentials",
    description: "Save on selected skincare essentials.",
    discount: "UP TO 40% OFF",
    code: "GLOW40",
    category: "Skincare",
  },
  {
    title: "Beauty Weekend",
    description: "Extra savings across makeup and beauty.",
    discount: "FLAT 25% OFF",
    code: "BEAUTY25",
    category: "Makeup",
  },
  {
    title: "First Order",
    description: "Welcome offer for your first PARZIO order.",
    discount: "₹300 OFF",
    code: "WELCOME300",
    category: "All Beauty",
  },
];

export default function OffersPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.brand}>
            PARZIO
          </Link>

          <nav className={styles.nav}>
            <Link href="/products">Categories</Link>
            <Link href="/products">Brands</Link>
            <Link href="/offers" className={styles.activeNav}>
              Offers
            </Link>
            <Link href="/products">New Arrivals</Link>
          </nav>

          <div className={styles.actions}>
            <Link href="/wishlist">♡</Link>
            <Link href="/cart">🛍</Link>
            <Link href="/account">◯</Link>
          </div>
        </div>
      </header>

      <section className={styles.container}>
        <div className={styles.mobileTop}>
          <Link href="/">←</Link>
          <h1>Offers</h1>
        </div>

        <div className={styles.hero}>
          <span>PARZIO OFFERS</span>
          <h1>More beauty.<br />Better value.</h1>
          <p>
            Discover limited-time offers and exclusive savings across your
            favourite beauty categories.
          </p>
          <Link href="/products">Shop Offers →</Link>
        </div>

        <div className={styles.sectionHeader}>
          <div>
            <h2>Latest Offers</h2>
            <p>Save more on curated beauty essentials.</p>
          </div>
        </div>

        <section className={styles.offerGrid}>
          {offers.map((offer) => (
            <article key={offer.code} className={styles.offerCard}>
              <div className={styles.offerTop}>
                <span>{offer.category}</span>
                <strong>{offer.discount}</strong>
              </div>

              <div className={styles.offerBody}>
                <h3>{offer.title}</h3>
                <p>{offer.description}</p>

                <div className={styles.code}>
                  <span>USE CODE</span>
                  <strong>{offer.code}</strong>
                </div>

                <Link href="/products">Shop Now →</Link>
              </div>
            </article>
          ))}
        </section>

        <section className={styles.infoGrid}>
          <div>
            <span>01</span>
            <h3>Authenticity Guaranteed</h3>
            <p>Shop genuine beauty products from trusted brands.</p>
          </div>

          <div>
            <span>02</span>
            <h3>Secure Checkout</h3>
            <p>Your payment information stays protected.</p>
          </div>

          <div>
            <span>03</span>
            <h3>Easy Returns</h3>
            <p>Simple returns on eligible products.</p>
          </div>
        </section>
      </section>

      <footer className={styles.footer}>
        <div>
          <strong>PARZIO</strong>
          <p>Premium beauty marketplace.</p>
        </div>

        <div>
          <Link href="/products">Shop</Link>
          <Link href="/wishlist">Wishlist</Link>
        </div>

        <div>
          <Link href="/help">Help Center</Link>
          <Link href="#">Privacy Policy</Link>
        </div>
      </footer>

      <nav className={styles.mobileNav}>
        <Link href="/">
          <span>⌂</span>
          Home
        </Link>
        <Link href="/products">
          <span>⌕</span>
          Shop
        </Link>
        <Link href="/offers" className={styles.mobileActive}>
          <span>⌁</span>
          Offers
        </Link>
        <Link href="/cart">
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