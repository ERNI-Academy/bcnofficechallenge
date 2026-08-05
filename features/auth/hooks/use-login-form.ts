"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthSession } from "@/features/auth/client/auth-session-context";
import { useI18n } from "@/features/i18n/i18n-context";
import { loginRequest } from "@/features/auth/client/login-api";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function useLoginForm() {
  const router = useRouter();
  const { t } = useI18n();
  const { setAuthenticatedUser } = useAuthSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const emailIsValid = useMemo(() => isValidEmail(email.trim()), [email]);
  const canSubmit = emailIsValid && password.trim().length > 0 && !submitting;

  async function submit() {
    if (!canSubmit) {
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const user = await loginRequest({
        email: email.trim(),
        password: password.trim(),
      });
      setAuthenticatedUser(user);
      router.push("/welcome");
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : t("common.unexpectedError"),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return {
    email,
    password,
    error,
    submitting,
    emailIsValid,
    canSubmit,
    setEmail,
    setPassword,
    submit,
  };
}

