import { getDict, href, pick, type Locale } from '@/lib/i18n';
import { getCourses, getSettings } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { PageHero } from '@/components/ui';
import { EnquiryForm } from '@/components/EnquiryForm';
import { Icon } from '@/components/Icon';

export async function generateMetadata({ params }: PageProps<'/[lang]/contact'>) {
  const lang = (await params).lang as Locale;
  const hi = lang === 'hi';
  return buildMetadata({
    lang,
    path: '/contact',
    title: hi ? 'संपर्क करें – पता, फ़ोन और मैप' : 'Contact Us – Address, Phone & Map',
    description: hi
      ? 'SNS इंस्टीट्यूट, गोपाल देव चौक, नारनौल रोड, रेवाड़ी। फ्री डेमो क्लास के लिए कॉल या व्हाट्सएप करें।'
      : 'Visit SNS Institute at Gopal Dev Chowk, Narnaul Road, Rewari. Call or WhatsApp to book a free demo class.',
  });
}

export default async function ContactPage({ params }: PageProps<'/[lang]/contact'>) {
  const lang = (await params).lang as Locale;
  const t = getDict(lang);
  const [s, courses] = await Promise.all([getSettings(), getCourses()]);
  const tel = (p: string) => `tel:+91${p.replace(/\D/g, '').slice(-10)}`;
  const rows = [
    { icon: 'pin', k: t.contact.address, v: <address className="not-italic">{pick(lang, s.addressEn, s.addressHi)}</address> },
    {
      icon: 'phone',
      k: t.contact.phone,
      v: (
        <span className="flex flex-wrap gap-x-3">
          {s.phones.map((p) => (
            <a key={p} href={tel(p)} className="font-semibold text-brand-700 hover:underline">
              {p}
            </a>
          ))}
        </span>
      ),
    },
    { icon: 'clock', k: t.contact.hours, v: pick(lang, s.hoursEn, s.hoursHi) },
    ...(s.email ? [{ icon: 'mail', k: t.contact.email, v: <a href={`mailto:${s.email}`} className="text-brand-700 hover:underline">{s.email}</a> }] : []),
  ];

  return (
    <>
      <PageHero
        title={t.contact.title}
        crumbs={[
          { href: href(lang), label: t.misc.breadcrumbHome },
          { href: href(lang, '/contact'), label: t.nav.contact },
        ]}
      />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-12 lg:grid-cols-2">
        <div>
          <ul className="space-y-5">
            {rows.map((r) => (
              <li key={r.k} className="flex gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                  <Icon name={r.icon} className="size-6" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink-500">{r.k}</p>
                  <div className="text-lg text-ink-900">{r.v}</div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            {s.mapUrl && (
              <a href={s.mapUrl} target="_blank" rel="noopener" className="btn-outline">
                <Icon name="pin" className="size-4" /> {t.cta.directions}
              </a>
            )}
            {s.whatsapp && (
              <a href={`https://wa.me/${s.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener" className="btn-accent">
                <Icon name="whatsapp" className="size-5" /> {t.cta.whatsapp}
              </a>
            )}
          </div>
          {s.mapEmbed && (
            <iframe
              title="SNS Institute Rewari on Google Maps"
              src={s.mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="mt-8 aspect-[4/3] w-full rounded-3xl border-0 ring-1 ring-ink-200"
            />
          )}
        </div>
        <div id="enquiry" className="scroll-mt-28 rounded-3xl bg-surface p-6 shadow-xl ring-1 ring-ink-200 sm:p-8 lg:self-start">
          <h2 className="font-display text-2xl font-bold text-brand-950">{t.form.title}</h2>
          <p className="mt-1 mb-5 text-ink-600">{t.form.sub}</p>
          <EnquiryForm t={t.form} courses={courses.map((c) => c.entry.titleEn)} whatsapp={s.whatsapp} />
        </div>
      </div>
    </>
  );
}
