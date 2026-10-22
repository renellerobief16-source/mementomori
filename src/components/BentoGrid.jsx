import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, ExternalLink, Code2, Globe, Sparkles, Terminal, 
  MapPin, Clock, Copy, Check, Radio, Send, Layers, Eye, Star, GitFork, RefreshCw
} from 'lucide-react';
import SpotlightCard from './SpotlightCard';
import { profileData } from '../data/profileData';
import { fetchGitHubProfile, fetchGitHubRepos } from '../services/githubService';
import { gitApiFiles } from '../data/gitApiFiles';
import { Github, Linkedin } from './Icons';
import ProjectModal from './ProjectModal';
import confetti from 'canvas-confetti';

export default function BentoGrid() {
  const [ghProfile, setGhProfile] = useState(null);
  const [activeFileId, setActiveFileId] = useState(gitApiFiles[0].id);
  const [codeCopied, setCodeCopied] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [viewMode, setViewMode] = useState('code'); // 'code' | 'response'
  const [testingStatus, setTestingStatus] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [localTime, setLocalTime] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  // Load live GitHub profile
  useEffect(() => {
    fetchGitHubProfile().then(data => setGhProfile(data));
  }, []);

  // Update Philippine Local Time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLocalTime(now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Manila',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeApiFile = gitApiFiles.find(f => f.id === activeFileId) || gitApiFiles[0];
  const apiLines = activeApiFile.code.trim().split('\n');

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeApiFile.code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profileData.email);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  const handleRunEndpoint = () => {
    setTestingStatus('executing');
    setTimeout(() => {
      setTestingStatus('success');
      setViewMode('response');
    }, 450);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#06b6d4', '#8b5cf6', '#10b981', '#ffffff'],
    });

    setFormSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setFormSubmitted(false), 6000);
  };

  const libralinkProject = profileData.projects.find(p => p.id === 'libralink');
  const clinicProject = profileData.projects.find(p => p.id === 'dayrit-clinic');

  return (
    <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Bento Grid Canvas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* ========================================================= */}
        {/* CELL 1: Hero Bio & Availability (Col 1-2, Large)           */}
        {/* ========================================================= */}
        <SpotlightCard
          className="md:col-span-2 p-8 sm:p-10 flex flex-col justify-between"
          spotlightColor="rgba(6, 182, 212, 0.22)"
        >
          <div>
            {/* Live Status Pill */}
            <div className="flex items-center justify-between mb-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Open for Full-Stack Opportunities</span>
              </div>
              <span className="text-xs font-mono text-slate-500 hidden sm:inline-block">
                @renellerobief16-source
              </span>
            </div>

            {/* Title & Tagline */}
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mb-4">
              Building Scalable <br />
              <span className="gradient-text">Full-Stack Web</span> Solutions
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-xl font-light leading-relaxed mb-8">
              Hi, I’m <strong className="text-white font-medium">{profileData.name}</strong>. I design and build modern web applications with component-driven architectures, resilient REST APIs, and production-tested deployments.
            </p>
          </div>

          {/* Quick Action Dock */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/5">
            <a
              href="#projects"
              className="px-5 py-2.5 rounded-xl bg-white text-slate-950 font-semibold text-xs sm:text-sm hover:bg-slate-200 transition-colors flex items-center gap-2 shadow-sm"
            >
              <span>Featured Work</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#git-explorer"
              className="px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-white/10 text-xs sm:text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Git API Explorer</span>
            </a>

            <button
              onClick={handleCopyEmail}
              className="px-4 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/5 text-xs font-mono transition-colors flex items-center gap-2"
              title="Copy Email"
            >
              {emailCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{emailCopied ? 'Copied' : 'renellerobieF16@gmail.com'}</span>
            </button>
          </div>
        </SpotlightCard>

        {/* ========================================================= */}
        {/* CELL 2: Live GitHub API Card (Col 3, Tall)                */}
        {/* ========================================================= */}
        <SpotlightCard
          className="p-7 flex flex-col justify-between"
          spotlightColor="rgba(139, 92, 246, 0.22)"
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>Live GitHub API</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">v3 REST</span>
            </div>

            {/* Profile Avatar & Handle */}
            <div className="flex items-center gap-4 mb-6">
              <img
                src={ghProfile?.avatar_url || "https://avatars.githubusercontent.com/u/237668816?v=4"}
                alt="GitHub Avatar"
                className="w-14 h-14 rounded-2xl border border-white/15 shadow-md"
              />
              <div>
                <h3 className="font-bold text-white text-base">
                  {ghProfile?.name || "Renelle Robie D. Lopez"}
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  @{ghProfile?.login || "renellerobief16-source"}
                </span>
              </div>
            </div>

            {/* Live Stats Pills */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 text-center">
                <div className="text-2xl font-bold font-mono text-cyan-400">
                  {ghProfile?.public_repos || "23"}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Repositories</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 text-center">
                <div className="text-2xl font-bold font-mono text-violet-400">
                  {ghProfile?.followers || "12"}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Followers</div>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Public repos actively synchronized with Git branches, commit logs, and production Vercel edge URLs.
            </p>
          </div>

          <a
            href={profileData.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full mt-6 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-mono text-xs flex items-center justify-center gap-2 border border-white/10 transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>Open GitHub Profile</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </SpotlightCard>

        {/* ========================================================= */}
        {/* CELL 3: Featured Project Spotlight: Libralink (Col 1-2)    */}
        {/* ========================================================= */}
        {libralinkProject && (
          <SpotlightCard
            className="md:col-span-2 p-7 sm:p-8 flex flex-col justify-between"
            spotlightColor="rgba(6, 182, 212, 0.2)"
          >
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              <div className="sm:col-span-7">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  <span>Featured Production System</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {libralinkProject.title}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  {libralinkProject.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {libralinkProject.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 text-xs font-mono border border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Preview Thumbnail with Glass Badge */}
              <div className="sm:col-span-5 relative rounded-2xl overflow-hidden border border-white/10 h-48 bg-slate-900 group">
                <img
                  src={libralinkProject.image}
                  alt={libralinkProject.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-[11px] font-mono text-cyan-300 border border-cyan-500/30">
                    Live Vercel Edge
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-4">
              <button
                onClick={() => setSelectedProject(libralinkProject)}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 font-medium transition-colors"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Architecture Breakdown</span>
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={libralinkProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/5 transition-colors"
                  title="View GitHub Repository"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href={libralinkProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>Launch Live</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </SpotlightCard>
        )}

        {/* ========================================================= */}
        {/* CELL 4: Healthcare Portal: Dayrit Clinic (Col 3)           */}
        {/* ========================================================= */}
        {clinicProject && (
          <SpotlightCard
            className="p-7 flex flex-col justify-between"
            spotlightColor="rgba(16, 185, 129, 0.2)"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Healthcare Portal</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Dayrit Clinic
              </h3>
              <p className="text-slate-300 text-xs leading-relaxed mb-4">
                Patient appointment booking, doctor schedules, and clinical service indices built with high-contrast accessibility.
              </p>

              <div className="rounded-xl overflow-hidden border border-white/10 h-32 mb-4 bg-slate-900">
                <img
                  src={clinicProject.image}
                  alt={clinicProject.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {clinicProject.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <button
                onClick={() => setSelectedProject(clinicProject)}
                className="text-xs font-mono text-slate-400 hover:text-white"
              >
                Details
              </button>
              <a
                href={clinicProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>Live Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </SpotlightCard>
        )}

        {/* ========================================================= */}
        {/* CELL 5: Git API Code Explorer (Full 3-Cols, Interactive)  */}
        {/* ========================================================= */}
        <SpotlightCard
          id="git-explorer"
          className="md:col-span-2 lg:col-span-3 p-6 sm:p-8"
          spotlightColor="rgba(6, 182, 212, 0.16)"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/5 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Production Git Source & Endpoints</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Interactive API Code Explorer
              </h3>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setViewMode(viewMode === 'code' ? 'response' : 'code')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                  viewMode === 'response'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-800 text-slate-300 hover:text-white border border-white/5'
                }`}
              >
                {viewMode === 'code' ? 'Simulate JSON Response' : 'View Source Code'}
              </button>

              <button
                onClick={handleRunEndpoint}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-medium transition-colors"
              >
                {testingStatus === 'executing' ? 'Invoking...' : 'Run Test'}
              </button>

              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/5 text-xs font-mono transition-colors flex items-center gap-1.5"
              >
                {codeCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{codeCopied ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>
          </div>

          {/* Code Window Container */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-[#080c14] overflow-hidden">
            {/* Window Tabs Bar */}
            <div className="px-3 py-2 bg-[#060910] border-b border-white/5 flex items-center gap-2 overflow-x-auto">
              <div className="flex items-center gap-1.5 px-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
              </div>

              {gitApiFiles.map((file) => (
                <button
                  key={file.id}
                  onClick={() => {
                    setActiveFileId(file.id);
                    setViewMode('code');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors shrink-0 flex items-center gap-2 ${
                    file.id === activeFileId
                      ? 'bg-slate-800/90 text-cyan-400 border border-white/10 font-medium'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>{file.fileName}</span>
                  <span className="text-[10px] text-slate-500">({file.repoName})</span>
                </button>
              ))}
            </div>

            {/* Code / Response Content */}
            <div className="p-4 sm:p-6 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed select-text min-h-[340px]">
              {viewMode === 'code' ? (
                <div className="table w-full">
                  {apiLines.map((line, idx) => (
                    <div key={idx} className="table-row hover:bg-slate-800/30">
                      <span className="table-cell select-none pr-4 text-right text-slate-600 font-mono w-10 text-xs">
                        {idx + 1}
                      </span>
                      <span className="table-cell text-slate-200 whitespace-pre font-mono">
                        {line || ' '}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>HTTP 200 OK — JSON Response from {activeApiFile.repoName}</span>
                    </div>
                    <span className="text-slate-500">Execution: 18ms</span>
                  </div>
                  <pre className="text-cyan-300 whitespace-pre overflow-x-auto p-4 rounded-xl bg-slate-950 border border-white/5">
                    {JSON.stringify(activeApiFile.responseSample, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </SpotlightCard>

        {/* ========================================================= */}
        {/* CELL 6: Tech Capabilities & Core Stack (Col 1-2)          */}
        {/* ========================================================= */}
        <SpotlightCard
          className="md:col-span-2 p-7 sm:p-8 flex flex-col justify-between"
          spotlightColor="rgba(139, 92, 246, 0.18)"
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-violet-400 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full-Stack Capabilities</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-6">
              Engineering Proficiency Matrix
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: "React.js", category: "Frontend", level: "Senior" },
                { name: "JavaScript", category: "Language", level: "ES6+" },
                { name: "Node.js", category: "Backend", level: "Advanced" },
                { name: "Express", category: "APIs", level: "RESTful" },
                { name: "Tailwind CSS", category: "Styling", level: "Modern" },
                { name: "Vercel", category: "Cloud Edge", level: "Production" },
                { name: "MongoDB", category: "NoSQL DB", level: "CRUD" },
                { name: "Git & GitHub", category: "DevOps", level: "CI/CD" },
              ].map((skill) => (
                <div
                  key={skill.name}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 hover:border-violet-500/30 transition-colors"
                >
                  <div className="text-xs text-slate-400 font-mono">{skill.category}</div>
                  <div className="text-sm font-semibold text-white mt-0.5">{skill.name}</div>
                  <div className="text-[10px] text-cyan-400 font-mono mt-1">{skill.level}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 mt-6 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Architecture: SPA &bull; Microservices &bull; Cloud</span>
            <span className="text-cyan-400">Clean Code Standard</span>
          </div>
        </SpotlightCard>

        {/* ========================================================= */}
        {/* CELL 7: Timezone & Location Card (Col 3)                  */}
        {/* ========================================================= */}
        <SpotlightCard
          className="p-7 flex flex-col justify-between"
          spotlightColor="rgba(6, 182, 212, 0.18)"
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
              <Clock className="w-3.5 h-3.5" />
              <span>Timezone & Availability</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-6">
              Manila, Philippines
            </h3>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 text-center mb-6">
              <div className="text-2xl font-extrabold font-mono text-white tracking-wider">
                {localTime || "12:00:00 PM"}
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-1">UTC +8:00 (PHT)</div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-300">
              <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Available for Global Remote Collaboration</span>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 mt-4 text-[11px] font-mono text-emerald-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Immediate Project Onboarding</span>
          </div>
        </SpotlightCard>

        {/* ========================================================= */}
        {/* CELL 8: Direct Contact & Confetti Action (Full 3-Cols)    */}
        {/* ========================================================= */}
        <SpotlightCard
          id="contact"
          className="md:col-span-2 lg:col-span-3 p-8 sm:p-10"
          spotlightColor="rgba(6, 182, 212, 0.2)"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400">
                <span>Start a Conversation</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                Let’s Build Your Next High-Performance Project
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Whether you need a dedicated Full-Stack developer, an API architecture consultation, or a modern React interface — send a transmission.
              </p>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={handleCopyEmail}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs flex items-center gap-2 border border-white/10 transition-colors"
                >
                  {emailCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{emailCopied ? 'Email Copied!' : profileData.email}</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-7">
              {formSubmitted ? (
                <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-white">Transmission Sent!</h4>
                  <p className="text-sm text-slate-300">
                    Thanks for reaching out! Renelle will reply to your message promptly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Your Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <textarea
                    rows={3}
                    required
                    placeholder="Project details, inquiries, or greetings..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500 resize-none"
                  ></textarea>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-white text-slate-950 hover:bg-slate-200 font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Transmit Message</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </SpotlightCard>
      </div>

      {/* Case Study Architectural Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}
