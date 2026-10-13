import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SNS Institute Rewari',
    short_name: 'SNS Institute',
    description: 'IIT-JEE, NEET, Foundation & Class 5–12 coaching in Rewari, Haryana',
    start_url: '/',
    display: 'standalone',
    background_color: '#fbfaf7',
    theme_color: '#26335b',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
