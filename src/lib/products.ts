import type { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: 1,
    brand: "LUMIERE",
    name: "Hydra Restore Serum",
    price: 1850,
    rating: 4.8,
    reviews: 128,
    badge: "BESTSELLER",
    category: "Serums",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC7QH0j2j3B7lQ4a9QvGxKfYjQJdGdZLJv4Pp5oT9Qw0C5fM8L6M1lP5Lq3P9rL8dKqC2LzM2tL6kN4XyJ8JjP8CzK7Yg6y8lQh3JQ2",
    description:
      "A hydrating serum designed to restore moisture and leave skin looking fresh and radiant.",
  },
  {
    id: 2,
    brand: "BOTANICA",
    name: "Radiance Vitamin C Serum",
    price: 2200,
    rating: 4.7,
    reviews: 96,
    badge: "NEW",
    category: "Serums",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD6Jx0nW0mO8o9Q4g3N9G5d1M6d4f2K7c3P8m0X7z4Q6m2L7k0R8Y5Q0R3H6N7P2X1",
    description:
      "A lightweight vitamin C formula created to brighten the appearance of dull-looking skin.",
  },
  {
    id: 3,
    brand: "AURA",
    name: "Gentle Purifying Cleanser",
    price: 950,
    rating: 4.9,
    reviews: 42,
    badge: "NEW",
    category: "Cleansers",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDXyilgB8Mwxqx2cpQHyh6xhkkLL23CqADks5EJn37lQ7qny3Y9mhoJvgXNi66opdmpzbN9GLdPC6JN0ss_g7ewipMJbpNJhuwGsn_DutQ0YBm9kF0TGJ9rTYUXOBJ9xo0MZer2aasptzfs8jMMGP0Pczh9Yvf0UeL3c3ZWlCjLvw68VIAC8qGCv8INseV3UxvTdr_TFvquQRohdvtNnbHpaEy6XIel-BiQkjVnNPEsroV5q5gRow9h",
    description:
      "A gentle daily cleanser that removes impurities without leaving skin feeling stripped.",
  },
  {
    id: 4,
    brand: "BOTANICA",
    name: "AHA/BHA Clarifying Toner",
    price: 2100,
    rating: 4.6,
    reviews: 156,
    category: "Toners",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA6tUUWqvvLYHoE96sG565d-GHYPSe1hzLp1HOIDWHwZqWqjVcTp2VPP84sQRNVCvpNdUzqsGK5UdfOCWmupIyCAoBZwwJP58Y9y7x_dHnnWj67kkHlO6RhGAIPjYNq7mQS7xjd5cZlduuY_o6nSHcca4T-OAIVfo_sNpcpTUiYA4hRgil-fJ41VYkWQvqSFgJcCekAJFU9DHNV8ag0uP_i2iS6tAtoaIH_dkFH9rPAfaCdmLQcm_9",
    description:
      "A clarifying toner formulated to refresh the skin and support a smoother-looking complexion.",
  },
  {
    id: 5,
    brand: "DERMA LAB",
    name: "Barrier Repair Moisturizer",
    price: 1450,
    rating: 4.8,
    reviews: 89,
    category: "Moisturizers",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD0wQW8L3f4B4K9m1P6R7N2K8M6F3Q5X9V0H4J7L2S6R8",
    description:
      "A nourishing moisturizer designed to support the skin barrier and improve everyday hydration.",
  },
  {
    id: 6,
    brand: "SOLARIS",
    name: "Daily UV Shield SPF 50",
    price: 1299,
    rating: 4.7,
    reviews: 212,
    badge: "POPULAR",
    category: "Sunscreens",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD7g9Q2M4X8N3F1H5R7K6T2W8P9L4V6Y0B3C2D8J1S5",
    description:
      "A daily sunscreen with SPF 50 protection for a comfortable everyday skincare routine.",
  },
  {
    id: 7,
    brand: "LUMIERE",
    name: "Overnight Renewal Cream",
    price: 2400,
    rating: 4.9,
    reviews: 67,
    category: "Moisturizers",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC3L8J1H5M7N2Q6R9W4Y0T3P8S5K2D7F1V6B4G9X0",
    description:
      "A rich overnight cream created to leave skin feeling replenished and refreshed by morning.",
  },
  {
    id: 8,
    brand: "PURE THEORY",
    name: "Calming Cica Gel",
    price: 1099,
    rating: 4.5,
    reviews: 74,
    category: "Treatments",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuE2M7N1Q9F4L6R3X8W0H5K2T7P1D9V4C6B8S3J0",
    description:
      "A soothing cica gel designed for a lightweight, calming step in your skincare routine.",
  },
];

export function getProductById(id: number) {
  return products.find((product) => product.id === id);
}