import React, { useEffect } from 'react';
import { X, Play, Film, CheckCircle, Sparkles } from 'lucide-react';

import SmartVideoPlayer from './SmartVideoPlayer';

export default function VideoModal({ video, onClose }) {
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

  if (!video) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="glass-card w-full max-w-4xl rounded-3xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900/95 overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-violet-500" />
            <span className="text-sm font-bold text-slate-900 dark:text-white truncate">{video.title}</span>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-violet-700 dark:text-violet-300 border border-slate-300 dark:border-white/5">
              {video.duration}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors"
            aria-label="Close video player"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Universal Smart Video Player */}
        <div className="relative aspect-video w-full bg-black">
          <SmartVideoPlayer
            src={video.previewVideo}
            poster={video.thumbnail}
            autoPlay={true}
            controls={true}
            title={video.title}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Info & Details */}
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-mono text-violet-600 dark:text-violet-400 uppercase tracking-wider block">
                {video.category}
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                {video.title}
              </h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {video.software.map((tool) => (
                <span
                  key={tool}
                  className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono border border-slate-200 dark:border-white/5"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            {video.description}
          </p>

          <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>Highlight: {video.highlight}</span>
            <span className="text-violet-600 dark:text-violet-400 font-semibold">Edited by Renelle Robie D. Lopez</span>
          </div>
        </div>
      </div>
    </div>
  );
}
