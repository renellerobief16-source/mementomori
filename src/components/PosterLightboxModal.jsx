import React, { useEffect } from 'react';
import { X, Sparkles, Layers, Palette, Download, ExternalLink } from 'lucide-react';

export default function PosterLightboxModal({ poster, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  if (!poster) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="glass-card w-full max-w-4xl max-h-[92vh] rounded-3xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900/95 overflow-hidden shadow-2xl relative flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-950/80 text-white hover:bg-slate-900 border border-white/20 transition-colors"
          aria-label="Close Poster Lightbox"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Poster Image View */}
        <div className="md:w-1/2 bg-slate-950 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <img
            src={poster.image}
            alt={poster.title}
            className="max-h-[70vh] w-auto object-contain rounded-xl shadow-2xl border border-white/10"
          />
        </div>

        {/* Poster Metadata & Artwork Details */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-600 dark:text-emerald-400 mb-3">
              <Palette className="w-3.5 h-3.5" />
              <span>{poster.category}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
              {poster.title}
            </h2>

            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
              {poster.description}
            </p>

            {/* Specifications */}
            <div className="space-y-3 mb-6">
              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500 dark:text-slate-400">Print Dimensions:</span>
                <span className="text-slate-900 dark:text-white font-medium">{poster.dimensions}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500 dark:text-slate-400">Design Software:</span>
                <span className="text-emerald-600 dark:text-cyan-400 font-medium">{poster.software.join(' • ')}</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
            <span>Graphic Designer: Renelle Robie D. Lopez</span>
            <span className="text-emerald-600 dark:text-cyan-400 font-semibold">Original Artwork</span>
          </div>
        </div>
      </div>
    </div>
  );
}
