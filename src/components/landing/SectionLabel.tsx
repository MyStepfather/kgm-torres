type SectionLabelProps = {
  children: React.ReactNode;
  variant?: "light" | "dark" | "on-brand";
};

export function SectionLabel({
  children,
  variant = "light",
}: SectionLabelProps) {
  const lineClass =
    variant === "on-brand"
      ? "bg-accent-light"
      : variant === "dark"
        ? "bg-brand"
        : "bg-brand";

  const textClass =
    variant === "on-brand"
      ? "text-accent-light"
      : variant === "dark"
        ? "text-brand"
        : "text-brand";

  return (
    <div className="flex items-center gap-2.5">
      <span className={`h-0.5 w-6 rounded-full ${lineClass}`} />
      <p className={`descriptor ${textClass}`}>{children}</p>
    </div>
  );
}
