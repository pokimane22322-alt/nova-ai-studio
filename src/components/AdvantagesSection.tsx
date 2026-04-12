import { useEffect, useRef, useState } from 'react';

const advantages = [
  {
    title: 'Runs locally',
    description: 'Your data stays on your infrastructure. No cloud dependency, no privacy concerns. AI that works where you work.',
  },
  {
    title: '24/7 workforce',
    description: 'AI agents don\'t sleep, take breaks, or call in sick. Consistent, reliable output around the clock.',
  },
  {
    title: 'No-code setup',
    description: 'We handle the technical complexity. You get agents configured to your workflows — ready to deploy in days, not months.',
  },
  {
    title: 'Cost reduction',
    description: 'Replace repetitive manual tasks with AI that costs a fraction of hiring. Scale without proportional cost increase.',
  },
];

export default function AdvantagesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="advantages" ref={ref} className="relative py-32 px-6">
      {/* Marquee */}
      <div className="overflow-hidden mb-20 border-y border-border py-4">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="mx-8 font-heading text-2xl font-bold text-foreground/10">
              NOVA AI
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-block border border-nova-cyan/40 px-3 py-1 font-mono text-[10px] tracking-[0.3em] text-nova-cyan mb-4">
            YOUR ADVANTAGE
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold leading-[0.95] mb-4">
            <span className="text-foreground">WHY BUSINESSES</span>
            <br />
            <span className="flex items-center gap-4">
              <span className="w-12 h-[2px] bg-nova-cyan" />
              <span className="text-gradient-purple-cyan">CHOOSE NOVA</span>
            </span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mt-16">
          {advantages.map((a, i) => (
            <div
              key={i}
              className="group relative p-8 border border-border rounded-sm overflow-hidden transition-all duration-700 hover:border-nova-purple/40"
              style={{
                background: 'var(--gradient-card)',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(30px)',
                transitionDelay: `${0.2 + i * 0.1}s`,
              }}
            >
              {/* Hover glow effect */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-0 group-hover:opacity-20 transition-opacity"
                style={{ background: 'radial-gradient(circle, hsl(268 100% 50%), transparent 70%)' }}
              />
              <h3 className="font-heading font-semibold text-lg text-foreground mb-3 relative z-10">
                {a.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed relative z-10">
                {a.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
