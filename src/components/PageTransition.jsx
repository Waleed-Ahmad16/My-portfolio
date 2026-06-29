import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PageTransitionContext = createContext(null);

export function usePageTransition() {
  const context = useContext(PageTransitionContext);
  if (!context) {
    throw new Error('usePageTransition must be used within a PageTransitionProvider');
  }
  return context;
}

export function PageTransitionProvider({ children }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const startTransition = useCallback((targetId) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    // Timing coordinate: Scroll to target when the screen is fully covered by panels
    setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = el.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'auto', // Instant jump behind the curtain
        });
      }
      setActiveSection(targetId);
    }, 600); // Middle of the transition (obscured)

    setTimeout(() => {
      setIsTransitioning(false);
    }, 1200); // Complete wipe duration
  }, [isTransitioning]);

  return (
    <PageTransitionContext.Provider
      value={{
        isTransitioning,
        startTransition,
        activeSection,
        setActiveSection,
      }}
    >
      {children}
    </PageTransitionContext.Provider>
  );
}

export function PageTransitionOverlay() {
  const { isTransitioning } = usePageTransition();

  const panels = [
    { id: 'deep-slate',  color: 'var(--bg-base)',         delay: 0,    zIndex: 90 },
    { id: 'emerald-wash', color: 'rgba(20, 184, 166, 0.15)', delay: 0.1,  zIndex: 91, blur: true },
    { id: 'cyan-wash',   color: 'rgba(0, 229, 255, 0.08)',  delay: 0.15, zIndex: 92, blur: true },
    { id: 'top-glass',   color: 'var(--bg-overlay)',      delay: 0.2,  zIndex: 93, isMain: true },
  ];

  return (
    <AnimatePresence>
      {isTransitioning && (
        <div className="fixed inset-0 z-[100] pointer-events-none">
          {panels.map((p) => (
            <motion.div
              key={p.id}
              className="absolute inset-0 w-full h-full pointer-events-auto"
              style={{
                background: p.color,
                zIndex: p.zIndex,
                backdropFilter: p.blur ? 'blur(20px) saturate(140%)' : 'none',
                WebkitBackdropFilter: p.blur ? 'blur(20px) saturate(140%)' : 'none',
                borderBottom: p.isMain ? '1px solid var(--border-strong)' : 'none',
                boxShadow: p.isMain ? '0 12px 40px rgba(0,0,0,0.5)' : 'none',
              }}
              initial={{ y: '-100%' }}
              animate={{
                y: ['-100%', '0%', '0%', '100%'],
              }}
              exit={{ y: '100%' }}
              transition={{
                duration: 1.0,
                ease: [0.76, 0, 0.24, 1],
                times: [0, 0.45, 0.55, 1],
                delay: p.delay,
              }}
            >
              {p.isMain && (
                <div className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none">
                  {/* Central glowing logo */}
                  <motion.div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                    style={{
                      background: 'var(--glass-bg-2)',
                      border: '1px solid var(--border-active)',
                      boxShadow: 'var(--shadow-glow-lg)',
                    }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: [0.8, 1.1, 0.8], opacity: 1 }}
                    transition={{ duration: 1.0, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <span className="font-display font-black text-sm text-[var(--accent)]">W</span>
                  </motion.div>
                  <motion.span
                    className="font-display text-[10px] uppercase tracking-[0.25em]"
                    style={{ color: 'var(--accent)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.0, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    Navigating...
                  </motion.span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
