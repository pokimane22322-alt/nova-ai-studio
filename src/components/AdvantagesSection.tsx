import { useEffect, useRef, useState } from 'react';

const advantages = [
  { icon: '◆', title: 'MODEL VISIBILITY', description: 'NOVA AI tracks outputs across leading AI models. Compare how visibility differs and see how patterns trend when normalised across all.' },
  { icon: '◇', title: 'RUNS LOCALLY', description: 'Your data stays on your infrastructure. No cloud dependency, no privacy concerns. AI that works where you work.' },
  { icon: '▣', title: '24/7 WORKFORCE', description: 'AI agents don\'t sleep, take breaks, or call in sick. Consistent, reliable output around the clock.' },
  { icon: '△', title: 'NO-CODE SETUP', description: 'We handle the technical complexity. You get agents configured to your workflows — ready to deploy in days, not months.' },
];

export default function AdvantagesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="advantages" ref={ref} className="relative bg-background">
      {/* Scrolling marquee text */}
      <div className="overflow-hidden py-6 border-y border-border">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(8)].map((_, i) => (
            <span key={i} className="mx-8 text-6xl sm:text-7xl md:text-8xl font-heading font-bold text-foreground/5 flex items-center gap-8">
              NOVA AI
              <span className="w-3 h-3 rotate-45 bg-nova-cyan/10" />
            </span>
          ))}
        </div>
      </div>

      <div className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Title */}
          <div className={`mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-block border border-nova-cyan/40 px-3 py-1 font-mono text-[10px] tracking-[0.3em] text-nova-cyan mb-4">
              YOUR ADVANTAGE
              <span className="inline-block w-1.5 h-3 bg-nova-cyan/60 ml-2" />
              <span className="inline-block w-1.5 h-3 bg-nova-cyan/40 ml-0.5" />
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold leading-[0.95]">
              <span className="text-foreground">WHY BRANDS</span>
              <br />
              <span className="flex items-center gap-4">
                <span className="w-12 h-[2px] bg-nova-cyan" />
                <span className="text-gradient-purple-cyan">CHOOSE NOVA</span>
              </span>
            </h2>
          </div>

          {/* Feature callouts around a center area */}
          <div className="grid md:grid-cols-2 gap-8">
            {advantages.map((a, i) => (
              <div
                key={i}
                className="group p-6 border border-border/50 rounded-sm transition-all duration-500 hover:border-nova-purple/40"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(20px)',
                  transitionDelay: `${0.2 + i * 0.1}s`,
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 border border-nova-cyan/40 flex items-center justify-center text-nova-cyan text-lg">
                    {a.icon}
                  </div>
                  <div>
                    <h3 className="font-mono text-sm tracking-widest text-foreground font-semibold mb-2">
                      {a.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-mono">
                      {a.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
