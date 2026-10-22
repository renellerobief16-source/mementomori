import React, { useState } from 'react';
import { ExternalLink, Layers, ArrowUpRight, Sparkles, Eye } from 'lucide-react';
import { Github } from './Icons';
import { profileData } from '../data/profileData';
import ProjectModal from './ProjectModal';

export default function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const categories = ['All', 'Full-Stack', 'Frontend', 'Web Apps'];

  const filteredProjects = activeCategory === 'All'
    ? profileData.projects
    : profileData.projects.filter(p => p.category === activeCategory);

  return (
    <section id="projects" className="py-24 relative">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-mono text-violet-300 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>Featured Solutions & Case Studies</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Architected for <span className="gradient-text">Performance</span> & Scale
          </h2>
          <p className="text-slate-400 max-w-2xl text-base sm:text-lg">
            Explore curated web applications engineered with clean codebases, responsive user interfaces, and cloud-first deployment pipelines.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8 p-1.5 rounded-full glass-card border-white/5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-md shadow-cyan-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="glass-card glass-card-hover rounded-3xl overflow-hidden border-white/5 flex flex-col group relative"
            >
              {/* Image banner */}
              <div className="relative h-60 w-full overflow-hidden bg-slate-900">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                {/* Top Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-cyan-300 text-xs font-mono font-medium border border-cyan-500/30">
                    {project.category}
                  </span>
                </div>

                {/* Quick inspect overlay button */}
                <button
                  onClick={() => setSelectedProject(project)}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-2 text-white font-medium text-sm"
                >
                  <span className="px-4 py-2 rounded-xl bg-slate-900/90 border border-white/20 flex items-center gap-2 shadow-lg">
                    <Eye className="w-4 h-4 text-cyan-400" />
                    <span>View Architecture Details</span>
                  </span>
                </button>
              </div>

              {/* Card Content */}
              <div className="p-6 sm:p-7 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                    {project.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-5">
                    {project.description}
                  </p>
                </div>

                <div>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-white/5 text-[11px] font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Links / Action bar */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 font-medium transition-colors"
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
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 transition-colors"
                          title="View Repository"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {project.liveUrl && project.liveUrl !== '#' && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <span>Live Site</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Case Study Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}
