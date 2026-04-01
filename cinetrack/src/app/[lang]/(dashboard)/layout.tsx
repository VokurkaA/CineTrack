import { getDictionary, Locale } from "@/lib/get-dictionary";
import * as React from "react";
import { AppSidebar, SidebarTrigger } from "@/app/components/Sidebar";

export default async function DashboardLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = (await params) as { lang: Locale };
  const dictionary = await getDictionary(lang);

  return (
    <>
      <AppSidebar
        config={[
          {
            groupLabel: dictionary.sidebar.platform.label,
            menuItems: [
              { icon: "lucide:settings", label: dictionary.sidebar.platform.settings },
              { icon: "lucide:pencil-ruler", label: dictionary.sidebar.platform.designEngineering },
            ],
          },
          {
            groupLabel: dictionary.sidebar.playground.label,
            menuItems: [
              { icon: "lucide:folder", label: dictionary.sidebar.playground.projects },
            ],
          },
          {
            groupLabel: dictionary.sidebar.models.label,
            menuItems: [
              { icon: "lucide:bar-chart-2", label: dictionary.sidebar.models.salesMarketing },
              { icon: "lucide:plane", label: dictionary.sidebar.models.travel },
            ],
          },
        ]}
      />
      <main className="w-full">
        <SidebarTrigger />
        {children}
      </main>
    </>
  );
}
