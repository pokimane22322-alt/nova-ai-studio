import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Download, FileText, Loader2, Percent, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import PortalHeader from '@/components/portal/PortalHeader';

interface LineItem {
  id: string;
  description: string;
  type: 'fixed' | 'percent';
  amount: number;
  basis_id?: string | null; // for percent: which line it's a % of
  source: 'package' | 'custom';
}

interface Pkg { id: string; name: string; price: number; recurring: string; }
interface Client { id: string; name: string; email: string; }
interface Invoice {
  id: string; invoice_number: string; client_id: string; issue_date: string;
  total: number; status: string; pdf_path: string | null;
  client?: Client | null;
}

const newId = () => Math.random().toString(36).slice(2, 10);

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    const { data, error } = await supabase
      .from('invoices')
      .select('*, client:clients(id, name, email)')
      .order('created_at', { ascending: false });
    if (error) return toast.error(error.message);
    setInvoices((data as any) ?? []);
  };
  useEffect(() => { load(); }, []);

  if (creating) return <InvoiceBuilder onDone={() => { setCreating(false); load(); }} onCancel={() => setCreating(false)} />;

  return (
    <div>
      <PortalHeader
        title="Invoices"
        subtitle={`${invoices.length} total`}
        action={<Button onClick={() => setCreating(true)}><Plus className="w-4 h-4" /> New Invoice</Button>}
      />
      <div className="p-8 space-y-2">
        {invoices.length === 0 && <p className="text-muted-foreground text-center py-12">No invoices yet.</p>}
        {invoices.map((inv) => (
          <Card key={inv.id} className="p-4 bg-card border-border flex items-center justify-between">
            <div className="flex items-center gap-4">
              <FileText className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium font-mono-nova">{inv.invoice_number}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{inv.client?.name} • {inv.issue_date}</p>
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
  if (!pdfPath) return <Button size="sm" variant="ghost" disabled>No PDF</Button>;
  const handle = async () => {
    setBusy(true);
    const { data, error } = await supabase.storage.from('invoices').createSignedUrl(pdfPath, 60);
    setBusy(false);
    if (error || !data) return toast.error('Could not get download link');
    window.open(data.signedUrl, '_blank');
  };
  return <Button size="sm" variant="outline" onClick={handle} disabled={busy}>{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} PDF</Button>;
}

// ============== Invoice Builder ==============

function InvoiceBuilder({ onDone, onCancel }: { onDone: () => void; onCancel: () => void }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [packages, setPackages] = useState<Pkg[]>([]);
  const [clientId, setClientId] = useState('');
  const [items, setItems] = useState<LineItem[]>([]);
  const [discountType, setDiscountType] = useState<'none' | 'percent' | 'fixed'>('none');
  const [discountValue, setDiscountValue] = useState(0);
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    (async () => {
      const [{ data: cls }, { data: pks }] = await Promise.all([
        supabase.from('clients').select('id, name, email').order('name'),
        supabase.from('packages').select('id, name, price, recurring').eq('active', true).order('name'),
      ]);
      setClients(cls ?? []);
      setPackages((pks as any) ?? []);
    })();
  }, []);

  const addPackage = (pkgId: string) => {
    const p = packages.find((x) => x.id === pkgId);
    if (!p) return;
    setItems((prev) => [...prev, { id: newId(), description: p.name, type: 'fixed', amount: Number(p.price), source: 'package' }]);
  };

  const addCustom = () => setItems((prev) => [...prev, { id: newId(), description: '', type: 'fixed', amount: 0, source: 'custom' }]);

  const updateItem = (id: string, patch: Partial<LineItem>) => setItems((prev) => prev.map((i) => i.id === id ? { ...i, ...patch } : i));
  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  // Compute resolved amounts (percent items reference another line by id)
  const resolveAmount = (item: LineItem): number => {
    if (item.type === 'fixed') return Number(item.amount) || 0;
    const basis = items.find((x) => x.id === item.basis_id);
    if (!basis) return 0;
    return (resolveAmount(basis) * (Number(item.amount) || 0)) / 100;
  };

  const subtotal = items.reduce((s, i) => s + resolveAmount(i), 0);
  const discount = discountType === 'none' ? 0 : discountType === 'percent' ? (subtotal * discountValue) / 100 : Number(discountValue) || 0;
  const total = Math.max(0, subtotal - discount);

  const handleGenerate = async () => {
    if (!clientId) return toast.error('Select a client');
    if (items.length === 0) return toast.error('Add at least one item');

    setGenerating(true);
    const lineItems = items.map((i) => ({
      description: i.description,
      type: i.type,
      amount: Number(i.amount),
      basis_id: i.basis_id ?? null,
      resolved_amount: Number(resolveAmount(i).toFixed(2)),
    }));

    const { data, error } = await supabase.functions.invoke('generate-invoice', {
      body: {
        client_id: clientId,
        line_items: lineItems,
        discount_type: discountType === 'none' ? null : discountType,
        discount_value: discountType === 'none' ? 0 : Number(discountValue),
        subtotal: Number(subtotal.toFixed(2)),
        total: Number(total.toFixed(2)),
        due_date: dueDate || null,
        notes: notes || null,
      },
    });
    setGenerating(false);
    if (error) return toast.error(error.message);
    toast.success(`Invoice ${data?.invoice_number} created`);
    onDone();
  };

  return (
    <div>
      <PortalHeader
        title="New Invoice"
        subtitle="Build, preview, and generate PDF"
        action={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onCancel}>Cancel</Button>
            <Button onClick={handleGenerate} disabled={generating}>
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              Generate PDF
            </Button>
          </div>
        }
      />
      <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: builder */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5 bg-card border-border space-y-4">
            <div>
              <Label>Client</Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                <SelectContent>{clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name} — {c.email}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Due date</Label><Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></div>
            </div>
          </Card>

          <Card className="p-5 bg-card border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold">Line Items</h3>
              <div className="flex gap-2">
                <Select value="" onValueChange={addPackage}>
                  <SelectTrigger className="w-44"><SelectValue placeholder="+ Add package" /></SelectTrigger>
                  <SelectContent>{packages.map((p) => <SelectItem key={p.id} value={p.id}>{p.name} (${p.price})</SelectItem>)}</SelectContent>
                </Select>
                <Button size="sm" variant="outline" onClick={addCustom}><Plus className="w-3.5 h-3.5" /> Custom</Button>
              </div>
            </div>

            {items.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">Add packages or custom items.</p>}

            <div className="space-y-2">
              {items.map((it) => {
                const resolved = resolveAmount(it);
                return (
                  <div key={it.id} className="grid grid-cols-12 gap-2 items-center p-3 rounded-md border border-border bg-background/50">
                    <Input
                      className="col-span-5"
                      placeholder="Description"
                      value={it.description}
                      onChange={(e) => updateItem(it.id, { description: e.target.value })}
                    />
                    <Select value={it.type} onValueChange={(v) => updateItem(it.id, { type: v as any, basis_id: v === 'percent' ? items.find((x) => x.id !== it.id)?.id : undefined })}>
                      <SelectTrigger className="col-span-2"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed $</SelectItem>
                        <SelectItem value="percent">% of</SelectItem>
                      </SelectContent>
                    </Select>
                    {it.type === 'percent' ? (
                      <Select value={it.basis_id ?? ''} onValueChange={(v) => updateItem(it.id, { basis_id: v })}>
                        <SelectTrigger className="col-span-2"><SelectValue placeholder="Basis" /></SelectTrigger>
                        <SelectContent>
                          {items.filter((x) => x.id !== it.id).map((x) => (
                            <SelectItem key={x.id} value={x.id}>{x.description || 'Item'}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : <div className="col-span-2" />}
                    <Input
                      className="col-span-2"
                      type="number" step="0.01"
                      value={it.amount}
                      onChange={(e) => updateItem(it.id, { amount: Number(e.target.value) })}
                    />
                    <div className="col-span-1 text-right text-sm font-mono-nova">${resolved.toFixed(2)}</div>
                    <Button size="icon" variant="ghost" onClick={() => removeItem(it.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-5 bg-card border-border space-y-3">
            <Label>Notes (optional)</Label>
            <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Payment terms, thank you message, etc." />
          </Card>
        </div>

        {/* Right: totals */}
        <div className="space-y-4">
          <Card className="p-5 bg-card border-border space-y-4 sticky top-24">
            <h3 className="font-heading font-semibold">Summary</h3>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="font-mono-nova">${subtotal.toFixed(2)}</span></div>

            <div className="space-y-2 pt-3 border-t border-border">
              <Label className="text-xs">Discount</Label>
              <div className="flex gap-2">
                <Button size="sm" variant={discountType === 'none' ? 'default' : 'outline'} onClick={() => setDiscountType('none')}>None</Button>
                <Button size="sm" variant={discountType === 'percent' ? 'default' : 'outline'} onClick={() => setDiscountType('percent')}><Percent className="w-3 h-3" /></Button>
                <Button size="sm" variant={discountType === 'fixed' ? 'default' : 'outline'} onClick={() => setDiscountType('fixed')}><DollarSign className="w-3 h-3" /></Button>
              </div>
              {discountType !== 'none' && (
                <Input type="number" step="0.01" value={discountValue} onChange={(e) => setDiscountValue(Number(e.target.value))} />
              )}
              {discount > 0 && <div className="flex justify-between text-sm text-accent"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>}
            </div>

            <div className="flex justify-between text-lg font-heading font-bold pt-3 border-t border-border">
              <span>Total</span>
              <span className="text-gradient-purple-cyan">${total.toFixed(2)}</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
