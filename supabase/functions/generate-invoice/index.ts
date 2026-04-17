import { createClient } from 'jsr:@supabase/supabase-js@2';
import { jsPDF } from 'npm:jspdf@2.5.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LineItem {
  description: string;
  type: 'fixed' | 'percent';
  amount: number;
  basis_id: string | null;
  resolved_amount: number;
}

interface Body {
  client_id: string;
  line_items: LineItem[];
  discount_type: 'percent' | 'fixed' | null;
  discount_value: number;
  subtotal: number;
  total: number;
  due_date: string | null;
  notes: string | null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'No auth' }, 401);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Verify caller is admin
    const userClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: userData } = await userClient.auth.getUser();
    if (!userData.user) return json({ error: 'Unauthenticated' }, 401);

    const { data: roleRow } = await supabase
      .from('user_roles').select('role').eq('user_id', userData.user.id).eq('role', 'admin').maybeSingle();
    if (!roleRow) return json({ error: 'Forbidden' }, 403);

    const body: Body = await req.json();

    // Get client
    const { data: client, error: cErr } = await supabase
      .from('clients').select('*').eq('id', body.client_id).maybeSingle();
    if (cErr || !client) return json({ error: 'Client not found' }, 404);

    // Generate invoice number
    const { data: seqData } = await supabase.rpc('nextval' as any, { seq: 'invoice_seq' }).single().catch(() => ({ data: null }));
    let invoiceNumber: string;
    if (seqData && typeof seqData === 'object' && 'nextval' in (seqData as any)) {
      invoiceNumber = `INV-${(seqData as any).nextval}`;
    } else {
      // Fallback: use timestamp
      invoiceNumber = `INV-${Date.now().toString().slice(-7)}`;
    }

    // Build PDF
    const pdf = buildPdf({
      invoiceNumber,
      client,
      body,
      issueDate: new Date().toISOString().slice(0, 10),
    });
    const pdfBytes = pdf.output('arraybuffer');

    // Upload
    const path = `${client.id}/${invoiceNumber}.pdf`;
    const { error: upErr } = await supabase.storage.from('invoices').upload(path, new Uint8Array(pdfBytes), {
      contentType: 'application/pdf',
      upsert: true,
    });
    if (upErr) return json({ error: `Upload failed: ${upErr.message}` }, 500);

    // Insert invoice row
    const { data: inv, error: insErr } = await supabase.from('invoices').insert({
      client_id: client.id,
      invoice_number: invoiceNumber,
      issue_date: new Date().toISOString().slice(0, 10),
      due_date: body.due_date,
      subtotal: body.subtotal,
      discount_type: body.discount_type,
      discount_value: body.discount_value,
      total: body.total,
      status: 'sent',
      notes: body.notes,
      pdf_path: path,
      line_items: body.line_items,
    }).select().single();
    if (insErr) return json({ error: insErr.message }, 500);

    return json({ invoice_number: invoiceNumber, id: inv.id, pdf_path: path });
  } catch (e) {
    console.error(e);
    return json({ error: e instanceof Error ? e.message : String(e) }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function buildPdf({ invoiceNumber, client, body, issueDate }: any): jsPDF {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  const M = 50;
  let y = 60;

  // Header
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(108, 0, 255);
  doc.text('NOVA AI', M, y);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120);
  doc.text('Intelligent Web Solutions', M, y + 14);

  // Invoice meta (right)
  doc.setFontSize(20);
  doc.setTextColor(20);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', W - M, y, { align: 'right' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80);
  doc.text(invoiceNumber, W - M, y + 18, { align: 'right' });
  doc.text(`Issued: ${issueDate}`, W - M, y + 32, { align: 'right' });
  if (body.due_date) doc.text(`Due: ${body.due_date}`, W - M, y + 46, { align: 'right' });

  y += 80;

  // Bill to
  doc.setFontSize(9);
  doc.setTextColor(140);
  doc.text('BILL TO', M, y);
  doc.setFontSize(12);
  doc.setTextColor(20);
  doc.setFont('helvetica', 'bold');
  doc.text(client.name, M, y + 16);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(80);
  doc.text(client.email, M, y + 30);

  y += 70;

  // Items table header
  doc.setFillColor(245, 245, 250);
  doc.rect(M, y, W - M * 2, 24, 'F');
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.setFont('helvetica', 'bold');
  doc.text('DESCRIPTION', M + 10, y + 16);
  doc.text('TYPE', W - M - 180, y + 16);
  doc.text('AMOUNT', W - M - 10, y + 16, { align: 'right' });
  y += 32;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30);
  doc.setFontSize(10);

  for (const item of body.line_items as LineItem[]) {
    if (y > 720) { doc.addPage(); y = 60; }
    doc.text(item.description || 'Item', M + 10, y);
    const typeLabel = item.type === 'percent' ? `${item.amount}% of` : 'Fixed';
    doc.setTextColor(120);
    doc.setFontSize(9);
    doc.text(typeLabel, W - M - 180, y);
    doc.setTextColor(30);
    doc.setFontSize(10);
    doc.text(`$${item.resolved_amount.toFixed(2)}`, W - M - 10, y, { align: 'right' });
    y += 22;
    doc.setDrawColor(235);
    doc.line(M, y - 8, W - M, y - 8);
  }

  y += 20;

  // Totals
  const tx = W - M - 180;
  doc.setFontSize(10);
  doc.setTextColor(80);
  doc.text('Subtotal', tx, y);
  doc.setTextColor(20);
  doc.text(`$${body.subtotal.toFixed(2)}`, W - M - 10, y, { align: 'right' });
  y += 18;

  if (body.discount_type) {
    const discAmount = body.discount_type === 'percent' ? (body.subtotal * body.discount_value) / 100 : body.discount_value;
    doc.setTextColor(80);
    doc.text(`Discount${body.discount_type === 'percent' ? ` (${body.discount_value}%)` : ''}`, tx, y);
    doc.setTextColor(20);
    doc.text(`-$${discAmount.toFixed(2)}`, W - M - 10, y, { align: 'right' });
    y += 18;
  }

  doc.setDrawColor(108, 0, 255);
  doc.setLineWidth(1.5);
  doc.line(tx, y, W - M, y);
  y += 18;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(108, 0, 255);
  doc.text('TOTAL', tx, y);
  doc.text(`$${body.total.toFixed(2)}`, W - M - 10, y, { align: 'right' });

  // Notes
  if (body.notes) {
    y += 50;
    doc.setFontSize(9);
    doc.setTextColor(140);
    doc.setFont('helvetica', 'bold');
    doc.text('NOTES', M, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60);
    doc.setFontSize(10);
    const split = doc.splitTextToSize(body.notes, W - M * 2);
    doc.text(split, M, y + 14);
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(160);
  doc.text('Thank you for your business — NOVA AI', W / 2, 800, { align: 'center' });

  return doc;
}
