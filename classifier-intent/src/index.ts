import { createHash } from "node:crypto";

export type IntentClassifierInput = {
  text: string;
  intents: string[];
  topK?: number;
};

export type IntentClassifierOutput = {
  rankings: Array<{ intent: string; score: number }>;
  topIntent: { intent: string; score: number } | null;
};

const score = (text: string, intent: string) => {
  const digest = createHash("sha256").update(`${text}:${intent}`).digest();
  return Number((digest[0] / 255).toFixed(3));
};

export const run = async (
  input: IntentClassifierInput
): Promise<IntentClassifierOutput> => {
  if (!input.intents.length) {
    return { rankings: [], topIntent: null };
  }

  const rankings = input.intents
    .map((intent) => ({ intent, score: score(input.text, intent) }))
    .sort((a, b) => b.score - a.score);

  const limit = input.topK ?? rankings.length;
  const truncated = rankings.slice(0, limit);

  return {
    rankings: truncated,
    topIntent: truncated[0] ?? null,
  };
};
