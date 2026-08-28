"use client";

import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, useState } from "react";
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

type ProductImage = {
  id: string;
  file: File;
  preview: string;
};

export default function AdminPage() {
  const [active, setActive] = useState("Dashboard");
  const [showProductForm, setShowProductForm] = useState(false);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [mainImageId, setMainImageId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const openProductForm = () => {
    setSaved(false);
    setShowProductForm(true);
  };

  const closeProductForm = () => {
    images.forEach((image) => URL.revokeObjectURL(image.preview));
    setImages([]);
    setMainImageId(null);
    setShowProductForm(false);
    setSaved(false);
  };

  const handleImages = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    const newImages = files
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({
        id: `${file.name}-${file.lastModified}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
      }));

    setImages((current) => {
      const combined = [...current, ...newImages];
      return combined.slice(0, 10);
    });

    if (!mainImageId && newImages.length > 0) {
      setMainImageId(newImages[0].id);
    }

    event.target.value = "";
  };

  const removeImage = (id: string) => {
    setImages((current) => {
      const image = current.find((item) => item.id === id);

      if (image) {
        URL.revokeObjectURL(image.preview);
      }

      const remaining = current.filter((item) => item.id !== id);

      if (mainImageId === id) {
        setMainImageId(remaining[0]?.id ?? null);
      }

      return remaining;
    });
  };

  const handleSaveProduct = () => {
    if (images.length === 0) {
      return;
    }

    setSaved(true);
  };

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
          {!showProductForm ? (
            <>
              <section className={styles.welcome}>
                <div>
                  <span>GOOD EVENING</span>
                  <h2>Welcome back, Admin.</h2>
                  <p>
                    Here&apos;s what&apos;s happening across PARZIO today.
                  </p>
                </div>

                <button type="button" onClick={openProductForm}>
                  + Add Product
                </button>
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
                    <button type="button" onClick={openProductForm}>
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
                          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][
                            index
                          ]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </>
          ) : (
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <span className={styles.eyebrow}>PRODUCT MANAGEMENT</span>
                  <h2>Add Product</h2>
                  <p>Create a new product with multiple product images.</p>
                </div>

                <button type="button" onClick={closeProductForm}>
                  Close
                </button>
              </div>

              {saved ? (
                <div style={{ padding: "30px 0" }}>
                  <h2>Product ready ✓</h2>
                  <p>
                    Product images were selected successfully. Permanent
                    storage will be connected in the next backend step.
                  </p>

                  <button
                    type="button"
                    onClick={closeProductForm}
                    style={{ marginTop: 20 }}
                  >
                    Back to Dashboard
                  </button>
                </div>
              ) : (
                <div style={{ display: "grid", gap: 24 }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 16,
                    }}
                  >
                    <label>
                      Product Name
                      <input
                        type="text"
                        placeholder="Product name"
                        style={{
                          width: "100%",
                          marginTop: 8,
                          padding: 12,
                          boxSizing: "border-box",
                        }}
                      />
                    </label>

                    <label>
                      Brand
                      <input
                        type="text"
                        placeholder="Brand name"
                        style={{
                          width: "100%",
                          marginTop: 8,
                          padding: 12,
                          boxSizing: "border-box",
                        }}
                      />
                    </label>

                    <label>
                      Price
                      <input
                        type="number"
                        placeholder="₹ 0"
                        style={{
                          width: "100%",
                          marginTop: 8,
                          padding: 12,
                          boxSizing: "border-box",
                        }}
                      />
                    </label>

                    <label>
                      Category
                      <select
                        defaultValue=""
                        style={{
                          width: "100%",
                          marginTop: 8,
                          padding: 12,
                          boxSizing: "border-box",
                        }}
                      >
                        <option value="" disabled>
                          Select category
                        </option>
                        <option>Skincare</option>
                        <option>Makeup</option>
                        <option>Haircare</option>
                        <option>Fragrance</option>
                        <option>Body Care</option>
                      </select>
                    </label>
                  </div>

                  <div>
                    <h3>Product Images</h3>
                    <p style={{ marginTop: 5 }}>
                      Select up to 10 images. The first image becomes the
                      default main image.
                    </p>

                    <label
                      style={{
                        display: "flex",
                        minHeight: 150,
                        marginTop: 16,
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px dashed #d4c2c8",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        hidden
                        onChange={handleImages}
                      />

                      <span>
                        + Click to select multiple images
                      </span>
                    </label>
                  </div>

                  {images.length > 0 && (
                    <div>
                      <h3>Image Preview ({images.length}/10)</h3>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fill, minmax(150px, 1fr))",
                          gap: 14,
                          marginTop: 14,
                        }}
                      >
                        {images.map((image) => (
                          <div
                            key={image.id}
                            style={{
                              position: "relative",
                              border:
                                image.id === mainImageId
                                  ? "2px solid #431830"
                                  : "1px solid #d4c2c8",
                              padding: 8,
                              background: "#fff",
                            }}
                          >
                            <div
                              style={{
                                position: "relative",
                                height: 150,
                                overflow: "hidden",
                              }}
                            >
                              <Image
                                src={image.preview}
                                alt={image.file.name}
                                fill
                                unoptimized
                                sizes="150px"
                                style={{ objectFit: "cover" }}
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() => setMainImageId(image.id)}
                              style={{
                                width: "100%",
                                marginTop: 8,
                                padding: 8,
                              }}
                            >
                              {image.id === mainImageId
                                ? "Main Image ✓"
                                : "Set as Main"}
                            </button>

                            <button
                              type="button"
                              onClick={() => removeImage(image.id)}
                              style={{
                                width: "100%",
                                marginTop: 6,
                                padding: 8,
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 12,
                    }}
                  >
                    <button type="button" onClick={closeProductForm}>
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveProduct}
                      disabled={images.length === 0}
                    >
                      Save Product
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      </section>
    </main>
  );
}
