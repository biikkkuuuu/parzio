import React, { useState, useEffect } from 'react';
import { Sparkles, X, CheckCircle } from 'lucide-react';
import { VAULT_PRODUCTS } from '../data/products';

export const LivePurchaseToast: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [purchase, setPurchase] = useState({
    name: 'Ananya S.',
    city: 'Mumbai',
    product: VAULT_PRODUCTS[0],
    timeAgo: '2 mins ago'
  });

  const recentPurchases = [
    { name: 'Riya K.', city: 'New Delhi', productIdx: 0, time: '3 mins ago' },
    { name: 'Pooja M.', city: 'Bangalore', productIdx: 1, time: '5 mins ago' },
    { name: 'Tanvi S.', city: 'Pune', productIdx: 2, time: '1 min ago' },
    { name: 'Sneha R.', city: 'Hyderabad', productIdx: 3, time: '7 mins ago' },
    { name: 'Ishita D.', city: 'Jaipur', productIdx: 4, time: '4 mins ago' },
    { name: 'Aditi V.', city: 'Ahmedabad', productIdx: 5, time: '6 mins ago' },
  ];

  useEffect(() => {
    // Initial delay before first toast
    const initialTimer = setTimeout(() => {
      setVisible(true);
    }, 4000);

    // Periodic rotation every 25 seconds
    const interval = setInterval(() => {
      const random = recentPurchases[Math.floor(Math.random() * recentPurchases.length)];
      setPurchase({
        name: random.name,
        city: random.city,
        product: VAULT_PRODUCTS[random.productIdx % VAULT_PRODUCTS.length],
        timeAgo: random.time
      });
      setVisible(true);

      // Auto-hide after 7 seconds
      setTimeout(() => {
        setVisible(false);
      }, 7000);
    }, 25000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-16 md:bottom-6 left-3 sm:left-6 z-30 max-w-[calc(100vw-24px)] sm:max-w-sm animate-slideRight">
      <div className="bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl shadow-xl border border-[#eae5dc] flex items-center gap-3 relative">
        <button
          onClick={() => setVisible(false)}
          className="absolute top-2 right-2 text-[#747878] hover:text-[#141414] p-0.5 rounded-full"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <img
          src={purchase.product.image}
          alt={purchase.product.name}
          className="w-12 h-12 object-cover rounded-xl bg-[#faf8f5] border border-[#eae5dc] flex-shrink-0"
        />

        <div className="pr-4">
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#141414]">
            <span>{purchase.name}</span>
            <span className="text-[#747878] font-normal">from {purchase.city}</span>
            <CheckCircle className="w-3 h-3 text-emerald-600 fill-emerald-100 ml-0.5" />
          </div>
          <p className="text-xs font-semibold text-[#8c7138] line-clamp-1">
            Purchased {purchase.product.name}
          </p>
          <div className="flex items-center gap-2 text-[10px] text-[#747878] mt-0.5">
            <span className="font-mono text-[#141414] font-bold">₹{purchase.product.price}</span>
            <span>•</span>
            <span>{purchase.timeAgo}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
