import React, { useState } from 'react';
import { REVIEWS_DATA } from '../data/reviews';
import { Star, CheckCircle, Plus, X, Sparkles, MessageSquareHeart } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState(REVIEWS_DATA);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [author, setAuthor] = useState('');
  const [role, setRole] = useState('Verified Buyer');
  const [rating, setRating] = useState(5);
  const [quote, setQuote] = useState('');
  const [purchasedItem, setPurchasedItem] = useState('');
  const [successToast, setSuccessToast] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !quote.trim()) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      author: author.trim(),
      role: role.trim() || 'Verified Buyer',
      rating,
      quote: quote.trim(),
      purchasedItem: purchasedItem.trim() || '18K Anti-Tarnish Jewellery'
    };

    setReviews([newRev, ...reviews]);
    setIsModalOpen(false);
    setAuthor('');
    setQuote('');
    setPurchasedItem('');
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3500);
  };

  return (
    <section className="py-14 sm:py-18 bg-[#faf8f5] border-b border-[#eae5dc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Google Badge & Rating Header */}
        <div className="flex flex-col items-center text-center max-w-xl mx-auto mb-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 flex items-center justify-center font-bold text-base">
              <span className="text-[#4285F4]">G</span>
              <span className="text-[#EA4335]">o</span>
              <span className="text-[#FBBC05]">o</span>
              <span className="text-[#4285F4]">g</span>
              <span className="text-[#34A853]">l</span>
              <span className="text-[#EA4335]">e</span>
            </div>
            <span className="font-display text-xl sm:text-2xl font-bold text-[#141414]">
              Verified Customer Reviews
            </span>
          </div>

          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
              ))}
            </div>
            <span className="text-sm font-bold text-[#141414]">4.9 / 5.0</span>
          </div>
          <p className="text-xs text-[#747878]">
            Over 10,800+ authenticated customer testimonials nationwide
          </p>

          {/* Write Review Trigger Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 px-4 py-2 rounded-full bg-white hover:bg-[#f3efe9] text-[#141414] border border-[#eae5dc] hover:border-[#8c7138] text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-[#8c7138]" />
            <span>Write a Customer Review</span>
          </button>
        </div>

        {/* Success Feedback Banner */}
        {successToast && (
          <div className="max-w-md mx-auto mb-8 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2 shadow-xs animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Thank you! Your verified review has been published to the atelier.</span>
          </div>
        )}

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {reviews.map((rev) => {
            const initials = rev.author
              .split(' ')
              .map((n) => n[0])
              .join('');

            return (
              <div
                key={rev.id}
                className="p-5 rounded-2xl bg-white border border-[#eae5dc] shadow-xs flex flex-col justify-between hover:border-[#8c7138]/40 transition-all duration-200"
              >
                <div>
                  {/* Author Row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#f4f2ee] border border-[#eae5dc] text-[#8c7138] font-bold text-xs flex items-center justify-center">
                        {initials}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#141414] leading-tight">
                          {rev.author}
                        </h4>
                        <p className="text-[11px] text-[#747878] mt-0.5">
                          {rev.role}
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </span>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center text-amber-500 mb-3">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-xs sm:text-sm text-[#444748] leading-relaxed italic">
                    "{rev.quote}"
                  </p>
                </div>

                {/* Purchased Item Footer */}
                <div className="mt-4 pt-3 border-t border-[#eae5dc]">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#8c7138]">
                    Purchased: {rev.purchasedItem}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Write a Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#fbf9f6] w-full max-w-md rounded-3xl p-6 shadow-2xl border border-[#eae5dc] relative text-[#141414]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#747878] hover:text-[#141414] hover:bg-[#f3efe9]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <MessageSquareHeart className="w-5 h-5 text-[#8c7138]" />
              <h3 className="font-display text-lg font-bold text-[#141414]">
                Write a Verified Review
              </h3>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#141414] mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhika Sharma"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#eae5dc] text-xs text-[#141414] focus:outline-none focus:border-[#8c7138]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141414] mb-1">Purchased Item (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 18K Solitaire Necklace"
                  value={purchasedItem}
                  onChange={(e) => setPurchasedItem(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#eae5dc] text-xs text-[#141414] focus:outline-none focus:border-[#8c7138]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141414] mb-1">Star Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setRating(s)}
                      className={`p-2 rounded-xl border flex items-center gap-1 text-xs font-bold transition-all ${
                        rating >= s
                          ? 'bg-amber-50 border-amber-300 text-amber-700'
                          : 'bg-white border-[#eae5dc] text-[#747878]'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${rating >= s ? 'fill-amber-500 text-amber-500' : 'text-neutral-300'}`} />
                      <span>{s}★</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141414] mb-1">Your Experience &amp; Feedback</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Tell us about the shine, finish, and packaging..."
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#eae5dc] text-xs text-[#141414] focus:outline-none focus:border-[#8c7138]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#141414] text-[#fed488] hover:bg-[#8c7138] hover:text-white transition-all text-xs font-bold uppercase tracking-wider shadow-md active:scale-98"
              >
                Submit Verified Testimonial
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
