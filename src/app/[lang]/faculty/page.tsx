import { getDict, href, type Locale } from '@/lib/i18n';
import { getCourses, getFaculty, getGallery, getSettings } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { PageHero, Section } from '@/components/ui';
import { FacultyProfile } from '@/components/cards';
import { BookDemo, CardGrid } from '@/components/blades';

export async function generateMetadata({ params }: PageProps<'/[lang]/faculty'>) {
  const lang = (await params).lang as Locale;
  const hi = lang === 'hi';
  return buildMetadata({
    lang,
    path: '/faculty',
    title: hi ? 'हमारे शिक्षक – भौतिकी, रसायन, जीव विज्ञान, गणित' : 'Our Faculty – Physics, Chemistry, Biology & Maths Teachers',
    description: hi
      ? 'SNS इंस्टीट्यूट रेवाड़ी के अनुभवी शिक्षक – हर विषय के लिए विशेषज्ञ।'
      : 'Meet the experienced Physics, Chemistry, Biology, Maths and English teachers at SNS Institute Rewari.',
  });
}

export default async function FacultyPage({ params }: PageProps<'/[lang]/faculty'>) {
  const lang = (await params).lang as Locale;
  const t = getDict(lang);
  const [faculty, settings, courses, gallery] = await Promise.all([getFaculty(), getSettings(), getCourses(), getGallery()]);
  const leaders = faculty.filter((f) => f.entry.leader);
  const team = faculty.filter((f) => !f.entry.leader);
  const subjects = new Set(faculty.map((f) => f.entry.subject.toLowerCase())).size;
  const years = faculty.reduce((sum, f) => sum + (parseInt(f.entry.experience, 10) || 0), 0);
  const stats = [
    { v: `${faculty.length}`, l: t.faculty.statTeachers },
    { v: `${subjects}`, l: t.faculty.statSubjects },
    ...(years ? [{ v: `${years}+`, l: t.faculty.statYears }] : []),
  ];
  const photo = gallery.find((g) => g.slug === 'faculty-award-ceremony') ?? gallery[0];

  return (
    <>
      <PageHero
        title={t.home.facultyTitle}
        sub={t.home.facultySub}
        crumbs={[
          { href: href(lang), label: t.misc.breadcrumbHome },
          { href: href(lang, '/faculty'), label: t.nav.faculty },
        ]}
      />

      <div className="mx-auto max-w-7xl px-4">
        <dl className="-mt-8 grid grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.l} className="rounded-2xl bg-surface p-5 text-center shadow-md ring-1 ring-ink-200">
              <dd className="font-display text-3xl font-extrabold text-brand-600 sm:text-4xl">{s.v}</dd>
              <dt className="text-xs font-semibold text-ink-600 sm:text-sm">{s.l}</dt>
            </div>
          ))}
        </dl>
      </div>

      {leaders.length > 0 && (
        <Section title={t.faculty.leadership}>
          <div className="grid gap-6">
            {leaders.map((f) => (
              <FacultyProfile key={f.slug} lang={lang} f={f} wide />
            ))}
          </div>
        </Section>
      )}

      <Section title={t.faculty.team}>
        <div className="grid gap-6 md:grid-cols-2">
          {team.map((f) => (
            <FacultyProfile key={f.slug} lang={lang} f={f} />
          ))}
        </div>
      </Section>

      <Section title={t.faculty.approachTitle} sub={t.faculty.approachSub}>
        <CardGrid cols={4} items={t.faculty.approach.map((a) => ({ title: a.t, text: a.d, icon: a.i }))} />
      </Section>

      <BookDemo
        lang={lang}
        settings={settings}
        title={t.faculty.meetTitle}
        courseNames={courses.map((c) => c.entry.titleEn)}
        image={photo ? { src: photo.entry.image, alt: photo.entry.caption } : null}
      />
    </>
  );
}
