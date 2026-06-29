type SectionLabelProps = {
  children: React.ReactNode;
  variant?: "light" | "dark" | "on-brand" | "inverse";
};

export function SectionLabel({
  children,
  variant = "light",
}: SectionLabelProps) {
  const lineClass =
    variant === "inverse"
      ? "bg-white"
      : variant === "on-brand"
        ? "bg-accent-light"
        : "bg-brand";

  const textClass =
    variant === "inverse"
      ? "text-white"
      : variant === "on-brand"
        ? "text-accent-light"
        : "text-brand";

  return (
    <div className="flex items-center gap-2.5">
      <span className={`h-0.5 w-6 rounded-full ${lineClass}`} />
      <p className={`descriptor ${textClass}`}>{children}</p>
    </div>
  );
}
