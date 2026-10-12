import React, { useState, useMemo } from 'react';
import {
  Star,
  ShieldCheck,
  ThumbsUp,
  Camera,
  CheckCircle2,
  X,
  Plus,
  ChevronRight,
  Filter,
  Image as ImageIcon
} from 'lucide-react';
import { Product, Review } from '../types';
import { WriteReviewModal } from './WriteReviewModal';
import { dbService } from '../services/dbService';

interface ProductReviewsSectionProps {
  product?: Product;
  productId?: string;
  productName?: string;
  reviews?: Review[];
  onReviewSubmitted?: (review: Review) => void;
  onAddReview?: (review: Omit<Review, 'id' | 'date'>) => Promise<void>;
  onMarkHelpful?: (reviewId: string) => void;
  currentUser?: { name?: string; phone?: string; address?: string } | null;
  userProfile?: { name?: string; phone?: string; address?: string } | null;
}

type FilterOption = 'all' | 'with-photos' | '5-star' | '4-star' | '3-star';

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
  product,
  productId,
  productName,
  reviews = [],
  onReviewSubmitted,
  onAddReview,
  onMarkHelpful,
  currentUser,
  userProfile
}) => {
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('all');
  const [activePhotoModal, setActivePhotoModal] = useState<{
    imageUrl: string;
    review: Review;
  } | null>(null);
  const [helpfulMap, setHelpfulMap] = useState<Record<string, number>>({});
  const [votedMap, setVotedMap] = useState<Record<string, boolean>>({});
  const [displayCount, setDisplayCount] = useState<number>(5);

  const effectiveId = product?.id || productId || '';
  const effectiveName = product?.name || productName || 'PARZIO Piece';

  // Relevant reviews for this product or general fallback
  const productReviews = useMemo(() => {
    const list = Array.isArray(reviews) ? reviews : [];
    if (!effectiveId && !effectiveName) return list;
    const directMatches = list.filter(
      (r) =>
        Boolean(r && effectiveId && r.productId === effectiveId) ||
        Boolean(r && effectiveName && r.purchasedItem && r.purchasedItem.toLowerCase() === effectiveName.toLowerCase())
    );
    if (directMatches.length > 0) return directMatches;
    return list;
  }, [reviews, effectiveId, effectiveName]);

  // All customer uploaded photos across all reviews for this product
  const allCustomerPhotos = useMemo(() => {
    const list: { imageUrl: string; review: Review }[] = [];
    productReviews.forEach((r) => {
      if (r.images && r.images.length > 0) {
        r.images.forEach((img) => {
          list.push({ imageUrl: img, review: r });
        });
      }
    });
    return list;
  }, [productReviews]);

  // Ratings calculation
  const totalReviewsCount = productReviews.length;
  const averageRating = useMemo(() => {
    if (totalReviewsCount === 0) return product?.rating || 4.9;
    const sum = productReviews.reduce((acc, r) => acc + (r.rating || 5), 0);
    return (sum / totalReviewsCount).toFixed(1);
  }, [productReviews, totalReviewsCount, product?.rating]);

  // Star breakdown percentages
  const ratingDistribution = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    productReviews.forEach((r) => {
      const star = Math.min(Math.max(Math.round(r.rating || 5), 1), 5) as 1 | 2 | 3 | 4 | 5;
      counts[star]++;
    });
    const total = totalReviewsCount || 1;
    return {
      5: Math.round((counts[5] / total) * 100),
      4: Math.round((counts[4] / total) * 100),
      3: Math.round((counts[3] / total) * 100),
      2: Math.round((counts[2] / total) * 100),
      1: Math.round((counts[1] / total) * 100)
    };
  }, [productReviews, totalReviewsCount]);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return productReviews.filter((r) => {
      if (selectedFilter === 'with-photos') return r.images && r.images.length > 0;
      if (selectedFilter === '5-star') return r.rating >= 5;
      if (selectedFilter === '4-star') return r.rating === 4;
      if (selectedFilter === '3-star') return r.rating <= 3;
      return true;
    });
  }, [productReviews, selectedFilter]);

  const handleHelpfulClick = async (reviewId: string) => {
    if (votedMap[reviewId]) return;
    setVotedMap((prev) => ({ ...prev, [reviewId]: true }));
    const newCount = await dbService.markReviewHelpful(reviewId);
    setHelpfulMap((prev) => ({ ...prev, [reviewId]: newCount }));
  };

  return (
    <div id="customer-reviews-section" className="mt-12 sm:mt-16 border-t border-[#eae5dc] pt-8 sm:pt-10">
      
      {totalReviewsCount === 0 ? (
        /* Clean Flipkart / Amazon No Reviews State */
        <div className="bg-[#faf8f5] rounded-3xl p-8 sm:p-12 border border-[#eae5dc] text-center max-w-xl mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-white border border-[#eae5dc] text-[#8c7138] flex items-center justify-center mx-auto shadow-xs">
            <Star className="w-5 h-5 text-[#8c7138]" />
          </div>
          <span className="text-[10px] font-bold text-[#8c7138] uppercase tracking-wider block">
            RATINGS &amp; REVIEWS
          </span>
          <h3 className="font-bold text-base sm:text-lg text-[#141414]">
            No Reviews Yet
          </h3>
          <p className="text-xs sm:text-sm text-[#747878] leading-relaxed max-w-md mx-auto">
            This piece has not received verified reviews yet. Once your order is delivered, you can upload real unboxing photos and review this piece from your <strong>My Orders</strong> section!
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setIsWriteModalOpen(true)}
              className="px-5 py-2.5 rounded-full bg-[#141414] hover:bg-[#8c7138] text-[#fed488] hover:text-white font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* 1. Header & Summary Grid (Flipkart-Grade Layout) */}
          <div className="bg-[#faf8f5] rounded-3xl p-5 sm:p-7 border border-[#eae5dc] mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Left: Overall Score + Star Breakdown */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 flex-1">
            
            {/* Big Score Box */}
            <div className="text-center sm:text-left shrink-0">
              <span className="text-[11px] font-bold text-[#8c7138] uppercase tracking-wider block mb-1">
                RATINGS &amp; REVIEWS
              </span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-[#141414] text-[#fed488] px-3.5 py-1.5 rounded-2xl text-xl sm:text-2xl font-black shadow-sm">
                  <span>{averageRating}</span>
                  <Star className="w-5 h-5 fill-current text-[#fed488]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-[#141414]">
                    {totalReviewsCount} Verified Reviews
                  </h3>
                  <p className="text-[11px] text-[#747878] mt-0.5 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>100% Certified Demi-Fine Buyers</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Star Distribution Progress Bars */}
            <div className="w-full sm:max-w-xs space-y-1.5 pt-2 sm:pt-0 sm:border-l sm:border-[#eae5dc] sm:pl-6">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-2 text-xs">
                  <span className="w-6 font-bold text-[#141414] flex items-center gap-0.5 text-[11px]">
                    {star} <Star className="w-2.5 h-2.5 fill-current text-[#8c7138]" />
                  </span>
                  <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        star >= 4 ? 'bg-emerald-600' : star === 3 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${ratingDistribution[star as 1 | 2 | 3 | 4 | 5]}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-mono text-[10px] text-[#747878]">
                    {ratingDistribution[star as 1 | 2 | 3 | 4 | 5]}%
                  </span>
                </div>
              ))}
            </div>

          </div>

          {/* Right: CTA Button */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsWriteModalOpen(true)}
              className="px-6 py-3 rounded-full bg-[#141414] hover:bg-[#8c7138] text-[#fed488] hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Rate &amp; Review Product</span>
            </button>
            <p className="text-[10px] text-[#747878] text-center lg:text-right">
              Bought this piece? Share your real photos &amp; shine feedback.
            </p>
          </div>

        </div>
      </div>

      {/* 2. Customer Uploaded Photos Carousel (Flipkart Style) */}
      {allCustomerPhotos.length > 0 && (
        <div className="mb-8 p-5 bg-white rounded-3xl border border-[#eae5dc] shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#8c7138]" />
              <h4 className="font-bold text-sm text-[#141414]">Customer Photos &amp; Real Unboxings</h4>
              <span className="text-xs text-[#747878] font-mono">({allCustomerPhotos.length})</span>
            </div>
            <span className="text-[11px] text-[#8c7138] font-semibold hidden sm:inline">
              Tap photo to inspect real piece finish &amp; reviewer notes
            </span>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
            {allCustomerPhotos.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActivePhotoModal(item)}
                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-[#eae5dc] hover:border-[#8c7138] shrink-0 group transition-all cursor-pointer shadow-xs"
              >
                <img
                  src={item.imageUrl}
                  alt={`Customer unboxing ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    {item.review.rating}★
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Filter Chips Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-3 border-b border-[#eae5dc]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#747878] flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>

          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-[#141414] text-white shadow-xs'
                : 'bg-[#faf8f5] text-[#141414] hover:bg-[#eae5dc]'
            }`}
          >
            All Reviews ({productReviews.length})
          </button>

          {allCustomerPhotos.length > 0 && (
            <button
              type="button"
              onClick={() => setSelectedFilter('with-photos')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedFilter === 'with-photos'
                  ? 'bg-[#141414] text-white shadow-xs'
                  : 'bg-[#faf8f5] text-[#141414] hover:bg-[#eae5dc]'
              }`}
            >
              <Camera className="w-3 h-3 text-[#fed488]" />
              <span>With Photos ({productReviews.filter((r) => r.images && r.images.length > 0).length})</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setSelectedFilter('5-star')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedFilter === '5-star'
                ? 'bg-[#141414] text-white shadow-xs'
                : 'bg-[#faf8f5] text-[#141414] hover:bg-[#eae5dc]'
            }`}
          >
            5 Stars
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('4-star')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedFilter === '4-star'
                ? 'bg-[#141414] text-white shadow-xs'
                : 'bg-[#faf8f5] text-[#141414] hover:bg-[#eae5dc]'
            }`}
          >
            4 Stars
          </button>
        </div>

        <span className="text-xs text-[#747878] font-medium">
          Showing {Math.min(filteredReviews.length, displayCount)} of {filteredReviews.length} reviews
        </span>
      </div>

      {/* 4. Review Cards List (Flipkart Grade) */}
      {filteredReviews.length === 0 ? (
        <div className="text-center py-12 bg-[#faf8f5] rounded-3xl border border-[#eae5dc] space-y-2">
          <p className="text-sm font-bold text-[#141414]">No reviews match this filter</p>
          <p className="text-xs text-[#747878]">Be the first to share your thoughts on this design!</p>
          <button
            type="button"
            onClick={() => setIsWriteModalOpen(true)}
            className="mt-2 px-5 py-2 rounded-full bg-[#141414] text-[#fed488] text-xs font-bold uppercase tracking-wider hover:bg-[#8c7138] hover:text-white transition-all cursor-pointer"
          >
            Write First Review
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.slice(0, displayCount).map((rev) => {
            const currentHelpful = helpfulMap[rev.id] ?? rev.helpfulCount ?? 0;
            const hasVoted = votedMap[rev.id];

            return (
              <div
                key={rev.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-[#eae5dc] shadow-2xs hover:border-[#8c7138]/40 transition-all space-y-3"
              >
                {/* Top Row: Rating Badge + Headline */}
                <div className="flex items-center gap-2.5">
                  <span
                    className={`inline-flex items-center gap-1 text-white text-xs font-black px-2.5 py-0.5 rounded-md shadow-xs ${
                      rev.rating >= 4 ? 'bg-emerald-600' : rev.rating === 3 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                  >
                    <span>{rev.rating}</span>
                    <Star className="w-3 h-3 fill-current" />
                  </span>

                  <h5 className="font-bold text-sm text-[#141414] leading-tight">
                    {rev.title || rev.quote || 'Verified Customer Review'}
                  </h5>
                </div>

                {/* Review Comment Body */}
                <p className="text-xs sm:text-[13px] text-[#333] leading-relaxed">
                  {rev.comment || rev.quote}
                </p>

                {/* Uploaded Photos Thumbnails */}
                {rev.images && rev.images.length > 0 && (
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    {rev.images.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActivePhotoModal({ imageUrl: img, review: rev })}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-[#eae5dc] hover:border-[#8c7138] transition-all cursor-pointer group shadow-2xs"
                      >
                        <img
                          src={img}
                          alt={`Review photo ${i + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Footer Row: Reviewer Meta + Certified Buyer Badge + Helpful Button */}
                <div className="pt-2 border-t border-[#f4efea] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-2 text-[#747878]">
                    <span className="font-bold text-[#141414]">{rev.author}</span>
                    {rev.location && <span>• {rev.location}</span>}
                    {rev.date && <span>• {rev.date}</span>}
                    {rev.isVerifiedBuyer !== false && (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80 text-[10px]">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Certified Buyer</span>
                      </span>
                    )}
                  </div>

                  {/* Helpful Button */}
                  <button
                    type="button"
                    disabled={hasVoted}
                    onClick={() => handleHelpfulClick(rev.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      hasVoted
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-[#faf8f5] text-[#747878] hover:text-[#141414] hover:bg-[#eae5dc]'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Helpful ({currentHelpful})</span>
                  </button>
                </div>
              </div>
            );
          })}

          {/* Load More Button */}
          {filteredReviews.length > displayCount && (
            <div className="text-center pt-3">
              <button
                type="button"
                onClick={() => setDisplayCount((prev) => prev + 5)}
                className="px-6 py-2.5 rounded-full border border-[#eae5dc] hover:border-[#8c7138] bg-white text-xs font-bold text-[#141414] hover:text-[#8c7138] transition-all cursor-pointer shadow-xs"
              >
                View More Reviews ({filteredReviews.length - displayCount} remaining)
              </button>
            </div>
          )}
        </div>
      )}
        </>
      )}

      {/* Write Review Modal */}
      <WriteReviewModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        product={product || { id: effectiveId, name: effectiveName }}
        defaultAuthor={currentUser?.name || userProfile?.name}
        defaultLocation={currentUser?.address || userProfile?.address}
        onReviewSubmitted={async (newRev) => {
          if (onReviewSubmitted) onReviewSubmitted(newRev);
          if (onAddReview) await onAddReview(newRev);
        }}
      />

      {/* Customer High-Res Photo Lightbox Modal */}
      {activePhotoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-fadeIn"
          onClick={() => setActivePhotoModal(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActivePhotoModal(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/70 hover:bg-black text-white transition-colors cursor-pointer z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={activePhotoModal.imageUrl}
                alt="Customer uploaded jewellery"
                className="w-full h-full object-contain max-h-[70vh]"
              />
            </div>

            <div className="p-5 bg-white space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-600 text-white text-xs font-black px-2 py-0.5 rounded">
                  {activePhotoModal.review.rating}★
                </span>
                <h5 className="font-bold text-sm text-[#141414]">
                  {activePhotoModal.review.title || activePhotoModal.review.quote}
                </h5>
              </div>
              <p className="text-xs text-[#555] leading-relaxed">
                {activePhotoModal.review.comment || activePhotoModal.review.quote}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-[#747878] pt-2 border-t border-[#eae5dc]">
                <span className="font-bold text-[#141414]">{activePhotoModal.review.author}</span>
                {activePhotoModal.review.location && <span>• {activePhotoModal.review.location}</span>}
                <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3" /> Certified Buyer
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
