import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import PortalHeader from '@/components/portal/PortalHeader';

export default function MyInvoices() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: c } = await supabase.from('clients').select('id').eq('user_id', user.id).maybeSingle();
      if (!c) return;
      const { data } = await supabase.from('invoices').select('*').eq('client_id', c.id).order('issue_date', { ascending: false });
      setInvoices(data ?? []);
    })();
  }, [user]);

  return (
    <div>
      <PortalHeader title="My Invoices" subtitle={`${invoices.length} on record`} />
      <div className="p-8 space-y-2">
        {invoices.length === 0 && <p className="text-muted-foreground text-center py-12">No invoices yet.</p>}
        {invoices.map((inv) => (
          <Card key={inv.id} className="p-4 bg-card border-border flex items-center justify-between">
            <div className="flex items-center gap-4">
              <FileText className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium font-mono-nova">{inv.invoice_number}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Issued {inv.issue_date}{inv.due_date ? ` • Due ${inv.due_date}` : ''}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-xs">{inv.status}</Badge>
              <p className="text-lg font-heading font-bold w-28 text-right">${Number(inv.total).toFixed(2)}</p>
              <DownloadBtn pdfPath={inv.pdf_path} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function DownloadBtn({ pdfPath }: { pdfPath: string | null }) {
  const [busy, setBusy] = useState(false);
  if (!pdfPath) return <Button size="sm" variant="ghost" disabled>Pending</Button>;
  const handle = async () => {
    setBusy(true);
    const { data, error } = await supabase.storage.from('invoices').createSignedUrl(pdfPath, 60);
    setBusy(false);
    if (error || !data) return toast.error('Could not get download link');
    window.open(data.signedUrl, '_blank');
  };
  return <Button size="sm" variant="outline" onClick={handle} disabled={busy}>{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} PDF</Button>;
}
