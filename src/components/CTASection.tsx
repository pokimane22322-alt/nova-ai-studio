import { useEffect, useRef, useState } from 'react';

const ctaFeatures = [
  { icon: '◇', title: 'SCHEDULE A DEMO', description: 'See NOVA AI in action and discover how it can work for you.' },
  { icon: '◆', title: 'SET YOUR PROMPTS', description: 'Define the questions that shape discovery and comparison in your market.' },
  { icon: '▣', title: 'TRACK YOUR PRESENCE', description: 'See how your brand appears in AI search and improve it over time.' },
];

export default function CTASection() {
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
    <>
      {/* CTA Features */}
      <section className="relative py-20 px-6 bg-secondary/50 border-y border-border">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {ctaFeatures.map((f, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-nova-cyan text-lg flex-shrink-0">{f.icon}</span>
              <div>
                <h4 className="font-mono text-xs tracking-widest text-foreground font-semibold mb-1">{f.title}</h4>
                <p className="font-mono text-[11px] text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Large text CTA + background */}
      <section id="get-started" ref={ref} className="relative overflow-hidden">
        {/* Background with large NOVA text */}
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <span className="text-[20vw] font-heading font-bold text-foreground whitespace-nowrap">
            NOVA AI
          </span>
        </div>

        <div className="relative z-10 py-32 px-6">
          <div className={`max-w-4xl mx-auto transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold leading-[0.95] mb-6">
              <span className="text-foreground">TAKE CONTROL OF</span>
              <br />
              <span className="text-gradient-purple-cyan">THE CONVERSATION</span>
            </h2>
            <p className="text-muted-foreground text-xs font-mono max-w-md mb-8 leading-relaxed">
              AI redefines how your business is discovered. Start understanding — and influencing — how you appear in the answers that matter.
            </p>
            <a
              href="#"
              className="inline-block px-8 py-3 border border-nova-cyan/60 text-foreground font-mono text-xs tracking-widest rounded-sm hover:bg-nova-cyan/10 transition-colors"
            >
              GET STARTED
            </a>

            {/* Active users badge */}
            <div className="mt-16 flex items-center gap-2">
              <span className="inline-block border border-nova-cyan/40 px-2 py-0.5 font-mono text-[10px] text-nova-cyan">★</span>
              <span className="font-mono text-[10px] tracking-widest text-nova-cyan">
                ACTIVE USERS
              </span>
              <span className="inline-block w-1.5 h-3 bg-nova-cyan/60 ml-1" />
              <span className="inline-block w-1.5 h-3 bg-nova-cyan/40" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-sm bg-primary flex items-center justify-center text-primary-foreground font-heading font-bold text-sm">
                N
              </div>
              <span className="font-heading font-bold text-lg tracking-wider text-foreground">NOVA AI</span>
            </div>
            <p className="text-muted-foreground text-xs font-mono leading-relaxed max-w-xs">
              Your business runs on repetitive tasks. Our AI agents handle them so your team focuses on what matters.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-heading font-bold text-sm tracking-widest text-foreground mb-4">EXPLORE</h4>
            <div className="space-y-3">
              {['ABOUT', 'HOW IT WORKS', 'ADVANTAGE', 'INDUSTRIES'].map((link) => (
                <a key={link} href={`#${link.toLowerCase().replace(/ /g, '-')}`} className="block font-mono text-xs text-muted-foreground hover:text-foreground transition-colors tracking-widest">
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Contact form */}
          <div>
            <h4 className="font-heading font-bold text-sm tracking-widest text-foreground mb-4">GET STARTED</h4>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-[10px] text-muted-foreground tracking-widest">First name *</label>
                  <input type="text" placeholder="First name" className="w-full bg-transparent border-b border-border py-2 text-sm text-foreground font-mono focus:outline-none focus:border-nova-cyan transition-colors" />
                </div>
                <div>
                  <label className="font-mono text-[10px] text-muted-foreground tracking-widest">Last name *</label>
                  <input type="text" placeholder="Last name" className="w-full bg-transparent border-b border-border py-2 text-sm text-foreground font-mono focus:outline-none focus:border-nova-cyan transition-colors" />
                </div>
              </div>
              <div>
                <label className="font-mono text-[10px] text-muted-foreground tracking-widest">Email *</label>
                <input type="email" placeholder="name@email.com" className="w-full bg-transparent border-b border-border py-2 text-sm text-foreground font-mono focus:outline-none focus:border-nova-cyan transition-colors" />
              </div>
              <button type="submit" className="mt-4 px-6 py-2.5 bg-primary text-primary-foreground font-mono text-xs tracking-widest rounded-sm hover:bg-nova-glow transition-colors">
                Submit
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/50">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="font-mono text-[10px] tracking-widest text-muted-foreground">
              © 2026 NOVA AI. ALL RIGHTS RESERVED.
            </p>
            <div className="flex gap-6">
              <a href="#" className="font-mono text-[10px] tracking-widest text-muted-foreground hover:text-foreground transition-colors">Terms & conditions</a>
              <span className="text-muted-foreground/30">|</span>
              <a href="#" className="font-mono text-[10px] tracking-widest text-muted-foreground hover:text-foreground transition-colors">Privacy policy</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
