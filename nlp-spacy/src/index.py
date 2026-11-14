"""
NLP (spaCy) — NER + rule matcher.

Strips named entities out of text with the en_core_web_sm model, then runs a
small set of matcher rules over the token stream to label recurring patterns
(organisation + location, pricing, project + date, person + role).

No network call after the model is downloaded; the model is an optional dep.
The block output uses the D5 attribute contract (see the manifest).

Run the held-out eval set with:
  cd blocks/nlp-spacy && python3 src/index.py
"""
from __future__ import annotations

import json
from pathlib import Path

import spacy
from spacy.matcher import Matcher

__here = Path(__file__).resolve().parent
_nlp = spacy.load("en_core_web_sm")
_matcher = Matcher(_nlp.vocab)

# (pattern name, token pattern)
_PATTERNS = {
    "org_hiring": [
        {"POS": "PROPN", "OP": "+"},
        {"LOWER": "is", "OP": "?"},
        {"LOWER": "hiring", "OP": "?"},
        {"POS": "PROPN", "OP": "+"},
    ],
    "org_location": [
        {"POS": "PROPN", "OP": "+"},
        {"LOWER": "is", "OP": "?"},
        {"LOWER": "based", "OP": "?"},
        {"LOWER": "in", "OP": "?"},
        {"POS": "PROPN", "OP": "+"},
    ],
    "price": [
        {"LOWER": "costs", "OP": "?"},
        {"ORTH": "£", "OP": "?"},
        {"LIKE_NUM": True, "OP": "+"},
    ],
    "project_date": [
        {"POS": "PROPN", "OP": "+"},
        {"LOWER": "launches", "OP": "?"},
        {"TEXT": "on", "OP": "?"},
        {"ENT_TYPE": "DATE", "OP": "+"},
    ],
    "person_role": [
        {"POS": "PROPN", "OP": "+"},
        {"LOWER": "is", "OP": "?"},
        {"LOWER": "the", "OP": "?"},
        {"LOWER": "new", "OP": "?"},
        {"LOWER": "CEO", "OP": "?"},
    ],
}

_PROBE_FOR = {
    "org_hiring": "Acme Corp is hiring engineers",
    "org_location": "Acme Corp is based in Berlin",
    "price": "The service costs £500 per month",
    "project_date": "Orbit launches on Tuesday",
    "person_role": "Alice is the new CEO",
}

# spaCy 3.8: Matcher.add() returns None. Record the internal match id per rule
# by running each rule against a probe that only that rule can fire.
_NAME_BY_ID: dict[int, str] = {}
for _name, _pattern in _PATTERNS.items():
    _matcher.add(_name, [_pattern])
    for _match_id, _start, _end in _matcher(_nlp(_PROBE_FOR[_name])):
        _NAME_BY_ID[_match_id] = _name
        break


def run(input: dict) -> dict:
    """D5 attribute contract: { entities: [...], matches: [...] }."""
    text = input.get("text", "")
    doc = _nlp(text)
    entities = [
        {"text": ent.text, "label": ent.label_, "start": ent.start_char, "end": ent.end_char}
        for ent in doc.ents
    ]
    matches = []
    for _match_id, _start, _end in _matcher(doc):
        _span = doc[_start:_end]
        matches.append(
            {
                "patternId": _NAME_BY_ID.get(_match_id, "?"),
                "label": _span.label_,
                "count": 1,
                "span": {"start": _start, "end": _end, "text": _span.text},
            }
        )
    return {"entities": entities, "matches": matches}


if __name__ == "__main__":
    import sys

    eval_path = __here.parent / "eval-set.json"
    if not eval_path.exists():
        print(f"no eval set found at {eval_path}", file=sys.stderr)
        sys.exit(1)

    with eval_path.open(encoding="utf-8") as fh:
        eval_set = json.load(fh)

    rows = []
    for _item in eval_set["items"]:
        _got = run(_item)
        rows.append((_item["text"], _item.get("expected"), _got))

    correct = 0
    total = len(rows)
    for _text, _expected, _got in rows:
        _pred = [
            {"text": e["text"], "label": e["label"]} for e in _got["entities"]
        ]
        _matched = 0
        for _exp in (_expected or []):
            if _exp in _pred:
                _matched += 1
        _correct = _matched
        if _correct == len(_expected or []):
            correct += 1
        print(
            f"{'ok  ' if _correct == len(_expected or []) else 'FAIL'} | expected={_expected} got={_got['entities']} | {_text[:70]}"
        )

    # Exact-span P/R/F1 over entities
    _all_pred = []
    _all_exp = []
    for _text, _expected, _got in rows:
        _all_pred.extend(
            {"text": e["text"], "label": e["label"]} for e in _got["entities"]
        )
        _all_exp.extend(_expected or [])
    _tp = sum(1 for _e in _all_pred if _e in _all_exp)
    _prec = _tp / len(_all_pred) if _all_pred else 0
    _rec = _tp / len(_all_exp) if _all_exp else 0
    _f1 = 2 * _prec * _rec / (_prec + _rec) if (_prec + _rec) else 0

    print(
        f"\nnlp-spacy eval: {total} items, exact-label {correct}/{total}; "
        f"entity P={_prec:.3f} R={_rec:.3f} F1={_f1:.3f}"
    )
    print(
        "metrics: "
        f"accuracy={correct / total:.3f}, entity_f1={_f1:.3f}, "
        f"entity_precision={_prec:.3f}, entity_recall={_rec:.3f}"
    )
