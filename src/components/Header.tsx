import Link from 'next/link';
import { getDict, href, type Locale } from '@/lib/i18n';
import type { Settings } from '@/lib/content';
import { Logo } from './Logo';
import { LangToggle } from './LangToggle';
import { MobileMenu } from './MobileMenu';
import { Icon } from './Icon';

export function Header({ lang, settings, announcement }: { lang: Locale; settings: Settings; announcement?: string }) {
  const t = getDict(lang);
  const items = [
    { href: href(lang, '/courses'), label: t.nav.courses },
    { href: href(lang, '/results'), label: t.nav.results },
    { href: href(lang, '/faculty'), label: t.nav.faculty },
    { href: href(lang, '/updates'), label: t.nav.updates },
    { href: href(lang, '/about'), label: t.nav.about },
    { href: href(lang, '/contact'), label: t.nav.contact },
  ];
  const cta = { href: href(lang, '/contact#enquiry'), label: t.cta.demo };
  const phone = settings.phones[0];

  return (
    <>
      {announcement && (
        <div className="bg-brand-900 px-4 py-2 text-center text-sm font-medium text-white">
          {announcement}{' '}
          <Link href={cta.href} className="font-bold text-accent-300 underline underline-offset-2">
            {t.cta.enquire} →
          </Link>
        </div>
      )}
      <header className="sticky top-0 z-40 border-b border-brand-100 bg-surface/95 backdrop-blur">
        <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 lg:h-20">
          <Link href={href(lang)} aria-label={`SNS Institute Rewari – ${t.nav.home}`} className="shrink-0">
            <Logo className="h-11 w-auto lg:h-13" />
          </Link>
          <nav aria-label="Main" className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {items.map((i) => (
                <li key={i.href}>
                  <Link href={i.href} className="rounded-lg px-3 py-2 font-semibold whitespace-nowrap text-brand-900 hover:bg-brand-50 hover:text-brand-600">
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <LangToggle lang={lang} label={t.misc.langSwitch} title={t.misc.langSwitchLabel} />
            {phone && (
              <a href={`tel:+91${phone.replace(/\D/g, '').slice(-10)}`} className="btn-accent hidden sm:inline-flex">
                <Icon name="phone" className="size-4" />
                {phone}
              </a>
            )}
            <MobileMenu items={items} menuLabel={t.misc.menu} closeLabel={t.misc.close} cta={cta} />
          </div>
        </div>
      </header>
    </>
  );
}
