export type SampleBlockInput = { text: string };
export type SampleBlockOutput = { ok: boolean };

export const run = async (_input: SampleBlockInput): Promise<SampleBlockOutput> => {
  return { ok: true };
};
