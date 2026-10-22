import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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

export default function App() {
  return (
    <ThemeProvider>
      <PortfolioProvider>
        <BrowserRouter>
          <ScrollToTop />
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
