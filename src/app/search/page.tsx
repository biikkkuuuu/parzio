"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./search.module.css";

type Result = {
  id: number;
  title: string;
  brand: string;
  category: string;
  price?: number;
  image: string;
};

const results: Result[] = [
  {
    id: 1,
    title: "Radiance Glow Serum",
    brand: "LUMINA",
    category: "Serum",
    price: 1499,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBL1yaFv08PJ3axK16QzPEMdzTbGNBONmdH6_Sv0zspPbj1gtyqViIJFwt2afYiqYCYMFs6cJ-0ksBf5EEHG0doP-j16YESlTZY8W1_huFQOrv2hmivdMPy4170ES36o6PGJY-i8en9i1rGzYP6E7m3FsuaJHMGgNWSUDEz08bJubOqv9YNNbBk_DEYDCoX7DZ3-ZwYmdON-bEe5jJzM2euEHq9U_NZsmDBo0Y_xkRnlTgbkU4sfqOu",
  },
  {
    id: 2,
    title: "Hydra Restore Serum",
    brand: "BOTANICA",
    category: "Serum",
    price: 1299,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAprxoZl6cvq_VALB5FRKww091uHtSRhBXdTgeq_1MgKkD8u9KF61CLXIsmhJo33JbnznNoaED1-ao2NqIGQJztU5mZMIFGnqpZ2VJQlVfqkqH7tFKrDPXTS9gh3sUQdXZln3l1Z1eN7QrPdqH4bZkIIJKYXnGmh66uZ4w-_b-BktJ8WqGA32GC5Boi3RWgqyQ6Z_mLfr7XJ4Xj1oDXyLHhOt8zMC5lKfHxBM2eXs9oY-a-Y5yOcLJL",
  },
  {
    id: 3,
    title: "Gentle Purifying Cleanser",
    brand: "AURA",
    category: "Cleanser",
    price: 950,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDXyilgB8Mwxqx2cpQHyh6xhkkLL23CqADks5EJn37lQ7qny3Y9mhoJvgXNi66opdmpzbN9GLdPC6JN0ss_g7ewipMJbpNJhuwGsn_DutQ0YBm9kF0TGJ9rTYUXOBJ9xo0MZer2aasptzfs8jMMGP0Pczh9Yvf0UeL3c3ZWlCjLvw68VIAC8qGCv8INseV3UxvTdr_TFvquQRohdvtNnbHpaEy6XIel-BiQkjVnNPEsroV5q5gRow9h",
  },
  {
    id: 4,
    title: "Barrier Repair Moisturizer",
    brand: "DERMA LAB",
    category: "Moisturizer",
    price: 1450,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDjFw6EJsmSMqiASCKp0bhVkmsDWeM8NLExEZkavMSnrTJo8HKVgRImPJ11fsCyksI1rM_0NF7eFVCOisDoJQ9D0pKZXZpyorIVjIT-bN-0NFF3atZPFewZeNThXsbywAC3So21Np5YQTZiHaTuqmpb158U8ubxhkZ2uRhyaGYVM_Ttm7SlCVJQCKoAKCNMsv8TpSH_I5UuCHzIfdTM4qVHpj4T50NhOkBVbEaQHt1YA4vri8G_OrfK",
  },
  {
    id: 5,
    title: "Daily UV Shield SPF 50",
    brand: "SOLARIS",
    category: "Sunscreen",
    price: 1299,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD7g9Q2M4X8N3F1H5R7K6T2W8P9L4V6Y0B3C2D8J1S5",
  },
  {
    id: 6,
    title: "Overnight Renewal Cream",
    brand: "LUMIERE",
    category: "Moisturizer",
    price: 2400,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC3L8J1H5M7N2Q6R9W4Y0T3P8S5K2D7F1V6B4G9X0",
  },
];

const recentDefaults = ["Skincare", "Serum", "LUMINA"];

const trending = [
  "Vitamin C",
  "Sunscreen",
  "Lipstick",
  "Haircare",
  "Moisturizer",
  "Perfume",
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState(recentDefaults);

  const normalizedQuery = query.trim().toLowerCase();

  const liveSuggestions = useMemo(() => {
    if (!normalizedQuery) return [];

    return results
      .filter(
        (item) =>
          item.title.toLowerCase().includes(normalizedQuery) ||
          item.brand.toLowerCase().includes(normalizedQuery) ||
          item.category.toLowerCase().includes(normalizedQuery),
      )
      .slice(0, 5);
  }, [normalizedQuery]);

  const searchResults = useMemo(() => {
    const term = submittedQuery.trim().toLowerCase();

    if (!term) return [];

    return results.filter(
      (item) =>
        item.title.toLowerCase().includes(term) ||
        item.brand.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term),
    );
  }, [submittedQuery]);

  const doSearch = (value: string) => {
    const nextQuery = value.trim();

    if (!nextQuery) return;

    setSubmittedQuery(nextQuery);
    setQuery(nextQuery);

    setRecentSearches((current) => [
      nextQuery,
      ...current.filter(
        (item) => item.toLowerCase() !== nextQuery.toLowerCase(),
      ),
    ].slice(0, 5));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    doSearch(query);
  };

  const clearSearch = () => {
    setQuery("");
    setSubmittedQuery("");
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.brand}>
            PARZIO
          </Link>

          <nav className={styles.nav}>
            <Link href="/products">Categories</Link>
            <Link href="/products">Brands</Link>
            <Link href="/offers">Offers</Link>
            <Link href="/products">New Arrivals</Link>
          </nav>

          <div className={styles.headerActions}>
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

      <section className={styles.container}>
        <div className={styles.mobileTop}>
          <Link href="/" aria-label="Back">
            ←
          </Link>
          <h1>Search</h1>
        </div>

        <div className={styles.titleBlock}>
          <h1>Search</h1>
          <p>Find products, brands and beauty essentials.</p>
        </div>

        <form className={styles.searchForm} onSubmit={handleSubmit}>
          <span className={styles.searchIcon}>⌕</span>

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for products, brands, or concerns..."
            aria-label="Search products"
          />

          {query && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={clearSearch}
              aria-label="Clear search"
            >
              ×
            </button>
          )}

          <button type="submit" className={styles.searchButton}>
            Search
          </button>
        </form>

        {normalizedQuery && liveSuggestions.length > 0 && !submittedQuery ? (
          <section className={styles.suggestions}>
            <h2>Suggestions</h2>

            {liveSuggestions.map((item) => (
              <button
                key={item.id}
                type="button"
                className={styles.suggestionItem}
                onClick={() => doSearch(item.title)}
              >
                <div className={styles.suggestionImage}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="52px"
                  />
                </div>

                <span>
                  <strong>{item.title}</strong>
                  <small>
                    {item.brand} · {item.category}
                  </small>
                </span>

                <span>→</span>
              </button>
            ))}
          </section>
        ) : submittedQuery ? (
          <section className={styles.resultsSection}>
            <div className={styles.resultsHeader}>
              <div>
                <h2>Search results</h2>
                <p>
                  {searchResults.length} result
                  {searchResults.length === 1 ? "" : "s"} for &quot;
                  {submittedQuery}&quot;
                </p>
              </div>

              <button type="button" onClick={clearSearch}>
                Clear
              </button>
            </div>

            {searchResults.length > 0 ? (
              <div className={styles.resultGrid}>
                {searchResults.map((item) => (
                  <Link
                    href={`/products/${item.id}`}
                    key={item.id}
                    className={styles.resultCard}
                  >
                    <div className={styles.resultImage}>
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 767px) 50vw, 25vw"
                      />
                    </div>

                    <div className={styles.resultContent}>
                      <span>{item.brand}</span>
                      <h3>{item.title}</h3>
                      <p>{item.category}</p>

                      {item.price && (
                        <strong>
                          ₹{item.price.toLocaleString("en-IN")}
                        </strong>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <div>⌕</div>
                <h3>No products found</h3>
                <p>Try a different product, brand, or category.</p>
                <Link href="/products">Browse Products</Link>
              </div>
            )}
          </section>
        ) : (
          <section className={styles.browse}>
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Recent searches</h2>

                <button
                  type="button"
                  onClick={() => setRecentSearches([])}
                >
                  Clear
                </button>
              </div>

              {recentSearches.length > 0 ? (
                <div className={styles.recentList}>
                  {recentSearches.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={styles.recentItem}
                      onClick={() => doSearch(item)}
                    >
                      <span>↗</span>
                      {item}
                    </button>
                  ))}
                </div>
              ) : (
                <p className={styles.noRecent}>No recent searches.</p>
              )}
            </div>

            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Trending searches</h2>
              </div>

              <div className={styles.trending}>
                {trending.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => doSearch(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.discovery}>
              <div>
                <span>Explore</span>
                <h2>Discover beauty made for you.</h2>
                <p>
                  Explore skincare, makeup, fragrance and more from curated
                  brands.
                </p>
              </div>

              <Link href="/products">Shop all products →</Link>
            </div>
          </section>
        )}
      </section>

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