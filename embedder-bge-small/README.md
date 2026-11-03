# BGE Small Embedder

Generates deterministic mock embeddings that mirror the interface of the BGE-small model. The implementation is intentionally lightweight so it can be used for demos, contracts, and integration tests without requiring a heavy model download.

## Interface

```ts
import { run } from "./blocks/embedder-bge-small/src";

const { embedding, model } = await run({ text: "hello world" });
```

- `embedding`: Array of 16 numbers in the range [-1, 1].
- `model`: Always `bge-small-stub`.
- `dimensions`: Useful for chaining downstream components.

## Notes

- Output is derived from a SHA-256 hash, ensuring deterministic behaviour.
- Swap this stub with a production embedder by aligning on the manifest contract.
