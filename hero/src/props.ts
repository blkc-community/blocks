import { z } from "zod";

// Source of truth for the hero Block's props. The manifest's `props` field is
// generated from this with z.toJSONSchema(); packages/core tests check they match.

const LinkSchema = z.object({
  label: z.string().min(1).max(40),
  href: z.string().min(1),
});

export const HeroPropsSchema = z.object({
  eyebrow: z.string().max(60).optional(),
  heading: z.string().min(1).max(120),
  subheading: z.string().max(280).optional(),
  cta: LinkSchema.optional(),
  secondaryCta: LinkSchema.optional(),
  image: z
    .object({
      src: z.string().min(1),
      alt: z.string(),
    })
    .optional(),
  align: z.enum(["left", "center"]).default("left"),
});

export type HeroProps = z.infer<typeof HeroPropsSchema>;
