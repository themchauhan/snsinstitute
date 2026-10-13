import Image from 'next/image';
import { getDict, href, pick, type Locale } from '@/lib/i18n';
import { getAbout, getCourses, getFaculty, getHome, getSettings } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { PageHero, Section } from '@/components/ui';
import { FacultyProfile } from '@/components/cards';
import { BookDemo, CardGrid } from '@/components/blades';
import { ImageSlider } from '@/components/ImageSlider';
import { RichText, hasContent } from '@/components/RichText';
import { Icon } from '@/components/Icon';

export async function generateMetadata({ params }: PageProps<'/[lang]/about'>) {
  const lang = (await params).lang as Locale;
  const a = await getAbout();
  return buildMetadata({
    lang,
    path: '/about',
    title: (lang === 'en' && a.seo.title) || (lang === 'hi' ? 'हमारे बारे में – कहानी, शिक्षक और कैंपस' : 'About Us – Our Story, Faculty & Campus'),
    description: (lang === 'en' && a.seo.description) || pick(lang, a.introEn, a.introHi),
  });
}

export default async function AboutPage({ params }: PageProps<'/[lang]/about'>) {
  const lang = (await params).lang as Locale;
  const t = getDict(lang);
  const [a, home, settings, courses, faculty] = await Promise.all([getAbout(), getHome(), getSettings(), getCourses(), getFaculty()]);
  const body = lang === 'hi' && hasContent(a.bodyHi) ? a.bodyHi : a.bodyEn;
  const slides = a.slides.filter((s) => s.image).map((s) => ({ src: s.image as string, caption: pick(lang, s.captionEn, s.captionHi) }));
  const leaders = faculty.filter((f) => f.entry.leader);

  return (
    <>
      <PageHero
        title={t.nav.about}
        sub={pick(lang, a.introEn, a.introHi)}
        crumbs={[
          { href: href(lang), label: t.misc.breadcrumbHome },
          { href: href(lang, '/about'), label: t.nav.about },
        ]}
      />

      {/* Photo slider */}
      {slides.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 pt-12">
          <ImageSlider slides={slides} labels={{ prev: t.about.prev, next: t.about.next }} />
        </div>
      )}

      {/* Story */}
      <Section title={t.about.storyTitle}>
        <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
          <RichText node={body} />
          {a.image && (
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl lg:self-start">
              <Image src={a.image} alt="SNS Institute Rewari" fill sizes="(min-width:1024px) 420px, 100vw" className="object-cover" />
            </div>
          )}
        </div>
      </Section>

      {/* Mission & vision */}
      {(a.missionEn || a.visionEn) && (
        <Section>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              { title: t.about.mission, text: pick(lang, a.missionEn, a.missionHi), icon: 'rocket', dark: true },
              { title: t.about.vision, text: pick(lang, a.visionEn, a.visionHi), icon: 'star', dark: false },
            ].map((m) => (
              <div key={m.title} className={`rounded-[2rem] p-8 sm:p-10 ${m.dark ? 'bg-brand-900 text-white' : 'bg-sun-300/50 text-brand-950'}`}>
                <span className={`grid size-12 place-items-center rounded-2xl ${m.dark ? 'bg-accent-500' : 'bg-surface'}`}>
                  <Icon name={m.icon} className={`size-6 ${m.dark ? 'text-white' : 'text-accent-600'}`} />
                </span>
                <h2 className="mt-5 font-display text-2xl font-extrabold">{m.title}</h2>
                <p className={`mt-3 text-lg ${m.dark ? 'text-brand-100' : 'text-ink-700'}`}>{m.text}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Numbers */}
      {home.stats.length > 0 && (
        <Section title={t.about.numbers}>
          <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {home.stats.map((s) => (
              <div key={s.labelEn} className="rounded-2xl bg-surface p-6 text-center ring-1 ring-ink-200">
                <dd className="font-display text-4xl font-extrabold text-brand-600">{s.value}</dd>
                <dt className="mt-1 font-semibold text-ink-600">{pick(lang, s.labelEn, s.labelHi)}</dt>
              </div>
            ))}
          </dl>
        </Section>
      )}

      {/* Values */}
      {a.values.length > 0 && (
        <Section title={t.about.values}>
          <CardGrid
            cols={4}
            items={a.values.map((v, i) => ({
              title: pick(lang, v.titleEn, v.titleHi),
              text: pick(lang, v.textEn, v.textHi),
              icon: ['star', 'check', 'cap', 'book'][i % 4],
            }))}
          />
        </Section>
      )}

      {/* Facilities */}
      {a.facilities.length > 0 && (
        <Section title={t.about.facilities} sub={t.about.facilitiesSub}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {a.facilities.map((f) => (
              <article key={f.titleEn} className="card overflow-hidden p-0">
                {f.image ? (
                  <div className="relative aspect-[4/3]">
                    <Image src={f.image} alt={pick(lang, f.titleEn, f.titleHi)} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover" />
                  </div>
                ) : (
                  <div className="grid aspect-[4/3] place-items-center bg-brand-50">
                    <Icon name={/hostel/i.test(f.titleEn) ? 'pin' : 'cap'} className="size-16 text-brand-300" />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-display text-lg font-bold text-brand-950">{pick(lang, f.titleEn, f.titleHi)}</h3>
                  <p className="mt-1 text-ink-600">{pick(lang, f.textEn, f.textHi)}</p>
                </div>
              </article>
            ))}
          </div>
        </Section>
      )}

      {/* Leadership */}
      {leaders.length > 0 && (
        <Section title={t.faculty.leadership}>
          {leaders.map((f) => (
            <FacultyProfile key={f.slug} lang={lang} f={f} wide />
          ))}
        </Section>
      )}

      {/* Visit */}
      <Section title={t.about.visitTitle}>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 text-lg">
            <p className="flex gap-3">
              <Icon name="pin" className="mt-1 size-5 shrink-0 text-accent-500" />
              {pick(lang, settings.addressEn, settings.addressHi)}
            </p>
            <p className="flex gap-3">
              <Icon name="clock" className="mt-1 size-5 shrink-0 text-accent-500" />
              {pick(lang, settings.hoursEn, settings.hoursHi)}
            </p>
            {settings.mapUrl && (
              <a href={settings.mapUrl} target="_blank" rel="noopener" className="btn-outline">
                <Icon name="pin" className="size-4" /> {t.cta.directions}
              </a>
            )}
          </div>
          {settings.mapEmbed && (
            <iframe
              title="SNS Institute Rewari on Google Maps"
              src={settings.mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="aspect-[16/10] w-full rounded-3xl border-0 ring-1 ring-ink-200"
            />
          )}
        </div>
      </Section>

      <BookDemo
        lang={lang}
        settings={settings}
        courseNames={courses.map((c) => c.entry.titleEn)}
        image={slides[1] ? { src: slides[1].src, alt: slides[1].caption } : null}
      />
    </>
  );
}
