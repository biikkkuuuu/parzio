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

export const CATEGORIES_DATA: CategoryItem[] = [
  {
    id: 'cat-bangles',
    name: 'Bangles',
    subtitle: 'Trendy & Traditional',
    image: 'https://images.unsplash.com/photo-1611591475883-9b884179379e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cat-mangalsutra',
    name: 'Mangalsutra',
    subtitle: 'A Bond for Life',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cat-jewellery-sets',
    name: 'Jewellery Sets',
    subtitle: 'Complete Your Look',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cat-earrings',
    name: 'Earrings',
    subtitle: 'Grace in Every Detail',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cat-perfume',
    name: 'Perfume',
    subtitle: 'Fragrance for You',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cat-beauty',
    name: 'Beauty & Care',
    subtitle: 'Look Good, Feel Good',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80'
  }
];
