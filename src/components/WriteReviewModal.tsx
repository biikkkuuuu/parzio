import React, { useState, useRef } from 'react';
import { X, Star, Upload, Trash2, Camera, ShieldCheck, CheckCircle2 } from 'lucide-react';
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
          const canvas = document.createElement('canvas');
          const maxDim = 1200;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            const compressed = canvas.toDataURL('image/jpeg', 0.82);
            newImages.push(compressed);
          } else {
            newImages.push(event.target?.result as string);
          }
          processed++;
          if (processed === fileList.length) {
            setImages((prev) => [...prev, ...newImages]);
            setIsUploadingPhoto(false);
          }
        };
        img.onerror = () => {
          processed++;
          if (processed === fileList.length) {
            setImages((prev) => [...prev, ...newImages]);
            setIsUploadingPhoto(false);
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please write a few words about your experience.');
      return;
    }
    if (!author.trim()) {
      setError('Please provide your name.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#eae5dc] overflow-hidden my-6 animate-fadeIn">
        {/* Header */}
        <div className="bg-[#141414] text-white px-5 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#fed488]/20 border border-[#fed488]/50 flex items-center justify-center text-[#fed488]">
              <Star className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">Rate &amp; Review Product</h3>
              <p className="text-[11px] text-[#fed488] font-mono">Flipkart-Grade Certified Review</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product mini header card */}
        {product && (
          <div className="p-4 bg-[#faf8f5] border-b border-[#eae5dc] flex items-center gap-3">
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-12 h-12 rounded-xl object-cover bg-white border border-[#eae5dc] shrink-0"
              />
            )}
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-xs sm:text-sm text-[#141414] truncate">{product.name}</h4>
              <p className="text-[10px] sm:text-[11px] text-[#747878] flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="text-emerald-700 font-semibold">Verified Purchase • 100% Anti-Tarnish</span>
              </p>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* 1. Star Rating Selector */}
          <div className="text-center py-2 bg-[#faf8f5] rounded-2xl border border-[#eae5dc] space-y-1.5">
            <span className="text-[11px] font-bold text-[#747878] uppercase tracking-wider block">
              Overall Rating *
            </span>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-115 active:scale-95 cursor-pointer"
                >
                  <Star
                    className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                      star <= activeStar
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-neutral-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs font-bold text-[#8c7138] min-h-[18px]">
              {RATING_LABELS[activeStar] || 'Select stars'}
            </p>
          </div>

          {/* 2. Review Title */}
          <div>
            <label className="block font-bold text-[#141414] mb-1">
              Review Headline / Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Gorgeous 18K shine, perfect weight & packaging!"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae5dc] text-xs text-[#141414] focus:outline-none focus:border-[#8c7138] focus:ring-1 focus:ring-[#8c7138] bg-white"
            />
          </div>

          {/* 3. Detailed Review Text */}
          <div>
            <label className="block font-bold text-[#141414] mb-1">
              Detailed Experience *
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How is the piece holding up? Did you wear it in water/shower? Describe the clasp, polish, packaging and comfort..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae5dc] text-xs text-[#141414] focus:outline-none focus:border-[#8c7138] focus:ring-1 focus:ring-[#8c7138] bg-white resize-none leading-relaxed"
            />
          </div>

          {/* 4. Customer Real Photos Upload */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-[#141414] flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-[#8c7138]" />
                <span>Upload Photos (Real Unboxing / Wearing)</span>
              </label>
              <span className="text-[10px] text-[#747878] font-medium">{images.length}/5 photos</span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoSelect}
              className="hidden"
            />

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Add Photo Button */}
              {images.length < 5 && (
                <button
                  type="button"
                  disabled={isUploadingPhoto}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 rounded-xl border-2 border-dashed border-[#8c7138]/50 hover:border-[#8c7138] bg-[#faf8f5] hover:bg-[#faf6ee] text-[#8c7138] flex flex-col items-center justify-center gap-1 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  <Upload className="w-5 h-5" />
                  <span className="text-[10px] font-bold">Add Photo</span>
                </button>
              )}

              {/* Uploaded Photos Thumbnails */}
              {images.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#eae5dc] group"
                >
                  <img
                    src={imgUrl}
                    alt={`Review photo ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-rose-600 transition-colors cursor-pointer"
                    title="Remove Photo"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-[#747878] mt-1.5">
              Real buyer photos help other shoppers see the authentic finish, shine, and fit.
            </p>
          </div>

          {/* 5. Reviewer Name & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block font-bold text-[#141414] mb-1">Your Name *</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Pooja Sharma"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae5dc] text-xs text-[#141414] focus:outline-none focus:border-[#8c7138] bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-[#141414] mb-1">City / Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Ranchi, Jharkhand"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae5dc] text-xs text-[#141414] focus:outline-none focus:border-[#8c7138] bg-white"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-[#eae5dc]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-full border border-[#eae5dc] hover:bg-[#faf8f5] text-xs font-semibold text-[#747878] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-full bg-[#141414] hover:bg-[#8c7138] text-[#fed488] hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting Review...' : 'Submit Verified Review'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
