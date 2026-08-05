import { LoginPageShell } from "@/features/auth/components/login-page-shell";
import { RegisterForm } from "@/features/auth/components/register-form";

export default function SignUpPage() {
  return (
    <LoginPageShell>
      <RegisterForm />
    </LoginPageShell>
  );
}

