interface HeroCalloutsProps {
  visible: boolean;
}

const callouts = [
  {
    label: 'TASK AUTOMATION',
    text: 'See how your AI agents handle repetitive workflows, from lead generation to data processing, running locally on your infrastructure.',
    position: 'top-[22%] right-[8%]',
  },
  {
    label: 'EFFICIENCY GAINS',
    text: 'Track performance metrics and cost savings as AI agents take over manual processes across your organization.',
    position: 'bottom-[38%] right-[5%]',
  },
];

export default function HeroCallouts({ visible }: HeroCalloutsProps) {
  return (
    <>
      {callouts.map((c, i) => (
        <div
          key={i}
          className={`absolute ${c.position} max-w-[260px] z-20 transition-all duration-700 ${
            visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}
          style={{ transitionDelay: `${i * 200}ms` }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-primary rotate-45" />
            <span className="font-mono text-[10px] tracking-[0.2em] text-foreground font-medium">
              {c.label}
            </span>
          </div>
          <p className="font-mono text-[10px] leading-relaxed text-muted-foreground">
            {c.text}
          </p>
        </div>
      ))}

      <div
        className={`absolute top-[18%] right-[22%] font-mono text-[9px] text-primary/20 tracking-widest transition-opacity duration-500 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        10001111
      </div>
      <div
        className={`absolute bottom-[28%] right-[25%] font-mono text-[9px] text-primary/20 tracking-widest transition-opacity duration-500 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        01010:
      </div>
    </>
  );
}
