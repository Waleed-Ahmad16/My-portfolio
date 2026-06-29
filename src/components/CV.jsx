import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FileText, Download, Eye, Award, BookOpen, Star } from 'lucide-react';

const fadeUp = {
  hidden:  { opacity: 0, y: 36 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.14, duration: 0.6, ease: [0.22,1,0.36,1] },
  }),
};

export default function CV() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="cv" className="section-flow" ref={ref}>
      <div className="section-glow right-[12%] bottom-10 w-72 h-72"
        style={{ background: 'var(--ambient-2)' }} />

      <div className="site-container max-w-4xl">
        <motion.div className="text-center mb-16"
          variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <span className="section-label mb-3 block">Professional Credentials</span>
          <h2 className="section-title">Curriculum <span className="gradient-text">Vitae</span></h2>
          <p className="section-subtitle">Access my detailed professional resume and academic background.</p>
        </motion.div>

        <motion.div
          className="glass-card p-5 sm:p-8 md:p-12"
          variants={fadeUp} custom={1} initial="hidden" animate={inView ? 'visible' : 'hidden'}
        >
          <div className="grid md:grid-cols-3 gap-8 items-center">
            {/* Visual mockup */}
            <div className="md:col-span-1 flex flex-col items-center justify-center p-6 rounded-2xl"
              style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)' }}>
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ background: 'linear-gradient(135deg, #b8a06a 0%, #c9b07a 50%, #ddc88a 100%)', boxShadow: 'var(--shadow-glow)' }}
              >
                <FileText size={30} style={{ color: '#ffffff' }} />
              </div>
              <h4 className="font-display font-bold text-lg text-center" style={{ color: 'var(--text-primary)' }}>Waleed Ahmad</h4>
              <p className="text-xs mt-1 text-center" style={{ color: 'var(--text-muted)' }}>AI Engineer &amp; Web Developer</p>
              <div className="w-full h-px my-4" style={{ background: 'var(--border-subtle)' }} />
              <div className="flex flex-col gap-2 w-full text-xs" style={{ color: 'var(--text-muted)' }}>
                <span className="flex items-center gap-1.5">
                  <Award size={12} style={{ color: 'var(--accent)' }} /> Python &amp; ML
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen size={12} style={{ color: 'var(--accent-dim)' }} /> AI &amp; Web Training
                </span>
                <span className="flex items-center gap-1.5">
                  <Star size={12} style={{ color: 'var(--highlight)' }} /> React &amp; Tailwind
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="md:col-span-2 space-y-6">
              <h3 className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                Looking for a <span className="gradient-text">Full Resume</span>?
              </h3>
              <p className="leading-relaxed text-sm md:text-base" style={{ color: 'var(--text-muted)' }}>
                My resume highlights my technical proficiency, practical learning path, project achievements in AI development, and frontend responsive engineering.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-2">
                <a href="/Waleed_CV.pdf" download="Waleed_CV.pdf"
                  className="btn-primary inline-flex items-center justify-center gap-2 cursor-pointer">
                  <Download size={16} /> Download CV
                </a>
                <a href="/Waleed_CV.pdf" target="_blank" rel="noreferrer"
                  className="btn-outline inline-flex items-center justify-center gap-2 cursor-pointer">
                  <Eye size={16} /> View CV
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
