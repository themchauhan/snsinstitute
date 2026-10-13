import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDict, href, locales, pick, type Locale } from '@/lib/i18n';
import { getCourses, getLocation, getLocations, getSettings } from '@/lib/content';
import { SITE_URL, breadcrumbJsonLd, buildMetadata } from '@/lib/seo';
import { JsonLd, PageHero, Section } from '@/components/ui';
import { CourseCard } from '@/components/cards';
import { Icon } from '@/components/Icon';

export const dynamicParams = false;
export async function generateStaticParams() {
  const locs = await getLocations();
  return locales.flatMap((lang) => locs.map((l) => ({ lang, town: l.slug })));
}

export async function generateMetadata({ params }: PageProps<'/[lang]/coaching-near/[town]'>) {
  const { lang, town } = (await params) as { lang: Locale; town: string };
  const l = await getLocation(town);
  if (!l) return {};
  const name = pick(lang, l.town, l.townHi);
  return buildMetadata({
    lang,
    path: `/coaching-near/${town}`,
    title: (lang === 'en' && l.seo.title) || getDict(lang).location.title(name),
    description: (lang === 'en' && l.seo.description) || pick(lang, l.introEn, l.introHi).slice(0, 160),
    hasHindi: !!l.introHi,
  });
}

export default async function TownPage({ params }: PageProps<'/[lang]/coaching-near/[town]'>) {
  const { lang, town } = (await params) as { lang: Locale; town: string };
  const t = getDict(lang);
  const [l, courses, s] = await Promise.all([getLocation(town), getCourses(), getSettings()]);
  if (!l) notFound();
  const name = pick(lang, l.town, l.townHi);
  const title = t.location.title(name);
  const url = SITE_URL + href(lang, `/coaching-near/${town}`);

  return (
    <>
      <PageHero
        title={title}
        sub={l.distanceKm ? t.location.distance(l.distanceKm) : undefined}
        crumbs={[
          { href: href(lang), label: t.misc.breadcrumbHome },
          { href: href(lang, `/coaching-near/${town}`), label: name },
        ]}
      />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-12 lg:grid-cols-[1fr_380px]">
        <div className="max-w-3xl space-y-4 text-lg whitespace-pre-line">{pick(lang, l.introEn, l.introHi)}</div>
        <div className="rounded-3xl bg-brand-50 p-6 lg:self-start">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold text-brand-950">
            <Icon name="pin" className="size-5 text-accent-500" /> {t.location.howToReach}
          </h2>
          <p className="mt-3 whitespace-pre-line text-ink-700">{pick(lang, l.travelEn, l.travelHi)}</p>
          <p className="mt-4 text-sm text-ink-600">{pick(lang, s.addressEn, s.addressHi)}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href={href(lang, '/contact#enquiry')} className="btn-accent">
              {t.cta.demo}
            </Link>
            {s.mapUrl && (
              <a href={s.mapUrl} target="_blank" rel="noopener" className="btn-outline">
                {t.cta.directions}
              </a>
            )}
          </div>
        </div>
      </div>
      <Section title={t.location.coursesFor(name)}>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <CourseCard key={c.slug} lang={lang} course={c} />
          ))}
        </div>
      </Section>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: t.misc.breadcrumbHome, url: SITE_URL + href(lang) },
          { name: title, url },
        ])}
      />
    </>
  );
}
