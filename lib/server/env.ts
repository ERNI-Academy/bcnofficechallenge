type RequiredServerEnv = "API_BASE_URL";

function readRequiredEnv(name: RequiredServerEnv): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function normalizeBaseUrl(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export const serverEnv = {
  apiBaseUrl: normalizeBaseUrl(readRequiredEnv("API_BASE_URL")),
} as const;

export function buildBackendUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${serverEnv.apiBaseUrl}${normalizedPath}`;
}

