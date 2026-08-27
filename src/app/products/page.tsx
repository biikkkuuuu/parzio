"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type Product = {
  id: number;
  brand: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  badge?: string;
  image: string;
};

const products: Product[] = [
  {
    id: 1,
    brand: "LUMIERE",
    name: "Hydra Restore Serum",
    price: 1850,
    rating: 4.8,
    reviews: 128,
    badge: "BESTSELLER",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC7QH0j2j3B7lQ4a9QvGxKfYjQJdGdZLJv4Pp5oT9Qw0C5fM8L6M1lP5Lq3P9rL8dKqC2LzM2tL6kN4XyJ8JjP8CzK7Yg6y8lQh3JQ2",
  },
  {
    id: 2,
    brand: "BOTANICA",
    name: "Radiance Vitamin C Serum",
    price: 2200,
    rating: 4.7,
    reviews: 96,
    badge: "NEW",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD6Jx0nW0mO8o9Q4g3N9G5d1M6d4f2K7c3P8m0X7z4Q6m2L7k0R8Y5Q0R3H6N7P2X1",
  },
  {
    id: 3,
    brand: "AURA",
    name: "Gentle Purifying Cleanser",
    price: 950,
    rating: 4.9,
    reviews: 42,
    badge: "NEW",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDXyilgB8Mwxqx2cpQHyh6xhkkLL23CqADks5EJn37lQ7qny3Y9mhoJvgXNi66opdmpzbN9GLdPC6JN0ss_g7ewipMJbpNJhuwGsn_DutQ0YBm9kF0TGJ9rTYUXOBJ9xo0MZer2aasptzfs8jMMGP0Pczh9Yvf0UeL3c3ZWlCjLvw68VIAC8qGCv8INseV3UxvTdr_TFvquQRohdvtNnbHpaEy6XIel-BiQkjVnNPEsroV5q5gRow9h",
  },
  {
    id: 4,
    brand: "BOTANICA",
    name: "AHA/BHA Clarifying Toner",
    price: 2100,
    rating: 4.6,
    reviews: 156,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA6tUUWqvvLYHoE96sG565d-GHYPSe1hzLp1HOIDWHwZqWqjVcTp2VPP84sQRNVCvpNdUzqsGK5UdfOCWmupIyCAoBZwwJP58Y9y7x_dHnnWj67kkHlO6RhGAIPjYNq7mQS7xjd5cZlduuY_o6nSHcca4T-OAIVfo_sNpcpTUiYA4hRgil-fJ41VYkWQvqSFgJcCekAJFU9DHNV8ag0uP_i2iS6tAtoaIH_dkFH9rPAfaCdmLQcm_9",
  },
  {
    id: 5,
    brand: "DERMA LAB",
    name: "Barrier Repair Moisturizer",
    price: 1450,
    rating: 4.8,
    reviews: 89,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD0wQW8L3f4B4K9m1P6R7N2K8M6F3Q5X9V0H4J7L2S6R8",
  },
  {
    id: 6,
    brand: "SOLARIS",
    name: "Daily UV Shield SPF 50",
    price: 1299,
    rating: 4.7,
    reviews: 212,
    badge: "POPULAR",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD7g9Q2M4X8N3F1H5R7K6T2W8P9L4V6Y0B3C2D8J1S5",
  },
  {
    id: 7,
    brand: "LUMIERE",
    name: "Overnight Renewal Cream",
    price: 2400,
    rating: 4.9,
    reviews: 67,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC3L8J1H5M7N2Q6R9W4Y0T3P8S5K2D7F1V6B4G9X0",
  },
  {
    id: 8,
    brand: "PURE THEORY",
    name: "Calming Cica Gel",
    price: 1099,
    rating: 4.5,
    reviews: 74,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuE2M7N1Q9F4L6R3X8W0H5K2T7P1D9V4C6B8S3J0",
  },
];

const subcategories = [
  "All Skincare",
  "Cleansers",
  "Moisturizers",
  "Serums",
  "Sunscreens",
];

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("All Skincare");
  const [sort, setSort] = useState("featured");

  const filteredProducts = useMemo(() => {
    const list = [...products];

    if (activeCategory === "Serums") {
      return list.filter((p) =>
        p.name.toLowerCase().includes("serum")
      );
    }

    if (activeCategory === "Cleansers") {
      return list.filter((p) =>
        p.name.toLowerCase().includes("cleanser")
      );
    }

    if (activeCategory === "Moisturizers") {
      return list.filter((p) =>
        p.name.toLowerCase().includes("moisturizer")
      );
    }

    if (activeCategory === "Sunscreens") {
      return list.filter((p) =>
        p.name.toLowerCase().includes("spf") ||
        p.name.toLowerCase().includes("uv")
      );
    }

    return list;
  }, [activeCategory]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];

    switch (sort) {
      case "price-low":
        return list.sort((a, b) => a.price - b.price);

      case "price-high":
        return list.sort((a, b) => b.price - a.price);

      case "rating":
        return list.sort((a, b) => b.rating - a.rating);

      default:
        return list;
    }
  }, [filteredProducts, sort]);

  return (
    <main className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b] pb-24 md:pb-0">
      {/* Desktop header */}
      <header className="sticky top-0 z-50 hidden h-20 border-b border-[#e5e2e1] bg-[#fcf9f8]/95 shadow-sm backdrop-blur md:flex">
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between px-6">
          <a
            href="/"
            className="text-2xl font-bold tracking-tight text-[#431830]"
          >
            PARZIO
          </a>

          <nav className="flex items-center gap-8">
            <a href="#" className="text-sm text-[#504348] hover:text-[#431830]">
              Categories
            </a>
            <a href="#" className="text-sm text-[#504348] hover:text-[#431830]">
              Brands
            </a>
            <a href="#" className="text-sm text-[#504348] hover:text-[#431830]">
              Offers
            </a>
            <a href="#" className="text-sm text-[#504348] hover:text-[#431830]">
              New Arrivals
            </a>
            <a
              href="#"
              className="border-b-2 border-[#431830] pb-1 text-sm font-bold text-[#431830]"
            >
              Skincare
            </a>
          </nav>

          <div className="flex items-center gap-4 text-xl text-[#431830]">
            <button aria-label="Wishlist">♡</button>
            <button aria-label="Cart">🛍</button>
            <button aria-label="Account">◯</button>
          </div>
        </div>
      </header>

      {/* Mobile title/header */}
      <header className="sticky top-0 z-40 border-b border-[#e5e2e1] bg-[#fcf9f8]/95 px-4 pb-4 pt-5 backdrop-blur md:hidden">
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="flex h-9 w-9 items-center justify-center text-xl text-[#431830]"
            aria-label="Back"
          >
            ←
          </a>

          <h1 className="text-2xl font-medium text-[#431830]">
            Skincare{" "}
            <span className="text-base font-normal text-[#5f5e5d]">
              (142)
            </span>
          </h1>
        </div>

        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {subcategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
                activeCategory === category
                  ? "border-[#431830] bg-[#431830] text-white"
                  : "border-[#d4c2c8] bg-[#f6f3f2] text-[#1c1b1b]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </header>

      {/* Main */}
      <section className="mx-auto w-full max-w-[1280px] px-4 py-8 md:px-6 md:py-12">
        {/* Breadcrumb */}
        <nav className="mb-5 hidden text-sm text-[#5f5e5d] md:flex md:items-center md:gap-2">
          <a href="/" className="hover:text-[#431830]">
            Home
          </a>
          <span>›</span>
          <span className="font-medium text-[#431830]">Skincare</span>
        </nav>

        {/* Desktop heading */}
        <div className="mb-8 hidden items-end justify-between md:flex">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-[#431830]">
              Skincare
            </h1>
            <p className="mt-2 text-[#5f5e5d]">
              Curated essentials for healthier, radiant skin.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="sort" className="text-sm text-[#5f5e5d]">
              Sort by
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded border border-[#d4c2c8] bg-white px-4 py-2 text-sm outline-none focus:border-[#431830]"
            >
              <option value="featured">Featured</option>
              <option value="rating">Top Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop filters */}
          <aside className="hidden w-56 shrink-0 space-y-7 md:block">
            <div>
              <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#431830]">
                Category
              </h2>

              <div className="space-y-3 text-sm">
                {subcategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`block w-full text-left ${
                      activeCategory === category
                        ? "font-semibold text-[#431830]"
                        : "text-[#5f5e5d] hover:text-[#431830]"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-[#e5e2e1] pt-6">
              <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#431830]">
                Price
              </h2>
              <div className="space-y-3 text-sm text-[#5f5e5d]">
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  Under ₹1,000
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  ₹1,000 – ₹1,500
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  ₹1,500 – ₹2,500
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  ₹2,500+
                </label>
              </div>
            </div>

            <div className="border-t border-[#e5e2e1] pt-6">
              <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#431830]">
                Rating
              </h2>
              <div className="space-y-3 text-sm text-[#5f5e5d]">
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  4★ & above
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  3★ & above
                </label>
              </div>
            </div>
          </aside>

          {/* Product grid */}
          <div className="min-w-0 flex-1">
            <div className="mb-5 hidden items-center justify-between md:flex">
              <p className="text-sm text-[#5f5e5d]">
                Showing {sortedProducts.length} products
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {sortedProducts.map((product) => (
                <article
                  key={product.id}
                  className="group relative overflow-hidden rounded-lg border border-[#e5e2e1] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#f6f3f2]">
                    {product.badge && (
                      <span className="absolute left-3 top-3 z-10 rounded bg-[#e5e2e1] px-2 py-1 text-[10px] font-bold tracking-wider text-[#431830]">
                        {product.badge}
                      </span>
                    )}

                    <button
                      aria-label={`Add ${product.name} to wishlist`}
                      className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 text-[#431830] shadow-sm opacity-100 md:opacity-0 md:transition md:group-hover:opacity-100"
                    >
                      ♡
                    </button>

                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex min-h-[190px] flex-col p-3 md:p-4">
                    <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-[#5f5e5d]">
                      {product.brand}
                    </div>

                    <h3 className="line-clamp-2 min-h-12 text-sm font-medium leading-5 text-[#1c1b1b] md:text-base">
                      {product.name}
                    </h3>

                    <div className="mt-2 flex items-center gap-1">
                      <span className="text-sm text-[#431830]">★</span>
                      <span className="text-sm font-medium">
                        {product.rating}
                      </span>
                      <span className="text-xs text-[#5f5e5d]">
                        ({product.reviews})
                      </span>
                    </div>

                    <div className="mt-auto flex items-end justify-between gap-3 pt-4">
                      <span className="text-lg font-semibold text-[#431830]">
                        {formatPrice(product.price)}
                      </span>

                      <button className="rounded bg-[#5d2e46] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#431830]">
                        Add
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {sortedProducts.length === 0 && (
              <div className="rounded-lg border border-dashed border-[#d4c2c8] bg-white p-12 text-center text-[#5f5e5d]">
                No products found in this category.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile filter / sort */}
      <div className="fixed bottom-20 left-0 right-0 z-30 flex justify-center px-4 md:hidden">
        <div className="flex items-center rounded-full border border-[#d4c2c8] bg-[#e5e2e1]/95 p-1 shadow-lg backdrop-blur">
          <button
            onClick={() =>
              setSort(sort === "price-low" ? "featured" : "price-low")
            }
            className="flex items-center gap-2 rounded-full px-6 py-2 text-sm font-medium"
          >
            ⇅ Sort
          </button>

          <div className="h-6 w-px bg-[#d4c2c8]" />

          <button className="flex items-center gap-2 rounded-full px-6 py-2 text-sm font-medium">
            ☰ Filter
          </button>
        </div>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around rounded-t-3xl bg-white px-3 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] md:hidden">
        <a href="/" className="flex flex-col items-center gap-1 text-[#5f5e5d]">
          <span>⌂</span>
          <span className="text-[10px]">Home</span>
        </a>

        <a
          href="/products"
          className="flex flex-col items-center gap-1 rounded-full bg-[#431830]/10 px-4 py-1 text-[#431830]"
        >
          <span>⌕</span>
          <span className="text-[10px] font-semibold">Shop</span>
        </a>

        <a
          href="/offers"
          className="flex flex-col items-center gap-1 text-[#5f5e5d]"
        >
          <span>⌁</span>
          <span className="text-[10px]">Offers</span>
        </a>

        <a
          href="/cart"
          className="flex flex-col items-center gap-1 text-[#5f5e5d]"
        >
          <span>🛍</span>
          <span className="text-[10px]">Cart</span>
        </a>

        <a
          href="/account"
          className="flex flex-col items-center gap-1 text-[#5f5e5d]"
        >
          <span>◯</span>
          <span className="text-[10px]">Account</span>
        </a>
      </nav>

      {/* Desktop footer */}
      <footer className="mt-12 hidden border-t border-[#d4c2c8] bg-[#f0eded] md:block">
        <div className="mx-auto grid max-w-[1280px] grid-cols-4 gap-10 px-6 py-16">
          <div>
            <div className="text-2xl font-bold text-[#431830]">PARZIO</div>
            <p className="mt-4 text-sm text-[#5f5e5d]">
              © 2026 PARZIO India. Premium Beauty Marketplace.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-[#1c1b1b]">
              Customer Care
            </h4>
            <div className="space-y-2 text-sm text-[#5f5e5d]">
              <a href="#" className="block hover:text-[#431830]">
                Authenticity Guaranteed
              </a>
              <a href="#" className="block hover:text-[#431830]">
                Free Shipping over ₹500
              </a>
              <a href="#" className="block hover:text-[#431830]">
                Easy Returns
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-[#1c1b1b]">
              About Us
            </h4>
            <div className="space-y-2 text-sm text-[#5f5e5d]">
              <a href="#" className="block hover:text-[#431830]">
                Contact Us
              </a>
              <a href="#" className="block hover:text-[#431830]">
                Privacy Policy
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-[#1c1b1b]">
              Quick Links
            </h4>
            <div className="space-y-2 text-sm text-[#5f5e5d]">
              <a href="/" className="block hover:text-[#431830]">
                Home
              </a>
              <a href="/offers" className="block hover:text-[#431830]">
                Offers
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}