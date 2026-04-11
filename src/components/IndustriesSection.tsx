import { useRef, useState, useEffect } from 'react';

const industries = [
  { name: 'Real Estate', desc: 'Automate lead qualification, property matching, and client follow-ups with AI agents that understand your market.' },
  { name: 'Healthcare', desc: 'Streamline patient scheduling, records management, and billing processes while keeping data secure on-premise.' },
  { name: 'Legal', desc: 'Accelerate document review, contract analysis, and case research with agents trained on legal workflows.' },
  { name: 'E-Commerce', desc: 'Handle customer inquiries, inventory updates, and order processing around the clock without cloud dependency.' },
  { name: 'Finance', desc: 'Automate compliance checks, report generation, and data reconciliation with locally-deployed agents.' },
  { name: 'Marketing', desc: 'Scale content creation, campaign analytics, and audience segmentation with private AI agents.' },
];

export default function IndustriesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { threshold: 0.2 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="industries" ref={sectionRef} className="relative bg-background py-24">
      <div className="absolute inset-0 grid-dots opacity-50" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 mb-12">
        <div
          className={`transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 border border-primary/40 px-3 py-1 font-mono text-[10px] tracking-[0.3em] text-primary mb-6">
            SECTORS
            <span className="inline-block w-[2px] h-3 bg-primary/60" />
            <span className="inline-block w-[2px] h-3 bg-primary/40" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-[0.95] tracking-tight text-foreground">
            INDUSTRIES
            <br />
            <span className="flex items-center gap-4">
              <span className="w-10 h-[2px] bg-primary" />
              WE SERVE
            </span>
          </h2>
        </div>
      </div>

      <div className="relative z-10">
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto px-6 pb-6 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none' }}
        >
          <div className="shrink-0 w-[calc((100vw-1400px)/2+24px)] max-w-[200px]" />
          {industries.map((ind, i) => (
            <div
              key={i}
              className={`shrink-0 w-[320px] snap-start border border-border p-8 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-500 group ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${200 + i * 100}ms` }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 border border-primary/30 flex items-center justify-center text-primary text-[10px] font-mono">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-heading font-bold text-base tracking-wide text-foreground">{ind.name}</h3>
              </div>
              <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">{ind.desc}</p>
              <div className="mt-6 w-0 group-hover:w-full h-[1px] bg-primary/30 transition-all duration-500" />
            </div>
          ))}
          <div className="shrink-0 w-12" />
        </div>
      </div>
    </section>
  );
}
