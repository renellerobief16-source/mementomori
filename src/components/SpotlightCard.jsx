import React, { useRef, useState } from 'react';

/**
 * Aceternity / Linear-inspired Spotlight Card
 * Tracks mouse cursor to render a subtle radial spotlight gradient and micro-tilt
 */
export default function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(6, 182, 212, 0.18)",
  ...props
}) {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: -1000, y: -1000 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#0d121f]/90 text-slate-900 dark:text-slate-100 backdrop-blur-xl shadow-lg shadow-slate-200/50 dark:shadow-none transition-all duration-300 hover:border-slate-300 dark:hover:border-white/20 hover:shadow-xl group ${className}`}
      {...props}
    >
      {/* Dynamic Cursor Spotlight Effect */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(450px circle at ${mousePos.x}px ${mousePos.y}px, ${spotlightColor}, transparent 70%)`,
        }}
      />

      {/* Card Content */}
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
}
