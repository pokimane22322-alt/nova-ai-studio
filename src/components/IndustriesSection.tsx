import { useEffect, useRef, useState } from 'react';

const industries = [
  { num: '01', title: 'Real Estate', description: 'Automate lead follow-ups, property matching, and client communications with AI agents that never miss an opportunity.' },
  { num: '02', title: 'E-Commerce', description: 'From inventory management to customer support — let AI handle the operations while you focus on growth.' },
  { num: '03', title: 'Professional Services', description: 'Streamline scheduling, invoicing, document processing, and client onboarding with intelligent automation.' },
  { num: '04', title: 'Local Businesses', description: 'Get a website that sells and AI agents that manage bookings, reviews, and customer engagement on autopilot.' },
];

export default function IndustriesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="industries" ref={ref} className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
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
          <p className="text-muted-foreground text-sm max-w-md mt-4 mb-12">
            NOVA AI is built for businesses ready to replace manual work with intelligent automation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {/* Industry list */}
          <div className="space-y-0">
            {industries.map((ind, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-full text-left border-t border-border py-6 px-4 transition-all duration-300 group ${
                  active === i ? 'bg-secondary/50' : 'hover:bg-secondary/20'
                }`}
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateX(0)' : 'translateX(-20px)',
                  transitionDelay: `${0.3 + i * 0.1}s`,
                }}
              >
                <div className="flex items-center gap-4">
                  <span className={`font-mono text-sm ${active === i ? 'text-nova-cyan' : 'text-muted-foreground'}`}>
                    {ind.num}
                  </span>
                  <span className={`font-heading text-lg font-semibold ${active === i ? 'text-foreground' : 'text-muted-foreground'} transition-colors`}>
                    {ind.title}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Active industry detail */}
          <div
            className="p-8 border border-border rounded-sm flex flex-col justify-center"
            style={{ background: 'var(--gradient-card)' }}
          >
            <div className="w-2 h-2 rotate-45 bg-nova-cyan mb-6" />
            <span className="font-mono text-xs tracking-widest text-nova-cyan mb-2">
              {industries[active].num}
            </span>
            <h3 className="font-heading text-2xl font-bold text-foreground mb-4">
              {industries[active].title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              {industries[active].description}
            </p>
            <a href="#get-started" className="inline-block self-start px-6 py-3 bg-primary text-primary-foreground font-mono text-xs tracking-widest rounded-sm hover:bg-nova-glow transition-colors">
              GET STARTED
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
