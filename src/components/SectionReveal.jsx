/**
 * SectionReveal — Premium scroll-triggered section entrance system
 *
 * Provides two utilities:
 *   <SectionReveal>        — wraps a section, triggers on scroll entry
 *   <RevealChild i={n}>    — individual staggered child within a reveal
 *
 * Performance (optimized):
 *   • IntersectionObserver (no scroll listener)
 *   • `once: true` — animates only once, never re-runs
 *   • transform + opacity ONLY — compositor thread, 60fps
 *   • NO filter/blur animation — animating CSS filter causes rasterization
 *     every frame, negating GPU compositing. Removed entirely.
 *   • will-change: 'transform, opacity' only (no filter)
 */

import { useRef, memo } from 'react';
import { motion, useInView } from 'framer-motion';

/* ─── Section container — triggers children when 12% in view ── */
export const SectionReveal = memo(function SectionReveal({ children, className = '', delay = 0 }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-12% 0px -12% 0px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden:  {},
        visible: { transition: { staggerChildren: 0.08, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
});

/* ─── Individual child — opacity + transform only ─────────── */
export const RevealChild = memo(function RevealChild({
  children,
  i         = 0,
  y         = 24,
  x         = 0,
  scale     = false,
  effect    = 'fade-up',
  duration  = 0.65,
  className = '',
  style     = {},
  // blur prop accepted but intentionally ignored for performance
  // eslint-disable-next-line no-unused-vars
  blur,
}) {
  const getVariants = () => {
    switch (effect) {
      case 'fade-down':
        return {
          hidden:  { opacity: 0, y: -y },
          visible: { opacity: 1, y: 0 }
        };
      case 'slide-left':
        return {
          hidden:  { opacity: 0, x: x || 28 },
          visible: { opacity: 1, x: 0 }
        };
      case 'slide-right':
        return {
          hidden:  { opacity: 0, x: x || -28 },
          visible: { opacity: 1, x: 0 }
        };
      case 'zoom':
        return {
          hidden:  { opacity: 0, scale: 0.93, y },
          visible: { opacity: 1, scale: 1,    y: 0 }
        };
      case 'fade-up':
      default:
        return {
          hidden:  { opacity: 0, y, scale: scale ? 0.96 : 1 },
          visible: { opacity: 1, y: 0, scale: 1 }
        };
    }
  };

  const variants = getVariants();

  return (
    <motion.div
      className={className}
      style={{ ...style, willChange: 'transform, opacity' }}
      variants={{
        hidden: variants.hidden,
        visible: {
          ...variants.visible,
          transition: {
            delay: i * 0.05,
            duration,
            ease: [0.22, 1, 0.36, 1],
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
});

/* ─── Stagger grid — wraps a list of items ────────────────── */
export const RevealGrid = memo(function RevealGrid({ children, className = '', stagger = 0.08 }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden:  {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
});

/* ─── Section header reveal (label + title + subtitle) ─────── */
export const RevealHeader = memo(function RevealHeader({ label, title, subtitle, className = '' }) {
  return (
    <SectionReveal className={`text-center ${className}`}>
      {label && (
        <RevealChild i={0} effect="fade-down" y={14}>
          <span className="section-label mb-3 block">{label}</span>
        </RevealChild>
      )}
      {title && (
        <RevealChild i={1} y={20} effect="zoom">
          <h2 className="section-title">{title}</h2>
        </RevealChild>
      )}
      {subtitle && (
        <RevealChild i={2} y={12}>
          <p className="section-subtitle">{subtitle}</p>
        </RevealChild>
      )}
    </SectionReveal>
  );
});
