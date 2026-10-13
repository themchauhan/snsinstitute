import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Baloo_2, Nunito } from 'next/font/google';
import { Logo } from '@/components/Logo';

const baloo = Baloo_2({ subsets: ['latin'], weight: ['700', '800'], variable: '--font-baloo', display: 'swap' });
const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito', display: 'swap' });

export const metadata: Metadata = {
  title: '404 – Page not found | SNS Institute Rewari',
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="en-IN" className={`${baloo.variable} ${nunito.variable}`}>
      <body className="bg-hero-pattern grid min-h-dvh place-items-center px-4 text-center">
        <main>
          <Link href="/" aria-label="SNS Institute Rewari – Home">
            <Logo className="mx-auto h-14 w-auto" />
          </Link>
          <p className="mt-10 font-display text-8xl font-extrabold text-brand-200">404</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-brand-950">Page not found / पेज नहीं मिला</h1>
          <p className="mt-3 text-ink-600">The page you are looking for may have moved. Try one of these:</p>
          <nav className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/" className="btn-accent">Home</Link>
            <Link href="/courses" className="btn-outline">Courses</Link>
            <Link href="/contact" className="btn-outline">Contact</Link>
            <Link href="/hi" className="btn-outline">हिंदी</Link>
          </nav>
        </main>
      </body>
    </html>
  );
}
