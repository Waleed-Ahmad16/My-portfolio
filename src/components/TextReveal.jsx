import { motion } from 'framer-motion';

export default function TextReveal({ text, className = '', delay = 0, style = {} }) {
  const words = text.split(' ');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.025,
        delayChildren: delay,
      },
    },
  };

  const childVariants = {
    hidden: {
      y: '115%',
    },
    visible: {
      y: '0%',
      transition: {
        duration: 0.65,
        ease: [0.215, 0.61, 0.355, 1], // Cubic-bezier matching high-end reveal timings
      },
    },
  };

  return (
    <motion.span
      className={`inline-flex flex-wrap ${className}`}
      style={{ ...style, display: 'inline-flex', flexWrap: 'wrap' }}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-8%' }}
    >
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden mr-[0.25em] py-[0.05em]"
          style={{ display: 'inline-block', overflow: 'hidden' }}
        >
          <motion.span
            className="inline-block"
            variants={childVariants}
            style={{ display: 'inline-block', willChange: 'transform' }}
          >
            {word === '' ? '\u00A0' : word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
