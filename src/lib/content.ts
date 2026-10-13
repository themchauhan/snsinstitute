import 'server-only';
import { cache } from 'react';
import fs from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';
import Markdoc, { type Node } from '@markdoc/markdoc';

/**
 * All website content lives in /content as YAML files:
 *  - single pages: settings.yaml, home.yaml, about.yaml
 *  - lists (add an item by pasting a block): results, faculty, batches, faqs, gallery, testimonials, posts, locations
 *  - one file per course (file name = URL): courses/
 * This module reads them at build time.
 *
 * To update the site: edit a file in /content, commit and push – Vercel rebuilds automatically.
 */

const ROOT = path.join(process.cwd(), 'content');

/** Rich text (Markdown) fields are stored as plain strings and parsed here. */
export type Rich = { node: Node } | null;
type Bi = { en: string; hi?: string };
type Card = { titleEn: string; titleHi?: string; textEn: string; textHi?: string };
type Seo = { title?: string; description?: string };

export type Settings = {
  phones: string[];
  whatsapp?: string;
  email?: string;
  addressEn: string;
  addressHi?: string;
  mapUrl?: string;
  mapEmbed?: string;
  hoursEn: string;
  hoursHi?: string;
  established?: number;
  rating?: number;
  reviewCount?: number;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  googleReviewUrl?: string;
};

export type Home = {
  announcementEn?: string;
  announcementHi?: string;
  heroTitleEn: string;
  heroTitleHi?: string;
  heroTextEn: string;
  heroTextHi?: string;
  heroImage?: string | null;
  stats: { value: string; labelEn: string; labelHi?: string }[];
  why: Card[];
  exams: string[];
  seo: Seo;
};

export type About = {
  introEn: string;
  introHi?: string;
  slides: { image: string | null; captionEn: string; captionHi?: string }[];
  bodyEn: Rich;
  bodyHi: Rich;
  image?: string | null;
  missionEn?: string;
  missionHi?: string;
  visionEn?: string;
  visionHi?: string;
  values: Card[];
  facilities: (Card & { image?: string | null })[];
  seo: Seo;
};

export type Course = {
  titleEn: string;
  titleHi?: string;
  order?: number;
  icon: string;
  classesEn: string;
  classesHi?: string;
  durationEn: string;
  durationHi?: string;
  summaryEn: string;
  summaryHi?: string;
  highlights: Bi[];
  subjects: string[];
  whoFor: Bi[];
  syllabus: { subject: string; topicsEn: string; topicsHi?: string }[];
  features: Card[];
  roadmap: Card[];
  fee?: string;
  bodyEn: Rich;
  bodyHi: Rich;
  image?: string | null;
  seo: Seo;
};

export type Batch = {
  nameEn: string;
  nameHi?: string;
  active?: boolean;
  course?: string | null;
  startDate?: string | null;
  forEn: string;
  forHi?: string;
  fee?: string;
  tagEn?: string;
  tagHi?: string;
  order?: number;
};

export type Result = {
  name: string;
  exam: string;
  category?: string;
  year: number;
  achievement: string;
  place: string;
  photo: string | null;
  featured?: boolean;
  order?: number;
  quoteEn?: string;
  quoteHi?: string;
};

export type Faculty = {
  name: string;
  subject: string;
  qualification: string;
  experience: string;
  active?: boolean;
  roleEn?: string;
  roleHi?: string;
  leader?: boolean;
  teaches: string[];
  bioEn?: string;
  bioHi?: string;
  highlights: Bi[];
  photo: string | null;
  order?: number;
};

export type Testimonial = { name: string; role: string; textEn: string; textHi?: string; rating?: number };

export type Post = {
  titleEn: string;
  titleHi?: string;
  date: string;
  category: string;
  excerptEn: string;
  excerptHi?: string;
  cover?: string | null;
  bodyEn: Rich;
  bodyHi: Rich;
  seo: Seo;
};

export type Faq = { questionEn: string; questionHi?: string; answerEn: string; answerHi?: string; course?: string | null; order?: number };

export type Location = {
  town: string;
  townHi?: string;
  distanceKm?: number;
  travelEn: string;
  travelHi?: string;
  introEn: string;
  introHi?: string;
  seo: Seo;
};

export type GalleryItem = { caption: string; image: string; order?: number };

export type Entry<T> = { slug: string; entry: T };

// ---------------------------------------------------------------------------

const RICH_KEYS = ['bodyEn', 'bodyHi'];

/** Same defaults everywhere: listed arrays become [] when missing, Markdown becomes a parsed tree, seo is always an object. */
function normalise<T>(raw: Record<string, unknown>, arrays: string[]): T {
  const d: Record<string, unknown> = { ...raw };
  for (const k of RICH_KEYS) {
    if (k in d) {
      const s = typeof d[k] === 'string' ? (d[k] as string) : '';
      d[k] = s.trim() ? { node: Markdoc.parse(s) } : null;
    }
  }
  for (const k of arrays) if (!Array.isArray(d[k])) d[k] = [];
  if (!d.seo || typeof d.seo !== 'object') d.seo = {};
  return d as T;
}

async function readYaml(file: string): Promise<Record<string, unknown>> {
  return (YAML.parse(await fs.readFile(file, 'utf8')) ?? {}) as Record<string, unknown>;
}

async function single<T>(name: string, arrays: string[] = []): Promise<T> {
  return normalise<T>(await readYaml(path.join(ROOT, `${name}.yaml`)), arrays);
}

async function collection<T>(dir: string, arrays: string[] = []): Promise<Entry<T>[]> {
  let files: string[] = [];
  try {
    files = (await fs.readdir(path.join(ROOT, dir))).filter((f) => f.endsWith('.yaml')).sort();
  } catch {
    return [];
  }
  return Promise.all(
    files.map(async (f) => ({
      slug: f.replace(/\.yaml$/, ''),
      entry: normalise<T>(await readYaml(path.join(ROOT, dir, f)), arrays),
    })),
  );
}

async function one<T>(dir: string, slug: string, arrays: string[] = []): Promise<T | null> {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  try {
    return normalise<T>(await readYaml(path.join(ROOT, dir, `${slug}.yaml`)), arrays);
  } catch {
    return null;
  }
}

/** A single YAML file holding a list of items (toppers, faculty, FAQs…). File order = display order. */
async function list<T>(name: string, key: (item: Record<string, unknown>) => unknown, arrays: string[] = []): Promise<Entry<T>[]> {
  let raw: unknown;
  try {
    raw = YAML.parse(await fs.readFile(path.join(ROOT, `${name}.yaml`), 'utf8'));
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw new Error(`content/${name}.yaml is not valid YAML: ${(e as Error).message}`);
  }
  if (!Array.isArray(raw)) return [];
  const seen = new Map<string, number>();
  return raw
    .filter((x): x is Record<string, unknown> => !!x && typeof x === 'object')
    .map((item) => {
      const base = slugify(String(key(item) ?? name)) || name;
      const n = (seen.get(base) ?? 0) + 1;
      seen.set(base, n);
      return { slug: n > 1 ? `${base}-${n}` : base, entry: normalise<T>(item, arrays) };
    });
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/\.[a-z]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);

const byOrder = <T extends { entry: { order?: number | null } }>(a: T, b: T) => (a.entry.order ?? 99) - (b.entry.order ?? 99);

const COURSE_ARRAYS = ['highlights', 'subjects', 'whoFor', 'syllabus', 'features', 'roadmap'];
const FACULTY_ARRAYS = ['teaches', 'highlights'];

// ---------------------------------------------------------------------------

export const getSettings = cache(() => single<Settings>('settings', ['phones']));
export const getHome = cache(() => single<Home>('home', ['stats', 'why', 'exams']));
export const getAbout = cache(() => single<About>('about', ['slides', 'values', 'facilities']));

export const getCourses = cache(async () => (await collection<Course>('courses', COURSE_ARRAYS)).sort(byOrder));
export const getCourse = cache((slug: string) => one<Course>('courses', slug, COURSE_ARRAYS));

// Lists – one file each, add items by pasting a block. File order = display order.
export const getBatches = cache(async () =>
  (await list<Batch>('batches', (b) => b.nameEn)).filter((b) => b.entry.active !== false),
);

/** Newest year first; within a year, the order in results.yaml. */
export const getResults = cache(async () =>
  (await list<Result>('results', (r) => `${r.name}-${r.exam}`)).sort((a, b) => Number(b.entry.year) - Number(a.entry.year)),
);

export const getFaculty = cache(async () =>
  (await list<Faculty>('faculty', (f) => f.name, FACULTY_ARRAYS)).filter((f) => f.entry.active !== false),
);

export const getTestimonials = cache(() => list<Testimonial>('testimonials', (t) => t.name));

export const getFaqs = cache(() => list<Faq>('faqs', (f) => f.questionEn));

/** Address = optional "slug:" or the English title. Newest date first. */
export const getPosts = cache(async () =>
  (await list<Post>('posts', (p) => p.slug ?? p.titleEn)).sort((a, b) => String(b.entry.date).localeCompare(String(a.entry.date))),
);
export const getPost = cache(async (slug: string) => (await getPosts()).find((p) => p.slug === slug)?.entry ?? null);

/** Address = optional "slug:" or the town name. Nearest first. */
export const getLocations = cache(async () =>
  (await list<Location>('locations', (l) => l.slug ?? l.town)).sort((a, b) => (a.entry.distanceKm ?? 0) - (b.entry.distanceKm ?? 0)),
);
export const getLocation = cache(async (slug: string) => (await getLocations()).find((l) => l.slug === slug)?.entry ?? null);

export const getGallery = cache(() => list<GalleryItem>('gallery', (g) => String(g.image ?? g.caption).split('/').pop()));

export type CourseEntry = Entry<Course>;
export type PostEntry = Entry<Post>;
