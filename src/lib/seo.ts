import type { Metadata } from 'next';
import { href, type Locale } from './i18n';
import type { Settings } from './content';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.snsinstitute.in').replace(/\/$/, '');
export const SITE_NAME = 'SNS Institute Rewari';

type MetaInput = {
  lang: Locale;
  /** path without language prefix, e.g. "/courses/neet-coaching-rewari" */
  path: string;
  title: string;
  description: string;
  image?: string | null;
  /** set false when the Hindi page has no Hindi text (avoids duplicate content) */
  hasHindi?: boolean;
  type?: 'website' | 'article';
  /** true = don't append " | SNS Institute Rewari" */
  absoluteTitle?: boolean;
};

export function buildMetadata({ lang, path, title, description, image, hasHindi = true, type = 'website', absoluteTitle = false }: MetaInput): Metadata {
  const enUrl = SITE_URL + href('en', path);
  const hiUrl = SITE_URL + href('hi', path);
  const canonical = lang === 'hi' && hasHindi ? hiUrl : enUrl;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical,
      languages: hasHindi ? { 'en-IN': enUrl, 'hi-IN': hiUrl, 'x-default': enUrl } : { 'en-IN': enUrl, 'x-default': enUrl },
    },
    openGraph: {
      type,
      url: canonical,
      title,
      description,
      siteName: SITE_NAME,
      locale: lang === 'hi' ? 'hi_IN' : 'en_IN',
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

/** EducationalOrganization + LocalBusiness schema for Google. */
export function organizationJsonLd(s: Settings) {
  return {
    '@context': 'https://schema.org',
    '@type': ['EducationalOrganization', 'LocalBusiness'],
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: ['SNS Institute', 'SNS Coaching Rewari'],
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    image: `${SITE_URL}/opengraph-image`,
    telephone: s.phones[0] ? `+91${s.phones[0].replace(/\D/g, '').slice(-10)}` : undefined,
    email: s.email || undefined,
    foundingDate: s.established ? String(s.established) : undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Gopal Dev Chowk, Narnaul Road, Saini Mohalla',
      addressLocality: 'Rewari',
      addressRegion: 'Haryana',
      postalCode: '123401',
      addressCountry: 'IN',
    },
    areaServed: ['Rewari', 'Dharuhera', 'Bawal', 'Kosli', 'Narnaul', 'Mahendragarh', 'Jhajjar', 'Bhiwadi'].map((name) => ({
      '@type': 'City',
      name,
    })),
    priceRange: '₹₹',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '09:00',
      closes: '20:00',
    },
    ...(s.rating && s.reviewCount
      ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: s.rating, reviewCount: s.reviewCount, bestRating: 5 } }
      : {}),
    sameAs: [s.instagram, s.facebook, s.youtube].filter(Boolean),
  };
}

export function courseJsonLd(opts: { name: string; description: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    inLanguage: ['en', 'hi'],
    provider: { '@id': `${SITE_URL}/#organization` },
    hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'Onsite', location: 'Rewari, Haryana' },
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((i, idx) => ({ '@type': 'ListItem', position: idx + 1, name: i.name, item: i.url })),
  };
}

export function articleJsonLd(opts: { title: string; description: string; url: string; date: string; image?: string | null }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    description: opts.description,
    datePublished: opts.date,
    dateModified: opts.date,
    mainEntityOfPage: opts.url,
    ...(opts.image ? { image: SITE_URL + opts.image } : {}),
    author: { '@id': `${SITE_URL}/#organization` },
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}
