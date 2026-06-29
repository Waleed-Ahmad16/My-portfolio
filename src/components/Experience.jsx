/**
 * Experience — Professional Career Timeline
 *
 * Design concept: Premium left-bordered career stack.
 * Each role is a full-width glass card with:
 *   - Role title prominent at top
 *   - Company + location inline
 *   - Duration badge
 *   - Responsibility bullets with glow dots
 *   - Tech/skill tags
 * The most recent role ("current") has an elevated glow state and
 * an animated "Now" indicator.
 *
 * Visual identity is distinct from Education:
 *   - Horizontal connecting timeline on left (not top)
 *   - Cards are full-width stacked (not a grid)
 *   - Role number anchors each card
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { SectionReveal, RevealChild } from './SectionReveal.jsx';

const JOBS = [
  {
    id: 1,
    role: 'Web Developer',
    company: 'The Codrax',
    location: 'Remote',
    duration: 'Feb 2026 – Present',
    current: true,
    color: '#c9b07a',
    responsibilities: [
      'Building and maintaining high-performance web applications for client projects.',
      'Developing modern user interfaces using industry best practices and reusable components.',
      'Integrating APIs and dynamic functionalities into scalable digital solutions.',
      'Optimizing application speed, responsiveness, and accessibility across devices.',
      'Contributing to innovative product development and business growth initiatives.',
    ],
    tags: ['React', 'Next.js', 'API Integration', 'Performance', 'Accessibility'],
  },
  {
    id: 2,
    role: 'Frontend Developer',
    company: 'TR Innova Tech',
    location: 'Remote',
    duration: 'July 2025 – Feb 2026',
    current: false,
    color: '#b8a06a',
    responsibilities: [
      'Developed modern, responsive websites and web applications from design to deployment.',
      'Converted UI/UX designs into fully functional, pixel-perfect interfaces.',
      'Optimized website performance and user experience through best practices.',
      'Built reusable component systems with modern frontend technologies.',
      'Collaborated cross-functionally to deliver scalable digital solutions on schedule.',
    ],
    tags: ['React', 'Tailwind CSS', 'UI/UX', 'Performance Optimization', 'Components'],
  },
  {
    id: 3,
    role: 'Part-Time Assistant & Web Development Intern',
    company: 'Shenzhen Institute of Information Technology (SZIIT), China',
    location: 'Shenzhen, China',
    duration: 'Dec 2024 – June 2025',
    current: false,
    color: '#9a8858',
    responsibilities: [
      'Assisted faculty and students with technical tasks and project coordination.',
      'Developed and maintained responsive web applications using HTML, CSS, and JavaScript.',
      'Collaborated on UI/UX improvements and front-end implementation for academic platforms.',
      'Participated in training sessions and gained practical software development experience.',
      'Operated within a collaborative international academic and technical environment.',
    ],
    tags: ['HTML', 'CSS', 'JavaScript', 'UI/UX', 'Academic Tech'],
  },
];

const JobCard = memo(function JobCard({ job, index }) {
  return (
    <motion.div
      className="relative flex gap-6"
      initial={{ opacity: 0, x: -28 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22,1,0.36,1] }}
      whileHover={{ x: 4, transition: { duration: 0.32, ease: [0.22,1,0.36,1] } }}
    >
      {/* Left timeline column */}
      <div className="hidden sm:flex flex-col items-center shrink-0 w-12">
        {/* Node */}
        <motion.div
          className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full mt-1"
          style={{
            background: `${job.color}14`,
            border: `2px solid ${job.color}${job.current ? '70' : '40'}`,
            boxShadow: job.current ? `0 0 20px ${job.color}40` : 'none',
          }}
          animate={job.current ? { boxShadow: [`0 0 10px ${job.color}30`, `0 0 28px ${job.color}60`, `0 0 10px ${job.color}30`] } : {}}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <Briefcase size={16} style={{ color: job.color }} />
        </motion.div>
        {/* Vertical connector */}
        {index < JOBS.length - 1 && (
          <div className="flex-1 w-px mt-3"
            style={{ background: `linear-gradient(to bottom, ${job.color}40, var(--border-subtle))` }} />
        )}
      </div>

      {/* Card */}
      <div className="flex-1 mb-8 sm:mb-12 last:mb-0">
        <div
          className="group/card relative overflow-hidden rounded-2xl"
          style={{
            background: job.current
              ? `linear-gradient(135deg, ${job.color}0c 0%, var(--glass-bg-2) 50%)`
              : 'var(--glass-bg-2)',
            border: `1px solid ${job.current ? job.color + '40' : 'var(--glass-border)'}`,
            backdropFilter: 'blur(24px) saturate(165%)',
            WebkitBackdropFilter: 'blur(24px) saturate(165%)',
            boxShadow: job.current
              ? `var(--shadow-lg), 0 0 40px ${job.color}14, inset 0 1px 0 var(--glass-sheen)`
              : 'var(--shadow-md), inset 0 1px 0 var(--glass-sheen)',
            transition: 'box-shadow 0.35s ease, border-color 0.35s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = `${job.color}60`;
            e.currentTarget.style.boxShadow = `var(--shadow-xl), 0 0 56px ${job.color}24, inset 0 1px 0 var(--glass-sheen)`;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = job.current ? `${job.color}40` : 'var(--glass-border)';
            e.currentTarget.style.boxShadow = job.current
              ? `var(--shadow-lg), 0 0 40px ${job.color}14, inset 0 1px 0 var(--glass-sheen)`
              : 'var(--shadow-md), inset 0 1px 0 var(--glass-sheen)';
          }}
        >
          {/* Shimmer sweep on hover */}
          <div
            className="absolute top-0 bottom-0 w-2/5 pointer-events-none z-20 opacity-0 group-hover/card:opacity-100"
            style={{
              left: '-55%',
              background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 40%, ${job.color}0d 60%, transparent 100%)`,
              transform: 'skewX(-16deg)',
              transition: 'left 0.9s cubic-bezier(0.16,1,0.3,1), opacity 0.15s ease',
            }}
            ref={el => {
              if (el) {
                el.parentElement.addEventListener('mouseenter', () => { el.style.left = '160%'; });
                el.parentElement.addEventListener('mouseleave', () => { el.style.left = '-55%'; });
              }
            }}
          />
          {/* Left accent border */}
          <div className="absolute top-0 left-0 bottom-0 w-0.5"
            style={{ background: `linear-gradient(180deg, ${job.color}, ${job.color}30, transparent)` }} />

          <div className="p-6 pl-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap mb-1">
                  <h3 className="font-display font-bold text-xl"
                    style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                    {job.role}
                  </h3>
                  {job.current && (
                    <motion.span
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider"
                      style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.35)', color: '#10b981' }}
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#10b981' }} />
                      Current
                    </motion.span>
                  )}
                </div>
                <div className="font-semibold text-sm" style={{ color: job.color }}>
                  {job.company}
                </div>
              </div>

              {/* Duration + location */}
              <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
                <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full"
                  style={{ background: `${job.color}10`, border: `1px solid ${job.color}28`, color: 'var(--text-secondary)' }}>
                  <Calendar size={10} style={{ color: job.color }} />
                  {job.duration}
                </span>
                <span className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--text-faint)' }}>
                  <MapPin size={10} /> {job.location}
                </span>
              </div>
            </div>

            {/* Responsibilities */}
            <div className="space-y-2 mb-5">
              {job.responsibilities.map((r, ri) => (
                <motion.div key={ri}
                  className="flex items-start gap-2.5 text-xs"
                  style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + ri * 0.05 + 0.2, duration: 0.4 }}
                >
                  <ArrowRight size={10} className="mt-1 shrink-0" style={{ color: job.color }} />
                  <span>{r}</span>
                </motion.div>
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              {job.tags.map(t => (
                <span key={t} className="text-[10px] px-2.5 py-0.5 rounded-full font-medium"
                  style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default function Experience() {
  return (
    <section id="experience" className="section-flow">
      <div aria-hidden="true" className="section-glow"
        style={{ top: '10%', right: '0', width: 'clamp(12rem,20vw,24rem)', height: 'clamp(12rem,20vw,24rem)', background: 'var(--ambient-1)' }} />

      <div className="site-container max-w-4xl">

        <SectionReveal className="text-center mb-16">
          <RevealChild i={0}><span className="section-label mb-3 block">Career History</span></RevealChild>
          <RevealChild i={1} y={22}>
            <h2 className="section-title">Work <span className="gradient-text">Experience</span></h2>
          </RevealChild>
          <RevealChild i={2} y={16}>
            <p className="section-subtitle">
              A track record of delivering production systems — from international academic environments to remote product teams.
            </p>
          </RevealChild>
        </SectionReveal>

        {/* Career stack */}
        <div className="relative">
          {JOBS.map((job, i) => (
            <JobCard key={job.id} job={job} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}
