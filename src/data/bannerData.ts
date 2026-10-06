import { MarqueeItem, StoreBanner, InstagramPostItem } from '../types';

export const INITIAL_TOP_MARQUEE: MarqueeItem[] = [
  {
    id: 'marq-1',
    text: 'FREE EXPRESS SHIPPING ON ORDERS ₹500+',
    icon: 'truck',
    active: true
  },
  {
    id: 'marq-2',
    text: 'CASH ON DELIVERY (COD) AVAILABLE NATIONWIDE',
    icon: 'shield',
    active: true
  },
  {
    id: 'marq-3',
    text: 'SPECIAL SALE: EVERYTHING AT JUST ₹99',
    icon: 'tag',
    active: true
  },
  {
    id: 'marq-4',
    text: '316L SURGICAL STAINLESS STEEL • 100% WATERPROOF',
    icon: 'sparkles',
    active: true
  },
  {
    id: 'marq-5',
    text: '5,00,000+ HAPPY INDIAN WOMEN CUSTOMERS',
    icon: 'star',
    active: true
  },
  {
    id: 'marq-6',
    text: 'LIFETIME ANTI-TARNISH CERTIFIED GUARANTEE',
    icon: 'shield',
    active: true
  }
];

export const INITIAL_BANNER_MARQUEE: MarqueeItem[] = [
  {
    id: 'bmarq-1',
    text: '✨ 316L STAINLESS STEEL',
    icon: 'sparkles',
    active: true
  },
  {
    id: 'bmarq-2',
    text: '💧 SWEAT & PERFUME SAFE',
    icon: 'sparkles',
    active: true
  },
  {
    id: 'bmarq-3',
    text: '📦 FREE EXPRESS COURIER',
    icon: 'truck',
    active: true
  },
  {
    id: 'bmarq-4',
    text: '🛡️ 7 DAYS EASY REPLACEMENT',
    icon: 'shield',
    active: true
  },
  {
    id: 'bmarq-5',
    text: '🎁 FREE LUXURY VELVET POUCH',
    icon: 'gift',
    active: true
  }
];

export const INITIAL_BANNERS: StoreBanner[] = [
  {
    id: 'ban-1',
    title: 'Khoobsurati Aapki',
    highlightText: 'Andaz PARZIO Ka',
    subtitle: 'Aapke Shringar, Hamara Pyaar',
    description: 'Beauty Your Style Our Passion. Roz Khubsurat Banne ka Haq Sabka Hai.',
    badge: 'PARZIO ROYAL COLLECTION',
    subBadge: '100% ORIGINAL PRODUCTS',
    priceText: 'Special Drops',
    stat1Value: '100%',
    stat1Label: 'Original Products',
    stat2Value: '50,000+',
    stat2Label: 'Happy Shoppers',
    stat3Value: 'COD',
    stat3Label: 'Available',
    image: '/images/parzio-hero-banner.jpg',
    buttonText: 'SHOP NOW →',
    active: true
  },
  {
    id: 'ban-2',
    title: 'Waterproof Bracelets &',
    highlightText: 'Golden Cuffs',
    subtitle: 'Zero Blackening • Lifetime Shine',
    description: 'Durable anti-tarnish cuffs and charm link bracelets designed for daily work & party wear.',
    badge: 'TRENDING DROPS',
    subBadge: 'SWEATPROOF STEEL',
    priceText: '₹99',
    stat1Value: '₹99',
    stat1Label: 'All Items',
    stat2Value: '0',
    stat2Label: 'Tarnish Risk',
    stat3Value: '4.9★',
    stat3Label: 'Customer Rating',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1400&q=80',
    buttonText: 'EXPLORE BRACELETS',
    active: true
  },
  {
    id: 'ban-3',
    title: 'Lustrous Pearls &',
    highlightText: 'Emerald Crystals',
    subtitle: '316L Surgical Steel Royal Collection',
    description: 'Elevate your festive look with hand-selected freshwater pearls and baguette emerald pieces.',
    badge: 'FESTIVE SPECIAL',
    subBadge: 'LIMITED EDITION',
    priceText: '₹99',
    stat1Value: '₹99',
    stat1Label: 'Intro Price',
    stat2Value: 'AAA',
    stat2Label: 'Grade Crystals',
    stat3Value: '100%',
    stat3Label: 'Skin Safe',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80',
    buttonText: 'VIEW FESTIVE DROPS',
    active: true
  }
];

export const INITIAL_SALE_POSTERS = [
  {
    id: 'post-1',
    title: 'MEGA FESTIVE DISCOUNT POSTER',
    subtitle: 'Buy Any 3 Jewellery Pieces @ Flat ₹99 Each & Get Velvet Gift Pouch Free!',
    badge: 'LIMITED TIME OFFER • FLAT ₹99',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80',
    linkCategory: 'ALL SALE',
    buttonText: 'SHOP FESTIVE POSTER OFFER',
    active: true
  },
  {
    id: 'post-2',
    title: 'WATERPROOF NECKLACE COLLECTION POSTER',
    subtitle: '316L Surgical Grade Anti-Tarnish Golden Chains & Pendants',
    badge: 'UP TO 92% OFF',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80',
    linkCategory: 'NECKLACES',
    buttonText: 'EXPLORE NECKLACE POSTER',
    active: true
  }
];

export const INITIAL_INSTAGRAM_POSTS: InstagramPostItem[] = [
  {
    id: 'insta-1',
    imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80',
    postUrl: 'https://instagram.com/parzio.in',
    caption: 'Classic Anti-Tarnish Necklace',
    active: true
  },
  {
    id: 'insta-2',
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
    postUrl: 'https://instagram.com/parzio.in',
    caption: '18K Gold Plated Studs',
    active: true
  },
  {
    id: 'insta-3',
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80',
    postUrl: 'https://instagram.com/parzio.in',
    caption: 'Waterproof Everyday Ring',
    active: true
  },
  {
    id: 'insta-4',
    imageUrl: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=400&q=80',
    postUrl: 'https://instagram.com/parzio.in',
    caption: 'Chunky Gold Link Bracelet',
    active: true
  },
  {
    id: 'insta-5',
    imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=400&q=80',
    postUrl: 'https://instagram.com/parzio.in',
    caption: 'Minimal Layering Chain',
    active: true
  },
  {
    id: 'insta-6',
    imageUrl: 'https://images.unsplash.com/photo-1611591475816-43b664d4b121?auto=format&fit=crop&w=400&q=80',
    postUrl: 'https://instagram.com/parzio.in',
    caption: 'Pearl Drop Earrings',
    active: true
  },
  {
    id: 'insta-7',
    imageUrl: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=400&q=80',
    postUrl: 'https://instagram.com/parzio.in',
    caption: '316L Stainless Steel Bangle',
    active: true
  },
  {
    id: 'insta-8',
    imageUrl: 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?auto=format&fit=crop&w=400&q=80',
    postUrl: 'https://instagram.com/parzio.in',
    caption: 'Daily Luxe Essentials',
    active: true
  }
];
