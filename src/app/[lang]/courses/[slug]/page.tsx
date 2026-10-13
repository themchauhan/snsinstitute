import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getDict, href, locales, pick, type Locale } from '@/lib/i18n';
import { getCourse, getCourses, getFaculty, getFaqs, getGallery, getResults, getSettings } from '@/lib/content';
import { SITE_URL, breadcrumbJsonLd, buildMetadata, courseJsonLd, faqJsonLd } from '@/lib/seo';
import { JsonLd, PageHero, Section } from '@/components/ui';
import { CourseCard, FacultyCard, FaqList, ResultCard } from '@/components/cards';
import { BookDemo, CardGrid, DemoSteps } from '@/components/blades';
import { RichText, hasContent } from '@/components/RichText';
import { Icon } from '@/components/Icon';

export const dynamicParams = false;
export async function generateStaticParams() {
  const courses = await getCourses();
  return locales.flatMap((lang) => courses.map((c) => ({ lang, slug: c.slug })));
}

export async function generateMetadata({ params }: PageProps<'/[lang]/courses/[slug]'>) {
  const { lang, slug } = (await params) as { lang: Locale; slug: string };
  const c = await getCourse(slug);
  if (!c) return {};
  const name = pick(lang, c.titleEn, c.titleHi);
  return buildMetadata({
    lang,
    path: `/courses/${slug}`,
    absoluteTitle: !!(lang === 'en' && c.seo.title),
    title: (lang === 'en' && c.seo.title) || (lang === 'hi' ? `रेवाड़ी में ${name}` : `${name} in Rewari`),
    description: (lang === 'en' && c.seo.description) || pick(lang, c.summaryEn, c.summaryHi),
    image: c.image,
    hasHindi: !!c.titleHi,
  });
}

/** "Science" is taught by the Physics, Chemistry and Biology teachers. */
const SUBJECT_ALIASES: Record<string, string[]> = {
  science: ['physics', 'chemistry', 'biology'],
  'mental ability': ['reasoning', 'mathematics'],
};

export default async function CoursePage({ params }: PageProps<'/[lang]/courses/[slug]'>) {
  const { lang, slug } = (await params) as { lang: Locale; slug: string };
  const t = getDict(lang);
  const [c, all, faqs, results, settings, faculty, gallery] = await Promise.all([
    getCourse(slug),
    getCourses(),
    getFaqs(),
    getResults(),
    getSettings(),
    getFaculty(),
    getGallery(),
  ]);
  if (!c) notFound();

  const name = pick(lang, c.titleEn, c.titleHi);
  const summary = pick(lang, c.summaryEn, c.summaryHi);
  const body = lang === 'hi' && hasContent(c.bodyHi) ? c.bodyHi : c.bodyEn;
  const courseFaqs = faqs
    .filter((f) => f.entry.course === slug)
    .map((f) => ({ q: pick(lang, f.entry.questionEn, f.entry.questionHi), a: pick(lang, f.entry.answerEn, f.entry.answerHi) }));
  const keyword = c.titleEn.split(/[\s-]+/)[0].toLowerCase();
  const related = results.filter((r) => r.entry.exam.toLowerCase().includes(keyword)).slice(0, 4);
  const wanted = new Set(c.subjects.flatMap((s) => SUBJECT_ALIASES[s.toLowerCase()] ?? [s.toLowerCase()]));
  const teachers = faculty.filter((f) => wanted.has(f.entry.subject.toLowerCase()));
  const others = all.filter((x) => x.slug !== slug);
  const classroom = gallery.find((g) => g.slug.startsWith('classroom'));
  const url = SITE_URL + href(lang, `/courses/${slug}`);
  const phone = settings.phones[0];

  const facts = [
    { k: t.course.classes, v: pick(lang, c.classesEn, c.classesHi), i: 'cap' },
    { k: t.course.duration, v: pick(lang, c.durationEn, c.durationHi), i: 'clock' },
    { k: t.course.subjects, v: c.subjects.join(', '), i: 'book' },
    { k: t.course.fee, v: c.fee, i: 'star' },
  ].filter((f) => f.v);

  return (
    <>
      <PageHero
        title={name}
        sub={summary}
        crumbs={[
          { href: href(lang), label: t.misc.breadcrumbHome },
          { href: href(lang, '/courses'), label: t.nav.courses },
          { href: href(lang, `/courses/${slug}`), label: name },
        ]}
      />

      {/* Quick facts */}
      <div className="mx-auto max-w-7xl px-4">
        <dl className="-mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((f) => (
            <div key={f.k} className="flex items-center gap-4 rounded-2xl bg-surface p-5 shadow-md ring-1 ring-ink-200">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent-500 text-white">
                <Icon name={f.i} className="size-5" />
              </span>
              <div>
                <dt className="text-sm font-semibold text-ink-500">{f.k}</dt>
                <dd className="font-display text-lg leading-snug font-bold text-brand-950">{f.v}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>

      {/* Overview + quick actions */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-14 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0">
          {c.highlights.length > 0 && (
            <>
              <h2 className="font-display text-2xl font-bold text-brand-950">{t.course.highlights}</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {c.highlights.map((h) => (
                  <li key={h.en} className="flex gap-3 rounded-xl bg-surface p-4 ring-1 ring-ink-200">
                    <Icon name="check" className="mt-1 size-5 shrink-0 text-accent-500" />
                    <span>{pick(lang, h.en, h.hi)}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
          {c.image && (
            <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-3xl">
              <Image src={c.image} alt={name} fill sizes="(min-width:1024px) 60vw, 100vw" className="object-cover" />
            </div>
          )}
          <div className="mt-8">
            <RichText node={body} />
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
          {c.whoFor.length > 0 && (
            <div className="rounded-3xl bg-brand-900 p-6 text-white">
              <h2 className="font-display text-xl font-bold">{t.course.whoFor}</h2>
              <ul className="mt-4 space-y-3">
                {c.whoFor.map((w) => (
                  <li key={w.en} className="flex gap-3">
                    <Icon name="check" className="mt-1 size-5 shrink-0 text-sun-300" />
                    <span className="text-brand-100">{pick(lang, w.en, w.hi)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="rounded-3xl bg-surface p-6 ring-1 ring-ink-200">
            <p className="font-display text-lg font-bold text-brand-950">{t.form.title}</p>
            <p className="mt-1 text-sm text-ink-600">{t.home.stepsSub}</p>
            <div className="mt-4 grid gap-2">
              <Link href="#book-demo" className="btn-accent justify-center">
                {t.cta.demo}
              </Link>
              {phone && (
                <a href={`tel:+91${phone.replace(/\D/g, '').slice(-10)}`} className="btn-outline justify-center">
                  <Icon name="phone" className="size-4" /> {phone}
                </a>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Syllabus */}
      {c.syllabus.length > 0 && (
        <Section title={t.course.syllabus} sub={t.course.syllabusSub}>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {c.syllabus.map((s) => {
              const topics = pick(lang, s.topicsEn, s.topicsHi).split('\n').map((x) => x.trim()).filter(Boolean);
              return (
                <div key={s.subject} className="card">
                  <h3 className="flex items-center gap-2 font-display text-xl font-bold text-brand-950">
                    <span className="size-2.5 rounded-full bg-accent-500" /> {s.subject}
                  </h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {topics.map((tp) => (
                      <li key={tp} className="rounded-lg bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-800">
                        {tp}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* What you get */}
      {c.features.length > 0 && (
        <Section title={t.course.features}>
          <CardGrid
            cols={3}
            items={c.features.map((f, i) => ({
              title: pick(lang, f.titleEn, f.titleHi),
              text: pick(lang, f.textEn, f.textHi),
              icon: ['book', 'check', 'cap', 'star', 'clock', 'phone'][i % 6],
            }))}
          />
        </Section>
      )}

      {/* Roadmap */}
      {c.roadmap.length > 0 && (
        <Section title={t.course.roadmap}>
          <ol className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {c.roadmap.map((r, i) => (
              <li key={r.titleEn} className="relative rounded-2xl border-t-4 border-accent-500 bg-surface p-6 shadow-sm ring-1 ring-ink-200">
                <span className="font-display text-4xl font-extrabold text-brand-200">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-2 font-display text-lg font-bold text-brand-950">{pick(lang, r.titleEn, r.titleHi)}</h3>
                <p className="mt-1 text-ink-600">{pick(lang, r.textEn, r.textHi)}</p>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {/* Teachers */}
      {teachers.length > 0 && (
        <Section title={t.course.teachers}>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {teachers.map((f) => (
              <FacultyCard key={f.slug} lang={lang} f={f} />
            ))}
          </div>
        </Section>
      )}

      {related.length > 0 && (
        <Section title={t.home.resultsTitle}>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {related.map((r) => (
              <ResultCard key={r.slug} r={r} />
            ))}
          </div>
        </Section>
      )}

      <DemoSteps lang={lang} settings={settings} />

      {courseFaqs.length > 0 && (
        <Section title={t.course.faq}>
          <div className="max-w-4xl">
            <FaqList items={courseFaqs} />
          </div>
          <JsonLd data={faqJsonLd(courseFaqs)} />
        </Section>
      )}

      {others.length > 0 && (
        <Section title={t.course.otherCourses}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((o) => (
              <CourseCard key={o.slug} lang={lang} course={o} />
            ))}
          </div>
        </Section>
      )}

      <BookDemo
        lang={lang}
        settings={settings}
        courseNames={all.map((x) => x.entry.titleEn)}
        defaultCourse={c.titleEn}
        image={classroom ? { src: classroom.entry.image, alt: classroom.entry.caption } : null}
      />

      <JsonLd
        data={[
          courseJsonLd({ name, description: summary, url }),
          breadcrumbJsonLd([
            { name: t.misc.breadcrumbHome, url: SITE_URL + href(lang) },
            { name: t.nav.courses, url: SITE_URL + href(lang, '/courses') },
            { name, url },
          ]),
        ]}
      />
    </>
  );
}
