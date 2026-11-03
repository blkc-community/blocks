# BLKC Blocks

Blocks are the atomic AI/ML capabilities published in the BLKC marketplace. Each block folder contains a manifest, implementation stubs, and documentation. Use the CLI to scaffold a new block:

```
bun --bun packages/cli/dist/index.js block create <block-id>
```

Publishing a block updates the global registry stored in `registry/blocks.json`.
