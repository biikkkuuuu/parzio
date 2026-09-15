import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, X, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

interface DeviceImageUploadProps {
  label: string;
  value: string;
  onChange: (base64Image: string) => void;
  recommendedSize: string; // e.g. "1:1 Square (800 × 800px)"
  aspectRatio?: 'square' | 'banner' | 'poster' | 'circle';
  maxSizeMB?: number;
  required?: boolean;
  className?: string;
}

export const DeviceImageUpload: React.FC<DeviceImageUploadProps> = ({
  label,
  value,
  onChange,
  recommendedSize,
  aspectRatio = 'square',
  maxSizeMB = 5,
  required = false,
  className = ''
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Resize and compress client-side to ensure super-fast performance and protect localStorage
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setErrorMessage(`File exceeds ${maxSizeMB}MB limit. Please pick a smaller image.`);
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Calculate bounded dimensions
        const maxDimension = aspectRatio === 'banner' ? 1920 : 1200;
        let { width, height } = img;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          onChange(compressedDataUrl);
        } else {
          // Fallback to original
          onChange(e.target?.result as string);
        }
        setIsProcessing(false);
      };
      img.onerror = () => {
        setErrorMessage('Unable to process image. Try another photo.');
        setIsProcessing(false);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'circle':
        return 'w-24 h-24 sm:w-28 sm:h-28 rounded-full';
      case 'banner':
        return 'w-full h-36 sm:h-44 rounded-2xl';
      case 'poster':
        return 'w-36 h-48 rounded-2xl';
      case 'square':
      default:
        return 'w-28 h-28 sm:w-32 sm:h-32 rounded-2xl';
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Label & Size Guidelines */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
        <label className="text-xs font-bold text-[#141414] flex items-center gap-1">
          <span>{label}</span>
          {required && <span className="text-rose-500">*</span>}
        </label>
        <span className="text-[10px] font-semibold text-[#8c7138] bg-[#fbf9f6] border border-[#eae5dc] px-2 py-0.5 rounded-full inline-block">
          Recommended: {recommendedSize}
        </span>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp, image/jpg, image/avif"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Main Upload / Preview Area */}
      {value ? (
        /* Preview State */
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-[#faf8f5] border border-[#eae5dc] rounded-2xl">
          {/* Image Container */}
          <div
            className={`relative overflow-hidden bg-white border border-[#eae5dc] shadow-inner shrink-0 ${getAspectClass()}`}
          >
            <img
              src={value}
              alt="Selected"
              className="w-full h-full object-cover object-center"
            />
            {isProcessing && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
                <RefreshCw className="w-5 h-5 animate-spin" />
              </div>
            )}
          </div>

          {/* Action Details */}
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Image Loaded Successfully</span>
            </div>

            <p className="text-[11px] text-[#747878]">
              Ready for live storefront display. You can replace or remove this photo at any time.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={triggerFileInput}
                className="px-3 py-1.5 rounded-lg bg-white border border-[#eae5dc] hover:border-[#8c7138] text-[#141414] hover:text-[#8c7138] text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
              >
                <Upload className="w-3 h-3" />
                <span>Change Photo</span>
              </button>

              <button
                type="button"
                onClick={handleRemove}
                className="px-3 py-1.5 rounded-lg bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Upload Dropzone */
        <div
          onClick={triggerFileInput}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
            isDragging
              ? 'border-[#8c7138] bg-[#f2ece1]'
              : 'border-[#dfd7ca] hover:border-[#8c7138] bg-[#faf8f5] hover:bg-white'
          }`}
        >
          <div className="w-11 h-11 rounded-full bg-white border border-[#eae5dc] flex items-center justify-center text-[#8c7138] shadow-2xs">
            {isProcessing ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
          </div>

          <div>
            <p className="text-xs font-bold text-[#141414]">
              <span className="text-[#8c7138] underline decoration-[#8c7138] decoration-1 underline-offset-2">
                Click to choose from device
              </span>{' '}
              or drag &amp; drop
            </p>
            <p className="text-[10px] text-[#747878] mt-0.5">
              Supports JPG, PNG, WEBP • Max {maxSizeMB}MB • Auto-optimized
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-1">
          <AlertCircle className="w-3 h-3" />
          <span>{errorMessage}</span>
        </p>
      )}
    </div>
  );
};
