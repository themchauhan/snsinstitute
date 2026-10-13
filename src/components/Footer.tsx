import Link from 'next/link';
import { getDict, href, pick, type Locale } from '@/lib/i18n';
import type { Settings, CourseEntry, Entry, Location } from '@/lib/content';
import { Logo } from './Logo';
import { Icon } from './Icon';


export function Footer({ lang, settings, courses, locations }: { lang: Locale; settings: Settings; courses: CourseEntry[]; locations: Entry<Location>[] }) {
  const t = getDict(lang);
  const tel = (p: string) => `tel:+91${p.replace(/\D/g, '').slice(-10)}`;
  return (
    <footer className="mt-24 bg-brand-950 text-brand-100">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light className="h-12 w-auto" />
          <p className="mt-4 text-sm leading-relaxed text-brand-200">{t.footer.tagline}</p>
          {settings.rating ? (
            <a href={settings.googleReviewUrl || settings.mapUrl || '#'} target="_blank" rel="noopener" className="mt-4 inline-flex items-center gap-2 text-sm">
              <span className="flex text-accent-300">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon key={i} name="star" className="size-4 fill-current" />
                ))}
              </span>
              <span className="font-semibold text-white">{settings.rating.toFixed(1)}</span>
              <span className="text-brand-300">· {settings.reviewCount} {t.home.reviewsOnGoogle}</span>
            </a>
          ) : null}
        </div>
        <div>
          <h2 className="font-display text-lg font-bold text-white">{t.footer.courses}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {courses.map((c) => (
              <li key={c.slug}>
                <Link href={href(lang, `/courses/${c.slug}`)} className="hover:text-white">
                  {pick(lang, c.entry.titleEn, c.entry.titleHi)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-display text-lg font-bold text-white">{t.footer.quick}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {(['results', 'faculty', 'updates', 'about', 'gallery', 'contact'] as const).map((k) => (
              <li key={k}>
                <Link href={href(lang, `/${k}`)} className="hover:text-white">
                  {t.nav[k]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-display text-lg font-bold text-white">{t.footer.reach}</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-2">
              <Icon name="pin" className="mt-0.5 size-4 shrink-0 text-accent-300" />
              <address className="not-italic">{pick(lang, settings.addressEn, settings.addressHi)}</address>
            </li>
            <li className="flex gap-2">
              <Icon name="phone" className="mt-0.5 size-4 shrink-0 text-accent-300" />
              <span className="flex flex-wrap gap-x-2">
                {settings.phones.map((p) => (
                  <a key={p} href={tel(p)} className="hover:text-white">
                    {p}
                  </a>
                ))}
              </span>
            </li>
            <li className="flex gap-2">
              <Icon name="clock" className="mt-0.5 size-4 shrink-0 text-accent-300" />
              {pick(lang, settings.hoursEn, settings.hoursHi)}
            </li>
          </ul>
        </div>
      </div>
      {locations.length > 0 && (
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-brand-300">
            <span className="font-semibold text-brand-100">{t.home.nearbyTitle}: </span>
            {locations.map((l, i) => (
              <span key={l.slug}>
                {i > 0 && ' · '}
                <Link href={href(lang, `/coaching-near/${l.slug}`)} className="hover:text-white">
                  {pick(lang, l.entry.town, l.entry.townHi)}
                </Link>
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="border-t border-white/10 px-4 pt-5 pb-24 text-center text-xs text-brand-300 sm:pb-5">
        © {new Date().getFullYear()} SNS Institute, Rewari. {t.footer.rights}
      </div>
    </footer>
  );
}
