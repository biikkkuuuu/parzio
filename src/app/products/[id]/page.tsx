"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { notFound, useParams } from "next/navigation";
import { addToCart } from "@/lib/cart";
import { getProductById } from "@/lib/products";
import styles from "./product-details.module.css";

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();
  const product = getProductById(Number(params.id));
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    setAdded(true);
  };

  const handleBuyNow = () => {
    addToCart(product.id, quantity);
    window.location.href = "/checkout";
  };

  return (
    <main className={styles.page}>
      <header className={styles.desktopHeader}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.brand}>
            PARZIO
          </Link>

          <nav className={styles.desktopNav}>
            <Link href="/products">Categories</Link>
            <Link href="/products">Brands</Link>
            <Link href="/offers">Offers</Link>
            <Link href="/products">New Arrivals</Link>
            <Link href="/products">Skincare</Link>
          </nav>

          <div className={styles.headerActions}>
            <Link href="/wishlist" aria-label="Wishlist">
              ♡
            </Link>
            <Link href="/cart" aria-label="Cart">
              🛍
            </Link>
            <Link href="/account" aria-label="Account">
              ◯
            </Link>
          </div>
        </div>
      </header>

      <header className={styles.mobileHeader}>
        <Link href="/products" className={styles.roundButton} aria-label="Back">
          ←
        </Link>

        <Link href="/cart" className={styles.mobileIcon} aria-label="Cart">
          🛍
        </Link>
      </header>

      <section className={styles.container}>
        <nav className={styles.breadcrumbs}>
          <Link href="/">Home</Link>
          <span>›</span>
          <Link href="/products">Skincare</Link>
          <span>›</span>
          <span>{product.name}</span>
        </nav>

        <div className={styles.productLayout}>
          <div className={styles.imageSection}>
            <div className={styles.mainImage}>
              {product.badge && (
                <span className={styles.badge}>{product.badge}</span>
              )}

              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 767px) 100vw, 55vw"
              />
            </div>
          </div>

          <section className={styles.productInfo}>
            <span className={styles.brandName}>{product.brand}</span>

            <h1>{product.name}</h1>

            <div className={styles.rating}>
              <span>★</span>
              <strong>{product.rating}</strong>
              <span>({product.reviews} reviews)</span>
            </div>

            <div className={styles.price}>
              ₹{product.price.toLocaleString("en-IN")}
            </div>

            <p className={styles.tax}>
              Inclusive of all applicable taxes.
            </p>

            <div className={styles.divider} />

            <div className={styles.description}>
              <h2>Description</h2>
              <p>{product.description}</p>
            </div>

            <div className={styles.quantity}>
              <span>Quantity</span>

              <div>
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() =>
                    setQuantity((current) => Math.max(1, current - 1))
                  }
                >
                  −
                </button>

                <strong>{quantity}</strong>

                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((current) => current + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className={styles.purchaseActions}>
              <button
                type="button"
                className={styles.cartButton}
                onClick={handleAddToCart}
              >
                {added ? "Added to Cart ✓" : "Add to Cart"}
              </button>

              <button
                type="button"
                className={styles.buyButton}
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
            </div>

            <div className={styles.shippingInfo}>
              <div>
                <strong>Free Delivery</strong>
                <span>On orders above ₹999</span>
              </div>

              <div>
                <strong>Easy Returns</strong>
                <span>Simple return experience</span>
              </div>

              <div>
                <strong>Authentic Products</strong>
                <span>100% genuine beauty products</span>
              </div>
            </div>
          </section>
        </div>

        <section className={styles.details}>
          <div className={styles.tabs}>
            <button className={styles.activeTab}>Description</button>
            <button>Ingredients</button>
            <button>How to Use</button>
          </div>

          <div className={styles.detailsGrid}>
            <div>
              <p>{product.description}</p>
            </div>

            <div className={styles.benefits}>
              <h2>Product Details</h2>

              <ul>
                <li>✓ Premium {product.category.toLowerCase()} product.</li>
                <li>✓ Rated {product.rating}/5 by customers.</li>
                <li>✓ Suitable for your everyday beauty routine.</li>
              </ul>
            </div>
          </div>
        </section>
      </section>

      <div className={styles.mobilePurchaseBar}>
        <button
          type="button"
          className={styles.mobileCartButton}
          onClick={handleAddToCart}
        >
          {added ? "Added ✓" : "Add to Cart"}
        </button>

        <button
          type="button"
          className={styles.mobileBuyButton}
          onClick={handleBuyNow}
        >
          Buy Now
        </button>
      </div>

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

        <Link href="/cart">
          <span>🛍</span>
          Cart
        </Link>

        <Link href="/account">
          <span>◯</span>
          Account
        </Link>
      </nav>

      <footer className={styles.footer}>
        <div>
          <strong>PARZIO</strong>
          <p>© 2026 PARZIO India. Premium Beauty Marketplace.</p>
        </div>

        <div>
          <Link href="/help">Authenticity Guaranteed</Link>
          <Link href="/help">Free Shipping over ₹500</Link>
          <Link href="/help">Easy Returns</Link>
        </div>

        <div>
          <Link href="/help">Contact Us</Link>
          <Link href="/help">Privacy Policy</Link>
        </div>
      </footer>
    </main>
  );
}
