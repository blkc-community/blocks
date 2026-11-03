import { createHash } from "node:crypto";

const VECTOR_SIZE = 16;
const MODEL_NAME = "bge-small-stub";

export type BGESmallEmbedderInput = {
  text: string;
};

export type BGESmallEmbedderOutput = {
  model: string;
  dimensions: number;
  embedding: number[];
};

const toUnitRange = (byte: number) => Number(((byte / 255) * 2 - 1).toFixed(6));

export const run = async (
  input: BGESmallEmbedderInput
): Promise<BGESmallEmbedderOutput> => {
  const digest = createHash("sha256").update(input.text).digest();
  const embedding = Array.from({ length: VECTOR_SIZE }, (_, index) =>
    toUnitRange(digest[index % digest.length])
  );

  return {
    model: MODEL_NAME,
    dimensions: VECTOR_SIZE,
    embedding,
  };
};
