import Link from "next/link";
import styles from "./order-details.module.css";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function OrderDetailsPage({ params }: Props) {
  const { id } = await params;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.brand}>PARZIO</Link>

          <nav className={styles.nav}>
            <Link href="/products">Shop</Link>
            <Link href="/offers">Offers</Link>
            <Link href="/wishlist">Wishlist</Link>
            <Link href="/account">Account</Link>
          </nav>

          <Link href="/orders" className={styles.back}>
            ← My Orders
          </Link>
        </div>
      </header>

      <section className={styles.container}>
        <div className={styles.mobileTop}>
          <Link href="/orders">←</Link>
          <span>Order Details</span>
        </div>

        <div className={styles.breadcrumbs}>
          <Link href="/account">Account</Link>
          <span>›</span>
          <Link href="/orders">Orders</Link>
          <span>›</span>
          <span>{id}</span>
        </div>

        <div className={styles.headingRow}>
          <div>
            <span className={styles.eyebrow}>ORDER DETAILS</span>
            <h1>{id}</h1>
            <p>Placed on 27 Aug 2026</p>
          </div>

          <span className={styles.status}>Delivered</span>
        </div>

        <div className={styles.layout}>
          <section className={styles.main}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Order Status</h2>
                <p>Your order has been delivered successfully.</p>
              </div>

              <div className={styles.timeline}>
                {[
                  ["Order Delivered", "27 Aug · 4:20 PM"],
                  ["Out for Delivery", "27 Aug · 9:15 AM"],
                  ["Shipped", "26 Aug · 7:40 PM"],
                  ["Order Confirmed", "25 Aug · 2:10 PM"],
                ].map(([title, time]) => (
                  <div className={styles.timelineItem} key={title}>
                    <span className={styles.timelineDot}>✓</span>
                    <div>
                      <strong>{title}</strong>
                      <small>{time}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Items in this Order</h2>
                <p>2 products</p>
              </div>

              <div className={styles.item}>
                <div className={styles.itemImage}><span>LUMINA</span></div>
                <div className={styles.itemInfo}>
                  <span className={styles.brandName}>LUMINA</span>
                  <h3>Radiance Glow Serum</h3>
                  <p>30ml · Qty 1</p>
                </div>
                <strong>₹1,499</strong>
              </div>

              <div className={styles.item}>
                <div className={styles.itemImage}><span>BOTANICA</span></div>
                <div className={styles.itemInfo}>
                  <span className={styles.brandName}>BOTANICA</span>
                  <h3>Hydrating Skin Cream</h3>
                  <p>50ml · Qty 1</p>
                </div>
                <strong>₹1,199</strong>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Delivery Address</h2>
                <p>Shipping information</p>
              </div>

              <div className={styles.address}>
                <strong>PARZIO Customer</strong>
                <p>123 Main Street, Bhopal</p>
                <p>Madhya Pradesh · 462001</p>
                <p>+91 XXXXX XXXXX</p>
              </div>
            </div>
          </section>

          <aside className={styles.sidebar}>
            <div className={styles.summary}>
              <h2>Payment Summary</h2>

              <div>
                <span>Subtotal</span>
                <strong>₹2,698</strong>
              </div>

              <div>
                <span>Shipping</span>
                <strong className={styles.free}>FREE</strong>
              </div>

              <div className={styles.divider} />

              <div className={styles.total}>
                <span>Total</span>
                <strong>₹2,698</strong>
              </div>

              <p>Inclusive of all applicable taxes.</p>
            </div>

            <div className={styles.actions}>
              <button type="button">Buy Again</button>
              <Link href="/help">Need Help?</Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
