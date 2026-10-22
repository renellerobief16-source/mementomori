import React, { useState } from 'react';
import { Award, ShieldCheck, CheckCircle2, Calendar, Eye, Sparkles } from 'lucide-react';
import ModernStageCarousel from '../components/ModernStageCarousel';
import CertificateModal from '../components/CertificateModal';
import { usePortfolio } from '../context/PortfolioContext';

export default function CertificatesPage() {
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const { certificates } = usePortfolio();

  return (
    <div className="pt-20 sm:pt-28 pb-16 sm:pb-20 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 sm:space-y-16">
      {/* Modern Stage Carousel Section */}
      <ModernStageCarousel
        items={certificates}
        categoryBadge="Division 04 • Credentials"
        categoryTitle="Certificates & Accreditations"
        categorySubtitle="Industry-standard certifications, technical bootcamps, and academic dean's honors validating engineering competence."
        accentColor="amber"
        onItemClick={(item) => setSelectedCertificate(item)}
        renderItem={(cert, isCurrent) => (
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center justify-center">
            {/* Certificate Thumbnail (Balanced & Fitted) */}
            <div
              onClick={() => setSelectedCertificate(cert)}
              className="w-full max-w-[300px] sm:max-w-[340px] md:max-w-[370px] aspect-[4/3] max-h-[300px] relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-white/10 group shrink-0 cursor-pointer shadow-xl hover:shadow-amber-500/10 transition-all duration-300 mx-auto md:mx-0"
              title={`Click to inspect ${cert.title}`}
            >
              <img
                src={cert.image}
                alt={cert.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="px-4 py-2 rounded-xl bg-slate-900/90 text-white font-mono text-xs flex items-center gap-2 border border-white/20 shadow-xl">
                  <Eye className="w-4 h-4 text-amber-400" />
                  <span>Inspect Certificate</span>
                </div>
              </div>

              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md text-[11px] font-mono text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>{cert.badge}</span>
                </span>
              </div>
            </div>

            {/* Certificate Details */}
            <div className="flex-1 w-full flex flex-col justify-between py-1 space-y-4">
              <div>
                <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-bold block mb-1">
                  {cert.issuer}
                </span>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                  {cert.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-4 max-w-xl">
                  {cert.description}
                </p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {cert.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono border border-slate-200 dark:border-white/5 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 sm:pt-4 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-4 text-xs font-mono">
                <span className="text-slate-500 dark:text-slate-400 text-center sm:text-left">{cert.issueDate}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCertificate(cert);
                  }}
                  className="min-h-[44px] w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          </div>
        )}
      />

      {/* Grid of All Certificates */}
      <section className="pt-8 border-t border-slate-200 dark:border-white/10">
        <div className="mb-8">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            All Verified Certifications & Honors
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-0.5">
            Conferred by global learning platforms and academic universities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedCertificate(c)}
              className="glass-card glass-card-hover p-6 rounded-3xl border border-slate-200 dark:border-white/10 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-950 mb-4 border border-slate-200 dark:border-white/10">
                  <img
                    src={c.image}
                    alt={c.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-950/85 backdrop-blur-md text-[10px] font-mono text-amber-300 border border-amber-500/30">
                      {c.badge}
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 font-semibold block mb-1">
                  {c.issuer}
                </span>
                <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                  {c.title}
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-xs line-clamp-2 leading-relaxed mb-4">
                  {c.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500 dark:text-slate-400">{c.issueDate}</span>
                <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Certificate Modal */}
      {selectedCertificate && (
        <CertificateModal
          certificate={selectedCertificate}
          onClose={() => setSelectedCertificate(null)}
        />
      )}
    </div>
  );
}
