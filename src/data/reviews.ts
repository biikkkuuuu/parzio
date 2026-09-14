import { Review, QCStep } from '../types';

export const REVIEWS_DATA: Review[] = [
  {
    id: 'rev-1',
    author: 'Kiran Singh',
    role: 'Verified Buyer • 2 weeks ago',
    rating: 5,
    quote: "Such beautiful craftsmanship, truly impressive. I couldn't believe it was only ₹99 when I opened the pouch. The gold finish has this high-end warm glow and doesn't look yellow or cheap.",
    purchasedItem: 'SATELLITE BEAD NECKLACE'
  },
  {
    id: 'rev-2',
    author: 'Shazia Ansari',
    role: 'Local Guide • 5 reviews',
    rating: 5,
    quote: "Made a detailed unboxing review too -- that's how happy I am with Parzio! The anti-tarnish promise is 100% genuine. I wore my charm bracelet during workouts and no skin discoloration.",
    purchasedItem: 'COIN CHARM LINK BRACELET'
  },
  {
    id: 'rev-3',
    author: 'Chitra Chaudhary',
    role: 'Verified Buyer • 22 reviews',
    rating: 5,
    quote: "I am very satisfied with my purchases of Parzio jewelry. I have previously also purchased their pieces twice. Excellent finish and comfortable to wear everyday.",
    purchasedItem: 'EMERALD CRYSTAL DROPS'
  },
  {
    id: 'rev-4',
    author: 'Kavya Gaur',
    role: 'Verified Buyer • 3 reviews',
    rating: 5,
    quote: "Parzio designs are beautiful. The collection is trendy, elegant, and perfect for both daily wear and special occasions. The finishing and detailing are premium yet is affordable.",
    purchasedItem: 'BYPASS CRYSTAL RING'
  },
  {
    id: 'rev-5',
    author: 'Indu Payal',
    role: 'Verified Buyer • 2 reviews',
    rating: 5,
    quote: "Your jewellery collection is seriously enviable! Every piece is more gorgeous than the last, and this one is no exception. The way it sparkles and shines is mesmerizing!",
    purchasedItem: 'UNCUT PEARL CHOKER'
  },
  {
    id: 'rev-6',
    author: 'Meenakshi Rawat',
    role: 'Verified Buyer • 3 reviews',
    rating: 5,
    quote: "I had ordered many items from Parzio, and it was a great experience. They delivered excellent quality products, and I received my parcel on time. Their service is truly prompt and reliable.",
    purchasedItem: 'HONEYCOMB KADA BANGLE'
  }
];

export const QC_STEPS_DATA: QCStep[] = [
  {
    id: 1,
    title: 'Pure Stainless Steel',
    standard: '100% Rust-Proof',
    description: 'High-grade stainless steel ensures your jewellery never rusts and never irritates your skin.',
    passed: true
  },
  {
    id: 2,
    title: '18K Real Gold Plating',
    standard: 'Long-Lasting Shine',
    description: 'Real 18-karat gold layer bonded securely so the golden shine lasts for years without fading.',
    passed: true
  },
  {
    id: 3,
    title: 'Water & Sweat Test',
    standard: '100% Waterproof',
    description: 'Tested against water, sweat, and perfumes so you can wear your jewellery in the shower, gym, or daily.',
    passed: true
  },
  {
    id: 4,
    title: 'Strong Clasp & Lock',
    standard: 'Tested 1,000 Times',
    description: 'Every lock, hook, and ring is tested to open and close smoothly without breaking or coming loose.',
    passed: true
  },
  {
    id: 5,
    title: 'Hand Polish & Shine',
    standard: 'Mirror Finish',
    description: 'Carefully polished with soft cloth to give every piece a smooth feel and brilliant shine.',
    passed: true
  }
];
