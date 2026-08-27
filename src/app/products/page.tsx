"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { products } from "@/lib/products";

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

    switch (activeCategory) {
      case "Serums":
        return list.filter((product) => product.category === "Serums");

      case "Cleansers":
        return list.filter((product) => product.category === "Cleansers");

      case "Moisturizers":
        return list.filter(
          (product) => product.category === "Moisturizers",
        );

      case "Sunscreens":
        return list.filter((product) => product.category === "Sunscreens");

      default:
        return list;
    }
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
      <header className="sticky top-0 z-50 hidden h-20 border-b border-[#e5e2e1] bg-[#fcf9f8]/95 shadow-sm backdrop-blur md:flex">
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between px-6">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-[#431830]"
          >
            PARZIO
          </Link>

          <nav className="flex items-center gap-8">
            <Link
              href="/products"
              className="text-sm text-[#504348] hover:text-[#431830]"
            >
              Categories
            </Link>

            <Link
              href="/products"
              className="text-sm text-[#504348] hover:text-[#431830]"
            >
              Brands
            </Link>

            <Link
              href="/offers"
              className="text-sm text-[#504348] hover:text-[#431830]"
            >
              Offers
            </Link>

            <Link
              href="/products"
              className="text-sm text-[#504348] hover:text-[#431830]"
            >
              New Arrivals
            </Link>

            <Link
              href="/products"
              className="border-b-2 border-[#431830] pb-1 text-sm font-bold text-[#431830]"
            >
              Skincare
            </Link>
          </nav>

          <div className="flex items-center gap-4 text-xl text-[#431830]">
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

      <header className="sticky top-0 z-40 border-b border-[#e5e2e1] bg-[#fcf9f8]/95 px-4 pb-4 pt-5 backdrop-blur md:hidden">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center text-xl text-[#431830]"
            aria-label="Back"
          >
            ←
          </Link>

          <h1 className="text-2xl font-medium text-[#431830]">
            Skincare{" "}
            <span className="text-base font-normal text-[#5f5e5d]">
              ({sortedProducts.length})
            </span>
          </h1>
        </div>

        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {subcategories.map((category) => (
            <button
              key={category}
              type="button"
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

      <section className="mx-auto w-full max-w-[1280px] px-4 py-8 md:px-6 md:py-12">
        <nav className="mb-5 hidden text-sm text-[#5f5e5d] md:flex md:items-center md:gap-2">
          <Link href="/" className="hover:text-[#431830]">
            Home
          </Link>

          <span>›</span>

          <span className="font-medium text-[#431830]">Skincare</span>
        </nav>

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
              onChange={(event) => setSort(event.target.value)}
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
          <aside className="hidden w-56 shrink-0 space-y-7 md:block">
            <div>
              <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#431830]">
                Category
              </h2>

              <div className="space-y-3 text-sm">
                {subcategories.map((category) => (
                  <button
                    key={category}
                    type="button"
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
                  <Link href={`/products/${product.id}`} className="block">
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#f6f3f2]">
                      {product.badge && (
                        <span className="absolute left-3 top-3 z-10 rounded bg-[#e5e2e1] px-2 py-1 text-[10px] font-bold tracking-wider text-[#431830]">
                          {product.badge}
                        </span>
                      )}

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

                        <span className="rounded bg-[#5d2e46] px-3 py-2 text-sm font-medium text-white">
                          View
                        </span>
                      </div>
                    </div>
                  </Link>
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

      <div className="fixed bottom-20 left-0 right-0 z-30 flex justify-center px-4 md:hidden">
        <div className="flex items-center rounded-full border border-[#d4c2c8] bg-[#e5e2e1]/95 p-1 shadow-lg backdrop-blur">
          <button
            type="button"
            onClick={() =>
              setSort(sort === "price-low" ? "featured" : "price-low")
            }
            className="flex items-center gap-2 rounded-full px-6 py-2 text-sm font-medium"
          >
            ⇅ Sort
          </button>

          <div className="h-6 w-px bg-[#d4c2c8]" />

          <button
            type="button"
            onClick={() => setActiveCategory("All Skincare")}
            className="flex items-center gap-2 rounded-full px-6 py-2 text-sm font-medium"
          >
            ☰ Filter
          </button>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around rounded-t-3xl bg-white px-3 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] md:hidden">
        <Link
          href="/"
          className="flex flex-col items-center gap-1 text-[#5f5e5d]"
        >
          <span>⌂</span>
          <span className="text-[10px]">Home</span>
        </Link>

        <Link
          href="/products"
          className="flex flex-col items-center gap-1 rounded-full bg-[#431830]/10 px-4 py-1 text-[#431830]"
        >
          <span>⌕</span>
          <span className="text-[10px] font-semibold">Shop</span>
        </Link>

        <Link
          href="/offers"
          className="flex flex-col items-center gap-1 text-[#5f5e5d]"
        >
          <span>⌁</span>
          <span className="text-[10px]">Offers</span>
        </Link>

        <Link
          href="/cart"
          className="flex flex-col items-center gap-1 text-[#5f5e5d]"
        >
          <span>🛍</span>
          <span className="text-[10px]">Cart</span>
        </Link>

        <Link
          href="/account"
          className="flex flex-col items-center gap-1 text-[#5f5e5d]"
        >
          <span>◯</span>
          <span className="text-[10px]">Account</span>
        </Link>
      </nav>

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
              <Link href="/help" className="block hover:text-[#431830]">
                Authenticity Guaranteed
              </Link>
              <Link href="/help" className="block hover:text-[#431830]">
                Free Shipping over ₹500
              </Link>
              <Link href="/help" className="block hover:text-[#431830]">
                Easy Returns
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-[#1c1b1b]">
              About Us
            </h4>

            <div className="space-y-2 text-sm text-[#5f5e5d]">
              <Link href="/help" className="block hover:text-[#431830]">
                Contact Us
              </Link>
              <Link href="/help" className="block hover:text-[#431830]">
                Privacy Policy
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-[#1c1b1b]">
              Quick Links
            </h4>

            <div className="space-y-2 text-sm text-[#5f5e5d]">
              <Link href="/" className="block hover:text-[#431830]">
                Home
              </Link>
              <Link href="/offers" className="block hover:text-[#431830]">
                Offers
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}