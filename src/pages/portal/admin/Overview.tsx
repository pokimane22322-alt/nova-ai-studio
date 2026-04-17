import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Users, Package, FileText, DollarSign } from 'lucide-react';
import PortalHeader from '@/components/portal/PortalHeader';

export default function AdminOverview() {
  const [stats, setStats] = useState({ clients: 0, packages: 0, invoices: 0, mrr: 0 });

  useEffect(() => {
    (async () => {
      const [c, p, i, m] = await Promise.all([
        supabase.from('clients').select('*', { count: 'exact', head: true }),
        supabase.from('packages').select('*', { count: 'exact', head: true }),
        supabase.from('invoices').select('*', { count: 'exact', head: true }),
        supabase.from('clients').select('monthly_amount'),
      ]);
      const mrr = (m.data ?? []).reduce((s, r) => s + Number(r.monthly_amount || 0), 0);
      setStats({
        clients: c.count ?? 0,
        packages: p.count ?? 0,
        invoices: i.count ?? 0,
        mrr,
      });
    })();
  }, []);

  const cards = [
    { label: 'Active Clients', value: stats.clients, icon: Users, color: 'text-primary' },
    { label: 'Packages', value: stats.packages, icon: Package, color: 'text-accent' },
    { label: 'Invoices', value: stats.invoices, icon: FileText, color: 'text-primary' },
    { label: 'Monthly Revenue', value: `$${stats.mrr.toFixed(2)}`, icon: DollarSign, color: 'text-accent' },
  ];

  return (
    <div>
      <PortalHeader title="Overview" subtitle="Snapshot of your business" />
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="p-6 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-mono-nova tracking-widest uppercase">{label}</p>
                <p className="text-3xl font-heading font-bold mt-2">{value}</p>
              </div>
              <Icon className={`w-8 h-8 ${color} opacity-60`} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
