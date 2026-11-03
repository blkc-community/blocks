# Hero

Reference **UI Block** for the BLKC v2 spec (`docs/spec-v2.md`).

- `src/props.ts` holds the zod props schema. It is the source of truth.
- `manifest.json` → `props` is the JSON Schema emitted from it with `z.toJSONSchema(HeroPropsSchema, { io: "input" })`. A core test fails if the two drift.
- `manifest.json` → `controls` are the editor fields (like WordPress `block.json` attributes plus inspector controls).
- `manifest.json` → `renderers.web` points at `HeroBlock` in `@blkc-code/render-web`.

## Props

Content — what the section says:

| Prop | Type | Notes |
|---|---|---|
| `eyebrow` | string, ≤60 | small line above the heading |
| `heading` | string, 1–120 | required |
| `subheading` | string, ≤280 | |
| `cta` | `{ label, href }` | primary action |
| `secondaryCta` | `{ label, href }` | rendered as an outline button |
| `image` | `{ src, alt }` | `alt` is required, pass `""` if decorative |

Design — how it sits on the page:

| Prop | Values | Default |
|---|---|---|
| `tone` | `default` · `muted` · `accent` · `inverse` | `default` |
| `size` | `sm` · `md` · `lg` | `md` |
| `align` | `left` · `center` · `right` | `left` |

These are closed enums on purpose. The renderer maps each value to a literal set
of Tailwind classes, so the same Block instance looks at home in every Kit and
Tailwind can see every class at build time. Passing a raw class string in content
produces no CSS — see [Designing a Block](https://github.com/blkc-community/blkc/blob/main/docs/DESIGN.md).

Validate it with:

```sh
bun packages/cli/src/index.ts block validate ../blocks/hero/manifest.json
```
