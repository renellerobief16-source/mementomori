import React, { createContext, useContext, useState, useEffect } from 'react';
import portfolioSeed from '../data/portfolio.json';
import {
  fetchPortfolioFromSupabase,
  saveProfileToSupabase,
  upsertWebProjectToSupabase,
  deleteWebProjectFromSupabase,
  upsertVideoEditToSupabase,
  deleteVideoEditFromSupabase,
  upsertPosterToSupabase,
  deletePosterFromSupabase,
  upsertCertificateToSupabase,
  deleteCertificateFromSupabase,
} from '../services/supabaseService';
import { isSupabaseConfigured } from '../lib/supabase';

const PortfolioContext = createContext(null);

const DEFAULT_PIN = '201605';

export function PortfolioProvider({ children }) {
  // Cloud database status: 'connected' | 'connecting' | 'local_only' | 'error'
  const [cloudStatus, setCloudStatus] = useState(isSupabaseConfigured ? 'connecting' : 'local_only');
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);

  // Initialize state from localStorage or default portfolio.json seed
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('myportfolio_profile');
      return saved ? JSON.parse(saved) : portfolioSeed.profile;
    } catch {
      return portfolioSeed.profile;
    }
  });

  const [webProjects, setWebProjects] = useState(() => {
    try {
      const saved = localStorage.getItem('myportfolio_web_projects');
      return saved ? JSON.parse(saved) : portfolioSeed.webProjects;
    } catch {
      return portfolioSeed.webProjects;
    }
  });

  const [videoEdits, setVideoEdits] = useState(() => {
    try {
      const saved = localStorage.getItem('myportfolio_video_edits');
      return saved ? JSON.parse(saved) : portfolioSeed.videoEdits;
    } catch {
      return portfolioSeed.videoEdits;
    }
  });

  const [posters, setPosters] = useState(() => {
    try {
      const saved = localStorage.getItem('myportfolio_posters');
      return saved ? JSON.parse(saved) : portfolioSeed.posters;
    } catch {
      return portfolioSeed.posters;
    }
  });

  const [certificates, setCertificates] = useState(() => {
    try {
      const saved = localStorage.getItem('myportfolio_certificates');
      return saved ? JSON.parse(saved) : portfolioSeed.certificates;
    } catch {
      return portfolioSeed.certificates;
    }
  });

  const [adminPin, setAdminPin] = useState(() => {
    try {
      return localStorage.getItem('myportfolio_admin_pin') || DEFAULT_PIN;
    } catch {
      return DEFAULT_PIN;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('myportfolio_auth') === 'true';
  });

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('myportfolio_profile', JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('myportfolio_web_projects', JSON.stringify(webProjects));
    } catch (e) {
      console.error('Failed to save web projects', e);
    }
  }, [webProjects]);

  useEffect(() => {
    try {
      localStorage.setItem('myportfolio_video_edits', JSON.stringify(videoEdits));
    } catch (e) {
      console.error('Failed to save video edits', e);
    }
  }, [videoEdits]);

  useEffect(() => {
    try {
      localStorage.setItem('myportfolio_posters', JSON.stringify(posters));
    } catch (e) {
      console.error('Failed to save posters', e);
    }
  }, [posters]);

  useEffect(() => {
    try {
      localStorage.setItem('myportfolio_certificates', JSON.stringify(certificates));
    } catch (e) {
      console.error('Failed to save certificates', e);
    }
  }, [certificates]);

  useEffect(() => {
    try {
      localStorage.setItem('myportfolio_admin_pin', adminPin);
    } catch (e) {
      console.error('Failed to save pin', e);
    }
  }, [adminPin]);

  // Fetch data from Supabase Cloud on initial load (with fallback to localStorage/seed)
  const syncWithSupabase = async () => {
    if (!isSupabaseConfigured) {
      setCloudStatus('local_only');
      return false;
    }
    setIsCloudSyncing(true);
    try {
      const cloudData = await fetchPortfolioFromSupabase();
      if (cloudData) {
        if (cloudData.profile) setProfile(cloudData.profile);
        if (cloudData.webProjects?.length) setWebProjects(cloudData.webProjects);
        if (cloudData.videoEdits?.length) setVideoEdits(cloudData.videoEdits);
        if (cloudData.posters?.length) setPosters(cloudData.posters);
        if (cloudData.certificates?.length) setCertificates(cloudData.certificates);
        setCloudStatus('connected');
        return true;
      } else {
        setCloudStatus('connected_empty');
        return true;
      }
    } catch (err) {
      console.warn('Could not sync with Supabase cloud database:', err);
      setCloudStatus('error');
      return false;
    } finally {
      setIsCloudSyncing(false);
    }
  };

  useEffect(() => {
    syncWithSupabase();
  }, []);

  // Auth methods
  const login = (enteredPin) => {
    if (enteredPin === adminPin) {
      setIsAuthenticated(true);
      sessionStorage.setItem('myportfolio_auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('myportfolio_auth');
  };

  const changePin = (newPin) => {
    if (newPin && newPin.length >= 4) {
      setAdminPin(newPin);
      return true;
    }
    return false;
  };

  // Profile operations
  const updateProfile = (updatedFields) => {
    setProfile((prev) => {
      const merged = { ...prev, ...updatedFields };
      if (isSupabaseConfigured) {
        saveProfileToSupabase(merged);
      }
      return merged;
    });
  };

  // Web Projects CRUD
  const addWebProject = (project) => {
    const newProject = {
      ...project,
      id: project.id || `project-${Date.now()}`,
      tools: Array.isArray(project.tools)
        ? project.tools
        : (project.tools || '').split(',').map((t) => t.trim()).filter(Boolean),
    };
    setWebProjects((prev) => [newProject, ...prev]);
    if (isSupabaseConfigured) {
      upsertWebProjectToSupabase(newProject);
    }
  };

  const updateWebProject = (id, updatedProject) => {
    setWebProjects((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const merged = {
            ...item,
            ...updatedProject,
            tools: Array.isArray(updatedProject.tools)
              ? updatedProject.tools
              : (updatedProject.tools || '').split(',').map((t) => t.trim()).filter(Boolean),
          };
          if (isSupabaseConfigured) {
            upsertWebProjectToSupabase(merged);
          }
          return merged;
        }
        return item;
      })
    );
  };

  const deleteWebProject = (id) => {
    setWebProjects((prev) => prev.filter((item) => item.id !== id));
    if (isSupabaseConfigured) {
      deleteWebProjectFromSupabase(id);
    }
  };

  // Video Edits CRUD
  const addVideoEdit = (video) => {
    const newVideo = {
      ...video,
      id: video.id || `video-${Date.now()}`,
      software: Array.isArray(video.software)
        ? video.software
        : (video.software || '').split(',').map((s) => s.trim()).filter(Boolean),
    };
    setVideoEdits((prev) => [newVideo, ...prev]);
    if (isSupabaseConfigured) {
      upsertVideoEditToSupabase(newVideo);
    }
  };

  const updateVideoEdit = (id, updatedVideo) => {
    setVideoEdits((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const merged = {
            ...item,
            ...updatedVideo,
            software: Array.isArray(updatedVideo.software)
              ? updatedVideo.software
              : (updatedVideo.software || '').split(',').map((s) => s.trim()).filter(Boolean),
          };
          if (isSupabaseConfigured) {
            upsertVideoEditToSupabase(merged);
          }
          return merged;
        }
        return item;
      })
    );
  };

  const deleteVideoEdit = (id) => {
    setVideoEdits((prev) => prev.filter((item) => item.id !== id));
    if (isSupabaseConfigured) {
      deleteVideoEditFromSupabase(id);
    }
  };

  // Posters CRUD
  const addPoster = (poster) => {
    const newPoster = {
      ...poster,
      id: poster.id || `poster-${Date.now()}`,
      software: Array.isArray(poster.software)
        ? poster.software
        : (poster.software || '').split(',').map((s) => s.trim()).filter(Boolean),
    };
    setPosters((prev) => [newPoster, ...prev]);
    if (isSupabaseConfigured) {
      upsertPosterToSupabase(newPoster);
    }
  };

  const updatePoster = (id, updatedPoster) => {
    setPosters((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const merged = {
            ...item,
            ...updatedPoster,
            software: Array.isArray(updatedPoster.software)
              ? updatedPoster.software
              : (updatedPoster.software || '').split(',').map((s) => s.trim()).filter(Boolean),
          };
          if (isSupabaseConfigured) {
            upsertPosterToSupabase(merged);
          }
          return merged;
        }
        return item;
      })
    );
  };

  const deletePoster = (id) => {
    setPosters((prev) => prev.filter((item) => item.id !== id));
    if (isSupabaseConfigured) {
      deletePosterFromSupabase(id);
    }
  };

  // Certificates CRUD
  const addCertificate = (cert) => {
    const newCert = {
      ...cert,
      id: cert.id || `cert-${Date.now()}`,
      skills: Array.isArray(cert.skills)
        ? cert.skills
        : (cert.skills || '').split(',').map((s) => s.trim()).filter(Boolean),
    };
    setCertificates((prev) => [newCert, ...prev]);
    if (isSupabaseConfigured) {
      upsertCertificateToSupabase(newCert);
    }
  };

  const updateCertificate = (id, updatedCert) => {
    setCertificates((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const merged = {
            ...item,
            ...updatedCert,
            skills: Array.isArray(updatedCert.skills)
              ? updatedCert.skills
              : (updatedCert.skills || '').split(',').map((s) => s.trim()).filter(Boolean),
          };
          if (isSupabaseConfigured) {
            upsertCertificateToSupabase(merged);
          }
          return merged;
        }
        return item;
      })
    );
  };

  const deleteCertificate = (id) => {
    setCertificates((prev) => prev.filter((item) => item.id !== id));
    if (isSupabaseConfigured) {
      deleteCertificateFromSupabase(id);
    }
  };

  // Get full portfolio data object matching portfolio.json schema
  const getFullPortfolioObject = () => {
    return {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      profile,
      webProjects,
      videoEdits,
      posters,
      certificates,
    };
  };

  const getFullPortfolioJSON = () => {
    return JSON.stringify(getFullPortfolioObject(), null, 2);
  };

  const downloadPortfolioJSON = () => {
    const jsonStr = getFullPortfolioJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const applyRawJSON = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.profile) setProfile(parsed.profile);
      if (Array.isArray(parsed.webProjects)) setWebProjects(parsed.webProjects);
      if (Array.isArray(parsed.videoEdits)) setVideoEdits(parsed.videoEdits);
      if (Array.isArray(parsed.posters)) setPosters(parsed.posters);
      if (Array.isArray(parsed.certificates)) setCertificates(parsed.certificates);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const syncWithGitSeed = () => {
    if (portfolioSeed) {
      if (portfolioSeed.profile) setProfile(portfolioSeed.profile);
      if (Array.isArray(portfolioSeed.webProjects)) setWebProjects(portfolioSeed.webProjects);
      if (Array.isArray(portfolioSeed.videoEdits)) setVideoEdits(portfolioSeed.videoEdits);
      if (Array.isArray(portfolioSeed.posters)) setPosters(portfolioSeed.posters);
      if (Array.isArray(portfolioSeed.certificates)) setCertificates(portfolioSeed.certificates);
      return true;
    }
    return false;
  };

  // Data Export, Import & Reset
  const exportData = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      profile,
      webProjects,
      videoEdits,
      posters,
      certificates,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `renelle-portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.profile) setProfile(data.profile);
      if (Array.isArray(data.webProjects)) setWebProjects(data.webProjects);
      if (Array.isArray(data.videoEdits)) setVideoEdits(data.videoEdits);
      if (Array.isArray(data.posters)) setPosters(data.posters);
      if (Array.isArray(data.certificates)) setCertificates(data.certificates);
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  };

  const resetToDefaults = () => {
    setProfile(portfolioSeed.profile);
    setWebProjects(portfolioSeed.webProjects);
    setVideoEdits(portfolioSeed.videoEdits);
    setPosters(portfolioSeed.posters);
    setCertificates(portfolioSeed.certificates);
    setAdminPin(DEFAULT_PIN);
    localStorage.removeItem('myportfolio_profile');
    localStorage.removeItem('myportfolio_web_projects');
    localStorage.removeItem('myportfolio_video_edits');
    localStorage.removeItem('myportfolio_posters');
    localStorage.removeItem('myportfolio_certificates');
    localStorage.removeItem('myportfolio_admin_pin');
  };

  return (
    <PortfolioContext.Provider
      value={{
        profile,
        webProjects,
        videoEdits,
        posters,
        certificates,
        adminPin,
        isAuthenticated,
        login,
        logout,
        changePin,
        updateProfile,
        addWebProject,
        updateWebProject,
        deleteWebProject,
        addVideoEdit,
        updateVideoEdit,
        deleteVideoEdit,
        addPoster,
        updatePoster,
        deletePoster,
        addCertificate,
        updateCertificate,
        deleteCertificate,
        exportData,
        importData,
        resetToDefaults,
        getFullPortfolioObject,
        getFullPortfolioJSON,
        downloadPortfolioJSON,
        applyRawJSON,
        syncWithGitSeed,
        // Supabase Cloud State & Methods
        isCloudConfigured,
        isCloudConnected: cloudStatus === 'connected',
        cloudStatus,
        isCloudSyncing,
        syncWithSupabase,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
