import { useEffect, useRef, useState } from 'react';

export default function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="about" ref={ref} className="relative min-h-screen flex items-center bg-background">
      <div className="absolute inset-0 bg-hero-gradient opacity-60" />

      <div className="absolute left-0 top-0 w-1/2 h-full opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary) / 0.4) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.4) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="absolute top-[30%] left-[25%] text-primary/10 text-lg">+</div>
      <div className="absolute bottom-[25%] left-[40%] text-primary/10 text-lg">+</div>
      <div className="absolute top-[50%] right-[30%] text-primary/10 text-lg">+</div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 w-full">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 border border-primary/40 px-3 py-1 font-mono text-[10px] tracking-[0.3em] text-primary mb-6">
              UNDERSTANDING
              <span className="inline-block w-[2px] h-3 bg-primary/60" />
              <span className="inline-block w-[2px] h-3 bg-primary/40" />
            </div>
            <h2
              className={`text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-[0.95] tracking-tight text-foreground transition-all duration-700 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              WHAT IS
              <br />
              <span className="flex items-center gap-4">
                <span className="w-10 h-[2px] bg-primary" />
                NOVA AI?
              </span>
            </h2>
          </div>
          <div
            className={`transition-all duration-700 delay-200 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <p className="font-mono text-[12px] leading-[1.8] text-muted-foreground mb-6">
              Nova AI deploys intelligent agents that run locally on your infrastructure. Unlike cloud-based tools that require constant connectivity, our agents work autonomously — processing data, managing workflows, and executing tasks without ever sending your sensitive information outside your network.
            </p>
            <p className="font-mono text-[12px] leading-[1.8] text-muted-foreground">
              From automating customer outreach to handling data entry and document processing, Nova AI transforms how small and medium businesses operate. It's AI that works for you, on your terms.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
