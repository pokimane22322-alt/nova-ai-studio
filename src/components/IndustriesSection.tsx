import { useEffect, useRef, useState } from 'react';
import { Building2, ShoppingBag, Briefcase, Store, ArrowRight } from 'lucide-react';

const industries = [
  {
    num: '01',
    title: 'Real Estate',
    short: 'Lead-driven sales',
    description: 'Automate lead follow-ups, property matching, and client communications with AI agents that never miss an opportunity.',
    Icon: Building2,
    stats: [
      { value: '3x', label: 'Faster lead response' },
      { value: '24/7', label: 'Client engagement' },
      { value: '60%', label: 'Time saved' },
    ],
    useCases: ['Lead qualification', 'Property matching', 'Listing automation', 'Client follow-ups'],
  },
  {
    num: '02',
    title: 'E-Commerce',
    short: 'Operations at scale',
    description: 'From inventory management to customer support — let AI handle the operations while you focus on growth.',
    Icon: ShoppingBag,
    stats: [
      { value: '90%', label: 'Tickets auto-resolved' },
      { value: '2x', label: 'Order processing' },
      { value: '24/7', label: 'Store coverage' },
    ],
    useCases: ['Customer support', 'Order tracking', 'Inventory alerts', 'Review management'],
  },
  {
    num: '03',
    title: 'Professional Services',
    short: 'Back-office automation',
    description: 'Streamline scheduling, invoicing, document processing, and client onboarding with intelligent automation.',
    Icon: Briefcase,
    stats: [
      { value: '70%', label: 'Admin reduced' },
      { value: '5min', label: 'Onboarding' },
      { value: '0', label: 'Missed invoices' },
    ],
    useCases: ['Scheduling', 'Invoicing', 'Document parsing', 'Client onboarding'],
  },
  {
    num: '04',
    title: 'Local Businesses',
    short: 'Web + automation',
    description: 'Get a website that sells and AI agents that manage bookings, reviews, and customer engagement on autopilot.',
    Icon: Store,
    stats: [
      { value: '+40%', label: 'Bookings' },
      { value: '5★', label: 'Review handling' },
      { value: '1', label: 'Setup week' },
    ],
    useCases: ['Booking system', 'Review responses', 'SEO website', 'Local outreach'],
  },
];

export default function IndustriesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const activeData = industries[active];
  const ActiveIcon = activeData.Icon;

  return (
    <section id="industries" ref={ref} className="relative py-32 px-6 overflow-hidden">
      {/* Background decoration */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, hsl(268 100% 50% / 0.4), transparent 70%)' }}
      />

      <div className="relative max-w-7xl mx-auto">
        <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
            <div>
              <div className="inline-block border border-nova-cyan/40 px-3 py-1 font-mono text-[10px] tracking-[0.3em] text-nova-cyan mb-4">
                INDUSTRIES
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold leading-[0.95]">
                <span className="text-foreground">BUILT FOR</span>
                <br />
                <span className="flex items-center gap-4">
                  <span className="w-12 h-[2px] bg-nova-cyan" />
                  <span className="text-gradient-purple-cyan">YOUR INDUSTRY</span>
                </span>
              </h2>
            </div>
            <div className="flex items-center gap-3 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
              <span>{String(active + 1).padStart(2, '0')}</span>
              <span className="w-12 h-[1px] bg-border relative">
                <span
                  className="absolute top-0 left-0 h-full bg-nova-cyan transition-all duration-500"
                  style={{ width: `${((active + 1) / industries.length) * 100}%` }}
                />
              </span>
              <span>{String(industries.length).padStart(2, '0')}</span>
            </div>
          </div>
        </div>

        {/* Industry tabs - horizontal pills */}
        <div className="flex flex-wrap gap-3 mb-10">
          {industries.map((ind, i) => {
            const Icon = ind.Icon;
            const isActive = active === i;
            return (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`group relative flex items-center gap-3 px-5 py-3 border rounded-sm transition-all duration-300 ${
                  isActive
                    ? 'border-nova-cyan/60 bg-nova-cyan/10'
                    : 'border-border bg-card/30 hover:border-nova-purple/40'
                }`}
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(20px)',
                  transitionDelay: `${0.2 + i * 0.08}s`,
                  boxShadow: isActive ? '0 10px 30px -15px hsl(185 100% 50% / 0.5)' : 'none',
                }}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-nova-cyan' : 'text-muted-foreground group-hover:text-foreground'
                  }`}
                />
                <span
                  className={`font-heading text-sm font-semibold transition-colors ${
                    isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                  }`}
                >
                  {ind.title}
                </span>
                <span
                  className={`font-mono text-[10px] transition-colors ${
                    isActive ? 'text-nova-cyan' : 'text-muted-foreground/60'
                  }`}
                >
                  {ind.num}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active panel */}
        <div
          key={active}
          className="relative grid lg:grid-cols-[1.4fr_1fr] gap-6 animate-fade-in"
        >
          {/* Main showcase card */}
          <div
            className="relative p-8 md:p-12 border border-border rounded-sm overflow-hidden min-h-[420px]"
            style={{ background: 'var(--gradient-card)' }}
          >
            {/* Background grid */}
            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage: `
                  linear-gradient(hsl(185 100% 50% / 0.4) 1px, transparent 1px),
                  linear-gradient(90deg, hsl(185 100% 50% / 0.4) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px',
              }}
            />

            {/* Glow */}
            <div
              className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-30 blur-3xl pointer-events-none"
              style={{ background: 'radial-gradient(circle, hsl(268 100% 50%), transparent 70%)' }}
            />

            {/* Giant icon backdrop */}
            <div className="absolute bottom-0 right-0 opacity-[0.06] pointer-events-none">
              <ActiveIcon className="w-[400px] h-[400px] text-foreground" strokeWidth={0.5} />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-sm border border-nova-cyan/50 bg-nova-cyan/10 flex items-center justify-center">
                  <ActiveIcon className="w-7 h-7 text-nova-cyan" />
                </div>
                <div>
                  <span className="font-mono text-[10px] tracking-widest text-nova-cyan uppercase">
                    {activeData.short}
                  </span>
                  <h3 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                    {activeData.title}
                  </h3>
                </div>
              </div>

              <p className="text-muted-foreground text-base leading-relaxed max-w-xl mb-8">
                {activeData.description}
              </p>

              {/* Use cases as chips */}
              <div className="mb-8">
                <span className="block font-mono text-[10px] tracking-widest text-muted-foreground uppercase mb-3">
                  Common use cases
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeData.useCases.map((uc, ui) => (
                    <span
                      key={ui}
                      className="px-3 py-1.5 border border-border rounded-sm font-mono text-xs text-foreground bg-background/50 backdrop-blur-sm"
                      style={{
                        animation: `fade-in 0.4s ease-out ${ui * 0.08}s backwards`,
                      }}
                    >
                      {uc}
                    </span>
                  ))}
                </div>
              </div>

              <a
                href="#get-started"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-mono text-xs tracking-widest rounded-sm hover:bg-nova-glow transition-colors group"
              >
                BUILD FOR {activeData.title.toUpperCase()}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* Stats sidebar */}
          <div className="grid grid-rows-3 gap-4">
            {activeData.stats.map((stat, si) => (
              <div
                key={si}
                className="relative p-6 border border-border rounded-sm overflow-hidden flex items-center justify-between gap-4 group hover:border-nova-purple/40 transition-colors"
                style={{
                  background: 'var(--gradient-card)',
                  animation: `fade-in 0.5s ease-out ${si * 0.1}s backwards`,
                }}
              >
                <div
                  className="absolute -right-10 -top-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-20 transition-opacity blur-2xl"
                  style={{ background: 'radial-gradient(circle, hsl(185 100% 50%), transparent 70%)' }}
                />
                <div className="relative z-10">
                  <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                    {stat.label}
                  </span>
                  <div
                    className="font-heading text-4xl md:text-5xl font-bold text-gradient-purple-cyan leading-none mt-1"
                  >
                    {stat.value}
                  </div>
                </div>
                <div className="relative z-10 font-mono text-[10px] text-nova-cyan/60">
                  0{si + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
