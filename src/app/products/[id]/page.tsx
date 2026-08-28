
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { addToCart, getCart, updateCartQuantity } from "@/lib/cart";
import { getProductById } from "@/lib/products";
import styles from "./product-details.module.css";

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const product = getProductById(Number(params.id));

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);

  if (!product) {
    notFound();
  }

  useEffect(() => {
    if (!product) return;
    
    const cart = getCart();
    const existing = cart.find(item => item.productId === product.id);

    if (existing) {
      if (!initialLoaded) {
        setQuantity(existing.quantity);
        setInitialLoaded(true);
      }
      // THE MAGIC: Yahan pe check ho raha hai ki user ne + dabaya ya nahi
      setAdded(existing.quantity === quantity);
    } else {
      setAdded(false);
    }
  }, [product, quantity, initialLoaded]);

  
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Universal handler taaki tumhara UI kisi bhi type se quantity pass kare, wo handle ho jaye
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleQuantityChange = (value: any) => {
    if (typeof value === 'string') {
      const val = value.toLowerCase();
      if (val.includes('inc') || val === 'add' || val === 'plus') {
        setQuantity(prev => prev + 1);
        return;
      }
      if (val.includes('dec') || val === 'sub' || val === 'minus') {
        setQuantity(prev => Math.max(1, prev - 1));
        return;
      }
    }
    if (value === 1) setQuantity(prev => prev + 1);
    else if (value === -1) setQuantity(prev => Math.max(1, prev - 1));
    else if (typeof value === 'number') setQuantity(Math.max(1, value));
    else if (value && value.target) setQuantity(Math.max(1, Number(value.target.value) || 1));
  };
  
  const handleAddToCart = (e?: any) => {
    if (e && e.preventDefault) e.preventDefault();
    const cart = getCart();
    const existing = cart.find((item) => item.productId === product.id);
    
    if (existing) {
      updateCartQuantity(product.id, quantity);
    } else {
      addToCart(product.id, quantity);
    }
    
    setAdded(true);
    window.dispatchEvent(new Event("cart-updated"));
  };

  const handleBuyNow = (e?: any) => {
    if (e && e.preventDefault) e.preventDefault();
    const cart = getCart();
    const existing = cart.find((item) => item.productId === product.id);
    
    if (existing) {
      updateCartQuantity(product.id, quantity);
    } else {
      addToCart(product.id, quantity);
    }
    
    window.dispatchEvent(new Event("cart-updated"));
    router.push("/cart");
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
        <Link
          href="/products"
          className={styles.roundButton}
          aria-label="Back"
        >
          ←
        </Link>

        <Link href="/cart" aria-label="Cart">
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
                  onClick={() => handleQuantityChange(quantity - 1)}
                >
                  −
                </button>

                <strong>{quantity}</strong>

                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => handleQuantityChange(quantity + 1)}
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
                disabled={!mounted}
              >
                {added ? "Added to Cart ✓" : "Add to Cart"}
              </button>

              <button
                type="button"
                className={styles.buyButton}
                onClick={handleBuyNow}
                disabled={!mounted}
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
                <li>
                  ✓ Premium {product.category.toLowerCase()} product.
                </li>
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
          disabled={!mounted}
        >
          {added ? "Added ✓" : "Add to Cart"}
        </button>

        <button
          type="button"
          className={styles.mobileBuyButton}
          onClick={handleBuyNow}
          disabled={!mounted}
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
