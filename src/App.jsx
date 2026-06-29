import { useState, useEffect, lazy, Suspense, useRef } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';

// ── Lazy load ALL non-critical components ─────────────────────
// BackgroundEffects is visual-only: lazy so it doesn't block the first paint
const BackgroundEffects = lazy(() => import('./components/BackgroundEffects.jsx'));
const About        = lazy(() => import('./components/About.jsx'));
const Skills       = lazy(() => import('./components/Skills.jsx'));
const Projects     = lazy(() => import('./components/Projects.jsx'));
const Education    = lazy(() => import('./components/Education.jsx'));
const Experience   = lazy(() => import('./components/Experience.jsx'));
const Achievements = lazy(() => import('./components/Achievements.jsx'));
const CV           = lazy(() => import('./components/CV.jsx'));
const Contact      = lazy(() => import('./components/Contact.jsx'));
const Footer       = lazy(() => import('./components/Footer.jsx'));
const CustomCursor = lazy(() => import('./components/CustomCursor.jsx'));
const AIChatbot    = lazy(() => import('./components/AIChatbot.jsx'));

// ── Prefetch below-fold chunks when user is about to scroll ───
function usePrefetchOnIdle() {
  const prefetched = useRef(false);
  useEffect(() => {
    if (prefetched.current) return;
    const prefetch = () => {
      if (prefetched.current) return;
      prefetched.current = true;
      // Kick off prefetch of all below-fold chunks after browser is idle
      const chunks = [
        () => import('./components/About.jsx'),
        () => import('./components/Skills.jsx'),
        () => import('./components/Projects.jsx'),
        () => import('./components/Education.jsx'),
        () => import('./components/Experience.jsx'),
        () => import('./components/Achievements.jsx'),
        () => import('./components/CV.jsx'),
        () => import('./components/Contact.jsx'),
        () => import('./components/Footer.jsx'),
        () => import('./components/AIChatbot.jsx'),
      ];
      chunks.forEach(fn => fn().catch(() => {}));
    };

    // Prefer requestIdleCallback, fall back to a 2s timeout
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(prefetch, { timeout: 2000 });
      return () => cancelIdleCallback(id);
    } else {
      const id = setTimeout(prefetch, 2000);
      return () => clearTimeout(id);
    }
  }, []);
}

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  usePrefetchOnIdle();

  return (
    <>
      {/* CustomCursor — non-blocking, isolated Suspense */}
      <Suspense fallback={null}>
        <CustomCursor />
      </Suspense>

      {/* Background canvas — lazy so it doesn't block first paint */}
      <Suspense fallback={null}>
        <BackgroundEffects />
      </Suspense>

      {/* Navbar lives OUTSIDE app-shell so isolation:isolate never traps it */}
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="app-shell min-h-screen">
        <main className="site-main">
          {/* Hero is eagerly loaded — it IS the first paint */}
          <Hero />

          {/* All below-fold sections — each in its own Suspense boundary
              so one slow chunk never blocks another */}
          <Suspense fallback={null}>
            <About />
          </Suspense>
          <Suspense fallback={null}>
            <Skills />
          </Suspense>
          <Suspense fallback={null}>
            <Projects />
          </Suspense>
          <Suspense fallback={null}>
            <Education />
          </Suspense>
          <Suspense fallback={null}>
            <Experience />
          </Suspense>
          <Suspense fallback={null}>
            <Achievements />
          </Suspense>
          <Suspense fallback={null}>
            <CV />
          </Suspense>
          <Suspense fallback={null}>
            <Contact />
          </Suspense>
        </main>

        <Suspense fallback={null}>
          <Footer />
        </Suspense>

        <Suspense fallback={null}>
          <AIChatbot />
        </Suspense>
      </div>
    </>
  );
}
