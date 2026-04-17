import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import PortalHeader from '@/components/portal/PortalHeader';

type Recurring = 'monthly' | 'quarterly' | 'yearly' | 'one_time';

interface Pkg {
  id: string;
  name: string;
  description: string | null;
  price: number;
  recurring: Recurring;
  active: boolean;
}

const empty = { name: '', description: '', price: 0, recurring: 'monthly' as Recurring, active: true };

export default function Packages() {
  const [rows, setRows] = useState<Pkg[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Pkg | null>(null);
  const [form, setForm] = useState<any>(empty);

  const load = async () => {
    const { data, error } = await supabase.from('packages').select('*').order('created_at', { ascending: false });
    if (error) return toast.error(error.message);
    setRows(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      description: form.description || null,
      price: Number(form.price) || 0,
      recurring: form.recurring,
      active: form.active,
    };
    const res = editing
      ? await supabase.from('packages').update(payload).eq('id', editing.id)
      : await supabase.from('packages').insert(payload);
    if (res.error) return toast.error(res.error.message);
    toast.success(editing ? 'Updated' : 'Created');
    setOpen(false); setEditing(null); setForm(empty); load();
  };

  const onEdit = (p: Pkg) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description ?? '', price: p.price, recurring: p.recurring, active: p.active });
    setOpen(true);
  };

  const onDelete = async (id: string) => {
    if (!confirm('Delete this package?')) return;
    const { error } = await supabase.from('packages').delete().eq('id', id);
    if (error) return toast.error(error.message);
    toast.success('Deleted'); load();
  };

  return (
    <div>
      <PortalHeader
        title="Packages"
        subtitle="Service catalogue"
        action={
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setEditing(null); setForm(empty); } }}>
            <DialogTrigger asChild><Button><Plus className="w-4 h-4" /> Add Package</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editing ? 'Edit Package' : 'New Package'}</DialogTitle></DialogHeader>
              <form onSubmit={onSubmit} className="space-y-4">
                <div><Label>Name</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div><Label>Description</Label><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Price ($)</Label><Input required type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
                  <div>
                    <Label>Billing</Label>
                    <Select value={form.recurring} onValueChange={(v) => setForm({ ...form, recurring: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                        <SelectItem value="one_time">One-time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter><Button type="submit">{editing ? 'Save' : 'Create'}</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {rows.length === 0 && <p className="text-muted-foreground col-span-full text-center py-12">No packages yet.</p>}
        {rows.map((p) => (
          <Card key={p.id} className="p-5 bg-card border-border">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-heading font-semibold text-lg">{p.name}</h3>
                <Badge variant="secondary" className="mt-1 text-xs font-mono-nova">{p.recurring.replace('_', ' ').toUpperCase()}</Badge>
              </div>
              <p className="text-2xl font-heading font-bold text-gradient-purple-cyan">${Number(p.price).toFixed(2)}</p>
            </div>
            {p.description && <p className="text-sm text-muted-foreground mb-3">{p.description}</p>}
            <div className="flex gap-1 pt-3 border-t border-border">
              <Button size="sm" variant="ghost" onClick={() => onEdit(p)}><Pencil className="w-3.5 h-3.5" /> Edit</Button>
              <Button size="sm" variant="ghost" onClick={() => onDelete(p.id)}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
