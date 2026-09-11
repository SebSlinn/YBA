//frontend/src/components/documents/DocumentButton.tsx

import { Document } from "@/domain/document/Document";

interface DocumentButtonProps {
  document: Document;
}

/**
 * Purely presentational — takes a Document and renders it as a single
 * "button" card. No data-fetching, no knowledge of Directus.
 *
 * Link target is resolved from documentType:
 *  - file → the uploaded asset, opened in a new tab
 *  - link → the external URL, opened in a new tab
 *  - page → an internal route, same tab
 */
export function DocumentButton({ document }: DocumentButtonProps) {
  const { href, isExternal } = resolveHref(document);

  if (!href) {
    // Data problem (e.g. a "file" type with no file uploaded yet) —
    // fail visibly in dev rather than rendering a dead button.
    return null;
  }

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="group flex items-start gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-[var(--yba-teal)]/40"
    >
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white"
        style={{ backgroundColor: iconColor(document.documentType) }}
        aria-hidden="true"
      >
        <DocumentTypeIcon type={document.documentType} />
      </span>

      <span className="flex flex-col">
        <span className="font-semibold text-[var(--yba-navy)] leading-snug group-hover:text-[var(--yba-magenta)] transition-colors">
          {document.title}
        </span>
        {document.summary && (
          <span className="mt-1 text-sm text-black/60 leading-snug">
            {document.summary}
          </span>
        )}
        <span className="mt-2 text-xs font-medium uppercase tracking-wide text-black/40">
          {typeLabel(document.documentType)}
        </span>
      </span>
    </a>
  );
}

function resolveHref(document: Document): { href: string | null; isExternal: boolean } {
  switch (document.documentType) {
    case "file":
      return { href: document.fileUrl ?? null, isExternal: true };
    case "link":
      return { href: document.externalUrl ?? null, isExternal: true };
    case "page":
      return {
        href: document.pageSlug ? `/${document.pageSlug}` : null,
        isExternal: false,
      };
  }
}

function typeLabel(type: Document["documentType"]): string {
  switch (type) {
    case "file":
      return "Download PDF";
    case "link":
      return "External link";
    case "page":
      return "Read online";
  }
}

function iconColor(type: Document["documentType"]): string {
  switch (type) {
    case "file":
      return "var(--yba-magenta)";
    case "link":
      return "var(--yba-teal)";
    case "page":
      return "var(--yba-gold)";
  }
}

function DocumentTypeIcon({ type }: { type: Document["documentType"] }) {
  const common = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none" };

  if (type === "file") {
    return (
      <svg {...common}>
        <path
          d="M6 2h9l5 5v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path d="M14 2v5h5" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }

  if (type === "link") {
    return (
      <svg {...common}>
        <path
          d="M10 14 20 4M20 4h-6M20 4v6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20 13v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path
        d="M5 3h9l5 5v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M8 12h8M8 16h8M8 8h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
