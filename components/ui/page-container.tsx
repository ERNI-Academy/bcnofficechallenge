type PageContainerProps = {
  children: React.ReactNode;
};

export function PageContainer({ children }: PageContainerProps) {
  return (
    <section className="mx-auto flex w-full max-w-[28rem] flex-col justify-center">
      {children}
    </section>
  );
}

