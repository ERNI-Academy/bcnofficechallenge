"use client";

import Link from "next/link";
import { FormEvent } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useI18n } from "@/features/i18n/i18n-context";
import { useRegisterForm } from "@/features/auth/hooks/use-register-form";

export function RegisterForm() {
  const {
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
  } = useRegisterForm();
  const { t } = useI18n();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submit();
  }

  return (
    <form className="flex flex-col gap-[0.9rem] px-6" onSubmit={handleSubmit} noValidate>
      <input
        id="email"
        type="email"
        className="h-[2.9rem] w-full rounded-[0.55rem] border border-[#6f839d] bg-[#0f3156] px-[0.85rem] text-white placeholder:text-[#adbacd]"
        placeholder={t("auth.register.email")}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        autoComplete="email"
        required
      />
      {email.length > 0 && !emailIsValid ? (
        <p className="m-0 text-[0.9rem] text-[#ff8181]">{t("auth.email.invalid")}</p>
      ) : null}
      <input
        id="password"
        type="password"
        className="h-[2.9rem] w-full rounded-[0.55rem] border border-[#6f839d] bg-[#0f3156] px-[0.85rem] text-white placeholder:text-[#adbacd]"
        placeholder={t("auth.register.password")}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        autoComplete="new-password"
        required
      />
      <input
        id="fullName"
        type="text"
        className="h-[2.9rem] w-full rounded-[0.55rem] border border-[#6f839d] bg-[#0f3156] px-[0.85rem] text-white placeholder:text-[#adbacd]"
        placeholder={t("auth.register.fullName")}
        value={fullName}
        onChange={(event) => setFullName(event.target.value)}
        autoComplete="name"
        required
      />
      <input
        id="companyName"
        type="text"
        className="h-[2.9rem] w-full rounded-[0.55rem] border border-[#6f839d] bg-[#0f3156] px-[0.85rem] text-white placeholder:text-[#adbacd]"
        placeholder={t("auth.register.companyName")}
        value={companyName}
        onChange={(event) => setCompanyName(event.target.value)}
        required
      />
      <input
        id="jobTitle"
        type="text"
        className="h-[2.9rem] w-full rounded-[0.55rem] border border-[#6f839d] bg-[#0f3156] px-[0.85rem] text-white placeholder:text-[#adbacd]"
        placeholder={t("auth.register.jobTitle")}
        value={jobTitle}
        onChange={(event) => setJobTitle(event.target.value)}
        required
      />
      <input
        id="linkedIn"
        type="text"
        className="h-[2.9rem] w-full rounded-[0.55rem] border border-[#6f839d] bg-[#0f3156] px-[0.85rem] text-white placeholder:text-[#adbacd]"
        placeholder={t("auth.register.linkedInOptional")}
        value={linkedIn}
        onChange={(event) => setLinkedIn(event.target.value)}
      />

      <label htmlFor="terms" className="mt-1 flex items-start gap-2 text-[0.92rem] text-[#dce6f5]">
        <input
          id="terms"
          type="checkbox"
          checked={agreedTerms}
          onChange={(event) => setAgreedTerms(event.target.checked)}
          className="mt-1 h-4 w-4 accent-[#ff5b00]"
        />
        <span>
          {t("auth.register.agree")}{" "}
          <Link
            href="https://www.betterask.erni/es-es/privacy-statement/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {t("auth.register.terms")}
          </Link>
        </span>
      </label>

      <button
        type="submit"
        className="relative mt-1 h-[2.9rem] rounded-[0.55rem] border-none bg-[#ff5b00] text-base font-bold text-white disabled:opacity-45"
        disabled={!canSubmit}
      >
        <span className={submitting ? "opacity-0" : "opacity-100"}>
          {t("auth.register.register")}
        </span>
        {submitting ? (
          <span className="absolute inset-0 flex items-center justify-center">
            <Spinner />
          </span>
        ) : null}
      </button>

      {error ? <p className="m-0 text-[0.9rem] text-[#ff8181]">{error}</p> : null}
    </form>
  );
}

