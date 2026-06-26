import Link from "next/link";

type ArrowButtonBaseProps = {
  children: React.ReactNode;
  variant?: "brand" | "white";
  className?: string;
  disabled?: boolean;
};

type ArrowButtonLinkProps = ArrowButtonBaseProps & {
  href: string;
  type?: never;
};

type ArrowButtonSubmitProps = ArrowButtonBaseProps & {
  href?: never;
  type: "submit" | "button";
};

type ArrowButtonProps = ArrowButtonLinkProps | ArrowButtonSubmitProps;

function ArrowButtonContent({
  children,
  circleClass,
}: {
  children: React.ReactNode;
  circleClass: string;
}) {
  return (
    <div className="grid w-full grid-cols-[2.5rem_minmax(0,1fr)_2.5rem] items-center">
      <span aria-hidden className="h-10 w-10 shrink-0" />
      <span className="truncate text-center">{children}</span>
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${circleClass}`}
      >
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
    </div>
  );
}

export function ArrowButton({
  children,
  variant = "brand",
  className = "",
  disabled = false,
  ...props
}: ArrowButtonProps) {
  const base =
    variant === "white"
      ? "bg-white text-brand border border-white/30"
      : "bg-brand text-white";

  const circleClass =
    variant === "white"
      ? "bg-brand text-white"
      : "bg-white text-brand";

  const buttonClassName = `group inline-flex h-14 w-full items-center rounded-full px-2 text-base font-semibold tracking-wide transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 ${base} ${className}`;

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={buttonClassName}>
        <ArrowButtonContent circleClass={circleClass}>{children}</ArrowButtonContent>
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      disabled={disabled}
      className={buttonClassName}
    >
      <ArrowButtonContent circleClass={circleClass}>{children}</ArrowButtonContent>
    </button>
  );
}
