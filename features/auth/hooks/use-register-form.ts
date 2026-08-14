"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthSession } from "@/features/auth/client/auth-session-context";
import { useI18n } from "@/features/i18n/i18n-context";
import { registerRequest } from "@/features/auth/client/register-api";
import {
  buildCompanyEmail,
  isValidEmailPrefix,
} from "@/features/auth/constants";

export function useRegisterForm() {
  const router = useRouter();
  const { t } = useI18n();
  const { setAuthenticatedUser } = useAuthSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const emailIsValid = useMemo(
    () => isValidEmailPrefix(username),
    [username],
  );
  const hasRequiredFields =
    password.length > 0 &&
    fullName.trim().length > 0;
  const canSubmit =
    hasRequiredFields && emailIsValid && agreedTerms && !submitting;

  async function submit() {
    if (!canSubmit) return;

    setError(null);
    setSubmitting(true);
    try {
      const user = await registerRequest({
        email: buildCompanyEmail(username),
        password,
        fullName: fullName.trim(),
      });
      setAuthenticatedUser(user);
      router.push("/welcome");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : t("common.unexpectedError"),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return {
    username,
    password,
    fullName,
    agreedTerms,
    emailIsValid,
    canSubmit,
    submitting,
    error,
    setUsername,
    setPassword,
    setFullName,
    setAgreedTerms,
    submit,
  };
}
