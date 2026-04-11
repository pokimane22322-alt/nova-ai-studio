import { useEffect, useRef, useState } from 'react';

const industries = [
  {
    title: 'MARKETING TEAMS',
    description: 'Use NOVA AI to understand task automation across key workflows and make informed decisions that can guide strategy and execution.',
  },
  {
    title: 'SEO & AGENCIES',
    description: 'Benchmark clients clearly, support automation strategies with evidence and show efficiency gains through shared dashboards and reporting.',
  },
  {
    title: 'PRODUCT MANAGERS',
    description: 'Track how AI handles your workflows, understand how processes evolve over time, and measure productivity improvements.',
  },
];

export default function IndustriesSection() {
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
    <section id="industries" ref={ref} className="relative py-32 px-6 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className={`mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-block border border-nova-cyan/40 px-3 py-1 font-mono text-[10px] tracking-[0.3em] text-nova-cyan mb-4">
            INDUSTRIES
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold leading-[0.95] mb-4">
            <span className="text-foreground">FIND YOUR</span>
            <br />
            <span className="flex items-center gap-4">
              <span className="w-12 h-[2px] bg-nova-cyan" />
              <span className="text-gradient-purple-cyan">INDUSTRY</span>
            </span>
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mt-4 font-mono">
            NOVA AI is built for the teams responsible for how brands are seen, understood and chosen.
          </p>
          <a href="#get-started" className="inline-block mt-6 px-6 py-3 bg-primary text-primary-foreground font-mono text-xs tracking-widest rounded-sm hover:bg-nova-glow transition-colors">
            GET STARTED
          </a>
        </div>

        {/* Industry cards - horizontal scrolling like Solais */}
        <div className="flex gap-6 overflow-x-auto pb-4 -mx-6 px-6 snap-x snap-mandatory">
          {industries.map((ind, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[340px] snap-start border border-border bg-background/60 backdrop-blur-sm p-8 rounded-sm transition-all duration-500 hover:border-nova-purple/40"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(20px)',
                transitionDelay: `${0.3 + i * 0.15}s`,
              }}
            >
              <h3 className="font-heading text-xl font-bold text-foreground mb-4">
                {ind.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-mono mb-8">
                {ind.description}
              </p>
              {/* Decorative bars at bottom */}
              <div className="flex gap-0.5">
                {[...Array(7)].map((_, j) => (
                  <div key={j} className="w-1 h-8 bg-nova-purple/20" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
