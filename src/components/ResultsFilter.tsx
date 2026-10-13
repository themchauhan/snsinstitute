'use client';

import { useState } from 'react';

type Item = { key: string; cat: string; el: React.ReactNode };
type Group = { year: number; items: Item[] };

/** Exam-category chips that filter the year-wise result cards (cards are rendered on the server). */
export function ResultsFilter({
  groups,
  cats,
  allLabel,
  emptyLabel,
}: {
  groups: Group[];
  cats: { value: string; label: string; count: number }[];
  allLabel: string;
  emptyLabel: string;
}) {
  const [active, setActive] = useState('all');
  const visible = groups
    .map((g) => ({ ...g, items: g.items.filter((i) => active === 'all' || i.cat === active) }))
    .filter((g) => g.items.length > 0);
  const total = cats.reduce((n, c) => n + c.count, 0);

  return (
    <div>
      {cats.length > 1 && (
        <div role="toolbar" aria-label="Filter results" className="flex flex-wrap gap-2">
          {[{ value: 'all', label: allLabel, count: total }, ...cats].map((c) => (
            <button
              key={c.value}
              type="button"
              aria-pressed={active === c.value}
              onClick={() => setActive(c.value)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                active === c.value ? 'bg-brand-900 text-white' : 'bg-surface text-brand-800 ring-1 ring-ink-200 hover:bg-brand-50'
              }`}
            >
              {c.label} <span className="opacity-60">({c.count})</span>
            </button>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <p className="mt-8 text-ink-600">{emptyLabel}</p>
      ) : (
        visible.map((g) => (
          <div key={g.year} className="mt-10">
            <h3 className="flex items-center gap-3 font-display text-2xl font-extrabold text-brand-950">
              {g.year}
              <span className="h-px flex-1 bg-ink-200" />
            </h3>
            <div className="mt-5 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
              {g.items.map((i) => (
                <div key={i.key}>{i.el}</div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
