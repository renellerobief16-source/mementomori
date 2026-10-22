import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * InteractiveBackground
 * - Adapts dynamically to 100% complete Dark & Light mode
 * - Fullscreen high-performance canvas with smooth lerped ambient cursor spotlight
 * - Reveals illuminated grid under cursor
 * - Ambient floating particles
 * - Interactive expanding ripple waves on click
 */
export default function InteractiveBackground() {
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const isLight = theme === 'light';

    // Mouse coordinates with smooth lerping
    const mouse = {
      targetX: width / 2,
      targetY: height / 2,
      currentX: width / 2,
      currentY: height / 2,
      isHovering: false,
    };

    // Expanding click ripples array
    const ripples = [];

    // Ambient floating particles
    const particleCount = Math.min(Math.floor((width * height) / 32000), 35);
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 1.5 + 0.8,
      baseAlpha: Math.random() * 0.2 + 0.08,
      color: Math.random() > 0.4 
        ? (isLight ? 'rgba(6, 182, 212,' : 'rgba(34, 211, 238,')
        : (isLight ? 'rgba(124, 58, 237,' : 'rgba(167, 139, 250,'),
    }));

    // Handle high DPI resize
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    // Track mouse movement
    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.isHovering = true;
    };

    const handleMouseLeave = () => {
      mouse.isHovering = false;
    };

    // Track click / pointerdown for ripple pulse waves
    const handlePointerDown = (e) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 5,
        maxRadius: 180 + Math.random() * 40,
        opacity: isLight ? 0.6 : 0.75,
        lineWidth: 2,
      });

      // Second secondary wave for ripple depth
      setTimeout(() => {
        ripples.push({
          x: e.clientX,
          y: e.clientY,
          radius: 2,
          maxRadius: 130,
          opacity: isLight ? 0.4 : 0.5,
          lineWidth: 1.5,
        });
      }, 70);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    // Render loop
    const render = () => {
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Smooth lerp mouse coordinates
      const ease = 0.085;
      mouse.currentX += (mouse.targetX - mouse.currentX) * ease;
      mouse.currentY += (mouse.targetY - mouse.currentY) * ease;

      const spotlightRadius = 450;
      const curX = mouse.currentX;
      const curY = mouse.currentY;

      // 1. Draw subtle base grid pattern
      const gridSize = 48;
      ctx.lineWidth = 1;
      const baseGridStroke = isLight ? 'rgba(15, 23, 42, 0.035)' : 'rgba(255, 255, 255, 0.015)';

      // Vertical grid lines
      for (let x = 0; x <= width; x += gridSize) {
        const dx = Math.abs(x - curX);
        if (dx < spotlightRadius) {
          const grad = ctx.createLinearGradient(x, Math.max(0, curY - spotlightRadius), x, Math.min(height, curY + spotlightRadius));
          grad.addColorStop(0, baseGridStroke);
          const alphaCenter = Math.max(0.02, (1 - dx / spotlightRadius) * (isLight ? 0.08 : 0.12));
          grad.addColorStop(0.5, isLight ? `rgba(6, 182, 212, ${alphaCenter})` : `rgba(34, 211, 238, ${alphaCenter})`);
          grad.addColorStop(1, baseGridStroke);

          ctx.strokeStyle = grad;
        } else {
          ctx.strokeStyle = baseGridStroke;
        }
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Horizontal grid lines
      for (let y = 0; y <= height; y += gridSize) {
        const dy = Math.abs(y - curY);
        if (dy < spotlightRadius) {
          const grad = ctx.createLinearGradient(Math.max(0, curX - spotlightRadius), y, Math.min(width, curX + spotlightRadius), y);
          grad.addColorStop(0, baseGridStroke);
          const alphaCenter = Math.max(0.02, (1 - dy / spotlightRadius) * (isLight ? 0.08 : 0.12));
          grad.addColorStop(0.5, isLight ? `rgba(124, 58, 237, ${alphaCenter})` : `rgba(139, 92, 246, ${alphaCenter})`);
          grad.addColorStop(1, baseGridStroke);

          ctx.strokeStyle = grad;
        } else {
          ctx.strokeStyle = baseGridStroke;
        }
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Cursor Ambient Radial Glow
      const ambientGlow = ctx.createRadialGradient(
        curX,
        curY,
        0,
        curX,
        curY,
        spotlightRadius
      );
      if (isLight) {
        ambientGlow.addColorStop(0, 'rgba(6, 182, 212, 0.12)');
        ambientGlow.addColorStop(0.35, 'rgba(124, 58, 237, 0.07)');
        ambientGlow.addColorStop(0.7, 'rgba(59, 130, 246, 0.03)');
        ambientGlow.addColorStop(1, 'rgba(248, 250, 252, 0)');
      } else {
        ambientGlow.addColorStop(0, 'rgba(6, 182, 212, 0.18)');
        ambientGlow.addColorStop(0.35, 'rgba(139, 92, 246, 0.11)');
        ambientGlow.addColorStop(0.7, 'rgba(56, 189, 248, 0.04)');
        ambientGlow.addColorStop(1, 'rgba(7, 11, 20, 0)');
      }

      ctx.fillStyle = ambientGlow;
      ctx.beginPath();
      ctx.arc(curX, curY, spotlightRadius, 0, Math.PI * 2);
      ctx.fill();

      // 3. Floating particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const dist = Math.hypot(p.x - curX, p.y - curY);
        let alpha = p.baseAlpha;

        if (dist < spotlightRadius) {
          alpha += (1 - dist / spotlightRadius) * (isLight ? 0.35 : 0.45);
        }

        ctx.fillStyle = `${p.color} ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * (dist < spotlightRadius ? 1.3 : 1), 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Interactive Click Ripple Waves
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rip = ripples[i];
        rip.radius += (rip.maxRadius - rip.radius) * 0.075 + 1.2;
        rip.opacity *= 0.94;

        if (rip.opacity <= 0.015 || rip.radius >= rip.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.strokeStyle = isLight 
          ? `rgba(6, 182, 212, ${rip.opacity})` 
          : `rgba(34, 211, 238, ${rip.opacity})`;
        ctx.lineWidth = rip.lineWidth;
        ctx.shadowColor = 'rgba(6, 182, 212, 0.7)';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.stroke();

        if (rip.radius > 20) {
          ctx.strokeStyle = isLight 
            ? `rgba(124, 58, 237, ${rip.opacity * 0.5})` 
            : `rgba(168, 85, 247, ${rip.opacity * 0.55})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(rip.x, rip.y, Math.max(0, rip.radius - 14), 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-colors duration-500"
      style={{
        backgroundColor: theme === 'light' ? '#f8fafc' : '#070b14',
      }}
      aria-hidden="true"
    />
  );
}
