// Your copy of this Block. Change anything: it is yours now.
// Tailwind classes work as written, and `blkc dev` shows your changes as you save.

import type { ReactNode } from "react";
import { clsx, isExternalUrl, normalizeUrl } from "@blkc-code/render-web";
import type { BlockProps, ButtonProps } from "@blkc-code/render-web";

/**
 * Button Block component.
 * Renders a button or link with configurable styling.
 */
function ButtonBlock({ props: p, className, style }: BlockProps<ButtonProps>): ReactNode {
  const {
    label,
    href,
    variant = "primary",
    size = "md",
    alignment = "center",
    target,
    icon,
    iconPosition = "left",
  } = p;

  const hrefUrl = normalizeUrl(href);
  const isExternal = isExternalUrl(hrefUrl);

  const sizeClass =
    size === "sm" ? "px-3 py-1.5 text-sm" : size === "lg" ? "px-7 py-3.5 text-lg" : "px-5 py-2.5 text-base";
  const variantClass =
    variant === "secondary"
      ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
      : variant === "outline"
        ? "border border-border bg-background text-foreground hover:bg-muted"
        : variant === "ghost"
          ? "text-foreground hover:bg-muted"
          : variant === "link"
            ? "text-primary underline-offset-4 hover:underline"
            : "bg-primary text-primary-foreground hover:bg-primary/90";

  return (
    <div className={clsx("flex px-6 py-4", alignment === "left" ? "justify-start" : alignment === "right" ? "justify-end" : "justify-center")}>
      <a
        href={hrefUrl || "#"}
        className={clsx(
          "blkc-button inline-flex items-center justify-center gap-2 rounded-lg font-semibold no-underline shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          sizeClass,
          variantClass,
          className,
        )}
        style={style}
        target={target}
        rel={isExternal ? "noopener noreferrer" : undefined}
      >
        {icon && iconPosition === "left" && (
          <span className="blkc-button-icon blkc-button-icon-left">{icon}</span>
        )}
        <span className="blkc-button-label">{label}</span>
        {icon && iconPosition === "right" && (
          <span className="blkc-button-icon blkc-button-icon-right">{icon}</span>
        )}
      </a>
    </div>
  );
}

export default ButtonBlock;
