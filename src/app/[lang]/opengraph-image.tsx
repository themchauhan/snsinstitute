import { ImageResponse } from 'next/og';

export const alt = 'SNS Institute Rewari – IIT-JEE, NEET, Foundation & Class 5–12 Coaching';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'hi' }];
}

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 80, background: '#26335b', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ fontSize: 120, fontWeight: 900, letterSpacing: -4 }}>SNS</div>
          <div style={{ display: 'flex', flexDirection: 'column', fontSize: 44, fontWeight: 700, lineHeight: 1.05 }}>
            <span>INSTITUTE</span>
            <span style={{ color: '#ee9c7e' }}>REWARI</span>
          </div>
        </div>
        <div style={{ marginTop: 30, fontSize: 46, fontWeight: 700 }}>IIT-JEE • NEET • Foundation • Class 5–12</div>
        <div style={{ marginTop: 18, fontSize: 30, color: '#c8d3ee' }}>Gopal Dev Chowk, Narnaul Road, Rewari, Haryana</div>
        <div style={{ marginTop: 40, display: 'flex', fontSize: 30, background: '#e07a5f', borderRadius: 999, padding: '14px 34px', alignSelf: 'flex-start' }}>
          Book a Free Demo Class
        </div>
      </div>
    ),
    size,
  );
}
