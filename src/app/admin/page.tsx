"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./admin.module.css";

const stats = [
  { label: "Total Products", value: "1,248", change: "+8.2%" },
  { label: "Orders Today", value: "84", change: "+12.5%" },
  { label: "Revenue", value: "₹2.48L", change: "+14.8%" },
  { label: "Customers", value: "8,642", change: "+6.4%" },
];

const recentOrders = [
  { id: "PRZ-10482", customer: "Aarav Sharma", amount: "₹2,698", status: "Delivered" },
  { id: "PRZ-10481", customer: "Priya Singh", amount: "₹1,499", status: "Processing" },
  { id: "PRZ-10480", customer: "Riya Verma", amount: "₹3,248", status: "Shipped" },
  { id: "PRZ-10479", customer: "Kabir Mehta", amount: "₹950", status: "Delivered" },
];

export default function AdminPage() {
  const [active, setActive] = useState("Dashboard");

  return (
    <main className={styles.page}>
      <aside className={styles.sidebar}>
        <Link href="/" className={styles.logo}>
          PARZIO
          <span>ADMIN</span>
        </Link>

        <nav className={styles.sidebarNav}>
          {["Dashboard", "Products", "Orders", "Customers", "Offers"].map(
            (item) => (
              <button
                key={item}
                type="button"
                onClick={() => setActive(item)}
                className={active === item ? styles.navActive : ""}
              >
                <span>
                  {item === "Dashboard" && "▦"}
                  {item === "Products" && "□"}
                  {item === "Orders" && "▤"}
                  {item === "Customers" && "♙"}
                  {item === "Offers" && "◇"}
                </span>
                {item}
              </button>
            ),
          )}
        </nav>

        <div className={styles.sidebarBottom}>
          <Link href="/products">View Store</Link>
          <button type="button">Log Out</button>
        </div>
      </aside>

      <section className={styles.main}>
        <header className={styles.header}>
          <div>
            <span className={styles.eyebrow}>ADMIN PANEL</span>
            <h1>{active}</h1>
          </div>

          <div className={styles.headerRight}>
            <span className={styles.status}>
              <i />
              Store Online
            </span>

            <div className={styles.avatar}>A</div>
          </div>
        </header>

        <div className={styles.content}>
          <section className={styles.welcome}>
            <div>
              <span>GOOD EVENING</span>
              <h2>Welcome back, Admin.</h2>
              <p>Here&apos;s what&apos;s happening across PARZIO today.</p>
            </div>

            <button type="button">+ Add Product</button>
          </section>

          <section className={styles.stats}>
            {stats.map((stat) => (
              <article key={stat.label} className={styles.statCard}>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
                <small>{stat.change} from last month</small>
              </article>
            ))}
          </section>

          <div className={styles.dashboardGrid}>
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h2>Recent Orders</h2>
                  <p>Latest customer orders</p>
                </div>

                <Link href="/orders">View all →</Link>
              </div>

              <div className={styles.table}>
                <div className={styles.tableHead}>
                  <span>Order</span>
                  <span>Customer</span>
                  <span>Amount</span>
                  <span>Status</span>
                </div>

                {recentOrders.map((order) => (
                  <div key={order.id} className={styles.tableRow}>
                    <strong>{order.id}</strong>
                    <span>{order.customer}</span>
                    <span>{order.amount}</span>
                    <em className={styles[order.status.toLowerCase()]}>
                      {order.status}
                    </em>
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h2>Quick Actions</h2>
                  <p>Common admin tasks</p>
                </div>
              </div>

              <div className={styles.quickActions}>
                <button type="button">
                  <strong>＋</strong>
                  <span>
                    <b>Add Product</b>
                    Create a new product listing
                  </span>
                </button>

                <button type="button">
                  <strong>◇</strong>
                  <span>
                    <b>Create Offer</b>
                    Add a promotional campaign
                  </span>
                </button>

                <button type="button">
                  <strong>▤</strong>
                  <span>
                    <b>Manage Orders</b>
                    Review pending orders
                  </span>
                </button>

                <button type="button">
                  <strong>⚙</strong>
                  <span>
                    <b>Store Settings</b>
                    Configure marketplace settings
                  </span>
                </button>
              </div>
            </section>
          </div>

          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h2>Store Overview</h2>
                <p>Performance snapshot for the last 7 days</p>
              </div>

              <select defaultValue="7">
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
            </div>

            <div className={styles.chart}>
              <div className={styles.chartLines}>
                <span />
                <span />
                <span />
                <span />
              </div>

              <div className={styles.bars}>
                {[42, 58, 46, 76, 62, 88, 70].map((height, index) => (
                  <div key={index} className={styles.barWrap}>
                    <div
                      className={styles.bar}
                      style={{ height: `${height}%` }}
                    />
                    <span>
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>

      <nav className={styles.mobileNav}>
        <button
          type="button"
          className={active === "Dashboard" ? styles.mobileActive : ""}
          onClick={() => setActive("Dashboard")}
        >
          <span>▦</span>
          Dashboard
        </button>

        <button
          type="button"
          className={active === "Products" ? styles.mobileActive : ""}
          onClick={() => setActive("Products")}
        >
          <span>□</span>
          Products
        </button>

        <button
          type="button"
          className={active === "Orders" ? styles.mobileActive : ""}
          onClick={() => setActive("Orders")}
        >
          <span>▤</span>
          Orders
        </button>

        <button
          type="button"
          className={active === "Customers" ? styles.mobileActive : ""}
          onClick={() => setActive("Customers")}
        >
          <span>♙</span>
          Customers
        </button>
      </nav>
    </main>
  );
}