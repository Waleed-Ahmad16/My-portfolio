import { useRef, memo } from 'react';
import { motion, useInView } from 'framer-motion';
import { Download, Eye, MapPin, Cpu, Layers, ArrowRight, Sparkles, Zap } from 'lucide-react';
import { SectionReveal, RevealChild } from './SectionReveal.jsx';

const ACHIEVEMENTS = [
  {
    icon: Cpu,
    label: 'AI & LLM Orchestration',
    value: '3+ Years',
    detail: 'Generative AI pipelines & RAG systems',
    color: '#c9b07a', rgb: '201,176,122',
  },
  {
    icon: Layers,
    label: 'Full-Stack Architecture',
    value: 'React · FastAPI',
    detail: 'End-to-end product engineering',
    color: '#b8a06a', rgb: '184,160,106',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Lahore, Pakistan',
    detail: 'Open to remote & hybrid roles',
    color: '#9a8858', rgb: '154,136,88',
  },
];

const BENTO_STATS = [
  { value: '03+',   label: 'Years Engineering',   icon: Cpu,      rgb: '201,176,122', color: '#c9b07a' },
  { value: '10+',   label: 'Systems Shipped',     icon: Layers,   rgb: '184,160,106', color: '#b8a06a' },
  { value: '05+',   label: 'AI Models Deployed',  icon: Sparkles, rgb: '154,136,88',  color: '#9a8858' },
  { value: '∞',     label: 'Learning Curve',       icon: Zap,      rgb: '201,176,122', color: '#c9b07a' },
];

const ORBITAL_TECH = [
  { label: 'React',   delay: '0s'      },
  { label: 'Python',  delay: '-7.33s'  },
  { label: 'AI',      delay: '-14.67s' },
];

const VisualMatrix = memo(function VisualMatrix({ inView }) {
  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full min-h-[420px] gap-8">

      {/* Central Orb */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        className="relative flex items-center justify-center"
        style={{ width: '280px', height: '280px' }}
      >
        {/* Ambient glow */}
        <div aria-hidden="true" className="absolute inset-0 rounded-full pointer-events-none" style={{
          background: 'radial-gradient(circle, rgba(201,176,122,0.22) 0%, rgba(184,160,106,0.10) 40%, transparent 70%)',
          filter: 'blur(32px)',
          animation: 'orb-pulse 4s ease-in-out infinite',
        }} />

        {/* Outer conic ring */}
        <div aria-hidden="true" className="absolute rounded-full pointer-events-none" style={{
          inset: '-2%',
          background: 'conic-gradient(from 0deg, transparent 0%, rgba(201,176,122,0.55) 20%, rgba(255,248,200,0.40) 45%, rgba(184,160,106,0.45) 65%, transparent 80%)',
          animation: 'orb-rotate 9s linear infinite',
          maskImage: 'radial-gradient(transparent 82%, black 84%, black 96%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(transparent 82%, black 84%, black 96%, transparent 100%)',
        }} />

        {/* Dashed ring */}
        <div aria-hidden="true" className="absolute rounded-full pointer-events-none" style={{
          inset: '8%',
          border: '1px dashed rgba(201,176,122,0.22)',
          animation: 'slow-rotate 30s linear infinite reverse',
        }} />

        {/* Inner conic */}
        <div aria-hidden="true" className="absolute rounded-full pointer-events-none" style={{
          inset: '16%',
          background: 'conic-gradient(from 0deg, transparent 0%, rgba(201,176,122,0.45) 25%, rgba(255,248,200,0.35) 50%, rgba(184,160,106,0.40) 75%, transparent 100%)',
          animation: 'orb-rotate 22s linear infinite',
          maskImage: 'radial-gradient(transparent 60%, black 62%, black 98%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(transparent 60%, black 62%, black 98%, transparent 100%)',
        }} />

        {/* Glassmorphic core */}
        <div className="absolute rounded-full flex items-center justify-center" style={{
          inset: '32%',
          background: 'linear-gradient(135deg, rgba(20,18,14,0.90) 0%, rgba(12,11,8,0.95) 100%)',
          border: '1.5px solid rgba(201,176,122,0.40)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 16px 50px rgba(0,0,0,0.80), 0 0 28px rgba(201,176,122,0.22), inset 0 1px 0 rgba(255,248,200,0.10)',
        }}>
          <span className="font-heading font-black select-none" style={{
            fontSize: '2rem',
            background: 'linear-gradient(135deg, #c9b07a 0%, #f0e0a0 50%, #b8a06a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 12px rgba(201,176,122,0.50))',
          }}>WA</span>
        </div>

        {/* Orbital tech badges */}
        {ORBITAL_TECH.map((tech) => (
          <div key={tech.label} aria-hidden="true" className="absolute top-1/2 left-1/2 pointer-events-none" style={{
            width: '48px', height: '48px',
            marginLeft: '-24px', marginTop: '-24px',
            animation: 'orbit-cw 22s linear infinite',
            animationDelay: tech.delay,
          }}>
            <div className="flex items-center justify-center rounded-full font-mono text-[9px] font-bold" style={{
              width: '100%', height: '100%',
              background: 'rgba(20,18,14,0.85)',
              border: '1px solid rgba(201,176,122,0.40)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              color: 'var(--accent)',
              boxShadow: '0 0 12px rgba(201,176,122,0.22)',
            }}>
              {tech.label}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Bento Stats 2×2 */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-[290px]">
        {BENTO_STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
            >
              <div className="relative rounded-xl p-4 group cursor-default overflow-hidden"
                style={{
                  background: `rgba(${stat.rgb},0.07)`,
                  border: `1px solid rgba(${stat.rgb},0.22)`,
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  boxShadow: `0 4px 20px rgba(0,0,0,0.60), 0 0 18px rgba(${stat.rgb},0.08)`,
                  transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.3s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `rgba(${stat.rgb},0.40)`;
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = `rgba(${stat.rgb},0.22)`;
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, rgba(${stat.rgb},0.50), transparent)` }} />
                <div className="flex items-start justify-between mb-1.5 relative z-10">
                  <span className="font-heading font-extrabold leading-none" style={{
                    fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
                    color: stat.color,
                    textShadow: `0 0 20px rgba(${stat.rgb},0.40)`,
                  }}>{stat.value}</span>
                  <Icon size={13} style={{ color: `rgba(${stat.rgb},0.55)` }} />
                </div>
                <p className="text-[10px] font-medium uppercase tracking-wider relative z-10" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

const EditorialCopy = memo(function EditorialCopy({ inView }) {
  return (
    <div className="flex flex-col gap-7 lg:pl-4">
      {/* Overline */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 }} className="flex items-center gap-3">
        <div className="h-px flex-1 max-w-[28px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,176,122,0.60))' }} />
        <span className="text-[10px] font-mono font-bold tracking-[0.28em] uppercase" style={{ color: 'var(--accent)' }}>Identity Profile</span>
      </motion.div>

      {/* Headline */}
      <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.65, delay: 0.18, ease: [0.22, 1, 0.36, 1] }} className="flex flex-col gap-3">
        <h2 className="font-heading font-extrabold leading-[1.06] tracking-tight" style={{
          fontSize: 'clamp(1.9rem, 4vw, 2.8rem)',
          color: 'var(--text-primary)',
          letterSpacing: '-0.042em',
          textShadow: 'var(--text-shadow-heading)',
        }}>Waleed Ahmad</h2>
        <h3 className="font-heading font-bold leading-snug" style={{
          fontSize: 'clamp(1rem, 2.2vw, 1.35rem)',
          background: 'linear-gradient(135deg, #c9b07a 0%, #f0e0a0 50%, #b8a06a 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.02em',
        }}>AI Engineer & Full-Stack Architect</h3>
        <div className="h-[2px] w-16 rounded-full mt-0.5" style={{
          background: 'linear-gradient(90deg, #c9b07a 0%, #ddc88a 60%, rgba(201,176,122,0.3) 100%)',
          boxShadow: '0 0 10px rgba(201,176,122,0.35)',
        }} />
      </motion.div>

      {/* Body copy */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.28 }} className="flex flex-col gap-3">
        <p className="leading-relaxed font-medium" style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
          I engineer intelligent systems at the intersection of AI and product — building full-stack applications that combine generative AI, vector databases, and high-performance React interfaces into seamless digital experiences.
        </p>
        <p className="leading-relaxed" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          3+ years of shipping production systems across AI tooling, mobile apps, and real-time data pipelines. I care deeply about clean architecture, latency, and the tiny details that separate a good product from a great one.
        </p>
      </motion.div>

      {/* Achievement rows */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ staggerChildren: 0.08, delayChildren: 0.38 }}
        className="flex flex-col gap-0"
        style={{ borderTop: '1px solid var(--border-subtle)' }}
      >
        {ACHIEVEMENTS.map(({ icon: Icon, label, value, detail, color, rgb }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.38 + i * 0.09 }}
            className="flex items-center justify-between py-4 group cursor-default"
            style={{ borderBottom: '1px solid var(--border-subtle)' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110" style={{
                background: `rgba(${rgb},0.10)`,
                border: `1px solid rgba(${rgb},0.28)`,
                color,
                boxShadow: `0 0 14px rgba(${rgb},0.14)`,
              }}>
                <Icon size={15} />
              </div>
              <div>
                <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{label}</p>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{detail}</p>
              </div>
            </div>
            <span className="text-xs font-bold font-mono tracking-wide shrink-0" style={{ color }}>{value}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* CV CTA Row */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55, delay: 0.6 }} className="flex items-center gap-3 flex-wrap">
        <a href="/Waleed_CV.pdf" target="_blank" rel="noreferrer"
          className="btn-primary group inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest">
          <Eye size={13} />
          View CV
          <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
        </a>
        <a href="/Waleed_CV.pdf" download="Waleed_CV.pdf"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-300"
          style={{ background: 'rgba(201,176,122,0.07)', border: '1.5px solid rgba(201,176,122,0.25)', color: 'var(--text-muted)', backdropFilter: 'blur(12px)' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,176,122,0.45)'; e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.background = 'rgba(201,176,122,0.12)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,176,122,0.25)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'rgba(201,176,122,0.07)'; }}>
          <Download size={13} />
          Download
        </a>
      </motion.div>
    </div>
  );
});

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-8% 0px -8% 0px' });

  return (
    <section id="about" className="section-flow" ref={ref}>
      <div aria-hidden="true" className="section-glow" style={{ top: '15%', left: '-8%', width: 'clamp(18rem, 36vw, 42rem)', height: 'clamp(18rem, 36vw, 42rem)', background: 'var(--ambient-1)' }} />
      <div aria-hidden="true" className="section-glow" style={{ bottom: '8%', right: '-8%', width: 'clamp(14rem, 28vw, 28rem)', height: 'clamp(14rem, 28vw, 28rem)', background: 'var(--ambient-2)' }} />

      <div className="site-container">
        <SectionReveal className="text-center mb-14">
          <RevealChild i={0}>
            <div className="flex justify-center mb-4">
              <span className="section-chip">About Me</span>
            </div>
          </RevealChild>
          <RevealChild i={1} y={22}>
            <h2 className="section-title">
              The <span className="gradient-text">Engineer</span> Behind the Work
            </h2>
          </RevealChild>
        </SectionReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="col-span-12 lg:col-span-5 flex items-center justify-center">
            <VisualMatrix inView={inView} />
          </div>
          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <EditorialCopy inView={inView} />
          </div>
        </div>
      </div>
    </section>
  );
}
