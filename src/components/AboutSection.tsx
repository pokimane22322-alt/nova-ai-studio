import { useEffect, useRef, useState } from 'react';

export default function AboutSection() {
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
    <section id="about" ref={ref} className="relative py-32 px-6 bg-background">
      <div className="max-w-4xl mx-auto text-center">
        <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-block border border-nova-cyan/40 px-3 py-1 font-mono text-[10px] tracking-[0.3em] text-nova-cyan mb-6">
            UNDERSTANDING
            <span className="inline-block w-1.5 h-3 bg-nova-cyan/60 ml-2" />
            <span className="inline-block w-1.5 h-3 bg-nova-cyan/40 ml-0.5" />
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold leading-[0.95] mb-6">
            <span className="text-foreground">WHAT IS</span>
            <br />
            <span className="flex items-center justify-center gap-4">
              <span className="w-12 h-[2px] bg-nova-cyan" />
              <span className="text-gradient-purple-cyan">NOVA AI?</span>
            </span>
          </h2>
        </div>
      </div>
    </section>
  );
}
