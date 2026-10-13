import 'server-only';
import { cache } from 'react';
import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';

/** Reads content files written by Keystatic. Runs at build time only. */
export const reader = createReader(process.cwd(), keystaticConfig);

const byOrder = <T extends { entry: { order?: number | null } }>(a: T, b: T) =>
  (a.entry.order ?? 99) - (b.entry.order ?? 99);

export const getSettings = cache(async () => {
  const s = await reader.singletons.settings.readOrThrow();
  return s;
});

export const getHome = cache(() => reader.singletons.home.readOrThrow({ resolveLinkedFiles: true }));

export const getAbout = cache(() => reader.singletons.about.readOrThrow({ resolveLinkedFiles: true }));

export const getCourses = cache(async () =>
  (await reader.collections.courses.all({ resolveLinkedFiles: true })).sort(byOrder),
);

export const getCourse = cache((slug: string) =>
  reader.collections.courses.read(slug, { resolveLinkedFiles: true }),
);

export const getBatches = cache(async () =>
  (await reader.collections.batches.all()).filter((b) => b.entry.active).sort(byOrder),
);

export const getResults = cache(async () =>
  (await reader.collections.results.all()).sort((a, b) => b.entry.year - a.entry.year || (a.entry.order ?? 99) - (b.entry.order ?? 99)),
);

export const getFaculty = cache(async () =>
  (await reader.collections.faculty.all()).filter((f) => f.entry.active !== false).sort(byOrder),
);

export const getTestimonials = cache(() => reader.collections.testimonials.all());

export const getFaqs = cache(async () => (await reader.collections.faqs.all()).sort(byOrder));

export const getPosts = cache(async () =>
  (await reader.collections.posts.all({ resolveLinkedFiles: true })).sort((a, b) =>
    b.entry.date.localeCompare(a.entry.date),
  ),
);

export const getPost = cache((slug: string) =>
  reader.collections.posts.read(slug, { resolveLinkedFiles: true }),
);

export const getLocations = cache(async () =>
  (await reader.collections.locations.all()).sort((a, b) => (a.entry.distanceKm ?? 0) - (b.entry.distanceKm ?? 0)),
);

export const getLocation = cache((slug: string) => reader.collections.locations.read(slug));

export const getGallery = cache(async () => (await reader.collections.gallery.all()).sort(byOrder));

export type Settings = Awaited<ReturnType<typeof getSettings>>;
export type CourseEntry = Awaited<ReturnType<typeof getCourses>>[number];
export type PostEntry = Awaited<ReturnType<typeof getPosts>>[number];
