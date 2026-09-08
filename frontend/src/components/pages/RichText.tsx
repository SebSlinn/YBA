// src/components/pages/RichText.tsx
import DOMPurify from "isomorphic-dompurify";

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
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "title", "target", "rel", "style", "class", "colspan", "rowspan"],
  });

const richTextStyles = `
    max-w-[800px] mx-auto
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