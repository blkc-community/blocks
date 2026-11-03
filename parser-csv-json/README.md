# CSV & JSON Parser

Normalises CSV or JSON payloads into a common record format so downstream blocks can consume consistent data.

## Usage

```ts
import { run } from "./blocks/parser-csv-json/src";

const csvResult = await run({ content: "name,email\nAda,ada@example.com" });
const jsonResult = await run({ content: JSON.stringify({ name: "Ada" }), format: "json" });
```

Outputs contain the detected format, field names, and an array of records.
