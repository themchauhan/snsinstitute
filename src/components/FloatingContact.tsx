import { Icon } from './Icon';

/** Sticky WhatsApp + Call buttons – the main lead source on mobile. */
export function FloatingContact({ whatsapp, phone, labels }: { whatsapp?: string; phone?: string; labels: { call: string; whatsapp: string } }) {
  const wa = whatsapp?.replace(/\D/g, '');
  const msg = encodeURIComponent('Hello SNS Institute, I want to know about admission.');
  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-3">
      {wa && (
        <a
          href={`https://wa.me/${wa}?text=${msg}`}
          target="_blank"
          rel="noopener"
          aria-label={labels.whatsapp}
          className="grid size-14 place-items-center rounded-full bg-whatsapp text-white shadow-lg ring-4 ring-surface transition hover:scale-105"
        >
          <Icon name="whatsapp" className="size-8" />
        </a>
      )}
      {phone && (
        <a
          href={`tel:+91${phone.replace(/\D/g, '').slice(-10)}`}
          aria-label={labels.call}
          className="grid size-14 place-items-center rounded-full bg-accent-500 text-white shadow-lg ring-4 ring-surface transition hover:scale-105 sm:hidden"
        >
          <Icon name="phone" className="size-6" />
        </a>
      )}
    </div>
  );
}
