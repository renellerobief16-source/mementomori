import React, { createContext, useContext, useState, useEffect } from 'react';
import { creativePortfolioData } from '../data/creativePortfolioData';

const PortfolioContext = createContext(null);

const DEFAULT_PIN = '201605';

export function PortfolioProvider({ children }) {
  // Initialize state from localStorage or default seed data
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('myportfolio_profile');
      return saved ? JSON.parse(saved) : creativePortfolioData.profile;
    } catch {
      return creativePortfolioData.profile;
    }
  });

  const [webProjects, setWebProjects] = useState(() => {
    try {
      const saved = localStorage.getItem('myportfolio_web_projects');
      return saved ? JSON.parse(saved) : creativePortfolioData.webProjects;
    } catch {
      return creativePortfolioData.webProjects;
    }
  });

  const [videoEdits, setVideoEdits] = useState(() => {
    try {
      const saved = localStorage.getItem('myportfolio_video_edits');
      return saved ? JSON.parse(saved) : creativePortfolioData.videoEdits;
    } catch {
      return creativePortfolioData.videoEdits;
    }
  });

  const [posters, setPosters] = useState(() => {
    try {
      const saved = localStorage.getItem('myportfolio_posters');
      return saved ? JSON.parse(saved) : creativePortfolioData.posters;
    } catch {
      return creativePortfolioData.posters;
    }
  });

  const [certificates, setCertificates] = useState(() => {
    try {
      const saved = localStorage.getItem('myportfolio_certificates');
      return saved ? JSON.parse(saved) : creativePortfolioData.certificates;
    } catch {
      return creativePortfolioData.certificates;
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
    setProfile((prev) => ({ ...prev, ...updatedFields }));
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
  };

  const updateWebProject = (id, updatedProject) => {
    setWebProjects((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updatedProject,
              tools: Array.isArray(updatedProject.tools)
                ? updatedProject.tools
                : (updatedProject.tools || '').split(',').map((t) => t.trim()).filter(Boolean),
            }
          : item
      )
    );
  };

  const deleteWebProject = (id) => {
    setWebProjects((prev) => prev.filter((item) => item.id !== id));
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
  };

  const updateVideoEdit = (id, updatedVideo) => {
    setVideoEdits((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updatedVideo,
              software: Array.isArray(updatedVideo.software)
                ? updatedVideo.software
                : (updatedVideo.software || '').split(',').map((s) => s.trim()).filter(Boolean),
            }
          : item
      )
    );
  };

  const deleteVideoEdit = (id) => {
    setVideoEdits((prev) => prev.filter((item) => item.id !== id));
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
  };

  const updatePoster = (id, updatedPoster) => {
    setPosters((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updatedPoster,
              software: Array.isArray(updatedPoster.software)
                ? updatedPoster.software
                : (updatedPoster.software || '').split(',').map((s) => s.trim()).filter(Boolean),
            }
          : item
      )
    );
  };

  const deletePoster = (id) => {
    setPosters((prev) => prev.filter((item) => item.id !== id));
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
  };

  const updateCertificate = (id, updatedCert) => {
    setCertificates((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updatedCert,
              skills: Array.isArray(updatedCert.skills)
                ? updatedCert.skills
                : (updatedCert.skills || '').split(',').map((s) => s.trim()).filter(Boolean),
            }
          : item
      )
    );
  };

  const deleteCertificate = (id) => {
    setCertificates((prev) => prev.filter((item) => item.id !== id));
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
    setProfile(creativePortfolioData.profile);
    setWebProjects(creativePortfolioData.webProjects);
    setVideoEdits(creativePortfolioData.videoEdits);
    setPosters(creativePortfolioData.posters);
    setCertificates(creativePortfolioData.certificates);
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
