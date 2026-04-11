import { useEffect, useRef, useState } from 'react';
import HeroScene from './HeroScene';
import HeroCallouts from './HeroCallouts';

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handler = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const progress = Math.max(0, -rect.top / (rect.height * 0.8));
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-[180vh]">
      {/* Sticky container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-hero-gradient" />

        {/* Radial glow spots */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, hsl(268 100% 50% / 0.4), transparent 70%)' }}
        />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, hsl(185 100% 50% / 0.3), transparent 70%)' }}
        />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(hsl(185 100% 50% / 0.3) 1px, transparent 1px),
              linear-gradient(90deg, hsl(185 100% 50% / 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />

        {/* Callouts */}
        <HeroCallouts visible={scrollProgress < 0.3} />

        {/* 3D Scene */}
        <div className="absolute inset-0">
          <HeroScene scrollProgress={scrollProgress} />
        </div>

        {/* Bottom text - like Solais */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-12 z-20">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-8">
            <div>
              <div className="inline-block border border-nova-cyan/40 px-3 py-1 font-mono text-[10px] tracking-[0.3em] text-nova-cyan mb-4">
                AI POWERED
                <span className="inline-block w-1.5 h-3 bg-nova-cyan/60 ml-2 animate-pulse-glow" />
                <span className="inline-block w-1.5 h-3 bg-nova-cyan/40 ml-0.5" />
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-[0.95] tracking-tight">
                <span className="text-foreground">LOCAL AI</span>
                <br />
                <span className="flex items-center gap-4">
                  <span className="w-12 h-[2px] bg-nova-cyan" />
                  <span className="text-gradient-purple-cyan">AGENTS</span>
                </span>
              </h1>
            </div>
            <p className="max-w-sm text-sm text-muted-foreground leading-relaxed font-mono text-right">
              Your business runs on repetitive tasks. Our local AI agents handle them — from customer outreach to data entry — so your team focuses on what matters.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
