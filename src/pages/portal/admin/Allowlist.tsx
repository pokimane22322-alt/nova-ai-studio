import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import PortalHeader from '@/components/portal/PortalHeader';

interface Allowed { id: string; email: string; role: 'admin' | 'client'; }

export default function Allowlist() {
  const [rows, setRows] = useState<Allowed[]>([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'client'>('client');
  const [open, setOpen] = useState(false);

  const load = async () => {
    const { data, error } = await supabase.from('allowed_emails').select('*').order('added_at', { ascending: false });
    if (error) return toast.error(error.message);
    setRows(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const onAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('allowed_emails').insert({ email: email.trim().toLowerCase(), role });
    if (error) return toast.error(error.message);
    toast.success('Email whitelisted');
    setEmail(''); setOpen(false); load();
  };

  const onDelete = async (id: string) => {
    if (!confirm('Remove from allowlist? They will lose access on next login.')) return;
    const { error } = await supabase.from('allowed_emails').delete().eq('id', id);
    if (error) return toast.error(error.message);
    toast.success('Removed'); load();
  };

  return (
    <div>
      <PortalHeader
        title="Email Allowlist"
        subtitle="Pre-approve emails before clients sign in with Google"
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="w-4 h-4" /> Add Email</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Whitelist Email</DialogTitle></DialogHeader>
              <form onSubmit={onAdd} className="space-y-4">
                <div><Label>Email</Label><Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="client@example.com" /></div>
                <div>
                  <Label>Role</Label>
                  <div className="flex gap-2 mt-2">
                    <Button type="button" variant={role === 'client' ? 'default' : 'outline'} onClick={() => setRole('client')}>Client</Button>
                    <Button type="button" variant={role === 'admin' ? 'default' : 'outline'} onClick={() => setRole('admin')}>Admin</Button>
                  </div>
                </div>
                <DialogFooter><Button type="submit">Add</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />
      <div className="p-8 space-y-2">
        {rows.length === 0 && <p className="text-muted-foreground text-center py-12">No whitelisted emails yet. Add yourself as admin first.</p>}
        {rows.map((r) => (
          <Card key={r.id} className="p-4 bg-card border-border flex items-center justify-between">
            <div>
              <p className="font-medium">{r.email}</p>
              <p className="text-xs text-muted-foreground font-mono-nova mt-0.5">{r.role.toUpperCase()}</p>
            </div>
            <Button size="icon" variant="ghost" onClick={() => onDelete(r.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
