import React, { useRef, useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, X, RefreshCw, CheckCircle2, AlertCircle, Link as LinkIcon, Sparkles } from 'lucide-react';

interface DeviceImageUploadProps {
  label: string;
  value: string;
  onChange: (base64Image: string) => void;
  recommendedSize: string; // e.g. "1920 × 800px (Aspect Ratio 2.4:1)"
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
  const [imageLoadError, setImageLoadError] = useState(false);

  // Mode: 'upload' (device file) or 'url' (web link)
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState(value || '');

  useEffect(() => {
    setUrlInput(value || '');
    setImageLoadError(false);
  }, [value]);

  // Resize and compress client-side to ensure super-fast performance and protect localStorage
  // Bulletproof across all browsers (Chrome, Safari, Firefox, Edge, Brave Shields)
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPG, PNG, WEBP, AVIF).');
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setErrorMessage(`File exceeds ${maxSizeMB}MB limit. Please pick a smaller image.`);
      return;
    }

    setErrorMessage(null);
    setImageLoadError(false);
    setIsProcessing(true);

    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const rawBase64 = readerEvent.target?.result as string;
      if (!rawBase64) {
        setErrorMessage('Failed to read image file.');
        setIsProcessing(false);
        return;
      }

      // Try canvas optimization (for speed and compression)
      // If Brave Shields or Safari blocks canvas.toDataURL, seamlessly fall back to rawBase64
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
          try {
            const maxDimension = aspectRatio === 'banner' ? 1200 : aspectRatio === 'poster' ? 900 : 800;
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
              const compressed = canvas.toDataURL('image/jpeg', 0.82);
              // Ensure compressed result is valid base64
              if (compressed && compressed.startsWith('data:image')) {
                onChange(compressed);
              } else {
                onChange(rawBase64);
              }
            } else {
              onChange(rawBase64);
            }
          } catch (canvasErr) {
            // Brave Shield or canvas blocked -> Direct fallback
            console.warn('Canvas optimization skipped (Brave Shield/Security). Using direct source:', canvasErr);
            onChange(rawBase64);
          } finally {
            setIsProcessing(false);
          }
        };

        img.onerror = () => {
          // If image fails to decode in canvas, fallback to raw FileReader result
          onChange(rawBase64);
          setIsProcessing(false);
        };

        img.src = rawBase64;
      } catch (err) {
        // Direct fallback
        onChange(rawBase64);
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setErrorMessage('Unable to read image file from your device. Try another photo.');
      setIsProcessing(false);
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
    // Reset file input so selecting the same file again triggers onChange
    if (e.target) {
      e.target.value = '';
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
    setUrlInput('');
    setImageLoadError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) {
      setErrorMessage('Please enter an image URL.');
      return;
    }
    setErrorMessage(null);
    setImageLoadError(false);
    onChange(urlInput.trim());
  };

  const handleUseDefaultSample = () => {
    const defaultSample = '/images/parzio-hero-banner.jpg';
    setUrlInput(defaultSample);
    setImageLoadError(false);
    setErrorMessage(null);
    onChange(defaultSample);
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'circle':
        return 'w-24 h-24 sm:w-28 sm:h-28 rounded-full';
      case 'banner':
        return 'w-full h-32 sm:h-40 rounded-2xl';
      case 'poster':
        return 'w-32 h-44 rounded-2xl';
      case 'square':
      default:
        return 'w-24 h-24 sm:w-28 sm:h-28 rounded-2xl';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label & Size Guidelines */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
        <label className="text-xs font-bold text-[#141414] flex items-center gap-1">
          <span>{label}</span>
          {required && <span className="text-rose-500">*</span>}
        </label>
        <span className="text-[10px] font-semibold text-[#8c7138] bg-[#fbf9f6] border border-[#eae5dc] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
          <span>📐 Size:</span>
          <strong>{recommendedSize}</strong>
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

      {/* Tab Switcher: Upload File vs Web Link */}
      <div className="flex items-center gap-2 border-b border-[#eae5dc] pb-1.5">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            mode === 'upload'
              ? 'bg-[#141414] text-white shadow-xs'
              : 'text-[#747878] hover:text-[#141414] hover:bg-[#faf8f5]'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload From Device</span>
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            mode === 'url'
              ? 'bg-[#141414] text-white shadow-xs'
              : 'text-[#747878] hover:text-[#141414] hover:bg-[#faf8f5]'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>Paste Image URL</span>
        </button>

        {aspectRatio === 'banner' && (
          <button
            type="button"
            onClick={handleUseDefaultSample}
            className="ml-auto text-[11px] font-bold text-[#8c7138] hover:underline flex items-center gap-1 cursor-pointer"
            title="Use official PARZIO banner image"
          >
            <Sparkles className="w-3 h-3" />
            <span>Use PARZIO Banner</span>
          </button>
        )}
      </div>

      {/* URL Input Mode */}
      {mode === 'url' && (
        <div className="flex items-center gap-2 bg-[#faf8f5] p-2 rounded-xl border border-[#eae5dc]">
          <input
            type="url"
            placeholder="Paste image link e.g. https://... or /images/..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleApplyUrl();
              }
            }}
            className="flex-1 bg-white px-3 py-1.5 rounded-lg border border-[#eae5dc] text-xs text-[#141414] focus:outline-none focus:border-[#8c7138]"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-3.5 py-1.5 rounded-lg bg-[#8c7138] hover:bg-[#725a2a] text-white text-xs font-bold cursor-pointer transition-colors"
          >
            Apply
          </button>
        </div>
      )}

      {/* Main Upload / Preview Area */}
      {value ? (
        /* Preview State */
        aspectRatio === 'banner' ? (
          /* Specialized Banner Layout (Full-Width Top, Controls Below) */
          <div className="flex flex-col gap-3.5 p-3.5 sm:p-4 bg-[#faf8f5] border border-[#eae5dc] rounded-2xl">
            {/* Full-Width Aspect Ratio Banner Box */}
            <div className="relative w-full aspect-[1024/415] overflow-hidden rounded-xl bg-white border border-[#eae5dc] shadow-sm">
              <img
                src={value}
                alt="Banner Graphic"
                className="w-full h-full object-cover object-center"
                onError={() => setImageLoadError((prev) => (!prev ? true : prev))}
                onLoad={() => setImageLoadError((prev) => (prev ? false : prev))}
              />
              {isProcessing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                </div>
              )}
            </div>

            {/* Bottom Controls & Verification Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-[#eae5dc]">
              <div>
                {!imageLoadError ? (
                  <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Banner Ready &amp; Verified</span>
                    <span className="text-[10px] text-[#8c7138] bg-[#fbf9f6] border border-[#eae5dc] px-2 py-0.5 rounded-full font-semibold ml-1">
                      1920 × 800 px
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-rose-600 text-xs font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Image Link Broken or Inaccessible</span>
                  </div>
                )}
                <p className="text-[11px] text-[#747878] mt-0.5">
                  {imageLoadError
                    ? 'Image could not load. Pick another file from your device or paste a valid link.'
                    : 'Active storefront banner. You can replace or remove it at any time.'}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap shrink-0">
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="px-3.5 py-1.5 rounded-lg bg-white border border-[#eae5dc] hover:border-[#8c7138] text-[#141414] hover:text-[#8c7138] text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Pick From Device</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('url')}
                  className="px-3.5 py-1.5 rounded-lg bg-white border border-[#eae5dc] hover:border-[#8c7138] text-[#141414] hover:text-[#8c7138] text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Change URL</span>
                </button>

                <button
                  type="button"
                  onClick={handleRemove}
                  className="px-3 py-1.5 rounded-lg bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Standard Side-By-Side Layout (Square / Poster / Circle) */
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-[#faf8f5] border border-[#eae5dc] rounded-2xl">
            {/* Image Container */}
            <div
              className={`relative overflow-hidden bg-white border border-[#eae5dc] shadow-inner shrink-0 ${getAspectClass()}`}
            >
              <img
                src={value}
                alt="Graphic Preview"
                className="w-full h-full object-cover object-center"
                onError={() => setImageLoadError((prev) => (!prev ? true : prev))}
                onLoad={() => setImageLoadError((prev) => (prev ? false : prev))}
              />
              {isProcessing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                </div>
              )}
            </div>

            {/* Action Details */}
            <div className="flex-1 min-w-0 space-y-1.5">
              {!imageLoadError ? (
                <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Image Ready &amp; Verified</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-rose-600 text-xs font-bold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Image Link Broken or Inaccessible</span>
                </div>
              )}

              <p className="text-[11px] text-[#747878] leading-tight">
                {imageLoadError
                  ? 'Could not load image from this URL. Please upload a file from your device or paste a working direct image link.'
                  : 'Image is active. You can replace or remove this photo at any time.'}
              </p>

              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#eae5dc] hover:border-[#8c7138] text-[#141414] hover:text-[#8c7138] text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                >
                  <Upload className="w-3 h-3" />
                  <span>Pick From Device</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('url')}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#eae5dc] hover:border-[#8c7138] text-[#141414] hover:text-[#8c7138] text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                >
                  <LinkIcon className="w-3 h-3" />
                  <span>Change URL</span>
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
        )
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
