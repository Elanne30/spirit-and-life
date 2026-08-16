export type UnsupportedText = { field: string; codePoint: string };

function firstUnsupportedString(value: string, field: string): UnsupportedText | null {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (code === 0) return { field, codePoint: "U+0000" };
    if (code >= 0xd800 && code <= 0xdbff) {
      const next = value.charCodeAt(index + 1);
      if (next < 0xdc00 || next > 0xdfff) {
        return { field, codePoint: `U+${code.toString(16).padStart(4, "0").toUpperCase()}` };
      }
      index += 1;
      continue;
    }
    if (code >= 0xdc00 && code <= 0xdfff) {
      return { field, codePoint: `U+${code.toString(16).padStart(4, "0").toUpperCase()}` };
    }
  }
  return null;
}

export function findUnsupportedText(value: unknown, field = "value"): UnsupportedText | null {
  if (typeof value === "string") return firstUnsupportedString(value, field);
  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      const result = findUnsupportedText(value[index], `${field}[${index}]`);
      if (result) return result;
    }
    return null;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      const result = findUnsupportedText(child, field ? `${field}.${key}` : key);
      if (result) return result;
    }
  }
  return null;
}

export type PostgresErrorDetails = {
  code?: string;
  message: string;
  detail?: string;
  constraint?: string;
  column?: string;
  table?: string;
};

export function getPostgresErrorDetails(error: unknown): PostgresErrorDetails {
  if (!error || typeof error !== "object") return { message: String(error) };
  const candidate = error as Record<string, unknown>;
  return {
    code: typeof candidate.code === "string" ? candidate.code : undefined,
    message: error instanceof Error ? error.message : String(candidate.message ?? "Unknown database error"),
    detail: typeof candidate.detail === "string" ? candidate.detail : undefined,
    constraint: typeof candidate.constraint === "string" ? candidate.constraint : undefined,
    column: typeof candidate.column === "string" ? candidate.column : undefined,
    table: typeof candidate.table === "string" ? candidate.table : undefined,
  };
}
