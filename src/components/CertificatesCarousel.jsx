import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Award, Eye, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { creativePortfolioData } from '../data/creativePortfolioData';
import SpotlightCard from './SpotlightCard';
import CertificateModal from './CertificateModal';

export default function CertificatesCarousel() {
  const scrollRef = useRef(null);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const { certificates } = creativePortfolioData;

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.85;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="certificates-row" className="py-20 border-t border-white/5 bg-[#080c14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Row Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-400 mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Row 4 • Certified Credentials & Recognitions</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Certificates & Honors
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
              Professional industry certifications, software engineering credentials, and academic honors validating technical mastery.
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:border-amber-500/40 transition-colors"
              aria-label="Previous Certificates"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:border-amber-500/40 transition-colors"
              aria-label="Next Certificates"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Scroll Track */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="w-[290px] sm:w-[360px] lg:w-[400px] shrink-0 snap-start"
            >
              <SpotlightCard
                className="h-full p-5 sm:p-6 flex flex-col justify-between cursor-pointer group"
                spotlightColor="rgba(245, 158, 11, 0.2)"
                onClick={() => setSelectedCertificate(cert)}
              >
                <div>
                  {/* Certificate Thumbnail with Verified Ribbon */}
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-950 mb-5 border border-white/10">
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
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-950/85 backdrop-blur-md text-[10px] font-mono text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-amber-400" />
                        <span>{cert.badge}</span>
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3">
                      <span className="px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-md text-[10px] font-mono text-slate-300 border border-white/10">
                        {cert.issueDate}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-cyan-400 block mb-1">
                    {cert.issuer}
                  </span>
                  <h3 className="text-base font-bold text-white mb-2 line-clamp-1 group-hover:text-amber-300 transition-colors">
                    {cert.title}
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
                    {cert.description}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {cert.skills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">{cert.credentialId}</span>
                  <span className="text-amber-400 font-medium flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>View Credentials</span>
                  </span>
                </div>
              </SpotlightCard>
            </div>
          ))}
        </div>
      </div>

      {selectedCertificate && (
        <CertificateModal
          certificate={selectedCertificate}
          onClose={() => setSelectedCertificate(null)}
        />
      )}
    </section>
  );
}
