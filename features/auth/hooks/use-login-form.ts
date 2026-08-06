"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthSession } from "@/features/auth/client/auth-session-context";
import { useI18n } from "@/features/i18n/i18n-context";
import { loginRequest } from "@/features/auth/client/login-api";
import {
  buildCompanyEmail,
  isValidEmailPrefix,
} from "@/features/auth/constants";

export function useLoginForm() {
  const router = useRouter();
  const { t } = useI18n();
  const { setAuthenticatedUser } = useAuthSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const emailIsValid = useMemo(
    () => isValidEmailPrefix(username),
    [username],
  );
  const canSubmit = emailIsValid && password.length > 0 && !submitting;

  async function submit() {
    if (!canSubmit) return;

    setError(null);
    setSubmitting(true);
    try {
      const user = await loginRequest({
        email: buildCompanyEmail(username),
        password,
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
    error,
    submitting,
    emailIsValid,
    canSubmit,
    setUsername,
    setPassword,
    submit,
  };
}
