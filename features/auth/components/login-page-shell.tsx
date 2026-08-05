type LoginPageShellProps = {
  children: React.ReactNode;
};

export function LoginPageShell({ children }: LoginPageShellProps) {
  return (
    <main className="relative isolate -mx-5 -mt-[3.4rem] flex min-h-[calc(100vh-8.4rem)] w-[calc(100%+2.5rem)] items-center justify-center overflow-hidden">
      <div
        className="absolute inset-y-0 left-1/2 -z-20 w-screen -translate-x-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('/mainBackground.jpg')" }}
      />
      <div className="absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 bg-[rgba(3,29,59,0.5)]" />
      <section className="z-10 mx-auto flex w-full max-w-[28rem] flex-col justify-center">
        {children}
      </section>
    </main>
  );
}

