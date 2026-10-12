import { Review, QCStep } from '../types';

export const REVIEWS_DATA: Review[] = [
  {
    id: 'rev-1',
    author: 'Pooja Sharma',
    location: 'Ranchi, Jharkhand',
    rating: 5,
    title: 'Pure 18K Luxury Finish! Exceeded expectations',
    comment: "Received my order in 3 days. The packing in the black and gold velvet pouch is so premium! I tested it by wearing in the shower and gym for a whole week, absolutely zero fading or green skin marks. Truly waterproof and looks like ₹20,000 real gold jewelry.",
    quote: "Pure 18K Luxury Finish! Exceeded expectations",
    purchasedItem: 'SATELLITE BEAD NECKLACE',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80'
    ],
    date: '3 days ago',
    isVerifiedBuyer: true,
    helpfulCount: 24
  },
  {
    id: 'rev-2',
    author: 'Ananya Roy',
    location: 'Kolkata, West Bengal',
    rating: 5,
    title: 'Value for money 10/10 ✨ Must buy!',
    comment: "Got this for my sister's birthday and she fell in love with it immediately. The clasp is very sturdy and the shine is top tier. Flipkart pe same piece 3x price me bikta hai. Parzio quality is unbeatable.",
    quote: "Value for money 10/10 ✨ Must buy!",
    purchasedItem: 'COIN CHARM LINK BRACELET',
    images: [
      'https://images.unsplash.com/photo-1611591475819-79730e70f3f1?auto=format&fit=crop&w=600&q=80'
    ],
    date: '1 week ago',
    isVerifiedBuyer: true,
    helpfulCount: 19
  },
  {
    id: 'rev-3',
    author: 'Kiran Singh',
    location: 'Patna, Bihar',
    rating: 5,
    title: 'Such beautiful craftsmanship & fast delivery',
    comment: "The gold tone is so subtle and elegant, not that cheap yellowish color. Beautifully crafted demi-fine piece. Came with certificate of anti-tarnish authenticity. Will definitely order more designs!",
    quote: "Such beautiful craftsmanship & fast delivery",
    purchasedItem: 'EMERALD CRYSTAL DROPS',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80'
    ],
    date: '2 weeks ago',
    isVerifiedBuyer: true,
    helpfulCount: 15
  },
  {
    id: 'rev-4',
    author: 'Shazia Ansari',
    location: 'Mumbai, Maharashtra',
    rating: 4,
    title: 'Genuine anti-tarnish, very comfortable',
    comment: "Weight feels very balanced on the neck. Doesn't feel cheap or hollow. Been wearing daily to office for 2 weeks now, still shines like new. Deducted 1 star only because courier delivery took 4 days.",
    quote: "Genuine anti-tarnish, very comfortable",
    purchasedItem: 'BYPASS CRYSTAL RING',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80'
    ],
    date: '2 weeks ago',
    isVerifiedBuyer: true,
    helpfulCount: 11
  },
  {
    id: 'rev-5',
    author: 'Meenakshi Rawat',
    location: 'Delhi NCR',
    rating: 5,
    title: 'Obsessed with the shine & detailing!',
    comment: "I have sensitive skin and usually get rashes from artificial jewellery. But this 316L stainless steel has caused zero irritation. Highly recommended for daily wear lovers!",
    quote: "Obsessed with the shine & detailing!",
    purchasedItem: 'HONEYCOMB KADA BANGLE',
    images: [
      'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=600&q=80'
    ],
    date: '3 weeks ago',
    isVerifiedBuyer: true,
    helpfulCount: 8
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
    title: '316L Steel PVD Finish',
    standard: '100% Anti-Tarnish',
    description: 'High-durability PVD vacuum coating bonded on surgical steel so the finish stays brilliant without fading.',
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
