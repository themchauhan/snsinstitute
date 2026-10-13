import Image from 'next/image';
import { getDict, href, type Locale } from '@/lib/i18n';
import { getGallery } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { PageHero, Section } from '@/components/ui';

export async function generateMetadata({ params }: PageProps<'/[lang]/gallery'>) {
  const lang = (await params).lang as Locale;
  return buildMetadata({
    lang,
    path: '/gallery',
    title: lang === 'hi' ? 'गैलरी – क्लासरूम और कार्यक्रम' : 'Gallery – Classrooms & Events',
    description: lang === 'hi' ? 'SNS इंस्टीट्यूट रेवाड़ी की तस्वीरें।' : 'Photos of classrooms, events and celebrations at SNS Institute Rewari.',
  });
}

export default async function GalleryPage({ params }: PageProps<'/[lang]/gallery'>) {
  const lang = (await params).lang as Locale;
  const t = getDict(lang);
  const items = await getGallery();
  return (
    <>
      <PageHero
        title={t.nav.gallery}
        crumbs={[
          { href: href(lang), label: t.misc.breadcrumbHome },
          { href: href(lang, '/gallery'), label: t.nav.gallery },
        ]}
      />
      <Section>
        {items.length === 0 ? (
          <p className="text-ink-600">Photos coming soon.</p>
        ) : (
          <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
            {items.map((g) => (
              <figure key={g.slug} className="mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-surface ring-1 ring-ink-200">
                <div className="relative aspect-[4/3]">
                  <Image src={g.entry.image} alt={g.entry.caption} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover" />
                </div>
                <figcaption className="p-3 text-sm text-ink-600">{g.entry.caption}</figcaption>
              </figure>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
