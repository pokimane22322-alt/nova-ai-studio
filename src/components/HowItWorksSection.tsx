import { useEffect, useRef, useState } from 'react';

const steps = [
  {
    num: '01',
    label: 'STRATEGISING',
    title: 'SET YOUR WORKFLOWS',
    description: 'Define the tasks eating your time — scheduling, outreach, data entry. These are the workflows our AI agents will automate first.',
  },
  {
    num: '02',
    label: 'ANALYSING',
    title: 'TRACK PERFORMANCE',
    description: 'NOVA AI monitors your automated workflows, capturing efficiency gains over time. See where time is saved and how your operations improve.',
  },
  {
    num: '03',
    label: 'OPTIMISING',
    title: 'ACT WITH CONFIDENCE',
    description: 'NOVA AI surfaces patterns across workflows to show which automations drive the most value and where further optimization can improve outcomes.',
  },
];

export default function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handler = () => {
      stepRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.6 && rect.bottom > window.innerHeight * 0.3) {
          setActiveStep(i);
        }
      });
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <section id="how-it-works" ref={ref} className="relative bg-background">
      {/* Title */}
      <div className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block border border-nova-cyan/40 px-3 py-1 font-mono text-[10px] tracking-[0.3em] text-nova-cyan mb-6">
            HOW IT WORKS
            <span className="inline-block w-1.5 h-3 bg-nova-cyan/60 ml-2" />
            <span className="inline-block w-1.5 h-3 bg-nova-cyan/40 ml-0.5" />
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold leading-[0.95]">
            <span className="text-foreground">DISCOVERING</span>
            <br />
            <span className="flex items-center justify-center gap-4">
              <span className="w-12 h-[2px] bg-nova-cyan" />
              <span className="text-gradient-purple-cyan">YOUR VOICE</span>
            </span>
          </h2>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto mt-6 font-mono leading-relaxed">
            Rather than guessing at what drives efficiency, you get a structured approach: define what matters, track how it changes, and act on what the data reveals.
          </p>
        </div>
      </div>

      {/* Steps */}
      {steps.map((step, i) => (
        <div
          key={i}
          ref={(el) => { stepRefs.current[i] = el; }}
          className="min-h-screen flex items-center justify-center px-6 relative"
        >
          {/* Floating dots background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(8)].map((_, j) => (
              <div
                key={j}
                className="absolute w-1 h-1 bg-nova-cyan/20 rounded-full"
                style={{
                  top: `${15 + Math.random() * 70}%`,
                  left: `${10 + Math.random() * 80}%`,
                  animation: `float ${4 + Math.random() * 4}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 3}s`,
                }}
              />
            ))}
          </div>

          <div className="max-w-2xl mx-auto text-center relative z-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="inline-block border border-nova-purple/60 bg-nova-purple/20 px-2 py-0.5 font-mono text-[10px] text-nova-cyan">
                {step.num}
              </span>
              <span className="inline-block border border-nova-cyan/40 px-3 py-1 font-mono text-[10px] tracking-[0.3em] text-nova-cyan">
                {step.label}
              </span>
              <span className="inline-block w-1.5 h-3 bg-nova-cyan/60" />
              <span className="inline-block w-1.5 h-3 bg-nova-cyan/40" />
            </div>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
              {step.title}
            </h3>
            <p className="text-muted-foreground text-sm font-mono leading-relaxed max-w-lg mx-auto">
              {step.description}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}
