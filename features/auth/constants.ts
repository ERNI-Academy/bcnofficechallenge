export const EMAIL_DOMAIN = "@betterask.erni";

export function isValidEmailPrefix(value: string): boolean {
  return /^[A-Za-z0-9._%+-]+$/.test(value.trim());
}

export function buildCompanyEmail(prefix: string): string {
  return `${prefix.trim()}${EMAIL_DOMAIN}`.toLowerCase();
}

export function hasCompanyEmailDomain(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  const prefix = normalized.endsWith(EMAIL_DOMAIN)
    ? normalized.slice(0, -EMAIL_DOMAIN.length)
    : "";
  return isValidEmailPrefix(prefix);
}
