import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-display text-7xl font-extrabold text-brand-200">404</p>
      <h1 className="mt-4 font-display text-3xl font-bold text-brand-950">Page not found / पेज नहीं मिला</h1>
      <Link href="/" className="btn-accent mt-8">
        Back to home
      </Link>
    </div>
  );
}
