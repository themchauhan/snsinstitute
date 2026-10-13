'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Icon } from './Icon';

type Item = { href: string; label: string };

export function MobileMenu({ items, menuLabel, closeLabel, cta }: { items: Item[]; menuLabel: string; closeLabel: string; cta: Item }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  // eslint-disable-next-line react-hooks/set-state-in-effect -- close the menu after navigating
  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="xl:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? closeLabel : menuLabel}
        className="grid size-10 place-items-center rounded-lg text-brand-900 hover:bg-brand-50"
      >
        <Icon name={open ? 'close' : 'menu'} className="size-6" />
      </button>
      {open && (
        <nav id="mobile-nav" className="absolute inset-x-0 top-full border-b border-brand-100 bg-surface shadow-lg">
          <ul className="mx-auto max-w-7xl px-4 py-3">
            {items.map((i) => (
              <li key={i.href}>
                <Link href={i.href} className="block rounded-lg px-3 py-3 font-semibold text-brand-900 hover:bg-brand-50">
                  {i.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link href={cta.href} className="btn-accent w-full justify-center">
                {cta.label}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
