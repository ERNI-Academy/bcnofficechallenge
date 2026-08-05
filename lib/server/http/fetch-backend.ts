const allowSelfSignedCerts =
  process.env.ALLOW_SELF_SIGNED_CERTS?.toLowerCase() === "true";

export async function fetchBackend(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const previousTlsSetting = process.env.NODE_TLS_REJECT_UNAUTHORIZED;

  try {
    if (allowSelfSignedCerts) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }

    return await fetch(input, init);
  } finally {
    if (allowSelfSignedCerts) {
      if (previousTlsSetting === undefined) {
        delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
      } else {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = previousTlsSetting;
      }
    }
  }
}

