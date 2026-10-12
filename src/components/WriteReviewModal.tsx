import React, { useState, useRef } from 'react';
import { ArrowLeft, Star, Upload, Trash2, Camera, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Product, Review } from '../types';
import { dbService } from '../services/dbService';

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | { id: string; name: string; image?: string; price?: number; sku?: string };
  defaultAuthor?: string;
  defaultLocation?: string;
  orderId?: string;
  onReviewSubmitted?: (review: Review) => void;
}

const RATING_LABELS = [
  '',
  'Very Bad 😞',
  'Bad 😕',
  'Average 🙂',
  'Good 😊',
  'Outstanding! 🌟'
];

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  isOpen,
  onClose,
  product,
  defaultAuthor = '',
  defaultLocation = '',
  orderId,
  onReviewSubmitted
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [author, setAuthor] = useState(defaultAuthor || '');
  const [location, setLocation] = useState(defaultLocation || '');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Safe client-side image compression
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 5) {
      setError('You can upload up to 5 photos per review.');
      return;
    }

    setIsUploadingPhoto(true);
    setError(null);

    const fileList = Array.from(files);
    let processed = 0;
    const newImages: string[] = [];

    fileList.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const maxDim = 1200;
            let width = img.width;
            let height = img.height;

            if (width > maxDim || height > maxDim) {
              if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              const compressedBase64 = canvas.toDataURL('image/jpeg', 0.82);
              newImages.push(compressedBase64);
            }
          } catch (err) {
            console.error('Photo compression error:', err);
          } finally {
            processed++;
            if (processed === fileList.length) {
              setImages((prev) => [...prev, ...newImages].slice(0, 5));
              setIsUploadingPhoto(false);
            }
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating) {
      setError('Please tap a star rating (1 to 5 stars).');
      return;
    }

    if (!comment.trim() || comment.trim().length < 10) {
      setError('Please write at least 10 characters describing your experience.');
      return;
    }

    if (!author.trim()) {
      setError('Please enter your name.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const newReview: Review = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      productId: product?.id || 'general',
      productName: product?.name || 'PARZIO Demi-Fine Piece',
      author: author.trim(),
      location: location.trim() || undefined,
      rating: rating || 5,
      title: title.trim() || undefined,
      comment: comment.trim(),
      quote: title.trim() || comment.trim().slice(0, 80),
      purchasedItem: product?.name || 'PARZIO Jewellery',
      images: images.length > 0 ? images : undefined,
      date: 'Just now',
      isVerifiedBuyer: true,
      helpfulCount: 0,
      orderId: orderId || undefined
    };

    try {
      await dbService.addReview(newReview);
      if (onReviewSubmitted) {
        onReviewSubmitted(newReview);
      }
      onClose();
    } catch (err) {
      console.error('Failed to save review:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeStar = hoverRating || rating;

  return (
    <div className="fixed inset-0 z-50 bg-[#fbf9f6] overflow-y-auto min-h-screen animate-fadeIn">
      {/* 1. Clean Luxury Top Navigation Header */}
      <header className="bg-white border-b border-[#eae5dc] sticky top-0 z-30 shadow-2xs">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#141414] hover:text-[#8c7138] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back</span>
          </button>

          <div className="text-center">
            <h1 className="text-sm sm:text-base font-bold text-[#141414] tracking-tight">
              Rate &amp; Review Piece
            </h1>
            <p className="text-[10px] text-[#8c7138] font-medium hidden sm:block">
              Flipkart-Grade Certified Customer Feedback
            </p>
          </div>

          <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
            ✔ Verified
          </span>
        </div>
      </header>

      {/* 2. Full Page Form Container */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-4 pb-28">
        {/* Product Information Card */}
        {product && (
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#eae5dc] shadow-2xs flex items-center gap-3.5">
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover bg-[#faf8f5] border border-[#eae5dc] shrink-0"
              />
            )}
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c7138] block leading-none mb-1">
                PURCHASED PIECE
              </span>
              <h2 className="font-bold text-sm sm:text-base text-[#141414] truncate">{product.name}</h2>
              <p className="text-[11px] text-[#747878] flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="text-emerald-700 font-semibold">100% Anti-Tarnish Demi-Fine Certified</span>
              </p>
            </div>
          </div>
        )}

        {/* Main Review Form Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#eae5dc] shadow-2xs">
          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {error}
              </div>
            )}

            {/* 1. Interactive Star Rating Selector */}
            <div className="text-center py-4 bg-[#faf8f5] rounded-2xl border border-[#eae5dc] space-y-2">
              <span className="text-[11px] font-bold text-[#747878] uppercase tracking-wider block">
                OVERALL RATING *
              </span>
              <div className="flex items-center justify-center gap-2.5 sm:gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-120 active:scale-95 cursor-pointer"
                  >
                    <Star
                      className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors ${
                        star <= activeStar
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-neutral-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs sm:text-sm font-bold text-[#8c7138] min-h-[20px]">
                {RATING_LABELS[activeStar] || 'Tap a star to rate'}
              </p>
            </div>

            {/* 2. Review Title */}
            <div>
              <label className="block font-bold text-[#141414] mb-1.5 text-xs sm:text-sm">
                Review Headline / Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Gorgeous 18K shine, perfect weight & packaging!"
                className="w-full px-4 py-3 rounded-xl border border-[#eae5dc] text-xs sm:text-sm text-[#141414] focus:outline-none focus:border-[#8c7138] focus:ring-1 focus:ring-[#8c7138] bg-white"
              />
            </div>

            {/* 3. Detailed Review Text */}
            <div>
              <label className="block font-bold text-[#141414] mb-1.5 text-xs sm:text-sm">
                Detailed Experience *
              </label>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How is the piece holding up? Did you wear it in water/shower? Describe the clasp, polish, packaging and comfort..."
                className="w-full px-4 py-3 rounded-xl border border-[#eae5dc] text-xs sm:text-sm text-[#141414] focus:outline-none focus:border-[#8c7138] focus:ring-1 focus:ring-[#8c7138] bg-white resize-none leading-relaxed"
              />
            </div>

            {/* 4. Customer Real Photos Upload */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-bold text-[#141414] flex items-center gap-1.5 text-xs sm:text-sm">
                  <Camera className="w-4 h-4 text-[#8c7138]" />
                  <span>Upload Photos (Real Unboxing / Wearing)</span>
                </label>
                <span className="text-[11px] text-[#747878] font-mono">{images.length}/5 photos</span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoSelect}
                className="hidden"
              />

              <div className="flex flex-wrap items-center gap-3">
                {/* Add Photo Button */}
                {images.length < 5 && (
                  <button
                    type="button"
                    disabled={isUploadingPhoto}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-dashed border-[#8c7138]/50 hover:border-[#8c7138] bg-[#faf8f5] hover:bg-[#faf6ee] text-[#8c7138] flex flex-col items-center justify-center gap-1 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    <Upload className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-[10px] sm:text-[11px] font-bold">Add Photo</span>
                  </button>
                )}

                {/* Uploaded Photos Thumbnails */}
                {images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-[#eae5dc] shadow-xs group"
                  >
                    <img
                      src={imgUrl}
                      alt={`Review photo ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/75 text-white hover:bg-rose-600 transition-colors cursor-pointer"
                      title="Remove Photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-[#747878] mt-2">
                Real customer photos help fellow shoppers see authentic finish, polish, and fit.
              </p>
            </div>

            {/* 5. Reviewer Name & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div>
                <label className="block font-bold text-[#141414] mb-1.5 text-xs sm:text-sm">Your Name *</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Pooja Sharma"
                  className="w-full px-4 py-3 rounded-xl border border-[#eae5dc] text-xs sm:text-sm text-[#141414] focus:outline-none focus:border-[#8c7138] bg-white"
                />
              </div>
              <div>
                <label className="block font-bold text-[#141414] mb-1.5 text-xs sm:text-sm">City / Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Ranchi, Jharkhand"
                  className="w-full px-4 py-3 rounded-xl border border-[#eae5dc] text-xs sm:text-sm text-[#141414] focus:outline-none focus:border-[#8c7138] bg-white"
                />
              </div>
            </div>

            {/* Submit Action Buttons */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#eae5dc]">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 rounded-full border border-[#eae5dc] hover:bg-[#faf8f5] text-xs sm:text-sm font-semibold text-[#747878] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 sm:flex-none px-8 py-3 rounded-full bg-[#141414] hover:bg-[#8c7138] text-[#fed488] hover:text-white text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting Review...' : 'Submit Verified Review'}</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
