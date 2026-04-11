import { useState, useEffect } from 'react';

const navLinks = [
  { label: 'ABOUT', href: '#about' },
  { label: 'HOW IT WORKS', href: '#how-it-works' },
  { label: 'ADVANTAGE', href: '#advantages' },
  { label: 'INDUSTRIES', href: '#industries' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-background/80 backdrop-blur-lg border-b border-border' : ''
      }`}
    >
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 py-5">
        <a href="#" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-sm bg-primary flex items-center justify-center text-primary-foreground font-heading font-bold text-xs">
            N
          </div>
          <span className="font-mono text-sm tracking-[0.2em] text-foreground font-medium">NOVA AI</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, i) => (
            <span key={link.label} className="flex items-center gap-8">
              <a
                href={link.href}
                className="font-mono text-[11px] tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
              {i < navLinks.length - 1 && (
                <span className="text-muted-foreground/40 text-[10px]">/</span>
              )}
            </span>
          ))}
          <a
            href="#get-started"
            className="ml-4 px-5 py-2 bg-primary text-primary-foreground font-mono text-[11px] tracking-[0.15em] rounded-sm hover:bg-primary/90 transition-colors border border-primary"
          >
            GET STARTED
          </a>
        </div>

        <button
          className="md:hidden flex flex-col gap-1.5"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span className={`w-6 h-0.5 bg-foreground transition-all ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`w-6 h-0.5 bg-foreground transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`w-6 h-0.5 bg-foreground transition-all ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-lg border-b border-border px-6 pb-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 font-mono text-[11px] tracking-[0.15em] text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#get-started"
            onClick={() => setMobileOpen(false)}
            className="inline-block mt-2 px-5 py-2 bg-primary text-primary-foreground font-mono text-[11px] tracking-[0.15em] rounded-sm"
          >
            GET STARTED
          </a>
        </div>
      )}
    </nav>
  );
}
