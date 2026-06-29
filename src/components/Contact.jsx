import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Mail, Send, Phone, MapPin,
  Github, Linkedin, Twitter, Instagram, CheckCircle, AlertCircle,
} from 'lucide-react';
import { SectionReveal, RevealChild } from './SectionReveal.jsx';

const contactInfo = [
  {
    icon: Mail,   label: 'Email',             value: 'wa8110270@gmail.com',
    href: 'mailto:wa8110270@gmail.com',
    iconColor: 'var(--accent)',
  },
  {
    icon: Phone,  label: 'Phone / WhatsApp',  value: '03714465993',
    href: 'tel:03714465993',
    iconColor: 'var(--accent-dim)',
  },
  {
    icon: MapPin, label: 'Location',           value: 'Lahore, Pakistan',
    href: '#',
    iconColor: 'var(--accent-muted)',
  },
];

const socials = [
  { icon: Github,    href: 'https://github.com/Waleed-Ahmad16',                        label: 'GitHub'    },
  { icon: Linkedin,  href: 'https://www.linkedin.com/in/waleed-ahmed-098608398/',       label: 'LinkedIn'  },
  { icon: Twitter,   href: 'https://x.com/waleedahmad_16',                             label: 'Twitter'   },
  { icon: Instagram, href: 'https://www.instagram.com/waleed._.16_/',                  label: 'Instagram' },
];

function InputField({ label, id, type = 'text', value, onChange, placeholder, error }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-2"
        style={{ color: 'var(--text-secondary)' }}>
        {label} <span style={{ color: 'var(--accent)' }}>*</span>
      </label>
      <input
        id={id} type={type} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all duration-200"
        style={{
          background: 'var(--bg-input)',
          border: `1px solid ${error ? 'rgba(239,68,68,0.6)' : 'var(--border-subtle)'}`,
          color: 'var(--text-primary)',
          backdropFilter: 'blur(12px)',
        }}
        onFocus={e => !error && (e.target.style.borderColor = 'var(--border-active)')}
        onBlur={e  => !error && (e.target.style.borderColor = 'var(--border-subtle)')}
      />
      {error && (
        <p className="mt-1.5 text-xs flex items-center gap-1" style={{ color: '#f87171' }}>
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}

export default function Contact() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [form,   setForm]   = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.name.trim())    errs.name    = 'Name is required.';
    if (!form.email.trim())   errs.email   = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email.';
    if (!form.subject.trim()) errs.subject = 'Subject is required.';
    if (!form.message.trim()) errs.message = 'Message is required.';
    else if (form.message.trim().length < 10) errs.message = 'Please write at least 10 characters.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStatus('sending');

    const msg = encodeURIComponent(
      `Hi Waleed! My name is ${form.name}.\n\nSubject: ${form.subject}\n\n${form.message}\n\n- Reach me at: ${form.email}`
    );
    window.open(`https://wa.me/923714465993?text=${msg}`, '_blank');

    setStatus('success');
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setStatus(null), 5000);
  };

  return (
    <section id="contact" className="section-flow" ref={ref}>
      <div className="section-glow left-1/2 top-1/2 w-80 h-80 -translate-x-1/2 -translate-y-1/2"
        style={{ background: 'var(--ambient-2)' }} />

      <div className="site-container">
        <SectionReveal className="text-center mb-16">
          <RevealChild i={0}>
            <span className="section-label mb-3 block">Let&apos;s work together</span>
          </RevealChild>
          <RevealChild i={1} y={22}>
            <h2 className="section-title">Get In <span className="gradient-text">Touch</span></h2>
          </RevealChild>
          <RevealChild i={2} y={16}>
            <p className="section-subtitle">
              Have a project in mind? I&apos;d love to hear about it. Send me a message and let&apos;s build something amazing.
            </p>
          </RevealChild>
        </SectionReveal>

        <div className="grid lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Contact info */}
          <motion.div className="lg:col-span-2 space-y-4"
            initial={{ opacity: 0, x: -36 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}>
            {contactInfo.map(({ icon: Icon, label, value, href, iconColor }) => (
              <a key={label} href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noreferrer' : undefined}
                className="flex items-center gap-4 rounded-2xl p-5 transition-all group cursor-pointer card-base min-w-0"
                style={{
                  background: 'var(--glass-bg-2)',
                  border: '1px solid var(--glass-border)',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                <div className="p-3 rounded-xl flex-shrink-0"
                  style={{ background: 'var(--glass-bg-2)', border: '1px solid var(--border)', color: iconColor }}>
                  <Icon size={18} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs mb-0.5" style={{ color: 'var(--text-faint)' }}>{label}</div>
                  <div className="text-sm font-medium break-words" style={{ color: 'var(--text-secondary)' }}>{value}</div>
                </div>
              </a>
            ))}

            {/* Socials */}
            <div className="card-base rounded-2xl p-5" style={{ background: 'var(--glass-bg-2)', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-md)' }}>
              <p className="text-sm font-medium mb-4" style={{ color: 'var(--text-muted)' }}>Find me on social</p>
              <div className="flex gap-3">
                {socials.map(({ icon: Icon, href, label }) => (
                  <a key={label} href={href} aria-label={label} target="_blank" rel="noreferrer"
                    className="p-3 rounded-xl transition-all hover:scale-110 cursor-pointer block"
                    style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-faint)' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--accent)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-faint)'; }}
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: 'rgba(201,176,122,0.07)', border: '1px solid rgba(201,176,122,0.25)' }}>
              <span className="w-2.5 h-2.5 rounded-full animate-pulse flex-shrink-0" style={{ background: '#c9b07a' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--accent)' }}>Available for new projects</span>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div className="lg:col-span-3"
            initial={{ opacity: 0, x: 36 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}>
            <form onSubmit={handleSubmit}
              className="glass-card p-5 sm:p-8 space-y-5" noValidate>
              <div className="grid sm:grid-cols-2 gap-5">
                <InputField id="name"  label="Full Name"      value={form.name}    onChange={update('name')}    placeholder="John Doe"                    error={errors.name} />
                <InputField id="email" label="Email Address"  type="email"         value={form.email}   onChange={update('email')}   placeholder="john@example.com"            error={errors.email} />
              </div>
              <InputField id="subject" label="Subject"        value={form.subject} onChange={update('subject')} placeholder="Project inquiry / collaboration" error={errors.subject} />

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--text-secondary)' }}>
                  Message <span style={{ color: 'var(--accent)' }}>*</span>
                </label>
                <textarea
                  id="message" value={form.message} onChange={update('message')} rows={6}
                  placeholder="Tell me about your project, timeline, and budget..."
                  className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all duration-200 resize-none"
                  style={{
                    background: 'var(--bg-input)',
                    border: `1px solid ${errors.message ? 'rgba(239,68,68,0.6)' : 'var(--border-subtle)'}`,
                    color: 'var(--text-primary)',
                    backdropFilter: 'blur(12px)',
                  }}
                  onFocus={e => !errors.message && (e.target.style.borderColor = 'var(--border-active)')}
                  onBlur={e  => !errors.message && (e.target.style.borderColor = 'var(--border-subtle)')}
                />
                {errors.message && (
                  <p className="mt-1.5 text-xs flex items-center gap-1" style={{ color: '#f87171' }}>
                    <AlertCircle size={12} /> {errors.message}
                  </p>
                )}
                <p className="mt-1.5 text-xs text-right" style={{ color: 'var(--text-faint)' }}>
                  {form.message.length} / 1000
                </p>
              </div>

              <motion.button
                type="submit"
                disabled={status === 'sending' || status === 'success'}
                className={status !== 'success' ? 'btn-primary w-full py-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer focus:outline-none' : undefined}
                style={status === 'success' ? {
                  width: '100%', padding: '1rem',
                  borderRadius: 'var(--radius-xl)',
                  background: 'rgba(16,185,129,0.12)',
                  border: '1px solid rgba(16,185,129,0.35)',
                  color: '#34d399',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  fontSize: '0.875rem', fontWeight: 600,
                } : undefined}
                whileTap={{ scale: 0.98 }}
              >
                {status === 'sending' ? (
                  <><div className="w-4 h-4 border-2 border-[rgba(255,255,255,0.3)] border-t-white rounded-full animate-spin" /> Connecting to WhatsApp...</>
                ) : status === 'success' ? (
                  <><CheckCircle size={18} /> WhatsApp Redirected!</>
                ) : (
                  <><Send size={16} /> Send Message</>
                )}
              </motion.button>

              {status === 'success' && (
                <motion.p className="text-center text-xs" style={{ color: 'var(--text-faint)' }}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  Redirected to WhatsApp Web. Check your chat window to send the message!
                </motion.p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
