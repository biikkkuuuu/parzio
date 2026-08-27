"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./account.module.css";

export default function AccountPage() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("PARZIO Customer");
  const [email, setEmail] = useState("customer@example.com");

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.brand}>PARZIO</Link>

          <nav className={styles.nav}>
            <Link href="/products">Shop</Link>
            <Link href="/offers">Offers</Link>
            <Link href="/orders">Orders</Link>
          </nav>

          <div className={styles.actions}>
            <Link href="/wishlist">♡</Link>
            <Link href="/cart">🛍</Link>
          </div>
        </div>
      </header>

      <section className={styles.container}>
        <div className={styles.mobileTop}>
          <Link href="/">←</Link>
          <h1>My Account</h1>
        </div>

        <div className={styles.titleBlock}>
          <h1>My Account</h1>
          <p>Manage your profile, orders and account settings.</p>
        </div>

        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <div className={styles.profileMini}>
              <div className={styles.avatar}>P</div>
              <div>
                <strong>{name}</strong>
                <span>{email}</span>
              </div>
            </div>

            <nav className={styles.accountNav}>
              <a className={styles.active}>Profile</a>
              <Link href="/orders">My Orders</Link>
              <Link href="/wishlist">Wishlist</Link>
              <Link href="/cart">Cart</Link>
              <Link href="/help">Help & Support</Link>
            </nav>
          </aside>

          <section className={styles.main}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h2>Profile Information</h2>
                  <p>Keep your personal information up to date.</p>
                </div>

                <button
                  type="button"
                  onClick={() => setEditing((value) => !value)}
                  className={styles.editButton}
                >
                  {editing ? "Cancel" : "Edit"}
                </button>
              </div>

              <div className={styles.profileFields}>
                <label>
                  Full Name
                  <input
                    value={name}
                    disabled={!editing}
                    onChange={(event) => setName(event.target.value)}
                  />
                </label>

                <label>
                  Email Address
                  <input
                    type="email"
                    value={email}
                    disabled={!editing}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </label>

                <label>
                  Phone Number
                  <input
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    disabled={!editing}
                  />
                </label>
              </div>

              {editing && (
                <button
                  type="button"
                  className={styles.saveButton}
                  onClick={() => setEditing(false)}
                >
                  Save Changes
                </button>
              )}
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h2>Quick Access</h2>
                  <p>Jump to the sections you use most.</p>
                </div>
              </div>

              <div className={styles.quickGrid}>
                <Link href="/orders" className={styles.quickCard}>
                  <span>📦</span>
                  <strong>My Orders</strong>
                  <small>Track and manage your orders</small>
                </Link>

                <Link href="/wishlist" className={styles.quickCard}>
                  <span>♡</span>
                  <strong>Wishlist</strong>
                  <small>View your saved products</small>
                </Link>

                <Link href="/offers" className={styles.quickCard}>
                  <span>🏷</span>
                  <strong>Offers</strong>
                  <small>Discover current deals</small>
                </Link>

                <Link href="/help" className={styles.quickCard}>
                  <span>?</span>
                  <strong>Help & Support</strong>
                  <small>Get help with your account</small>
                </Link>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h2>Account Settings</h2>
                  <p>Manage important account preferences.</p>
                </div>
              </div>

              <div className={styles.settingsList}>
                <button type="button">
                  <span>
                    <strong>Notifications</strong>
                    <small>Manage order and promotional alerts</small>
                  </span>
                  <span>›</span>
                </button>

                <button type="button">
                  <span>
                    <strong>Privacy & Security</strong>
                    <small>Manage password and privacy preferences</small>
                  </span>
                  <span>›</span>
                </button>

                <button type="button">
                  <span>
                    <strong>Saved Addresses</strong>
                    <small>Manage your delivery addresses</small>
                  </span>
                  <span>›</span>
                </button>
              </div>
            </div>

            <button type="button" className={styles.logout}>
              Log Out
            </button>
          </section>
        </div>
      </section>

      <footer className={styles.footer}>
        <div>
          <strong>PARZIO</strong>
          <p>Premium beauty marketplace.</p>
        </div>

        <div>
          <Link href="/help">Help Center</Link>
          <Link href="#">Privacy Policy</Link>
        </div>

        <div>
          <Link href="#">Terms of Service</Link>
          <Link href="#">Contact Us</Link>
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