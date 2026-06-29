"use client";

import dynamic from "next/dynamic";
import type { DealerOption } from "@/lib/dealers";

const RegistrationForm = dynamic(
  () =>
    import("@/components/landing/RegistrationForm").then(
      (mod) => mod.RegistrationForm,
    ),
  {
    ssr: false,
    loading: () => (
      <section id="register" className="rounded-t-[40px] bg-brand pt-20 pb-16 sm:rounded-t-[80px] md:pt-28 md:pb-20">
        <div className="section-container">
          <div className="card p-8 text-center text-muted">
            Загрузка формы регистрации…
          </div>
        </div>
      </section>
    ),
  },
);

type RegistrationFormClientProps = {
  dealers: DealerOption[];
  testDrivePeriodLabel: string;
};

export function RegistrationFormClient({
  dealers,
  testDrivePeriodLabel,
}: RegistrationFormClientProps) {
  return (
    <RegistrationForm dealers={dealers} testDrivePeriodLabel={testDrivePeriodLabel} />
  );
}
