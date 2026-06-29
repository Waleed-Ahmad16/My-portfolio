/**
 * Skills & Expertise — Premium Badge-Pill UI
 *
 * Layout:
 *  • 2-column split: left = intro + category tabs, right = skill grid
 *  • Categories: Frontend / AI·ML / Backend·Tools / Leadership
 *  • Each skill: large icon circle + name + tech pill badges
 *  • NO progress bars — replaced with badge-pill tech tags
 *  • Highlight glow for top skills
 *  • Staggered fade-in on scroll via SectionReveal
 *  • Dark + light theme adaptive
 */

import { useState, useRef, memo } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Code2, Layers, Braces, Terminal, Brain, Bot,
  Users, Palette, Plug, Smartphone, Wind, Boxes,
  PenTool, Zap, Award,
} from 'lucide-react';
import { SectionReveal, RevealChild } from './SectionReveal.jsx';

/* ═══════════════════════════════════════════════════════════════
   SKILL DATA
   ══════════════════════════════════════════════════════════════ */
const CATEGORIES = [
  { id: 'all',        label: 'All Skills' },
  { id: 'frontend',   label: 'Frontend' },
  { id: 'ai',        label: 'AI · ML' },
  { id: 'backend',   label: 'Backend · Tools' },
  { id: 'leadership',label: 'Leadership' },
];

const SKILLS = [
  /* ── Frontend ─────────────────────────────────── */
  {
    id: 'nextjs', category: 'frontend',
    title: 'Next.js', icon: Layers,
    highlight: true,
    accent: '#c9b07a', accentRgb: '201,176,122',
    tech: ['App Router', 'SSR/SSG', 'ISR', 'Middleware'],
  },
  {
    id: 'react', category: 'frontend',
    title: 'React.js', icon: Code2,
    highlight: false,
    accent: '#b8a06a', accentRgb: '184,160,106',
    tech: ['Hooks', 'Context', 'Suspense', 'Portals'],
  },
  {
    id: 'jsts', category: 'frontend',
    title: 'JavaScript / TypeScript', icon: Braces,
    highlight: false,
    accent: '#c9b07a', accentRgb: '201,176,122',
    tech: ['ES2024', 'TypeScript', 'Zod', 'Generics'],
  },
  {
    id: 'tailwind', category: 'frontend',
    title: 'Tailwind CSS', icon: Wind,
    highlight: false,
    accent: '#9a8858', accentRgb: '154,136,88',
    tech: ['JIT', 'Custom Theme', 'Plugins', 'Dark Mode'],
  },
  {
    id: 'uiux', category: 'frontend',
    title: 'UI / UX Development', icon: Palette,
    highlight: false,
    accent: '#b8a06a', accentRgb: '184,160,106',
    tech: ['Figma', 'Motion', 'A11y', 'Design Systems'],
  },
  {
    id: 'responsive', category: 'frontend',
    title: 'Responsive Design', icon: Smartphone,
    highlight: false,
    accent: '#9a8858', accentRgb: '154,136,88',
    tech: ['Mobile-First', 'CSS Grid', 'Flexbox'],
  },

  /* ── AI · ML ──────────────────────────────────── */
  {
    id: 'ai-web', category: 'ai',
    title: 'AI Web Development', icon: Bot,
    highlight: true,
    accent: '#c9b07a', accentRgb: '201,176,122',
    tech: ['OpenAI', 'LangChain', 'RAG', 'Embeddings'],
  },
  {
    id: 'ml', category: 'ai',
    title: 'Machine Learning', icon: Brain,
    highlight: true,
    accent: '#ddc88a', accentRgb: '221,200,138',
    tech: ['TensorFlow', 'Scikit-learn', 'PyTorch'],
  },
  {
    id: 'python', category: 'ai',
    title: 'Python', icon: Terminal,
    highlight: false,
    accent: '#b8a06a', accentRgb: '184,160,106',
    tech: ['FastAPI', 'asyncio', 'Pydantic', 'NumPy'],
  },

  /* ── Backend · Tools ──────────────────────────── */
  {
    id: 'api', category: 'backend',
    title: 'API Integration', icon: Plug,
    highlight: false,
    accent: '#9a8858', accentRgb: '154,136,88',
    tech: ['REST', 'GraphQL', 'WebSockets', 'gRPC'],
  },
  {
    id: 'architecture', category: 'backend',
    title: 'Frontend Architecture', icon: Boxes,
    highlight: false,
    accent: '#c9b07a', accentRgb: '201,176,122',
    tech: ['Monorepo', 'State Mgmt', 'Micro-FE'],
  },

  /* ── Leadership ───────────────────────────────── */
  {
    id: 'lead', category: 'leadership',
    title: 'Team Leadership', icon: Users,
    highlight: false,
    accent: '#b8a06a', accentRgb: '184,160,106',
    tech: ['Agile', 'Mentoring', 'Code Review', 'Scrum'],
  },
  {
    id: 'visual', category: 'leadership',
    title: 'Visual Design', icon: PenTool,
    highlight: false,
    accent: '#c9b07a', accentRgb: '201,176,122',
    tech: ['Typography', 'Glassmorphism', 'Color Theory'],
  },
];

/* ═══════════════════════════════════════════════════════════════
   SKILL CHIP CARD — Premium badge-pill layout (no progress bars)
   ══════════════════════════════════════════════════════════════ */
const SkillChip = memo(function SkillChip({ skill, index, inView }) {
  const Icon = skill.icon;

  return (
    <motion.div
      className="w-full h-full"
      variants={{
        hidden:  { opacity: 0, y: 20, scale: 0.94 },
        visible: {
          opacity: 1, y: 0, scale: 1,
          transition: { delay: index * 0.05, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
        },
      }}
    >
      <div
        className={`skills-chip h-full w-full${skill.highlight ? ' skills-chip--highlight' : ''}`}
        style={{
          '--chip-accent': skill.accent,
          '--chip-rgb': skill.accentRgb,
        }}
      >
        {/* Glow aura for highlighted skills */}
        {skill.highlight && (
          <div className="skills-chip__glow" aria-hidden="true" />
        )}

        {/* Top sheen line */}
        <div className="absolute top-0 left-0 right-0 h-px pointer-events-none" style={{
          background: `linear-gradient(90deg, transparent, rgba(${skill.accentRgb},0.55), transparent)`,
          zIndex: 2,
        }} />

        {/* Header: icon + name */}
        <div className="skills-chip__header">
          <div className="skills-chip__icon-wrap" style={{
            boxShadow: `0 0 18px rgba(${skill.accentRgb},0.22)`,
          }}>
            <Icon size={17} strokeWidth={1.7} style={{ color: skill.accent }} />
          </div>

          <div className="skills-chip__name-col">
            <div className="skills-chip__name">
              {skill.title}
              {skill.highlight && (
                <span className="skills-chip__star">
                  <Zap size={9} />
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tech pill badges — replacing progress bar */}
        <div className="skills-chip__tech-pills">
          {skill.tech.map(t => (
            <span key={t} className="skills-chip__pill">
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
});

/* ═══════════════════════════════════════════════════════════════
   CATEGORY TAB
   ══════════════════════════════════════════════════════════════ */
const CategoryTab = memo(function CategoryTab({ cat, active, onClick }) {
  return (
    <button
      onClick={() => onClick(cat.id)}
      className={`skills-tab${active ? ' skills-tab--active' : ''} focus:outline-none`}
      aria-pressed={active}
    >
      {cat.label}
    </button>
  );
});

/* ═══════════════════════════════════════════════════════════════
   SKILL GRID — right panel
   ══════════════════════════════════════════════════════════════ */
const SkillGrid = memo(function SkillGrid({ filtered }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-5% 0px -5% 0px' });

  return (
    <motion.div
      ref={ref}
      className="skills-grid"
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
    >
      {filtered.map((skill, i) => (
        <SkillChip key={skill.id} skill={skill} index={i} inView={inView} />
      ))}
    </motion.div>
  );
});

/* ═══════════════════════════════════════════════════════════════
   MAIN EXPORT
   ══════════════════════════════════════════════════════════════ */
export default function Skills() {
  const [activeTab, setActiveTab] = useState('all');

  const filtered = activeTab === 'all'
    ? SKILLS
    : SKILLS.filter(s => s.category === activeTab);

  return (
    <section
      id="skills"
      className="section-flow skills-section"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 700px' }}
    >
      {/* ── Background mesh blobs — stronger ── */}
      <div aria-hidden="true" className="skills-blob skills-blob--tl" />
      <div aria-hidden="true" className="skills-blob skills-blob--br" />
      <div aria-hidden="true" className="skills-blob skills-blob--center" />

      {/* ── Grid texture overlay ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none grid-bg"
        style={{ opacity: 0.025, zIndex: 0 }}
      />

      <div className="site-container relative z-10">

        {/* ── Section header ── */}
        <SectionReveal className="text-center mb-10 md:mb-14">
          <RevealChild i={0}>
            <div className="flex justify-center mb-4">
              <span className="section-chip">Technical Profile</span>
            </div>
          </RevealChild>
          <RevealChild i={1} y={22}>
            <h2 className="section-title">
              Skills &amp; <span className="gradient-text">Expertise</span>
            </h2>
          </RevealChild>
          <RevealChild i={2} y={14}>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>
              A curated view of the tools, frameworks, and disciplines I bring to every project.
            </p>
          </RevealChild>
        </SectionReveal>

        {/* ── 2-Column Split ── */}
        <div className="skills-layout">

          {/* ════════════════════════════
              LEFT — Intro + Tabs
              ════════════════════════════ */}
          <SectionReveal className="skills-left">

            {/* Experience badge */}
            <RevealChild i={0} scale>
              <div className="skills-exp-badge">
                <Award size={14} />
                <span>3+ Years Professional Experience</span>
              </div>
            </RevealChild>

            {/* Intro heading */}
            <RevealChild i={1} y={24}>
              <h3 className="skills-intro-heading">
                Crafting digital<br />
                <span className="gradient-text">excellence</span> with<br />
                modern tooling.
              </h3>
            </RevealChild>

            {/* Intro body */}
            <RevealChild i={2} y={18}>
              <p className="skills-intro-body">
                From pixel-perfect frontends with Next.js & React, to intelligent AI pipelines
                powered by Python & LangChain — I build end-to-end digital products that
                are fast, beautiful, and production-ready.
              </p>
            </RevealChild>

            {/* Stat row */}
            <RevealChild i={3} y={14}>
              <div className="skills-stat-row">
                {[
                  { val: '13+', label: 'Technologies', color: '#c9b07a' },
                  { val: '10+', label: 'Projects Shipped', color: '#b8a06a' },
                  { val: '100%', label: 'Success Rate', color: '#9a8858' },
                ].map(({ val, label, color }) => (
                  <div key={label} className="skills-stat">
                    <div
                      className="skills-stat__val"
                      style={{
                        color,
                        textShadow: `0 0 20px ${color}88`,
                      }}
                    >{val}</div>
                    <div className="skills-stat__label">{label}</div>
                  </div>
                ))}
              </div>
            </RevealChild>

            {/* Category tabs */}
            <RevealChild i={4} y={10}>
              <div className="skills-tabs" role="tablist" aria-label="Skill categories">
                {CATEGORIES.map(cat => (
                  <CategoryTab
                    key={cat.id}
                    cat={cat}
                    active={activeTab === cat.id}
                    onClick={setActiveTab}
                  />
                ))}
              </div>
            </RevealChild>

          </SectionReveal>

          {/* ════════════════════════════
              RIGHT — Skill Grid
              ════════════════════════════ */}
          <div className="skills-right">
            {/* Ambient glow behind grid */}
            <div aria-hidden="true" className="skills-right__glow" />

            <SkillGrid key={activeTab} filtered={filtered} />
          </div>

        </div>
      </div>
    </section>
  );
}
