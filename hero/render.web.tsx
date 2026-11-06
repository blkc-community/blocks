// Your copy of this Block. Change anything: it is yours now.
// Tailwind classes work as written, and `blkc dev` shows your changes as you save.

import type { ReactNode } from "react";
import { clsx, normalizeUrl } from "@blkc-code/render-web";
import type { BlockProps, BlockSize, BlockTone, HeroProps } from "@blkc-code/render-web";

// ============================================================================
// Default Block Components
// ============================================================================

/**
 * Tone → Tailwind classes.
 *
 * Literal strings, deliberately: Tailwind only generates classes it can see in
 * the source. A template string built from content (`bg-${tone}-500`) produces
 * no CSS at all.
 */
const HERO_TONE_CLASSES: Record<BlockTone, string> = {
  default: "bg-background text-foreground bg-[radial-gradient(60rem_30rem_at_50%_-10%,color-mix(in_srgb,var(--blkc-color-primary,#0066cc)_16%,transparent),transparent)]",
  muted: "bg-muted text-foreground",
  accent: "bg-accent text-accent-foreground",
  inverse: "bg-foreground text-background",
};

/**
 * Size → vertical rhythm and type scale. One decision instead of four.
 */
const HERO_SIZE_CLASSES: Record<
  BlockSize,
  { section: string; gap: string; heading: string; subheading: string; eyebrow: string }
> = {
  sm: {
    section: "py-10",
    gap: "gap-3",
    heading: "text-3xl sm:text-4xl",
    subheading: "text-base sm:text-lg",
    eyebrow: "text-xs",
  },
  md: {
    section: "py-16",
    gap: "gap-4",
    heading: "text-4xl sm:text-5xl",
    subheading: "text-lg sm:text-xl",
    eyebrow: "text-sm",
  },
  lg: {
    section: "py-24",
    gap: "gap-6",
    heading: "text-5xl sm:text-6xl",
    subheading: "text-xl sm:text-2xl",
    eyebrow: "text-sm",
  },
};

/**
 * Hero Block component.
 *
 * Content and design are separate inputs. `tone`, `size` and `align` are closed
 * enums the manifest can offer as editor controls; the raw style props are
 * escape hatches for a single site, not the normal way to design a page.
 */
function HeroBlock({ props: p, className, style }: BlockProps<HeroProps>): ReactNode {
  const {
    eyebrow,
    heading,
    subheading,
    cta,
    secondaryCta,
    image,
    align,
    textAlign,
    tone = "default",
    size = "md",
    backgroundColor,
    textColor,
    padding,
    minHeight,
  } = p;

  const alignment = align ?? textAlign ?? "left";
  const alignClass =
    alignment === "center"
      ? "text-center items-center"
      : alignment === "right"
        ? "text-right items-end"
        : "text-left items-start";
  const ctaJustify =
    alignment === "center" ? "justify-center" : alignment === "right" ? "justify-end" : "justify-start";

  // Unknown values fall back to the default rather than being interpolated, so a
  // hand-edited JSON file cannot smuggle arbitrary classes into the page.
  const toneClass = HERO_TONE_CLASSES[tone] ?? HERO_TONE_CLASSES.default;
  const scale = HERO_SIZE_CLASSES[size] ?? HERO_SIZE_CLASSES.md;

  const ctaClass = (variant: "primary" | "secondary" | "outline" = "primary"): string =>
    clsx(
      "inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-base font-semibold no-underline shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      variant === "secondary"
        ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        : variant === "outline"
          ? "border border-border bg-background text-foreground hover:bg-muted"
          : "bg-primary text-primary-foreground hover:bg-primary/90",
    );

  return (
    <section
      className={clsx(
        "blkc-hero relative flex w-full flex-col justify-center px-6",
        scale.section,
        toneClass,
        alignClass,
        className,
      )}
      style={{
        padding,
        minHeight,
        backgroundColor: backgroundColor || undefined,
        color: textColor || undefined,
        ...style,
      }}
    >
      {image && (
        <div className="w-full max-w-5xl">
          <img
            src={image.src}
            alt={image.alt || heading}
            className="h-auto w-full rounded-lg object-cover"
          />
        </div>
      )}

      <div className={clsx("flex w-full max-w-3xl flex-col", scale.gap)}>
        {eyebrow && (
          <p className={clsx("w-fit rounded-full border border-border bg-muted px-3 py-1 font-semibold uppercase tracking-wide", alignment === "center" && "mx-auto", alignment === "right" && "ml-auto", scale.eyebrow)}>
            {eyebrow}
          </p>
        )}

        <h1 className={clsx("blkc-heading font-bold leading-[1.1] tracking-tight text-balance", scale.heading)}>
          {heading}
        </h1>

        {subheading && (
          <p className={clsx("text-muted-foreground text-pretty", scale.subheading)}>{subheading}</p>
        )}

        {(cta || secondaryCta) && (
          <div className={clsx("flex flex-wrap items-center gap-3", ctaJustify)}>
            {cta && (
              <a
                href={normalizeUrl(cta.href)}
                className={ctaClass(cta.variant)}
                target={cta.target || "_self"}
                rel={cta.target === "_blank" ? "noopener noreferrer" : undefined}
              >
                {cta.label}
              </a>
            )}
            {secondaryCta && (
              <a
                href={normalizeUrl(secondaryCta.href)}
                className={ctaClass(secondaryCta.variant ?? "outline")}
                target={secondaryCta.target || "_self"}
                rel={secondaryCta.target === "_blank" ? "noopener noreferrer" : undefined}
              >
                {secondaryCta.label}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default HeroBlock;
