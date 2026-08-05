import { LoginForm } from "@/features/auth/components/login-form";
import { LoginPageShell } from "@/features/auth/components/login-page-shell";

export default function Home() {
  return (
    <LoginPageShell>
      <LoginForm />
    </LoginPageShell>
  );
}