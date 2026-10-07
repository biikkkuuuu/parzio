import { Product, CategoryItem } from '../types';

export const HERO_PRODUCT: Product = {
  id: 'hero-coin-bracelet',
  name: 'Coin Charm Link Bracelet',
  category: 'Bracelets',
  price: 99,
  originalPrice: 1200,
  savePercent: 91,
  rating: 4.9,
  reviewsCount: 1420,
  colorways: 40,
  sku: 'BR-99-COIN',
  material: '316L Surgical Stainless Steel',
  isWaterproof: true,
  isAntiTarnish: true,
  badge: 'HERO DROP',
  quote: 'Wore it all summer in the pool and beach — zero blackening! Truly unbelievable quality for ₹99.',
  image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=600&q=80',
  description: 'Handmade 316L surgical stainless steel with smooth links, coin charms, and shiny beads. 100% waterproof and anti-tarnish.'
};

// All mock products removed — store starts clean and only shows products added by admin in Admin Panel
export const VAULT_PRODUCTS: Product[] = [];

// All mock categories removed — store starts clean and only shows categories added by admin in Admin Panel
export const CATEGORIES_DATA: CategoryItem[] = [];
