"use client";

import Link from "next/link";
import { FormEvent } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useI18n } from "@/features/i18n/i18n-context";
import { useLoginForm } from "@/features/auth/hooks/use-login-form";
import { EMAIL_DOMAIN } from "@/features/auth/constants";

export function LoginForm() {
  const {
    username,
    password,
    error,
    submitting,
    emailIsValid,
    canSubmit,
    setUsername,
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
      <p className="text-center text-[0.92rem] font-semibold tracking-[0.08em] text-[#dce6f5]">
        {t("auth.login.welcome")}
      </p>
      <label className="text-[0.95rem] text-[#d5deed]" htmlFor="email">
        {t("auth.login.userEmail")}
      </label>
      <div className="flex h-[2.9rem] overflow-hidden rounded-[0.55rem] border border-[#6f839d] bg-[#0f3156]">
        <input
          id="email"
          type="text"
          className="min-w-0 flex-1 bg-transparent px-[0.85rem] text-white outline-none placeholder:text-[#adbacd]"
          placeholder="username"
          value={username}
          onChange={(event) => setUsername(event.target.value.replace(/@.*$/, ""))}
          autoComplete="username"
          inputMode="email"
          required
        />
        <span className="flex items-center border-l border-[#6f839d] bg-[#092746] px-3 text-sm text-[#d5deed]">
          {EMAIL_DOMAIN}
        </span>
      </div>

      {username.length > 0 && !emailIsValid ? (
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

      <Link href="/sign-up" className="mt-2 text-center text-[0.95rem] text-[#dce6f5] underline">
        {t("auth.login.signup")}
      </Link>

      {error ? <p className="m-0 text-[0.9rem] text-[#ff8181]">{error}</p> : null}
    </form>
  );
}

