import Link from 'next/link';
import Image from 'next/image';
import { formatDate, getDict, href, pick, type Locale } from '@/lib/i18n';
import {
  getBatches,
  getCourses,
  getFaculty,
  getFaqs,
  getGallery,
  getHome,
  getLocations,
  getPosts,
  getResults,
  getSettings,
  getTestimonials,
} from '@/lib/content';
import { buildMetadata, faqJsonLd } from '@/lib/seo';
import { Section, JsonLd, Stars } from '@/components/ui';
import { CourseCard, FacultyCard, FaqList, PostCard, ResultCard } from '@/components/cards';
import { BookDemo, DemoSteps } from '@/components/blades';
import { Icon } from '@/components/Icon';

export async function generateMetadata({ params }: PageProps<'/[lang]'>) {
  const lang = (await params).lang as Locale;
  const home = await getHome();
  const hi = lang === 'hi';
  return buildMetadata({
    lang,
    path: '/',
    absoluteTitle: true,
    title:
      (!hi && home.seo.title) ||
      (hi ? 'SNS इंस्टीट्यूट रेवाड़ी | JEE, NEET और कक्षा 5–12 कोचिंग' : 'SNS Institute Rewari | JEE, NEET & Class 5–12 Coaching'),
    description:
      (!hi && home.seo.description) ||
      (hi
        ? 'रेवाड़ी में IIT-JEE, NEET, फाउंडेशन, सैनिक स्कूल और नवोदय प्रवेश परीक्षा तथा CBSE/HBSE कक्षा 5–12 की कोचिंग। गोपाल देव चौक, नारनौल रोड।'
        : 'Best coaching in Rewari for IIT-JEE, NEET, foundation, Sainik School & Navodaya entrance and CBSE/HBSE tuition for classes 5–12. Gopal Dev Chowk, Narnaul Road. Free demo class.'),
  });
}

export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const lang = (await params).lang as Locale;
  const t = getDict(lang);
  const [home, settings, courses, batches, results, faculty, testimonials, posts, faqs, locations, gallery] = await Promise.all([
    getHome(),
    getSettings(),
    getCourses(),
    getBatches(),
    getResults(),
    getFaculty(),
    getTestimonials(),
    getPosts(),
    getFaqs(),
    getLocations(),
    getGallery(),
  ]);
  const generalFaqs = faqs
    .filter((f) => !f.entry.course)
    .map((f) => ({ q: pick(lang, f.entry.questionEn, f.entry.questionHi), a: pick(lang, f.entry.answerEn, f.entry.answerHi) }));
  const featured = results.filter((r) => r.entry.featured).slice(0, 8);
  const classroom = gallery.find((g) => g.slug.startsWith('classroom'));
  const demoHref = '#book-demo';

  return (
    <>
      {/* 1. Hero – message + photo, no form */}
      <section className="bg-hero-pattern relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-12 lg:grid-cols-[1.1fr_1fr] lg:py-20">
          <div>
            {settings.rating ? (
              <a
                href={settings.googleReviewUrl || settings.mapUrl || '#'}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-1.5 text-sm font-semibold text-ink-700 shadow-sm ring-1 ring-ink-200"
              >
                <Stars />
                {settings.rating.toFixed(1)} · {settings.reviewCount}+ {t.home.reviewsOnGoogle}
              </a>
            ) : null}
            <h1 className="mt-5 font-display text-4xl leading-[1.1] font-extrabold text-brand-950 sm:text-5xl lg:text-6xl">
              {pick(lang, home.heroTitleEn, home.heroTitleHi)}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ink-700 sm:text-xl">{pick(lang, home.heroTextEn, home.heroTextHi)}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={demoHref} className="btn-accent px-6 py-3 text-lg">
                {t.cta.demo}
              </Link>
              <Link href={href(lang, '/courses')} className="btn-outline px-6 py-3 text-lg">
                {t.cta.allCourses}
              </Link>
            </div>
            {home.stats.length > 0 && (
              <dl className="mt-10 grid max-w-xl grid-cols-2 gap-4 sm:grid-cols-4">
                {home.stats.map((s) => (
                  <div key={s.labelEn} className="rounded-2xl bg-surface p-4 text-center shadow-sm ring-1 ring-ink-200">
                    <dt className="sr-only">{pick(lang, s.labelEn, s.labelHi)}</dt>
                    <dd className="font-display text-3xl font-extrabold text-brand-600">{s.value}</dd>
                    <dd className="text-xs leading-tight font-semibold text-ink-600">{pick(lang, s.labelEn, s.labelHi)}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
          {home.heroImage && (
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-xl ring-8 ring-surface">
                <Image
                  src={home.heroImage}
                  alt={lang === 'hi' ? 'SNS इंस्टीट्यूट रेवाड़ी में टॉपर्स का सम्मान' : 'Toppers being felicitated at SNS Institute Rewari'}
                  fill
                  priority
                  sizes="(min-width:1024px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-5 left-5 flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 shadow-lg ring-1 ring-ink-200">
                <span className="grid size-10 place-items-center rounded-full bg-sun-300 text-brand-900">
                  <Icon name="cap" className="size-5" />
                </span>
                <span className="text-sm leading-tight font-bold text-brand-950">{t.home.heroBadge}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. Exams strip */}
      {home.exams.length > 0 && (
        <section className="border-y border-ink-200 bg-surface">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 lg:flex-row lg:items-center">
            <h2 className="shrink-0 font-display text-sm font-bold tracking-wider text-ink-500 uppercase">{t.home.examsTitle}</h2>
            <ul className="flex flex-wrap gap-2">
              {home.exams.map((e) => (
                <li key={e} className="rounded-full bg-brand-50 px-4 py-1.5 text-sm font-bold text-brand-800">
                  {e}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 3. Courses */}
      <Section title={t.home.coursesTitle} sub={t.home.coursesSub}>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <CourseCard key={c.slug} lang={lang} course={c} />
          ))}
        </div>
      </Section>

      {/* 4. Upcoming batches */}
      {batches.length > 0 && (
        <Section title={t.home.batchesTitle} sub={t.home.batchesSub}>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {batches.map((b) => {
              const tag = pick(lang, b.entry.tagEn, b.entry.tagHi);
              return (
                <div key={b.slug} className="flex flex-col rounded-2xl bg-brand-900 p-6 text-white shadow-md">
                  {tag && <span className="mb-4 self-start rounded-full bg-sun-300 px-3 py-1 text-xs font-bold text-brand-950">{tag}</span>}
                  <h3 className="font-display text-xl font-bold">{pick(lang, b.entry.nameEn, b.entry.nameHi)}</h3>
                  <p className="mt-1 text-brand-200">{pick(lang, b.entry.forEn, b.entry.forHi)}</p>
                  <dl className="mt-5 flex flex-1 flex-wrap items-end gap-x-6 gap-y-2 text-sm">
                    {b.entry.startDate && (
                      <div>
                        <dt className="text-brand-300">{t.home.starts}</dt>
                        <dd className="font-bold">{formatDate(lang, b.entry.startDate)}</dd>
                      </div>
                    )}
                    {b.entry.fee && (
                      <div>
                        <dt className="text-brand-300">{t.course.fee}</dt>
                        <dd className="font-bold">{b.entry.fee}</dd>
                      </div>
                    )}
                  </dl>
                  <Link href={demoHref} className="btn-accent mt-6 justify-center">
                    {t.cta.enquire}
                  </Link>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* 5. Why choose */}
      {home.why.length > 0 && (
        <Section title={t.home.whyTitle}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {home.why.map((w) => (
              <div key={w.titleEn} className="flex gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent-500 text-white">
                  <Icon name="check" className="size-5" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-brand-950">{pick(lang, w.titleEn, w.titleHi)}</h3>
                  <p className="mt-1 text-ink-600">{pick(lang, w.textEn, w.textHi)}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* 6. How the free demo works */}
      <DemoSteps lang={lang} settings={settings} />

      {/* 7. Results */}
      {featured.length > 0 && (
        <Section title={t.home.resultsTitle} sub={t.home.resultsSub}>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {featured.map((r) => (
              <ResultCard key={r.slug} r={r} />
            ))}
          </div>
          <Link href={href(lang, '/results')} className="btn-outline mt-8">
            {t.cta.allResults} <Icon name="arrow" className="size-4" />
          </Link>
        </Section>
      )}

      {/* 8. Campus */}
      {gallery.length > 0 && (
        <Section title={t.home.campusTitle} sub={t.home.campusSub}>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {gallery.slice(0, 5).map((g, i) => (
              <div key={g.slug} className={`relative overflow-hidden rounded-2xl ${i === 0 ? 'col-span-2 row-span-2 aspect-square lg:aspect-auto' : 'aspect-[4/3]'}`}>
                <Image
                  src={g.entry.image}
                  alt={g.entry.caption}
                  fill
                  sizes={i === 0 ? '(min-width:1024px) 50vw, 100vw' : '(min-width:1024px) 25vw, 50vw'}
                  className="object-cover transition duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
          <Link href={href(lang, '/gallery')} className="btn-outline mt-8">
            {t.cta.gallery} <Icon name="arrow" className="size-4" />
          </Link>
        </Section>
      )}

      {/* 9. Faculty */}
      {faculty.length > 0 && (
        <Section title={t.home.facultyTitle} sub={t.home.facultySub}>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {faculty.map((f) => (
              <FacultyCard key={f.slug} lang={lang} f={f} />
            ))}
          </div>
        </Section>
      )}

      {/* 10. Reviews */}
      {(settings.rating || testimonials.length > 0) && (
        <Section title={t.home.reviewsTitle} sub={t.home.reviewsSub}>
          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            {settings.rating ? (
              <div className="flex flex-col items-center justify-center rounded-2xl bg-brand-900 p-8 text-center text-white">
                <p className="font-display text-7xl font-extrabold">{settings.rating.toFixed(1)}</p>
                <div className="mt-2 scale-125">
                  <Stars />
                </div>
                <p className="mt-3 text-brand-200">
                  {settings.reviewCount}+ {t.home.reviewsOnGoogle}
                </p>
                <a
                  href={settings.googleReviewUrl || settings.mapUrl || '#'}
                  target="_blank"
                  rel="noopener"
                  className="mt-6 rounded-full bg-surface px-5 py-2.5 font-bold text-brand-900 transition hover:bg-brand-50"
                >
                  {t.home.readReviews}
                </a>
              </div>
            ) : null}
            {testimonials.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {testimonials.slice(0, 4).map((r) => (
                  <figure key={r.slug} className="card">
                    <Stars n={r.entry.rating ?? 5} />
                    <blockquote className="mt-3 text-ink-700">“{pick(lang, r.entry.textEn, r.entry.textHi)}”</blockquote>
                    <figcaption className="mt-4 font-bold text-brand-950">
                      {r.entry.name} <span className="font-normal text-ink-500">· {r.entry.role}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {gallery
                  .filter((g) => /award|felicitation/.test(g.slug))
                  .slice(0, 2)
                  .map((g) => (
                    <div key={g.slug} className="relative aspect-[4/3] overflow-hidden rounded-2xl lg:aspect-auto">
                      <Image src={g.entry.image} alt={g.entry.caption} fill sizes="(min-width:1024px) 35vw, 50vw" className="object-cover" />
                    </div>
                  ))}
              </div>
            )}
          </div>
        </Section>
      )}

      {/* 11. Outstation students & hostel */}
      {locations.length > 0 && (
        <Section>
          <div className="grid gap-10 rounded-[2rem] border border-ink-200 bg-surface p-6 sm:p-10 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-extrabold text-brand-950 sm:text-4xl">{t.home.outstationTitle}</h2>
              <div className="mt-4 h-1.5 w-16 rounded-full bg-accent-500" />
              <p className="mt-5 text-lg text-ink-700">{t.home.outstationText}</p>
              <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-sun-300 px-4 py-2 font-bold text-brand-950">
                <Icon name="check" className="size-5" /> {t.home.hostel}
              </p>
              {settings.mapUrl && (
                <div className="mt-6">
                  <a href={settings.mapUrl} target="_blank" rel="noopener" className="btn-outline">
                    <Icon name="pin" className="size-4" /> {t.cta.directions}
                  </a>
                </div>
              )}
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-brand-950">{t.home.nearbyTitle}</h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {locations.map((l) => (
                  <li key={l.slug}>
                    <Link
                      href={href(lang, `/coaching-near/${l.slug}`)}
                      className="flex items-center justify-between gap-3 rounded-xl border border-ink-200 px-4 py-3 font-semibold text-brand-900 transition hover:border-brand-300 hover:bg-brand-50"
                    >
                      <span className="flex items-center gap-2">
                        <Icon name="pin" className="size-4 text-accent-500" />
                        {pick(lang, l.entry.town, l.entry.townHi)}
                      </span>
                      <span className="text-sm font-normal text-ink-500">~{l.entry.distanceKm} km</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      )}

      {/* 12. Exam updates */}
      {posts.length > 0 && (
        <Section title={t.home.updatesTitle}>
          <div className="grid gap-6 md:grid-cols-3">
            {posts.slice(0, 3).map((p) => (
              <PostCard key={p.slug} lang={lang} post={p} />
            ))}
          </div>
        </Section>
      )}

      {/* 13. FAQ */}
      {generalFaqs.length > 0 && (
        <Section title={t.home.faqTitle}>
          <div className="max-w-4xl">
            <FaqList items={generalFaqs} />
          </div>
          <JsonLd data={faqJsonLd(generalFaqs)} />
        </Section>
      )}

      {/* 14. Book a free demo – the form lives here, not in the banner */}
      <BookDemo
        lang={lang}
        settings={settings}
        courseNames={courses.map((c) => c.entry.titleEn)}
        image={classroom ? { src: classroom.entry.image, alt: classroom.entry.caption } : null}
      />
    </>
  );
}
