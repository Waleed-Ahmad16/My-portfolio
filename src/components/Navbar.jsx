/**
 * Navbar — Apple Liquid Glass Floating Capsule
 *
 * Architecture:
 *  - Fixed header occupies zero layout space (pointer-events: none on wrapper)
 *  - Capsule is centered with its own max-width, NOT inside site-container
 *  - Three-column flex: Logo | Nav | Controls
 *  - Active pill uses Framer layoutId for smooth cross-item morphing
 *  - Scroll shrinks padding and deepens blur/shadow
 *  - Mobile: full-screen glass drawer from right
 *  - Magnetic effect on Hire Me + Logo via useMotionValue springs
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';

const NAV_LINKS = [
  { id: 'hero',         label: 'Home'         },
  { id: 'about',        label: 'About'        },
  { id: 'skills',       label: 'Skills'       },
  { id: 'projects',     label: 'Projects'     },
  { id: 'education',    label: 'Education'    },
  { id: 'experience',   label: 'Experience'   },
  { id: 'achievements', label: 'Achievements' },
  { id: 'contact',      label: 'Contact'      },
];

/* ── Active section via IntersectionObserver ──────────────── */
function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  const obsRef = useRef(null);

  useEffect(() => {
    obsRef.current?.disconnect();
    const cb = (entries) => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible.length > 0) setActive(visible[0].target.id);
    };
    obsRef.current = new IntersectionObserver(cb, {
      rootMargin: '-15% 0px -65% 0px',
      threshold: [0, 0.1, 0.25, 0.5],
    });
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) obsRef.current.observe(el);
    });
    return () => obsRef.current?.disconnect();
  }, [ids]);

  return [active, setActive];
}

/* ── Magnetic spring hook ─────────────────────────────────── */
function useMagnetic(strength = 0.25) {
  const elRef = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 280, damping: 26, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 280, damping: 26, mass: 0.4 });

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const onMove = (e) => {
      const r   = el.getBoundingClientRect();
      const dx  = e.clientX - (r.left + r.width / 2);
      const dy  = e.clientY - (r.top  + r.height / 2);
      const d   = Math.hypot(dx, dy);
      const mag = 90;
      if (d < mag) { const p = (1 - d / mag) * strength; mx.set(dx * p); my.set(dy * p); }
    };
    const onLeave = () => { mx.set(0); my.set(0); };
    el.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseleave', onLeave, { passive: true });
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [mx, my, strength]);

  return { ref: elRef, motionStyle: { x: sx, y: sy } };
}

/* ═══════════════════════════════════════════════════════════ */
export default function Navbar({ darkMode, setDarkMode }) {
  const [scrollY,    setScrollY]    = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const sectionIds = NAV_LINKS.map(l => l.id);
  const [active, setActive] = useActiveSection(sectionIds);
  const hireMag  = useMagnetic(0.20);
  const logoMag  = useMagnetic(0.16);

  const scrolled = scrollY > 60;

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const fn = () => { if (window.innerWidth >= 1024) setMobileOpen(false); };
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const goto = useCallback((id) => {
    const wasOpen = mobileOpen;
    setMobileOpen(false);
    const delay = wasOpen ? 320 : 0;
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActive(id);
    }, delay);
  }, [mobileOpen]);

  /* Scroll-reactive glass values */
  const t = Math.min(scrollY / 180, 1); // 0 → 1

  const capsuleBg = darkMode
    ? `rgba(15,13,11,${0.45 + t * 0.35})`
    : `rgba(255,255,255,${0.65 + t * 0.25})`;

  const capsuleBorder = darkMode
    ? `rgba(255,255,255,${0.08 + t * 0.05})`
    : `rgba(0,0,0,${0.06 + t * 0.04})`;

  const capsuleShadow = darkMode
    ? `0 ${12 + t * 16}px ${40 + t * 40}px rgba(0,0,0,${0.35 + t * 0.30}),
       0 2px 0 rgba(255,255,255,0.06) inset,
       0 0 0 0.5px rgba(255,255,255,${0.06 + t * 0.04}),
       0 0 80px rgba(201,176,122,0.05)`
    : `0 ${8 + t * 12}px ${28 + t * 32}px rgba(0,0,0,${0.08 + t * 0.10}),
       0 2px 0 rgba(255,255,255,0.90) inset,
       0 0 0 0.5px rgba(0,0,0,${0.04 + t * 0.03}),
       0 0 40px rgba(122,104,64,0.06)`;

  const blurPx   = 30 + t * 8;
  const pyValue  = scrolled ? '0.55rem' : '0.7rem';

  return (
    <>
      {/* ════════════════════════════════════════════════════
          FLOATING CAPSULE — pointer-events wrapper is none,
          the inner capsule re-enables them
          ════════════════════════════════════════════════════ */}
      <motion.header
        role="banner"
        className="fixed inset-x-0 z-[9999] flex justify-center pointer-events-none"
        style={{ top: '24px' }}
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ type: 'spring', stiffness: 160, damping: 26, delay: 0.08 }}
      >
        {/*
          The capsule is a single pill — NOT site-container.
          It has a fixed max-width and horizontal margin so it
          never touches screen edges.
          On small screens it shrinks to fit.
        */}
        <motion.div
          className="nav-capsule pointer-events-auto"
          style={{
            background: capsuleBg,
            border: `1px solid ${capsuleBorder}`,
            boxShadow: capsuleShadow,
            backdropFilter: `blur(${blurPx}px) saturate(180%)`,
            WebkitBackdropFilter: `blur(${blurPx}px) saturate(180%)`,
          }}
          animate={{ paddingTop: pyValue, paddingBottom: pyValue }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Liquid glass top-edge highlight */}
          <div className="nav-capsule-sheen" aria-hidden="true" />

          {/* ── LEFT: LOGO ──────────────────────── */}
          <motion.button
            ref={logoMag.ref}
            style={logoMag.motionStyle}
            onClick={() => goto('hero')}
            className="nav-logo focus:outline-none cursor-pointer"
            aria-label="Go to top"
            whileTap={{ scale: 0.92 }}
          >
            <div className="nav-logo-mark">
              <span className="nav-logo-w">W</span>
              <span className="nav-logo-glow" aria-hidden="true" />
            </div>
            <span className="nav-logo-name">
              Waleed<span className="nav-logo-period">.</span>
            </span>
          </motion.button>

          {/* ── CENTER: DESKTOP NAV ─────────────── */}
          <nav
            className="nav-links hidden lg:flex"
            role="navigation"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map(link => (
              <NavLink
                key={link.id}
                link={link}
                isActive={active === link.id}
                darkMode={darkMode}
                onClick={goto}
              />
            ))}
          </nav>

          {/* ── RIGHT: CONTROLS ─────────────────── */}
          <div className="nav-controls">
            {/* Theme toggle */}
            <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />

            {/* Hire Me — desktop */}
            <motion.button
              ref={hireMag.ref}
              style={hireMag.motionStyle}
              onClick={() => goto('contact')}
              className="nav-hire hidden lg:inline-flex focus:outline-none cursor-pointer"
              whileHover={{ scale: 1.04, y: -1.5 }}
              whileTap={{ scale: 0.94 }}
            >
              <span className="nav-hire-shimmer" aria-hidden="true" />
              <span className="nav-hire-label">Hire Me</span>
            </motion.button>

            {/* Hamburger — mobile */}
            <HamburgerBtn
              open={mobileOpen}
              onClick={() => setMobileOpen(v => !v)}
            />
          </div>
        </motion.div>
      </motion.header>

      {/* ════════════════════════════════════════════════════
          MOBILE DRAWER
          ════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Scrim */}
            <motion.div
              className="fixed inset-0 z-[9990] lg:hidden"
              style={{
                background: 'rgba(0,0,0,0.65)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="fixed top-0 right-0 h-full z-[9995] lg:hidden flex flex-col"
              style={{
                width: 'min(88vw, 340px)',
                background: darkMode
                  ? 'linear-gradient(160deg, rgba(16,13,11,0.97) 0%, rgba(9,8,7,0.99) 100%)'
                  : 'linear-gradient(160deg, rgba(255,253,248,0.97) 0%, rgba(248,244,238,0.99) 100%)',
                borderLeft: darkMode
                  ? '1px solid rgba(255,255,255,0.07)'
                  : '1px solid rgba(0,0,0,0.06)',
                backdropFilter: 'blur(40px) saturate(200%)',
                WebkitBackdropFilter: 'blur(40px) saturate(200%)',
                boxShadow: darkMode
                  ? '-40px 0 80px rgba(0,0,0,0.80)'
                  : '-20px 0 50px rgba(0,0,0,0.10)',
              }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 38 }}
              role="navigation"
              aria-label="Mobile navigation"
            >
              {/* Drawer header */}
              <div
                className="flex items-center justify-between px-5 pt-5 pb-4 shrink-0"
                style={{
                  borderBottom: darkMode
                    ? '1px solid rgba(255,255,255,0.06)'
                    : '1px solid rgba(0,0,0,0.05)',
                }}
              >
                <button
                  onClick={() => goto('hero')}
                  className="nav-logo focus:outline-none cursor-pointer"
                >
                  <div className="nav-logo-mark">
                    <span className="nav-logo-w">W</span>
                  </div>
                  <span className="nav-logo-name">
                    Waleed<span className="nav-logo-period">.</span>
                  </span>
                </button>
                <motion.button
                  onClick={() => setMobileOpen(false)}
                  className="nav-icon-btn focus:outline-none cursor-pointer"
                  whileTap={{ scale: 0.88 }}
                  aria-label="Close menu"
                >
                  <X size={18} />
                </motion.button>
              </div>

              {/* Links */}
              <div className="flex-1 overflow-y-auto px-3 py-4">
                {NAV_LINKS.map((link, i) => {
                  const isActive = active === link.id;
                  return (
                    <motion.button
                      key={link.id}
                      onClick={() => goto(link.id)}
                      className="w-full text-left px-4 py-3.5 rounded-2xl text-sm font-semibold cursor-pointer focus:outline-none flex items-center justify-between"
                      style={{
                        color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                        background: isActive
                          ? darkMode
                            ? 'rgba(201,176,122,0.10)'
                            : 'rgba(122,104,64,0.08)'
                          : 'transparent',
                        border: isActive
                          ? darkMode
                            ? '1px solid rgba(201,176,122,0.22)'
                            : '1px solid rgba(122,104,64,0.18)'
                          : '1px solid transparent',
                        marginBottom: '2px',
                        letterSpacing: '-0.01em',
                        transition: 'all 0.18s ease',
                      }}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: i * 0.04 + 0.05,
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                      }}
                      whileTap={{ scale: 0.97 }}
                      onMouseEnter={e => {
                        if (!isActive) {
                          e.currentTarget.style.background = darkMode
                            ? 'rgba(255,255,255,0.04)'
                            : 'rgba(0,0,0,0.03)';
                          e.currentTarget.style.color = 'var(--text-primary)';
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = 'var(--text-secondary)';
                        }
                      }}
                    >
                      <span>{link.label}</span>
                      {isActive && (
                        <motion.span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: 'var(--accent)' }}
                          animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Footer */}
              <div
                className="px-4 pb-8 pt-4 shrink-0 space-y-3"
                style={{
                  borderTop: darkMode
                    ? '1px solid rgba(255,255,255,0.06)'
                    : '1px solid rgba(0,0,0,0.05)',
                }}
              >
                <motion.button
                  onClick={() => goto('contact')}
                  className="nav-hire w-full justify-center focus:outline-none cursor-pointer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.40 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <span className="nav-hire-shimmer" aria-hidden="true" />
                  <span className="nav-hire-label">Hire Me</span>
                </motion.button>
                <motion.p
                  className="text-center text-xs flex items-center justify-center gap-1.5"
                  style={{ color: 'var(--text-muted)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.50 }}
                >
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: 'var(--accent)' }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  Available for new projects
                </motion.p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Single nav link with animated pill ──────────────────── */
function NavLink({ link, isActive, darkMode, onClick }) {
  const [hov, setHov] = useState(false);

  return (
    <button
      onClick={() => onClick(link.id)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="relative px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer select-none focus:outline-none whitespace-nowrap transition-colors duration-150"
      style={{
        color: isActive
          ? 'var(--accent)'
          : hov
            ? darkMode ? 'rgba(240,237,232,0.90)' : '#1a1814'
            : darkMode ? 'rgba(200,196,188,0.70)' : '#5a5548',
      }}
    >
      {/* Sliding active pill */}
      {isActive && (
        <motion.span
          layoutId="nav-active-pill"
          className="absolute inset-0 rounded-full"
          style={{
            background: darkMode
              ? 'rgba(201,176,122,0.12)'
              : 'rgba(122,104,64,0.09)',
            border: darkMode
              ? '1px solid rgba(201,176,122,0.28)'
              : '1px solid rgba(122,104,64,0.22)',
            boxShadow: darkMode
              ? '0 0 16px rgba(201,176,122,0.15), inset 0 1px 0 rgba(255,248,200,0.08)'
              : '0 0 12px rgba(122,104,64,0.12), inset 0 1px 0 rgba(255,255,255,0.60)',
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 40, mass: 0.6 }}
        />
      )}

      {/* Hover flash */}
      {hov && !isActive && (
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{
            background: darkMode
              ? 'rgba(255,255,255,0.05)'
              : 'rgba(0,0,0,0.04)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
        />
      )}

      <span className="relative z-10">{link.label}</span>
    </button>
  );
}

/* ── Theme toggle ─────────────────────────────────────────── */
function ThemeToggle({ darkMode, setDarkMode }) {
  return (
    <motion.button
      onClick={() => setDarkMode(!darkMode)}
      className="nav-icon-btn focus:outline-none cursor-pointer"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      whileTap={{ scale: 0.86 }}
      whileHover={{ scale: 1.10 }}
    >
      <motion.div
        animate={{ rotate: darkMode ? 0 : 180, scale: [1, 0.85, 1] }}
        transition={{
          rotate: { duration: 0.55, ease: [0.34, 1.56, 0.64, 1] },
          scale:  { duration: 0.3 },
        }}
      >
        {darkMode
          ? <Sun  size={15} strokeWidth={2} />
          : <Moon size={15} strokeWidth={2} />}
      </motion.div>
    </motion.button>
  );
}

/* ── Hamburger ────────────────────────────────────────────── */
function HamburgerBtn({ open, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="nav-icon-btn lg:hidden focus:outline-none cursor-pointer"
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open}
      whileTap={{ scale: 0.88 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={open ? 'close' : 'open'}
          initial={{ opacity: 0, rotate: -45, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0,   scale: 1   }}
          exit={{    opacity: 0, rotate:  45, scale: 0.6 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
        >
          {open ? <X size={18} strokeWidth={2} /> : <Menu size={18} strokeWidth={2} />}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}
