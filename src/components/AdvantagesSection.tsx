import { useEffect, useRef, useState } from 'react';

const features = [
  { title: 'Local Processing', desc: 'All data stays on your infrastructure. No cloud dependency, no data leaks.' },
  { title: 'Always Running', desc: 'Agents work 24/7 without breaks, handling tasks even outside business hours.' },
  { title: 'Custom Training', desc: 'Each agent learns your specific workflows, terminology, and business rules.' },
  { title: 'Easy Integration', desc: 'Connects with your existing tools — CRM, email, databases, and more.' },
];

export default function AdvantagesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="advantages" ref={ref} className="relative bg-background overflow-hidden">
      <div className="relative min-h-screen flex items-end pb-20">
        <div className="absolute inset-0 grid-dots" />

        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-foreground/10 text-xs"
            style={{
              top: `${15 + (i % 4) * 25}%`,
              left: `${10 + Math.floor(i / 4) * 35}%`,
            }}
          >
            +
          </div>
        ))}

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 w-full">
          <div
            className={`transition-all duration-700 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="inline-flex items-center gap-2 border border-primary/40 px-3 py-1 font-mono text-[10px] tracking-[0.3em] text-primary mb-6">
              <span className="bg-primary/10 px-1.5 py-0.5 text-primary">WHY</span>
              ADVANTAGE
              <span className="inline-block w-[2px] h-3 bg-primary/60" />
              <span className="inline-block w-[2px] h-3 bg-primary/40" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-[0.95] tracking-tight text-foreground mb-4">
              WHY BUSINESSES
              <br />
              <span className="flex items-center gap-4">
                <span className="w-10 h-[2px] bg-primary" />
                CHOOSE NOVA AI
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {features.map((f, i) => (
              <div
                key={i}
                className={`group border border-border p-6 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-500 ${
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${300 + i * 100}ms` }}
              >
                <div className="w-2 h-2 bg-primary rotate-45 mb-4 group-hover:scale-125 transition-transform" />
                <h3 className="font-heading font-bold text-sm tracking-wide text-foreground mb-3">{f.title}</h3>
                <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA cards on dark gradient */}
      <div className="relative bg-cta-gradient py-20">
        <div className="absolute inset-0 grid-bg-dark" />

        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
          <span className="text-[15vw] font-heading font-bold text-primary-foreground/[0.04] tracking-wider whitespace-nowrap">
            NOVA AI
          </span>
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '◆', title: 'SCHEDULE A DEMO', desc: 'See Nova AI in action and discover how it can work for you.' },
              { icon: '■', title: 'SET YOUR WORKFLOWS', desc: 'Define the processes that shape productivity and automation in your business.' },
              { icon: '▲', title: 'TRACK YOUR EFFICIENCY', desc: 'See how your AI agents perform and improve outcomes over time.' },
            ].map((a, i) => (
              <div
                key={i}
                className={`transition-all duration-700 ${
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${600 + i * 150}ms` }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-primary-foreground/60 text-xs">{a.icon}</span>
                  <h3 className="font-mono text-[12px] tracking-[0.15em] text-primary-foreground font-medium">{a.title}</h3>
                </div>
                <p className="font-mono text-[11px] leading-relaxed text-primary-foreground/60">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
