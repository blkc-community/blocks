# Logbook Reader

A capability Block that reads a BLKC logbook (`.jsonl`) and checks its hash chain. Add it to a Kit or
Circuit to give that bundle a visible audit trail: page revisions, board moves, MCP writes.

```ts
import { run } from "./src/index";

const result = await run({
  content: await Bun.file("logbook/log.jsonl").text(),
  eventPrefix: "site.",                   // optional
  subject: { type: "page", id: "home" },  // optional
  limit: 20,                              // optional, newest last
});

result.valid;   // false if any entry was edited, removed or reordered
result.issues;  // [{ line, message }]
```

It takes the file *contents*, not a path, so it runs anywhere: server, browser or CI. To write
entries, use [`@blkc-code/logbook`](https://www.npmjs.com/package/@blkc-code/logbook).
