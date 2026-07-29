// src/components/common/RichText.tsx

interface RichTextProps {
  html: string;
}

export default function RichText({ html }: RichTextProps) {
  return (
    <div
      className="
        prose
        prose-lg
        max-w-none

        prose-headings:text-yba-navy
        prose-a:text-blue-700
        prose-img:rounded-xl
      "
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
}