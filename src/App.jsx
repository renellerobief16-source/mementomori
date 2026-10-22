import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import InteractiveBackground from './components/InteractiveBackground';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileBottomBar from './components/MobileBottomBar';

// Dedicated Separate Pages
import HomePage from './pages/HomePage';
import WebProjectsPage from './pages/WebProjectsPage';
import VideoEditingPage from './pages/VideoEditingPage';
import PostersPage from './pages/PostersPage';
import CertificatesPage from './pages/CertificatesPage';
import ContactPage from './pages/ContactPage';

import { PortfolioProvider } from './context/PortfolioContext';
import AdminPage from './pages/AdminPage';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

// Global Alt + A listener to smoothly toggle the Admin Panel from anywhere
function AdminShortcutListener() {
  const navigate = useNavigate();
  const location = useLocation();
  const previousPathRef = useRef('/');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check for Alt + A (case-insensitive) or Option + A
      if (e.altKey && (e.key === 'a' || e.key === 'A' || e.code === 'KeyA')) {
        const isFocusedInInput = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);

        // If inside admin and focused in an input/textarea, do not interrupt editing
        if (location.pathname === '/admin' && isFocusedInInput) {
          return;
        }

        e.preventDefault();

        if (location.pathname === '/admin') {
          const returnTo = previousPathRef.current || '/';
          setToast('⚡ Alt + A: Returning to portfolio...');
          navigate(returnTo);
        } else {
          previousPathRef.current = location.pathname;
          setToast('⚡ Alt + A: Opening Admin Panel...');
          navigate('/admin');
        }

        setTimeout(() => setToast(null), 2500);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [location.pathname, navigate]);

  if (!toast) return null;

  return (
    <div className="fixed top-24 right-6 z-50 px-4 py-2.5 rounded-2xl bg-slate-900/95 dark:bg-slate-900/95 text-white font-mono text-xs font-bold shadow-2xl border border-cyan-500/40 backdrop-blur-md flex items-center gap-2.5 animate-bounce">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
      </span>
      <span>{toast}</span>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PortfolioProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AdminShortcutListener />
          <div className="relative min-h-screen bg-[#f8fafc] dark:bg-[#070b14] text-slate-900 dark:text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-700 dark:selection:text-cyan-200 transition-colors duration-300">
            {/* Dynamic Background Canvas */}
            <InteractiveBackground />

            {/* Navigation Bar with Theme Switcher & Real Photo */}
            <Navbar />

            {/* Dedicated Page Views */}
            <main className="relative z-10 flex-1 pb-24 lg:pb-0">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/web-projects" element={<WebProjectsPage />} />
                <Route path="/video-editing" element={<VideoEditingPage />} />
                <Route path="/posters" element={<PostersPage />} />
                <Route path="/certificates" element={<CertificatesPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="*" element={<HomePage />} />
              </Routes>
            </main>

            {/* Floating Mobile Bottom Navigation */}
            <MobileBottomBar />

            {/* Footer with Picture & Quick Route Links */}
            <Footer />
          </div>
        </BrowserRouter>
      </PortfolioProvider>
    </ThemeProvider>
  );
}
