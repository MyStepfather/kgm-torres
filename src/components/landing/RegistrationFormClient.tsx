"use client";

import dynamic from "next/dynamic";
import type { DealerOption } from "@/lib/dealers";
import type { TestDriveSchedule } from "@/lib/test-drive-schedule";

const RegistrationForm = dynamic(
  () =>
    import("@/components/landing/RegistrationForm").then(
      (mod) => mod.RegistrationForm,
    ),
  {
    ssr: false,
    loading: () => (
      <section id="registration" className="section-padding">
        <div className="container-narrow">
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
  testDriveSchedule: TestDriveSchedule;
  giveawayDateLabel: string;
};

export function RegistrationFormClient({
  dealers,
  testDriveSchedule,
  giveawayDateLabel,
}: RegistrationFormClientProps) {
  return (
    <RegistrationForm
      dealers={dealers}
      testDriveSchedule={testDriveSchedule}
      giveawayDateLabel={giveawayDateLabel}
    />
  );
}
