# spaCy NLP

Named-entity recognition plus a rule matcher over a text. Strips named entities out of the text with the `en_core_web_sm` spaCy model, then runs a small set of pattern rules over the token stream to label recurring business patterns:

- organisation + hiring (e.g. "Acme Corp is hiring engineers")
- location + open-role (e.g. "Berlin office of Adobe is hiring")
- money + costs (e.g. "The service costs £500 per month")
- date + project (e.g. "the quarterly earnings report")

The block is deterministic and local — no network, no secrets, no authentication. It needs the `en_core_web_sm` spaCy model (`pip install spacy && python -m spacy download en_core_web_sm`).

## Inputs / Outputs

- **input**: `text` (string, maxLength 4000)
- **output**: `entities` (array of `{ text, label }`) — spans the NER engine found, plus any rule-matcher hits.

## Self-test

Run the held-out eval set with:

    python src/index.py

## License

MIT — BLKC Core Team.
