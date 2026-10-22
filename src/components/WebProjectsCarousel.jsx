import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Code2, Layers, ArrowUpRight } from 'lucide-react';
import { creativePortfolioData } from '../data/creativePortfolioData';
import { Github } from './Icons';
import ProjectModal from './ProjectModal';
import SpotlightCard from './SpotlightCard';

export default function WebProjectsCarousel() {
  const scrollRef = useRef(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const { webProjects } = creativePortfolioData;

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
    <section id="web-projects-row" className="py-20 border-t border-white/5 bg-[#090d16]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Row Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400 mb-2">
              <Code2 className="w-3.5 h-3.5" />
              <span>Row 1 • Web & Software Engineering</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Web Development Projects
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
              Production web applications built with React, modern component architectures, and live Vercel deployments.
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:border-cyan-500/40 transition-colors"
              aria-label="Previous Web Projects"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:border-cyan-500/40 transition-colors"
              aria-label="Next Web Projects"
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
          {webProjects.map((project) => (
            <div
              key={project.id}
              className="w-[300px] sm:w-[380px] lg:w-[420px] shrink-0 snap-start"
            >
              <SpotlightCard
                className="h-full p-5 sm:p-6 flex flex-col justify-between"
                spotlightColor="rgba(6, 182, 212, 0.2)"
              >
                <div>
                  {/* Thumbnail */}
                  <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-950 mb-5 border border-white/10 group">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-mono text-cyan-300 border border-cyan-500/30">
                        {project.badge}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400 block mb-1">
                    {project.category}
                  </span>
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
                    {project.description}
                  </p>

                  {/* Tools */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.tools.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-mono text-slate-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Case Study</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="View Repo"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {project.liveUrl && project.liveUrl !== '#' && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <span>Live Site</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </SpotlightCard>
            </div>
          ))}
        </div>
      </div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}
