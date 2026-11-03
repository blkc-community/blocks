const DEFAULT_DELIMITER = ",";

export type CSVJSONParserInput = {
  content: string;
  format?: "csv" | "json";
  delimiter?: string;
};

export type CSVJSONParserOutput = {
  format: "csv" | "json";
  fields: string[];
  records: Record<string, unknown>[];
};

const parseCsv = (content: string, delimiter: string): CSVJSONParserOutput => {
  const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) {
    return { format: "csv", fields: [], records: [] };
  }

  const [headerLine, ...rowLines] = lines;
  const headers = headerLine.split(delimiter).map((column) => column.trim());
  const records = rowLines.map((line) => {
    const values = line.split(delimiter);
    return headers.reduce<Record<string, unknown>>((acc, column, index) => {
      acc[column] = values[index]?.trim() ?? null;
      return acc;
    }, {});
  });

  return { format: "csv", fields: headers, records };
};

const parseJson = (content: string): CSVJSONParserOutput => {
  const parsed = JSON.parse(content);
  const records = Array.isArray(parsed) ? parsed : [parsed];
  const fields = new Set<string>();
  records.forEach((record) => {
    if (record && typeof record === "object") {
      Object.keys(record).forEach((key) => fields.add(key));
    }
  });

  return { format: "json", fields: Array.from(fields), records };
};

export const run = async (
  input: CSVJSONParserInput
): Promise<CSVJSONParserOutput> => {
  const format = input.format ?? (input.content.trim().startsWith("{") || input.content.trim().startsWith("[") ? "json" : "csv");

  if (format === "json") {
    return parseJson(input.content);
  }

  return parseCsv(input.content, input.delimiter ?? DEFAULT_DELIMITER);
};
