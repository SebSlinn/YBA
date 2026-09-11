//frontend/src/app/%28site%29/%5Bslug%5D/page.tsx

import { notFound } from "next/navigation";
import { getPageService } from "@/services/ServiceFactory";
import { RichText } from "@/components/pages/RichText";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string; auth_token?: string }>;
}

export default async function StandardPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { preview, auth_token } = await searchParams;
  const isPreview = preview === "true" && !!auth_token;

  const pageService = getPageService();
  const page = await pageService.getBySlug(slug, isPreview ? auth_token : undefined);

  if (!page) {
    notFound();
  }

  return (
    // pt-[82px] matches Header's fixed h-[82px] exactly — News/Events avoid this
    // because their Hero component provides that clearance itself; plain content
    // pages have no Hero, so they need it directly on the wrapper instead.
    <main className="pt-[82px]">
      {isPreview && (
        <div style={{ background: "#D5008F", color: "white", textAlign: "center", padding: "0.5rem" }}>
          You&apos;re viewing a draft preview — this page is not live.
        </div>
      )}
      <h1>{page.title}</h1>
      <RichText html={page.content} />
    </main>
  );
}

export async function generateMetadata({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { preview, auth_token } = await searchParams;
  const isPreview = preview === "true" && !!auth_token;

  const pageService = getPageService();
  const page = await pageService.getBySlug(slug, isPreview ? auth_token : undefined);

  return {
    title: page?.title ?? "Page not found",
  };
}
