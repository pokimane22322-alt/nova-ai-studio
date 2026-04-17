import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import PortalHeader from '@/components/portal/PortalHeader';

interface Client {
  id: string;
  name: string;
  email: string;
  start_date: string;
  next_billing_date: string | null;
  monthly_amount: number;
  notes: string | null;
}

const empty = { name: '', email: '', start_date: new Date().toISOString().slice(0, 10), next_billing_date: '', monthly_amount: 0, notes: '' };

export default function Clients() {
  const [rows, setRows] = useState<Client[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [form, setForm] = useState<any>(empty);

  const load = async () => {
    const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
    if (error) return toast.error(error.message);
    setRows(data ?? []);
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      start_date: form.start_date,
      next_billing_date: form.next_billing_date || null,
      monthly_amount: Number(form.monthly_amount) || 0,
      notes: form.notes || null,
    };
    const res = editing
      ? await supabase.from('clients').update(payload).eq('id', editing.id)
      : await supabase.from('clients').insert(payload);
    if (res.error) return toast.error(res.error.message);
    toast.success(editing ? 'Client updated' : 'Client added');
    setOpen(false);
    setEditing(null);
    setForm(empty);
    load();
  };

  const onEdit = (c: Client) => {
    setEditing(c);
    setForm({
      name: c.name,
      email: c.email,
      start_date: c.start_date,
      next_billing_date: c.next_billing_date ?? '',
      monthly_amount: c.monthly_amount,
      notes: c.notes ?? '',
    });
    setOpen(true);
  };

  const onDelete = async (id: string) => {
    if (!confirm('Delete this client and all related data?')) return;
    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (error) return toast.error(error.message);
    toast.success('Deleted');
    load();
  };

  return (
    <div>
      <PortalHeader
        title="Clients"
        subtitle={`${rows.length} total`}
        action={
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setEditing(null); setForm(empty); } }}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4" /> Add Client</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editing ? 'Edit Client' : 'New Client'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={onSubmit} className="space-y-4">
                <div><Label>Name</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div><Label>Email</Label><Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Start date</Label><Input required type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} /></div>
                  <div><Label>Next billing</Label><Input type="date" value={form.next_billing_date} onChange={(e) => setForm({ ...form, next_billing_date: e.target.value })} /></div>
                </div>
                <div><Label>Monthly amount ($)</Label><Input type="number" step="0.01" value={form.monthly_amount} onChange={(e) => setForm({ ...form, monthly_amount: e.target.value })} /></div>
                <div><Label>Notes</Label><Textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
                <DialogFooter>
                  <Button type="submit">{editing ? 'Save' : 'Create'}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />
      <div className="p-8">
        <div className="border border-border rounded-lg overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>Next Billing</TableHead>
                <TableHead className="text-right">Monthly</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-12">No clients yet.</TableCell></TableRow>
              )}
              {rows.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="text-muted-foreground">{c.email}</TableCell>
                  <TableCell>{c.start_date}</TableCell>
                  <TableCell>{c.next_billing_date ?? '—'}</TableCell>
                  <TableCell className="text-right font-mono-nova">${Number(c.monthly_amount).toFixed(2)}</TableCell>
                  <TableCell className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => onEdit(c)}><Pencil className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => onDelete(c.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
