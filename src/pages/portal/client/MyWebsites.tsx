import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { ExternalLink, Globe } from 'lucide-react';
import PortalHeader from '@/components/portal/PortalHeader';

export default function MyWebsites() {
  const { user } = useAuth();
  const [sites, setSites] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: c } = await supabase.from('clients').select('id').eq('user_id', user.id).maybeSingle();
      if (!c) return;
      const { data } = await supabase.from('websites').select('*').eq('client_id', c.id);
      setSites(data ?? []);
    })();
  }, [user]);

  return (
    <div>
      <PortalHeader title="My Websites" subtitle={`${sites.length} site${sites.length === 1 ? '' : 's'}`} />
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sites.length === 0 && <p className="text-muted-foreground col-span-full text-center py-12">No websites yet.</p>}
        {sites.map((s) => (
          <Card key={s.id} className="p-5 bg-card border-border">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-4 h-4 text-accent" />
              <h3 className="font-heading font-semibold">{s.name}</h3>
            </div>
            <div className="space-y-2 text-sm">
              {s.live_url && <a href={s.live_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-accent hover:underline"><ExternalLink className="w-3 h-3" /> Visit live site</a>}
              {s.cpanel_url && <a href={s.cpanel_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-primary hover:underline"><ExternalLink className="w-3 h-3" /> Open cPanel</a>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
