import Link from 'next/link';
import Image from 'next/image';
import { Icon } from './Icon';

export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}

export function Section({ id, title, sub, children, className = '' }: { id?: string; title?: string; sub?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`mx-auto max-w-7xl px-4 pt-20 ${className}`}>
      {title && (
        <div className="mb-10 max-w-2xl">
          <h2 className="font-display text-3xl font-extrabold text-brand-950 sm:text-4xl">{title}</h2>
          {sub && <p className="mt-3 text-lg text-ink-600">{sub}</p>}
          <div className="mt-4 h-1.5 w-16 rounded-full bg-accent-500" />
        </div>
      )}
      {children}
    </section>
  );
}

export function PageHero({ title, sub, crumbs }: { title: string; sub?: string; crumbs: { href: string; label: string }[] }) {
  return (
    <div className="bg-hero-pattern border-b border-brand-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-ink-600">
          <ol className="flex flex-wrap items-center gap-1">
            {crumbs.map((c, i) => (
              <li key={c.href} className="flex items-center gap-1">
                {i > 0 && <span aria-hidden>/</span>}
                {i < crumbs.length - 1 ? (
                  <Link href={c.href} className="hover:text-brand-600">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="font-semibold text-brand-800">
                    {c.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="font-display text-4xl font-extrabold text-brand-950 sm:text-5xl">{title}</h1>
        {sub && <p className="mt-4 max-w-3xl text-lg text-ink-700">{sub}</p>}
      </div>
    </div>
  );
}

/** Photo with an initials fallback, so the site looks complete before real photos are uploaded. */
export function Avatar({ src, name, className = 'size-24', sizes = '96px' }: { src?: string | null; name: string; className?: string; sizes?: string }) {
  const initials = name
    .replace(/^(Dr\.?|Mrs\.?|Mr\.?|Ms\.?)\s+/i, '')
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <div className={`relative shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-brand-500 to-brand-800 ${className}`}>
      {src ? (
        <Image src={src} alt={name} fill sizes={sizes} className="object-cover" />
      ) : (
        <span aria-hidden className="grid size-full place-items-center font-display text-2xl font-bold text-white">
          {initials}
        </span>
      )}
    </div>
  );
}

export function Stars({ n = 5 }: { n?: number }) {
  return (
    <span className="flex text-accent-400" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: n }).map((_, i) => (
        <Icon key={i} name="star" className="size-4 fill-current" />
      ))}
    </span>
  );
}
