import React, { useState } from 'react';
import { Code2, ExternalLink, Layers, ArrowUpRight, Sparkles, Globe, Monitor } from 'lucide-react';
import { Github } from '../components/Icons';
import ModernStageCarousel from '../components/ModernStageCarousel';
import ProjectModal from '../components/ProjectModal';
import { usePortfolio } from '../context/PortfolioContext';

export default function WebProjectsPage() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [filter, setFilter] = useState('All');
  const { webProjects } = usePortfolio();

  const filteredProjects = filter === 'All' 
    ? webProjects 
    : webProjects.filter(p => p.category.toLowerCase().includes(filter.toLowerCase()));

  const handleLaunchSite = (e, project) => {
    e.stopPropagation();
    if (project.liveUrl && project.liveUrl !== '#') {
      window.open(project.liveUrl, '_blank', 'noopener,noreferrer');
    } else if (project.githubUrl) {
      window.open(project.githubUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="pt-20 sm:pt-28 pb-16 sm:pb-20 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 sm:space-y-16">
      {/* Modern Stage Carousel Section */}
      <ModernStageCarousel
        items={webProjects}
        categoryBadge="Division 01 • Web & Software Engineering"
        categoryTitle="Web Development Projects"
        categorySubtitle="Production-ready web applications architected with React, Node APIs, and Vercel cloud deployments. Tap any project image to launch the live site directly."
        accentColor="cyan"
        onItemClick={(item) => setSelectedProject(item)}
        renderItem={(project, isCurrent) => (
          <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 items-center justify-between">
            {/* Interactive Clickable Project Image */}
            <div
              onClick={(e) => handleLaunchSite(e, project)}
              className="w-full lg:w-3/5 relative rounded-2xl overflow-hidden aspect-video bg-slate-950 border border-slate-200 dark:border-white/10 group cursor-pointer shadow-lg hover:shadow-cyan-500/20 transition-all duration-300"
              title={`Click to open ${project.title} live website in a new tab`}
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

              {/* Hover/Tap Prompt: Click to visit live site */}
              <div className="absolute inset-0 bg-cyan-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                <div className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl bg-cyan-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-2xl shadow-cyan-500/40 transform group-hover:scale-105 transition-transform">
                  <Globe className="w-4 h-4" />
                  <span>Launch Live Website ↗</span>
                </div>
              </div>

              {/* Top Badge */}
              <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3">
                <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-slate-950/85 backdrop-blur-md text-[10px] sm:text-[11px] font-mono text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                  <span>{project.badge}</span>
                </span>
              </div>

              {/* Bottom URL hint */}
              <div className="absolute bottom-2.5 sm:bottom-3 left-2.5 sm:left-3 right-2.5 sm:right-3 flex items-center justify-between">
                <span className="text-[10px] sm:text-[11px] font-mono text-white/90 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border border-white/10 truncate max-w-[200px] sm:max-w-[280px]">
                  {project.liveUrl}
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono text-cyan-300 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border border-white/10 flex items-center gap-1">
                  <span>Tap to open</span>
                  <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </span>
              </div>
            </div>

            {/* Project Details */}
            <div className="w-full lg:w-2/5 flex flex-col justify-between space-y-4 sm:space-y-5">
              <div>
                <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-semibold block mb-1">
                  {project.category}
                </span>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                  {project.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                  {project.description}
                </p>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
                  {project.tools.map((tool) => (
                    <span
                      key={tool}
                      className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] sm:text-xs font-mono border border-slate-200 dark:border-white/5"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons (Mobile-first layout) */}
              <div className="pt-3 sm:pt-4 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                {/* Primary Live Site Button */}
                {project.liveUrl && project.liveUrl !== '#' && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20 active:scale-95 transition-all"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Open Live Website</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}

                <div className="flex items-center gap-2">
                  {/* Case study modal button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProject(project);
                    }}
                    className="flex-1 sm:flex-initial min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono border border-slate-200 dark:border-white/10 flex items-center justify-center gap-1.5 active:scale-95 transition-colors"
                    title="Inspect Architecture"
                  >
                    <Layers className="w-4 h-4 text-cyan-500" />
                    <span>Case Study</span>
                  </button>

                  {/* GitHub link */}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 flex items-center justify-center active:scale-95 transition-colors"
                      title="View GitHub Repository"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      />

      {/* Full Catalog Grid */}
      <section className="pt-8 border-t border-slate-200 dark:border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              All Web Systems & Repositories
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-0.5">
              Tap on any project picture to instantly launch the live website.
            </p>
          </div>

          {/* Filter Pills with Horizontal Touch Scrolling on Mobile */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 -mx-1 px-1">
            {['All', 'Full-Stack', 'Medical', 'Frontend'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-mono transition-colors active:scale-95 ${
                  filter === f
                    ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/40 font-semibold'
                    : 'bg-slate-100 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/5'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="glass-card glass-card-hover p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-white/10 flex flex-col justify-between group"
            >
              <div>
                {/* Clickable Image to Launch Live Site */}
                <div
                  onClick={(e) => handleLaunchSite(e, proj)}
                  className="relative rounded-xl sm:rounded-2xl overflow-hidden aspect-video bg-slate-950 mb-3.5 sm:mb-4 border border-slate-200 dark:border-white/10 cursor-pointer group/img"
                  title={`Click to open ${proj.title} website`}
                >
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-slate-950/25 group-hover/img:bg-cyan-950/40 transition-colors flex items-center justify-center">
                    <div className="sm:opacity-0 group-hover/img:opacity-100 transition-opacity px-3.5 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 shadow-lg">
                      <span>Launch Site</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="absolute top-2 left-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-950/85 backdrop-blur-md text-[10px] font-mono text-cyan-300 border border-cyan-500/30">
                      {proj.badge}
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-semibold block mb-1">
                  {proj.category}
                </span>
                <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1.5 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                  {proj.title}
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-xs line-clamp-2 leading-relaxed mb-4">
                  {proj.description}
                </p>
              </div>

              {/* Bottom Action Footer */}
              <div className="pt-3.5 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs font-mono">
                <button
                  onClick={() => setSelectedProject(proj)}
                  className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 py-1"
                >
                  <Layers className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Architecture</span>
                </button>

                <button
                  onClick={(e) => handleLaunchSite(e, proj)}
                  className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 font-bold flex items-center gap-1 py-1"
                >
                  <span>Visit Website</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Case Study Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
