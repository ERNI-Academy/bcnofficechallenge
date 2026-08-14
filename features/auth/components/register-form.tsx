"use client";

import Link from "next/link";
import { FormEvent } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useI18n } from "@/features/i18n/i18n-context";
import { useRegisterForm } from "@/features/auth/hooks/use-register-form";
import { EMAIL_DOMAIN } from "@/features/auth/constants";

export function RegisterForm() {
  const {
    username,
    password,
    fullName,
    emailIsValid,
    canSubmit,
    submitting,
    error,
    setUsername,
    setPassword,
    setFullName,
    submit,
  } = useRegisterForm();
  const { t } = useI18n();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submit();
  }

  return (
    <div className="flex flex-col gap-[0.9rem] px-6">
      <Link
        href="/"
        className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-white/90"
      >
        <span aria-hidden="true">←</span>
        <span>Go back</span>
      </Link>

      <form className="flex flex-col gap-[0.9rem]" onSubmit={handleSubmit} noValidate>
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
    </div>
  );
}
