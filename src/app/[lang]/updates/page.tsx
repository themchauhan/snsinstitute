import { getDict, href, type Locale } from '@/lib/i18n';
import { getPosts } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { PageHero, Section } from '@/components/ui';
import { PostCard } from '@/components/cards';

export async function generateMetadata({ params }: PageProps<'/[lang]/updates'>) {
  const lang = (await params).lang as Locale;
  const hi = lang === 'hi';
  return buildMetadata({
    lang,
    path: '/updates',
    title: hi ? 'NEET, JEE, HBSE, CBSE परीक्षा अपडेट और सूचनाएँ' : 'NEET, JEE, HBSE & CBSE Exam Updates and Notices',
    description: hi
      ? 'NEET और JEE परीक्षा तिथि, सिलेबस, कट-ऑफ, HBSE/CBSE रिज़ल्ट और SNS इंस्टीट्यूट रेवाड़ी की सूचनाएँ।'
      : 'Latest NEET and JEE exam dates, syllabus, cut-offs, HBSE/CBSE results and notices from SNS Institute Rewari.',
  });
}

export default async function UpdatesPage({ params }: PageProps<'/[lang]/updates'>) {
  const lang = (await params).lang as Locale;
  const t = getDict(lang);
  const posts = await getPosts();
  return (
    <>
      <PageHero
        title={t.home.updatesTitle}
        crumbs={[
          { href: href(lang), label: t.misc.breadcrumbHome },
          { href: href(lang, '/updates'), label: t.nav.updates },
        ]}
      />
      <Section>
        {posts.length === 0 ? (
          <p>{t.misc.noPosts}</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <PostCard key={p.slug} lang={lang} post={p} />
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
