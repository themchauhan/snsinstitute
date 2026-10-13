'use server';

export type EnquiryState = { ok: boolean; error?: string } | null;

const clean = (v: FormDataEntryValue | null, max = 500) => String(v ?? '').trim().slice(0, max);
const escape = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/**
 * Sends a website enquiry to the institute's email via Resend (https://resend.com, free tier).
 * Optionally also posts to ENQUIRY_WEBHOOK_URL (e.g. a Google Sheet Apps Script) so leads are kept in a sheet.
 */
export async function sendEnquiry(_prev: EnquiryState, form: FormData): Promise<EnquiryState> {
  // Honeypot: bots fill hidden fields.
  if (clean(form.get('company'))) return { ok: true };

  const data = {
    name: clean(form.get('name'), 80),
    phone: clean(form.get('phone'), 20).replace(/[^\d+]/g, ''),
    course: clean(form.get('course'), 80),
    message: clean(form.get('message'), 1000),
    page: clean(form.get('page'), 200),
    at: new Date().toISOString(),
  };

  if (data.name.length < 2 || !/^(\+?91)?[6-9]\d{9}$/.test(data.phone)) {
    return { ok: false, error: 'invalid' };
  }

  const tasks: Promise<Response>[] = [];

  if (process.env.RESEND_API_KEY && process.env.ENQUIRY_EMAIL_TO) {
    const rows = Object.entries(data)
      .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0"><b>${k}</b></td><td>${escape(v)}</td></tr>`)
      .join('');
    tasks.push(
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: process.env.ENQUIRY_EMAIL_FROM || 'SNS Website <onboarding@resend.dev>',
          to: process.env.ENQUIRY_EMAIL_TO.split(','),
          subject: `New enquiry: ${data.name} (${data.course || 'General'})`,
          html: `<table>${rows}</table>`,
        }),
      }),
    );
  }

  if (process.env.ENQUIRY_WEBHOOK_URL) {
    tasks.push(
      fetch(process.env.ENQUIRY_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    );
  }

  if (tasks.length === 0) {
    console.warn('[enquiry] No RESEND_API_KEY/ENQUIRY_WEBHOOK_URL configured. Enquiry:', data);
    // In production never pretend success – the visitor is shown the WhatsApp/call fallback instead.
    return process.env.NODE_ENV === 'production' ? { ok: false, error: 'not-configured' } : { ok: true };
  }

  const results = await Promise.allSettled(tasks);
  const anyOk = results.some((r) => r.status === 'fulfilled' && r.value.ok);
  if (!anyOk) console.error('[enquiry] delivery failed', results);
  return anyOk ? { ok: true } : { ok: false, error: 'delivery' };
}
