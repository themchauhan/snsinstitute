import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatDate, getDict, href, locales, pick, type Locale } from '@/lib/i18n';
import { getPost, getPosts } from '@/lib/content';
import { SITE_URL, articleJsonLd, breadcrumbJsonLd, buildMetadata } from '@/lib/seo';
import { JsonLd, PageHero } from '@/components/ui';
import { RichText, hasContent } from '@/components/RichText';

export const dynamicParams = false;
export async function generateStaticParams() {
  const posts = await getPosts();
  return locales.flatMap((lang) => posts.map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({ params }: PageProps<'/[lang]/updates/[slug]'>) {
  const { lang, slug } = (await params) as { lang: Locale; slug: string };
  const p = await getPost(slug);
  if (!p) return {};
  return buildMetadata({
    lang,
    path: `/updates/${slug}`,
    title: (lang === 'en' && p.seo.title) || pick(lang, p.titleEn, p.titleHi),
    description: (lang === 'en' && p.seo.description) || pick(lang, p.excerptEn, p.excerptHi),
    image: p.cover,
    hasHindi: !!p.titleHi && hasContent(p.bodyHi),
    type: 'article',
  });
}

export default async function PostPage({ params }: PageProps<'/[lang]/updates/[slug]'>) {
  const { lang, slug } = (await params) as { lang: Locale; slug: string };
  const t = getDict(lang);
  const p = await getPost(slug);
  if (!p) notFound();
  const title = pick(lang, p.titleEn, p.titleHi);
  const body = lang === 'hi' && hasContent(p.bodyHi) ? p.bodyHi : p.bodyEn;
  const url = SITE_URL + href(lang, `/updates/${slug}`);

  return (
    <article>
      <PageHero
        title={title}
        crumbs={[
          { href: href(lang), label: t.misc.breadcrumbHome },
          { href: href(lang, '/updates'), label: t.nav.updates },
          { href: href(lang, `/updates/${slug}`), label: title },
        ]}
      />
      <div className="mx-auto max-w-3xl px-4 pt-10">
        <p className="text-sm font-semibold text-accent-600">
          {t.misc.updatedOn} <time dateTime={p.date}>{formatDate(lang, p.date)}</time>
        </p>
        {p.cover && (
          <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-3xl">
            <Image src={p.cover} alt={title} fill priority sizes="(min-width:768px) 768px, 100vw" className="object-cover" />
          </div>
        )}
        <div className="mt-6">
          <RichText node={body} />
        </div>
        <div className="mt-12 rounded-3xl bg-brand-50 p-6 text-center sm:p-8">
          <p className="font-display text-xl font-bold text-brand-950">{t.form.title}</p>
          <p className="mt-1 text-ink-600">{t.form.sub}</p>
          <Link href={href(lang, '/contact#enquiry')} className="btn-accent mt-5">
            {t.cta.demo}
          </Link>
        </div>
      </div>
      <JsonLd
        data={[
          articleJsonLd({ title, description: pick(lang, p.excerptEn, p.excerptHi), url, date: p.date, image: p.cover }),
          breadcrumbJsonLd([
            { name: t.misc.breadcrumbHome, url: SITE_URL + href(lang) },
            { name: t.nav.updates, url: SITE_URL + href(lang, '/updates') },
            { name: title, url },
          ]),
        ]}
      />
    </article>
  );
}
