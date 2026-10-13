import { getDict, href, pick, type Locale } from '@/lib/i18n';
import { getCourses, getGallery, getResults, getSettings } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { Avatar, PageHero, Section, Stars } from '@/components/ui';
import { ResultCard } from '@/components/cards';
import { BookDemo, CardGrid, DemoSteps } from '@/components/blades';
import { ImageSlider } from '@/components/ImageSlider';
import { ResultsFilter } from '@/components/ResultsFilter';
import { Icon } from '@/components/Icon';

export async function generateMetadata({ params }: PageProps<'/[lang]/results'>) {
  const lang = (await params).lang as Locale;
  const hi = lang === 'hi';
  return buildMetadata({
    lang,
    path: '/results',
    title: hi ? 'रिज़ल्ट और टॉपर्स – JEE, NEET, बोर्ड परीक्षा' : 'Results & Toppers – JEE, NEET & Board Exams',
    description: hi
      ? 'SNS इंस्टीट्यूट रेवाड़ी के छात्रों के JEE, NEET, IIT JAM, सैनिक स्कूल और बोर्ड परीक्षा रिज़ल्ट।'
      : 'JEE, NEET, IIT JAM, Sainik School and board exam results of SNS Institute Rewari students, year by year.',
  });
}

const CAT_ORDER = ['jee', 'neet', 'sainik', 'board', 'higher', 'class', 'other'];

export default async function ResultsPage({ params }: PageProps<'/[lang]/results'>) {
  const lang = (await params).lang as Locale;
  const t = getDict(lang);
  const r = t.results;
  const [results, gallery, settings, courses] = await Promise.all([getResults(), getGallery(), getSettings(), getCourses()]);

  const years = [...new Set(results.map((x) => x.entry.year))];
  const exams = new Set(results.map((x) => x.entry.exam.replace(/\s*[–-].*$|\s+\d{4}$/, '').trim())).size;
  const top = results[0];
  const cats = CAT_ORDER.map((value) => ({
    value,
    label: r.cats[value],
    count: results.filter((x) => (x.entry.category ?? 'other') === value).length,
  })).filter((c) => c.count > 0);
  const groups = years.map((year) => ({
    year,
    items: results
      .filter((x) => x.entry.year === year)
      .map((x) => ({ key: x.slug, cat: x.entry.category ?? 'other', el: <ResultCard r={x} /> })),
  }));
  const pride = gallery.filter((g) => /award|felicitation/.test(g.slug)).map((g) => ({ src: g.entry.image, caption: g.entry.caption }));
  const wa = settings.whatsapp?.replace(/\D/g, '');
  const classroom = gallery.find((g) => g.slug.startsWith('classroom'));
  const stats = [
    { v: `${results.length}+`, l: r.statAchievers },
    ...(years.length > 1 ? [{ v: `${years.length}`, l: r.statYears }] : []),
    { v: `${exams}`, l: r.statExams },
    ...(settings.rating ? [{ v: `${settings.rating.toFixed(1)}★`, l: t.home.reviewsOnGoogle }] : []),
  ];

  return (
    <>
      <PageHero
        title={t.home.resultsTitle}
        sub={t.home.resultsSub}
        crumbs={[
          { href: href(lang), label: t.misc.breadcrumbHome },
          { href: href(lang, '/results'), label: t.nav.results },
        ]}
      />

      {/* Stats */}
      <div className="mx-auto max-w-7xl px-4">
        <dl className="-mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l} className="rounded-2xl bg-surface p-5 text-center shadow-md ring-1 ring-ink-200">
              <dd className="font-display text-3xl font-extrabold text-brand-600 sm:text-4xl">{s.v}</dd>
              <dt className="text-sm font-semibold text-ink-600">{s.l}</dt>
            </div>
          ))}
        </dl>
      </div>

      {/* Topper spotlight */}
      {top && (
        <Section title={r.spotlight}>
          <div className="grid items-center gap-8 overflow-hidden rounded-[2rem] bg-brand-900 p-8 text-white sm:p-10 lg:grid-cols-[auto_1fr]">
            <Avatar src={top.entry.photo} name={top.entry.name} className="mx-auto size-40 ring-8 ring-sun-300 lg:size-48" sizes="192px" />
            <div className="text-center lg:text-left">
              <p className="font-display text-sm font-bold tracking-widest text-sun-300 uppercase">{top.entry.exam}</p>
              <p className="mt-2 font-display text-4xl font-extrabold sm:text-5xl">{top.entry.name}</p>
              <p className="mt-4 inline-block rounded-full bg-accent-500 px-5 py-2 font-display text-2xl font-extrabold">{top.entry.achievement}</p>
              {pick(lang, top.entry.quoteEn, top.entry.quoteHi) && (
                <blockquote className="mt-6 max-w-2xl text-lg text-brand-100 italic">“{pick(lang, top.entry.quoteEn, top.entry.quoteHi)}”</blockquote>
              )}
              {top.entry.place && <p className="mt-3 text-brand-200">{top.entry.place}</p>}
            </div>
          </div>
        </Section>
      )}

      {/* Filterable results by year */}
      <Section title={r.byYear}>
        <ResultsFilter groups={groups} cats={cats} allLabel={r.filterAll} emptyLabel={r.none} />
      </Section>

      {/* Moments of pride */}
      {pride.length > 0 && (
        <Section title={r.prideTitle} sub={r.prideSub}>
          <ImageSlider slides={pride} labels={{ prev: t.about.prev, next: t.about.next }} />
        </Section>
      )}

      {/* Method */}
      <Section title={r.methodTitle}>
        <CardGrid cols={4} items={r.method.map((m) => ({ title: m.t, text: m.d, icon: m.i }))} />
      </Section>

      {/* Google rating + share your result */}
      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          {settings.rating ? (
            <div className="flex flex-col items-center justify-center rounded-[2rem] bg-sun-300/50 p-8 text-center">
              <p className="font-display text-6xl font-extrabold text-brand-950">{settings.rating.toFixed(1)}</p>
              <div className="mt-2 scale-125">
                <Stars />
              </div>
              <p className="mt-3 font-semibold text-ink-700">
                {settings.reviewCount}+ {t.home.reviewsOnGoogle}
              </p>
              <a href={settings.googleReviewUrl || settings.mapUrl || '#'} target="_blank" rel="noopener" className="btn-outline mt-5">
                {t.home.readReviews}
              </a>
            </div>
          ) : null}
          <div className="flex flex-col justify-center rounded-[2rem] border border-ink-200 bg-surface p-8">
            <span className="grid size-12 place-items-center rounded-2xl bg-whatsapp text-white">
              <Icon name="whatsapp" className="size-7" />
            </span>
            <h2 className="mt-5 font-display text-2xl font-extrabold text-brand-950">{r.shareTitle}</h2>
            <p className="mt-2 text-ink-600">{r.shareText}</p>
            {wa && (
              <a
                href={`https://wa.me/${wa}?text=${encodeURIComponent(r.shareMsg)}`}
                target="_blank"
                rel="noopener"
                className="mt-6 inline-flex items-center gap-2 self-start rounded-full bg-whatsapp px-5 py-2.5 font-bold text-white"
              >
                <Icon name="whatsapp" className="size-5" /> {r.shareBtn}
              </a>
            )}
          </div>
        </div>
      </Section>

      <DemoSteps lang={lang} settings={settings} />

      <BookDemo
        lang={lang}
        settings={settings}
        title={r.nextTitle}
        courseNames={courses.map((c) => c.entry.titleEn)}
        image={classroom ? { src: classroom.entry.image, alt: classroom.entry.caption } : null}
      />
    </>
  );
}
