"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./wishlist.module.css";

type WishlistItem = {
  id: number;
  brand: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
};

const initialItems: WishlistItem[] = [
  {
    id: 1,
    brand: "LUMINA",
    name: "Radiance Glow Serum",
    price: 1499,
    oldPrice: 2100,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBL1yaFv08PJ3axK16QzPEMdzTbGNBONmdH6_Sv0zspPbj1gtyqViIJFwt2afYiqYCYMFs6cJ-0ksBf5EEHG0doP-j16YESlTZY8W1_huFQOrv2hmivdMPy4170ES36o6PGJY-i8en9i1rGzYP6E7m3FsuaJHMGgNWSUDEz08bJubOqv9YNNbBk_DEYDCoX7DZ3-ZwYmdON-bEe5jJzM2euEHq9U_NZsmDBo0Y_xkRnlTgbkU4sfqOu",
  },
  {
    id: 2,
    brand: "BOTANICA",
    name: "Hydrating Skin Cream",
    price: 1199,
    oldPrice: 1599,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAprxoZl6cvq_VALB5FRKww091uHtSRhBXdTgeq_1MgKkD8u9KF61CLXIsmhJo33JbnznNoaED1-ao2NqIGQJztU5mZMIFGnqpZ2VJQlVfqkqH7tFKrDPXTS9gh3sUQdXZln3l1Z1eN7QrPdqH4bZkIIJKYXnGmh66uZ4w-_b-BktJ8WqGA32GC5Boi3RWgqyQ6Z_mLfr7XJ4Xj1oDXyLHhOt8zMC5lKfHxBM2eXs9oY-a-Y5yOcLJL",
  },
  {
    id: 3,
    brand: "AURA",
    name: "Gentle Purifying Cleanser",
    price: 950,
    oldPrice: 1200,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDXyilgB8Mwxqx2cpQHyh6xhkkLL23CqADks5EJn37lQ7qny3Y9mhoJvgXNi66opdmpzbN9GLdPC6JN0ss_g7ewipMJbpNJhuwGsn_DutQ0YBm9kF0TGJ9rTYUXOBJ9xo0MZer2aasptzfs8jMMGP0Pczh9Yvf0UeL3c3ZWlCjLvw68VIAC8qGCv8INseV3UxvTdr_TFvquQRohdvtNnbHpaEy6XIel-BiQkjVnNPEsroV5q5gRow9h",
  },
  {
    id: 4,
    brand: "SOLARIS",
    name: "Daily UV Shield SPF 50",
    price: 1299,
    oldPrice: 1699,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD7g9Q2M4X8N3F1H5R7K6T2W8P9L4V6Y0B3C2D8J1S5",
  },
];

export default function WishlistPage() {
  const [items, setItems] = useState(initialItems);

  const removeItem = (id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

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
            <Link href="/offers">Offers</Link>
            <Link href="/products">New Arrivals</Link>
          </nav>

          <div className={styles.headerActions}>
            <Link href="/wishlist" className={styles.activeAction}>
              ♡
            </Link>
            <Link href="/cart">🛍</Link>
            <Link href="/account">◯</Link>
          </div>
        </div>
      </header>

      <section className={styles.container}>
        <div className={styles.mobileTop}>
          <Link href="/" aria-label="Back">
            ←
          </Link>
          <span>Wishlist</span>
        </div>

        <div className={styles.titleRow}>
          <div>
            <h1>My Wishlist</h1>
            <p>
              {items.length} {items.length === 1 ? "item" : "items"} saved for
              later.
            </p>
          </div>

          <Link href="/products" className={styles.shopButton}>
            Continue Shopping
          </Link>
        </div>

        {items.length > 0 ? (
          <>
            <div className={styles.grid}>
              {items.map((item) => (
                <article key={item.id} className={styles.card}>
                  <div className={styles.imageWrap}>
                    <Link href={`/products/${item.id}`}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 767px) 50vw, (max-width: 1100px) 33vw, 25vw"
                      />
                    </Link>

                    <button
                      type="button"
                      className={styles.remove}
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.name} from wishlist`}
                    >
                      ×
                    </button>
                  </div>

                  <div className={styles.content}>
                    <span className={styles.brandName}>{item.brand}</span>

                    <Link
                      href={`/products/${item.id}`}
                      className={styles.productName}
                    >
                      {item.name}
                    </Link>

                    <div className={styles.priceRow}>
                      <strong>₹{item.price.toLocaleString("en-IN")}</strong>

                      {item.oldPrice && (
                        <span>
                          ₹{item.oldPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>

                    <button type="button" className={styles.cartButton}>
                      Add to Cart
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <section className={styles.benefits}>
              <div>
                <strong>Authenticity Guaranteed</strong>
                <span>100% genuine products</span>
              </div>

              <div>
                <strong>Secure Payments</strong>
                <span>Safe & encrypted checkout</span>
              </div>

              <div>
                <strong>Easy Returns</strong>
                <span>Simple return experience</span>
              </div>
            </section>
          </>
        ) : (
          <section className={styles.empty}>
            <div className={styles.emptyIcon}>♡</div>

            <h2>Your wishlist is empty</h2>

            <p>
              Save products you love and come back to them anytime.
            </p>

            <Link href="/products" className={styles.emptyButton}>
              Discover Products
            </Link>
          </section>
        )}
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

      <nav className={styles.mobileNav}>
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