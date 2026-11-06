// Your copy of this Block. Change anything: it is yours now.
// Tailwind classes work as written, and `blkc dev` shows your changes as you save.

import type { ReactNode } from "react";
import { clsx, richTextToHtml } from "@blkc-code/render-web";
import type { BlockProps, RichText, SectionProps } from "@blkc-code/render-web";

/**
 * Section Block component.
 * Renders a container/wrapper for other Blocks.
 */
function SectionBlock({ props: p, className, style, children }: BlockProps<SectionProps>): ReactNode {
  const {
    backgroundColor,
    textColor,
    padding,
    margin,
    minHeight,
    alignment = "center",
  } = p;

  const widthClass =
    alignment === "wide" ? "w-full max-w-blkc" : alignment === "full" ? "w-full" : "w-full";

  return (
    <section
      className={clsx(
        "blkc-section text-foreground", !padding && "px-6 py-16",
        widthClass,
        alignment === "wide" && "mx-auto",
        className
      )}
      style={{
        padding,
        margin,
        minHeight,
        backgroundColor: backgroundColor || undefined,
        color: textColor || undefined,
        ...style,
      }}
    >
      <div className="blkc-section-content mx-auto flex w-full max-w-blkc flex-col gap-6">
        {p.heading && <h2 className="blkc-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl">{p.heading}</h2>}
        {p.content && (
          <div className="max-w-3xl text-lg leading-relaxed text-muted-foreground" dangerouslySetInnerHTML={{ __html: richTextToHtml(p.content as RichText) }} />
        )}
        {children}
      </div>
    </section>
  );
}

export default SectionBlock;
