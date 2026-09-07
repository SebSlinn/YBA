//src/components/pages/RichText.tsx
import DOMPurify from "isomorphic-dompurify";

interface RichTextProps {
  /** Raw HTML from a Directus WYSIWYG field (e.g. Page.content). */
  html: string;
  className?: string;
}

/**
 * Renders sanitized HTML from a Directus WYSIWYG field.
 *
 * Directus's WYSIWYG interface stores clean HTML (not RTF), but it's
 * still staff-authored content coming from an external system — sanitize
 * before it ever reaches dangerouslySetInnerHTML.
 *
 * Uses isomorphic-dompurify so this works identically during Next.js SSR
 * and in the browser (plain dompurify needs a DOM, which isn't present
 * during server rendering).
 */
export function RichText({ html, className }: RichTextProps) {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p", "br", "strong", "em", "u", "s", "span",
      "h1", "h2", "h3", "h4", "h5", "h6",
      "ul", "ol", "li",
      "a", "img",
      "blockquote", "code", "pre",
      "table", "thead", "tbody", "tr", "th", "td",
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "title", "target", "rel", "style", "class"],
  });

  // Tailwind's [&_selector]:class arbitrary-variant syntax lets us style
  // tags inside this raw, sanitized HTML that we don't control the markup
  // of (no @tailwindcss/typography plugin assumed — this works with plain
  // Tailwind). The trailing `after:content-[''] after:table after:clear-both`
  // is a clearfix: without it, a floated image (from Directus's alignment
  // toolbar) can make this container collapse to zero height, since a
  // floated element doesn't contribute to its parent's height on its own.
  const richTextStyles = `
    [&_p]:mb-4 [&_p]:leading-relaxed
    [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4
    [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3
    [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3
    [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:mt-4 [&_h4]:mb-2
    [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4
    [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4
    [&_li]:mb-1
    [&_a]:text-blue-600 [&_a]:underline [&_a:hover]:text-blue-800
    [&_img]:max-w-md [&_img]:h-auto [&_img]:rounded-md [&_img]:mb-4 [&_img]:mx-auto [&_img]:block
    [&_img[style*='float:left']]:mr-6 [&_img[style*='float:left']]:mx-0
    [&_img[style*='float:right']]:ml-6 [&_img[style*='float:right']]:mx-0
    [&_.alignleft]:float-left [&_.alignleft]:mr-6 [&_.alignleft]:mb-4 [&_.alignleft]:mx-0
    [&_.alignright]:float-right [&_.alignright]:ml-6 [&_.alignright]:mb-4 [&_.alignright]:mx-0
    [&_.aligncenter]:block [&_.aligncenter]:mx-auto [&_.aligncenter]:mb-4
    [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4
    [&_table]:w-full [&_table]:border-collapse [&_table]:mb-4
    [&_th]:border [&_th]:border-gray-300 [&_th]:p-2 [&_th]:bg-gray-50 [&_th]:text-left
    [&_td]:border [&_td]:border-gray-300 [&_td]:p-2
    after:content-[''] after:table after:clear-both
  `;

  return (
    <div
      className={`${richTextStyles} ${className ?? ""}`}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}