import React, { useEffect } from 'react';
import { X, Award, CheckCircle2, ShieldCheck, Calendar, Hash, ExternalLink } from 'lucide-react';

export default function CertificateModal({ certificate, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  if (!certificate) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="glass-card w-full max-w-4xl max-h-[92vh] rounded-3xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900/95 overflow-hidden shadow-2xl relative flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-950/80 text-white hover:bg-slate-900 border border-white/20 transition-colors"
          aria-label="Close Certificate Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Image Frame */}
        <div className="md:w-1/2 bg-slate-950 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <img
            src={certificate.image}
            alt={certificate.title}
            className="max-h-[65vh] w-auto object-contain rounded-xl shadow-2xl border border-white/10"
          />
        </div>

        {/* Certificate Details */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-700 dark:text-amber-400 flex items-center gap-1.5 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                <span>{certificate.badge}</span>
              </span>
              <span className="text-xs font-mono text-slate-500">
                {certificate.category}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
              {certificate.title}
            </h2>

            <div className="flex items-center gap-2 text-sm text-cyan-600 dark:text-cyan-400 font-medium mb-4">
              <Award className="w-4 h-4" />
              <span>Issued by: {certificate.issuer}</span>
            </div>

            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
              {certificate.description}
            </p>

            {/* Credential metadata */}
            <div className="space-y-2.5 mb-6">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Year / Date Issued:</span>
                </span>
                <span className="text-slate-900 dark:text-white font-medium">{certificate.issueDate}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-slate-500" />
                  <span>Credential ID:</span>
                </span>
                <span className="text-cyan-600 dark:text-cyan-400 font-medium">{certificate.credentialId}</span>
              </div>
            </div>

            {/* Skills validated */}
            <div>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                Skills & Competencies Validated
              </span>
              <div className="flex flex-wrap gap-1.5">
                {certificate.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/5 text-xs font-mono"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 mt-6">
            <span>Recipient: Renelle Robie D. Lopez</span>
            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verified Authenticity</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
