import { useEffect, useRef, useState } from 'react';
import { Server, Clock, Wand2, TrendingDown, ArrowUpRight } from 'lucide-react';

const advantages = [
  {
    title: 'Runs locally',
    tagline: 'Your data, your rules',
    description: 'Your data stays on your infrastructure. No cloud dependency, no privacy concerns. AI that works where you work.',
    Icon: Server,
    metric: '100%',
    metricLabel: 'On-premise',
    accent: 'purple',
    size: 'large',
  },
  {
    title: '24/7 workforce',
    tagline: 'Always on',
    description: 'AI agents don\'t sleep, take breaks, or call in sick. Consistent, reliable output around the clock.',
    Icon: Clock,
    metric: '24/7',
    metricLabel: 'Uptime',
    accent: 'cyan',
    size: 'small',
  },
  {
    title: 'No-code setup',
    tagline: 'Days, not months',
    description: 'We handle the technical complexity. You get agents configured to your workflows — ready to deploy in days, not months.',
    Icon: Wand2,
    metric: '<7d',
    metricLabel: 'Deploy time',
    accent: 'cyan',
    size: 'small',
  },
  {
    title: 'Cost reduction',
    tagline: 'Scale without overhead',
    description: 'Replace repetitive manual tasks with AI that costs a fraction of hiring. Pricing is tailored to your usage and deployment plan.',
    Icon: TrendingDown,
    metric: '↓',
    metricLabel: 'Operating cost',
    accent: 'purple',
    size: 'large',
  },
];

export default function AdvantagesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="advantages" ref={ref} className="relative py-32 px-6 overflow-hidden">
      {/* Marquee */}
      <div className="overflow-hidden mb-20 border-y border-border py-4">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="mx-8 font-heading text-2xl font-bold text-foreground/10">
              NOVA AI
            </span>
          ))}
        </div>
      </div>

      {/* Background blobs */}
      <div
        className="absolute top-1/4 -left-20 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, hsl(268 100% 50% / 0.4), transparent 70%)' }}
      />
      <div
        className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, hsl(185 100% 50% / 0.3), transparent 70%)' }}
      />

      <div className="relative max-w-7xl mx-auto">
        <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-end justify-between flex-wrap gap-6 mb-4">
            <div>
              <div className="inline-block border border-nova-cyan/40 px-3 py-1 font-mono text-[10px] tracking-[0.3em] text-nova-cyan mb-4">
                YOUR ADVANTAGE
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold leading-[0.95]">
                <span className="text-foreground">WHY BUSINESSES</span>
                <br />
                <span className="flex items-center gap-4">
                  <span className="w-12 h-[2px] bg-nova-cyan" />
                  <span className="text-gradient-purple-cyan">CHOOSE NOVA</span>
                </span>
              </h2>
            </div>
            <p className="text-muted-foreground text-sm max-w-xs font-mono">
              Four reasons businesses replace SaaS subscriptions and overworked teams with NOVA.
            </p>
          </div>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-16 auto-rows-[minmax(220px,auto)]">
          {advantages.map((a, i) => {
            const Icon = a.Icon;
            const isHovered = hoveredIdx === i;
            const accentColor = a.accent === 'purple' ? 'nova-purple' : 'nova-cyan';
            const colSpan =
              i === 0 ? 'md:col-span-4' :
              i === 1 ? 'md:col-span-2' :
              i === 2 ? 'md:col-span-2' :
              'md:col-span-4';

            return (
              <div
                key={i}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`group relative ${colSpan} p-8 border rounded-sm overflow-hidden cursor-pointer transition-all duration-500`}
                style={{
                  background: 'var(--gradient-card)',
                  borderColor: isHovered
                    ? a.accent === 'purple' ? 'hsl(268 100% 50% / 0.5)' : 'hsl(185 100% 50% / 0.5)'
                    : 'hsl(var(--border))',
                  boxShadow: isHovered
                    ? a.accent === 'purple'
                      ? '0 30px 60px -30px hsl(268 100% 50% / 0.5)'
                      : '0 30px 60px -30px hsl(185 100% 50% / 0.5)'
                    : 'none',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.96)',
                  transitionDelay: `${0.2 + i * 0.1}s`,
                }}
              >
                {/* Animated grid pattern */}
                <div
                  className="absolute inset-0 opacity-[0.04] transition-opacity duration-500 group-hover:opacity-[0.08]"
                  style={{
                    backgroundImage: `
                      linear-gradient(${a.accent === 'purple' ? 'hsl(268 100% 50% / 0.5)' : 'hsl(185 100% 50% / 0.5)'} 1px, transparent 1px),
                      linear-gradient(90deg, ${a.accent === 'purple' ? 'hsl(268 100% 50% / 0.5)' : 'hsl(185 100% 50% / 0.5)'} 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px',
                  }}
                />

                {/* Glow blob */}
                <div
                  className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-700 blur-3xl"
                  style={{
                    background: a.accent === 'purple'
                      ? 'radial-gradient(circle, hsl(268 100% 50%), transparent 70%)'
                      : 'radial-gradient(circle, hsl(185 100% 50%), transparent 70%)',
                  }}
                />

                {/* Top row: icon + arrow */}
                <div className="relative z-10 flex items-start justify-between mb-6">
                  <div
                    className={`w-12 h-12 rounded-sm border flex items-center justify-center transition-all duration-500 ${
                      a.accent === 'purple'
                        ? 'border-nova-purple/40 bg-nova-purple/10'
                        : 'border-nova-cyan/40 bg-nova-cyan/10'
                    } group-hover:scale-110`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        a.accent === 'purple' ? 'text-nova-purple' : 'text-nova-cyan'
                      }`}
                    />
                  </div>
                  <ArrowUpRight
                    className={`w-5 h-5 transition-all duration-500 ${
                      isHovered
                        ? `${a.accent === 'purple' ? 'text-nova-purple' : 'text-nova-cyan'} translate-x-1 -translate-y-1`
                        : 'text-muted-foreground'
                    }`}
                  />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <span
                    className={`font-mono text-[10px] tracking-widest uppercase ${
                      a.accent === 'purple' ? 'text-nova-purple' : 'text-nova-cyan'
                    }`}
                  >
                    {a.tagline}
                  </span>
                  <h3 className="font-heading font-bold text-2xl text-foreground mt-2 mb-3">
                    {a.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                    {a.description}
                  </p>
                </div>

                {/* Big metric (only on large cards) */}
                {a.size === 'large' && (
                  <div className="relative z-10 mt-6 pt-6 border-t border-border/50 flex items-baseline gap-3">
                    <span
                      className={`font-heading font-bold text-5xl md:text-6xl leading-none ${
                        a.accent === 'purple' ? 'text-nova-purple' : 'text-nova-cyan'
                      }`}
                      style={{
                        textShadow: a.accent === 'purple'
                          ? '0 0 30px hsl(268 100% 50% / 0.5)'
                          : '0 0 30px hsl(185 100% 50% / 0.5)',
                      }}
                    >
                      {a.metric}
                    </span>
                    <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                      {a.metricLabel}
                    </span>
                  </div>
                )}

                {/* Small card metric pill */}
                {a.size === 'small' && (
                  <div
                    className={`absolute bottom-6 right-6 z-10 px-3 py-1 border rounded-sm font-mono text-xs ${
                      a.accent === 'purple'
                        ? 'border-nova-purple/40 text-nova-purple bg-nova-purple/5'
                        : 'border-nova-cyan/40 text-nova-cyan bg-nova-cyan/5'
                    }`}
                  >
                    <span className="font-bold mr-2">{a.metric}</span>
                    <span className="text-muted-foreground">{a.metricLabel}</span>
                  </div>
                )}

                {/* Bottom accent line */}
                <div
                  className={`absolute bottom-0 left-0 h-[2px] transition-all duration-700 ${
                    isHovered ? 'w-full' : 'w-0'
                  }`}
                  style={{
                    background: a.accent === 'purple'
                      ? 'linear-gradient(90deg, hsl(268 100% 50%), hsl(185 100% 50%))'
                      : 'linear-gradient(90deg, hsl(185 100% 50%), hsl(268 100% 50%))',
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
