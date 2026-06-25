import Link from "next/link";

type ArrowButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "brand" | "white";
  className?: string;
};

export function ArrowButton({
  href,
  children,
  variant = "brand",
  className = "",
}: ArrowButtonProps) {
  const base =
    variant === "white"
      ? "bg-white text-brand border border-white/30"
      : "bg-brand text-white";

  return (
    <Link
      href={href}
      className={`group inline-flex h-14 min-w-[220px] items-center justify-between gap-4 rounded-full px-6 text-base font-semibold tracking-wide transition hover:opacity-90 ${base} ${className}`}
    >
      <span>{children}</span>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </Link>
  );
}
