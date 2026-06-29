import { Github, Linkedin, Twitter, Instagram, ArrowUp, Mail } from 'lucide-react';

const navLinks = [
  { id: 'about',      label: 'About'      },
  { id: 'skills',     label: 'Skills'     },
  { id: 'projects',   label: 'Projects'   },
  { id: 'experience', label: 'Experience' },
  { id: 'cv',         label: 'CV'         },
  { id: 'contact',    label: 'Contact'    },
];

const socials = [
  { icon: Github,    href: 'https://github.com/Waleed-Ahmad16',                        label: 'GitHub'    },
  { icon: Linkedin,  href: 'https://www.linkedin.com/in/waleed-ahmed-098608398/',       label: 'LinkedIn'  },
  { icon: Twitter,   href: 'https://x.com/waleedahmad_16',                             label: 'Twitter'   },
  { icon: Instagram, href: 'https://www.instagram.com/waleed._.16_/',                  label: 'Instagram' },
  { icon: Mail,      href: 'mailto:wa8110270@gmail.com',                               label: 'Email'     },
];

export default function Footer() {
  const year = new Date().getFullYear();

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background: 'var(--bg-overlay)',
        borderTop: '1px solid var(--border-subtle)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        transition: 'background 0.35s ease, border-color 0.35s ease',
      }}
    >      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--border-strong), transparent)' }} />

      <div className="section-glow top-0 left-1/4 w-96 h-32"
        style={{ background: 'var(--ambient-1)' }} />

      <div className="site-container pt-16 pb-8">
        <div className="grid md:grid-cols-3 gap-12 mb-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(201,176,122,0.10)', border: '1px solid rgba(201,176,122,0.30)', boxShadow: '0 0 16px rgba(201,176,122,0.15)' }}>
                <span className="font-display font-black text-base leading-none" style={{ color: 'var(--accent)' }}>W</span>
              </div>
              <span className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>
                Waleed<span style={{ color: 'var(--accent)' }}>.</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs mb-5" style={{ color: 'var(--text-muted)' }}>
              AI Engineer &amp; Web Developer building intelligent systems and responsive digital products.
            </p>
            <div className="text-xs space-y-1.5" style={{ color: 'var(--text-faint)' }}>
              <div>
                Email:{' '}
                <a href="mailto:wa8110270@gmail.com" className="transition-colors" style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                  wa8110270@gmail.com
                </a>
              </div>
              <div>
                Phone:{' '}
                <a href="tel:03714465993" className="transition-colors" style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                  03714465993
                </a>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold mb-4 text-xs uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>
              Quick Links
            </h4>
            <ul className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button onClick={() => scrollTo(link.id)}
                    className="text-sm cursor-pointer transition-colors focus:outline-none"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold mb-4 text-xs uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>
              Connect
            </h4>
            <div className="flex gap-2.5 flex-wrap mb-6">
              {socials.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label} target="_blank" rel="noreferrer"
                  className="p-2.5 rounded-xl transition-all hover:scale-110 cursor-pointer block"
                  style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-subtle)', color: 'var(--text-faint)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.boxShadow = 'var(--shadow-glow)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-faint)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  <Icon size={17} />
                </a>
              ))}
            </div>

            <div className="rounded-xl p-4"
              style={{ background: 'rgba(201,176,122,0.06)', border: '1px solid rgba(201,176,122,0.20)' }}>
              <p className="text-xs mb-1" style={{ color: 'var(--text-faint)' }}>Current Status</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#c9b07a' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--accent)' }}>Open to opportunities</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px mb-8"
          style={{ background: 'linear-gradient(90deg, transparent, var(--border), transparent)' }} />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm" style={{ color: 'var(--text-faint)' }}>© {year} Waleed Ahmad.</p>
          <p className="text-xs" style={{ color: 'var(--text-faint)' }}>
            Designed &amp; Built by{' '}
            <span style={{ color: 'var(--accent-muted)', fontWeight: 600 }}>Waleed</span>
          </p>
          <button
              onClick={() => scrollTo('hero')}
              className="p-2.5 rounded-xl cursor-pointer transition-all focus:outline-none"
              style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-subtle)', color: 'var(--text-faint)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--accent)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-faint)'; }}
              aria-label="Back to top"
            >
              <ArrowUp size={17} />
            </button>
        </div>
      </div>
    </footer>
  );
}
