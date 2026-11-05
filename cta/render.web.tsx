// Your copy of this Block. Change anything: it is yours now.
// Tailwind classes work as written, and `blkc dev` shows your changes as you save.

import type { ReactNode } from "react";
import { clsx, normalizeUrl } from "@blkc-code/render-web";
import type { BlockProps } from "@blkc-code/render-web";

interface LinkValue {
  label: string;
  href: string;
}

const BAND = "w-full px-4 py-16 sm:py-20";

const INNER = "mx-auto flex w-full max-w-blkc flex-col gap-8";

const HEADING = "text-3xl font-bold tracking-tight sm:text-4xl";

const BUTTON =
  "inline-flex w-fit items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

interface CtaProps {
  heading: string;
  text?: string;
  cta?: LinkValue;
}

function CtaBlock({ props: p, className, style }: BlockProps<CtaProps>): ReactNode {
  return (
    <section className={clsx("blkc-cta bg-accent text-accent-foreground", BAND, className)} style={style}>
      <div className={clsx(INNER, "items-center text-center")}>
        <h2 className={HEADING}>{p.heading}</h2>
        {p.text && <p className="max-w-2xl text-lg">{p.text}</p>}
        {p.cta && (
          <a href={normalizeUrl(p.cta.href)} className={BUTTON}>
            {p.cta.label}
          </a>
        )}
      </div>
    </section>
  );
}

export default CtaBlock;
