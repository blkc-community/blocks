// Your copy of this Block. Change anything: it is yours now.
// Tailwind classes work as written, and `blkc dev` shows your changes as you save.

import type { ReactNode } from "react";
import { clsx, normalizeUrl } from "@blkc-code/render-web";
import type { BlockProps, ImageProps } from "@blkc-code/render-web";

/**
 * Image Block component.
 * Renders an image with optional caption and link.
 */
function ImageBlock({ props: p, className, style }: BlockProps<ImageProps>): ReactNode {
  const {
    src,
    alt,
    width,
    height,
    objectFit = "cover",
    borderRadius,
    caption,
    link,
    alignment = "center",
  } = p;

  const alignClass =
    alignment === "left"
      ? "mr-auto"
      : alignment === "right"
        ? "ml-auto"
        : "mx-auto";
  const imageUrl = normalizeUrl(src);

  const imageElement = (
    <img
      src={imageUrl}
      alt={alt}
      className="blkc-image-img block h-auto max-w-full"
      style={{
        width: width || "100%",
        height: height || "auto",
        objectFit,
        borderRadius: borderRadius || undefined,
        ...style,
      }}
    />
  );

  const content = link ? (
    <a
      href={normalizeUrl(link)}
      className="blkc-image-link inline-block"
      target="_blank"
      rel="noopener noreferrer"
    >
      {imageElement}
    </a>
  ) : (
    imageElement
  );

  return (
    <figure className={clsx("blkc-image flex w-full flex-col gap-2", alignClass, className)}>
      <div className="blkc-image-wrapper w-full">{content}</div>
      {caption && (
        <figcaption className="blkc-image-caption text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export default ImageBlock;
