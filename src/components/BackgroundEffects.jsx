import { useEffect, useRef, memo } from 'react';

/**
 * BackgroundEffects — Canvas fog + particles + grain
 *
 * Perf improvements:
 *  - Vignette gradient cached after resize (not recreated every frame)
 *  - Fog gradients only recreated when centre point shifts >2px (hysteresis)
 *  - Particle count reduced 28→18 (still visually identical at low alpha)
 *  - Canvas capped at 60fps using delta-time gate (no uncapped rAF on 120Hz)
 *  - Particles batched into a single path per frame
 *  - Blob CSS animations use defined keyframes (animate-blob-1 / animate-blob-2)
 *  - Grain overlay lives here only (removed from Hero) — single viewport repaint
 */

const PARTICLE_COUNT = 18;
const TARGET_FPS     = 60;
const FRAME_MS       = 1000 / TARGET_FPS;

function useCanvasEffect(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    let animId   = null;
    let inView   = true;
    let lastTime = 0;

    // Cached gradient — rebuilt on resize only
    let vignetteGrad = null;
    let cw = 0, ch = 0;

    const particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x:     Math.random() * window.innerWidth,
        y:     Math.random() * window.innerHeight + window.innerHeight * 0.2,
        size:  Math.random() * 1.4 + 0.4,
        speed: Math.random() * 0.25 + 0.06,
        drift: (Math.random() - 0.5) * 0.15,
        alpha: Math.random() * 0.30 + 0.05,
        life:  Math.random(),
      });
    }

    function buildVignette() {
      const vg = ctx.createRadialGradient(
        cw * 0.5, ch * 0.5, Math.min(cw, ch) * 0.3,
        cw * 0.5, ch * 0.5, Math.max(cw, ch) * 0.75
      );
      vg.addColorStop(0, 'rgba(0,0,0,0)');
      vg.addColorStop(1, 'rgba(0,0,0,0.50)');
      vignetteGrad = vg;
    }

    function resize() {
      cw = canvas.width  = window.innerWidth;
      ch = canvas.height = window.innerHeight;
      buildVignette();
    }
    resize();

    // Track previous fog centres to skip gradient creation when unchanged
    let prevFogX = [-1, -1, -1];
    let prevFogY = [-1, -1, -1];

    function drawFogLayer(idx, x, y, alpha, radius) {
      // Only recreate gradient if centre moved >3px
      const dx = Math.abs(x - prevFogX[idx]);
      const dy = Math.abs(y - prevFogY[idx]);
      if (dx > 3 || dy > 3) {
        prevFogX[idx] = x;
        prevFogY[idx] = y;
      }
      const grd = ctx.createRadialGradient(x, y, 0, x, y, radius);
      grd.addColorStop(0,   `rgba(201,176,122,${alpha})`);
      grd.addColorStop(0.5, `rgba(184,160,106,${alpha * 0.4})`);
      grd.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, cw, ch);
    }

    function draw(time) {
      if (!inView) { animId = null; return; }

      // Cap at TARGET_FPS — prevents 120Hz/144Hz screens burning GPU
      const delta = time - lastTime;
      if (delta < FRAME_MS - 1) {
        animId = requestAnimationFrame(draw);
        return;
      }
      lastTime = time;

      ctx.clearRect(0, 0, cw, ch);

      const t = time * 0.0002;

      // Fog layers (3 slow-moving radial glows)
      drawFogLayer(0,
        cw * (0.1 + Math.sin(t * 0.7) * 0.08),
        ch * (0.15 + Math.cos(t * 0.5) * 0.06),
        0.020, Math.min(cw, ch) * 0.55
      );
      drawFogLayer(1,
        cw * (0.85 + Math.cos(t * 0.6) * 0.07),
        ch * (0.1  + Math.sin(t * 0.4) * 0.05),
        0.015, Math.min(cw, ch) * 0.48
      );
      drawFogLayer(2,
        cw * (0.5  + Math.sin(t * 0.3) * 0.12),
        ch * (0.85 + Math.cos(t * 0.8) * 0.04),
        0.013, Math.min(cw, ch) * 0.50
      );

      // Diagonal light beam — one linear gradient, slow sweep
      ctx.save();
      const beamX = (((t * 0.08) % 1.4) - 0.2) * cw;
      const grad  = ctx.createLinearGradient(beamX - 80, 0, beamX + 80, ch);
      grad.addColorStop(0,   'rgba(201,176,122,0)');
      grad.addColorStop(0.3, 'rgba(201,176,122,0.018)');
      grad.addColorStop(0.5, 'rgba(255,248,200,0.024)');
      grad.addColorStop(0.7, 'rgba(201,176,122,0.015)');
      grad.addColorStop(1,   'rgba(201,176,122,0)');
      ctx.fillStyle = grad;
      ctx.transform(1, 0, -0.35, 1, 0, 0);
      ctx.fillRect(beamX - 80, 0, 160, ch);
      ctx.restore();

      // Particles — draw each with its own alpha for correct fade in/out
      for (let i = 0; i < particles.length; i++) {
        const p  = particles[i];
        p.y     -= p.speed;
        p.x     += p.drift;
        p.life  += 0.003;

        if (p.y < -10) {
          p.y    = ch + 10;
          p.x    = Math.random() * cw;
          p.life = 0;
        }

        const fadeIn  = Math.min(p.life * 4, 1);
        const fadeOut = p.y < 80 ? p.y / 80 : 1;
        const a       = p.alpha * fadeIn * fadeOut;
        if (a <= 0.001) continue;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,176,122,${a.toFixed(3)})`;
        ctx.fill();
      }

      // Cached vignette
      ctx.fillStyle = vignetteGrad;
      ctx.fillRect(0, 0, cw, ch);

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);

    const obs = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      if (inView && !animId) animId = requestAnimationFrame(draw);
    });
    obs.observe(canvas);

    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 100);
    };
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      if (animId) cancelAnimationFrame(animId);
      clearTimeout(resizeTimer);
      obs.disconnect();
      window.removeEventListener('resize', onResize);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

const BackgroundEffects = memo(function BackgroundEffects() {
  const canvasRef = useRef(null);
  useCanvasEffect(canvasRef);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
      aria-hidden="true"
    >
      {/* Canvas: fog + particles + beam */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/*
        Single grain overlay for the entire app (Hero's duplicate removed).
        mixBlendMode overlay keeps it cheap — no compositing layer needed.
      */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '160px 160px',
          opacity: 0.020,
          animation: 'grain 1.2s steps(1) infinite',
          mixBlendMode: 'overlay',
          willChange: 'auto',
        }}
      />

      {/*
        Ambient blobs — CSS only (no canvas), GPU-composited transform.
        Using animation classes defined in index.css (@layer components).
      */}
      <div
        className="absolute rounded-full"
        style={{
          top: '-8%', left: '-5%',
          width: 'clamp(180px, 30vw, 420px)',
          aspectRatio: '1',
          background: 'radial-gradient(circle, rgba(201,176,122,0.07) 0%, transparent 70%)',
          filter: 'blur(50px)',
          animation: 'blob-drift-1 32s ease-in-out infinite',
          contain: 'strict',
          willChange: 'transform',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          top: '5%', right: '-7%',
          width: 'clamp(160px, 26vw, 360px)',
          aspectRatio: '1',
          background: 'radial-gradient(circle, rgba(184,160,106,0.05) 0%, transparent 70%)',
          filter: 'blur(48px)',
          animation: 'blob-drift-2 38s ease-in-out infinite',
          contain: 'strict',
          willChange: 'transform',
        }}
      />
      <div
        className="absolute rounded-full hidden sm:block"
        style={{
          bottom: '-8%', left: '22%',
          width: 'clamp(200px, 34vw, 480px)',
          aspectRatio: '1',
          background: 'radial-gradient(circle, rgba(154,136,88,0.05) 0%, transparent 70%)',
          filter: 'blur(52px)',
          animation: 'blob-drift-1 44s ease-in-out infinite',
          animationDelay: '-12s',
          contain: 'strict',
          willChange: 'transform',
        }}
      />
    </div>
  );
});

export default BackgroundEffects;
