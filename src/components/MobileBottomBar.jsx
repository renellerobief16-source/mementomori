import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Home, Code2, Film, Palette, Award, Mail, Sun, Moon, MoreHorizontal, X, ExternalLink, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { profileData } from '../data/profileData';

export default function MobileBottomBar() {
  const [moreOpen, setMoreOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const mainTabs = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Web', path: '/web-projects', icon: Code2 },
    { name: 'Videos', path: '/video-editing', icon: Film },
    { name: 'Posters', path: '/posters', icon: Palette },
  ];

  const extraLinks = [
    { name: 'Certificates & Honors', path: '/certificates', icon: Award, desc: 'Verified credentials & awards' },
    { name: 'Direct Contact & Inquiries', path: '/contact', icon: Mail, desc: 'Send a message to Renelle' },
  ];

  return (
    <>
      {/* "More" Slide-up Sheet Backdrop */}
      {moreOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden animate-fadeIn"
          onClick={() => setMoreOpen(false)}
        >
          {/* Sheet container */}
          <div
            className="absolute bottom-20 left-4 right-4 max-w-md mx-auto glass-card rounded-3xl p-5 border border-slate-200 dark:border-white/15 bg-white/95 dark:bg-slate-900/95 shadow-2xl animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-white/10">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Quick Navigation & Settings
              </span>
              <button
                onClick={() => setMoreOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 mb-4">
              {extraLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMoreOpen(false)}
                    className={`flex items-center gap-3.5 p-3 rounded-2xl border transition-all ${
                      isActive
                        ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-cyan-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">{link.name}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{link.desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Theme Toggle Button inside More */}
            <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-600 dark:text-slate-300">
                Display Theme
              </span>
              <button
                onClick={toggleTheme}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs font-mono font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-200"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Switch to Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-violet-600" />
                    <span>Switch to Dark</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Glass Bottom Nav Pill */}
      <nav
        className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-sm glass-card rounded-full px-2 py-1.5 border border-slate-200/90 dark:border-white/15 bg-white/90 dark:bg-slate-900/90 shadow-2xl shadow-slate-900/20 backdrop-blur-2xl flex items-center justify-around lg:hidden select-none"
        aria-label="Mobile Navigation"
      >
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.name}
              to={tab.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1.5 px-3 rounded-full transition-all duration-200 relative ${
                  isActive
                    ? 'text-cyan-600 dark:text-cyan-400 font-bold scale-105'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-mono mt-0.5 tracking-tight">
                    {tab.name}
                  </span>
                  {isActive && (
                    <span className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-sm shadow-cyan-500/50" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}

        {/* More Tab */}
        <button
          onClick={() => setMoreOpen(!moreOpen)}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-full transition-all duration-200 relative ${
            moreOpen || location.pathname === '/certificates' || location.pathname === '/contact'
              ? 'text-cyan-600 dark:text-cyan-400 font-bold scale-105'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          aria-label="More Navigation Options"
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[10px] font-mono mt-0.5 tracking-tight">More</span>
          {(location.pathname === '/certificates' || location.pathname === '/contact') && (
            <span className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-sm shadow-cyan-500/50" />
          )}
        </button>
      </nav>
    </>
  );
}
