import { useEffect, useRef, useState } from 'react';

export default function CTASection() {
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
    <section id="get-started" ref={ref} className="relative py-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold leading-[0.95] mb-6">
            <span className="text-foreground">TAKE CONTROL OF</span>
            <br />
            <span className="text-gradient-purple-cyan">YOUR WORKFLOW</span>
          </h2>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto mb-10 leading-relaxed">
            Your competitors are already automating. NOVA AI gives you the same power — local AI agents that work for your business 24/7, plus websites that actually convert.
          </p>
          <a
            href="#"
            className="inline-block px-8 py-4 bg-primary text-primary-foreground font-mono text-sm tracking-widest rounded-sm hover:bg-nova-glow transition-colors glow-purple"
          >
            GET STARTED
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-32 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-sm bg-primary flex items-center justify-center text-primary-foreground font-heading font-bold text-[10px]">
            N
          </div>
          <span className="font-heading font-bold text-sm tracking-wider text-foreground">NOVA AI</span>
        </div>
        <p className="font-mono text-[10px] tracking-widest text-muted-foreground">
          © 2026 NOVA AI. ALL RIGHTS RESERVED.
        </p>
      </div>
    </section>
  );
}
