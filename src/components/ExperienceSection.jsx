import React from 'react';
import { Briefcase, Calendar, CheckCircle2, Milestone, ArrowRight } from 'lucide-react';
import { profileData } from '../data/profileData';

export default function ExperienceSection() {
  return (
    <section id="experience" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 mb-3">
            <Milestone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Developer Milestone & Track Record</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Professional <span className="gradient-text">Journey</span>
          </h2>
          <p className="text-slate-400 max-w-2xl text-base sm:text-lg">
            A chronological timeline of hands-on software development, open-source engineering, and real-world web delivery.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="max-w-3xl mx-auto relative">
          {/* Vertical Laser Line */}
          <div className="absolute top-4 bottom-4 left-4 sm:left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-cyan-500 via-violet-500 to-transparent"></div>

          <div className="space-y-12">
            {profileData.experience.map((exp, idx) => (
              <div
                key={idx}
                className="relative flex flex-col sm:flex-row items-start group"
              >
                {/* Timeline Center Node */}
                <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-900 border-2 border-cyan-400 flex items-center justify-center z-10 shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></div>
                </div>

                {/* Card Content */}
                <div
                  className={`w-full sm:w-[calc(50%-2rem)] pl-12 sm:pl-0 ${
                    idx % 2 === 0 ? 'sm:mr-auto sm:text-left' : 'sm:ml-auto sm:text-left'
                  }`}
                >
                  <div className="glass-card p-6 sm:p-7 rounded-3xl border-white/10 hover:border-cyan-500/30 transition-all duration-300">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-mono text-cyan-400 font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                        {exp.period}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {exp.role}
                    </h3>
                    <div className="text-sm font-medium text-slate-300 mb-3">
                      {exp.organization}
                    </div>

                    <p className="text-slate-400 text-sm leading-relaxed mb-4">
                      {exp.description}
                    </p>

                    {/* Highlights */}
                    <div className="space-y-2 pt-3 border-t border-white/5">
                      {exp.highlights.map((item, hIdx) => (
                        <div key={hIdx} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
