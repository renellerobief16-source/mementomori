import React, { useState } from 'react';
import { Mail, Send, Copy, Check, MessageSquare, Sparkles, MapPin, Phone } from 'lucide-react';
import { Github, Linkedin, Facebook, Instagram, OnlineJobs } from './Icons';
import confetti from 'canvas-confetti';
import { usePortfolio } from '../context/PortfolioContext';

export default function ContactSection() {
  const { profile } = usePortfolio();
  const [copied, setCopied] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const socialChannels = [
    { name: 'Facebook', url: profile.facebookUrl, icon: Facebook, color: 'text-[#1877F2]' },
    { name: 'Instagram', url: profile.instagramUrl, icon: Instagram, color: 'text-[#E4405F]' },
    { name: 'LinkedIn', url: profile.linkedinUrl, icon: Linkedin, color: 'text-[#0A66C2]' },
    { name: 'OnlineJobs', url: profile.onlinejobsUrl, icon: OnlineJobs, color: 'text-[#0084c7]' },
    { name: 'GitHub', url: profile.githubUrl, icon: Github, color: 'text-slate-800 dark:text-white' },
    { name: 'Email', url: `mailto:${profile.email}`, icon: Mail, color: 'text-violet-500' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    // Launch celebratory confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#06b6d4', '#8b5cf6', '#10b981', '#38bdf8'],
    });

    setFormSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setFormSubmitted(false), 6000);
  };

  return (
    <section id="contact" className="py-8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
          {/* Left Column: Quick Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 space-y-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Contact Information</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Available for freelance engineering, full-time remote roles, and consulting on React/Node applications.
              </p>

              <div className="space-y-4 pt-2">
                {/* Email Box */}
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5 flex flex-col gap-2">
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Direct Email</span>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white break-all">
                      {profile.email}
                    </span>
                    <button
                      onClick={handleCopyEmail}
                      id="copy-email-btn"
                      className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700/60 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors shrink-0"
                      title="Copy email to clipboard"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {copied && (
                    <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                      <Check className="w-3 h-3" /> Email copied to clipboard!
                    </span>
                  )}
                </div>

                {/* Location */}
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5 flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-cyan-500 shrink-0" />
                  <div>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 block">Location</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{profile.location} (Remote Ready)</span>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-4 border-t border-slate-200 dark:border-white/10">
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-3">
                  Connect & Socials
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {socialChannels.map((ch) => {
                    const Icon = ch.icon;
                    return (
                      <a
                        key={ch.name}
                        href={ch.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white border border-slate-200 dark:border-white/5 transition-all duration-300 hover:scale-[1.03] active:scale-95 flex items-center gap-2 text-xs font-medium"
                      >
                        <Icon className={`w-4 h-4 ${ch.color}`} />
                        <span className="truncate">{ch.name}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Send a Direct Message</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                Fill out the message below and I will respond to you promptly.
              </p>

              {formSubmitted ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">Message Received!</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                    Thank you, your message has been recorded. Renelle will get back to your email shortly!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-mono text-slate-700 dark:text-slate-300 mb-1.5 font-medium">
                        Your Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-mono text-slate-700 dark:text-slate-300 mb-1.5 font-medium">
                        Your Email *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="block text-xs font-mono text-slate-700 dark:text-slate-300 mb-1.5 font-medium">
                      Subject / Project Scope
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Web App Project / Video Reel Commission"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-mono text-slate-700 dark:text-slate-300 mb-1.5 font-medium">
                      Project Details or Message *
                    </label>
                    <textarea
                      id="contact-message"
                      rows="4"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell me about your goals, timeline, and requirements..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm transition-colors resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    id="submit-contact-form-btn"
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-[1.01] active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message to Renelle</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
