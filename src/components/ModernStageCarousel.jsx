import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Sparkles, Layers, Eye } from 'lucide-react';
import SpotlightCard from './SpotlightCard';

export default function ModernStageCarousel({
  items = [],
  renderItem,
  onItemClick,
  categoryBadge = "Featured Showcase",
  categoryTitle = "Curated Works",
  categorySubtitle = "Explore high-impact projects engineered for modern web & creative media.",
  accentColor = "cyan", // 'cyan' | 'violet' | 'emerald' | 'amber'
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState('next'); // 'next' | 'prev'
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const thumbnailRefs = useRef([]);

  const total = items.length;

  const goToSlide = (newIndex, customDir = null) => {
    if (newIndex === activeIndex || isAnimating) return;
    const computedDir = customDir || (newIndex > activeIndex ? 'next' : 'prev');
    setDirection(computedDir);
    setIsAnimating(true);
    
    // Smooth transition timing
    setTimeout(() => {
      setActiveIndex(newIndex);
      setTimeout(() => {
        setIsAnimating(false);
      }, 50);
    }, 180);
  };

  const nextSlide = () => {
    const nextIdx = (activeIndex + 1) % total;
    goToSlide(nextIdx, 'next');
  };

  const prevSlide = () => {
    const prevIdx = (activeIndex - 1 + total) % total;
    goToSlide(prevIdx, 'prev');
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [total, activeIndex, isAnimating]);

  // Autoplay
  useEffect(() => {
    if (!isAutoPlaying || total <= 1) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, total, activeIndex]);

  // Touch Swipe for mobile devices
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 45) nextSlide();
    if (diff < -45) prevSlide();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Auto-scroll active thumbnail into view smoothly
  useEffect(() => {
    if (thumbnailRefs.current[activeIndex]) {
      thumbnailRefs.current[activeIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activeIndex]);

  const activeItem = items[activeIndex] || items[0];

  const getAccentStyles = () => {
    switch (accentColor) {
      case 'violet':
        return {
          badge: 'bg-violet-500/10 border-violet-500/20 text-violet-600 dark:text-violet-400',
          glow: 'rgba(139, 92, 246, 0.22)',
          bar: 'from-violet-500 via-indigo-500 to-purple-500',
          ring: 'ring-2 ring-violet-500/80 shadow-lg shadow-violet-500/25',
          topLine: 'via-violet-400 dark:via-violet-400',
          textAccent: 'text-violet-600 dark:text-violet-400',
          activeThumbBg: 'bg-violet-500/5 dark:bg-violet-950/30',
        };
      case 'emerald':
        return {
          badge: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
          glow: 'rgba(16, 185, 129, 0.22)',
          bar: 'from-emerald-500 via-teal-500 to-cyan-500',
          ring: 'ring-2 ring-emerald-500/80 shadow-lg shadow-emerald-500/25',
          topLine: 'via-emerald-400 dark:via-emerald-400',
          textAccent: 'text-emerald-600 dark:text-emerald-400',
          activeThumbBg: 'bg-emerald-500/5 dark:bg-emerald-950/30',
        };
      case 'amber':
        return {
          badge: 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400',
          glow: 'rgba(245, 158, 11, 0.22)',
          bar: 'from-amber-500 via-orange-500 to-yellow-500',
          ring: 'ring-2 ring-amber-500/80 shadow-lg shadow-amber-500/25',
          topLine: 'via-amber-400 dark:via-amber-400',
          textAccent: 'text-amber-600 dark:text-amber-400',
          activeThumbBg: 'bg-amber-500/5 dark:bg-amber-950/30',
        };
      case 'cyan':
      default:
        return {
          badge: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-600 dark:text-cyan-400',
          glow: 'rgba(6, 182, 212, 0.22)',
          bar: 'from-cyan-500 via-blue-500 to-teal-500',
          ring: 'ring-2 ring-cyan-500/80 shadow-lg shadow-cyan-500/25',
          topLine: 'via-cyan-400 dark:via-cyan-400',
          textAccent: 'text-cyan-600 dark:text-cyan-400',
          activeThumbBg: 'bg-cyan-500/5 dark:bg-cyan-950/30',
        };
    }
  };

  const styles = getAccentStyles();
  const progressPercent = ((activeIndex + 1) / total) * 100;

  // Transition classes: Smooth Fade & Soft Slide
  let transitionClasses = "opacity-100 translate-x-0 scale-100";
  if (isAnimating) {
    transitionClasses = direction === 'next'
      ? "opacity-0 translate-x-5 scale-[0.985]"
      : "opacity-0 -translate-x-5 scale-[0.985]";
  }

  return (
    <div
      className="relative w-full max-w-6xl mx-auto py-2 sm:py-4"
      onMouseEnter={() => setIsAutoPlaying(false)}
    >
      {/* Stage Header & Counter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-4 px-1 sm:px-2">
        <div>
          <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-mono mb-2 ${styles.badge} shadow-sm`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>{categoryBadge}</span>
          </div>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {categoryTitle}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
            {categorySubtitle}
          </p>
        </div>

        {/* Counter & Arrow Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pt-1 sm:pt-0">
          {/* Active slide counter with elegant badge */}
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-2 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {String(activeIndex + 1).padStart(2, '0')}
            </span>
            <span className="text-slate-400">/</span>
            <span>{String(total).padStart(2, '0')}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Autoplay Pause/Play button */}
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/20 transition-all flex items-center justify-center active:scale-95 shadow-sm"
              title={isAutoPlaying ? "Pause Auto-Slide" : "Enable Auto-Slide"}
              aria-label="Toggle auto-slide"
            >
              {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            {/* Navigation Arrows with refined hover/active micro-animations */}
            <button
              onClick={prevSlide}
              className="min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/20 hover:scale-105 active:scale-90 transition-all shadow-sm flex items-center justify-center"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/20 hover:scale-105 active:scale-90 transition-all shadow-sm flex items-center justify-center"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Single Showcase Stage (With Smooth Fade & Soft Slide Effect) */}
      <div
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl touch-pan-x"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Subtle Ambient Spotlight behind Active Card */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 rounded-full blur-3xl pointer-events-none -z-10 transition-all duration-700 opacity-60"
          style={{ background: styles.glow }}
        />

        {/* Card Frame with Top Accent Line */}
        <div className="w-full">
          <SpotlightCard
            className="p-3.5 sm:p-7 md:p-9 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-white/15 bg-white/95 dark:bg-[#0d121f]/95 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden"
            spotlightColor={styles.glow}
          >
            {/* Top Radiant Gradient Accent Line */}
            <div
              className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent ${styles.topLine} to-transparent opacity-90`}
            />

            {/* Smooth Fade & Slide Transition Container */}
            <div
              className={`w-full transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) ${transitionClasses}`}
            >
              {renderItem ? (
                renderItem(activeItem, true, {
                  activeIndex,
                  goToSlide,
                  nextSlide,
                  prevSlide,
                })
              ) : (
                <div>Showcase Item</div>
              )}
            </div>
          </SpotlightCard>
        </div>
      </div>

      {/* Interactive Mobile Swipeable Snap Strip & Desktop Grid (Gentle Lift & Glowing Outline) */}
      <div className="mt-5 sm:mt-8 space-y-3 sm:space-y-4 px-1 sm:px-2">
        {/* Animated Progress Bar Track with Radiant Indicator */}
        <div className="w-full h-1.5 rounded-full bg-slate-200/80 dark:bg-slate-800/80 overflow-hidden relative">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${styles.bar} transition-all duration-500 ease-out relative`}
            style={{ width: `${progressPercent}%` }}
          >
            {/* Glowing tip light */}
            <div className="absolute right-0 top-0 bottom-0 w-2.5 bg-white/80 rounded-full blur-[1px]" />
          </div>
        </div>

        {/* Thumbnails with Gentle Lift & Glowing Outline */}
        <div className="flex sm:grid sm:grid-cols-4 gap-2.5 sm:gap-3.5 pt-1 overflow-x-auto touch-pan-x snap-x snap-mandatory scrollbar-none pb-2 -mx-1 px-1 sm:mx-0 sm:px-0">
          {items.map((item, idx) => {
            const isActive = idx === activeIndex;
            const thumbImg = item.image || item.thumbnail;
            return (
              <button
                key={item.id || idx}
                ref={(el) => (thumbnailRefs.current[idx] = el)}
                onClick={() => goToSlide(idx)}
                className={`shrink-0 w-[180px] xs:w-[200px] sm:w-auto snap-start flex items-center gap-2.5 sm:gap-3 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                  isActive
                    ? `bg-white dark:bg-slate-900 border-transparent ${styles.ring} -translate-y-0.5 sm:-translate-y-1 opacity-100 ${styles.activeThumbBg}`
                    : 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/80 dark:border-white/5 opacity-65 hover:opacity-100 hover:border-slate-300 dark:hover:border-white/20'
                }`}
                aria-label={`Switch to ${item.title}`}
              >
                {/* Micro Thumbnail with subtle inner glow */}
                <div className={`w-11 h-9 sm:w-14 sm:h-11 rounded-lg sm:rounded-xl overflow-hidden bg-slate-900 shrink-0 border transition-all ${isActive ? 'border-transparent shadow-sm' : 'border-slate-200 dark:border-white/10'}`}>
                  <img
                    src={thumbImg}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <span className={`text-[10px] font-mono block uppercase truncate font-semibold ${isActive ? styles.textAccent : 'text-slate-500 dark:text-slate-400'}`}>
                    0{idx + 1} • {item.category || item.issuer || 'Showcase'}
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {item.title}
                  </h4>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
