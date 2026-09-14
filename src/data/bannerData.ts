import { MarqueeItem, StoreBanner } from '../types';

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
    text: '18K REAL GOLD FINISH • 100% WATERPROOF',
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
    text: '✨ 18K GOLD FINISH',
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
    title: 'Everything For',
    highlightText: 'Just ₹99',
    subtitle: 'Anti-Tarnish Daily Wear Jewellery',
    description: 'Enjoy 18K gold-finished necklaces, beautiful rings, and shining pearls. Made to resist water, sweat, and perfumes so you can wear them every day without any fading.',
    badge: 'SPECIAL SALE • FLAT ₹99',
    subBadge: '100% WATERPROOF',
    priceText: '₹99',
    stat1Value: '₹99',
    stat1Label: 'Fixed Price',
    stat2Value: '18K',
    stat2Label: 'Real Gold Plated',
    stat3Value: '5 Lac+',
    stat3Label: 'Happy Shoppers',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    buttonText: 'Shop ₹99 Vault',
    active: true
  },
  {
    id: 'ban-2',
    title: 'Festive Pearl &',
    highlightText: 'Emerald Drops',
    subtitle: '18K Gold Plated Royal Collection',
    description: 'Elevate your festive look with hand-selected freshwater baroque pearls and baguette cut emerald crystal pieces, now available at our ₹99 introductory vault price.',
    badge: 'FESTIVE DROP',
    subBadge: 'LIMITED PIECES',
    priceText: '₹99',
    stat1Value: '₹99',
    stat1Label: 'Intro Price',
    stat2Value: 'AAA',
    stat2Label: 'Grade Crystals',
    stat3Value: 'Zero',
    stat3Label: 'Tarnish Risk',
    image: 'https://images.unsplash.com/photo-1611591475819-79b8b730ab8b?auto=format&fit=crop&w=800&q=80',
    buttonText: 'Explore Collection',
    active: true
  }
];
