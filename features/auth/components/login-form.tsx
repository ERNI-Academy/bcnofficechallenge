"use client";

import Link from "next/link";
import { FormEvent } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useI18n } from "@/features/i18n/i18n-context";
import { useLoginForm } from "@/features/auth/hooks/use-login-form";

export function LoginForm() {
  const {
    email,
    password,
    error,
    submitting,
    emailIsValid,
    canSubmit,
    setEmail,
    setPassword,
    submit,
  } = useLoginForm();
  const { t } = useI18n();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submit();
  }

  return (
    <form className="flex flex-col gap-[0.9rem] px-6" onSubmit={handleSubmit} noValidate>
      <label className="text-[0.95rem] text-[#d5deed]" htmlFor="email">
        {t("auth.login.userEmail")}
      </label>
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

      <label className="text-[0.95rem] text-[#d5deed]" htmlFor="password">
        {t("auth.login.password")}
      </label>
      <input
        id="password"
        type="password"
        className="h-[2.9rem] w-full rounded-[0.55rem] border border-[#6f839d] bg-[#0f3156] px-[0.85rem] text-white placeholder:text-[#adbacd]"
        placeholder={t("auth.login.password")}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        autoComplete="current-password"
        required
      />

      <button
        type="submit"
        className="relative mt-1 h-[2.9rem] rounded-[0.55rem] border-none bg-[#ff5b00] text-base font-bold text-white disabled:opacity-45"
        disabled={!canSubmit}
      >
        <span className={submitting ? "opacity-0" : "opacity-100"}>
          {t("auth.login.enter")}
        </span>
        {submitting ? (
          <span className="absolute inset-0 flex items-center justify-center">
            <Spinner />
          </span>
        ) : null}
      </button>

      <p className="text-center text-[0.92rem] font-semibold uppercase tracking-[0.08em] text-[#dce6f5]">
        {t("auth.login.or")}
      </p>

      <a
        href="/api/auth/linkedin/start"
        className="mt-1 flex h-[2.9rem] items-center justify-center rounded-[0.55rem] bg-[#127fb3] px-2 text-white"
      >
        <img
          src="/LinkedIn_icon.svg.png"
          alt="LinkedIn"
          className="h-9 w-9 rounded-[0.4rem] bg-white object-contain p-1"
        />
        <span className="ml-3 text-[1.02rem] font-semibold tracking-[0.01em]">
          {t("auth.login.linkedin")}
        </span>
      </a>

      <Link href="/sign-up" className="mt-2 text-center text-[0.95rem] text-[#dce6f5] underline">
        {t("auth.login.signup")}
      </Link>

      {error ? <p className="m-0 text-[0.9rem] text-[#ff8181]">{error}</p> : null}
    </form>
  );
}

