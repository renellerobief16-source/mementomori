import React from 'react';
import { ArrowRight, ExternalLink, Sparkles, Terminal, Layers, Code, CheckCircle2 } from 'lucide-react';
import { Github } from './Icons';
import { profileData } from '../data/profileData';

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden">
      {/* Ambient background glow spots */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-cyan-500/15 via-violet-600/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-slow"></div>
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 -right-32 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Grid Mesh Texture */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none -z-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border-cyan-500/30 text-xs sm:text-sm font-mono text-cyan-300 mb-8 shadow-inner shadow-cyan-500/10 hover:border-cyan-400 transition-colors">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span>{profileData.status}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">@renellerobief16-source</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
            Engineering Modern <br />
            <span className="gradient-text">Full-Stack Web</span> Experiences
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-slate-300 font-light max-w-2xl mb-10 leading-relaxed">
            Hi, I’m <strong className="font-semibold text-white">{profileData.name}</strong>. I transform complex ideas into blazing-fast web applications, leveraging <span className="text-cyan-400 font-medium">React</span>, <span className="text-violet-400 font-medium">Tailwind CSS</span>, resilient <span className="text-cyan-400 font-medium">REST APIs</span>, and modern cloud platforms.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
            <a
              href="#projects"
              id="hero-explore-projects-btn"
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-semibold text-base shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2 group"
            >
              <span>Explore My Work</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#github-feed"
              id="hero-github-feed-btn"
              className="px-7 py-3.5 rounded-xl glass-card text-slate-200 hover:text-white hover:border-cyan-500/40 font-semibold text-base transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2.5"
            >
              <Github className="w-5 h-5 text-cyan-400" />
              <span>Live GitHub API Feed</span>
            </a>

            <a
              href={profileData.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl glass-card text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
              aria-label="View Renelle on GitHub"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>

          {/* Key Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            {profileData.stats.map((stat, idx) => (
              <div
                key={idx}
                className="glass-card p-4 sm:p-5 rounded-2xl flex flex-col items-center justify-center border-white/5 hover:border-cyan-500/30 transition-all duration-300 group"
              >
                <div className="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-cyan-400 transition-colors font-mono">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium text-center">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
