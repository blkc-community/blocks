// Your copy of this Block. Change anything: it is yours now.
// Tailwind classes work as written, and `blkc dev` shows your changes as you save.

import type { ReactNode } from "react";
import { clsx, normalizeUrl } from "@blkc-code/render-web";
import type { BlockProps } from "@blkc-code/render-web";

interface LinkValue {
  label: string;
  href: string;
}

interface CardItem {
  title: string;
  text?: string;
  link?: LinkValue;
}

const BAND = "w-full px-6 py-16 sm:py-24";

const INNER = "mx-auto flex w-full max-w-blkc flex-col gap-8";

const HEADING = "blkc-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl";

const LEAD = "max-w-2xl text-lg text-muted-foreground text-pretty";

function CardGrid({ items, showLinks, surface }: { items: CardItem[]; showLinks: boolean; surface: string }): ReactNode {
  return (
    <ul className="grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <li key={index} className={clsx("flex flex-col gap-3 rounded-xl border border-border p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md", surface)}>
          <h3 className="text-xl font-semibold">{item.title}</h3>
          {item.text && <p className="text-muted-foreground">{item.text}</p>}
          {showLinks && item.link && (
            <a href={normalizeUrl(item.link.href)} className="mt-auto font-medium text-primary underline-offset-4 hover:underline">
              {item.link.label}
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}

interface ServicesProps {
  heading: string;
  intro?: string;
  items?: CardItem[];
}

function ServicesBlock({ props: p, className, style }: BlockProps<ServicesProps>): ReactNode {
  return (
    <section className={clsx("blkc-services", BAND, className)} style={style}>
      <div className={INNER}>
        <h2 className={HEADING}>{p.heading}</h2>
        {p.intro && <p className={LEAD}>{p.intro}</p>}
        <CardGrid items={p.items ?? []} showLinks surface="bg-muted" />
      </div>
    </section>
  );
}

export default ServicesBlock;
