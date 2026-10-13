'use client';

import { useActionState } from 'react';
import { usePathname } from 'next/navigation';
import { sendEnquiry, type EnquiryState } from '@/app/actions';
import type { Dict } from '@/lib/i18n';

type Props = { t: Dict['form']; courses: string[]; whatsapp?: string; defaultCourse?: string };

export function EnquiryForm({ t, courses, whatsapp, defaultCourse }: Props) {
  const [state, action, pending] = useActionState<EnquiryState, FormData>(sendEnquiry, null);
  const pathname = usePathname();

  if (state?.ok) {
    return (
      <div role="status" className="rounded-2xl bg-success-bg p-8 text-center text-lg font-semibold text-success-text">
        ✅ {t.success}
      </div>
    );
  }

  const input =
    'w-full rounded-xl border border-ink-300 bg-surface px-4 py-3 text-base text-ink-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100';

  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="page" value={pathname ?? ''} />
      <div className="hidden" aria-hidden>
        <label>
          Company <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="grid gap-1.5">
        <span className="text-sm font-semibold text-ink-700">{t.name} *</span>
        <input name="name" required minLength={2} autoComplete="name" className={input} />
      </label>
      <label className="grid gap-1.5">
        <span className="text-sm font-semibold text-ink-700">{t.phone} *</span>
        <input name="phone" required type="tel" inputMode="numeric" pattern="(\+?91)?[6-9][0-9]{9}" autoComplete="tel" placeholder="98XXXXXXXX" className={input} />
      </label>
      <label className="grid gap-1.5">
        <span className="text-sm font-semibold text-ink-700">{t.klass}</span>
        <select name="course" defaultValue={defaultCourse ?? ''} className={input}>
          <option value="">{t.select}</option>
          {courses.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-1.5">
        <span className="text-sm font-semibold text-ink-700">{t.message}</span>
        <textarea name="message" rows={3} className={input} />
      </label>
      {state?.error && (
        <p role="alert" className="rounded-lg bg-error-bg px-4 py-3 text-sm text-error-text">
          {t.error}
          {whatsapp && (
            <>
              {' '}
              <a className="font-semibold underline" href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}>
                WhatsApp
              </a>
            </>
          )}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn-accent justify-center py-3.5 text-lg disabled:opacity-60">
        {pending ? t.sending : t.submit}
      </button>
    </form>
  );
}
