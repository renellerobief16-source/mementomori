import React, { useEffect } from 'react';
import { X, ExternalLink, CheckCircle, Cpu, Layers, Sparkles, Shield, ArrowUpRight, Globe } from 'lucide-react';
import { Github } from './Icons';

export default function ProjectModal({ project, onClose }) {
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

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="glass-card w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900/95 shadow-2xl relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image & Badges */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden shrink-0 bg-slate-950">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

          {/* Close button */}
          <button
            onClick={onClose}
            id="close-project-modal-btn"
            className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-950/70 text-white hover:bg-slate-900 border border-white/20 transition-colors"
            aria-label="Close Case Study"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Category & Status */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-3">
            <span className="px-3.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-medium border border-cyan-500/30 backdrop-blur-md">
              {project.category}
            </span>
            {project.badge && (
              <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-medium border border-emerald-500/30 backdrop-blur-md flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>{project.badge}</span>
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8 flex-1">
          <div>
            <h2 id="modal-title" className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
              {project.title}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 flex items-start gap-3">
              <Cpu className="w-5 h-5 text-cyan-500 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-mono text-slate-500 dark:text-slate-400">Architecture</div>
                <div className="text-sm font-semibold text-slate-800 dark:text-white">React, Tailwind CSS, Vercel Edge</div>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 flex items-start gap-3">
              <Layers className="w-5 h-5 text-violet-500 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-mono text-slate-500 dark:text-slate-400">Category</div>
                <div className="text-sm font-semibold text-slate-800 dark:text-white">{project.category}</div>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <h3 className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              Technologies & Tools
            </h3>
            <div className="flex flex-wrap gap-2">
              {(project.tools || []).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-cyan-700 dark:text-cyan-300 border border-slate-200 dark:border-white/5 text-xs font-mono"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium text-sm border border-slate-200 dark:border-white/10 transition-colors"
            >
              Close
            </button>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-medium text-sm flex items-center gap-2 border border-slate-200 dark:border-white/10 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>Source Code</span>
              </a>
            )}
            {project.liveUrl && project.liveUrl !== '#' && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-md shadow-cyan-500/20 flex items-center gap-2 transition-all"
              >
                <Globe className="w-4 h-4" />
                <span>Launch Live Project</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
