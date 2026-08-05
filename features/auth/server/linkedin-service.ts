import { loginWithBackend } from "./login-service";
import { registerWithBackend } from "./register-service";
import type { LoggedUser } from "@/features/auth/types";

type LinkedInUserInfo = {
  sub?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
};

export type LinkedInSyncResult =
  | { ok: true; user: LoggedUser }
  | { ok: false; status: number; error: string };

function getDeterministicPassword(providerUserId: string): string {
  const safeId = (providerUserId || "linkedin-user").slice(0, 24);
  return `Li#${safeId}!A1`;
}

function normalizeFullName(profile: LinkedInUserInfo): string {
  const fullName = profile.name?.trim();
  if (fullName) {
    return fullName;
  }

  const firstName = profile.given_name?.trim() ?? "";
  const lastName = profile.family_name?.trim() ?? "";
  return `${firstName} ${lastName}`.trim();
}

function getLinkedInFallbackProfile(providerUserId: string) {
  const displayName = "LinkedIn User";
  return {
    fullName: displayName,
    companyName: "Not provided",
    jobTitle: "Not provided",
    linkedIn: providerUserId
      ? `https://www.linkedin.com/in/${providerUserId}`
      : undefined,
  };
}

export async function syncLinkedInUserWithBackend(
  profile: LinkedInUserInfo,
): Promise<LinkedInSyncResult> {
  const providerUserId = profile.sub?.trim() ?? "";
  const fallbackEmail = providerUserId
    ? `linkedin_${providerUserId}@oauth.local`
    : "";
  const email = profile.email?.trim() || fallbackEmail;
  const fullName = normalizeFullName(profile);
  const password = getDeterministicPassword(providerUserId);
  const fallback = getLinkedInFallbackProfile(providerUserId);

  if (!providerUserId || !email) {
    return { ok: false, status: 400, error: "LinkedIn profile is missing id or email" };
  }

  const loginBeforeRegister = await loginWithBackend({ email, password });
  if (loginBeforeRegister.ok) {
    return { ok: true, user: loginBeforeRegister.user };
  }

  const registerResult = await registerWithBackend({
    email,
    password,
    fullName: fullName || fallback.fullName,
    companyName: fallback.companyName,
    jobTitle: fallback.jobTitle,
    linkedIn: fallback.linkedIn,
  });

  if (registerResult.ok) {
    return { ok: true, user: registerResult.user };
  }

  const loginAfterRegister = await loginWithBackend({ email, password });
  if (loginAfterRegister.ok) {
    return { ok: true, user: loginAfterRegister.user };
  }

  return {
    ok: false,
    status: registerResult.status || loginAfterRegister.status || 400,
    error:
      registerResult.error ||
      loginAfterRegister.error ||
      "LinkedIn login failed",
  };
}

