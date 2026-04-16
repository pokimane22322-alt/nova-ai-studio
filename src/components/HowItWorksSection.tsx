import { useEffect, useRef, useState } from 'react';
import { Compass, Cpu, Rocket } from 'lucide-react';

const steps = [
  {
    num: '01',
    label: 'Discovering',
    title: 'Tell us your workflow',
    description: 'We map your business processes — the tasks eating your time, the bottlenecks slowing growth, and the opportunities hiding in plain sight.',
    Icon: Compass,
  },
  {
    num: '02',
    label: 'Building',
    title: 'We deploy your agents',
    description: 'Our AI agents are configured to your exact needs. They run locally, integrate with your tools, and start working immediately — no coding required.',
    Icon: Cpu,
  },
  {
    num: '03',
    label: 'Scaling',
    title: 'Watch your business grow',
    description: 'Your agents learn and improve over time. Scale operations without hiring. Redirect your energy toward strategy, relationships, and revenue.',
    Icon: Rocket,
  },
];

export default function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [visible]);

  return (
    <section id="how-it-works" ref={ref} className="relative py-32 px-6 overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, hsl(268 100% 50% / 0.3), transparent 70%)' }}
      />

      <div className="relative max-w-7xl mx-auto">
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

        {/* Connecting line */}
        <div className="relative mt-24">
          <div className="hidden md:block absolute top-[60px] left-[8%] right-[8%] h-[2px] bg-border">
            <div
              className="h-full bg-gradient-to-r from-nova-purple via-nova-cyan to-nova-purple transition-all duration-1000 ease-out"
              style={{
                width: visible ? `${((activeStep + 1) / steps.length) * 100}%` : '0%',
                boxShadow: '0 0 12px hsl(185 100% 50% / 0.6)',
              }}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-6 relative">
            {steps.map((step, i) => {
              const isActive = i === activeStep;
              const Icon = step.Icon;
              return (
                <div
                  key={i}
                  onMouseEnter={() => setActiveStep(i)}
                  className="group relative cursor-pointer transition-all duration-700"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible
                      ? `translateY(${i % 2 === 0 ? '0' : '40px'})`
                      : 'translateY(40px)',
                    transitionDelay: `${0.3 + i * 0.2}s`,
                  }}
                >
                  {/* Number badge - circular, sits on the line */}
                  <div className="relative flex justify-center mb-6">
                    <div
                      className={`relative w-[120px] h-[120px] rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                        isActive
                          ? 'border-nova-cyan bg-card scale-110'
                          : 'border-border bg-card scale-100'
                      }`}
                      style={{
                        boxShadow: isActive
                          ? '0 0 40px hsl(185 100% 50% / 0.4), inset 0 0 20px hsl(268 100% 50% / 0.2)'
                          : 'none',
                      }}
                    >
                      {/* Rotating ring */}
                      <div
                        className={`absolute inset-[-6px] rounded-full border border-dashed transition-opacity duration-500 ${
                          isActive ? 'opacity-100 border-nova-purple/60' : 'opacity-0'
                        }`}
                        style={{
                          animation: isActive ? 'spin 8s linear infinite' : 'none',
                        }}
                      />
                      <Icon
                        className={`w-10 h-10 transition-all duration-500 ${
                          isActive ? 'text-nova-cyan scale-110' : 'text-muted-foreground'
                        }`}
                      />
                      {/* Floating number */}
                      <span
                        className={`absolute -top-3 -right-3 font-mono text-xs font-bold px-2 py-1 rounded-sm border transition-all duration-500 ${
                          isActive
                            ? 'border-nova-cyan text-nova-cyan bg-background'
                            : 'border-border text-muted-foreground bg-background'
                        }`}
                      >
                        {step.num}
                      </span>
                    </div>
                  </div>

                  {/* Card content */}
                  <div
                    className={`relative p-6 border rounded-sm transition-all duration-500 ${
                      isActive
                        ? 'border-nova-cyan/50 bg-card/80'
                        : 'border-border bg-card/30'
                    }`}
                    style={{
                      backdropFilter: 'blur(10px)',
                      transform: isActive ? 'translateY(-8px)' : 'translateY(0)',
                      boxShadow: isActive ? '0 20px 40px -20px hsl(268 100% 50% / 0.4)' : 'none',
                    }}
                  >
                    <span className="font-mono text-[10px] tracking-widest text-nova-cyan uppercase">
                      {step.label}
                    </span>
                    <h3 className="font-heading text-xl font-semibold text-foreground mt-2 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>

                    {/* Bottom accent bar */}
                    <div
                      className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-nova-purple to-nova-cyan transition-all duration-700 ${
                        isActive ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
