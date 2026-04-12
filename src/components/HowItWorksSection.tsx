import { useEffect, useRef, useState } from 'react';

const steps = [
  {
    num: '01',
    label: 'Discovering',
    title: 'Tell us your workflow',
    description: 'We map your business processes — the tasks eating your time, the bottlenecks slowing growth, and the opportunities hiding in plain sight.',
  },
  {
    num: '02',
    label: 'Building',
    title: 'We deploy your agents',
    description: 'Our AI agents are configured to your exact needs. They run locally, integrate with your tools, and start working immediately — no coding required.',
  },
  {
    num: '03',
    label: 'Scaling',
    title: 'Watch your business grow',
    description: 'Your agents learn and improve over time. Scale operations without hiring. Redirect your energy toward strategy, relationships, and revenue.',
  },
];

export default function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="how-it-works" ref={ref} className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-block border border-nova-cyan/40 px-3 py-1 font-mono text-[10px] tracking-[0.3em] text-nova-cyan mb-4">
            HOW IT WORKS
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold leading-[0.95] mb-4">
            <span className="text-foreground">YOUR PATH TO</span>
            <br />
            <span className="flex items-center gap-4">
              <span className="w-12 h-[2px] bg-nova-cyan" />
              <span className="text-gradient-purple-cyan">AUTOMATION</span>
            </span>
          </h2>
        </div>

        <div className="mt-20 space-y-0">
          {steps.map((step, i) => (
            <div
              key={i}
              className="group relative border-t border-border py-12 md:py-16 grid md:grid-cols-[100px_200px_1fr] gap-6 md:gap-12 items-start transition-all duration-700"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(20px)',
                transitionDelay: `${0.3 + i * 0.2}s`,
              }}
            >
              <span className="font-mono text-4xl font-bold text-nova-purple/30 group-hover:text-nova-purple transition-colors">
                {step.num}
              </span>
              <div>
                <span className="font-mono text-xs tracking-widest text-nova-cyan uppercase">
                  {step.label}
                </span>
                <h3 className="font-heading text-xl font-semibold text-foreground mt-2">
                  {step.title}
                </h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-lg">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
