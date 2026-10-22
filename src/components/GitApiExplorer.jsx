import React, { useState } from 'react';
import { FileCode2, Copy, Check, ExternalLink, Play, ChevronRight, Folder, FolderOpen, Terminal, Sparkles, Layers } from 'lucide-react';
import { gitApiFiles } from '../data/gitApiFiles';
import { Github } from './Icons';

export default function GitApiExplorer() {
  const [activeFileId, setActiveFileId] = useState(gitApiFiles[0].id);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState('code'); // 'code' | 'response'
  const [testingStatus, setTestingStatus] = useState(null);

  const activeFile = gitApiFiles.find(f => f.id === activeFileId) || gitApiFiles[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunEndpoint = () => {
    setTestingStatus('executing');
    setTimeout(() => {
      setTestingStatus('success');
      setViewMode('response');
    }, 600);
  };

  const lines = activeFile.code.trim().split('\n');

  return (
    <section id="api-architecture" className="py-24 relative border-t border-white/5 bg-[#080c14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-white/10 text-xs font-mono text-slate-300 mb-3">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Git Repository & API Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Production API Source & Endpoints
            </h2>
            <p className="text-slate-400 mt-2 max-w-2xl text-sm sm:text-base leading-relaxed">
              Explore actual backend controllers, route handlers, and API integration code extracted directly from production repositories.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={activeFile.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-slate-600 text-xs font-mono text-slate-300 hover:text-white transition-colors"
            >
              <Github className="w-4 h-4 text-slate-400" />
              <span>View repo: {activeFile.repoName}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </a>
          </div>
        </div>

        {/* Code Explorer Window */}
        <div className="rounded-2xl border border-white/10 bg-[#0d121d] overflow-hidden shadow-2xl">
          {/* Top Window Bar */}
          <div className="px-4 py-3 bg-[#0a0e17] border-b border-white/5 flex flex-wrap items-center justify-between gap-4">
            {/* macOS Window Controls + Breadcrumb */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-slate-400">
                <span>{activeFile.repoName}</span>
                <ChevronRight className="w-3 h-3 text-slate-600" />
                <span className="text-slate-200">{activeFile.filePath}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode(viewMode === 'code' ? 'response' : 'code')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                  viewMode === 'response'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-800/80 text-slate-300 hover:text-white border border-white/5'
                }`}
              >
                <span>{viewMode === 'code' ? 'Preview JSON Response' : 'Show Source Code'}</span>
              </button>

              <button
                onClick={handleRunEndpoint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-medium transition-colors"
                title="Simulate API Call"
              >
                <Play className="w-3 h-3" />
                <span>{testingStatus === 'executing' ? 'Invoking...' : 'Test Endpoint'}</span>
              </button>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/5 text-xs font-mono transition-colors"
                title="Copy code to clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Main Layout: Sidebar File Tree + Code Editor */}
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[480px]">
            {/* Sidebar File Tree */}
            <div className="md:col-span-4 lg:col-span-3 bg-[#0a0e17]/80 border-b md:border-b-0 md:border-r border-white/5 p-4 flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-3 px-2">
                  Repository Files
                </div>
                <div className="space-y-1">
                  {gitApiFiles.map((file) => {
                    const isActive = file.id === activeFileId;
                    return (
                      <button
                        key={file.id}
                        onClick={() => {
                          setActiveFileId(file.id);
                          setViewMode('code');
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono flex items-center justify-between transition-all ${
                          isActive
                            ? 'bg-slate-800 text-cyan-400 border border-white/10 font-semibold shadow-sm'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileCode2 className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                          <span className="truncate">{file.fileName}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 shrink-0 font-normal ml-2">
                          {file.repoName}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active File Description */}
              <div className="mt-6 pt-4 border-t border-white/5">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Architecture Overview
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {activeFile.description}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/5">
                    Node / Express
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/5">
                    REST API
                  </span>
                </div>
              </div>
            </div>

            {/* Code / Response Content Area */}
            <div className="md:col-span-8 lg:col-span-9 bg-[#0b101b] p-4 sm:p-6 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed select-text">
              {viewMode === 'code' ? (
                <div className="table w-full">
                  {lines.map((line, idx) => (
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
                      <span>HTTP 200 OK — JSON Response</span>
                    </div>
                    <span className="text-slate-500 font-mono">Payload: ~1.2 KB</span>
                  </div>
                  <pre className="text-cyan-300 whitespace-pre overflow-x-auto p-4 rounded-xl bg-[#070b14] border border-white/5">
                    {JSON.stringify(activeFile.responseSample, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
