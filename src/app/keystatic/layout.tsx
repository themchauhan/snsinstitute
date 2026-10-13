import type { Metadata } from 'next';
import KeystaticApp from './keystatic';

export const metadata: Metadata = { title: 'SNS Admin', robots: { index: false, follow: false } };

export default function Layout() {
  return (
    <html lang="en">
      <body>
        <KeystaticApp />
      </body>
    </html>
  );
}
