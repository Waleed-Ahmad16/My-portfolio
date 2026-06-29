/**
 * Achievements — Special Achievements Section
 *
 * Location: After Experience, before Contact.
 * Design: Consistent with Education & Experience glass card system.
 * Hover: lift + border glow + shimmer sweep (matching Education/Experience).
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Award, Code2, Wrench } from 'lucide-react';
import { SectionReveal, RevealChild } from './SectionReveal.jsx';

const ACHIEVEMENTS = [
  {
    id: 1,
    icon: Award,
    title: 'Artificial Intelligence Training — Data Annotation',
    org: 'CPTIC Initiative · Shenzhen Institute of Information Technology (SZIIT), China',
    color: '#c9b07a',
    desc: 'Successfully completed the Artificial Intelligence Training (Data Annotation) program under the prestigious CPTIC Initiative at SZIIT, China — gaining hands-on expertise in labeling image, video, and text datasets for production AI systems.',
    tags: ['AI Training', 'Data Annotation', 'CPTIC', 'SZIIT China'],
  },
  {
    id: 2,
    icon: Code2,
    title: 'Professional Training — Python Programming',
    org: '3-Month Intensive Course',
    color: '#b8a06a',
    desc: 'Completed a structured 3-month professional training course in Python Programming, focusing on practical problem-solving, automation scripting, data handling, and real-world application development.',
    tags: ['Python', 'Automation', 'Problem Solving', 'Professional Training'],
  },
  {
    id: 3,
    icon: Wrench,
    title: 'Vocational Skills Training Program',
    org: 'Comprehensive Professional Development',
    color: '#9a8858',
    desc: 'Accomplished a comprehensive Vocational Skills Training Program that enhanced both technical and professional competencies — including collaborative workflows, technical documentation, and industry-standard development practices.',
    tags: ['Vocational Training', 'Professional Development', 'Technical Skills'],
  },
];

const AchievementCard = memo(function AchievementCard({ item, index }) {
  const Icon = item.icon;

  return (
    <motion.div
      className="group/card relative overflow-hidden rounded-2xl flex flex-col"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22,1,0.36,1] }}
    >
      {/* Card body */}
      <div
        className="relative flex flex-col h-full rounded-2xl overflow-hidden cursor-default"
        style={{
          background: 'var(--glass-bg-2)',
          border: `1px solid var(--glass-border)`,
          backdropFilter: 'blur(24px) saturate(165%)',
          WebkitBackdropFilter: 'blur(24px) saturate(165%)',
          boxShadow: 'var(--shadow-md), inset 0 1px 0 var(--glass-sheen)',
        }}
      >
        {/* Top accent bar */}
        <div className="h-1 w-full shrink-0"
          style={{ background: `linear-gradient(90deg, ${item.color}, ${item.color}40, transparent)` }} />

        {/* Mesh pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.15]"
          style={{
            backgroundImage: `linear-gradient(${item.color}12 1px, transparent 1px), linear-gradient(90deg, ${item.color}12 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
          }} />

        <div className="relative p-6 flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
              style={{ background: `${item.color}14`, border: `1px solid ${item.color}32`, color: item.color }}>
              <Icon size={22} />
            </div>
            <div className="min-w-0">
              <h3 className="font-display font-bold text-base leading-tight"
                style={{ color: 'var(--text-primary)', letterSpacing: '-0.015em' }}>
                {item.title}
              </h3>
              <div className="text-[11px] mt-1 font-medium" style={{ color: item.color }}>
                {item.org}
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>
            {item.desc}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            {item.tags.map(t => (
              <span key={t} className="text-[10px] px-2 py-0.5 rounded-md font-medium"
                style={{ background: `${item.color}10`, border: `1px solid ${item.color}25`, color: item.color }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default function Achievements() {
  return (
    <section id="achievements" className="section-flow">
      <div aria-hidden="true" className="section-glow"
        style={{ top: '10%', right: '0', width: 'clamp(12rem,18vw,22rem)', height: 'clamp(12rem,18vw,22rem)', background: 'var(--ambient-1)' }} />
      <div aria-hidden="true" className="section-glow"
        style={{ bottom: '5%', left: '0', width: 'clamp(10rem,15vw,18rem)', height: 'clamp(10rem,15vw,18rem)', background: 'var(--ambient-2)' }} />
      <div className="site-container">

        <SectionReveal className="text-center mb-14">
          <RevealChild i={0}><span className="section-label mb-3 block">Certifications &amp; Training</span></RevealChild>
          <RevealChild i={1} y={22}>
            <h2 className="section-title">Special <span className="gradient-text">Achievements</span></h2>
          </RevealChild>
          <RevealChild i={2} y={16}>
            <p className="section-subtitle">
              Formal recognitions, professional certifications, and intensive training programs that validate expertise beyond academic credentials.
            </p>
          </RevealChild>
        </SectionReveal>

        <SectionReveal delay={0.12}>
          <RevealChild i={0} y={24} scale>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {ACHIEVEMENTS.map((item, i) => (
                <AchievementCard key={item.id} item={item} index={i} />
              ))}
            </div>
          </RevealChild>
        </SectionReveal>

      </div>
    </section>
  );
}
