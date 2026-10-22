import React, { useState } from 'react';
import { Film, Play, Clock, Sparkles, Video, Layers, X, Volume2, Maximize2 } from 'lucide-react';
import ModernStageCarousel from '../components/ModernStageCarousel';
import VideoModal from '../components/VideoModal';
import SmartVideoPlayer from '../components/SmartVideoPlayer';
import { usePortfolio } from '../context/PortfolioContext';

export default function VideoEditingPage() {
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [theaterModalVideo, setTheaterModalVideo] = useState(null);
  const { videoEdits } = usePortfolio();

  return (
    <div className="pt-20 sm:pt-28 pb-16 sm:pb-20 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 sm:space-y-16">
      {/* Modern Stage Carousel Section (Zero Overlap, In-Card Direct Playback) */}
      <ModernStageCarousel
        items={videoEdits}
        categoryBadge="Division 02 • Post-Production & Motion Design"
        categoryTitle="Video Editing & Motion Showcase"
        categorySubtitle="Cinematic commercial edits, high-retention social reels, and 3D visual effects crafted with Premiere Pro and After Effects. Tap play to watch directly inside the card."
        accentColor="violet"
        renderItem={(video, isCurrent) => {
          const isPlaying = playingVideoId === video.id;

          return (
            <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 items-center justify-between">
              {/* In-Card Video Area (Direct Playback, ZERO OVERLAP) */}
              <div className="w-full lg:w-3/5">
                {isPlaying ? (
                  <div className="relative rounded-xl sm:rounded-2xl overflow-hidden aspect-video bg-black border-2 border-violet-500 shadow-2xl shadow-violet-500/20">
                    <SmartVideoPlayer
                      src={video.previewVideo}
                      poster={video.thumbnail}
                      autoPlay={true}
                      controls={true}
                      title={video.title}
                      className="w-full h-full object-contain"
                    />

                    {/* Close / Return to Thumbnail Button */}
                    <button
                      onClick={() => setPlayingVideoId(null)}
                      className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 p-1.5 sm:p-2 rounded-full bg-slate-950/85 text-white hover:bg-slate-900 transition-colors z-20 backdrop-blur-md border border-white/20 shadow-lg flex items-center gap-1.5 text-[11px] sm:text-xs font-mono active:scale-95"
                      title="Return to preview"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Close</span>
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => setPlayingVideoId(video.id)}
                    className="relative rounded-xl sm:rounded-2xl overflow-hidden aspect-video bg-slate-950 border border-slate-200 dark:border-white/10 group cursor-pointer shadow-lg hover:shadow-violet-500/20 transition-all duration-300"
                    title={`Click to play ${video.title} directly`}
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-xl shadow-violet-600/40 group-hover:scale-110 group-hover:bg-violet-500 transition-all duration-300">
                        <Play className="w-6 h-6 sm:w-7 sm:h-7 ml-1" />
                      </div>
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute bottom-2.5 sm:bottom-3 right-2.5 sm:right-3">
                      <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-lg bg-slate-950/85 backdrop-blur-md text-[11px] sm:text-xs font-mono text-white flex items-center gap-1.5 border border-white/10">
                        <Clock className="w-3.5 h-3.5 text-violet-400" />
                        <span>{video.duration}</span>
                      </span>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3">
                      <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-slate-950/85 backdrop-blur-md text-[10px] sm:text-[11px] font-mono text-violet-300 border border-violet-500/30">
                        {video.category}
                      </span>
                    </div>

                    {/* Play Prompter Bar */}
                    <div className="absolute bottom-2.5 sm:bottom-3 left-2.5 sm:left-3">
                      <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-lg bg-violet-600/90 text-white text-[10px] sm:text-[11px] font-mono font-bold flex items-center gap-1 shadow-md">
                        <Play className="w-3 h-3" />
                        <span>Tap to Play In-Card</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Info Details */}
              <div className="w-full lg:w-2/5 flex flex-col justify-between space-y-4 sm:space-y-5">
                <div>
                  <span className="text-xs font-mono text-violet-600 dark:text-violet-400 font-semibold block mb-1">
                    {video.category}
                  </span>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                    {video.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5">
                    {video.description}
                  </p>

                  {/* Software Tags */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
                    {video.software.map((sw) => (
                      <span
                        key={sw}
                        className="px-2.5 sm:px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] sm:text-xs font-mono border border-slate-200 dark:border-white/5"
                      >
                        {sw}
                      </span>
                    ))}
                  </div>

                  <div className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                    <span className="truncate">Highlight: <strong className="text-slate-700 dark:text-slate-200 font-semibold">{video.highlight}</strong></span>
                  </div>
                </div>

                {/* Video Action Controls */}
                <div className="pt-3 sm:pt-4 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                  {isPlaying ? (
                    <button
                      onClick={() => setPlayingVideoId(null)}
                      className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-mono font-bold flex items-center justify-center gap-2 hover:bg-slate-300 dark:hover:bg-slate-700 active:scale-95 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Stop Video</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setPlayingVideoId(video.id)}
                      className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs font-mono flex items-center justify-center gap-2 shadow-md shadow-violet-600/30 active:scale-95 transition-all"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Play In-Card Now</span>
                    </button>
                  )}

                  {/* Theater modal option */}
                  <button
                    onClick={() => setTheaterModalVideo(video)}
                    className="min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono border border-slate-200 dark:border-white/10 flex items-center justify-center gap-1.5 active:scale-95 transition-colors"
                    title="Open in Theater Modal"
                  >
                    <Maximize2 className="w-4 h-4 text-violet-500" />
                    <span>Theater Mode</span>
                  </button>
                </div>
              </div>
            </div>
          );
        }}
      />

      {/* Grid of All Video Edits */}
      <section className="pt-8 border-t border-slate-200 dark:border-white/10">
        <div className="mb-6 sm:mb-8">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            All Video Showcases & Edits
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-0.5">
            Tap on any reel to watch in high-definition theater mode.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {videoEdits.map((v) => (
            <div
              key={v.id}
              onClick={() => setTheaterModalVideo(v)}
              className="glass-card glass-card-hover p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-white/10 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="relative rounded-xl sm:rounded-2xl overflow-hidden aspect-video bg-slate-950 mb-3.5 sm:mb-4 border border-slate-200 dark:border-white/10">
                  <img
                    src={v.thumbnail}
                    alt={v.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-violet-600/90 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <Play className="w-4 h-4 ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <span className="px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
                      {v.duration}
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-mono text-violet-600 dark:text-violet-400 font-semibold block mb-1">
                  {v.category}
                </span>
                <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1.5 group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors line-clamp-1">
                  {v.title}
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-xs line-clamp-2 mb-3">
                  {v.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">{v.software[0]}</span>
                <span className="text-violet-600 dark:text-violet-400 font-semibold flex items-center gap-1">
                  <Play className="w-3 h-3" />
                  <span>Watch Reel</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Theater Video Modal */}
      {theaterModalVideo && (
        <VideoModal
          video={theaterModalVideo}
          onClose={() => setTheaterModalVideo(null)}
        />
      )}
    </div>
  );
}
