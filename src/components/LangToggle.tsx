'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/** Switches between /path (English) and /hi/path (Hindi) for the current page. */
export function LangToggle({ lang, label, title }: { lang: 'en' | 'hi'; label: string; title: string }) {
  const pathname = usePathname() || '/';
  const bare = pathname.replace(/^\/(hi|en)(?=\/|$)/, '') || '/';
  const target = lang === 'en' ? (bare === '/' ? '/hi' : `/hi${bare}`) : bare;
  return (
    <Link
      href={target}
      hrefLang={lang === 'en' ? 'hi' : 'en'}
      title={title}
      className="inline-flex items-center gap-1 rounded-full border border-brand-200 px-3 py-1.5 text-sm font-semibold text-brand-800 transition hover:border-brand-500 hover:bg-brand-50"
    >
      <span aria-hidden className="text-xs">अ/A</span>
      {label}
    </Link>
  );
}
