import Link from 'next/link';
import Image from 'next/image';
import { formatDate, getDict, href, pick, type Locale } from '@/lib/i18n';
import type { CourseEntry, PostEntry } from '@/lib/content';
import { Icon } from './Icon';
import { Avatar } from './ui';

export function CourseCard({ lang, course }: { lang: Locale; course: CourseEntry }) {
  const t = getDict(lang);
  const c = course.entry;
  return (
    <Link href={href(lang, `/courses/${course.slug}`)} className="card group flex flex-col">
      <span className="grid size-14 place-items-center rounded-2xl bg-brand-50 text-brand-600 transition group-hover:bg-accent-500 group-hover:text-white">
        <Icon name={c.icon} className="size-7" />
      </span>
      <h3 className="mt-5 font-display text-xl font-bold text-brand-950">{pick(lang, c.titleEn, c.titleHi)}</h3>
      <p className="mt-1 text-sm font-semibold text-accent-600">{pick(lang, c.classesEn, c.classesHi)}</p>
      <p className="mt-3 flex-1 text-ink-600">{pick(lang, c.summaryEn, c.summaryHi)}</p>
      <span className="mt-5 inline-flex items-center gap-1 font-bold text-brand-600">
        {t.cta.viewCourse} <Icon name="arrow" className="size-4 transition group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

type Result = { slug: string; entry: { name: string; exam: string; achievement: string; place: string; photo: string | null; year: number } };

export function ResultCard({ r }: { r: Result }) {
  return (
    <div className="card flex flex-col items-center text-center">
      <Avatar src={r.entry.photo} name={r.entry.name} className="size-24 ring-4 ring-sun-300" />
      <p className="mt-4 font-display text-lg font-bold text-brand-950">{r.entry.name}</p>
      <p className="mt-1 rounded-full bg-accent-500 px-3 py-0.5 text-sm font-bold text-white">{r.entry.achievement}</p>
      <p className="mt-2 text-sm font-semibold text-brand-700">{r.entry.exam}</p>
      {r.entry.place && <p className="text-xs text-ink-500">{r.entry.place}</p>}
    </div>
  );
}

type Faculty = {
  slug: string;
  entry: {
    name: string;
    subject: string;
    qualification: string;
    experience: string;
    photo: string | null;
    roleEn?: string;
    roleHi?: string;
    teaches?: readonly string[];
    bioEn?: string;
    bioHi?: string;
    highlights?: readonly { en: string; hi: string }[];
  };
};

export function FacultyCard({ lang, f }: { lang: Locale; f: Faculty }) {
  const t = getDict(lang);
  return (
    <div className="card flex items-center gap-4">
      <Avatar src={f.entry.photo} name={f.entry.name} className="size-20" sizes="80px" />
      <div>
        <p className="font-display text-lg font-bold text-brand-950">{f.entry.name}</p>
        <p className="font-semibold text-accent-600">{f.entry.subject}</p>
        <p className="text-sm text-ink-600">{f.entry.qualification}</p>
        {f.entry.experience && (
          <p className="text-sm text-ink-500">
            {t.misc.experience}: {f.entry.experience}
          </p>
        )}
      </div>
    </div>
  );
}

/** Detailed teacher profile used on the Faculty page. */
export function FacultyProfile({ lang, f, wide = false }: { lang: Locale; f: Faculty; wide?: boolean }) {
  const t = getDict(lang);
  const e = f.entry;
  const role = pick(lang, e.roleEn, e.roleHi);
  const bio = pick(lang, e.bioEn, e.bioHi);
  return (
    <article className={`card flex flex-col gap-5 ${wide ? 'lg:flex-row lg:items-start lg:p-8' : ''}`}>
      <div className={`flex items-center gap-4 ${wide ? 'lg:w-72 lg:shrink-0 lg:flex-col lg:text-center' : ''}`}>
        <Avatar src={e.photo} name={e.name} className={wide ? 'size-28 lg:size-40' : 'size-20'} sizes={wide ? '160px' : '80px'} />
        <div>
          <h3 className="font-display text-xl font-bold text-brand-950">{e.name}</h3>
          {role && <p className="text-sm font-bold tracking-wide text-brand-600 uppercase">{role}</p>}
          <p className="font-semibold text-accent-600">{e.subject}</p>
        </div>
      </div>
      <div className="flex-1">
        {bio && <p className="text-ink-700">{bio}</p>}
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          {e.qualification && (
            <div className="rounded-xl bg-brand-50 p-3">
              <dt className="font-semibold text-ink-500">{t.misc.qualification}</dt>
              <dd className="font-semibold text-brand-950">{e.qualification}</dd>
            </div>
          )}
          {e.experience && (
            <div className="rounded-xl bg-brand-50 p-3">
              <dt className="font-semibold text-ink-500">{t.misc.experience}</dt>
              <dd className="font-semibold text-brand-950">{e.experience}</dd>
            </div>
          )}
        </dl>
        {e.teaches && e.teaches.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-ink-500">{t.faculty.teaches}</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {e.teaches.map((x) => (
                <li key={x} className="rounded-full bg-sun-300/60 px-3 py-1 text-sm font-bold text-brand-950">
                  {x}
                </li>
              ))}
            </ul>
          </div>
        )}
        {e.highlights && e.highlights.length > 0 && (
          <ul className="mt-4 space-y-1.5">
            {e.highlights.map((h) => (
              <li key={h.en} className="flex gap-2 text-ink-700">
                <Icon name="check" className="mt-1 size-4 shrink-0 text-accent-500" />
                {pick(lang, h.en, h.hi)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

export function PostCard({ lang, post }: { lang: Locale; post: PostEntry }) {
  const p = post.entry;
  return (
    <Link href={href(lang, `/updates/${post.slug}`)} className="card group flex flex-col overflow-hidden p-0">
      {p.cover && (
        <div className="relative aspect-[16/9]">
          <Image src={p.cover} alt="" fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <time dateTime={p.date} className="text-sm font-semibold text-accent-600">
          {formatDate(lang, p.date)}
        </time>
        <h3 className="mt-2 font-display text-lg leading-snug font-bold text-brand-950 group-hover:text-brand-600">{pick(lang, p.titleEn, p.titleHi)}</h3>
        <p className="mt-2 line-clamp-3 text-ink-600">{pick(lang, p.excerptEn, p.excerptHi)}</p>
      </div>
    </Link>
  );
}

export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-ink-200 rounded-2xl border border-ink-200 bg-surface">
      {items.map((i) => (
        <details key={i.q} className="group p-5 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-lg font-bold text-brand-950">
            {i.q}
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600 transition group-open:rotate-45">+</span>
          </summary>
          <p className="mt-3 whitespace-pre-line text-ink-600">{i.a}</p>
        </details>
      ))}
    </div>
  );
}
