import { useEffect, useRef, useState } from 'react';
import { Compass, Cpu, Rocket, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    num: '01',
    label: 'Discovering',
    title: 'Tell us your workflow',
    description: 'We map your business processes — the tasks eating your time, the bottlenecks slowing growth, and the opportunities hiding in plain sight.',
    Icon: Compass,
    milestone: 'Week 1',
    bullets: ['Discovery call', 'Process audit', 'Opportunity map'],
  },
  {
    num: '02',
    label: 'Building',
    title: 'We deploy your agents',
    description: 'Our AI agents are configured to your exact needs. They run locally, integrate with your tools, and start working immediately — no coding required.',
    Icon: Cpu,
    milestone: 'Week 2-3',
    bullets: ['Agent configuration', 'Tool integration', 'Live deployment'],
  },
  {
    num: '03',
    label: 'Scaling',
    title: 'Watch your business grow',
    description: 'Your agents learn and improve over time. Scale operations without hiring. Redirect your energy toward strategy, relationships, and revenue.',
    Icon: Rocket,
    milestone: 'Ongoing',
    bullets: ['Performance tuning', 'New workflows', 'Continuous support'],
  },
];

export default function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const handler = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.5;
      const scrolled = -rect.top + window.innerHeight * 0.3;
      const p = Math.max(0, Math.min(1, scrolled / total));
      setProgress(p);
    };
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <section id="how-it-works" ref={ref} className="relative py-32 px-6 overflow-hidden">
      {/* Background ambient glow */}
      <div
        className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, hsl(268 100% 50% / 0.4), transparent 70%)' }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, hsl(185 100% 50% / 0.3), transparent 70%)' }}
      />

      <div className="relative max-w-6xl mx-auto">
        <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-block border border-nova-cyan/40 px-3 py-1 font-mono text-[10px] tracking-[0.3em] text-nova-cyan mb-4">
            THE ROADMAP
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold leading-[0.95] mb-4">
            <span className="text-foreground">YOUR PATH TO</span>
            <br />
            <span className="flex items-center gap-4">
              <span className="w-12 h-[2px] bg-nova-cyan" />
              <span className="text-gradient-purple-cyan">AUTOMATION</span>
            </span>
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mt-4">
            A clear, three-phase journey from manual chaos to autonomous operations.
          </p>
        </div>

        {/* Roadmap */}
        <div className="relative mt-24 pl-8 md:pl-0">
          {/* Vertical track - mobile (left aligned) */}
          <div className="md:hidden absolute left-3 top-0 bottom-0 w-[2px] bg-border">
            <div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-nova-purple via-nova-cyan to-nova-purple transition-all duration-300"
              style={{ height: `${progress * 100}%`, boxShadow: '0 0 12px hsl(185 100% 50% / 0.6)' }}
            />
          </div>

          {/* Vertical track - desktop (centered) */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-border">
            <div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-nova-purple via-nova-cyan to-nova-purple transition-all duration-300"
              style={{ height: `${progress * 100}%`, boxShadow: '0 0 16px hsl(185 100% 50% / 0.6)' }}
            />
          </div>

          <div className="space-y-20 md:space-y-32">
            {steps.map((step, i) => {
              const Icon = step.Icon;
              const isLeft = i % 2 === 0;
              const stepProgress = (i + 0.5) / steps.length;
              const reached = progress >= stepProgress - 0.15;

              return (
                <div
                  key={i}
                  className="relative transition-all duration-700"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(40px)',
                    transitionDelay: `${0.2 + i * 0.15}s`,
                  }}
                >
                  {/* Milestone marker on the track */}
                  <div className="absolute md:left-1/2 left-3 -translate-x-1/2 top-2 z-10">
                    <div
                      className={`relative w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                        reached
                          ? 'border-nova-cyan bg-background scale-110'
                          : 'border-border bg-background'
                      }`}
                      style={{
                        boxShadow: reached ? '0 0 20px hsl(185 100% 50% / 0.6)' : 'none',
                      }}
                    >
                      <div
                        className={`w-2 h-2 rounded-full transition-all duration-500 ${
                          reached ? 'bg-nova-cyan' : 'bg-border'
                        }`}
                      />
                      {reached && (
                        <div className="absolute inset-[-8px] rounded-full border border-nova-cyan/30 animate-ping" />
                      )}
                    </div>
                  </div>

                  {/* Content card */}
                  <div
                    className={`pl-12 md:pl-0 md:grid md:grid-cols-2 md:gap-16 ${
                      isLeft ? '' : 'md:[&>div:first-child]:col-start-2'
                    }`}
                  >
                    <div className={isLeft ? 'md:text-right md:pr-8' : 'md:pl-8'}>
                      {/* Milestone badge */}
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 border rounded-sm font-mono text-[10px] tracking-widest mb-4 transition-all duration-500 ${
                          reached
                            ? 'border-nova-cyan/50 text-nova-cyan bg-nova-cyan/5'
                            : 'border-border text-muted-foreground'
                        }`}
                      >
                        <span className="w-1 h-1 rounded-full bg-current" />
                        {step.milestone}
                      </div>

                      <div
                        className={`relative p-6 border rounded-sm overflow-hidden transition-all duration-500 ${
                          reached ? 'border-nova-purple/40 bg-card/80' : 'border-border bg-card/30'
                        }`}
                        style={{
                          backdropFilter: 'blur(10px)',
                          boxShadow: reached ? '0 20px 50px -25px hsl(268 100% 50% / 0.5)' : 'none',
                        }}
                      >
                        {/* Number watermark */}
                        <span
                          className={`absolute top-2 ${
                            isLeft ? 'right-4 md:right-4' : 'right-4'
                          } font-heading text-6xl font-bold opacity-10 leading-none ${
                            reached ? 'text-nova-cyan' : 'text-foreground'
                          }`}
                        >
                          {step.num}
                        </span>

                        <div className={`flex items-center gap-3 mb-4 ${isLeft ? 'md:justify-end' : ''}`}>
                          <div
                            className={`w-10 h-10 rounded-sm border flex items-center justify-center transition-all duration-500 ${
                              reached ? 'border-nova-cyan bg-nova-cyan/10' : 'border-border'
                            } ${isLeft ? 'md:order-2' : ''}`}
                          >
                            <Icon
                              className={`w-5 h-5 transition-colors ${
                                reached ? 'text-nova-cyan' : 'text-muted-foreground'
                              }`}
                            />
                          </div>
                          <span className="font-mono text-[10px] tracking-widest text-nova-cyan uppercase">
                            {step.label}
                          </span>
                        </div>

                        <h3 className="font-heading text-xl md:text-2xl font-semibold text-foreground mb-3 relative z-10">
                          {step.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-5 relative z-10">
                          {step.description}
                        </p>

                        <ul className={`space-y-2 relative z-10 ${isLeft ? 'md:flex md:flex-col md:items-end' : ''}`}>
                          {step.bullets.map((b, bi) => (
                            <li
                              key={bi}
                              className={`flex items-center gap-2 text-xs font-mono text-muted-foreground ${
                                isLeft ? 'md:flex-row-reverse' : ''
                              }`}
                            >
                              <CheckCircle2
                                className={`w-3.5 h-3.5 ${reached ? 'text-nova-cyan' : 'text-border'}`}
                              />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Bottom accent */}
                        <div
                          className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-nova-purple to-nova-cyan transition-all duration-1000 ${
                            reached ? 'w-full' : 'w-0'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* End marker */}
          <div className="relative md:flex md:justify-center mt-16 pl-12 md:pl-0">
            <div
              className={`inline-flex items-center gap-3 px-5 py-3 border rounded-sm transition-all duration-700 ${
                progress > 0.85
                  ? 'border-nova-cyan/50 bg-nova-cyan/5'
                  : 'border-border bg-card/30'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  progress > 0.85 ? 'bg-nova-cyan animate-pulse' : 'bg-border'
                }`}
              />
              <span className="font-mono text-[10px] tracking-widest text-foreground uppercase">
                Destination: Autonomous Operations
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
