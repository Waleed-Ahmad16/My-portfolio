/**
 * Education — Academic Journey
 *
 * Design concept: Premium academic card timeline.
 * Each entry is a glass card with a degree-level badge, institution,
 * duration, and description. The active (current) entry has a distinct
 * "In Progress" state with a glowing border and animated live indicator.
 *
 * Layout: vertical stack on mobile, 3-column equal grid on desktop with
 * a horizontal connecting line behind the cards.
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, MapPin, Calendar, BookOpen } from 'lucide-react';
import { SectionReveal, RevealChild } from './SectionReveal.jsx';

const EDU = [
  {
    id: 1,
    level: 'Secondary',
    badge: 'Matric',
    degree: 'Matriculation',
    institution: 'Govt Higher Secondary School',
    location: 'Pakistan',
    duration: '2019 – 2021',
    current: false,
    desc: 'Completed Matriculation with a strong academic foundation in science and mathematics, developing analytical and problem-solving skills that underpin my technical career.',
    highlights: ['Science stream', 'Mathematics focus', 'Analytical foundation'],
    color: '#9a8858',
  },
  {
    id: 2,
    level: 'Diploma',
    badge: 'Dual Diploma',
    degree: 'Dual Diploma in Software Technology',
    institution: 'GCT & Shenzhen Institute of Information Technology (SZIIT), China',
    location: 'International',
    duration: '2022 – 2025',
    current: false,
    desc: 'Completed a specialized diploma focused on software development, web technologies, programming fundamentals, and practical project-based learning in an international academic environment.',
    highlights: ['Web technologies', 'International curriculum', 'Project-based learning'],
    color: '#b8a06a',
  },
  {
    id: 3,
    level: 'Bachelor',
    badge: 'BSCS',
    degree: 'Bachelor of Science in Computer Science',
    institution: 'University of the Punjab',
    location: 'Lahore, Pakistan',
    duration: '2025 – Present',
    current: true,
    desc: 'Currently pursuing BSCS with focus on software engineering, modern web technologies, artificial intelligence, and advanced computer science concepts.',
    highlights: ['Software Engineering', 'Artificial Intelligence', 'Advanced CS'],
    color: '#c9b07a',
  },
];

const EduCard = memo(function EduCard({ edu, index }) {
  return (
    <motion.div
      className="relative flex flex-col group"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22,1,0.36,1] }}
      whileHover={{ y: -7, scale: 1.012, transition: { duration: 0.35, ease: [0.22,1,0.36,1] } }}
    >
      {/* Timeline node (desktop) */}
      <div className="hidden md:flex absolute -top-8 left-1/2 -translate-x-1/2 flex-col items-center">
        <motion.div
          className="w-4 h-4 rounded-full z-10 flex items-center justify-center"
          style={{
            background: 'var(--bg-primary)',
            border: `3px solid ${edu.color}`,
            boxShadow: `0 0 12px ${edu.color}60`,
          }}
          animate={edu.current ? { boxShadow: [`0 0 8px ${edu.color}50`, `0 0 20px ${edu.color}90`, `0 0 8px ${edu.color}50`] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: edu.color }} />
        </motion.div>
      </div>

      {/* Card */}
      <div
        className="relative overflow-hidden rounded-2xl flex flex-col h-full"
        style={{
          background: edu.current
            ? `linear-gradient(145deg, ${edu.color}0e 0%, var(--glass-bg-2) 40%)`
            : 'var(--glass-bg-2)',
          border: `1px solid ${edu.current ? edu.color + '45' : 'var(--glass-border)'}`,
          backdropFilter: 'blur(24px) saturate(165%)',
          WebkitBackdropFilter: 'blur(24px) saturate(165%)',
          boxShadow: edu.current
            ? `var(--shadow-lg), 0 0 40px ${edu.color}18, inset 0 1px 0 var(--glass-sheen)`
            : 'var(--shadow-md), inset 0 1px 0 var(--glass-sheen)',
          transition: 'box-shadow 0.35s ease, border-color 0.35s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = `${edu.color}65`;
          e.currentTarget.style.boxShadow = `var(--shadow-xl), 0 0 56px ${edu.color}28, inset 0 1px 0 var(--glass-sheen)`;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = edu.current ? edu.color + '45' : 'var(--glass-border)';
          e.currentTarget.style.boxShadow = edu.current
            ? `var(--shadow-lg), 0 0 40px ${edu.color}18, inset 0 1px 0 var(--glass-sheen)`
            : 'var(--shadow-md), inset 0 1px 0 var(--glass-sheen)';
        }}
      >
        {/* Shimmer sweep on hover */}
        <div
          className="absolute top-0 bottom-0 w-1/2 pointer-events-none z-20 opacity-0 group-hover:opacity-100"
          style={{
            left: '-60%',
            background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.07) 40%, ${edu.color}10 60%, transparent 100%)`,
            transform: 'skewX(-18deg)',
            transition: 'left 0.8s cubic-bezier(0.16,1,0.3,1), opacity 0.15s ease',
          }}
          ref={el => {
            if (el) {
              el.parentElement.addEventListener('mouseenter', () => { el.style.left = '160%'; });
              el.parentElement.addEventListener('mouseleave', () => { el.style.left = '-60%'; });
            }
          }}
        />
        {/* Top accent bar */}
        <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${edu.color}, ${edu.color}40, transparent)` }} />

        {/* Mesh pattern bg */}
        <div className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `linear-gradient(${edu.color}10 1px, transparent 1px), linear-gradient(90deg, ${edu.color}10 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
          }} />

        <div className="relative p-6 flex flex-col h-full gap-4">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            {/* Icon */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
              style={{ background: `${edu.color}14`, border: `1px solid ${edu.color}32`, color: edu.color }}>
              <GraduationCap size={22} />
            </div>

            {/* Badges */}
            <div className="flex flex-col items-end gap-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider"
                style={{ background: `${edu.color}18`, border: `1px solid ${edu.color}38`, color: edu.color }}>
                {edu.badge}
              </span>
              {edu.current && (
                <motion.div
                  className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full"
                  style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.32)' }}
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#10b981' }} />
                  <span className="text-[9px] font-bold text-emerald-400">In Progress</span>
                </motion.div>
              )}
            </div>
          </div>

          {/* Degree + institution */}
          <div>
            <h3 className="font-display font-bold text-base leading-tight mb-1"
              style={{ color: 'var(--text-primary)', letterSpacing: '-0.015em' }}>
              {edu.degree}
            </h3>
            <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
              <BookOpen size={11} style={{ color: edu.color }} />
              <span>{edu.institution}</span>
            </div>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-3 text-[10px]" style={{ color: 'var(--text-faint)' }}>
            <span className="flex items-center gap-1"><Calendar size={10} /> {edu.duration}</span>
            <span className="flex items-center gap-1"><MapPin size={10} /> {edu.location}</span>
          </div>

          {/* Description */}
          <p className="text-xs leading-relaxed flex-1" style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>
            {edu.desc}
          </p>

          {/* Highlight chips */}
          <div className="flex flex-wrap gap-1.5 pt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            {edu.highlights.map(h => (
              <span key={h} className="text-[10px] px-2 py-0.5 rounded-md font-medium"
                style={{ background: `${edu.color}10`, border: `1px solid ${edu.color}25`, color: edu.color }}>
                {h}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default function Education() {
  return (
    <section id="education" className="section-flow">
      <div aria-hidden="true" className="section-glow"
        style={{ top: '10%', left: '0', width: 'clamp(12rem,20vw,24rem)', height: 'clamp(12rem,20vw,24rem)', background: 'var(--ambient-2)' }} />

      <div className="site-container">

        <SectionReveal className="text-center mb-16">
          <RevealChild i={0}><span className="section-label mb-3 block">Academic Journey</span></RevealChild>
          <RevealChild i={1} y={22}>
            <h2 className="section-title">My <span className="gradient-text">Education</span></h2>
          </RevealChild>
          <RevealChild i={2} y={16}>
            <p className="section-subtitle">
              A formal academic foundation spanning science, technology, and computer science — with one chapter still being written.
            </p>
          </RevealChild>
        </SectionReveal>

        {/* Timeline container */}
        <div className="relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-0 left-0 right-0 h-px"
            style={{
              top: '-2rem',
              background: 'linear-gradient(90deg, transparent 0%, var(--border) 15%, var(--border-strong) 50%, var(--border) 85%, transparent 100%)',
            }} />

          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            {EDU.map((edu, i) => (
              <EduCard key={edu.id} edu={edu} index={i} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
