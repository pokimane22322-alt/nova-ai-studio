import { useEffect, useRef, useState } from 'react';

const steps = [
  {
    num: '01',
    tag: 'STRATEGISING',
    title: 'DEFINE YOUR\nWORKFLOWS',
    desc: 'Identify the repetitive tasks draining your team\'s time. These might include lead qualification, data entry, email responses, or document processing relevant to your business.',
  },
  {
    num: '02',
    tag: 'DEPLOYING',
    title: 'DEPLOY YOUR\nAGENTS',
    desc: 'Nova AI configures and deploys custom agents locally. They learn your processes, adapt to your data formats, and begin handling tasks autonomously — all on your infrastructure.',
  },
  {
    num: '03',
    tag: 'OPTIMISING',
    title: 'SCALE WITH\nCONFIDENCE',
    desc: 'Monitor agent performance, track efficiency gains, and scale operations. Nova AI surfaces insights so you can optimize workflows and expand automation across departments.',
  },
];

function FloatingParticle({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="absolute w-8 h-8 border border-primary/10 rounded-sm rotate-12 opacity-40"
      style={style}
    />
  );
}

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(-1);

  useEffect(() => {
    const handler = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const progress = -rect.top / (rect.height - window.innerHeight);
      const step = Math.floor(progress * (steps.length + 1)) - 1;
      setActiveStep(Math.max(-1, Math.min(steps.length - 1, step)));
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative bg-background"
      style={{ minHeight: `${(steps.length + 2) * 100}vh` }}
    >
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 grid-dots" />

        <FloatingParticle style={{ top: '15%', left: '20%' }} />
        <FloatingParticle style={{ top: '25%', right: '15%' }} />
        <FloatingParticle style={{ bottom: '20%', left: '30%' }} />
        <FloatingParticle style={{ bottom: '30%', right: '25%' }} />
        <FloatingParticle style={{ top: '60%', left: '10%' }} />
        <FloatingParticle style={{ top: '40%', right: '10%' }} />

        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[1px] h-[300px] bg-gradient-to-b from-transparent via-primary/10 to-transparent rotate-[30deg] origin-top-right" />
          <div className="absolute bottom-0 left-[20%] w-[1px] h-[200px] bg-gradient-to-b from-transparent via-primary/10 to-transparent -rotate-[30deg] origin-bottom-left" />
        </div>

        {/* Intro state */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-all duration-700"
          style={{
            opacity: activeStep < 0 ? 1 : 0,
            transform: activeStep < 0 ? 'translateY(0)' : 'translateY(-30px)',
            pointerEvents: activeStep < 0 ? 'auto' : 'none',
          }}
        >
          <div className="text-center max-w-2xl px-6">
            <div className="inline-flex items-center gap-2 border border-primary/40 px-3 py-1 font-mono text-[10px] tracking-[0.3em] text-primary mb-6">
              HOW IT WORKS
              <span className="inline-block w-[2px] h-3 bg-primary/60" />
              <span className="inline-block w-[2px] h-3 bg-primary/40" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-[0.95] tracking-tight text-foreground mb-6">
              DISCOVERING
              <br />
              <span className="flex items-center justify-center gap-4">
                <span className="w-10 h-[2px] bg-primary" />
                YOUR VOICE
              </span>
            </h2>
            <p className="font-mono text-[12px] leading-[1.8] text-muted-foreground max-w-lg mx-auto">
              Rather than guessing at what tasks to automate, you get a structured approach: define what matters, deploy intelligent agents, and act on what the data reveals.
            </p>
          </div>
        </div>

        {/* Step states */}
        {steps.map((step, i) => (
          <div
            key={i}
            className="absolute inset-0 flex items-center justify-center transition-all duration-700"
            style={{
              opacity: activeStep === i ? 1 : 0,
              transform: activeStep === i ? 'translateY(0)' : activeStep > i ? 'translateY(-30px)' : 'translateY(30px)',
              pointerEvents: activeStep === i ? 'auto' : 'none',
            }}
          >
            <div className="text-center max-w-2xl px-6">
              <div className="inline-flex items-center gap-2 border border-primary/40 px-3 py-1 font-mono text-[10px] tracking-[0.3em] text-primary mb-6">
                <span className="bg-primary/10 px-1.5 py-0.5 text-primary">{step.num}</span>
                {step.tag}
                <span className="inline-block w-[2px] h-3 bg-primary/60" />
                <span className="inline-block w-[2px] h-3 bg-primary/40" />
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-[0.95] tracking-tight text-foreground mb-6 whitespace-pre-line">
                {step.title}
              </h2>
              <p className="font-mono text-[12px] leading-[1.8] text-muted-foreground max-w-lg mx-auto">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
