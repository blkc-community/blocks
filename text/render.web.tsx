// Your copy of this Block. Change anything: it is yours now.
// Tailwind classes work as written, and `blkc dev` shows your changes as you save.

import React, { type ReactNode } from "react";
import { clsx, richTextToHtml } from "@blkc-code/render-web";
import type { BlockProps, RichText, TextProps } from "@blkc-code/render-web";

/**
 * Text Block component.
 * Renders a text element with configurable tag and styling.
 */
function TextBlock({ props: p, className, style }: BlockProps<TextProps>): ReactNode {
  const {
    content,
    tag = "p",
    color,
    backgroundColor,
    fontSize,
    fontWeight,
    textAlign,
    margin,
    padding,
  } = p;

  const alignClass =
    textAlign === "left"
      ? "text-left"
      : textAlign === "right"
        ? "text-right"
        : textAlign === "center"
          ? "text-center"
          : undefined;

  // Security: If tag is not a safe element, default to div
  const safeTag = ["p", "div", "span", "h1", "h2", "h3", "h4", "h5", "h6"].includes(tag)
    ? tag
    : "div";
  const SafeTag = safeTag as React.ElementType;

  return (
    <SafeTag
      className={clsx("blkc-text mx-auto w-full max-w-3xl px-6 py-8 text-lg leading-relaxed text-pretty [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_p+p]:mt-4", alignClass, className)}
      style={{
        margin,
        padding,
        color: color || undefined,
        backgroundColor: backgroundColor || undefined,
        fontSize: fontSize || undefined,
        fontWeight: fontWeight || undefined,
        textAlign: textAlign || undefined,
        ...style,
      }}
      dangerouslySetInnerHTML={{ __html: richTextToHtml(content as RichText) }}
    />
  );
}

export default TextBlock;
