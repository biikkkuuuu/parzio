import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyClxzB1hANXPC6HtBtVku9_it1xmSu9hkM",
  authDomain: "parzio-a62b4.firebaseapp.com",
  projectId: "parzio-a62b4",
  storageBucket: "parzio-a62b4.firebasestorage.app",
  messagingSenderId: "814679262936",
  appId: "1:814679262936:web:b126b4926990563243f9ad"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Data to seed
const CATEGORIES = [
  { id: 'cat-bangles', name: 'Bangles', subtitle: 'Trendy & Traditional', image: 'https://images.unsplash.com/photo-1611591475883-9b884179379e?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-mangalsutra', name: 'Mangalsutra', subtitle: 'A Bond for Life', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-jewellery-sets', name: 'Jewellery Sets', subtitle: 'Complete Your Look', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-earrings', name: 'Earrings', subtitle: 'Grace in Every Detail', image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-perfume', name: 'Perfume', subtitle: 'Fragrance for You', image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-beauty', name: 'Beauty & Care', subtitle: 'Look Good, Feel Good', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-necklaces', name: 'Necklaces', subtitle: 'Timeless Elegance', image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-rings', name: 'Rings', subtitle: 'Pure 18K Polish', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-bracelets', name: 'Bracelets', subtitle: 'Waterproof Cuffs', image: 'https://images.unsplash.com/photo-1611591475155-4284fa28973b?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-anklets', name: 'Anklets', subtitle: 'Daily Charm Anklets', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80' }
];

const INITIAL_COUPONS = [
  { id: 'coup-1', code: 'PARZIO99', title: 'Flat ₹99 Instant Privilege Off', discountType: 'fixed', discountValue: 99, minOrderValue: 499, usageCount: 142, usageLimit: 5000, active: true, expiresAt: '2026-12-31' },
  { id: 'coup-2', code: 'GOLD10', title: '10% Extra Off Demi-Fine Gold Collection', discountType: 'percentage', discountValue: 10, minOrderValue: 399, usageCount: 88, usageLimit: 2000, active: true, expiresAt: '2026-12-31' },
  { id: 'coup-3', code: 'FREESHIP', title: 'Free Express Priority Shipping', discountType: 'fixed', discountValue: 49, minOrderValue: 299, usageCount: 31, usageLimit: 1000, active: true, expiresAt: '2026-12-31' },
  { id: 'coup-4', code: 'FESTIVE15', title: '15% Off Festive Jewellery Sets', discountType: 'percentage', discountValue: 15, minOrderValue: 699, usageCount: 42, usageLimit: 500, active: true, expiresAt: '2026-12-31' }
];

const INITIAL_BANNERS = [
  {
    id: 'ban-1',
    badge: 'PARZIO ROYAL COLLECTION',
    title: 'Khoobsurati Aapki',
    highlightText: 'Andaz PARZIO Ka',
    subtitle: 'Aapke Shringar, Hamara Pyaar',
    description: 'Beauty Your Style Our Passion. Roz Khubsurat Banne ka Haq Sabka Hai.',
    priceTag: 'Special Drops',
    ctaText: 'SHOP NOW →',
    ctaLink: '#catalog',
    image: '/images/parzio-hero-banner.jpg',
    active: true
  },
  {
    id: 'ban-2',
    badge: 'TRENDING DROPS',
    title: 'Waterproof Bracelets &',
    highlightText: 'Golden Cuffs',
    subtitle: 'Zero Blackening • Lifetime Shine',
    description: 'Durable anti-tarnish cuffs and charm link bracelets designed for daily work & party wear.',
    priceTag: '₹99',
    ctaText: 'EXPLORE BRACELETS →',
    ctaLink: '#catalog',
    image: 'https://images.unsplash.com/photo-1611591475155-4284fa28973b?auto=format&fit=crop&w=1200&q=80',
    active: true
  }
];

const INITIAL_TOP_MARQUEE = [
  { id: 'mq-1', text: '⚡ FLASH SALE • EVERYTHING AT ₹99 ONLY', icon: 'sparkles', active: true },
  { id: 'mq-2', text: '💎 100% WATERPROOF & ANTI-TARNISH JEWELLERY', icon: 'shield', active: true },
  { id: 'mq-3', text: '🚚 FREE DELIVERY ON ALL ORDERS ABOVE ₹499', icon: 'truck', active: true },
  { id: 'mq-4', text: '🎁 USE CODE "PARZIO99" FOR INSTANT ₹99 OFF', icon: 'gift', active: true },
  { id: 'mq-5', text: '✨ LIFETIME ANTI-TARNISH QUALITY ASSURED', icon: 'sparkles', active: true },
  { id: 'mq-6', text: '📦 CASH ON DELIVERY AVAILABLE ACROSS INDIA', icon: 'truck', active: true }
];

async function seed() {
  console.log('🚀 Starting Firestore seed for project parzio-a62b4...');

  // 1. Categories
  for (const cat of CATEGORIES) {
    await setDoc(doc(db, 'categories', cat.id), cat);
    console.log(`✓ Category seeded: ${cat.name}`);
  }

  // 2. Coupons
  for (const cp of INITIAL_COUPONS) {
    await setDoc(doc(db, 'coupons', cp.id), cp);
    console.log(`✓ Coupon seeded: ${cp.code}`);
  }

  // 3. Store Banners & Marquee
  await setDoc(doc(db, 'store_settings', 'hero_banners'), {
    banners: INITIAL_BANNERS,
    updatedAt: new Date().toISOString()
  });
  console.log('✓ Store hero banners seeded');

  await setDoc(doc(db, 'store_settings', 'top_marquee'), {
    items: INITIAL_TOP_MARQUEE,
    updatedAt: new Date().toISOString()
  });
  console.log('✓ Top Marquee seeded');

  // 4. Products (from products.ts)
  // Dynamic import of ts file or basic vault products
  const products = [
    {
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
      stock: 50,
      image: 'https://images.unsplash.com/photo-1611591475155-4284fa28973b?auto=format&fit=crop&w=600&q=80',
      description: 'Handmade 316L surgical stainless steel with smooth links, coin charms, and shiny beads.'
    },
    {
      id: 'prod-red-bangles',
      name: 'Traditional Red Bangles Set',
      category: 'Bangles',
      price: 299,
      originalPrice: 499,
      savePercent: 40,
      rating: 5.0,
      reviewsCount: 840,
      colorways: 12,
      sku: 'BG-RED-299',
      material: 'Traditional Gold Foil & Acrylic Lacquer',
      isWaterproof: true,
      isAntiTarnish: true,
      badge: '40% OFF',
      stock: 45,
      image: 'https://images.unsplash.com/photo-1611591475883-9b884179379e?auto=format&fit=crop&w=600&q=80',
      description: 'Handcrafted traditional bridal and festive red lacquer bangles.'
    },
    {
      id: 'prod-velvet-bangles',
      name: 'Royal Velvet Touch Bangles',
      category: 'Bangles',
      price: 249,
      originalPrice: 399,
      savePercent: 38,
      rating: 4.9,
      reviewsCount: 620,
      colorways: 8,
      sku: 'BG-VLV-249',
      material: 'Velvet Finish Stainless Core',
      isWaterproof: true,
      isAntiTarnish: true,
      badge: 'POPULAR',
      stock: 35,
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
      description: 'Plush velvet exterior over a sturdy gold-tone alloy base.'
    },
    {
      id: 'prod-infinity-mangalsutra',
      name: 'Modern Infinity Gold Mangalsutra',
      category: 'Mangalsutra',
      price: 99,
      originalPrice: 1299,
      savePercent: 92,
      rating: 4.9,
      reviewsCount: 1120,
      colorways: 18,
      sku: 'MS-99-INF',
      material: '18K Gold PVD Stainless Steel + Black Beads',
      isWaterproof: true,
      isAntiTarnish: true,
      badge: 'BESTSELLER',
      stock: 60,
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
      description: 'Contemporary infinity pendant intertwined with traditional auspicious black spinels.'
    },
    {
      id: 'prod-solitaire-mangalsutra',
      name: 'Dainty Single Solitaire Mangalsutra',
      category: 'Mangalsutra',
      price: 99,
      originalPrice: 1199,
      savePercent: 92,
      rating: 4.8,
      reviewsCount: 940,
      colorways: 12,
      sku: 'MS-99-SOL',
      material: 'Cubic Zirconia Solitaire + 316L Chain',
      isWaterproof: true,
      isAntiTarnish: true,
      badge: 'DAILY WEAR',
      stock: 40,
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
      description: 'Understated elegance for daily modern workwear.'
    },
    {
      id: 'prod-teardrop-earrings',
      name: 'Viral High-Polish Teardrop Earrings',
      category: 'Earrings',
      price: 99,
      originalPrice: 1400,
      savePercent: 93,
      rating: 5.0,
      reviewsCount: 780,
      colorways: 28,
      sku: 'ER-99-TDR',
      material: '316L Stainless Steel Featherlight Hollow',
      isWaterproof: true,
      isAntiTarnish: true,
      badge: 'TIKTOK VIRAL',
      stock: 55,
      image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=600&q=80',
      description: 'Celebrity-favorite sculptural teardrop silhouette.'
    },
    {
      id: 'prod-snake-chain-necklace',
      name: 'Liquid Gold Herringbone Snake Chain',
      category: 'Necklaces',
      price: 99,
      originalPrice: 1299,
      savePercent: 92,
      rating: 4.9,
      reviewsCount: 1540,
      colorways: 32,
      sku: 'NK-99-SNK',
      material: '316L Surgical Steel 18K Real PVD Gold',
      isWaterproof: true,
      isAntiTarnish: true,
      badge: 'TOP TRENDING',
      stock: 80,
      image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=600&q=80',
      description: 'Flat, silky liquid gold herringbone chain that lays perfectly flat against collarbones.'
    },
    {
      id: 'prod-croissant-dome-ring',
      name: 'Chunky Croissant Dome Ring',
      category: 'Rings',
      price: 99,
      originalPrice: 1099,
      savePercent: 91,
      rating: 4.9,
      reviewsCount: 890,
      colorways: 24,
      sku: 'RG-99-CRS',
      material: 'Cast 316L Stainless Steel 18K Gold',
      isWaterproof: true,
      isAntiTarnish: true,
      badge: 'STATEMENT PIECE',
      stock: 45,
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
      description: 'French vintage croissant ridges on a bold dome ring.'
    }
  ];

  for (const prod of products) {
    await setDoc(doc(db, 'products', prod.id), prod);
    console.log(`✓ Product seeded: ${prod.name}`);
  }

  console.log('\n🎉 ALL COLLECTIONS & DATA SUCCESSFULLY CREATED IN FIRESTORE!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
