import { useRef, useEffect, memo } from 'react';

const Tilt = memo(function Tilt({ children, className = '', style = {}, max = 8, scale = 1.015, glare = true }) {
  const ref = useRef(null);
  const glareRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const gl = glareRef.current;
    if (!el) return;

    let rafId = null;

    const handleMouseMove = (e) => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        rafId = null;
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        const rotX = (y - 0.5) * -max;
        const rotY = (x - 0.5) * max;

        el.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`;
        el.style.transition = 'transform 0.08s ease-out';

        if (gl) {
          gl.style.background = `radial-gradient(circle 120px at ${x * 100}% ${y * 100}%, rgba(255, 255, 255, 0.08) 0%, rgba(20, 184, 166, 0.03) 50%, transparent 80%)`;
        }
      });
    };

    const handleMouseEnter = () => {
      if (gl) {
        gl.style.opacity = '1';
        gl.style.transition = 'opacity 0.2s ease';
      }
    };

    const handleMouseLeave = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
      el.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
      if (gl) {
        gl.style.opacity = '0';
        gl.style.transition = 'opacity 0.4s ease';
      }
    };

    el.addEventListener('mousemove', handleMouseMove, { passive: true });
    el.addEventListener('mouseenter', handleMouseEnter, { passive: true });
    el.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [max, scale]);

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      style={{
        ...style,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
    >
      {glare && (
        <div
          ref={glareRef}
          className="absolute inset-0 pointer-events-none rounded-[inherit] z-30 opacity-0"
          style={{
            willChange: 'background, opacity',
            transition: 'opacity 0.2s ease',
          }}
        />
      )}
      {children}
    </div>
  );
});

export default Tilt;
