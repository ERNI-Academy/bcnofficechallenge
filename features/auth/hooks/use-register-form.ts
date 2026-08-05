"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthSession } from "@/features/auth/client/auth-session-context";
import { useI18n } from "@/features/i18n/i18n-context";
import { registerRequest } from "@/features/auth/client/register-api";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function useRegisterForm() {
  const router = useRouter();
  const { t } = useI18n();
  const { setAuthenticatedUser } = useAuthSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const emailIsValid = useMemo(() => isValidEmail(email.trim()), [email]);
  const hasRequiredFields = useMemo(
    () =>
      email.trim().length > 0 &&
      password.trim().length > 0 &&
      fullName.trim().length > 0 &&
      companyName.trim().length > 0 &&
      jobTitle.trim().length > 0,
    [email, password, fullName, companyName, jobTitle],
  );
  const canSubmit =
    hasRequiredFields && emailIsValid && agreedTerms && !submitting;

  async function submit() {
    if (!canSubmit) {
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const user = await registerRequest({
        email: email.trim(),
        password: password.trim(),
        fullName: fullName.trim(),
        companyName: companyName.trim(),
        jobTitle: jobTitle.trim(),
        linkedIn: linkedIn.trim() || undefined,
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
    fullName,
    companyName,
    jobTitle,
    linkedIn,
    agreedTerms,
    emailIsValid,
    canSubmit,
    submitting,
    error,
    setEmail,
    setPassword,
    setFullName,
    setCompanyName,
    setJobTitle,
    setLinkedIn,
    setAgreedTerms,
    submit,
  };
}

