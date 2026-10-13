import type { MetadataRoute } from 'next';
import { getCourses, getLocations, getPosts } from '@/lib/content';
import { href } from '@/lib/i18n';
import { SITE_URL } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [courses, posts, locations] = await Promise.all([getCourses(), getPosts(), getLocations()]);
  const entry = (path: string, priority: number, lastModified?: string, hasHindi = true): MetadataRoute.Sitemap[number] => ({
    url: SITE_URL + href('en', path),
    lastModified: lastModified ? new Date(lastModified) : new Date(),
    priority,
    alternates: hasHindi ? { languages: { 'en-IN': SITE_URL + href('en', path), 'hi-IN': SITE_URL + href('hi', path) } } : undefined,
  });
  return [
    entry('/', 1),
    entry('/courses', 0.9),
    ...courses.map((c) => entry(`/courses/${c.slug}`, 0.9, undefined, !!c.entry.titleHi)),
    entry('/results', 0.8),
    entry('/faculty', 0.7),
    entry('/updates', 0.8),
    ...posts.map((p) => entry(`/updates/${p.slug}`, 0.7, p.entry.date, !!p.entry.titleHi)),
    ...locations.map((l) => entry(`/coaching-near/${l.slug}`, 0.7, undefined, !!l.entry.introHi)),
    entry('/about', 0.6),
    entry('/contact', 0.8),
    entry('/gallery', 0.4),
  ];
}
