import React, { useState } from 'react';
import { Terminal, Database, Server, Layout, Sparkles, Check, Cpu } from 'lucide-react';
import { profileData } from '../data/profileData';

export default function SkillsSection() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="skills" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400 mb-3">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Technical Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Skills & <span className="gradient-text">Engineering</span> Stack
          </h2>
          <p className="text-slate-400 max-w-2xl text-base sm:text-lg">
            A comprehensive overview of languages, frameworks, architectural patterns, and cloud tooling I utilize in production.
          </p>
        </div>

        {/* Tab Controls for Mobile & Desktop */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {profileData.skillCategories.map((category, idx) => (
            <button
              key={category.title}
              onClick={() => setActiveTab(idx)}
              className={`px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all duration-300 flex items-center gap-2 ${
                activeTab === idx
                  ? 'glass-card border-cyan-500/40 text-cyan-300 shadow-lg shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-white bg-slate-900/40 border border-white/5'
              }`}
            >
              <span>{category.title}</span>
            </button>
          ))}
        </div>

        {/* Active Category Display */}
        <div className="glass-card p-6 sm:p-10 rounded-3xl border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                {profileData.skillCategories[activeTab].title}
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                Core technologies and engineering practices applied across production systems.
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800 text-cyan-400 border border-white/5">
              {profileData.skillCategories[activeTab].skills.length} Competencies
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profileData.skillCategories[activeTab].skills.map((skill) => (
              <div
                key={skill.name}
                className="p-5 rounded-2xl bg-slate-800/40 border border-white/5 hover:border-cyan-500/30 transition-all duration-200 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400"></div>
                    <span className="font-semibold text-white group-hover:text-cyan-300 transition-colors text-base">
                      {skill.name}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-cyan-400 font-semibold">
                    {skill.level}%
                  </span>
                </div>

                {/* Progress track */}
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden p-0.5 border border-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all duration-1000 ease-out"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tech Grid Summary */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="glass-card p-4 rounded-xl text-center border-white/5">
            <span className="text-xs font-mono text-slate-400 block mb-1">Architecture</span>
            <span className="text-sm font-semibold text-cyan-300">RESTful & SPA</span>
          </div>
          <div className="glass-card p-4 rounded-xl text-center border-white/5">
            <span className="text-xs font-mono text-slate-400 block mb-1">State & UI</span>
            <span className="text-sm font-semibold text-violet-300">React & Tailwind</span>
          </div>
          <div className="glass-card p-4 rounded-xl text-center border-white/5">
            <span className="text-xs font-mono text-slate-400 block mb-1">Backend</span>
            <span className="text-sm font-semibold text-emerald-300">Node & Express</span>
          </div>
          <div className="glass-card p-4 rounded-xl text-center border-white/5">
            <span className="text-xs font-mono text-slate-400 block mb-1">Deployment</span>
            <span className="text-sm font-semibold text-amber-300">Vercel & Git CI</span>
          </div>
        </div>
      </div>
    </section>
  );
}
