import { useRef, useState, useEffect } from 'react';

export default function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="get-started" ref={ref}>
      {/* Marquee section */}
      <div className="relative bg-cta-gradient py-16 overflow-hidden">
        <div className="absolute inset-0 grid-bg-dark" />

        <div className="relative z-10 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...Array(4)].map((_, i) => (
              <span
                key={i}
                className="text-[10vw] md:text-[8vw] font-heading font-bold text-primary-foreground/10 mx-8 tracking-wider"
              >
                NOVA AI
                <span className="mx-8 text-primary-foreground/5">—</span>
                LOCAL AGENTS
                <span className="mx-8 text-primary-foreground/5">—</span>
              </span>
            ))}
          </div>
        </div>

        {/* Dashboard mockup */}
        <div className="relative z-10 max-w-4xl mx-auto mt-10 px-6">
          <div className="bg-foreground/5 border border-primary-foreground/10 rounded-sm p-8 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-primary-foreground/20" />
              <div className="w-3 h-3 rounded-full bg-primary-foreground/20" />
              <div className="w-3 h-3 rounded-full bg-primary-foreground/20" />
              <span className="ml-4 font-mono text-[10px] text-primary-foreground/40">nova-ai-dashboard</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {['Active Agents', 'Tasks Completed', 'Efficiency'].map((label, i) => (
                <div key={i} className="border border-primary-foreground/10 p-4 rounded-sm">
                  <span className="font-mono text-[10px] text-primary-foreground/40">{label}</span>
                  <div className="text-2xl font-heading font-bold text-primary-foreground/80 mt-2">
                    {['12', '2,847', '94%'][i]}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 h-24 border border-primary-foreground/10 rounded-sm flex items-end p-4 gap-1">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-primary-foreground/15 rounded-sm"
                  style={{ height: `${20 + Math.random() * 80}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Large background text */}
      <div className="relative bg-cta-gradient overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient opacity-30" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <span className="text-[20vw] font-heading font-bold text-primary-foreground/[0.03] tracking-wider whitespace-nowrap">
            NOVA AI
          </span>
        </div>
        <div className="relative z-10 py-20" />
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="max-w-[1400px] mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div
              className={`transition-all duration-700 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-sm bg-primary flex items-center justify-center text-primary-foreground font-heading font-bold text-xs">
                  N
                </div>
                <span className="font-mono text-sm tracking-[0.2em] text-foreground font-medium">NOVA AI</span>
              </div>
              <p className="font-mono text-[11px] leading-relaxed text-muted-foreground mb-6 max-w-sm">
                Your business runs on repetitive tasks. Our local AI agents handle them, so your team focuses on what matters.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-9 h-9 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors rounded-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                <a href="#" className="w-9 h-9 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors rounded-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              </div>
            </div>

            <div
              className={`transition-all duration-700 delay-100 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <h3 className="font-mono text-[12px] tracking-[0.2em] text-foreground font-medium mb-6">EXPLORE</h3>
              {['ABOUT', 'HOW IT WORKS', 'ADVANTAGE', 'INDUSTRIES'].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase().replace(/ /g, '-')}`}
                  className="block font-mono text-[11px] text-muted-foreground hover:text-foreground transition-colors py-2 tracking-wide"
                >
                  {link}
                </a>
              ))}
            </div>

            <div
              className={`transition-all duration-700 delay-200 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <h3 className="font-mono text-[12px] tracking-[0.2em] text-foreground font-medium mb-6">GET STARTED</h3>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-[10px] text-muted-foreground tracking-wide">
                      First name <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="First name"
                      className="w-full mt-1 bg-transparent border-b border-border pb-2 font-mono text-[11px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] text-muted-foreground tracking-wide">
                      Last name <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Last name"
                      className="w-full mt-1 bg-transparent border-b border-border pb-2 font-mono text-[11px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-mono text-[10px] text-muted-foreground tracking-wide">
                    Email <span className="text-primary">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="name@email.com"
                    className="w-full mt-1 bg-transparent border-b border-border pb-2 font-mono text-[11px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-4 px-6 py-2.5 bg-primary text-primary-foreground font-mono text-[11px] tracking-[0.15em] rounded-sm hover:bg-primary/90 transition-colors"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-border/50 border-dashed flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="font-mono text-[10px] text-muted-foreground">
              © 2026 Nova AI. All Rights Reserved.
            </span>
            <div className="flex gap-6">
              <a href="#" className="font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors">
                Terms & conditions
              </a>
              <span className="text-muted-foreground/30">|</span>
              <a href="#" className="font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors">
                Privacy policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
}
