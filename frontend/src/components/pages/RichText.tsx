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
    // Adjust as needed once real content is authored — this default set
    // covers what Directus's WYSIWYG toolbar produces (headings, lists,
    // links, inline images, basic formatting).
    ALLOWED_TAGS: [
      "p", "br", "strong", "em", "u", "s",
      "h1", "h2", "h3", "h4", "h5", "h6",
      "ul", "ol", "li",
      "a", "img",
      "blockquote", "code", "pre",
      "table", "thead", "tbody", "tr", "th", "td",
    ],
    // "style" and "class" are included because Directus's WYSIWYG image
    // toolbar applies float/alignment via one of these two (exactly which
    // depends on your Directus version — see the note below). This content
    // is only ever authored by trusted staff through the Directus admin,
    // not submitted by the public, so allowing style here is a reasonable
    // trade-off — DOMPurify still sanitizes the CSS value itself (no
    // expression()/url(javascript:) etc. gets through).
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
    [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-md [&_img]:mb-4
    [&_img[style*='float:left']]:mr-6
    [&_img[style*='float:right']]:ml-6
    [&_.alignleft]:float-left [&_.alignleft]:mr-6 [&_.alignleft]:mb-4
    [&_.alignright]:float-right [&_.alignright]:ml-6 [&_.alignright]:mb-4
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

/**
 * If your Directus WYSIWYG image toolbar produces class names instead of
 * inline styles (WordPress-style: alignleft/alignright/aligncenter — worth
 * checking, since that's what ysgolbrynalyn.co.uk's current WordPress site
 * uses), add matching rules wherever this component's styles live:
 *
 *   .alignright { float: right; margin: 0 0 1rem 1.5rem; }
 *   .alignleft  { float: left;  margin: 0 1.5rem 1rem 0; }
 *   .aligncenter { display: block; margin: 0 auto 1rem; }
 *
 * If it produces inline `style="float:right"` instead, no extra CSS is
 * needed — the sanitized inline style renders as-is. Check which one your
 * install does by authoring a test image + alignment in Directus, saving,
 * then inspecting the raw `content` field value via the Directus API or
 * admin UI's "Raw value" view.
 */
