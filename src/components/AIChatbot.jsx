import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, MessageCircle, Send, Sparkles, X } from 'lucide-react';

const initialMessages = [
  {
    role: 'assistant',
    text: 'Hi, I am Waleed portfolio assistant. Ask me about skills, projects, services, or how to contact him.',
  },
];

function getAssistantReply(message) {
  const text = message.toLowerCase();
  if (text.includes('project') || text.includes('work'))
    return 'Waleed works on AI tools, responsive web apps, automation workflows, chatbots, and polished frontend interfaces. The Projects section highlights examples across AI, web, and mobile.';
  if (text.includes('skill') || text.includes('tech') || text.includes('stack'))
    return 'His core stack includes React, Tailwind CSS, JavaScript, Python, machine learning basics, TensorFlow, and frontend performance practices.';
  if (text.includes('cv') || text.includes('resume'))
    return 'You can view or download the CV from the About section or the CV section.';
  if (text.includes('contact') || text.includes('hire') || text.includes('email') || text.includes('whatsapp'))
    return 'Use the Contact section to send a WhatsApp message directly. You can also email Waleed at wa8110270@gmail.com.';
  if (text.includes('ai') || text.includes('chatbot'))
    return 'This assistant is a lightweight simulated portfolio chatbot structured so a real API can be connected later.';
  return 'Waleed focuses on clean interfaces, AI-powered features, responsive web development, and practical automation. Try asking about projects, skills, CV, or contact.';
}

export default function AIChatbot() {
  const [open,     setOpen]     = useState(false);
  const [input,    setInput]    = useState('');
  const [messages, setMessages] = useState(initialMessages);
  const quickPrompts = useMemo(() => ['Projects', 'Skills', 'View CV'], []);

  const sendMessage = (value = input) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setMessages(cur => [...cur,
      { role: 'user',      text: trimmed },
      { role: 'assistant', text: getAssistantReply(trimmed) },
    ]);
    setInput('');
  };

  return (
    <div className="fixed bottom-5 right-5 z-[80]">
      <AnimatePresence>
        {open && (
          <motion.div
            className="mb-4 w-[min(calc(100svw-2rem),24rem)] overflow-hidden rounded-3xl"
            style={{
              background: 'var(--glass-bg-2)',
              border: '1px solid var(--glass-border)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              boxShadow: 'var(--shadow-xl), var(--shadow-glow-lg)',
            }}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{    opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
          >
            {/* Header */}
            <div style={{
              borderBottom: '1px solid var(--border-subtle)',
              background: 'linear-gradient(135deg, var(--glass-sheen-2), transparent)',
              padding: '1rem',
            }}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl"
                    style={{ background: 'var(--glass-bg)', border: '1px solid var(--border)', color: 'var(--accent)' }}>
                    <Bot size={20} />
                  </div>
                  <div>
                    <div className="font-display font-bold" style={{ color: 'var(--text-primary)' }}>AI Assistant</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Portfolio guide</div>
                  </div>
                </div>
                <button type="button" onClick={() => setOpen(false)}
                  className="rounded-xl p-2 transition"
                  style={{ border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                  aria-label="Close chat">
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="max-h-[22rem] space-y-3 overflow-y-auto p-4">
              {messages.map((msg, idx) => (
                <div key={`${msg.role}-${idx}`} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[84%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
                    style={msg.role === 'user'
                      ? { background: 'linear-gradient(135deg, #b8a06a 0%, #c9b07a 100%)', color: '#0a0a0a' }
                      : { background: 'var(--glass-bg)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }
                    }>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick prompts */}
            <div className="flex flex-wrap gap-2 px-4 pb-3">
              {quickPrompts.map(prompt => (
                <button key={prompt} type="button" onClick={() => sendMessage(prompt)}
                  className="rounded-full px-3 py-1.5 text-xs font-medium transition"
                  style={{ background: 'var(--glass-bg)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input */}
            <form className="flex gap-2 p-4" style={{ borderTop: '1px solid var(--border-subtle)' }}
              onSubmit={e => { e.preventDefault(); sendMessage(); }}>
              <input
                value={input} onChange={e => setInput(e.target.value)}
                placeholder="Ask about Waleed..."
                className="min-w-0 flex-1 rounded-2xl px-4 py-3 text-sm outline-none transition"
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
                onFocus={e => e.target.style.borderColor = 'var(--border-active)'}
                onBlur={e  => e.target.style.borderColor = 'var(--border-subtle)'}
              />
              <button type="submit" className="btn-primary px-4 flex-shrink-0" aria-label="Send message">
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger button */}
      <motion.button type="button" onClick={() => setOpen(v => !v)}
        className="group relative ml-auto flex h-14 w-14 items-center justify-center rounded-2xl transition"
        style={{
          background: 'var(--glass-bg-2)',
          border: '1px solid var(--border-strong)',
          color: 'var(--accent)',
          boxShadow: 'var(--shadow-lg), var(--shadow-glow)',
        }}
        whileHover={{ y: -3, scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        aria-label="Open AI assistant">
        <span className="absolute inset-0 rounded-2xl opacity-60 group-hover:opacity-100 transition"
          style={{ background: 'var(--glass-sheen-2)', filter: 'blur(12px)' }} />
        {open ? <X size={22} className="relative" /> : <MessageCircle size={22} className="relative" />}
        <Sparkles size={11} className="absolute right-3 top-3" style={{ color: 'var(--accent-dim)' }} />
      </motion.button>
    </div>
  );
}
