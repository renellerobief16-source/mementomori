import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, Sun, Moon, Sparkles, Layers } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { useTheme } from '../context/ThemeContext';
import profilePhoto from '../assets/profile.png';

export default function Navbar() {
  const { profile } = usePortfolio();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Web Projects', path: '/web-projects' },
    { name: 'Video Editing', path: '/video-editing' },
    { name: 'Posters', path: '/posters' },
    { name: 'Certificates', path: '/certificates' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'glass-nav py-3 shadow-lg shadow-black/5 dark:shadow-black/20'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand with Real Picture & Live Status */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none"
            aria-label="Home"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-cyan-400 via-blue-500 to-violet-500 shadow-md shadow-cyan-500/25 group-hover:scale-105 transition-transform duration-300">
                <img
                  src={profilePhoto}
                  alt={profile.name}
                  className="w-full h-full object-cover object-top rounded-full bg-slate-200 dark:bg-slate-900"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950 flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors">
                {profile.name}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-600 dark:text-cyan-400 -mt-1 font-semibold">
                Full-Stack & Creator
              </span>
            </div>
          </Link>

          {/* Desktop Nav - Dedicated Separate Pages */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-200/80 dark:bg-slate-900/60 p-1.5 rounded-full border border-slate-300/80 dark:border-white/5 backdrop-blur-md">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-1.5 rounded-full text-xs font-semibold font-mono transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-md shadow-cyan-500/20'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-300/50 dark:hover:bg-white/5'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Action, Dark/Light Theme Switcher & Status */}
          <div className="hidden md:flex items-center gap-3">
            {/* Dark & Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-cyan-500 transition-all hover:scale-105 active:scale-95 shadow-sm"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Theme Mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
              ) : (
                <Moon className="w-4 h-4 text-violet-600" />
              )}
            </button>

            {/* Quick Contact CTA */}
            <Link
              to="/contact"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-medium text-xs shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-300 hover:-translate-y-0.5"
            >
              <span>Get in Touch</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile menu and theme button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300"
              aria-label="Toggle Theme Mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-violet-600" />
              )}
            </button>

            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white border border-slate-300 dark:border-white/10 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-nav border-b border-slate-200 dark:border-white/10 px-4 pt-4 pb-6 mt-2 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-xl text-sm font-mono font-medium transition-colors ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:text-cyan-600 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <div className="pt-3 border-t border-slate-200 dark:border-white/10">
            <Link
              to="/contact"
              className="w-full text-center block py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-medium text-sm"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
