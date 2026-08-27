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

  return (
    <div
      className={className}
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
