import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Copy, Check, Sparkles, Code2, Film, Palette, MapPin, Mail } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { Github, Linkedin, Facebook, Instagram, OnlineJobs } from './Icons';
import profilePhoto from '../assets/profile.png';
import SpotlightCard from './SpotlightCard';

export default function HeroSplit() {
  const [copied, setCopied] = useState(false);
  const { profile } = usePortfolio();

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socialLinks = [
    {
      name: 'Facebook',
      url: profile.facebookUrl,
      icon: Facebook,
      hoverClass: 'hover:text-[#1877F2] hover:border-[#1877F2]/40',
      title: 'Facebook Profile',
    },
    {
      name: 'Instagram',
      url: profile.instagramUrl,
      icon: Instagram,
      hoverClass: 'hover:text-[#E4405F] hover:border-[#E4405F]/40',
      title: 'Instagram Profile',
    },
    {
      name: 'LinkedIn',
      url: profile.linkedinUrl,
      icon: Linkedin,
      hoverClass: 'hover:text-[#0A66C2] hover:border-[#0A66C2]/40',
      title: 'LinkedIn Profile',
    },
    {
      name: 'OnlineJobs.ph',
      url: profile.onlinejobsUrl,
      icon: OnlineJobs,
      hoverClass: 'hover:text-[#0084c7] hover:border-[#0084c7]/40',
      title: 'OnlineJobs.ph Profile',
    },
    {
      name: 'GitHub',
      url: profile.githubUrl,
      icon: Github,
      hoverClass: 'hover:text-slate-900 dark:hover:text-white hover:border-slate-400',
      title: 'GitHub Profile',
    },
  ];

  return (
    <section id="hero" className="min-h-[85vh] flex items-center justify-center pt-24 sm:pt-28 pb-12 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-center">
        
        {/* Right Column: Prominent Photo Card (ORDER-1 ON MOBILE, FIRST THING VISIBLE!) */}
        <div className="order-1 lg:order-2 lg:col-span-5 flex justify-center">
          <SpotlightCard
            className="w-full max-w-[270px] sm:max-w-sm lg:max-w-md p-2.5 sm:p-3 rounded-3xl border border-slate-200 dark:border-white/15 bg-white/95 dark:bg-slate-900/80 shadow-2xl relative group"
            spotlightColor="rgba(6, 182, 212, 0.25)"
          >
            {/* Inner frame */}
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-gradient-to-b from-slate-100 dark:from-[#131b2e] to-slate-200 dark:to-[#070b14] border border-slate-200 dark:border-white/5">
              <img
                src={profilePhoto}
                alt={profile.name}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-75"></div>

              {/* Floating Info Overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <div className="text-white font-bold text-base sm:text-lg drop-shadow">
                    {profile.name}
                  </div>
                  <div className="text-cyan-300 text-[11px] sm:text-xs font-mono drop-shadow flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    <span>Philippines • Full-Stack</span>
                  </div>
                </div>

                <div className="px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/10 text-[10px] sm:text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 shadow-lg">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>Active</span>
                </div>
              </div>
            </div>
          </SpotlightCard>
        </div>

        {/* Left Column: Name & Intro (ORDER-2 ON MOBILE) */}
        <div className="order-2 lg:order-1 lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-600 dark:text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping"></span>
            <span>{profile.status}</span>
          </div>

          {/* Primary Name Heading */}
          <div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[2.65rem] xl:text-[3.25rem] 2xl:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight sm:whitespace-nowrap">
              {profile.name}
            </h1>
            <p className="text-base sm:text-xl lg:text-2xl font-bold gradient-text mt-2 sm:mt-3 tracking-tight">
              {profile.title}
            </p>
          </div>

          {/* Disciplines Tags */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 sm:gap-2 pt-1">
            <Link
              to="/web-projects"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-mono text-cyan-700 dark:text-cyan-300 hover:border-cyan-400 active:scale-95 transition-all"
            >
              <Code2 className="w-3.5 h-3.5 text-cyan-500" />
              <span>Full-Stack Web</span>
            </Link>
            <Link
              to="/video-editing"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-mono text-violet-700 dark:text-violet-300 hover:border-violet-400 active:scale-95 transition-all"
            >
              <Film className="w-3.5 h-3.5 text-violet-500" />
              <span>Video & Motion</span>
            </Link>
            <Link
              to="/posters"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-mono text-emerald-700 dark:text-emerald-300 hover:border-emerald-400 active:scale-95 transition-all"
            >
              <Palette className="w-3.5 h-3.5 text-emerald-500" />
              <span>Posters & Graphics</span>
            </Link>
          </div>

          {/* Bio text */}
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base lg:text-lg max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
            {profile.bio}
          </p>

          {/* Primary Call to Actions */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3 pt-2">
            <Link
              to="/web-projects"
              className="min-h-[44px] sm:min-h-[48px] px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs sm:text-sm hover:bg-slate-800 dark:hover:bg-slate-200 transition-all flex items-center gap-2 shadow-lg active:scale-95"
            >
              <span>Explore My Works</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={handleCopyEmail}
              className="min-h-[44px] sm:min-h-[48px] px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-slate-100 dark:bg-slate-900/90 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-white/10 text-xs sm:text-sm font-mono transition-colors flex items-center gap-2 active:scale-95"
              title="Copy Email Address"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-500 dark:text-slate-400" />}
              <span>{copied ? 'Copied!' : 'Copy Email'}</span>
            </button>
          </div>

          {/* Social Media & Online Profiles Row */}
          <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2">
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 mr-1 hidden sm:inline">
              Connect:
            </span>
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`min-h-[42px] min-w-[42px] sm:min-h-[44px] sm:min-w-[44px] p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/10 transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm flex items-center justify-center ${social.hoverClass}`}
                  aria-label={social.title}
                  title={social.title}
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
