# Intent Classifier

Scores text against a list of intent labels. This stub uses deterministic hashing so results are predictable across runs.

## Usage

```ts
import { run } from "./blocks/classifier-intent/src";

const result = await run({
  text: "Request a product demo",
  intents: ["sales", "support", "billing"],
  topK: 2,
});
```

Outputs include ranked intents and the best match.
