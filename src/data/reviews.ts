import { Review, QCStep } from '../types';

export const REVIEWS_DATA: Review[] = [];

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
