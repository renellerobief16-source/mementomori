import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Palette, Eye, Sparkles } from 'lucide-react';
import { creativePortfolioData } from '../data/creativePortfolioData';
import SpotlightCard from './SpotlightCard';
import PosterLightboxModal from './PosterLightboxModal';

export default function GraphicDesignCarousel() {
  const scrollRef = useRef(null);
  const [selectedPoster, setSelectedPoster] = useState(null);
  const { posters } = creativePortfolioData;

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.85;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="graphic-design-row" className="py-20 border-t border-white/5 bg-[#090d16]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Row Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 mb-2">
              <Palette className="w-3.5 h-3.5" />
              <span>Row 3 • Graphic Design & Posters</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Posters & Visual Artwork
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
              Original event posters, brand identities, and social advertising media crafted with Adobe Photoshop and Illustrator.
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:border-emerald-500/40 transition-colors"
              aria-label="Previous Posters"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:border-emerald-500/40 transition-colors"
              aria-label="Next Posters"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Scroll Track */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {posters.map((poster) => (
            <div
              key={poster.id}
              className="w-[260px] sm:w-[320px] lg:w-[350px] shrink-0 snap-start"
            >
              <SpotlightCard
                className="h-full p-4 sm:p-5 flex flex-col justify-between cursor-pointer group"
                spotlightColor="rgba(16, 185, 129, 0.2)"
                onClick={() => setSelectedPoster(poster)}
              >
                <div>
                  {/* Poster Thumbnail */}
                  <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-slate-950 mb-4 border border-white/10">
                    <img
                      src={poster.image}
                      alt={poster.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="px-4 py-2 rounded-xl bg-slate-900/90 text-white font-mono text-xs flex items-center gap-2 border border-white/20 shadow-xl">
                        <Eye className="w-4 h-4 text-emerald-400" />
                        <span>Inspect Artwork</span>
                      </div>
                    </div>

                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-mono text-emerald-300 border border-emerald-500/30">
                        {poster.category}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1.5 line-clamp-1 group-hover:text-emerald-300 transition-colors">
                    {poster.title}
                  </h3>
                  <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed mb-3">
                    {poster.description}
                  </p>

                  {/* Software & Dimensions */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {poster.software.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>{poster.dimensions}</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>View Lightbox</span>
                  </span>
                </div>
              </SpotlightCard>
            </div>
          ))}
        </div>
      </div>

      {selectedPoster && (
        <PosterLightboxModal
          poster={selectedPoster}
          onClose={() => setSelectedPoster(null)}
        />
      )}
    </section>
  );
}
