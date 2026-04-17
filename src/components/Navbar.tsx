import { useState, useEffect } from 'react';
import NavbarLogo from './NavbarLogo';

const navLinks = [
  { label: 'ABOUT', href: '#about' },
  { label: 'HOW IT WORKS', href: '#how-it-works' },
  { label: 'ADVANTAGES', href: '#advantages' },
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
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <NavbarLogo />
          <span className="font-heading font-bold text-lg tracking-wider text-foreground">NOVA AI</span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-mono text-xs tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/portal"
            className="font-mono text-xs tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            PORTAL
          </a>
          <a
            href="#get-started"
            className="px-5 py-2 bg-primary text-primary-foreground font-mono text-xs tracking-widest rounded-sm hover:bg-nova-glow transition-colors"
          >
            GET STARTED
          </a>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden flex flex-col gap-1.5"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span className={`w-6 h-0.5 bg-foreground transition-all ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`w-6 h-0.5 bg-foreground transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`w-6 h-0.5 bg-foreground transition-all ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-lg border-b border-border px-6 pb-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 font-mono text-xs tracking-widest text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#get-started"
            onClick={() => setMobileOpen(false)}
            className="inline-block mt-2 px-5 py-2 bg-primary text-primary-foreground font-mono text-xs tracking-widest rounded-sm"
          >
            GET STARTED
          </a>
        </div>
      )}
    </nav>
  );
}
