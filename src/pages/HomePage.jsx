import React from 'react';
import HeroSplit from '../components/HeroSplit';
import { ArrowRight, Code2, Film, Palette, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import SpotlightCard from '../components/SpotlightCard';
import { creativePortfolioData } from '../data/creativePortfolioData';

export default function HomePage() {
  const sections = [
    {
      title: "Web & Software Engineering",
      count: `${creativePortfolioData.webProjects.length} Production Systems`,
      path: "/web-projects",
      icon: Code2,
      accent: "cyan",
      desc: "Component-driven web applications built with React, Tailwind CSS, resilient REST APIs, and Vercel edge hosting. Direct link to live sites on click.",
      borderColor: "hover:border-cyan-500/50",
      btnColor: "text-cyan-600 dark:text-cyan-400 group-hover:text-cyan-500",
      badgeColor: "text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-500/20",
    },
    {
      title: "Video Editing & Motion Graphics",
      count: `${creativePortfolioData.videoEdits.length} Showcases`,
      path: "/video-editing",
      icon: Film,
      accent: "violet",
      desc: "Cinematic commercial reels, high-retention social shorts, and 3D motion graphics edited using Premiere Pro and After Effects with in-card playback.",
      borderColor: "hover:border-violet-500/50",
      btnColor: "text-violet-600 dark:text-violet-400 group-hover:text-violet-500",
      badgeColor: "text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-500/20",
    },
    {
      title: "Posters & Graphic Design",
      count: `${creativePortfolioData.posters.length} Original Artworks`,
      path: "/posters",
      icon: Palette,
      accent: "emerald",
      desc: "High-contrast event posters, brand identity systems, and advertising typography crafted with Adobe Photoshop and Illustrator.",
      borderColor: "hover:border-emerald-500/50",
      btnColor: "text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-500",
      badgeColor: "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-500/20",
    },
    {
      title: "Certificates & Honors",
      count: `${creativePortfolioData.certificates.length} Verified Credentials`,
      path: "/certificates",
      icon: Award,
      accent: "amber",
      desc: "Industry-standard certifications, technical bootcamps, and academic honors validating professional engineering competence.",
      borderColor: "hover:border-amber-500/50",
      btnColor: "text-amber-600 dark:text-amber-400 group-hover:text-amber-500",
      badgeColor: "text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-500/20",
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* ROW 1: Hero with Name & Picture immediately visible */}
      <HeroSplit />

      {/* Disciplines Hub - Multi-Page Portals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-600 dark:text-cyan-400 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dedicated Creative Divisions</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
            Explore Portfolio <span className="gradient-text">Pages</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl text-sm sm:text-base">
            Each discipline has its own dedicated page featuring single-stage carousels, full catalogs, live project launchers, and in-card video players.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((sec) => {
            const Icon = sec.icon;
            return (
              <Link
                key={sec.path}
                to={sec.path}
                className="group block focus:outline-none"
              >
                <SpotlightCard
                  className={`p-7 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d121f]/90 transition-all duration-300 ${sec.borderColor}`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-slate-800 dark:text-white" />
                    </div>
                    <span className={`text-xs font-mono px-3 py-1 rounded-full border ${sec.badgeColor}`}>
                      {sec.count}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {sec.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                    {sec.desc}
                  </p>

                  <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500 dark:text-slate-400">View Dedicated Page</span>
                    <span className={`font-semibold flex items-center gap-1.5 ${sec.btnColor}`}>
                      <span>Enter Showcase</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </SpotlightCard>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
