import { useEffect, useState } from 'react';

const callouts = [
  { label: 'LOCAL AI AGENTS', top: '22%', left: '8%', delay: 0.3 },
  { label: 'BUSINESS AUTOMATION', top: '38%', left: '12%', delay: 0.6 },
  { label: 'REPLACE MANUAL WORK', top: '54%', left: '5%', delay: 0.9 },
  { label: 'WEBSITE SOLUTIONS', top: '70%', left: '10%', delay: 1.2 },
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
          className="absolute flex items-center gap-2 transition-all duration-700"
          style={{
            top: c.top,
            left: c.left,
            opacity: show ? 1 : 0,
            transform: show ? 'translateX(0)' : 'translateX(-30px)',
            transitionDelay: `${c.delay}s`,
          }}
        >
          {/* Callout box */}
          <div className="relative flex items-center">
            <div className="border border-nova-cyan/40 bg-background/60 backdrop-blur-md px-4 py-2 font-mono text-xs tracking-widest text-foreground/90">
              {c.label}
            </div>
            {/* Diamond pointer */}
            <div className="ml-2 w-2 h-2 rotate-45 border border-nova-cyan/60 bg-nova-cyan/20" />
            {/* Line extending right */}
            <div className="callout-line w-16 sm:w-24 ml-1" />
          </div>
        </div>
      ))}
    </div>
  );
}
