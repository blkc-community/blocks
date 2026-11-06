// Your copy of this Block. Change anything: it is yours now.
// Tailwind classes work as written, and `blkc dev` shows your changes as you save.

import type { ReactNode } from "react";
import { clsx } from "@blkc-code/render-web";
import type { BlockProps } from "@blkc-code/render-web";

const BAND = "w-full px-6 py-16 sm:py-24";

const INNER = "mx-auto flex w-full max-w-blkc flex-col gap-8";

const HEADING = "blkc-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl";

const LEAD = "max-w-2xl text-lg text-muted-foreground text-pretty";

interface ContactProps {
  heading: string;
  intro?: string;
  email?: string;
  phone?: string;
  address?: string;
}

/** Contact details only: a form needs a server, which is a capability Block's job. */
function ContactBlock({ props: p, className, style }: BlockProps<ContactProps>): ReactNode {
  return (
    <section className={clsx("blkc-contact", BAND, className)} style={style}>
      <div className={INNER}>
        <h2 className={HEADING}>{p.heading}</h2>
        {p.intro && <p className={LEAD}>{p.intro}</p>}
        <address className="grid gap-4 not-italic sm:grid-cols-2 lg:grid-cols-3 [&>*]:rounded-xl [&>*]:border [&>*]:border-border [&>*]:bg-muted [&>*]:p-6 [&>*]:font-medium [&>*]:shadow-sm">
          {p.email && <a href={`mailto:${encodeURI(p.email)}`} className="text-primary underline-offset-4 hover:underline">{p.email}</a>}
          {p.phone && <a href={`tel:${p.phone.replace(/[^+\d]/g, "")}`} className="text-primary underline-offset-4 hover:underline">{p.phone}</a>}
          {p.address && <span>{p.address}</span>}
        </address>
      </div>
    </section>
  );
}

export default ContactBlock;
