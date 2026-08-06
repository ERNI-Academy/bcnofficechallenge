import type { Metadata } from "next";
import "./globals.css";
import { AuthSessionProvider } from "@/features/auth/client/auth-session-context";
import { AuthRouteGuard } from "@/features/auth/components/auth-route-guard";
import { I18nProvider } from "@/features/i18n/i18n-context";
import { AppFooter } from "@/features/layout/components/app-footer";
import { AppHeader } from "@/features/layout/components/app-header";
import { RaffleBanner } from "@/features/layout/components/raffle-banner";

export const metadata: Metadata = {
  title: "BCN Office Challenge",
  description: "QR challenge across the BCN office",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#031d3b] text-[#f5f7fa]">
        <I18nProvider>
          <AuthSessionProvider>
            <AppHeader />
            <RaffleBanner />
            <AuthRouteGuard>
              <main className="min-h-screen px-5 pb-[6.2rem] pt-[8.6rem]">
                {children}
              </main>
            </AuthRouteGuard>
            <AppFooter />
          </AuthSessionProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
