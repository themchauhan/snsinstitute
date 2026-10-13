'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';

type Slide = { src: string; caption: string };

/**
 * Swipeable photo slider: native scroll-snap (smooth on phones), arrow buttons, dots,
 * and gentle autoplay that pauses on hover/touch and respects "reduce motion".
 */
export function ImageSlider({ slides, interval = 5000, labels }: { slides: Slide[]; interval?: number; labels: { prev: string; next: string } }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((i: number) => {
    const el = track.current;
    if (!el) return;
    const n = (i + slides.length) % slides.length;
    el.scrollTo({ left: n * el.clientWidth, behavior: 'smooth' });
  }, [slides.length]);

  // Keep the active dot in sync with manual swipes.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => setIndex(Math.round(el.scrollLeft / el.clientWidth));
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => goTo(index + 1), interval);
    return () => clearInterval(id);
  }, [index, paused, interval, goTo, slides.length]);

  if (slides.length === 0) return null;

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carousel"
      aria-label="Photos"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        ref={track}
        className="flex snap-x snap-mandatory overflow-x-auto rounded-[2rem] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((s, i) => (
          <figure
            key={s.src}
            className="relative aspect-[4/3] w-full shrink-0 snap-center sm:aspect-[16/9]"
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${slides.length}`}
          >
            <Image src={s.src} alt={s.caption} fill priority={i === 0} sizes="(min-width:1280px) 1200px, 100vw" className="object-cover" />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-5 pt-12 pb-5 font-semibold text-white sm:px-8 sm:text-lg">
              {s.caption}
            </figcaption>
          </figure>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label={labels.prev}
            className="absolute top-1/2 left-3 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-surface/90 text-brand-900 shadow-md transition hover:bg-surface"
          >
            <Icon name="arrow" className="size-5 rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label={labels.next}
            className="absolute top-1/2 right-3 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-surface/90 text-brand-900 shadow-md transition hover:bg-surface"
          >
            <Icon name="arrow" className="size-5" />
          </button>
          <div className="mt-4 flex justify-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.src}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`${i + 1}`}
                aria-current={i === index}
                className={`h-2.5 rounded-full transition-all ${i === index ? 'w-8 bg-accent-500' : 'w-2.5 bg-ink-300 hover:bg-ink-500'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
