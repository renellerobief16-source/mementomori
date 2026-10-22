import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  ArrowLeft,
  ExternalLink,
  Upload,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Film,
  Palette,
  Award,
  User,
  Settings,
  Check,
  Eye,
  EyeOff,
  AlertOctagon,
  Loader2,
  Video,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import confetti from 'canvas-confetti';
import SmartVideoPlayer from '../components/SmartVideoPlayer';
import {
  saveVideoBlob,
  generateThumbnailFromVideo,
  getVideoDuration,
  deleteVideoBlob,
} from '../utils/videoStorage';

const DELETE_SECURITY_PASSWORD = 'mementomori637';

export default function AdminPage() {
  const {
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
  } = usePortfolio();

  // PIN entry state
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [toastMessage, setToastMessage] = useState(null);

  // Modal / Editing states
  const [editingItem, setEditingItem] = useState(null); // { type: 'web'|'video'|'poster'|'cert', data: {...}, isNew: bool }
  const [changePinModalOpen, setChangePinModalOpen] = useState(false);
  const [newPinInput, setNewPinInput] = useState('');
  const [uploadingVideo, setUploadingVideo] = useState(false);

  // Smooth Delete Confirmation State (Protected by "mementomori637")
  const [itemToDelete, setItemToDelete] = useState(null); // { type: 'web'|'video'|'poster'|'cert'|'reset', id: string, title: string }
  const [deletePassword, setDeletePassword] = useState('');
  const [deletePasswordError, setDeletePasswordError] = useState(false);
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Profile Form Local State
  const [profileForm, setProfileForm] = useState(profile);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handle PIN input
  const handlePinDigit = (digit) => {
    if (pinInput.length < 6) {
      const nextPin = pinInput + digit;
      setPinInput(nextPin);
      setPinError(false);
      if (nextPin.length === 6) {
        verifyPin(nextPin);
      }
    }
  };

  const handlePinBackspace = () => {
    setPinInput((prev) => prev.slice(0, -1));
    setPinError(false);
  };

  const handlePinClear = () => {
    setPinInput('');
    setPinError(false);
  };

  const verifyPin = (pinToTest) => {
    const success = login(pinToTest);
    if (!success) {
      setPinError(true);
      setTimeout(() => setPinInput(''), 600);
    } else {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }
  };

  // Keyboard support for PIN entry
  const handleKeyDown = (e) => {
    if (!isAuthenticated) {
      if (/^[0-9]$/.test(e.key)) {
        handlePinDigit(e.key);
      } else if (e.key === 'Backspace') {
        handlePinBackspace();
      } else if (e.key === 'Escape') {
        handlePinClear();
      }
    }
  };

  // Save profile
  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile(profileForm);
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
    showToast('Profile information successfully saved!');
  };

  // File upload helper (converts local file to base64 Data URL)
  const handleFileUpload = (e, callback) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size is larger than 5MB. Please choose a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        callback(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Video upload helper (stores file in IndexedDB, auto-extracts duration and thumbnail)
  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    try {
      const videoId = editingItem?.data?.id || `video-${Date.now()}`;

      // 1. Save full video file to IndexedDB
      const videoUri = await saveVideoBlob(videoId, file);

      // 2. Extract Duration automatically
      const duration = await getVideoDuration(file);

      // 3. Auto-generate video frame thumbnail from 1s mark
      let thumb = editingItem?.data?.thumbnail;
      try {
        thumb = await generateThumbnailFromVideo(file, 1);
      } catch (err) {
        console.warn('Could not auto-generate thumbnail from video', err);
      }

      setEditingItem((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          id: videoId,
          previewVideo: videoUri,
          duration: duration || prev.data.duration || '0:30',
          thumbnail: thumb || prev.data.thumbnail,
          title: prev.data.title || file.name.replace(/\.[^/.]+$/, ''),
        },
      }));

      showToast('Video successfully uploaded to IndexedDB storage!');
    } catch (err) {
      console.error('Video upload failed', err);
      alert('Failed to process video file. Please ensure it is an MP4, WebM, or MOV video.');
    } finally {
      setUploadingVideo(false);
    }
  };

  // ==========================================
  // SECURE DELETE HANDLER ("mementomori637")
  // ==========================================
  const handleConfirmDelete = (e) => {
    if (e) e.preventDefault();
    if (!itemToDelete) return;

    if (deletePassword !== DELETE_SECURITY_PASSWORD) {
      setDeletePasswordError(true);
      return;
    }

    setIsDeleting(true);

    // Smooth execution
    setTimeout(() => {
      const { type, id, title } = itemToDelete;

      if (type === 'web') {
        deleteWebProject(id);
      } else if (type === 'video') {
        deleteVideoEdit(id);
        deleteVideoBlob(id).catch(() => {});
      } else if (type === 'poster') {
        deletePoster(id);
      } else if (type === 'cert') {
        deleteCertificate(id);
      } else if (type === 'reset') {
        resetToDefaults();
      }

      showToast(
        type === 'reset'
          ? 'Portfolio reset to original factory defaults.'
          : `"${title}" has been successfully deleted.`
      );

      setIsDeleting(false);
      setItemToDelete(null);
      setDeletePassword('');
      setDeletePasswordError(false);
      setShowDeletePassword(false);
    }, 250);
  };

  const handleCancelDelete = () => {
    setItemToDelete(null);
    setDeletePassword('');
    setDeletePasswordError(false);
    setShowDeletePassword(false);
    setIsDeleting(false);
  };

  // ==========================================
  // VIEW: PIN AUTHENTICATION SCREEN
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div
        className="min-h-[85vh] flex items-center justify-center px-4 py-20"
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <div className="w-full max-w-md glass-card rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-white/10 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Admin & CMS Access
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Enter your 6-digit security PIN to manage your portfolio
            </p>
          </div>

          {/* PIN Indicators (6 dots) */}
          <div
            className={`flex items-center justify-center gap-3 py-3 ${
              pinError ? 'animate-shake' : ''
            }`}
          >
            {[0, 1, 2, 3, 4, 5].map((index) => {
              const isFilled = pinInput.length > index;
              return (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-full transition-all duration-200 ${
                    pinError
                      ? 'bg-rose-500 scale-110 shadow-lg shadow-rose-500/50'
                      : isFilled
                      ? 'bg-cyan-500 scale-110 shadow-md shadow-cyan-500/50'
                      : 'bg-slate-200 dark:bg-white/15'
                  }`}
                />
              );
            })}
          </div>

          {pinError && (
            <p className="text-xs font-mono text-rose-500 flex items-center justify-center gap-1.5 animate-fadeIn">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Incorrect PIN. Please try again.</span>
            </p>
          )}

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-3 pt-2 max-w-[280px] mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handlePinDigit(digit)}
                className="h-14 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/90 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-mono text-xl font-bold border border-slate-200 dark:border-white/10 active:scale-95 transition-all shadow-sm"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={handlePinClear}
              className="h-14 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/40 dark:hover:bg-slate-800 text-slate-500 font-mono text-xs uppercase font-bold border border-slate-200 dark:border-white/10 active:scale-95 transition-all"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => handlePinDigit('0')}
              className="h-14 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/90 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-mono text-xl font-bold border border-slate-200 dark:border-white/10 active:scale-95 transition-all shadow-sm"
            >
              0
            </button>
            <button
              type="button"
              onClick={handlePinBackspace}
              className="h-14 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/40 dark:hover:bg-slate-800 text-slate-500 font-mono text-sm uppercase font-bold border border-slate-200 dark:border-white/10 active:scale-95 transition-all flex items-center justify-center"
            >
              ⌫
            </button>
          </div>

          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-cyan-500 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Portfolio</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: AUTHENTICATED ADMIN DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-emerald-500 text-white font-medium text-sm shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Actions */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Portfolio CMS & Manager
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold">
                Unlocked
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Editing profile and managing Web, Videos, Posters, and Certificates
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
          <Link
            to="/"
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/10 text-xs font-mono font-medium transition-all flex items-center justify-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Site</span>
          </Link>

          <button
            onClick={() => setChangePinModalOpen(true)}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/10 text-xs font-mono font-medium transition-all flex items-center justify-center gap-1.5"
          >
            <KeyRound className="w-3.5 h-3.5 text-cyan-500" />
            <span>Change PIN</span>
          </button>

          <button
            onClick={logout}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock & Exit</span>
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-none">
        {[
          { id: 'profile', label: 'Profile & Socials', icon: User, count: null },
          { id: 'web', label: 'Web Projects', icon: Globe, count: webProjects.length },
          { id: 'videos', label: 'Video Editing', icon: Film, count: videoEdits.length },
          { id: 'posters', label: 'Posters & Graphics', icon: Palette, count: posters.length },
          { id: 'certificates', label: 'Certificates', icon: Award, count: certificates.length },
          { id: 'settings', label: 'Backup & Reset', icon: Settings, count: null },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                isActive
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-md scale-105'
                  : 'bg-slate-100 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    isActive
                      ? 'bg-cyan-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ==========================================
          TAB 1: PROFILE & SOCIALS
      ========================================== */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-6 animate-fadeIn">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  General Profile Info
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Visible in Hero, Navigation, and Footer
                </p>
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-mono font-bold transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/25 active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-600 dark:text-slate-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileForm.name || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-600 dark:text-slate-300 mb-1.5">
                  Headline / Title
                </label>
                <input
                  type="text"
                  value={profileForm.title || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-600 dark:text-slate-300 mb-1.5">
                  Primary Email
                </label>
                <input
                  type="email"
                  value={profileForm.email || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-600 dark:text-slate-300 mb-1.5">
                  Availability / Work Status
                </label>
                <input
                  type="text"
                  value={profileForm.status || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, status: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-slate-600 dark:text-slate-300 mb-1.5">
                  Bio / Introduction
                </label>
                <textarea
                  rows={3}
                  value={profileForm.bio || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Social & Professional Links */}
            <div className="border-t border-slate-200 dark:border-white/10 pt-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
                Social & Professional Profiles
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-600 dark:text-slate-300 mb-1">
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    value={profileForm.facebookUrl || ''}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, facebookUrl: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-600 dark:text-slate-300 mb-1">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    value={profileForm.instagramUrl || ''}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, instagramUrl: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-600 dark:text-slate-300 mb-1">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    value={profileForm.linkedinUrl || ''}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, linkedinUrl: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-600 dark:text-slate-300 mb-1">
                    OnlineJobs.ph Profile URL
                  </label>
                  <input
                    type="url"
                    value={profileForm.onlinejobsUrl || ''}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, onlinejobsUrl: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-slate-600 dark:text-slate-300 mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={profileForm.githubUrl || ''}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, githubUrl: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* ==========================================
          TAB 2: WEB PROJECTS CRUD
      ========================================== */}
      {activeTab === 'web' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Web & Software Projects ({webProjects.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage your deployed web applications and GitHub repositories
              </p>
            </div>
            <button
              onClick={() =>
                setEditingItem({
                  type: 'web',
                  isNew: true,
                  data: {
                    title: '',
                    category: 'Full-Stack Web App',
                    description: '',
                    image: '',
                    liveUrl: '',
                    githubUrl: '',
                    tools: 'React, JavaScript, Tailwind CSS',
                    badge: 'Live Deployed',
                  },
                })
              }
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-mono font-bold transition-all flex items-center gap-2 shadow-md shadow-cyan-500/20 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Web Project</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {webProjects.map((project) => (
              <div
                key={project.id}
                className="glass-card rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col justify-between p-4 group"
              >
                <div className="space-y-3">
                  <div className="aspect-video rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 relative">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-mono text-cyan-400 border border-white/10">
                      {project.badge || project.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-1">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {(Array.isArray(project.tools)
                      ? project.tools
                      : (project.tools || '').split(',')
                    ).map((tool, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 text-[10px] font-mono text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5"
                      >
                        {typeof tool === 'string' ? tool.trim() : tool}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200 dark:border-white/10 pt-3 mt-4">
                  <div className="flex items-center gap-2">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-cyan-500"
                        title="View Live"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setEditingItem({
                          type: 'web',
                          isNew: false,
                          data: {
                            ...project,
                            tools: Array.isArray(project.tools)
                              ? project.tools.join(', ')
                              : project.tools,
                          },
                        })
                      }
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-mono font-medium flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() =>
                        setItemToDelete({
                          type: 'web',
                          id: project.id,
                          title: project.title,
                        })
                      }
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors"
                      title="Delete Project (Requires Password)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 3: VIDEO EDITING CRUD
      ========================================== */}
      {activeTab === 'videos' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Video Editing Projects ({videoEdits.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage video reels, YouTube embeds, and MP4 previews
              </p>
            </div>
            <button
              onClick={() =>
                setEditingItem({
                  type: 'video',
                  isNew: true,
                  data: {
                    title: '',
                    category: 'Commercial & Promo',
                    duration: '0:45',
                    software: 'Premiere Pro, After Effects',
                    description: '',
                    thumbnail: '',
                    previewVideo: '',
                    highlight: 'Speed ramping & Sound design',
                  },
                })
              }
              className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-mono font-bold transition-all flex items-center gap-2 shadow-md shadow-violet-600/20 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Video Project</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoEdits.map((video) => (
              <div
                key={video.id}
                className="glass-card rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col justify-between p-4 group"
              >
                <div className="space-y-3">
                  <div className="aspect-video rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 relative">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-mono text-violet-400 border border-white/10">
                      {video.duration}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {video.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-1">
                      {video.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200 dark:border-white/10 pt-3 mt-4">
                  <span className="text-[11px] font-mono text-slate-500">{video.category}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setEditingItem({
                          type: 'video',
                          isNew: false,
                          data: {
                            ...video,
                            software: Array.isArray(video.software)
                              ? video.software.join(', ')
                              : video.software,
                          },
                        })
                      }
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-mono font-medium flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() =>
                        setItemToDelete({
                          type: 'video',
                          id: video.id,
                          title: video.title,
                        })
                      }
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors"
                      title="Delete Video (Requires Password)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 4: POSTERS & GRAPHIC DESIGN CRUD
      ========================================== */}
      {activeTab === 'posters' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Graphic Design & Posters ({posters.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage promotional posters, artworks, and social media flyers
              </p>
            </div>
            <button
              onClick={() =>
                setEditingItem({
                  type: 'poster',
                  isNew: true,
                  data: {
                    title: '',
                    category: 'Event Poster',
                    software: 'Photoshop, Illustrator',
                    description: '',
                    image: '',
                    dimensions: 'A3 • 300 DPI Print Ready',
                    aspect: '3:4',
                  },
                })
              }
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold transition-all flex items-center gap-2 shadow-md shadow-emerald-600/20 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Poster</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {posters.map((poster) => (
              <div
                key={poster.id}
                className="glass-card rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col justify-between p-3 group"
              >
                <div className="space-y-2">
                  <div className="aspect-[3/4] rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 relative">
                    <img
                      src={poster.image}
                      alt={poster.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm truncate">
                      {poster.title}
                    </h3>
                    <p className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 truncate">
                      {poster.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200 dark:border-white/10 pt-2.5 mt-3">
                  <button
                    onClick={() =>
                      setEditingItem({
                        type: 'poster',
                        isNew: false,
                        data: {
                          ...poster,
                          software: Array.isArray(poster.software)
                            ? poster.software.join(', ')
                            : poster.software,
                        },
                      })
                    }
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-mono flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() =>
                      setItemToDelete({
                        type: 'poster',
                        id: poster.id,
                        title: poster.title,
                      })
                    }
                    className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors"
                    title="Delete Poster (Requires Password)"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 5: CERTIFICATES CRUD
      ========================================== */}
      {activeTab === 'certificates' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Certificates & Credentials ({certificates.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage diplomas, course completions, and verified licenses
              </p>
            </div>
            <button
              onClick={() =>
                setEditingItem({
                  type: 'cert',
                  isNew: true,
                  data: {
                    title: '',
                    issuer: '',
                    issueDate: new Date().getFullYear().toString(),
                    credentialId: '',
                    category: 'Software Engineering',
                    skills: 'React, JavaScript, Web Development',
                    description: '',
                    image: '',
                    badge: 'Verified Certificate',
                  },
                })
              }
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-mono font-bold transition-all flex items-center gap-2 shadow-md shadow-amber-500/20 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Certificate</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="glass-card rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col justify-between p-4 group"
              >
                <div className="space-y-3">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 relative">
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-mono text-amber-400 border border-white/10">
                      {cert.issueDate}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {cert.title}
                    </h3>
                    <p className="text-xs text-cyan-600 dark:text-cyan-400 font-medium">
                      {cert.issuer}
                    </p>
                    <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                      ID: {cert.credentialId || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200 dark:border-white/10 pt-3 mt-4">
                  <span className="text-[10px] font-mono text-slate-500">{cert.category}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setEditingItem({
                          type: 'cert',
                          isNew: false,
                          data: {
                            ...cert,
                            skills: Array.isArray(cert.skills)
                              ? cert.skills.join(', ')
                              : cert.skills,
                          },
                        })
                      }
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-mono font-medium flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() =>
                        setItemToDelete({
                          type: 'cert',
                          id: cert.id,
                          title: cert.title,
                        })
                      }
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors"
                      title="Delete Certificate (Requires Password)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 6: SETTINGS & BACKUP
      ========================================== */}
      {activeTab === 'settings' && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 space-y-8 animate-fadeIn max-w-3xl">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Backup, Export & PIN Settings
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Download your full portfolio content or import past backups
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Export Portfolio Data
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Download a JSON file containing all your profile info, projects, videos, posters, and certificates.
                </p>
              </div>
              <button
                onClick={exportData}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 text-xs font-mono font-bold flex items-center gap-2 active:scale-95 transition-all whitespace-nowrap"
              >
                <Download className="w-4 h-4" />
                <span>Export JSON</span>
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Import / Restore from Backup
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Select a previously downloaded JSON file to restore your portfolio data.
                </p>
              </div>
              <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-mono font-bold flex items-center gap-2 active:scale-95 transition-all whitespace-nowrap">
                <Upload className="w-4 h-4" />
                <span>Choose Backup JSON</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const success = importData(event.target.result);
                        if (success) {
                          showToast('Data imported successfully!');
                          setProfileForm(profile);
                        } else {
                          alert('Invalid JSON file format.');
                        }
                      };
                      reader.readAsText(file);
                    }
                  }}
                />
              </label>
            </div>

            <div className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4" />
                  <span>Reset to Factory Defaults</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Revert all changes back to the original starting portfolio code. Requires master password.
                </p>
              </div>
              <button
                onClick={() =>
                  setItemToDelete({
                    type: 'reset',
                    id: 'all',
                    title: 'Entire Portfolio Data & Customizations',
                  })
                }
                className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-mono font-bold flex items-center gap-2 active:scale-95 transition-all whitespace-nowrap"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Everything</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: EDIT OR ADD ITEM (WEB / VIDEO / POSTER / CERT)
      ========================================== */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="glass-card w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingItem.isNew ? 'Add New' : 'Edit'}{' '}
                {editingItem.type === 'web'
                  ? 'Web Project'
                  : editingItem.type === 'video'
                  ? 'Video Project'
                  : editingItem.type === 'poster'
                  ? 'Poster / Artwork'
                  : 'Certificate'}
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-600 dark:text-slate-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editingItem.data.title || ''}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      data: { ...editingItem.data, title: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  placeholder="Enter title"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-600 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={editingItem.data.category || ''}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, category: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {editingItem.type === 'video' ? (
                  <div>
                    <label className="block text-xs font-mono text-slate-600 dark:text-slate-300 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={editingItem.data.duration || ''}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, duration: e.target.value },
                        })
                      }
                      placeholder="e.g. 0:45"
                      className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                ) : editingItem.type === 'poster' ? (
                  <div>
                    <label className="block text-xs font-mono text-slate-600 dark:text-slate-300 mb-1">
                      Dimensions
                    </label>
                    <input
                      type="text"
                      value={editingItem.data.dimensions || ''}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, dimensions: e.target.value },
                        })
                      }
                      placeholder="e.g. A3 • 300 DPI"
                      className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                ) : editingItem.type === 'cert' ? (
                  <div>
                    <label className="block text-xs font-mono text-slate-600 dark:text-slate-300 mb-1">
                      Issuer
                    </label>
                    <input
                      type="text"
                      value={editingItem.data.issuer || ''}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, issuer: e.target.value },
                        })
                      }
                      placeholder="e.g. Meta, FreeCodeCamp"
                      className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-mono text-slate-600 dark:text-slate-300 mb-1">
                      Badge
                    </label>
                    <input
                      type="text"
                      value={editingItem.data.badge || ''}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, badge: e.target.value },
                        })
                      }
                      placeholder="e.g. Live Deployed"
                      className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                )}
              </div>

              {/* Media URL + File Upload Hybrid */}
              <div>
                <label className="block text-xs font-mono text-slate-600 dark:text-slate-300 mb-1">
                  {editingItem.type === 'video' ? 'Thumbnail Image URL' : 'Image URL or Upload'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={
                      editingItem.type === 'video'
                        ? editingItem.data.thumbnail || ''
                        : editingItem.data.image || ''
                    }
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        data: {
                          ...editingItem.data,
                          [editingItem.type === 'video' ? 'thumbnail' : 'image']: e.target.value,
                        },
                      })
                    }
                    placeholder="https://... or upload below"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                  <label className="cursor-pointer px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/10 text-xs font-mono flex items-center gap-1.5 whitespace-nowrap">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload File</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(e, (dataUrl) => {
                          setEditingItem({
                            ...editingItem,
                            data: {
                              ...editingItem.data,
                              [editingItem.type === 'video' ? 'thumbnail' : 'image']: dataUrl,
                            },
                          });
                        })
                      }
                    />
                  </label>
                </div>
              </div>

              {/* Type specific extra fields */}
              {editingItem.type === 'web' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-600 dark:text-slate-300 mb-1">
                      Live Website URL
                    </label>
                    <input
                      type="url"
                      value={editingItem.data.liveUrl || ''}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, liveUrl: e.target.value },
                        })
                      }
                      placeholder="https://..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-600 dark:text-slate-300 mb-1">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={editingItem.data.githubUrl || ''}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, githubUrl: e.target.value },
                        })
                      }
                      placeholder="https://github.com/..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {editingItem.type === 'video' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-600 dark:text-slate-300 mb-1 flex items-center justify-between">
                      <span>Video Source (File Upload or Web Link)</span>
                      {uploadingVideo && (
                        <span className="text-[11px] font-mono text-violet-500 flex items-center gap-1 font-semibold">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving video to IndexedDB...
                        </span>
                      )}
                    </label>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editingItem.data.previewVideo || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, previewVideo: e.target.value },
                          })
                        }
                        placeholder="Paste YouTube, Vimeo, or direct MP4 link..."
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-violet-500"
                      />

                      <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-mono font-bold flex items-center gap-1.5 whitespace-nowrap active:scale-95 transition-all shadow-md shadow-violet-600/20">
                        <Upload className="w-4 h-4" />
                        <span>Upload Video File</span>
                        <input
                          type="file"
                          accept="video/mp4,video/webm,video/quicktime,video/ogg"
                          className="hidden"
                          onChange={handleVideoUpload}
                        />
                      </label>
                    </div>

                    <p className="text-[11px] font-mono text-slate-400 mt-1">
                      💡 Supports direct MP4/WebM files (auto-saves to IndexedDB without size limits + generates thumbnail) or YouTube/Vimeo links.
                    </p>
                  </div>

                  {/* Live Video Preview Box */}
                  {editingItem.data.previewVideo && (
                    <div className="space-y-1">
                      <span className="text-[11px] font-mono text-slate-400 block">
                        Live Video Player Preview:
                      </span>
                      <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-black aspect-video relative shadow-inner">
                        <SmartVideoPlayer
                          src={editingItem.data.previewVideo}
                          poster={editingItem.data.thumbnail}
                          controls={true}
                          autoPlay={false}
                          title={editingItem.data.title || 'Video Preview'}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tags / Software / Skills comma-separated */}
              <div>
                <label className="block text-xs font-mono text-slate-600 dark:text-slate-300 mb-1">
                  {editingItem.type === 'web'
                    ? 'Technologies & Tools (comma-separated)'
                    : editingItem.type === 'video' || editingItem.type === 'poster'
                    ? 'Software Used (comma-separated)'
                    : 'Skills & Competencies (comma-separated)'}
                </label>
                <input
                  type="text"
                  value={
                    editingItem.type === 'web'
                      ? editingItem.data.tools || ''
                      : editingItem.type === 'video' || editingItem.type === 'poster'
                      ? editingItem.data.software || ''
                      : editingItem.data.skills || ''
                  }
                  onChange={(e) => {
                    const key =
                      editingItem.type === 'web'
                        ? 'tools'
                        : editingItem.type === 'video' || editingItem.type === 'poster'
                        ? 'software'
                        : 'skills';
                    setEditingItem({
                      ...editingItem,
                      data: { ...editingItem.data, [key]: e.target.value },
                    });
                  }}
                  placeholder="e.g. React, JavaScript, Node.js"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-600 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingItem.data.description || ''}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      data: { ...editingItem.data, description: e.target.value },
                    })
                  }
                  placeholder="Project details and highlights"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-200 dark:border-white/10 pt-4">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!editingItem.data.title) {
                    alert('Please enter a title');
                    return;
                  }

                  if (editingItem.type === 'web') {
                    if (editingItem.isNew) addWebProject(editingItem.data);
                    else updateWebProject(editingItem.data.id, editingItem.data);
                  } else if (editingItem.type === 'video') {
                    if (editingItem.isNew) addVideoEdit(editingItem.data);
                    else updateVideoEdit(editingItem.data.id, editingItem.data);
                  } else if (editingItem.type === 'poster') {
                    if (editingItem.isNew) addPoster(editingItem.data);
                    else updatePoster(editingItem.data.id, editingItem.data);
                  } else if (editingItem.type === 'cert') {
                    if (editingItem.isNew) addCertificate(editingItem.data);
                    else updateCertificate(editingItem.data.id, editingItem.data);
                  }

                  showToast('Saved successfully!');
                  setEditingItem(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>Save Item</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: CHANGE PIN
      ========================================== */}
      {changePinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="glass-card w-full max-w-sm rounded-3xl p-6 border border-slate-200 dark:border-white/10 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-cyan-500" />
              <span>Change Admin PIN</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter a new 4 to 6 digit security PIN:
            </p>
            <input
              type="password"
              maxLength={6}
              value={newPinInput}
              onChange={(e) => setNewPinInput(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="e.g. 201605"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 text-center text-lg font-mono tracking-widest text-slate-900 dark:text-white"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setChangePinModalOpen(false);
                  setNewPinInput('');
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newPinInput.length >= 4) {
                    changePin(newPinInput);
                    showToast('PIN successfully updated!');
                    setChangePinModalOpen(false);
                    setNewPinInput('');
                  } else {
                    alert('PIN must be at least 4 digits');
                  }
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-mono font-bold"
              >
                Save New PIN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: SMOOTH SECURITY DELETION CONFIRMATION ("mementomori637")
      ========================================================================= */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <form
            onSubmit={handleConfirmDelete}
            className={`glass-card w-full max-w-md rounded-3xl p-6 sm:p-8 border border-rose-500/30 dark:border-rose-500/40 space-y-6 shadow-2xl relative overflow-hidden transition-all duration-300 ${
              deletePasswordError ? 'animate-shake' : ''
            }`}
          >
            {/* Top red ambient glow */}
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shrink-0 shadow-inner">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Confirm Deletion
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  You are about to permanently delete{' '}
                  <span className="font-bold text-rose-600 dark:text-rose-400">
                    "{itemToDelete.title}"
                  </span>
                  . This action cannot be reversed.
                </p>
              </div>
            </div>

            {/* Password input box */}
            <div className="space-y-2 p-4 rounded-2xl bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/20">
              <label className="block text-xs font-mono text-slate-700 dark:text-slate-200 font-semibold flex items-center justify-between">
                <span>Security Master Password</span>
                <span className="text-[10px] text-slate-400 font-normal">Required</span>
              </label>

              <div className="relative">
                <input
                  type={showDeletePassword ? 'text' : 'password'}
                  autoFocus
                  value={deletePassword}
                  onChange={(e) => {
                    setDeletePassword(e.target.value);
                    setDeletePasswordError(false);
                  }}
                  placeholder="magic word?"
                  className={`w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-white dark:bg-slate-900/90 border text-sm font-mono text-slate-900 dark:text-white focus:outline-none transition-all ${
                    deletePasswordError
                      ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/50 dark:bg-rose-950/30'
                      : 'border-slate-300 dark:border-white/10 focus:border-rose-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowDeletePassword(!showDeletePassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showDeletePassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {deletePasswordError && (
                <p className="text-[11px] font-mono text-rose-600 dark:text-rose-400 flex items-center gap-1.5 pt-1 animate-fadeIn">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Maling password! Hindi mabubura ang item.</span>
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancelDelete}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono font-medium transition-all"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isDeleting || !deletePassword}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:pointer-events-none text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg shadow-rose-600/30 active:scale-95 transition-all"
              >
                {isDeleting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </span>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Permanently</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
