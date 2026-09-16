// src/components/pages/RichText.tsx
import DOMPurify from "isomorphic-dompurify";

// Registered once at module load (not per-render) — DOMPurify hooks are
// global, so adding one inside the component function would stack a new
// duplicate hook on every re-render.
//
// iframe embeds can run arbitrary third-party JavaScript, so unlike
// everything else in this sanitizer they're scoped to a fixed allow-list
// of known video-platform hostnames rather than trusted purely because
// staff authored the content. Anything else gets the iframe stripped
// entirely rather than rendered with an untrusted src.
const TRUSTED_IFRAME_HOSTS = ["player.vimeo.com"];

// Do Not Track is forced onto every trusted iframe here, unconditionally,
// regardless of what staff pasted in Directus. This isn't staff-editable
// by design — the point is nobody needs to remember to add it. With
// dnt=1, Vimeo sets only its four essential/security cookies (bot
// protection) and never its analytics cookie (vuid), so no cookie
// consent banner is needed for embedded video at all: there's no
// non-essential cookie being set in the first place to get consent for.
const FORCED_PARAMS: Record<string, Record<string, string>> = {
  "player.vimeo.com": { dnt: "1" },
};

DOMPurify.addHook("uponSanitizeElement", (node, data) => {
  if (data.tagName === "iframe") {
    const src = (node as HTMLIFrameElement).getAttribute?.("src") ?? "";

    let url: URL | null = null;
    try {
      url = new URL(src);
    } catch {
      // Not a valid absolute URL at all — definitely not trusted.
    }

    if (!url || !TRUSTED_IFRAME_HOSTS.includes(url.hostname)) {
      node.parentNode?.removeChild(node);
      return;
    }

    const forced = FORCED_PARAMS[url.hostname];
    if (forced) {
      for (const [key, value] of Object.entries(forced)) {
        url.searchParams.set(key, value);
      }
      (node as HTMLIFrameElement).setAttribute("src", url.toString());
    }
    return;
  }

  // Same idea, for outbound links: any link staff set to open in a new
  // tab (e.g. a Google Forms link) gets rel="noopener noreferrer" forced
  // on regardless of whether they typed it — noreferrer stops the browser
  // sending a Referer header at all to the destination site (so it can't
  // even see which page, or which site, linked to it), and noopener is
  // the standard guard against the new tab reaching back into this one
  // via window.opener. This overwrites any partial or missing rel value
  // rather than trusting staff got it right.
  if (data.tagName === "a") {
    const el = node as HTMLAnchorElement;
    if (el.getAttribute?.("target") === "_blank") {
      el.setAttribute("rel", "noopener noreferrer");
    }
  }
});

interface RichTextProps {
  /** Raw HTML from a Directus WYSIWYG field (e.g. Page.content). */
  html: string;
  className?: string;
}

export function RichText({ html, className }: RichTextProps) {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p", "br", "strong", "em", "u", "s", "span",
      "h1", "h2", "h3", "h4", "h5", "h6",
      "ul", "ol", "li",
      "a", "img",
      "blockquote", "code", "pre",
      "table", "thead", "tbody", "tr", "th", "td", "colgroup", "col",
      "iframe",
    ],
    ALLOWED_ATTR: [
      "href", "src", "alt", "title", "target", "rel", "style", "class", "colspan", "rowspan",
      "frameborder", "allow", "allowfullscreen", "width", "height",
    ],
  });

const richTextStyles = `
    max-w-[800px] mx-auto px-4
    [&_p]:mb-4 [&_p]:leading-relaxed
    [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4
    [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3
    [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3
    [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:mt-4 [&_h4]:mb-2
    [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4
    [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4
    [&_li]:mb-1
    [&_a]:text-blue-600 [&_a]:underline [&_a:hover]:text-blue-800
    [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-md [&_img]:mb-4 [&_img]:mx-auto [&_img]:block
    [&_img:has(+img)]:inline-block [&_img:has(+img)]:w-[220px] [&_img:has(+img)]:m-1 [&_img:has(+img)]:align-top
    [&_img+img]:inline-block [&_img+img]:w-[220px] [&_img+img]:m-1 [&_img+img]:align-top
    [&_.alignleft]:float-left [&_.alignleft]:mr-6 [&_.alignleft]:mb-4 [&_.alignleft]:mx-0
    [&_.alignright]:float-right [&_.alignright]:ml-6 [&_.alignright]:mb-4 [&_.alignright]:mx-0
    [&_.aligncenter]:block [&_.aligncenter]:mx-auto [&_.aligncenter]:mb-4
    [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4
    [&_table]:w-full [&_table]:max-w-[950px] [&_table]:mx-auto [&_table]:my-6 [&_table]:border-collapse [&_table]:table-fixed
    [&_th]:bg-[#2F3559] [&_th]:text-white [&_th]:text-left [&_th]:p-3 [&_th]:border [&_th]:border-[#2F3559]
    [&_td]:p-[9px] [&_td]:border [&_td]:border-[#d5d7df]
    [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:mb-4 [&_iframe]:rounded-md
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
