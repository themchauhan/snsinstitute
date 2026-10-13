'use server';

import nodemailer from 'nodemailer';

export type EnquiryState = { ok: boolean; error?: string } | null;

const clean = (v: FormDataEntryValue | null, max = 500) => String(v ?? '').trim().slice(0, max);
const escape = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

type Enquiry = { name: string; phone: string; course: string; message: string; page: string; at: string };

function emailHtml(d: Enquiry) {
  const when = new Date(d.at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });
  const row = (k: string, v: string) =>
    v ? `<tr><td style="padding:6px 16px 6px 0;color:#5c616b"><b>${k}</b></td><td style="padding:6px 0">${escape(v)}</td></tr>` : '';
  return `<div style="font-family:Arial,sans-serif;font-size:15px;color:#2b303a">
  <h2 style="margin:0 0 12px;color:#26335b">New enquiry from the website</h2>
  <table>${row('Name', d.name)}${row('Phone', d.phone)}${row('Course', d.course)}${row('Message', d.message)}${row('Page', d.page)}${row('Received', when)}</table>
  <p style="margin-top:16px"><a href="tel:+91${d.phone.slice(-10)}">📞 Call</a> &nbsp;·&nbsp; <a href="https://wa.me/91${d.phone.slice(-10)}">💬 WhatsApp</a></p>
</div>`;
}

/**
 * Sends a website enquiry by email. Uses, in this order of preference:
 *  - Gmail SMTP with an App Password (GMAIL_USER + GMAIL_APP_PASSWORD)
 *  - Resend (RESEND_API_KEY) – optional fallback
 * Optionally also posts to ENQUIRY_WEBHOOK_URL (e.g. a Google Sheet Apps Script) so leads are kept in a sheet.
 */
export async function sendEnquiry(_prev: EnquiryState, form: FormData): Promise<EnquiryState> {
  // Honeypot: bots fill hidden fields.
  if (clean(form.get('company'))) return { ok: true };

  const data: Enquiry = {
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

  const subject = `New enquiry: ${data.name} (${data.course || 'General'})`;
  const html = emailHtml(data);
  const to = (process.env.ENQUIRY_EMAIL_TO || process.env.GMAIL_USER || '').split(',').map((s) => s.trim()).filter(Boolean);
  const tasks: Promise<unknown>[] = [];

  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD && to.length) {
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD.replace(/\s/g, '') },
    });
    tasks.push(
      transport.sendMail({
        from: `"SNS Website" <${process.env.GMAIL_USER}>`,
        to,
        subject,
        html,
      }),
    );
  } else if (process.env.RESEND_API_KEY && to.length) {
    tasks.push(
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: process.env.ENQUIRY_EMAIL_FROM || 'SNS Website <onboarding@resend.dev>', to, subject, html }),
      }).then((r) => {
        if (!r.ok) throw new Error(`Resend ${r.status}`);
      }),
    );
  }

  if (process.env.ENQUIRY_WEBHOOK_URL) {
    tasks.push(
      fetch(process.env.ENQUIRY_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((r) => {
        if (!r.ok) throw new Error(`Webhook ${r.status}`);
      }),
    );
  }

  if (tasks.length === 0) {
    console.warn('[enquiry] No email (GMAIL_USER/GMAIL_APP_PASSWORD) or webhook configured. Enquiry:', data);
    // In production never pretend success – the visitor is shown the WhatsApp/call fallback instead.
    return process.env.NODE_ENV === 'production' ? { ok: false, error: 'not-configured' } : { ok: true };
  }

  const results = await Promise.allSettled(tasks);
  const failed = results.filter((r) => r.status === 'rejected');
  if (failed.length) console.error('[enquiry] delivery failed', failed);
  return failed.length < results.length ? { ok: true } : { ok: false, error: 'delivery' };
}
