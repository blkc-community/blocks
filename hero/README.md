# Hero

Reference **UI Block** for the BLKC v2 spec (`docs/spec-v2.md`).

- `src/props.ts` holds the zod props schema. It is the source of truth.
- `manifest.json` → `props` is the JSON Schema emitted from it with `z.toJSONSchema(HeroPropsSchema, { io: "input" })`. A core test fails if the two drift.
- `manifest.json` → `controls` are the editor fields (like WordPress `block.json` attributes plus inspector controls).
- `manifest.json` → `renderers.web` points at `Hero` in `@blkc-code/render-web`. That package doesn't exist yet, so this Block has no renderer code.

Validate it with:

```sh
bun packages/cli/src/index.ts block publish hero --dry-run
```
