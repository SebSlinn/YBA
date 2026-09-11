// frontend/src/app/(site)/layout.tsx
//
// Your real file — now async, fetching the primary menu once server-side
// via ServiceFactory and handing it to Header as a prop. Footer and
// <main> untouched.

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getMenuService } from "@/services/ServiceFactory";

// Re-check Directus for menu changes at most once a minute, so a content
// creator's edit shows up without a redeploy. Drop this (or change the
// value) if you already have a different revalidation convention
// elsewhere in the app and want to match it instead.
export const revalidate = 60;

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const menuItems = await getMenuService().getMenu("primary");

  return (
    <>
      <Header items={menuItems} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
