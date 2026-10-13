import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { Baloo_2, Hind, Nunito } from 'next/font/google';
import '../globals.css';
import { isLocale, locales, getDict, pick } from '@/lib/i18n';
import { getCourses, getHome, getLocations, getSettings } from '@/lib/content';
import { SITE_URL, organizationJsonLd } from '@/lib/seo';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingContact } from '@/components/FloatingContact';
import { JsonLd } from '@/components/ui';

// Soft, rounded fonts. Change the font *variables* in app/theme.css; swap families here.
const baloo = Baloo_2({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-baloo', display: 'swap' });
const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito', display: 'swap' });
// Hindi glyphs – only downloaded by the browser when Devanagari text is on the page.
const hind = Hind({ subsets: ['devanagari'], weight: ['400', '600'], variable: '--font-hind', display: 'swap', preload: false });

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = { themeColor: '#182a5c', width: 'device-width', initialScale: 1 };

export async function generateMetadata({ params }: LayoutProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params;
  const hi = lang === 'hi';
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: hi ? 'SNS इंस्टीट्यूट रेवाड़ी | JEE, NEET और कक्षा 5–12 कोचिंग' : 'SNS Institute Rewari | JEE, NEET & Class 5–12 Coaching',
      template: hi ? '%s | SNS इंस्टीट्यूट रेवाड़ी' : '%s | SNS Institute Rewari',
    },
    applicationName: 'SNS Institute Rewari',
    formatDetection: { telephone: true },
    robots: { index: true, follow: true, 'max-image-preview': 'large' },
    verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
  };
}

export default async function RootLayout({ children, params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDict(lang);
  const [settings, home, courses, locations] = await Promise.all([getSettings(), getHome(), getCourses(), getLocations()]);

  return (
    <html lang={lang === 'hi' ? 'hi-IN' : 'en-IN'} className={`${baloo.variable} ${nunito.variable} ${hind.variable}`}>
      <body className="antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-surface focus:p-3">
          Skip to content
        </a>
        <Header lang={lang} settings={settings} announcement={pick(lang, home.announcementEn, home.announcementHi) || undefined} />
        <main id="main">{children}</main>
        <Footer lang={lang} settings={settings} courses={courses} locations={locations} />
        <FloatingContact whatsapp={settings.whatsapp} phone={settings.phones[0]} labels={{ call: t.cta.call, whatsapp: t.cta.whatsapp }} />
        <JsonLd data={organizationJsonLd(settings)} />
      </body>
    </html>
  );
}
