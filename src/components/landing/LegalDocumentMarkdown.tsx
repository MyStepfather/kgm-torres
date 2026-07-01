import Link from "next/link";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

const markdownComponents: Components = {
  h2: ({ children }) => (
    <h2 className="text-sm font-bold leading-none text-[#282828] [&:not(:first-child)]:mt-10">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-sm font-semibold leading-snug text-[#282828] [&:not(:first-child)]:mt-6">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-[15px] font-medium leading-[1.3] text-[#282828] [&:not(:first-child)]:mt-5">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="mt-5 list-disc space-y-2 pl-5 text-[15px] font-medium leading-[1.3] text-[#282828]">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-5 list-decimal space-y-2 pl-5 text-[15px] font-medium leading-[1.3] text-[#282828]">
      {children}
    </ol>
  ),
  li: ({ children }) => <li>{children}</li>,
  strong: ({ children }) => (
    <strong className="font-bold text-[#282828]">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ href, children }) => {
    const className = "text-brand hover:underline";

    if (href?.startsWith("/")) {
      return (
        <Link href={href} className={className}>
          {children}
        </Link>
      );
    }

    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  },
  blockquote: ({ children }) => (
    <blockquote className="mt-5 border-l-2 border-border pl-4 text-[15px] font-medium leading-[1.3] text-muted">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-8 border-border" />,
};

type LegalDocumentMarkdownProps = {
  markdown: string;
  className?: string;
};

export function LegalDocumentMarkdown({
  markdown,
  className = "",
}: LegalDocumentMarkdownProps) {
  if (!markdown.trim()) {
    return null;
  }

  return (
    <div className={`space-y-5 ${className}`.trim()}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={markdownComponents}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
