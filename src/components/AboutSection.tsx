import { useEffect, useRef, useState } from 'react';
import { Bot } from 'lucide-react';

const features = [
  {
    title: 'AI Agent Deployment',
    description: 'Deploy local AI agents that understand your business processes, work 24/7, and integrate seamlessly with your existing tools.',
  },
  {
    title: 'Intelligent Automation',
    description: 'Automate complex workflows — from scheduling and invoicing to customer follow-ups — with AI that learns and adapts.',
  },
  {
    title: 'Website Solutions',
    description: 'Get a high-converting website built and maintained by professionals. We handle design, copy, SEO, and ongoing optimization.',
  },
];

export default function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="about" ref={ref} className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section label */}
        <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-block border border-nova-cyan/40 px-3 py-1 font-mono text-[10px] tracking-[0.3em] text-nova-cyan mb-4">
            UNDERSTANDING
            <span className="inline-block w-1.5 h-3 bg-nova-cyan/60 ml-2" />
            <span className="inline-block w-1.5 h-3 bg-nova-cyan/40 ml-0.5" />
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold leading-[0.95] mb-4">
            <span className="text-foreground">WHAT IS</span>
            <br />
            <span className="flex items-center gap-4">
              <span className="w-12 h-[2px] bg-nova-cyan" />
              <span className="text-gradient-purple-cyan">NOVA AI?</span>
            </span>
          </h2>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {features.map((f, i) => (
            <div
              key={i}
              className={`group p-8 border border-border rounded-sm transition-all duration-700 hover:border-nova-purple/40 hover:glow-purple`}
              style={{
                background: 'var(--gradient-card)',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(30px)',
                transitionDelay: `${0.2 + i * 0.15}s`,
              }}
            >
              <Bot className="w-5 h-5 text-nova-cyan mb-6" />
              <h3 className="font-heading font-semibold text-lg text-foreground mb-3">
                {f.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
