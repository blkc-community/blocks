# VADER Sentiment

Rule-based sentiment analyser (VADER-style). Scores text for sentiment polarity using a curated subset of the VADER lexicon:

- lexicon matching (polarity -1..1)
- negation scope (no / not / never / none / ... flips the next token)
- degree modifiers (very, extremely, ... multiply the intensity)
- all-caps words get a boost
- trailing punctuation run bumps the magnitude

No model download, no network call, fully deterministic. Run the held-out eval set with:

    bun src/index.ts --self-test

## Inputs / Outputs

- **input**: `text` (string, maxLength 4000)
- **output**: `sentiment` ("negative" | "neutral" | "positive"), `score` (-1..1), `magnitude` (non-negative), `words` (matched tokens)

## License

MIT — BLKC Core Team.
