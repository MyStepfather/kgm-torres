"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type HomeLinkProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
} & Pick<ComponentPropsWithoutRef<"a">, "aria-label">;

export function HomeLink({ children, className, onClick, ...rest }: HomeLinkProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (isHome) {
    return <div className={className}>{children}</div>;
  }

  return (
    <Link href="/" className={className} onClick={onClick} aria-label={rest["aria-label"]}>
      {children}
    </Link>
  );
}
