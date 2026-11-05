// Your copy of this Block. Change anything: it is yours now.
// Tailwind classes work as written, and `blkc dev` shows your changes as you save.

import type { ReactNode } from "react";
import { clsx, richTextToHtml } from "@blkc-code/render-web";
import type { BlockProps, RichText } from "@blkc-code/render-web";

interface ImageValue {
  src: string;
  alt: string;
}

const BAND = "w-full px-4 py-16 sm:py-20";

const HEADING = "text-3xl font-bold tracking-tight sm:text-4xl";

interface StoryProps {
  heading: string;
  body?: RichText;
  image?: ImageValue;
  imageSide?: "left" | "right";
}

function StoryBlock({ props: p, className, style }: BlockProps<StoryProps>): ReactNode {
  const body = richTextToHtml(p.body);
  return (
    <section className={clsx("blkc-story", BAND, className)} style={style}>
      <div className="mx-auto grid w-full max-w-blkc items-center gap-10 md:grid-cols-2">
        <div className={clsx("flex flex-col gap-4", p.imageSide === "left" && "md:order-2")}>
          <h2 className={HEADING}>{p.heading}</h2>
          {body && <div className="flex flex-col gap-3 leading-relaxed" dangerouslySetInnerHTML={{ __html: body }} />}
        </div>
        {p.image && (
          <img src={p.image.src} alt={p.image.alt} className="h-auto w-full rounded-lg object-cover" />
        )}
      </div>
    </section>
  );
}

export default StoryBlock;
