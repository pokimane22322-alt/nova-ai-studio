import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Calendar, FileText, Globe } from 'lucide-react';
import PortalHeader from '@/components/portal/PortalHeader';

export default function ClientOverview() {
  const { user } = useAuth();
  const [client, setClient] = useState<any>(null);
  const [packages, setPackages] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: c } = await supabase.from('clients').select('*').eq('user_id', user.id).maybeSingle();
      setClient(c);
      if (c) {
        const { data: cps } = await supabase
          .from('client_packages')
          .select('*, package:packages(*)')
          .eq('client_id', c.id)
          .eq('active', true);
        setPackages(cps ?? []);
      }
    })();
  }, [user]);

  return (
    <div>
      <PortalHeader title={`Welcome${client ? `, ${client.name}` : ''}`} subtitle="Your active services and upcoming billing" />
      <div className="p-8 space-y-6">
        {client && (
          <Card className="p-6 bg-card border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-muted-foreground font-mono-nova tracking-widest">START DATE</p>
                <p className="text-lg font-heading font-semibold mt-1">{client.start_date}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-mono-nova tracking-widest">NEXT BILLING</p>
                <p className="text-lg font-heading font-semibold mt-1">{client.next_billing_date ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-mono-nova tracking-widest">MONTHLY</p>
                <p className="text-lg font-heading font-semibold mt-1 text-gradient-purple-cyan">${Number(client.monthly_amount).toFixed(2)}</p>
              </div>
            </div>
          </Card>
        )}

        <div>
          <h2 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2"><Package className="w-5 h-5" /> Active Packages</h2>
          {packages.length === 0 && <p className="text-muted-foreground">No active packages yet.</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {packages.map((cp) => (
              <Card key={cp.id} className="p-5 bg-card border-border">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-heading font-semibold">{cp.package?.name}</h3>
                  <Badge variant="secondary" className="text-xs font-mono-nova">{cp.package?.recurring?.replace('_', ' ').toUpperCase()}</Badge>
                </div>
                {cp.package?.description && <p className="text-sm text-muted-foreground mb-3">{cp.package.description}</p>}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" /> {cp.next_billing_date ?? 'TBD'}</span>
                  <span className="font-heading font-bold">${Number(cp.custom_price ?? cp.package?.price).toFixed(2)}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
