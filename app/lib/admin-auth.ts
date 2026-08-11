import "server-only";

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function getAdminAllowlist() {
  const raw = process.env.ADMIN_EMAIL_ALLOWLIST ?? "";
  return new Set(
    raw
      .split(",")
      .map((item) => normalizeEmail(item))
      .filter(Boolean),
  );
}

export function isAdminEmail(email: string) {
  const normalized = normalizeEmail(email);
  if (!normalized) {
    return false;
  }

  return getAdminAllowlist().has(normalized);
}
