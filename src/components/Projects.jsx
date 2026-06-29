/**
 * Projects — Premium Curved Coverflow Showcase
 *
 * Architecture:
 *  • Continuous auto-scroll — never stops, right-to-left, infinite loop
 *  • Coverflow layout — center card flat, side cards angled in 3D (rotateY)
 *  • Multiple cards visible simultaneously, center card highlighted
 *  • Manual control: mouse drag, touch swipe, mouse wheel
 *  • Auto-resumes 2s after manual interaction ends
 *  • rAF loop updates track translateX + each card's rotateY/scale/opacity
 *  • Active card: float animation, glow pulse, animated gradient border, badge pulse
 *
 * Performance:
 *  • Zero Framer Motion — pure rAF + direct DOM style manipulation
 *  • All animations: transform + opacity + background-position (compositor)
 *  • rAF stops when section is off-screen (IntersectionObserver)
 *  • content-visibility: auto on section
 *  • memo() on all sub-components
 *  • Edge fade mask prevents overdraw at viewport edges
 *  • Only 15 DOM elements in the track (5 projects × 3 loops)
 */

import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Github, ExternalLink } from 'lucide-react';
import { SectionReveal, RevealChild } from './SectionReveal.jsx';

/* ─────────────────────────────────────────────────────────────────
   PROJECT DATA
   ───────────────────────────────────────────────────────────────── */
const PROJECTS = [
  {
    id: 1, num: '01', title: 'AI Resume Builder', category: 'AI / Full Stack', year: '2024',
    description: 'NLP platform generating ATS-ready resumes in under 30 seconds.',
    tech: ['React', 'Python', 'OpenAI', 'FastAPI'],
    accent: '#c9b07a', accentRgb: '201,176,122', accent2: '#b8a06a',
    github: '#', live: '#',
  },
  {
    id: 2, num: '02', title: 'AI Chatbot Platform', category: 'AI / ML', year: '2024',
    description: 'Real-time RAG agent with vector memory and sub-10ms latency.',
    tech: ['Python', 'TensorFlow', 'React', 'FastAPI'],
    accent: '#ddc88a', accentRgb: '221,200,138', accent2: '#c9b07a',
    github: '#', live: '#',
  },
  {
    id: 3, num: '03', title: 'Food Delivery App', category: 'Mobile / Flutter', year: '2023',
    description: 'Cross-platform food ordering with geofenced live tracking.',
    tech: ['Flutter', 'Dart', 'Firebase', 'Node.js'],
    accent: '#b8a06a', accentRgb: '184,160,106', accent2: '#c9b07a',
    github: '#', live: '#',
  },
  {
    id: 4, num: '04', title: 'PDF to Word Converter', category: 'Mobile / Android', year: '2023',
    description: 'Layout-preserving PDF conversion with table and column support.',
    tech: ['Kotlin', 'Compose', 'PDFBox', 'Android SDK'],
    accent: '#9a8858', accentRgb: '154,136,88', accent2: '#b8a06a',
    github: '#', live: '#',
  },
  {
    id: 5, num: '05', title: 'Portfolio Website', category: 'Web / UI', year: '2024',
    description: 'High-performance portfolio with premium glassmorphic UI system.',
    tech: ['React', 'Tailwind', 'Vite', 'CSS'],
    accent: '#c9b07a', accentRgb: '201,176,122', accent2: '#ddc88a',
    github: '#', live: '#',
  },
];

/* ── Config ── */
const SPEED         = 0.35;   // px per frame (~21px/s at 60fps)
const RESUME_DELAY  = 2000;   // ms before auto-resume after drag
const LOOPS         = 3;      // duplicate projects for seamless loop
const ALL_PROJECTS  = Array(LOOPS).fill(null).flatMap(() => PROJECTS);
const REAL_COUNT    = PROJECTS.length;

/* ─────────────────────────────────────────────────────────────────
   MINI PREVIEW — lightweight browser-style mockup
   ───────────────────────────────────────────────────────────────── */
const MiniPreview = memo(function MiniPreview({ project }) {
  return (
    <div
      className="relative rounded-lg overflow-hidden w-full"
      style={{
        background: `linear-gradient(135deg, rgba(${project.accentRgb},0.06) 0%, rgba(${project.accentRgb},0.01) 100%)`,
        border: `1px solid rgba(${project.accentRgb},0.10)`,
        aspectRatio: '16/9',
      }}
    >
      <div className="flex items-center gap-1 px-2 py-1.5" style={{ background: 'var(--glass-bg-2)', borderBottom: `1px solid rgba(${project.accentRgb},0.06)` }}>
        {['#ff5f57', '#ffbd2e', '#28c840'].map(c => (
          <div key={c} className="w-1.5 h-1.5 rounded-full" style={{ background: c, opacity: 0.7 }} />
        ))}
        <div className="flex-1 ml-1.5 h-3 rounded-sm flex items-center px-1" style={{ background: 'var(--glass-bg)' }}>
          <span className="text-[6px] font-mono truncate" style={{ color: 'var(--text-muted)' }}>project-{project.num}.app</span>
        </div>
      </div>
      <div className="relative flex flex-col gap-1.5 p-2" style={{ height: 'calc(100% - 20px)' }}>
        <span className="absolute font-heading font-black select-none pointer-events-none" style={{ fontSize: '2rem', color: `rgba(${project.accentRgb},0.10)`, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', lineHeight: 1 }}>
          {project.num}
        </span>
        <div className="flex gap-1 relative z-10">
          {[0, 1].map(i => (
            <div key={i} className="flex-1 rounded p-1" style={{ background: `rgba(${project.accentRgb},0.05)`, border: `1px solid rgba(${project.accentRgb},0.10)` }}>
              <div className="h-1 w-7 rounded-sm" style={{ background: project.accent, opacity: 0.7 }} />
              <div className="h-0.5 w-4 rounded-sm mt-0.5" style={{ background: `rgba(${project.accentRgb},0.3)` }} />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-1 mt-0.5 relative z-10">
          {[80, 55, 70].map((w, i) => (
            <div key={i} className="h-0.5 rounded-full" style={{ width: `${w}%`, background: `rgba(${project.accentRgb},${0.3 - i * 0.08})` }} />
          ))}
        </div>
        <div className="mt-auto flex items-center gap-1 relative z-10">
          <div className="h-4 w-4 rounded" style={{ background: `rgba(${project.accentRgb},0.12)`, border: `1px solid rgba(${project.accentRgb},0.20)` }} />
          <div className="h-0.5 flex-1 rounded-full" style={{ background: `rgba(${project.accentRgb},0.08)` }} />
          <div className="h-0.5 w-6 rounded-full" style={{ background: `rgba(${project.accentRgb},0.15)` }} />
        </div>
      </div>
    </div>
  );
});

/* ─────────────────────────────────────────────────────────────────
   TECH PILL
   ───────────────────────────────────────────────────────────────── */
const TechPill = memo(function TechPill({ label, accentRgb }) {
  return (
    <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold whitespace-nowrap" style={{
      background: `rgba(${accentRgb},0.10)`, border: `1px solid rgba(${accentRgb},0.20)`, color: 'var(--text-muted)',
    }}>
      {label}
    </span>
  );
});

/* ─────────────────────────────────────────────────────────────────
   ACTION BUTTON
   ───────────────────────────────────────────────────────────────── */
const ActionBtn = memo(function ActionBtn({ href, Icon, label, accent, accentRgb }) {
  const [hov, setHov] = useState(false);
  const isLive = label === 'Live Demo';
  return (
    <a href={href} target="_blank" rel="noreferrer"
      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-wide transition-all duration-200"
      style={{
        background: isLive ? (hov ? accent : `rgba(${accentRgb},0.12)`) : (hov ? 'var(--glass-bg-2)' : 'transparent'),
        border: `1px solid ${isLive ? (hov ? accent : `rgba(${accentRgb},0.25)`) : (hov ? 'var(--border)' : 'var(--border-subtle)')}`,
        color: isLive ? (hov ? '#fff' : accent) : (hov ? 'var(--text-secondary)' : 'var(--text-muted)'),
        boxShadow: isLive && hov ? `0 0 12px rgba(${accentRgb},0.30)` : 'none',
        transform: hov ? 'translateY(-1px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >
      <Icon size={10} />
      {label}
    </a>
  );
});

/* ─────────────────────────────────────────────────────────────────
   PROJECT CARD — compact vertical layout
   ───────────────────────────────────────────────────────────────── */
const ProjectCard = memo(function ProjectCard({ project }) {
  return (
    <div className="p-3 flex flex-col gap-2.5">
      <div className="rounded-lg overflow-hidden w-full">
        <MiniPreview project={project} />
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-heading font-black text-xs" style={{ color: `rgba(${project.accentRgb},0.40)` }}>{project.num}</span>
        <span className="text-[7px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full" style={{ background: `rgba(${project.accentRgb},0.08)`, border: `1px solid rgba(${project.accentRgb},0.20)`, color: project.accent }}>
          {project.category}
        </span>
        <span className="text-[8px] font-mono ml-auto" style={{ color: 'var(--text-muted)' }}>{project.year}</span>
      </div>
      <h3 className="font-heading font-extrabold leading-tight tracking-tight text-sm" style={{ color: 'var(--text-primary)' }}>{project.title}</h3>
      <p className="text-[11px] leading-relaxed line-clamp-2" style={{ color: 'var(--text-muted)' }}>{project.description}</p>
      <div className="flex flex-wrap gap-1">
        {project.tech.slice(0, 4).map(t => <TechPill key={t} label={t} accentRgb={project.accentRgb} />)}
      </div>
      <div className="flex items-center gap-2 pt-1.5 mt-auto" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <ActionBtn href={project.live} Icon={ExternalLink} label="Live Demo" accent={project.accent} accentRgb={project.accentRgb} />
        <ActionBtn href={project.github} Icon={Github} label="GitHub" accent={project.accent} accentRgb={project.accentRgb} />
      </div>
    </div>
  );
});

/* ─────────────────────────────────────────────────────────────────
   MAIN — Continuous Coverflow Showcase
   ───────────────────────────────────────────────────────────────── */
export default function Projects() {
  const sectionRef   = useRef(null);
  const viewportRef  = useRef(null);
  const trackRef     = useRef(null);
  const cardRefs     = useRef([]);

  const offsetRef    = useRef(0);
  const rafRef       = useRef(null);
  const isDraggingRef = useRef(false);
  const isPausedRef  = useRef(false);
  const dragStartRef = useRef({ x: 0, offset: 0 });
  const resumeTimerRef = useRef(null);
  const cardWidthRef = useRef(300);
  const containerWidthRef = useRef(0);
  const inViewRef    = useRef(false);
  const activeIndexRef = useRef(-1);
  const initializedRef = useRef(false);

  /* ── Measure card width and container width ── */
  const measure = useCallback(() => {
    const card = cardRefs.current[0];
    const vp   = viewportRef.current;
    if (card) cardWidthRef.current = card.offsetWidth;
    if (vp)   containerWidthRef.current = vp.offsetWidth;

    if (!initializedRef.current && cardWidthRef.current > 0 && containerWidthRef.current > 0) {
      offsetRef.current = REAL_COUNT * cardWidthRef.current
                        + cardWidthRef.current / 2
                        - containerWidthRef.current / 2;
      initializedRef.current = true;
    }
  }, []);

  /* ── Pause auto-scroll, resume after delay ── */
  const pauseAuto = useCallback(() => {
    isPausedRef.current = true;
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => { isPausedRef.current = false; }, RESUME_DELAY);
  }, []);

  /* ── rAF loop — continuous scroll + coverflow transforms ── */
  const tick = useCallback(() => {
    if (!inViewRef.current) { rafRef.current = null; return; }

    const cw = cardWidthRef.current;
    const loopLen = REAL_COUNT * cw;
    const offset = offsetRef.current;
    const center = containerWidthRef.current / 2;

    /* Auto-scroll */
    if (!isDraggingRef.current && !isPausedRef.current) {
      offsetRef.current += SPEED;
    }

    /* Seamless loop */
    const off = offsetRef.current;
    if (off > loopLen + REAL_COUNT * cw) {
      offsetRef.current -= loopLen;
    } else if (off < -cw) {
      offsetRef.current += loopLen;
    }

    /* Apply track transform (single element, compositor-only) */
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
    }

    /* Apply coverflow transforms per card */
    let newActive = -1;
    let minDist = Infinity;

    for (let i = 0; i < cardRefs.current.length; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;

      const cardCenter = i * cw + cw / 2;
      const screenCenter = cardCenter - offsetRef.current;
      const distPx = screenCenter - center;
      const dist = distPx / cw;
      const absDist = Math.abs(dist);

      if (absDist > 3) {
        el.style.opacity = '0';
        el.style.transform = `scale(0.6)`;
        el.style.pointerEvents = 'none';
      } else {
        const rotateY = -dist * 32;
        const scale = Math.max(0.72, 1 - absDist * 0.13);
        const opacity = Math.max(0.15, 1 - absDist * 0.33);
        const z = Math.round(100 - absDist * 20);

        el.style.transform = `rotateY(${rotateY}deg) scale(${scale})`;
        el.style.opacity = String(opacity);
        el.style.zIndex = String(z);
        el.style.pointerEvents = absDist < 0.5 ? 'auto' : 'none';

        if (absDist < minDist) {
          minDist = absDist;
          newActive = i;
        }
      }
    }

    /* Toggle active class */
    if (newActive !== activeIndexRef.current) {
      const prev = activeIndexRef.current;
      activeIndexRef.current = newActive;
      if (prev >= 0 && cardRefs.current[prev]) cardRefs.current[prev].classList.remove('is-active');
      if (newActive >= 0 && cardRefs.current[newActive]) cardRefs.current[newActive].classList.add('is-active');
    }

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  /* ── Mouse drag ── */
  const onMouseDown = useCallback((e) => {
    if (e.target.closest('a, button')) return;
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, offset: offsetRef.current };
    if (viewportRef.current) viewportRef.current.classList.add('is-dragging');
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);

    const onMove = (ev) => {
      const dx = dragStartRef.current.x - ev.clientX;
      offsetRef.current = dragStartRef.current.offset + dx;
    };
    const onUp = () => {
      isDraggingRef.current = false;
      if (viewportRef.current) viewportRef.current.classList.remove('is-dragging');
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      pauseAuto();
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [pauseAuto]);

  /* ── Touch swipe ── */
  const onTouchStart = useCallback((e) => {
    if (e.target.closest('a, button')) return;
    dragStartRef.current = { x: e.touches[0].clientX, offset: offsetRef.current };
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  }, []);

  const onTouchMove = useCallback((e) => {
    if (!dragStartRef.current) return;
    const dx = dragStartRef.current.x - e.touches[0].clientX;
    if (Math.abs(dx) < 5) return;
    offsetRef.current = dragStartRef.current.offset + dx;
    isDraggingRef.current = true;
  }, []);

  const onTouchEnd = useCallback(() => {
    isDraggingRef.current = false;
    dragStartRef.current = { x: 0, offset: 0 };
    pauseAuto();
  }, [pauseAuto]);

  /* ── Mouse wheel ── */
  const onWheel = useCallback((e) => {
    const delta = e.deltaY || e.deltaX;
    if (Math.abs(delta) < 2) return;
    offsetRef.current += delta * 0.5;
    pauseAuto();
  }, [pauseAuto]);

  /* ── Start rAF + measure + resize listener ── */
  useEffect(() => {
    measure();
    rafRef.current = requestAnimationFrame(tick);

    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(measure, 150);
    };
    window.addEventListener('resize', onResize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, [tick, measure]);

  /* ── IntersectionObserver — start/stop rAF ── */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      inViewRef.current = e.isIntersecting;
      if (e.isIntersecting && !rafRef.current) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }, { rootMargin: '0px 0px -10% 0px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, [tick]);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="section-flow"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 500px' }}
    >
      <div className="site-container">

        {/* Section header */}
        <SectionReveal className="text-center mb-10 md:mb-14">
          <RevealChild i={0}>
            <span className="section-label mb-3 block">Selected Work</span>
          </RevealChild>
          <RevealChild i={1} y={22}>
            <h2 className="section-title">
              Featured <span className="gradient-text">Projects</span>
            </h2>
          </RevealChild>
          <RevealChild i={2} y={16}>
            <p className="section-subtitle">
              Production systems engineered to solve real problems — each one a case study in AI, architecture, and measurable impact.
            </p>
          </RevealChild>
        </SectionReveal>

        {/* ── Coverflow viewport ── */}
        <div
          ref={viewportRef}
          className="showcase-viewport"
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onWheel={onWheel}
        >
          <div ref={trackRef} className="showcase-track">
            {ALL_PROJECTS.map((project, i) => (
              <div
                key={i}
                ref={el => { cardRefs.current[i] = el; }}
                className="showcase-card-wrapper"
                style={{
                  '--card-accent': project.accent,
                  '--card-accent-2': project.accent2,
                  '--card-accent-rgb': project.accentRgb,
                }}
              >
                {/* Glow halo — visible when active */}
                <div
                  className="showcase-glow"
                  style={{ background: `radial-gradient(ellipse at center, rgba(${project.accentRgb},0.15) 0%, transparent 70%)` }}
                />
                {/* Card */}
                <div className="showcase-card-inner">
                  <ProjectCard project={project} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Drag hint */}
        <p className="text-center text-[10px] mt-4 font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          Drag · Swipe · Scroll to explore
        </p>
      </div>
    </section>
  );
}
