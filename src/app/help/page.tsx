"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./help.module.css";

const faqs = [
  {
    question: "How can I track my order?",
    answer:
      "Open My Orders from your account and select the order you want to track.",
  },
  {
    question: "What is the return policy?",
    answer:
      "Eligible products can be returned according to the return conditions shown during checkout and in your order details.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Delivery time depends on your location and product availability. The estimated date is shown during checkout.",
  },
  {
    question: "How can I cancel an order?",
    answer:
      "Open the order details and check whether cancellation is still available for that order.",
  },
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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
            <Link href="/orders">Orders</Link>
            <Link href="/account">Account</Link>
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
          <h1>Help Center</h1>
        </div>

        <section className={styles.hero}>
          <span>PARZIO SUPPORT</span>
          <h1>How can we help?</h1>
          <p>
            Find quick answers about orders, delivery, returns and your
            account.
          </p>

          <div className={styles.searchBox}>
            <span>⌕</span>
            <input
              type="search"
              placeholder="Search for help..."
              aria-label="Search help articles"
            />
          </div>
        </section>

        <section className={styles.quickLinks}>
          <Link href="/orders">
            <span>📦</span>
            <strong>Track Order</strong>
            <small>Check your order status</small>
          </Link>

          <Link href="/cart">
            <span>🛍</span>
            <strong>Payments</strong>
            <small>Payment and checkout help</small>
          </Link>

          <Link href="/account">
            <span>◯</span>
            <strong>My Account</strong>
            <small>Manage account details</small>
          </Link>

          <a href="#faq">
            <span>?</span>
            <strong>FAQs</strong>
            <small>Common questions</small>
          </a>
        </section>

        <section className={styles.contentGrid}>
          <div>
            <div className={styles.sectionHeader}>
              <h2>Frequently Asked Questions</h2>
              <p>Answers to the questions our customers ask most.</p>
            </div>

            <div id="faq" className={styles.faqList}>
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;

                return (
                  <article key={faq.question} className={styles.faq}>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenFaq(isOpen ? null : index)
                      }
                    >
                      <span>{faq.question}</span>
                      <span>{isOpen ? "−" : "+"}</span>
                    </button>

                    {isOpen && (
                      <p>{faq.answer}</p>
                    )}
                  </article>
                );
              })}
            </div>
          </div>

          <aside className={styles.contactCard}>
            <span className={styles.contactIcon}>✦</span>
            <h2>Still need help?</h2>
            <p>
              Our support team is here to help with your order or account.
            </p>

            <button type="button">Contact Support</button>

            <div className={styles.contactInfo}>
              <div>
                <span>EMAIL</span>
                <strong>support@parzio.in</strong>
              </div>

              <div>
                <span>HOURS</span>
                <strong>Mon–Sat · 9 AM–7 PM</strong>
              </div>
            </div>
          </aside>
        </section>
      </section>

      <footer className={styles.footer}>
        <div>
          <strong>PARZIO</strong>
          <p>Premium beauty marketplace.</p>
        </div>

        <div>
          <Link href="/products">Shop</Link>
          <Link href="/offers">Offers</Link>
        </div>

        <div>
          <Link href="/account">Account</Link>
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