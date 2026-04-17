import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import PortalHeader from '@/components/portal/PortalHeader';

interface Site { id: string; client_id: string; name: string; live_url: string | null; cpanel_url: string | null; notes: string | null; }
interface Client { id: string; name: string; }

const empty = { client_id: '', name: '', live_url: '', cpanel_url: '', notes: '' };

export default function Websites() {
  const [rows, setRows] = useState<(Site & { client: Client | null })[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Site | null>(null);
  const [form, setForm] = useState<any>(empty);

  const load = async () => {
    const [{ data: sites }, { data: cls }] = await Promise.all([
      supabase.from('websites').select('*, client:clients(id, name)').order('created_at', { ascending: false }),
      supabase.from('clients').select('id, name').order('name'),
    ]);
    setRows((sites as any) ?? []);
    setClients(cls ?? []);
  };
  useEffect(() => { load(); }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      client_id: form.client_id,
      name: form.name.trim(),
      live_url: form.live_url || null,
      cpanel_url: form.cpanel_url || null,
      notes: form.notes || null,
    };
    const res = editing
      ? await supabase.from('websites').update(payload).eq('id', editing.id)
      : await supabase.from('websites').insert(payload);
    if (res.error) return toast.error(res.error.message);
    toast.success(editing ? 'Updated' : 'Added');
    setOpen(false); setEditing(null); setForm(empty); load();
  };

  const onEdit = (s: Site) => {
    setEditing(s);
    setForm({ client_id: s.client_id, name: s.name, live_url: s.live_url ?? '', cpanel_url: s.cpanel_url ?? '', notes: s.notes ?? '' });
    setOpen(true);
  };

  const onDelete = async (id: string) => {
    if (!confirm('Delete this website?')) return;
    const { error } = await supabase.from('websites').delete().eq('id', id);
    if (error) return toast.error(error.message);
    toast.success('Deleted'); load();
  };

  return (
    <div>
      <PortalHeader
        title="Websites"
        subtitle="All managed sites"
        action={
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setEditing(null); setForm(empty); } }}>
            <DialogTrigger asChild><Button><Plus className="w-4 h-4" /> Add Website</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editing ? 'Edit Website' : 'New Website'}</DialogTitle></DialogHeader>
              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <Label>Client</Label>
                  <Select value={form.client_id} onValueChange={(v) => setForm({ ...form, client_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                    <SelectContent>{clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Site name</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div><Label>Live URL</Label><Input type="url" value={form.live_url} onChange={(e) => setForm({ ...form, live_url: e.target.value })} placeholder="https://..." /></div>
                <div><Label>cPanel URL</Label><Input type="url" value={form.cpanel_url} onChange={(e) => setForm({ ...form, cpanel_url: e.target.value })} placeholder="https://..." /></div>
                <div><Label>Notes</Label><Textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
                <DialogFooter><Button type="submit" disabled={!form.client_id}>{editing ? 'Save' : 'Create'}</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {rows.length === 0 && <p className="text-muted-foreground col-span-full text-center py-12">No websites yet.</p>}
        {rows.map((s) => (
          <Card key={s.id} className="p-5 bg-card border-border">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-heading font-semibold">{s.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{s.client?.name}</p>
              </div>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" onClick={() => onEdit(s)}><Pencil className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => onDelete(s.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </div>
            <div className="space-y-1.5 text-sm">
              {s.live_url && <a href={s.live_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-accent hover:underline"><ExternalLink className="w-3 h-3" /> Live site</a>}
              {s.cpanel_url && <a href={s.cpanel_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-primary hover:underline"><ExternalLink className="w-3 h-3" /> cPanel</a>}
            </div>
            {s.notes && <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border">{s.notes}</p>}
          </Card>
        ))}
      </div>
    </div>
  );
}
