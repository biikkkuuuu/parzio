"use client";

import Link from "next/link";
import styles from "./orders.module.css";

const orders = [
  {
    id: "PRZ-10482",
    date: "27 Aug 2026",
    status: "Delivered",
    statusClass: "delivered",
    items: "2 items",
    total: "₹2,698",
  },
  {
    id: "PRZ-10391",
    date: "19 Aug 2026",
    status: "Out for Delivery",
    statusClass: "shipping",
    items: "1 item",
    total: "₹1,499",
  },
  {
    id: "PRZ-10276",
    date: "08 Aug 2026",
    status: "Delivered",
    statusClass: "delivered",
    items: "3 items",
    total: "₹3,248",
  },
];

export default function OrdersPage() {
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
            <Link href="/wishlist">Wishlist</Link>
            <Link href="/account">Account</Link>
          </nav>

          <Link href="/cart" className={styles.cart}>
            🛍 Cart
          </Link>
        </div>
      </header>

      <section className={styles.container}>
        <div className={styles.mobileTop}>
          <Link href="/">←</Link>
          <h1>My Orders</h1>
        </div>

        <div className={styles.titleBlock}>
          <h1>My Orders</h1>
          <p>Track your recent PARZIO purchases.</p>
        </div>

        <div className={styles.tabs}>
          <button className={styles.activeTab}>All Orders</button>
          <button>Processing</button>
          <button>Delivered</button>
          <button>Cancelled</button>
        </div>

        <section className={styles.orders}>
          {orders.map((order) => (
            <article key={order.id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div>
                  <span className={styles.label}>ORDER ID</span>
                  <strong>{order.id}</strong>
                </div>

                <span
                  className={`${styles.status} ${
                    styles[order.statusClass as "delivered" | "shipping"]
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className={styles.orderMeta}>
                <div>
                  <span>Date</span>
                  <strong>{order.date}</strong>
                </div>

                <div>
                  <span>Items</span>
                  <strong>{order.items}</strong>
                </div>

                <div>
                  <span>Total</span>
                  <strong>{order.total}</strong>
                </div>
              </div>

              <div className={styles.orderFooter}>
                <Link href={`/orders/${order.id}`}>View Details</Link>

                {order.status === "Delivered" ? (
                  <button type="button">Buy Again</button>
                ) : (
                  <button type="button">Track Order</button>
                )}
              </div>
            </article>
          ))}
        </section>

        <section className={styles.helpCard}>
          <div>
            <strong>Need help with an order?</strong>
            <p>
              Our support team can help with delivery, returns and refunds.
            </p>
          </div>

          <Link href="/help">Visit Help Center →</Link>
        </section>
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

        <Link href="/account" className={styles.activeMobile}>
          <span>◯</span>
          Account
        </Link>
      </nav>
    </main>
  );
}