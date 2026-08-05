type SpinnerProps = {
  className?: string;
};

export function Spinner({ className = "h-5 w-5 border-2" }: SpinnerProps) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-solid border-white/80 border-t-transparent ${className}`}
      aria-label="Loading"
    />
  );
}

