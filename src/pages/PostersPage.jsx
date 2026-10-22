import React, { useState } from 'react';
import { Palette, Eye, Sparkles, Image, CheckCircle2 } from 'lucide-react';
import ModernStageCarousel from '../components/ModernStageCarousel';
import PosterLightboxModal from '../components/PosterLightboxModal';
import { usePortfolio } from '../context/PortfolioContext';

export default function PostersPage() {
  const [selectedPoster, setSelectedPoster] = useState(null);
  const { posters } = usePortfolio();

  return (
    <div className="pt-20 sm:pt-28 pb-16 sm:pb-20 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 sm:space-y-16">
      {/* Modern Stage Carousel Section */}
      <ModernStageCarousel
        items={posters}
        categoryBadge="Division 03 • Visual Arts"
        categoryTitle="Posters & Graphic Artwork"
        categorySubtitle="Original event posters, brand identities, and commercial layouts crafted with Adobe Photoshop and Illustrator."
        accentColor="emerald"
        onItemClick={(item) => setSelectedPoster(item)}
        renderItem={(poster, isCurrent) => (
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center justify-center">
            {/* Poster 3:4 Artwork (Fitted and Proportional) */}
            <div
              onClick={() => setSelectedPoster(poster)}
              className="w-full max-w-[270px] sm:max-w-[310px] md:max-w-[340px] aspect-[3/4] max-h-[440px] relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-white/10 group shrink-0 cursor-pointer shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 mx-auto md:mx-0"
              title={`Click to inspect ${poster.title}`}
            >
              <img
                src={poster.image}
                alt={poster.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="px-4 py-2 rounded-xl bg-slate-900/90 text-white font-mono text-xs flex items-center gap-2 border border-white/20 shadow-xl">
                  <Eye className="w-4 h-4 text-emerald-400" />
                  <span>Inspect High-Res</span>
                </div>
              </div>

              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md text-[11px] font-mono text-emerald-300 border border-emerald-500/30">
                  {poster.category}
                </span>
              </div>
            </div>

            {/* Poster Details (Vertically Centered and Balanced) */}
            <div className="flex-1 w-full flex flex-col justify-between py-1 space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold tracking-wide">
                    {poster.dimensions}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    High Resolution
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2.5">
                  {poster.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-5 max-w-xl">
                  {poster.description}
                </p>

                {/* Software Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {poster.software.map((sw) => (
                    <span
                      key={sw}
                      className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono border border-slate-200 dark:border-white/5 font-medium"
                    >
                      {sw}
                    </span>
                  ))}
                </div>

                {/* Quick Info Spec Box */}
                <div className="grid grid-cols-2 gap-3 max-w-md p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase">Format</span>
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">{poster.dimensions}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase">Tooling</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{poster.software.join(' • ')}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Print-Ready Vector Artwork</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPoster(poster);
                  }}
                  className="min-h-[44px] px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-2 shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Lightbox</span>
                </button>
              </div>
            </div>
          </div>
        )}
      />

      {/* Grid of All Posters */}
      <section className="pt-8 border-t border-slate-200 dark:border-white/10">
        <div className="mb-8">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Graphic Design & Poster Gallery
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-0.5">
            Click on any artwork to inspect full resolution and print specifications.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {posters.map((poster) => (
            <div
              key={poster.id}
              onClick={() => setSelectedPoster(poster)}
              className="glass-card glass-card-hover p-4 rounded-3xl border border-slate-200 dark:border-white/10 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-slate-950 mb-3 border border-slate-200 dark:border-white/10">
                  <img
                    src={poster.image}
                    alt={poster.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Eye className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>

                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold block mb-0.5">
                  {poster.category}
                </span>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors line-clamp-1">
                  {poster.title}
                </h4>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-white/10 text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">
                {poster.software.join(' • ')}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Poster Lightbox Modal */}
      {selectedPoster && (
        <PosterLightboxModal
          poster={selectedPoster}
          onClose={() => setSelectedPoster(null)}
        />
      )}
    </div>
  );
}
