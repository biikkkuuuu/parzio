import Image from "next/image";
import Link from "next/link";
import styles from "./product-details.module.css";

const productImages = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBL1yaFv08PJ3axK16QzPEMdzTbGNBONmdH6_Sv0zspPbj1gtyqViIJFwt2afYiqYCYMFs6cJ-0ksBf5EEHG0doP-j16YESlTZY8W1_huFQOrv2hmivdMPy4170ES36o6PGJY-i8en9i1rGzYP6E7m3FsuaJHMGgNWSUDEz08bJubOqv9YNNbBk_DEYDCoX7DZ3-ZwYmdON-bEe5jJzM2euEHq9U_NZsmDBo0Y_xkRnlTgbkU4sfqOu",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAprxoZl6cvq_VALB5FRKww091uHtSRhBXdTgeq_1MgKkD8u9KF61CLXIsmhJo33JbnznNoaED1-ao2NqIGQJztU5mZMIFGnqpZ2VJQlVfqkqH7tFKrDPXTS9gh3sUQdXZln3l1Z1eN7QrPdqH4bZkIIJKYXnGmh66uZ4w-_b-BktJ8WqGA32GC5Boi3RWgqyQ6Z_mLfr7XJ4Xj1oDXyLHhOt8zMC5lKfHxBM2eXs9oY-a-Y5yOcLJL",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDZPobWDPy2HvNkjThEVNuh_GYfRAiozHGGGrAfO-_kKQNB06YWu3FopBDP1-1ZFRwtfJEahJuwAoXu8GeQDsVvmlCQkXD25ywkLflDjMuNRdgmebOnAk6Eu0HmaLGMzll-ymkwUtDRjPoJY5UoS2dswnEHbvmaFO_iO5vRU7Snn1whhvDHKz4TWNPBXNDTQ_bRPajW9OIIS5YkOQXBUcMqio7vS6-t74yqGXMp3LHKzW7e52tOZpb_",
];

export default function ProductDetailsPage() {
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
            <button aria-label="Wishlist">♡</button>
            <Link href="/cart" aria-label="Cart">🛍</Link>
            <Link href="/account" aria-label="Account">◯</Link>
          </div>
        </div>
      </header>

      <header className={styles.mobileHeader}>
        <Link href="/products" className={styles.roundButton} aria-label="Back">
          ←
        </Link>

        <div className={styles.mobileActions}>
          <button className={styles.roundButton} aria-label="Share">
            ↗
          </button>
          <button className={styles.roundButton} aria-label="Wishlist">
            ♡
          </button>
        </div>
      </header>

      <section className={styles.container}>
        <div className={styles.productLayout}>
          <section className={styles.gallery}>
            <div className={styles.thumbnailRail}>
              {productImages.map((image, index) => (
                <button
                  key={image}
                  className={`${styles.thumbnail} ${
                    index === 0 ? styles.thumbnailActive : ""
                  }`}
                  aria-label={`Product image ${index + 1}`}
                >
                  <Image
                    src={image}
                    alt={`Radiance Glow Serum image ${index + 1}`}
                    fill
                    sizes="96px"
                  />
                </button>
              ))}
            </div>

            <div className={styles.mainImage}>
              <Image
                src={productImages[0]}
                alt="LUMINA Radiance Glow Serum"
                fill
                priority
                sizes="(max-width: 767px) 100vw, 58vw"
              />

              <button
                className={styles.imageWishlist}
                aria-label="Add to wishlist"
              >
                ♡
              </button>

              <div className={styles.mobileDots}>
                <span className={styles.activeDot} />
                <span className={styles.dot} />
                <span className={styles.dot} />
              </div>
            </div>
          </section>

          <section className={styles.productInfo}>
            <nav className={styles.breadcrumbs}>
              <Link href="/products">Skincare</Link>
              <span>›</span>
              <Link href="/products">Serums</Link>
            </nav>

            <p className={styles.brandName}>LUMINA</p>

            <h1>Radiance Glow Serum</h1>

            <div className={styles.rating}>
              <span className={styles.stars}>★★★★★</span>
              <span>4.8 (124 reviews)</span>
            </div>

            <div className={styles.priceRow}>
              <span className={styles.currentPrice}>₹1,499</span>
              <span className={styles.oldPrice}>₹2,100</span>
              <span className={styles.discount}>30% OFF</span>
            </div>

            <p className={styles.description}>
              A potent, lightweight serum that visibly brightens and evens skin
              tone. Formulated with advanced Vitamin C and Niacinamide, it
              delivers an instant, radiant glow while providing long-lasting
              hydration.
            </p>

            <div className={styles.optionSection}>
              <span>SIZE</span>

              <div className={styles.options}>
                <button className={styles.selectedOption}>30ml</button>
                <button>50ml</button>
              </div>
            </div>

            <div className={styles.deliverySection}>
              <span>CHECK DELIVERY</span>

              <div className={styles.pincodeBox}>
                <span>⌖</span>
                <input
                  type="text"
                  placeholder="Enter Pincode"
                  aria-label="Enter pincode"
                />
                <button>CHECK</button>
              </div>
            </div>

            <div className={styles.desktopActions}>
              <button className={styles.cartButton}>
                🛍 Add to Cart
              </button>
              <button className={styles.buyButton}>Buy Now</button>
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
              <p>
                Experience the ultimate glow with our LUMINA Radiance Glow
                Serum. This carefully curated formula is designed to target
                dullness and uneven texture, revealing a smoother, brighter
                complexion.
              </p>

              <p>
                Suitable for all skin types, it absorbs quickly without leaving
                a sticky residue, making it the perfect base for your
                moisturizer and makeup.
              </p>
            </div>

            <div className={styles.benefits}>
              <h2>Key Benefits</h2>

              <ul>
                <li>✓ Illuminates and brightens skin instantly.</li>
                <li>✓ Reduces the appearance of dark spots over time.</li>
                <li>✓ Hydrates and plumps the skin surface.</li>
              </ul>
            </div>
          </div>
        </section>
      </section>

      <div className={styles.mobilePurchaseBar}>
        <button className={styles.mobileCartButton}>🛍 Add to Cart</button>
        <button className={styles.mobileBuyButton}>Buy Now</button>
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
          <a href="#">Authenticity Guaranteed</a>
          <a href="#">Free Shipping over ₹500</a>
          <a href="#">Easy Returns</a>
        </div>

        <div>
          <a href="#">Contact Us</a>
          <a href="#">Privacy Policy</a>
        </div>
      </footer>
    </main>
  );
}