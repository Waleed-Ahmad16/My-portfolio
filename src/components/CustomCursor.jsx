/**
 * CustomCursor — Fast, minimal, premium
 * DOT: near-instant (stiffness 900)
 * RING: responsive lag (stiffness 400) — feels reactive not sluggish
 * No aura/trail layers — removed for performance
 * Contextual labels on project/media/contact hover
 */
import { useEffect, useRef, useCallback, useState, memo } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

const HAS_FINE_POINTER =
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches;

function resolveType(el) {
  if (!el || !(el instanceof Element)) return 'default';
  if (el.closest('input, textarea, select')) return 'input';
  if (el.closest('img, video')) return 'media';
  if (el.closest('button[type="submit"], .btn-send')) return 'send';
  if (el.closest('.showcase-card-wrapper, .project-card, article')) return 'view';
  if (el.closest('.showcase-viewport')) return 'drag';
  if (el.closest('button, .btn-primary, .btn-outline, [role="button"], a, .cursor-pointer')) return 'interactive';
  return 'default';
}

const LABELS = { default:'', interactive:'', drag:'Drag', view:'View', send:'Send', media:'', input:'' };

/* ── Ultra-responsive springs ── */
const S_DOT  = { stiffness: 900, damping: 42, mass: 0.12 };   // instant
const S_RING = { stiffness: 400, damping: 32, mass: 0.30 };   // quick lag

const RING_SIZE = {
  default:     { w: 32, h: 32, opacity: 0.80 },
  interactive: { w: 46, h: 46, opacity: 1.00 },
  drag:        { w: 62, h: 62, opacity: 1.00 },
  view:        { w: 62, h: 62, opacity: 1.00 },
  send:        { w: 56, h: 56, opacity: 1.00 },
  media:       { w: 52, h: 52, opacity: 0.90 },
  input:       { w: 20, h: 40, opacity: 0.55 },
};

export default function CustomCursor() {
  if (!HAS_FINE_POINTER) return null;
  return <CursorImpl />;
}

const CursorImpl = memo(function CursorImpl() {
  const [type, setType] = useState('default');
  const [vis,  setVis]  = useState(false);
  const [ripples, setRipples] = useState([]);
  const rid = useRef(0);

  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const dotX  = useSpring(mx, S_DOT);
  const dotY  = useSpring(my, S_DOT);
  const ringX = useSpring(mx, S_RING);
  const ringY = useSpring(my, S_RING);

  const addRipple = useCallback((x, y) => {
    const id = ++rid.current;
    setRipples(p => [...p, { id, x, y }]);
    setTimeout(() => setRipples(p => p.filter(r => r.id !== id)), 700);
  }, []);

  /* Magnetic pull — MutationObserver instead of setInterval (fires only on DOM changes) */
  useEffect(() => {
    const SEL = '.btn-primary,.btn-outline,button,a';
    const map = new WeakMap();
    function attach(el) {
      if (map.has(el)) return;
      const mv = (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top  + r.height / 2);
        const d  = Math.hypot(dx, dy);
        if (d < 80) {
          const p = (1 - d / 80) * 0.28;
          el.style.transform  = `translate3d(${dx*p}px,${dy*p}px,0)`;
          el.style.transition = 'transform 0.08s ease-out';
        }
      };
      const ml = () => { el.style.transform = ''; el.style.transition = 'transform 0.4s ease'; };
      el.addEventListener('mousemove',  mv, { passive: true });
      el.addEventListener('mouseleave', ml, { passive: true });
      map.set(el, { mv, ml });
    }
    function scan() { document.querySelectorAll(SEL).forEach(attach); }
    scan();
    // MutationObserver: only rescans when new nodes are added (e.g. lazy-loaded sections)
    // This replaces the old setInterval(scan, 2500) which ran continuously wasting CPU
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      document.querySelectorAll(SEL).forEach(el => {
        const h = map.get(el);
        if (h) { el.removeEventListener('mousemove', h.mv); el.removeEventListener('mouseleave', h.ml); el.style.transform = ''; }
      });
    };
  }, []);

  useEffect(() => {
    const onMove = (e) => { mx.set(e.clientX); my.set(e.clientY); setType(resolveType(e.target)); setVis(true); };
    const onClick = (e) => addRipple(e.clientX, e.clientY);
    const onLeave = () => setVis(false);
    const onEnter = () => setVis(true);
    window.addEventListener('mousemove',    onMove,   { passive: true });
    window.addEventListener('click',        onClick,  { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    return () => {
      window.removeEventListener('mousemove',    onMove);
      window.removeEventListener('click',        onClick);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, [mx, my, addRipple]);

  const sz    = RING_SIZE[type] ?? RING_SIZE.default;
  const label = LABELS[type];
  const isInput = type === 'input';

  return (
    <>
      {/* ── Ring — NO backdropFilter: it causes full repaint on every mousemove ── */}
      <motion.div
        className="lux-ring"
        style={{
          x: ringX, y: ringY,
          borderRadius: isInput ? '8px' : '9999px',
        }}
        animate={{
          width:   sz.w,
          height:  sz.h,
          opacity: vis ? sz.opacity : 0,
          scale:   vis ? 1 : 0.5,
          borderColor: type !== 'default' && type !== 'media' && type !== 'input' ? 'var(--accent)' : 'var(--cursor-ring-bd)',
          backgroundColor: 'var(--cursor-ring-bg)',
          boxShadow: `0 0 14px var(--cursor-ring-glow), inset 0 1px 0 rgba(255,248,200,0.06)`,
        }}
        transition={{
          width:   { type: 'spring', ...S_RING },
          height:  { type: 'spring', ...S_RING },
          opacity: { duration: 0.15 },
          scale:   { type: 'spring', stiffness: 400, damping: 28 },
          borderColor: { duration: 0.12 },
        }}
      >
        <AnimatePresence>
          {label && vis && (
            <motion.span
              key={label}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.12 }}
              style={{
                position: 'absolute', fontSize: '8px', fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'var(--accent)', userSelect: 'none', pointerEvents: 'none',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Dot ── */}
      <motion.div
        className="lux-dot"
        style={{
          x: dotX, y: dotY,
          width: 6, height: 6,
          backgroundColor: 'var(--cursor-dot)',
          boxShadow: '0 0 8px var(--cursor-dot-glow)',
        }}
        animate={{
          scale:   vis ? 1 : 0,
          opacity: vis && type !== 'interactive' && type !== 'card' ? 1 : 0,
        }}
        transition={{
          scale:   { type: 'spring', ...S_DOT },
          opacity: { duration: 0.10 },
        }}
      />

      {/* ── Ripples ── */}
      <AnimatePresence>
        {ripples.map(({ id, x, y }) => (
          <motion.div
            key={id}
            className="lux-ripple"
            style={{ left: x, top: y }}
            initial={{ scale: 0, opacity: 0.7 }}
            animate={{ scale: 3,  opacity: 0   }}
            exit={{}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
      </AnimatePresence>
    </>
  );
});
