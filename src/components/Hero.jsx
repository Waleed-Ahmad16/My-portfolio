import { useEffect, useRef, useState, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Twitter, Instagram, ArrowDown, Download, ExternalLink } from 'lucide-react';

/* ─── Roles for typing animation ───────────────────────────── */
const ROLES = ['AI Engineer', 'Full-Stack Developer', 'Tech Founder', 'System Architect'];

const TypingText = memo(function TypingText() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting,  setDeleting]  = useState(false);

  useEffect(() => {
    const current = ROLES[roleIndex];
    let t;
    if (!deleting && displayed.length < current.length)
      t = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 72);
    else if (!deleting && displayed.length === current.length)
      t = setTimeout(() => setDeleting(true), 2200);
    else if (deleting && displayed.length > 0)
      t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 38);
    else {
      setDeleting(false);
      setRoleIndex(i => (i + 1) % ROLES.length);
    }
    return () => clearTimeout(t);
  }, [displayed, deleting, roleIndex]);

  return (
    <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
      {displayed}
      <motion.span
        style={{ color: 'var(--accent)', opacity: 0.7 }}
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.9, repeat: Infinity }}
      >|</motion.span>
    </span>
  );
});

/* ─── Socials ───────────────────────────────────────────────── */
const SOCIALS = [
  { icon: Github,    href: 'https://github.com/Waleed-Ahmad16',                        label: 'GitHub'    },
  { icon: Linkedin,  href: 'https://www.linkedin.com/in/waleed-ahmed-098608398/',       label: 'LinkedIn'  },
  { icon: Twitter,   href: 'https://x.com/waleedahmad_16',                             label: 'Twitter'   },
  { icon: Instagram, href: 'https://www.instagram.com/waleed._.16_/',                  label: 'Instagram' },
];

/* ─── Stats ─────────────────────────────────────────────────── */
const STATS = [
  { value: '3+',   label: 'Years Exp.'      },
  { value: '10+',  label: 'Projects'        },
  { value: '15+',  label: 'Happy Clients'   },
  { value: '100%', label: 'Success Rate'    },
];

/* ─── Word-by-word title reveal (faster than per-char, less overhead) ── */
const CharReveal = memo(function CharReveal({ text, delay = 0, className = '', style = {} }) {
  // Split by word instead of character — fewer Motion instances, faster to render
  const words = text.split(' ');
  return (
    <span className={className} style={style} aria-label={text}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: delay + i * 0.06,
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ display: 'inline-block', marginRight: i < words.length - 1 ? '0.25em' : 0 }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
});

/* ─── Premium Avatar ─────────────────────────────────────────── */
const PremiumAvatar = memo(function PremiumAvatar() {
  const frameRef = useRef(null);
  const lightRef = useRef(null);
  const glowRef  = useRef(null);
  const rafRef   = useRef(null);

  const onMouseMove = useCallback((e) => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const el = frameRef.current;
      const gl = glowRef.current;
      const lt = lightRef.current;
      if (!el) return;
      const r  = el.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const dx = (e.clientX - cx) / (r.width  / 2);
      const dy = (e.clientY - cy) / (r.height / 2);
      el.style.transform = `perspective(900px) rotateX(${dy * 8}deg) rotateY(${-dx * 8}deg) translateZ(10px)`;
      if (lt) {
        const lx = ((e.clientX - r.left) / r.width)  * 100;
        const ly = ((e.clientY - r.top)  / r.height) * 100;
        lt.style.background = `radial-gradient(140px circle at ${lx}% ${ly}%, rgba(255,248,200,0.16) 0%, rgba(201,176,122,0.08) 45%, transparent 70%)`;
      }
      if (gl) {
        const gx = 50 + dx * 14;
        const gy = 50 + dy * 14;
        gl.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(201,176,122,0.38) 0%, rgba(184,160,106,0.18) 40%, transparent 70%)`;
      }
    });
  }, []);

  const onMouseEnter = useCallback(() => {
    const el = frameRef.current;
    const gl = glowRef.current;
    if (el) el.style.transition = 'transform 0.1s ease-out';
    if (gl) { gl.style.opacity = '1'; gl.style.transition = 'opacity 0.5s ease, background 0.08s linear'; }
  }, []);

  const onMouseLeave = useCallback(() => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    const el = frameRef.current;
    const gl = glowRef.current;
    const lt = lightRef.current;
    if (el) { el.style.transition = 'transform 0.65s cubic-bezier(0.34,1.56,0.64,1)'; el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)'; }
    if (gl) { gl.style.opacity = '0'; }
    if (lt) { lt.style.background = 'transparent'; }
  }, []);

  return (
    <motion.div
      className="relative flex items-center justify-center select-none"
      style={{ width: 'clamp(13rem, 28vw, 18rem)', aspectRatio: '1' }}
      initial={{ opacity: 0, scale: 0.88, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Ambient glow */}
      <div aria-hidden="true" className="absolute pointer-events-none" style={{
        inset: '-20%',
        background: 'radial-gradient(circle at 40% 40%, rgba(201,176,122,0.28) 0%, rgba(184,160,106,0.12) 45%, transparent 70%)',
        animation: 'orb-morph 12s ease-in-out infinite, orb-drift 8s ease-in-out infinite',
        filter: 'blur(22px)', zIndex: 0,
      }} />

      {/* Hover glow */}
      <div ref={glowRef} aria-hidden="true" className="absolute rounded-full pointer-events-none" style={{
        inset: '-28%',
        background: 'radial-gradient(circle, rgba(201,176,122,0.38) 0%, rgba(184,160,106,0.18) 40%, transparent 70%)',
        filter: 'blur(50px)', opacity: 0,
        transition: 'opacity 0.5s ease',
        willChange: 'opacity, background', zIndex: 1,
      }} />

      {/* Float + ring wrapper */}
      <div className="relative" style={{
        width: '100%', height: '100%',
        animation: 'hero-float 5s ease-in-out infinite', zIndex: 2,
      }}>
        {/* Rotating outer ring */}
        <div aria-hidden="true" className="absolute inset-0 rounded-full pointer-events-none" style={{
          background: 'conic-gradient(from 0deg, rgba(201,176,122,0.50) 0%, rgba(255,248,200,0.60) 25%, rgba(184,160,106,0.45) 50%, rgba(154,136,88,0.50) 75%, rgba(201,176,122,0.50) 100%)',
          padding: '2px',
          animation: 'avatar-ring-spin 9s linear infinite',
        }}>
          <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--bg-primary)', transition: 'background-color 0.35s ease' }} />
        </div>

        {/* Inner dashed ring */}
        <div aria-hidden="true" className="absolute rounded-full pointer-events-none" style={{
          inset: '5%', border: '1px dashed rgba(201,176,122,0.22)', borderRadius: '50%',
          animation: 'slow-rotate 22s linear infinite reverse',
        }} />

        {/* Compass dots */}
        {[
          { t: '1%',  l: '50%', tx: '-50%', ty: '0%'    },
          { t: '50%', l: '99%', tx: '0%',   ty: '-50%'  },
          { t: '99%', l: '50%', tx: '-50%', ty: '-100%' },
          { t: '50%', l: '1%',  tx: '-100%',ty: '-50%'  },
        ].map(({ t, l, tx, ty }, i) => (
          <div key={i} aria-hidden="true" className="absolute pointer-events-none rounded-full" style={{
            top: t, left: l, width: 7, height: 7,
            transform: `translate(${tx}, ${ty})`,
            background: '#c9b07a',
            boxShadow: '0 0 10px rgba(201,176,122,0.70)',
          }} />
        ))}

        {/* 3D tilt frame */}
        <div
          ref={frameRef}
          onMouseMove={onMouseMove}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className="relative rounded-full"
          style={{
            width: '76%', aspectRatio: '1', margin: '0 auto',
            transformStyle: 'preserve-3d', willChange: 'transform',
            cursor: 'default', position: 'relative', top: '12%',
          }}
        >
          <div className="absolute inset-0 rounded-full overflow-hidden" style={{
            background: 'var(--glass-bg)',
            border: '2px solid rgba(201,176,122,0.30)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: 'inset 0 2px 0 rgba(255,248,200,0.12), 0 20px 60px rgba(0,0,0,0.80), 0 0 50px rgba(201,176,122,0.20)',
          }}>
            <div aria-hidden="true" className="absolute inset-0 rounded-full pointer-events-none" style={{
              background: 'linear-gradient(130deg, rgba(255,248,200,0.12) 0%, rgba(255,255,255,0.03) 38%, transparent 58%)', zIndex: 2,
            }} />
            <div ref={lightRef} aria-hidden="true" className="absolute inset-0 rounded-full pointer-events-none" style={{ zIndex: 3, transition: 'background 0.04s linear' }} />
            <img
              src="/my-img.webp"
              alt="Waleed Ahmad — AI Engineer & Full-Stack Developer"
              width={320} height={320}
              loading="eager" decoding="async" fetchPriority="high"
              className="w-full h-full rounded-full object-cover"
              style={{ objectPosition: '50% 20%' }}
            />
          </div>
        </div>
      </div>

      {/* Available badge */}
      <motion.div
        className="absolute flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
        style={{
          bottom: '4%', right: '-6%',
          background: 'rgba(10,10,8,0.88)',
          border: '1px solid rgba(201,176,122,0.38)',
          color: 'var(--accent)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.70), 0 0 20px rgba(201,176,122,0.18)',
          zIndex: 10,
        }}
        initial={{ opacity: 0, scale: 0.7, y: 8 }}
        animate={{ opacity: 1, scale: 1,   y: 0  }}
        transition={{ delay: 0.55, type: 'spring', stiffness: 320, damping: 24 }}
      >
        <motion.span className="w-1.5 h-1.5 rounded-full" style={{ background: '#c9b07a' }}
          animate={{ opacity: [1, 0.3, 1], scale: [1, 1.4, 1] }}
          transition={{ duration: 1.8, ease: 'easeInOut', repeat: Infinity }}
        />
        Available
      </motion.div>
    </motion.div>
  );
});

/* ─── Main Hero Component ─────────────────────────────────── */
export default function Hero() {
  const sectionRef    = useRef(null);
  const backgroundRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const el = backgroundRef.current;
    if (!el) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    el.style.setProperty('--mx', x.toFixed(3));
    el.style.setProperty('--my', y.toFixed(3));
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden"
      style={{
        paddingTop: 'calc(var(--nav-height) + 2rem)',
        paddingBottom: 'clamp(3rem, 6vw, 5rem)',
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {/* Background blobs */}
      <div className="hero-fluid-bg" ref={backgroundRef} aria-hidden="true">
        <div className="hero-fluid-blobs">
          <div className="hero-blob hero-blob--1" />
          <div className="hero-blob hero-blob--2" />
          <div className="hero-blob hero-blob--3" />
          <div className="hero-blob hero-blob--4" />
          <div className="hero-blob hero-blob--5" />
        </div>
        <div className="hero-glass-lens" />
        {/* hero-noise-texture removed — grain lives in BackgroundEffects (app-level) */}
        <div className="absolute inset-0 grid-bg" style={{ opacity: 0.025 }} />
      </div>

      <div className="site-container relative" style={{ zIndex: 10 }}>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20 xl:gap-24 max-w-7xl mx-auto">

          {/* LEFT: Text content */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left order-2 lg:order-1 max-w-2xl w-full">

            {/* Eyebrow label */}
            <motion.div
              className="flex items-center gap-2 mb-6"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="section-chip">
                <span>Full Stack · AI Developer</span>
              </span>
            </motion.div>

            {/* Cinematic headline */}
            <h1
              className="font-display font-bold leading-[0.92] mb-2"
              style={{
                fontSize: 'clamp(2.2rem, 6vw, 5.5rem)',
                letterSpacing: '-0.045em',
                textShadow: 'var(--text-shadow-heading)',
              }}
            >
              <motion.span
                className="block"
                style={{ color: 'var(--text-secondary)', fontSize: '0.38em', fontWeight: 500, letterSpacing: '-0.01em', marginBottom: '0.2em' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                Hi, I&apos;m
              </motion.span>
              <CharReveal
                text="Waleed Ahmad."
                delay={0.18}
                className="gradient-text-hero block"
                style={{ animation: 'shimmer-warm 3.5s linear infinite' }}
              />
            </h1>

            {/* Role subtitle */}
            <motion.p
              className="font-display font-medium mb-2 mt-4"
              style={{
                fontSize: 'clamp(0.95rem, 1.8vw, 1.35rem)',
                color: 'var(--text-secondary)',
                letterSpacing: '-0.02em',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.5 }}
            >
              Full Stack Developer / AI Developer
            </motion.p>

            {/* Typing roles */}
            <motion.p
              className="text-base md:text-lg mb-5"
              style={{ color: 'var(--text-tertiary)' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.48, duration: 0.5 }}
            >
              Currently building as a <TypingText />
            </motion.p>

            {/* Description */}
            <motion.p
              className="max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed"
              style={{
                fontSize: 'clamp(0.875rem, 1.3vw, 1rem)',
                color: 'var(--text-muted)',
                lineHeight: '1.85',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.58, duration: 0.5 }}
            >
              I design and build clean web products, intelligent interfaces, and automation
              systems with a focus on performance, clarity, and polished user experience.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.68, duration: 0.5 }}
            >
              <button
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary cursor-pointer text-sm justify-center focus:outline-none w-full sm:w-auto"
              >
                View Projects
                <ExternalLink size={14} />
              </button>
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-outline cursor-pointer text-sm justify-center focus:outline-none w-full sm:w-auto"
              >
                Get In Touch
              </button>
              <a
                href="/Waleed_CV.pdf"
                download="Waleed_CV.pdf"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-full cursor-pointer transition-all duration-300 w-full sm:w-auto"
                style={{
                  color: 'var(--text-muted)',
                  background: 'rgba(201,176,122,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(12px)',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderColor = 'rgba(201,176,122,0.28)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(201,176,122,0.14)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <Download size={14} />
                Download CV
              </a>
            </motion.div>

            {/* Social links */}
            <motion.div
              className="flex items-center gap-2.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.78, duration: 0.5 }}
            >
              <span className="text-xs uppercase tracking-widest mr-1" style={{ color: 'var(--text-muted)', letterSpacing: '0.2em' }}>Follow</span>
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="p-2 rounded-lg transition-all duration-200"
                  style={{
                    background: 'rgba(201,176,122,0.05)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    color: 'var(--text-muted)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(201,176,122,0.28)';
                    e.currentTarget.style.color = 'var(--accent)';
                    e.currentTarget.style.background = 'rgba(201,176,122,0.08)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.color = 'var(--text-muted)';
                    e.currentTarget.style.background = 'rgba(201,176,122,0.05)';
                  }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — Avatar + stats glass panel */}
          <div className="flex flex-col items-center gap-6 order-1 lg:order-2 relative">
            <div className="relative" style={{ width: 'clamp(13rem, 28vw, 18rem)', aspectRatio: '1' }}>
              <PremiumAvatar />
            </div>

            {/* Stats glass card — desktop */}
            <motion.div
              className="hidden lg:block w-full max-w-xs"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="glass-card p-5">
                <div className="grid grid-cols-2 gap-3">
                  {STATS.map(({ value, label }) => (
                    <div key={label} className="text-center py-2 px-3 rounded-lg" style={{
                      background: 'rgba(201,176,122,0.04)',
                      border: '1px solid rgba(201,176,122,0.10)',
                    }}>
                      <div className="font-display font-black" style={{
                        fontSize: 'clamp(1.3rem, 2vw, 1.8rem)',
                        lineHeight: 1,
                        color: 'var(--accent)',
                        textShadow: '0 0 24px rgba(201,176,122,0.40)',
                        letterSpacing: '-0.03em',
                      }}>{value}</div>
                      <div className="text-[10px] font-medium mt-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stats — mobile/tablet below hero columns */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10 lg:hidden"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {STATS.map(({ value, label }) => (
            <div key={label} className="glass-card p-4 text-center">
              <div className="font-display font-black" style={{
                fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                lineHeight: 1,
                color: 'var(--accent)',
                textShadow: '0 0 24px rgba(201,176,122,0.40)',
                letterSpacing: '-0.03em',
              }}>{value}</div>
              <div className="text-[11px] mt-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="flex flex-col items-center gap-2 mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <span className="text-[10px] uppercase tracking-[0.22em]" style={{ color: 'var(--text-muted)' }}>Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowDown size={14} style={{ color: 'var(--accent)', opacity: 0.6 }} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
