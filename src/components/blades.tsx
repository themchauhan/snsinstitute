import Link from 'next/link';
import Image from 'next/image';
import { getDict, type Locale } from '@/lib/i18n';
import type { Settings } from '@/lib/content';
import { EnquiryForm } from './EnquiryForm';
import { Icon } from './Icon';

const telOf = (p?: string) => (p ? `tel:+91${p.replace(/\D/g, '').slice(-10)}` : undefined);

/** "How your free demo class works" – 4 steps + call to action. */
export function DemoSteps({ lang, settings, demoHref = '#book-demo' }: { lang: Locale; settings: Settings; demoHref?: string }) {
  const t = getDict(lang);
  const phone = settings.phones[0];
  return (
    <section className="mx-auto max-w-7xl px-4 pt-20">
      <div className="rounded-[2rem] bg-brand-50 px-6 py-12 sm:px-10">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-extrabold text-brand-950 sm:text-4xl">{t.home.stepsTitle}</h2>
          <p className="mt-3 text-lg text-ink-600">{t.home.stepsSub}</p>
        </div>
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.home.steps.map((s, i) => (
            <li key={s.t} className="rounded-2xl bg-surface p-6 shadow-sm ring-1 ring-ink-200">
              <span className="grid size-11 place-items-center rounded-full bg-accent-500 font-display text-xl font-extrabold text-white">{i + 1}</span>
              <h3 className="mt-4 font-display text-lg font-bold text-brand-950">{s.t}</h3>
              <p className="mt-1 text-ink-600">{s.d}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href={demoHref} className="btn-accent px-6 py-3 text-lg">
            {t.cta.demo}
          </Link>
          {phone && (
            <a href={telOf(phone)} className="btn-outline px-6 py-3 text-lg">
              <Icon name="phone" className="size-5" /> {phone}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

/** Final "Book your free demo class" section with photo, call/WhatsApp and the enquiry form. */
export function BookDemo({
  lang,
  settings,
  courseNames,
  image,
  defaultCourse,
  title,
}: {
  lang: Locale;
  settings: Settings;
  courseNames: string[];
  image?: { src: string; alt: string } | null;
  defaultCourse?: string;
  title?: string;
}) {
  const t = getDict(lang);
  const phone = settings.phones[0];
  const wa = settings.whatsapp ? `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}` : undefined;
  return (
    <section id="book-demo" className="mx-auto max-w-7xl scroll-mt-28 px-4 pt-20">
      <div className="grid overflow-hidden rounded-[2rem] bg-brand-900 lg:grid-cols-2">
        <div className="relative min-h-64 lg:min-h-full">
          {image && <Image src={image.src} alt={image.alt} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />}
        </div>
        <div className="p-6 sm:p-10">
          <h2 className="font-display text-3xl font-extrabold text-white">{title ?? t.home.demoTitle}</h2>
          <p className="mt-2 text-brand-100">{t.form.sub}</p>
          <div className="mt-4 mb-6 flex flex-wrap gap-2">
            {phone && (
              <a href={telOf(phone)} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-semibold text-white hover:bg-white/20">
                <Icon name="phone" className="size-4" /> {phone}
              </a>
            )}
            {wa && (
              <a href={wa} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-4 py-2 font-semibold text-white">
                <Icon name="whatsapp" className="size-4" /> {t.cta.whatsapp}
              </a>
            )}
          </div>
          <div className="rounded-2xl bg-surface p-5 sm:p-6">
            <EnquiryForm t={t.form} courses={courseNames} defaultCourse={defaultCourse} whatsapp={settings.whatsapp} />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Small grid of icon cards (title + text). */
export function CardGrid({ items, cols = 3 }: { items: { title: string; text: string; icon?: string }[]; cols?: 2 | 3 | 4 }) {
  const grid = cols === 4 ? 'lg:grid-cols-4' : cols === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3';
  return (
    <div className={`grid gap-5 sm:grid-cols-2 ${grid}`}>
      {items.map((i) => (
        <div key={i.title} className="card">
          <span className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
            <Icon name={i.icon ?? 'check'} className="size-6" />
          </span>
          <h3 className="mt-4 font-display text-lg font-bold text-brand-950">{i.title}</h3>
          <p className="mt-1 text-ink-600">{i.text}</p>
        </div>
      ))}
    </div>
  );
}
