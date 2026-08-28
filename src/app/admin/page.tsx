"use client";

import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, useMemo, useState } from "react";
import styles from "./admin.module.css";

type Product = {
  id: number;
  brand: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  status: "Active" | "Draft" | "Out of Stock";
  image: string;
};

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

const initialProducts: Product[] = [
  {
    id: 1,
    brand: "LUMIERE",
    name: "Hydra Restore Serum",
    price: 1850,
    category: "Serums",
    stock: 42,
    status: "Active",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC7QH0j2j3B7lQ4a9QvGxKfYjQJdGdZLJv4Pp5oT9Qw0C5fM8L6M1lP5Lq3P9rL8dKqC2LzM2tL6kN4XyJ8JjP8CzK7Yg6y8lQh3JQ2",
  },
  {
    id: 2,
    brand: "BOTANICA",
    name: "Radiance Vitamin C Serum",
    price: 2200,
    category: "Serums",
    stock: 18,
    status: "Active",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD6Jx0nW0mO8o9Q4g3N9G5d1M6d4f2K7c3P8m0X7z4Q6m2L7k0R8Y5Q0R3H6N7P2X1",
  },
  {
    id: 3,
    brand: "AURA",
    name: "Gentle Purifying Cleanser",
    price: 950,
    category: "Cleansers",
    stock: 64,
    status: "Active",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDXyilgB8Mwxqx2cpQHyh6xhkkLL23CqADks5EJn37lQ7qny3Y9mhoJvgXNi66opdmpzbN9GLdPC6JN0ss_g7ewipMJbpNJhuwGsn_DutQ0YBm9kF0TGJ9rTYUXOBJ9xo0MZer2aasptzfs8jMMGP0Pczh9Yvf0UeL3c3ZWlCjLvw68VIAC8qGCv8INseV3UxvTdr_TFvquQRohdvtNnbHpaEy6XIel-BiQkjVnNPEsroV5q5gRow9h",
  },
  {
    id: 4,
    brand: "BOTANICA",
    name: "AHA/BHA Clarifying Toner",
    price: 2100,
    category: "Toners",
    stock: 0,
    status: "Out of Stock",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA6tUUWqvvLYHoE96sG565d-GHYPSe1hzLp1HOIDWHwZqWqjVcTp2VPP84sQRNVCvpNdUzqsGK5UdfOCWmupIyCAoBZwwJP58Y9y7x_dHnnWj67kkHlO6RhGAIPjYNq7mQS7xjd5cZlduuY_o6nSHcca4T-OAIVfo_sNpcpTUiYA4hRgil-fJ41VYkWQvqSFgJcCekAJFU9DHNV8ag0uP_i2iS6tAtoaIH_dkFH9rPAfaCdmLQcm_9",
  },
  {
    id: 5,
    brand: "DERMA LAB",
    name: "Barrier Repair Moisturizer",
    price: 1450,
    category: "Moisturizers",
    stock: 27,
    status: "Draft",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD0wQW8L3f4B4K9m1P6R7N2K8M6F3Q5X9V0H4J7L2S6R8",
  },
];

type ProductImage = {
  id: string;
  file: File;
  preview: string;
};

type AdminOrder = {
  id: string;
  customer: string;
  items: number;
  amount: number;
  date: string;
  status:
    | "Pending"
    | "Processing"
    | "Shipped"
    | "Out for Delivery"
    | "Delivered"
    | "Cancelled";
};

const initialAdminOrders: AdminOrder[] = [
  {
    id: "PRZ-10482",
    customer: "Aarav Sharma",
    items: 2,
    amount: 2698,
    date: "28 Aug 2026",
    status: "Processing",
  },
  {
    id: "PRZ-10481",
    customer: "Priya Singh",
    items: 1,
    amount: 1499,
    date: "28 Aug 2026",
    status: "Pending",
  },
  {
    id: "PRZ-10480",
    customer: "Riya Verma",
    items: 3,
    amount: 3248,
    date: "27 Aug 2026",
    status: "Shipped",
  },
  {
    id: "PRZ-10479",
    customer: "Kabir Mehta",
    items: 1,
    amount: 950,
    date: "27 Aug 2026",
    status: "Delivered",
  },
  {
    id: "PRZ-10478",
    customer: "Neha Gupta",
    items: 2,
    amount: 2199,
    date: "26 Aug 2026",
    status: "Cancelled",
  },
];

export default function AdminPage() {
  const [active, setActive] = useState("Dashboard");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [adminOrders, setAdminOrders] =
    useState<AdminOrder[]>(initialAdminOrders);
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatus, setOrderStatus] = useState("All");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const [images, setImages] = useState<ProductImage[]>([]);
  const [mainImageId, setMainImageId] = useState<string | null>(null);

  const filteredOrders = adminOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.customer.toLowerCase().includes(orderSearch.toLowerCase());

    const matchesStatus =
      orderStatus === "All" || order.status === orderStatus;

    return matchesSearch && matchesStatus;
  });

  const selectedOrder = adminOrders.find(
    (order) => order.id === selectedOrderId,
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.brand.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const resetForm = () => {
    images.forEach((image) => URL.revokeObjectURL(image.preview));
    setImages([]);
    setMainImageId(null);
    setEditingId(null);
    setShowProductForm(false);
  };

  const openProductForm = (productId?: number) => {
    if (productId) {
      setEditingId(productId);
    } else {
      setEditingId(null);
    }

    setMainImageId(null);
    setImages([]);
    setShowProductForm(true);
    setActive("Products");
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

    setImages((current) => [...current, ...newImages].slice(0, 10));

    if (!mainImageId && newImages.length > 0) {
      setMainImageId(newImages[0].id);
    }

    event.target.value = "";
  };

  const removeImage = (id: string) => {
    setImages((current) => {
      const removed = current.find((item) => item.id === id);

      if (removed) {
        URL.revokeObjectURL(removed.preview);
      }

      const remaining = current.filter((item) => item.id !== id);

      if (id === mainImageId) {
        setMainImageId(remaining[0]?.id ?? null);
      }

      return remaining;
    });
  };

  const updateProductStatus = (
    productId: number,
    status: Product["status"],
  ) => {
    setProducts((current) =>
      current.map((product) =>
        product.id === productId
          ? {
              ...product,
              status,
              stock: status === "Out of Stock" ? 0 : product.stock,
            }
          : product,
      ),
    );
  };

  const confirmDelete = () => {
    if (deleteId === null) return;

    setProducts((current) =>
      current.filter((product) => product.id !== deleteId),
    );

    setDeleteId(null);
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
                onClick={() => {
                  setActive(item);
                  if (item !== "Products") {
                    setShowProductForm(false);
                  }
                }}
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
          {active === "Orders" ? (
            <>
              <section className={styles.welcome}>
                <div>
                  <span>ORDER MANAGEMENT</span>
                  <h2>Orders</h2>
                  <p>Review and manage customer orders.</p>
                </div>
              </section>

              <section className={styles.card}>
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    flexWrap: "wrap",
                    alignItems: "center",
                    marginBottom: 20,
                  }}
                >
                  <input
                    type="search"
                    value={orderSearch}
                    onChange={(event) => setOrderSearch(event.target.value)}
                    placeholder="Search order ID or customer..."
                    style={{
                      flex: 1,
                      minWidth: 240,
                      padding: 12,
                      boxSizing: "border-box",
                    }}
                  />

                  <select
                    value={orderStatus}
                    onChange={(event) => setOrderStatus(event.target.value)}
                    style={{ padding: 12 }}
                  >
                    <option value="All">All Statuses</option>
                    <option>Pending</option>
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Out for Delivery</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                </div>

                <div className={styles.table}>
                  <div className={styles.tableHead}>
                    <span>Order</span>
                    <span>Customer</span>
                    <span>Items</span>
                    <span>Amount</span>
                    <span>Date</span>
                    <span>Status</span>
                    <span>Action</span>
                  </div>

                  {filteredOrders.map((order) => (
                    <div key={order.id} className={styles.tableRow}>
                      <strong>{order.id}</strong>
                      <span>{order.customer}</span>
                      <span>{order.items}</span>
                      <span>
                        ₹{order.amount.toLocaleString("en-IN")}
                      </span>
                      <span>{order.date}</span>

                      <select
                        value={order.status}
                        onChange={(event) => {
                          const status =
                            event.target.value as AdminOrder["status"];

                          setAdminOrders((current) =>
                            current.map((item) =>
                              item.id === order.id
                                ? { ...item, status }
                                : item,
                            ),
                          );
                        }}
                        style={{ padding: 7 }}
                        aria-label={"Change status for " + order.id}
                      >
                        <option>Pending</option>
                        <option>Processing</option>
                        <option>Shipped</option>
                        <option>Out for Delivery</option>
                        <option>Delivered</option>
                        <option>Cancelled</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => setSelectedOrderId(order.id)}
                      >
                        View
                      </button>
                    </div>
                  ))}

                  {filteredOrders.length === 0 && (
                    <div style={{ padding: 30, textAlign: "center" }}>
                      No orders found.
                    </div>
                  )}
                </div>
              </section>

              {selectedOrder && (
                <div
                  className={styles.modalBackdrop}
                  onClick={() => setSelectedOrderId(null)}
                >
                  <div
                    className={styles.deleteModal}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <span className={styles.modalEyebrow}>
                      ORDER DETAILS
                    </span>

                    <h2>{selectedOrder.id}</h2>

                    <p>
                      Customer: <strong>{selectedOrder.customer}</strong>
                    </p>

                    <p style={{ marginTop: 8 }}>
                      Items: <strong>{selectedOrder.items}</strong>
                    </p>

                    <p style={{ marginTop: 8 }}>
                      Amount:{" "}
                      <strong>
                        ₹{selectedOrder.amount.toLocaleString("en-IN")}
                      </strong>
                    </p>

                    <p style={{ marginTop: 8 }}>
                      Date: <strong>{selectedOrder.date}</strong>
                    </p>

                    <p style={{ marginTop: 8 }}>
                      Status: <strong>{selectedOrder.status}</strong>
                    </p>

                    <div className={styles.modalActions}>
                      <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={() => setSelectedOrderId(null)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : active === "Products" && showProductForm ? (
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <span className={styles.eyebrow}>PRODUCT MANAGEMENT</span>
                  <h2>{editingId ? "Edit Product" : "Add Product"}</h2>
                  <p>
                    {editingId
                      ? "Update product information and images."
                      : "Create a new product listing."}
                  </p>
                </div>

                <button type="button" onClick={resetForm}>
                  Back
                </button>
              </div>

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
                      <option>Serums</option>
                      <option>Cleansers</option>
                      <option>Moisturizers</option>
                      <option>Toners</option>
                      <option>Sunscreens</option>
                      <option>Makeup</option>
                      <option>Haircare</option>
                      <option>Fragrance</option>
                    </select>
                  </label>
                </div>

                <div>
                  <h3>Product Images</h3>
                  <p style={{ marginTop: 5 }}>
                    Select up to 10 images. Choose one as the main image.
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
                    <span>+ Select multiple product images</span>
                  </label>
                </div>

                {images.length > 0 && (
                  <div>
                    <h3>Selected Images ({images.length}/10)</h3>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(160px, 1fr))",
                        gap: 14,
                        marginTop: 14,
                      }}
                    >
                      {images.map((image) => (
                        <div
                          key={image.id}
                          style={{
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
                            }}
                          >
                            <Image
                              src={image.preview}
                              alt={image.file.name}
                              fill
                              unoptimized
                              sizes="160px"
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
                              : "Set Main Image"}
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
                  <button type="button" onClick={resetForm}>
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={!editingId && images.length === 0}
                  >
                    {editingId ? "Update Product" : "Save Product"}
                  </button>
                </div>
              </div>
            </section>
          ) : active === "Products" ? (
            <>
              <section className={styles.welcome}>
                <div>
                  <span>PRODUCT MANAGEMENT</span>
                  <h2>Products</h2>
                  <p>Manage your PARZIO product catalog.</p>
                </div>

                <button type="button" onClick={() => openProductForm()}>
                  + Add Product
                </button>
              </section>

              <section className={styles.card}>
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    flexWrap: "wrap",
                    alignItems: "center",
                    marginBottom: 20,
                  }}
                >
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search products or brands..."
                    style={{
                      flex: 1,
                      minWidth: 240,
                      padding: 12,
                      boxSizing: "border-box",
                    }}
                  />

                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    style={{ padding: 12 }}
                  >
                    <option value="All">All Categories</option>
                    <option value="Serums">Serums</option>
                    <option value="Cleansers">Cleansers</option>
                    <option value="Moisturizers">Moisturizers</option>
                    <option value="Toners">Toners</option>
                    <option value="Sunscreens">Sunscreens</option>
                  </select>
                </div>

                <div className={styles.table}>
                  <div className={styles.tableHead}>
                    <span>Product</span>
                    <span>Category</span>
                    <span>Price</span>
                    <span>Stock</span>
                    <span>Status</span>
                    <span>Actions</span>
                  </div>

                  {filteredProducts.map((product) => (
                    <div key={product.id} className={styles.tableRow}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            position: "relative",
                            width: 48,
                            height: 48,
                            flexShrink: 0,
                            overflow: "hidden",
                            background: "#f6f3f2",
                          }}
                        >
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="48px"
                            style={{ objectFit: "cover" }}
                          />
                        </div>

                        <div>
                          <strong>{product.name}</strong>
                          <div style={{ fontSize: 12 }}>
                            {product.brand}
                          </div>
                        </div>
                      </div>

                      <span>{product.category}</span>
                      <span>₹{product.price.toLocaleString("en-IN")}</span>
                      <span>{product.stock}</span>

                      <div>
                        <select
                          value={product.status}
                          onChange={(event) =>
                            updateProductStatus(
                              product.id,
                              event.target.value as Product["status"],
                            )
                          }
                          style={{ padding: 7 }}
                          aria-label={`Change status for ${product.name}`}
                        >
                          <option>Active</option>
                          <option>Out of Stock</option>
                          <option>Draft</option>
                        </select>
                      </div>

                      <div className={styles.productActions}>
                        <button
                          type="button"
                          className={styles.editButton}
                          onClick={() => openProductForm(product.id)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className={styles.deleteButton}
                          onClick={() => setDeleteId(product.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}

                  {filteredProducts.length === 0 && (
                    <div style={{ padding: 30, textAlign: "center" }}>
                      No products found.
                    </div>
                  )}
                </div>
              </section>
            </>
          ) : (
            <>
              <section className={styles.welcome}>
                <div>
                  <span>GOOD EVENING</span>
                  <h2>Welcome back, Admin.</h2>
                  <p>
                    Here&apos;s what&apos;s happening across PARZIO today.
                  </p>
                </div>

                <button type="button" onClick={() => openProductForm()}>
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
                    <button type="button" onClick={() => openProductForm()}>
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
          )}
        </div>
      </section>

      {deleteId !== null && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            background: "rgba(0, 0, 0, 0.45)",
          }}
          onClick={() => setDeleteId(null)}
        >
          <div
            style={{
              width: "min(440px, 100%)",
              padding: 28,
              border: "1px solid #d4c2c8",
              background: "#fff",
              boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <span className={styles.eyebrow}>DELETE PRODUCT</span>
            <h2 style={{ margin: "8px 0 10px", color: "#431830" }}>
              Are you sure?
            </h2>

            <p style={{ margin: 0, color: "#5f5e5d", lineHeight: 1.6 }}>
              This product will be removed from the current product list.
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                marginTop: 24,
              }}
            >
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                style={{ padding: "10px 16px" }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                style={{
                  padding: "10px 16px",
                  border: 0,
                  background: "#431830",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
