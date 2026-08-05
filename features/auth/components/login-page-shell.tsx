type LoginPageShellProps = {
  children: React.ReactNode;
};

export function LoginPageShell({ children }: LoginPageShellProps) {
  return (
    <main className="relative isolate -mx-5 -mt-[3.4rem] flex min-h-[calc(100dvh-8.4rem)] w-[calc(100%+2.5rem)] items-center justify-center overflow-x-hidden">
      <div
        className="absolute inset-y-0 left-1/2 -z-20 w-screen -translate-x-1/2 bg-[#0c3d7b] bg-cover bg-top bg-no-repeat"
        style={{
          backgroundImage:
            "url('/background.png')",
        }}
      />
      <div className="absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 bg-[rgba(3,29,59,0.12)]" />
      <section className="z-10 mx-4 flex w-[calc(100%-2rem)] max-w-[28rem] flex-col justify-center rounded-2xl border border-white/10 bg-[#031d3b]/80 py-5 shadow-2xl backdrop-blur-[2px]">
        {children}
      </section>
    </main>
  );
}
