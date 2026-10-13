import Link from 'next/link';
import { formatDate, getDict, href, pick, type Locale } from '@/lib/i18n';
import { getBatches, getCourses, getFaqs, getGallery, getHome, getResults, getSettings } from '@/lib/content';
import { buildMetadata, faqJsonLd } from '@/lib/seo';
import { JsonLd, PageHero, Section } from '@/components/ui';
import { CourseCard, FaqList, ResultCard } from '@/components/cards';
import { BookDemo, CardGrid, DemoSteps } from '@/components/blades';
import { Icon } from '@/components/Icon';

export async function generateMetadata({ params }: PageProps<'/[lang]/courses'>) {
  const lang = (await params).lang as Locale;
  const hi = lang === 'hi';
  return buildMetadata({
    lang,
    path: '/courses',
    title: hi ? 'रेवाड़ी में JEE, NEET, फाउंडेशन और ट्यूशन कोर्स' : 'JEE, NEET, Foundation & Tuition Courses in Rewari',
    description: hi
      ? 'SNS इंस्टीट्यूट रेवाड़ी के सभी कोर्स: IIT-JEE, NEET, फाउंडेशन, सैनिक स्कूल / मिलिट्री स्कूल / नवोदय प्रवेश और CBSE/HBSE कक्षा 5–12 ट्यूशन।'
      : 'All courses at SNS Institute Rewari: IIT-JEE, NEET-UG, IIT/NEET foundation, Sainik School / RMS / Navodaya entrance and CBSE/HBSE tuition for class 5–12.',
  });
}

export default async function CoursesPage({ params }: PageProps<'/[lang]/courses'>) {
  const lang = (await params).lang as Locale;
  const t = getDict(lang);
  const [courses, home, batches, results, faqs, settings, gallery] = await Promise.all([
    getCourses(),
    getHome(),
    getBatches(),
    getResults(),
    getFaqs(),
    getSettings(),
    getGallery(),
  ]);
  const generalFaqs = faqs
    .filter((f) => !f.entry.course)
    .slice(0, 5)
    .map((f) => ({ q: pick(lang, f.entry.questionEn, f.entry.questionHi), a: pick(lang, f.entry.answerEn, f.entry.answerHi) }));
  const featured = results.filter((r) => r.entry.featured).slice(0, 4);
  const classroom = gallery.find((g) => g.slug.startsWith('classroom'));

  return (
    <>
      <PageHero
        title={t.home.coursesTitle}
        sub={t.home.coursesSub}
        crumbs={[
          { href: href(lang), label: t.misc.breadcrumbHome },
          { href: href(lang, '/courses'), label: t.nav.courses },
        ]}
      />

      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <CourseCard key={c.slug} lang={lang} course={c} />
          ))}
        </div>
      </Section>

      {/* Course chooser */}
      <Section title={t.course.chooserTitle} sub={t.course.chooserSub}>
        <div className="overflow-x-auto rounded-2xl ring-1 ring-ink-200">
          <table className="w-full min-w-[640px] border-collapse bg-surface text-left">
            <thead className="bg-brand-900 text-white">
              <tr>
                {[t.course.course, t.course.classes, t.course.duration, t.course.subjects, ''].map((h, i) => (
                  <th key={i} scope="col" className="px-5 py-4 font-display font-bold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-200">
              {courses.map((c) => (
                <tr key={c.slug} className="hover:bg-brand-50">
                  <th scope="row" className="px-5 py-4">
                    <span className="flex items-center gap-3 font-display font-bold text-brand-950">
                      <span className="grid size-9 place-items-center rounded-lg bg-brand-50 text-brand-600">
                        <Icon name={c.entry.icon} className="size-5" />
                      </span>
                      {pick(lang, c.entry.titleEn, c.entry.titleHi)}
                    </span>
                  </th>
                  <td className="px-5 py-4 font-semibold text-accent-600">{pick(lang, c.entry.classesEn, c.entry.classesHi)}</td>
                  <td className="px-5 py-4">{pick(lang, c.entry.durationEn, c.entry.durationHi)}</td>
                  <td className="px-5 py-4 text-ink-600">{c.entry.subjects.join(', ')}</td>
                  <td className="px-5 py-4 text-right">
                    <Link href={href(lang, `/courses/${c.slug}`)} className="inline-flex items-center gap-1 font-bold whitespace-nowrap text-brand-600">
                      {t.course.details} <Icon name="arrow" className="size-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {batches.length > 0 && (
        <Section title={t.home.batchesTitle} sub={t.home.batchesSub}>
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {batches.map((b) => (
              <li key={b.slug} className="flex items-start gap-4 rounded-2xl bg-surface p-5 ring-1 ring-ink-200">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-sun-300 text-brand-950">
                  <Icon name="clock" className="size-5" />
                </span>
                <div>
                  <p className="font-display text-lg font-bold text-brand-950">{pick(lang, b.entry.nameEn, b.entry.nameHi)}</p>
                  <p className="text-ink-600">{pick(lang, b.entry.forEn, b.entry.forHi)}</p>
                  <p className="mt-1 text-sm font-semibold text-accent-600">
                    {[b.entry.startDate && `${t.home.starts}: ${formatDate(lang, b.entry.startDate)}`, pick(lang, b.entry.tagEn, b.entry.tagHi)]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {home.why.length > 0 && (
        <Section title={t.course.whyTitle}>
          <CardGrid
            items={home.why.map((w, i) => ({
              title: pick(lang, w.titleEn, w.titleHi),
              text: pick(lang, w.textEn, w.textHi),
              icon: ['cap', 'star', 'check', 'book', 'atom', 'pin'][i % 6],
            }))}
          />
        </Section>
      )}

      <DemoSteps lang={lang} settings={settings} />

      {featured.length > 0 && (
        <Section title={t.home.resultsTitle} sub={t.home.resultsSub}>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {featured.map((r) => (
              <ResultCard key={r.slug} r={r} />
            ))}
          </div>
        </Section>
      )}

      {generalFaqs.length > 0 && (
        <Section title={t.home.faqTitle}>
          <div className="max-w-4xl">
            <FaqList items={generalFaqs} />
          </div>
          <JsonLd data={faqJsonLd(generalFaqs)} />
        </Section>
      )}

      <BookDemo
        lang={lang}
        settings={settings}
        courseNames={courses.map((c) => c.entry.titleEn)}
        image={classroom ? { src: classroom.entry.image, alt: classroom.entry.caption } : null}
      />
    </>
  );
}
