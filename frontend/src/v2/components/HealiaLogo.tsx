import { cn } from "@/lib/utils";

type HealiaLogoProps = {
  className?: string;
  markClassName?: string;
  wordClassName?: string;
};

export function HealiaMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <path
        d="M11 20a7 7 0 0 1-1.2-13.9C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 21c0-3 1.8-5.3 5-6C10 14.5 12.2 13 13.2 12"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HealiaLogo({
  className,
  markClassName = "h-8 w-8",
  wordClassName = "font-serif text-xl font-semibold tracking-tight",
}: HealiaLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <HealiaMark className={cn("shrink-0 text-healia-brand", markClassName)} />
      <span className={cn("text-healia-text", wordClassName)}>Healia</span>
    </span>
  );
}
