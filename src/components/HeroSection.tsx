import { useEffect, useRef, useState } from 'react';
import HeroScene from './HeroScene';
import HeroCallouts from './HeroCallouts';
import { Bot } from 'lucide-react';

const boards = [
  {
    title: 'Website Solutions',
    description: 'Get a high-converting website built and maintained by professionals. We handle design, copy, SEO, and ongoing optimization.',
  },
  {
    title: 'AI Agent Deployment',
    description: 'Deploy local AI agents that understand your business processes, work 24/7, and integrate seamlessly with your existing tools.',
  },
  {
    title: 'Intelligent Automation',
    description: 'Automate complex workflows — from scheduling and invoicing to customer follow-ups — with AI that learns and adapts.',
  },
  {
    title: 'Internal Apps',
    description: 'Custom internal tools and apps for businesses and startups — dashboards, CRMs, and operational software tailored to how your team actually works.',
  },
];

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handler = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Board visibility: each board gets a segment of scroll
  // Phase: 0-0.15 disassemble, 0.15-0.25 fade out blocks
  // 0.25-0.42 board1, 0.42-0.59 board2, 0.59-0.76 board3
  // 0.76-0.92 reassemble, 0.92-1.0 settled
  const getBoardOpacity = (index: number) => {
    const segment = 0.14;
    const boardStart = 0.2 + index * segment;
    const boardEnd = boardStart + segment;
    const fadeIn = 0.035;
    const fadeOut = 0.035;

    if (scrollProgress < boardStart || scrollProgress > boardEnd) return 0;
    if (scrollProgress < boardStart + fadeIn) return (scrollProgress - boardStart) / fadeIn;
    if (scrollProgress > boardEnd - fadeOut) return (boardEnd - scrollProgress) / fadeOut;
    return 1;
  };

  const getBoardTranslateY = (index: number) => {
    const segment = 0.14;
    const boardStart = 0.2 + index * segment;
    const boardEnd = boardStart + segment;
    const mid = (boardStart + boardEnd) / 2;

    if (scrollProgress < boardStart) return 60;
    if (scrollProgress > boardEnd) return -60;
    if (scrollProgress < mid) {
      const t = (scrollProgress - boardStart) / (mid - boardStart);
      return 60 * (1 - t);
    }
    const t = (scrollProgress - mid) / (boardEnd - mid);
    return -60 * t;
  };

  return (
    <section ref={sectionRef} className="relative" style={{ height: '500vh' }}>
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
        <HeroCallouts visible={scrollProgress < 0.08} />

        {/* 3D Scene */}
        <div className="absolute inset-0">
          <HeroScene scrollProgress={scrollProgress} />
        </div>

        {/* Info Boards */}
        {boards.map((board, i) => {
          const opacity = getBoardOpacity(i);
          const translateY = getBoardTranslateY(i);
          return (
            <div
              key={i}
              className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
              style={{
                opacity,
                transform: `translateY(${translateY}px)`,
                transition: 'none',
              }}
            >
              <div className="max-w-lg w-full mx-6 p-10 border border-border rounded-sm"
                style={{ background: 'hsl(var(--card) / 0.9)', backdropFilter: 'blur(20px)' }}
              >
                <Bot className="w-6 h-6 text-nova-cyan mb-4" />
                <h3 className="font-heading font-bold text-2xl text-foreground mb-3">
                  {board.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {board.description}
                </p>
              </div>
            </div>
          );
        })}

        {/* Bottom text */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-12 z-20"
          style={{ opacity: scrollProgress < 0.1 ? 1 : Math.max(0, 1 - (scrollProgress - 0.1) / 0.05) }}
        >
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
