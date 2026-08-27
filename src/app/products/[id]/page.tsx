import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById, products } from "@/lib/products";
import styles from "./product-details.module.css";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({
    id: String(product.id),
  }));
}

export default async function ProductDetailsPage({ params }: Props) {
  const { id } = await params;
  const product = getProductById(Number(id));

  if (!product) {
    notFound();
  }

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

            <p className={styles.tax}>Inclusive of all applicable taxes.</p>

            <div className={styles.divider} />

            <div className={styles.description}>
              <h2>Description</h2>
              <p>{product.description}</p>
            </div>

            <div className={styles.quantity}>
              <span>Quantity</span>

              <div>
                <button type="button" aria-label="Decrease quantity">
                  −
                </button>
                <strong>1</strong>
                <button type="button" aria-label="Increase quantity">
                  +
                </button>
              </div>
            </div>

            <div className={styles.purchaseActions}>
              <button type="button" className={styles.cartButton}>
                Add to Cart
              </button>

              <button type="button" className={styles.buyButton}>
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
        <button type="button" className={styles.mobileCartButton}>
          Add to Cart
        </button>

        <button type="button" className={styles.mobileBuyButton}>
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