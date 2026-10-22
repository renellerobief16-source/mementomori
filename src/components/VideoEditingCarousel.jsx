import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Film, Sparkles, Clock } from 'lucide-react';
import { creativePortfolioData } from '../data/creativePortfolioData';
import SpotlightCard from './SpotlightCard';
import VideoModal from './VideoModal';

export default function VideoEditingCarousel() {
  const scrollRef = useRef(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const { videoEdits } = creativePortfolioData;

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
    <section id="video-editing-row" className="py-20 border-t border-white/5 bg-[#080c14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Row Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-mono text-violet-400 mb-2">
              <Film className="w-3.5 h-3.5" />
              <span>Row 2 • Video Editing & Post-Production</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Video Editing & Motion Showcase
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
              Cinematic edits, promotional reels, and 3D visual effects created using Premiere Pro, After Effects, and DaVinci Resolve.
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:border-violet-500/40 transition-colors"
              aria-label="Previous Video Edits"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:border-violet-500/40 transition-colors"
              aria-label="Next Video Edits"
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
          {videoEdits.map((video) => (
            <div
              key={video.id}
              className="w-[280px] sm:w-[360px] lg:w-[400px] shrink-0 snap-start"
            >
              <SpotlightCard
                className="h-full p-5 sm:p-6 flex flex-col justify-between cursor-pointer group"
                spotlightColor="rgba(139, 92, 246, 0.22)"
                onClick={() => setSelectedVideo(video)}
              >
                <div>
                  {/* Video Thumbnail with Centered Play Button */}
                  <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-950 mb-5 border border-white/10">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-violet-600/90 text-white flex items-center justify-center shadow-lg shadow-violet-600/40 group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 ml-0.5" />
                      </div>
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute bottom-3 right-3">
                      <span className="px-2 py-0.5 rounded-md bg-slate-950/85 backdrop-blur-md text-[10px] font-mono text-white flex items-center gap-1 border border-white/10">
                        <Clock className="w-3 h-3 text-violet-400" />
                        <span>{video.duration}</span>
                      </span>
                    </div>

                    {/* Category */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-mono text-violet-300 border border-violet-500/30">
                        {video.category}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-violet-300 transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
                    {video.description}
                  </p>

                  {/* Software Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {video.software.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-mono text-slate-300"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Click to Play Preview</span>
                  <span className="text-violet-400 font-medium flex items-center gap-1">
                    <Play className="w-3 h-3" />
                    <span>Watch</span>
                  </span>
                </div>
              </SpotlightCard>
            </div>
          ))}
        </div>
      </div>

      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </section>
  );
}
