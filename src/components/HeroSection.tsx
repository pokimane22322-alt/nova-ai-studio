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
      const progress = Math.max(0, -rect.top / (rect.height * 0.6));
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-[200vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Cream background */}
        <div className="absolute inset-0 bg-background" />

        {/* Warm radial gradient - left side like Solais */}
        <div className="absolute inset-0 bg-hero-gradient" />

        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Small floating particles */}
        <div className="absolute top-[15%] right-[20%] w-1 h-1 rounded-full bg-primary/20 animate-pulse-glow" />
        <div className="absolute top-[40%] right-[10%] w-1.5 h-1.5 rounded-full bg-primary/15 animate-float" />
        <div className="absolute bottom-[30%] left-[15%] w-1 h-1 rounded-full bg-primary/20 animate-pulse-glow" style={{ animationDelay: '1s' }} />

        {/* Callouts - right side */}
        <HeroCallouts visible={scrollProgress < 0.3} />

        {/* 3D Scene - centered */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full max-w-2xl max-h-[65vh]">
            <HeroScene scrollProgress={scrollProgress} />
          </div>
        </div>

        {/* Bottom-left title block */}
        <div
          className="absolute bottom-0 left-0 right-0 px-6 pb-10 z-20"
          style={{
            opacity: Math.max(0, 1 - scrollProgress * 3),
            transform: `translateY(${scrollProgress * 40}px)`,
          }}
        >
          <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-end gap-8">
            <div>
              <div className="inline-flex items-center gap-2 border border-primary/40 px-3 py-1 font-mono text-[10px] tracking-[0.3em] text-primary mb-4">
                AI POWERED
                <span className="inline-block w-[2px] h-3 bg-primary/60 animate-pulse-glow" />
                <span className="inline-block w-[2px] h-3 bg-primary/40" />
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-[0.95] tracking-tight text-foreground">
                LOCAL AI
                <br />
                <span className="flex items-center gap-4">
                  <span className="w-12 h-[2px] bg-primary" />
                  <span className="text-foreground">AGENTS</span>
                </span>
              </h1>
            </div>
            <p className="max-w-sm text-[11px] text-muted-foreground leading-relaxed font-mono text-right">
              Your business runs on repetitive tasks. Our local AI agents handle them — from customer outreach to data entry — so your team focuses on what matters.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
