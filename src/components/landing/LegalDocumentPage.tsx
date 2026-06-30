import Link from "next/link";
import type { DocumentSection } from "@/lib/promotion-rules-content";

function BreadcrumbChevron() {
  return (
    <svg
      viewBox="0 0 5 8"
      aria-hidden
      className="h-2 w-[5px] shrink-0 text-[#9c9c9c]"
      fill="currentColor"
    >
      <path d="M4.5 1L1 4l3.5 3" stroke="currentColor" strokeWidth="1.2" fill="none" />
    </svg>
  );
}

type LegalDocumentPageProps = {
  title: string;
  sections: DocumentSection[];
};

export function LegalDocumentPage({ title, sections }: LegalDocumentPageProps) {
  return (
    <div className="section-container pb-16 pt-24 md:pb-20 md:pt-32 lg:pb-24">
      <nav
        aria-label="Хлебные крошки"
        className="flex items-center gap-[11px] text-[15px] font-medium leading-[1.2]"
      >
        <Link href="/" className="text-[#9c9c9c] transition hover:text-[#282828]">
          Главная
        </Link>
        <BreadcrumbChevron />
        <span className="text-[#282828]">{title}</span>
      </nav>

      <div className="mt-10 md:mt-12 lg:flex lg:justify-end">
        <article className="w-full max-w-[870px] lg:mt-0">
          <h1 className="text-[28px] font-semibold leading-[1.1] tracking-[-0.02em] text-[#111111] md:text-[35px]">
            {title}
          </h1>

          {sections.length > 0 && (
            <div className="mt-[60px] space-y-10">
              {sections.map((section) => (
                <section key={section.title} className="space-y-5">
                  <h2 className="text-sm font-bold leading-none text-[#282828]">
                    {section.title}
                  </h2>
                  <div className="space-y-5 text-[15px] font-medium leading-[1.3] text-[#282828]">
                    {section.paragraphs.map((paragraph, index) => (
                      <p
                        key={`${section.title}-${index}`}
                        className="whitespace-pre-line"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
