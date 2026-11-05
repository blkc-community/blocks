# BLKC Blocks

Blocks are the atomic AI/ML capabilities published in the BLKC marketplace. Each block folder contains a manifest, implementation stubs, and documentation. Use the CLI to scaffold a new block:

```
bun --bun packages/cli/dist/index.js block create <block-id>
```

Publishing a block updates the global registry stored in `registry/blocks.json`.

## Fork a Block

Every UI Block here has its component in `render.web.tsx`. To make your own version:

```bash
npx @blkc-code/cli@latest new block my-hero --from hero
npx @blkc-code/cli@latest dev
```
