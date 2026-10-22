import React, { useState, useEffect } from 'react';
import { Star, GitFork, RefreshCw, ExternalLink, Code2, Globe, Radio } from 'lucide-react';
import { Github } from './Icons';
import { fetchGitHubProfile, fetchGitHubRepos } from '../services/githubService';

export default function GitHubLiveFeed() {
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadGitHubData = async () => {
    try {
      const [profileData, reposData] = await Promise.all([
        fetchGitHubProfile(),
        fetchGitHubRepos(),
      ]);
      setProfile(profileData);
      setRepos(reposData);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Failed to load GitHub data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadGitHubData();
  }, []);

  const handleManualRefresh = () => {
    setRefreshing(true);
    // Clear cache to force fresh pull
    localStorage.removeItem('gh_user_renellerobief16-source');
    localStorage.removeItem('gh_repos_renellerobief16-source');
    loadGitHubData();
  };

  const getLanguageColor = (lang) => {
    const colors = {
      JavaScript: 'bg-yellow-400',
      TypeScript: 'bg-blue-500',
      HTML: 'bg-orange-500',
      CSS: 'bg-blue-400',
      Python: 'bg-emerald-400',
      Vue: 'bg-emerald-500',
      React: 'bg-cyan-400',
    };
    return colors[lang] || 'bg-cyan-400';
  };

  return (
    <section id="github-feed" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400 mb-3">
              <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
              <span>Real-Time GitHub REST API</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Live Code Activity & Repositories
            </h2>
            <p className="text-slate-400 mt-2 max-w-xl text-base">
              Synchronized directly with <span className="text-cyan-400 font-medium">@renellerobief16-source</span>. Live public repositories, commit activity, and deployments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-xs font-mono text-slate-500">
                Synced: {lastUpdated}
              </span>
            )}
            <button
              onClick={handleManualRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card text-xs font-mono text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all duration-200"
              title="Refresh Live Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-cyan-400' : ''}`} />
              <span>{refreshing ? 'Syncing...' : 'Sync Live'}</span>
            </button>
          </div>
        </div>

        {/* GitHub Profile Banner Card */}
        {profile && (
          <div className="glass-card p-6 rounded-2xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-white/10 hover:border-cyan-500/30 transition-all duration-300">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <img
                src={profile.avatar_url}
                alt={profile.name || profile.login}
                className="w-16 h-16 rounded-2xl border-2 border-cyan-400/40 shadow-md shadow-cyan-500/20"
              />
              <div>
                <h3 className="text-lg font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                  <span>{profile.name || "Renelle Robie D. Lopez"}</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 border border-white/5">
                    @{profile.login}
                  </span>
                </h3>
                <p className="text-sm text-slate-400 mt-0.5">
                  {profile.bio || "Full-Stack Web Developer passionate about building high quality software."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 sm:gap-8 border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0 sm:pl-8 w-full sm:w-auto justify-around sm:justify-end">
              <div className="text-center">
                <div className="text-xl font-bold font-mono text-cyan-400">{profile.public_repos}</div>
                <div className="text-xs text-slate-400">Repositories</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold font-mono text-violet-400">{profile.followers}</div>
                <div className="text-xs text-slate-400">Followers</div>
              </div>
              <div>
                <a
                  href={profile.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-2 text-xs font-medium border border-white/10 transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>Profile</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Repositories Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-card p-6 rounded-2xl animate-pulse h-48 border-white/5">
                <div className="h-5 bg-slate-800 rounded w-2/3 mb-4"></div>
                <div className="h-4 bg-slate-800/60 rounded w-full mb-2"></div>
                <div className="h-4 bg-slate-800/60 rounded w-4/5 mb-6"></div>
                <div className="flex gap-4">
                  <div className="h-4 bg-slate-800 rounded w-16"></div>
                  <div className="h-4 bg-slate-800 rounded w-12"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.map((repo) => (
              <div
                key={repo.id}
                className="glass-card glass-card-hover p-6 rounded-2xl flex flex-col justify-between border-white/5 relative group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h4 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center gap-2 truncate">
                      <Code2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="truncate">{repo.name}</span>
                    </h4>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {repo.homepage && (
                        <a
                          href={repo.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-colors"
                          title="View Live Site"
                        >
                          <Globe className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <a
                        href={repo.htmlUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 transition-colors"
                        title="View GitHub Repository"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed mb-4">
                    {repo.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${getLanguageColor(repo.language)}`}></span>
                    <span>{repo.language}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 hover:text-amber-400 transition-colors">
                      <Star className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400" />
                      <span>{repo.stars}</span>
                    </div>
                    <div className="flex items-center gap-1 hover:text-cyan-400 transition-colors">
                      <GitFork className="w-3.5 h-3.5 text-slate-400" />
                      <span>{repo.forks}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
