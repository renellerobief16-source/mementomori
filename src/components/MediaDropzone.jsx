import React, { useState, useRef } from 'react';
import {
  Upload,
  Video,
  Image as ImageIcon,
  Link as LinkIcon,
  X,
  RefreshCw,
  Loader2,
  CheckCircle2,
  FileCheck,
  Film,
  Sparkles,
} from 'lucide-react';
import SmartVideoPlayer from './SmartVideoPlayer';

/**
 * MediaDropzone - Modern interactive drag-and-drop zone with live preview
 * Supports both Video files (IndexedDB + MP4/WebM) and Image files (Base64 + Web URLs).
 */
export default function MediaDropzone({
  type = 'image', // 'image' | 'video'
  value = '', // current URL or indexeddb://... or base64
  poster = '', // video thumbnail poster if type === 'video'
  onChange, // (newUrlString) => void
  onFileUpload, // async (file: File) => void
  loading = false,
  loadingText = 'Processing file...',
  label = '',
  hint = '',
  aspectRatio = '16/9', // '16/9' | '3/4' | '4/3' | 'auto'
  allowUrlInput = true,
  placeholderUrl = '',
  badge = '',
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showUrlField, setShowUrlField] = useState(false);
  const fileInputRef = useRef(null);

  const isVideo = type === 'video';
  const hasValue = Boolean(value && value.trim());

  // Determine accepted MIME types
  const acceptTypes = isVideo
    ? 'video/mp4,video/webm,video/quicktime,video/ogg'
    : 'image/png,image/jpeg,image/webp,image/gif,image/svg+xml';

  // Handle Drag Events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only toggle off if leaving the container itself
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];

      // Validate file type
      if (isVideo && !file.type.startsWith('video/')) {
        alert('Please drop a valid video file (MP4, WebM, MOV).');
        return;
      }
      if (!isVideo && !file.type.startsWith('image/')) {
        alert('Please drop a valid image file (PNG, JPG, WebP, SVG).');
        return;
      }

      if (onFileUpload) {
        await onFileUpload(file);
      }
    }
  };

  const handleFileInputChange = async (e) => {
    const file = e.target.files?.[0];
    if (file && onFileUpload) {
      await onFileUpload(file);
    }
    // reset input so the same file can be re-selected if needed
    e.target.value = '';
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (onChange) onChange('');
  };

  // Compute aspect ratio CSS class
  const getAspectClass = () => {
    switch (aspectRatio) {
      case '3/4':
        return 'aspect-[3/4] max-w-[280px] mx-auto';
      case '4/3':
        return 'aspect-[4/3]';
      case '16/9':
      default:
        return 'aspect-video';
    }
  };

  return (
    <div className="space-y-2">
      {/* Header Label Row */}
      {(label || hint) && (
        <div className="flex items-center justify-between gap-2">
          {label && (
            <label className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              {isVideo ? (
                <Film className="w-3.5 h-3.5 text-violet-500" />
              ) : (
                <ImageIcon className="w-3.5 h-3.5 text-cyan-500" />
              )}
              <span>{label}</span>
              {badge && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-violet-500/10 text-violet-500 border border-violet-500/20">
                  {badge}
                </span>
              )}
            </label>
          )}
          {hint && (
            <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
              {hint}
            </span>
          )}
        </div>
      )}

      {/* Main Drag-and-Drop Container */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative group rounded-2xl border-2 transition-all duration-200 overflow-hidden ${
          isDragOver
            ? isVideo
              ? 'border-violet-500 bg-violet-500/10 dark:bg-violet-950/40 ring-4 ring-violet-500/20 scale-[1.01]'
              : 'border-cyan-500 bg-cyan-500/10 dark:bg-cyan-950/40 ring-4 ring-cyan-500/20 scale-[1.01]'
            : hasValue
            ? 'border-slate-200 dark:border-white/10 bg-slate-900/5 dark:bg-slate-950/50'
            : 'border-dashed border-slate-300 hover:border-slate-400 dark:border-white/15 dark:hover:border-white/25 bg-slate-50/80 hover:bg-slate-100/80 dark:bg-slate-900/40 dark:hover:bg-slate-900/70'
        }`}
      >
        {/* Hidden Native File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptTypes}
          onChange={handleFileInputChange}
          className="hidden"
        />

        {/* LOADING OVERLAY */}
        {loading && (
          <div className="absolute inset-0 z-30 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center gap-3 animate-fadeIn">
            <div className="relative">
              <Loader2 className={`w-10 h-10 animate-spin ${isVideo ? 'text-violet-400' : 'text-cyan-400'}`} />
              <Sparkles className="w-4 h-4 text-amber-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-white font-mono">{loadingText}</p>
              <p className="text-xs text-slate-400 font-mono">Please keep this window open</p>
            </div>
          </div>
        )}

        {/* DRAGGING ACTIVE OVERLAY */}
        {isDragOver && !loading && (
          <div className="absolute inset-0 z-20 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center gap-3 pointer-events-none animate-fadeIn">
            <div className={`p-4 rounded-2xl ${isVideo ? 'bg-violet-500/20 text-violet-400' : 'bg-cyan-500/20 text-cyan-400'} animate-bounce`}>
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <p className="text-base font-bold text-white font-mono">
                Release to upload {isVideo ? 'video' : 'image'}!
              </p>
              <p className="text-xs text-slate-300 font-mono mt-0.5">
                {isVideo ? 'Auto-saves to IndexedDB & generates thumbnail' : 'Converts and embeds instantly'}
              </p>
            </div>
          </div>
        )}

        {/* STATE 1: HAS VALUE -> LIVE PREVIEW */}
        {hasValue ? (
          <div className="p-3 sm:p-4 space-y-3">
            {/* Live Media Player / Image Preview */}
            <div className={`relative rounded-xl overflow-hidden border border-slate-200/80 dark:border-white/10 bg-black ${getAspectClass()} shadow-inner`}>
              {isVideo ? (
                <SmartVideoPlayer
                  src={value}
                  poster={poster}
                  controls={true}
                  autoPlay={false}
                  title="Uploaded Video Preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={value}
                  alt="Media Preview"
                  className="w-full h-full object-contain bg-slate-950"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
              )}

              {/* Status Badge Tag */}
              <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 shadow-md">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  {value.startsWith('indexeddb://')
                    ? 'IndexedDB Local Storage'
                    : value.startsWith('data:')
                    ? 'Embedded File Data'
                    : 'External Web Stream'}
                </span>
              </div>
            </div>

            {/* Quick Action Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/60 dark:border-white/5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-1.5 active:scale-95 ${
                    isVideo
                      ? 'bg-violet-600/10 hover:bg-violet-600/20 text-violet-600 dark:text-violet-400 border border-violet-500/20'
                      : 'bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20'
                  }`}
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Replace {isVideo ? 'Video' : 'Image'}</span>
                </button>

                {allowUrlInput && (
                  <button
                    type="button"
                    onClick={() => setShowUrlField(!showUrlField)}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-mono text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors flex items-center gap-1"
                  >
                    <LinkIcon className="w-3 h-3" />
                    <span>{showUrlField ? 'Hide URL' : 'Edit URL'}</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleClear}
                className="px-2.5 py-1.5 rounded-xl text-xs font-mono text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        ) : (
          /* STATE 2: EMPTY -> INTERACTIVE DROPZONE */
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer select-none space-y-3"
          >
            <div
              className={`p-3.5 sm:p-4 rounded-2xl transition-all shadow-sm ${
                isVideo
                  ? 'bg-violet-500/10 text-violet-600 dark:text-violet-400 group-hover:scale-110 group-hover:bg-violet-500/20'
                  : 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500/20'
              }`}
            >
              {isVideo ? (
                <Video className="w-7 h-7 sm:w-8 sm:h-8" />
              ) : (
                <ImageIcon className="w-7 h-7 sm:w-8 sm:h-8" />
              )}
            </div>

            <div className="space-y-1 max-w-sm">
              <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white font-mono">
                <span className={isVideo ? 'text-violet-500' : 'text-cyan-500'}>
                  Drag & drop your {isVideo ? 'video' : 'image'}
                </span>{' '}
                here, or <span className="underline decoration-dotted underline-offset-4">browse</span>
              </p>
              <p className="text-[11px] font-mono text-slate-400">
                {isVideo
                  ? 'MP4, WebM, MOV • Auto-saved to IndexedDB storage'
                  : 'PNG, JPG, WebP, SVG • Up to 5MB embedded image'}
              </p>
            </div>
          </div>
        )}

        {/* HYBRID URL INPUT BAR */}
        {allowUrlInput && (!hasValue || showUrlField) && (
          <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-200/60 dark:border-white/5 bg-slate-100/50 dark:bg-slate-950/40">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={value || ''}
                  onChange={(e) => onChange && onChange(e.target.value)}
                  placeholder={
                    placeholderUrl ||
                    (isVideo
                      ? 'Or paste YouTube, Vimeo, or direct MP4 URL...'
                      : 'Or paste image URL (https://...)...')
                  }
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 dark:focus:border-violet-500 transition-colors"
                />
              </div>
              {value && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                  title="Clear URL"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
