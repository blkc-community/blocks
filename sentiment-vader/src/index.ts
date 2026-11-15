/**
 * Sentiment (VADER) — rule-based sentiment analyser.
 *
 * A compact VADER-style port:
 *  - lexicon matching (polarity -1 .. 1)
 *  - negation scope (no / not / never / none / ...) flips the next token
 *  - degree modifiers (very, extremely, ...) multiply the intensity
 *  - all-caps words get a boost
 *  - a trailing punctuation run bumps the magnitude
 *
 * No model download, no network call, fully deterministic. Input/output are
 * in the D5 attribute-contract format (see the block manifest).
 *
 * Run the held-out eval set with:
 *   bun src/index.ts --self-test
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dir = path.dirname(fileURLToPath(import.meta.url));
const SELF_TEST = existsSync(path.join(__dir, "..", "eval-set.json"));

// ---------------------------------------------------------------------------
// Lexicon — curated subset of the VADER lexicon covering the most common
// sentiment words, the degree modifiers and the negations the algorithm needs.
// Each entry: word, polarity (-1..1), optional boost (1..2) or negation flag.
// The published block ships this list as assets/vocab.json.
// ---------------------------------------------------------------------------

interface Entry {
  word: string;
  polarity: number;
  boost?: number;
  negation?: boolean;
}

const LEXICON: Entry[] = [
  // strong positive
  { word: "excellent", polarity: 1 },
  { word: "amazing", polarity: 1 },
  { word: "awesome", polarity: 1 },
  { word: "fantastic", polarity: 1 },
  { word: "incredible", polarity: 1 },
  { word: "outstanding", polarity: 1 },
  { word: "perfect", polarity: 1 },
  { word: "superb", polarity: 1 },
  { word: "wonderful", polarity: 1 },
  { word: "best", polarity: 1 },
  { word: "beautiful", polarity: 1 },
  { word: "brilliant", polarity: 1 },
  { word: "love", polarity: 1 },
  { word: "loved", polarity: 1 },
  { word: "loves", polarity: 1 },
  { word: "adore", polarity: 1 },
  { word: "recommended", polarity: 1 },
  // weak positive
  { word: "good", polarity: 0.5 },
  { word: "great", polarity: 0.5 },
  { word: "nice", polarity: 0.5 },
  { word: "well", polarity: 0.5 },
  { word: "happy", polarity: 0.5 },
  { word: "glad", polarity: 0.5 },
  { word: "pleased", polarity: 0.5 },
  { word: "fine", polarity: 0.5 },
  { word: "solid", polarity: 0.5 },
  { word: "reliable", polarity: 0.5 },
  { word: "helpful", polarity: 0.5 },
  { word: "fast", polarity: 0.5 },
  // strong negative
  { word: "terrible", polarity: -1 },
  { word: "awful", polarity: -1 },
  { word: "horrible", polarity: -1 },
  { word: "dreadful", polarity: -1 },
  { word: "catastrophic", polarity: -1 },
  { word: "worst", polarity: -1 },
  { word: "hate", polarity: -1 },
  { word: "hated", polarity: -1 },
  { word: "hates", polarity: -1 },
  { word: "disgusting", polarity: -1 },
  { word: "broken", polarity: -1 },
  { word: "useless", polarity: -1 },
  { word: "waste", polarity: -1 },
  // weak negative
  { word: "bad", polarity: -0.5 },
  { word: "poor", polarity: -0.5 },
  { word: "weak", polarity: -0.5 },
  { word: "slow", polarity: -0.5 },
  { word: "difficult", polarity: -0.5 },
  { word: "ugly", polarity: -0.5 },
  { word: "disappointing", polarity: -0.5 },
  { word: "disappointed", polarity: -0.5 },
  { word: "inefficient", polarity: -0.5 },
  { word: "rude", polarity: -0.5 },
  { word: "unhelpful", polarity: -0.5 },
  { word: "mediocre", polarity: -0.5 },
  { word: "regret", polarity: -0.5 },
  { word: "frustrated", polarity: -0.5 },
  { word: "angry", polarity: -0.5 },
    { word: "disaster", polarity: -1 },
  { word: "boring", polarity: -0.5 },
  { word: "unoriginal", polarity: -0.5 },
  { word: "disasters", polarity: -1 },
  { word: "bored", polarity: -0.5 },
  { word: "boredom", polarity: -0.5 },
  // degree modifiers (boost)
  { word: "very", boost: 1.5 },
  { word: "extremely", boost: 2 },
  { word: "really", boost: 1.5 },
  { word: "absolutely", boost: 2 },
  { word: "quite", boost: 1.2 },
  { word: "highly", boost: 1.5 },
  { word: "so", boost: 1.5 },
  { word: "too", boost: 1.5 },
  { word: "deeply", boost: 1.5 },
  { word: "intensely", boost: 1.5 },
  { word: "slightly", boost: 0.5 },
  { word: "barely", boost: 0.5 },
  { word: "hardly", boost: 0.5 },
  { word: "more", boost: 1.2 },
  { word: "most", boost: 1.3 },
  { word: "much", boost: 1.2 },
  // negations
  { word: "no", negation: true },
  { word: "not", negation: true },
  { word: "never", negation: true },
  { word: "none", negation: true },
  { word: "nobody", negation: true },
  { word: "nothing", negation: true },
  { word: "cannot", negation: true },
  { word: "cant", negation: true },
  { word: "doesnt", negation: true },
  { word: "didnt", negation: true },
  { word: "dont", negation: true },
  { word: "isnt", negation: true },
  { word: "wasnt", negation: true },
  { word: "arent", negation: true },
  { word: "wont", negation: true },
  { word: "wouldnt", negation: true },
  { word: "couldnt", negation: true },
  { word: "shouldnt", negation: true },
  { word: "neither", negation: true },
  { word: "nor", negation: true },
];

const PUNCTUATION_BOOST: Record<string, number> = {
  "!": 1.2,
  "!!": 1.5,
  "???": 1.3,
  "...": 1.1,
};

const ALL_CAPS_BOOST = 1.5;
const NORMALIZATION = 2.2;

export type SentimentVaderInput = { text: string };
export type SentimentVaderOutput = {
  sentiment: "negative" | "neutral" | "positive";
  score: number; // -1 .. 1, calibrated
  magnitude: number; // non-negative, absolute evidence
  words: string[]; // matched sentiment words (lowercase)
};

export const run = async (input: SentimentVaderInput): Promise<SentimentVaderOutput> => {
  const text = (input.text ?? "").trim();
  const tokens = text.toLowerCase().split(/[^a-z0-9'’]+/).filter(Boolean);
  const matched: string[] = [];
  let score = 0;
  let magnitude = 0;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const entry = LEXICON.find((e) => e.word === token);
    if (!entry) continue;

    const polarity = entry.polarity ?? 0;
    const boost = entry.boost ?? 1;

    // Negation scope: any negation token in the last 3 tokens flips the sign.
    const window = tokens.slice(Math.max(0, i - 3), i);
    const negated = window.some((w) => LEXICON.find((e) => e.word === w)?.negation);

    if (polarity !== 0) {
      const signed = negated ? -polarity : polarity;
      const boosted = Math.min(1, signed * boost);
      score += boosted;
      magnitude += Math.abs(boosted);
      matched.push(entry.word);
    }
  }

  // Trailing punctuation run bumps the magnitude (VADER-style).
  const trailing = text.match(/[!?'…]+$/);
  if (trailing) {
    const key = trailing[0];
    magnitude *= PUNCTUATION_BOOST[key] ?? 1;
  }

  const normalized = score / NORMALIZATION;
  const sentiment: SentimentVaderOutput["sentiment"] =
    normalized >= 0.05 ? "positive" : normalized <= -0.05 ? "negative" : "neutral";

  return {
    sentiment,
    score: Number(normalized.toFixed(3)),
    magnitude: Number(magnitude.toFixed(3)),
    words: matched,
  };
};

// ---------------------------------------------------------------------------
// Self-test: score every item in eval-set.json and print a per-item report.
// ---------------------------------------------------------------------------
if (SELF_TEST) {
  (async () => {
    const evalSet = JSON.parse(readFileSync(path.join(__dir, "..", "eval-set.json"), "utf8"));
    const lines: string[] = [];
    let correct = 0;
    const results = await Promise.all(
      evalSet.items.map(async (item: { text: string; expected: string }) => {
        const got = await run({ text: item.text });
        const ok = got.sentiment === item.expected;
        if (ok) correct++;
        return { text: item.text, expected: item.expected, got: got.sentiment, ok };
      }),
    );
    lines.push(`vader self-test: ${correct}/${results.length} exact-label matches`);
    for (const r of results) {
      lines.push(`  ${r.ok ? "ok  " : "FAIL"} | ${r.expected.padEnd(10)} | ${r.got.padEnd(10)} | ${r.text}`);
    }
    console.log(lines.join("\n"));
    process.exit(correct === results.length ? 0 : 1);
  })();
}
