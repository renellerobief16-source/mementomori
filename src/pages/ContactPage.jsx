import React from 'react';
import ContactSection from '../components/ContactSection';
import { Mail, MessageSquare, MapPin, Clock, Sparkles } from 'lucide-react';
import { Github, Linkedin } from '../components/Icons';
import { creativePortfolioData } from '../data/creativePortfolioData';

export default function ContactPage() {
  return (
    <div className="pt-20 sm:pt-28 pb-16 sm:pb-20 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 sm:space-y-12">
      {/* Page Header */}
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-600 dark:text-cyan-400 mb-3">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Direct Inquiries & Bookings</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
          Let’s Build Something <span className="gradient-text">Exceptional</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
          Available for full-time engineering roles, freelance web applications, video editing contracts, and custom graphic design commissions.
        </p>
      </div>

      {/* Main Interactive Contact Hub */}
      <ContactSection />
    </div>
  );
}
