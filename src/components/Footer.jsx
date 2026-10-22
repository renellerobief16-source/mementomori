import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Heart, Mail } from 'lucide-react';
import { Github, Linkedin, Facebook, Instagram, OnlineJobs } from './Icons';
import { usePortfolio } from '../context/PortfolioContext';
import profilePhoto from '../assets/profile.png';

export default function Footer() {
  const { profile } = usePortfolio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      title: 'GitHub Repositories',
    },
    {
      name: 'Email',
      url: `mailto:${profile.email}`,
      icon: Mail,
      hoverClass: 'hover:text-violet-500 hover:border-violet-500/40',
      title: 'Send Email',
    },
  ];

  return (
    <footer className="glass-nav border-t border-slate-200 dark:border-white/5 py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand with Profile Picture */}
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-cyan-400 via-blue-500 to-violet-500 shadow-md shadow-cyan-500/25 group-hover:scale-105 transition-transform duration-300">
                <img
                  src={profilePhoto}
                  alt={profile.name}
                  className="w-full h-full object-cover object-top rounded-full bg-slate-200 dark:bg-slate-900"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950"></span>
            </div>
            <div>
              <span className="font-bold text-base text-slate-900 dark:text-white">{profile.name}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 block -mt-0.5 font-mono">
                {profile.title} • {profile.location}
              </span>
            </div>
          </div>

          {/* Quick links & Copyright */}
          <div className="text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
            <div className="flex flex-wrap justify-center gap-4 text-xs font-mono">
              <Link to="/" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Home</Link>
              <Link to="/web-projects" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Web Projects</Link>
              <Link to="/video-editing" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Video Editing</Link>
              <Link to="/posters" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Posters</Link>
              <Link to="/certificates" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Certificates</Link>
              <Link to="/contact" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Contact</Link>
            </div>
            <p className="text-slate-500">
              &copy; {new Date().getFullYear()} {profile.name}. All rights reserved.
            </p>
          </div>

          {/* Social Icons, Admin Lock & Scroll to Top */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-white/5 transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm ${social.hoverClass}`}
                  aria-label={social.title}
                  title={social.title}
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}

            {/* Scroll to Top */}
            <button
              onClick={scrollToTop}
              id="scroll-to-top-btn"
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-cyan-500/20 hover:text-cyan-600 dark:hover:text-cyan-400 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/5 transition-all duration-300 hover:scale-110 active:scale-95"
              aria-label="Scroll to top of page"
              title="Scroll to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
