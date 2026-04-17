import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard, Users, Package, FileText, Globe, Mail, LogOut, User as UserIcon,
} from 'lucide-react';

export default function PortalLayout() {
  const { role, user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/portal/login');
  };

  const adminNav = [
    { to: '/portal', icon: LayoutDashboard, label: 'Overview', end: true },
    { to: '/portal/clients', icon: Users, label: 'Clients' },
    { to: '/portal/packages', icon: Package, label: 'Packages' },
    { to: '/portal/invoices', icon: FileText, label: 'Invoices' },
    { to: '/portal/websites', icon: Globe, label: 'Websites' },
    { to: '/portal/allowlist', icon: Mail, label: 'Allowlist' },
  ];

  const clientNav = [
    { to: '/portal', icon: LayoutDashboard, label: 'My Dashboard', end: true },
    { to: '/portal/my-invoices', icon: FileText, label: 'My Invoices' },
    { to: '/portal/my-websites', icon: Globe, label: 'My Websites' },
  ];

  const nav = role === 'admin' ? adminNav : clientNav;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/30 flex flex-col">
        <Link to="/portal" className="p-6 border-b border-border">
          <h2 className="font-heading font-bold text-xl text-gradient-purple-cyan">NOVA Portal</h2>
          <p className="text-xs text-muted-foreground font-mono-nova mt-1">
            {role === 'admin' ? 'ADMIN' : 'CLIENT'}
          </p>
        </Link>

        <nav className="flex-1 p-4 space-y-1">
          {nav.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                  isActive
                    ? 'bg-primary/15 text-primary border border-primary/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground truncate">
            <UserIcon className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{user?.email}</span>
          </div>
          <Button onClick={handleSignOut} variant="outline" size="sm" className="w-full">
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </Button>
          <Link to="/" className="block text-xs text-center text-muted-foreground hover:text-foreground">
            ← Back to site
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
