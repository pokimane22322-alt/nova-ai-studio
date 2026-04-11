import { useEffect, useState } from 'react';

const callouts = [
  {
    label: 'TASK AUTOMATION',
    description: 'See how AI agents handle your repetitive workflows, from data entry to customer follow-ups, running 24/7 without breaks.',
    top: '20%',
    right: '5%',
    delay: 0.3,
  },
  {
    label: 'WORKFLOW INSIGHT',
    description: 'Understand how AI describes your processes. The language it uses, the efficiency it creates, and the patterns it discovers.',
    top: '45%',
    left: '3%',
    delay: 0.7,
  },
];

export default function HeroCallouts({ visible }: { visible: boolean }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setShow(true), 300);
      return () => clearTimeout(t);
    }
    setShow(false);
  }, [visible]);

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {callouts.map((c, i) => (
        <div
          key={i}
          className="absolute max-w-[280px] transition-all duration-700"
          style={{
            top: c.top,
            left: c.left,
            right: c.right,
            opacity: show ? 1 : 0,
            transform: show ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: `${c.delay}s`,
          }}
        >
          <div className="border border-nova-cyan/30 bg-background/40 backdrop-blur-md p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rotate-45 bg-nova-cyan" />
              <span className="font-mono text-xs tracking-widest text-foreground font-semibold">
                {c.label}
              </span>
            </div>
            <p className="font-mono text-[11px] text-muted-foreground leading-relaxed">
              {c.description}
            </p>
          </div>
          {/* Connector line */}
          <div className="callout-line w-12 mt-1" style={{ marginLeft: c.left ? 'auto' : '0', marginRight: c.right ? 'auto' : '0' }} />
        </div>
      ))}
    </div>
  );
}
