import {
  DEFAULT_ALGORITHM,
  LogbookEntry,
  LogbookEntrySchema,
  LogbookSubject,
  withHash,
} from "@blkc-code/core";

export type LogbookReaderInput = {
  /** Contents of a logbook .jsonl file: one JSON entry per line. */
  content: string;
  /** Only return entries whose event starts with this, e.g. "site." or "board.transition". */
  eventPrefix?: string;
  /** Only return entries about this subject. `id` is optional. */
  subject?: { type: LogbookSubject["type"]; id?: string };
  /** Return at most this many entries, newest last. */
  limit?: number;
  /** Check the hash chain (default true). */
  verify?: boolean;
};

export type LogbookIssue = { line: number; message: string };

export type LogbookReaderOutput = {
  entries: LogbookEntry[];
  total: number;
  valid: boolean;
  issues: LogbookIssue[];
  lastHash?: string;
};

const dropHashFields = ({ hash: _hash, prevHash: _prevHash, ...rest }: LogbookEntry) => rest;

export const run = async (input: LogbookReaderInput): Promise<LogbookReaderOutput> => {
  const issues: LogbookIssue[] = [];
  const all: LogbookEntry[] = [];

  input.content.split(/\r?\n/).forEach((raw, index) => {
    if (!raw.trim()) return;
    try {
      all.push(LogbookEntrySchema.parse(JSON.parse(raw)));
    } catch (error) {
      issues.push({ line: index + 1, message: `Unreadable entry: ${(error as Error).message.split("\n")[0]}` });
    }
  });

  // Same rule as @blkc-code/logbook verify(): each entry links to the previous hash,
  // and its own hash covers everything except hash/prevHash.
  if (input.verify !== false) {
    let prevHash: string | undefined;
    all.forEach((entry, index) => {
      if ((entry.prevHash ?? undefined) !== prevHash) {
        issues.push({ line: index + 1, message: `Broken chain: expected prevHash ${prevHash ?? "<none>"}` });
      }
      const expected = withHash(dropHashFields(entry), prevHash, DEFAULT_ALGORITHM).hash;
      if (expected !== entry.hash) {
        issues.push({ line: index + 1, message: "Hash mismatch: entry was changed after it was written" });
      }
      prevHash = entry.hash;
    });
  }

  let entries = all;
  if (input.eventPrefix) entries = entries.filter((entry) => entry.event.startsWith(input.eventPrefix!));
  if (input.subject) {
    const { type, id } = input.subject;
    entries = entries.filter(
      (entry) => entry.subject?.type === type && (id === undefined || entry.subject.id === id)
    );
  }
  if (input.limit !== undefined) entries = entries.slice(-input.limit);

  return {
    entries,
    total: all.length,
    valid: issues.length === 0,
    issues,
    lastHash: all.at(-1)?.hash,
  };
};
