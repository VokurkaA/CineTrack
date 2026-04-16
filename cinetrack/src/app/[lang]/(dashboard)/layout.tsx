import { getDictionary, Locale } from "@/lib/get-dictionary";
import * as React from "react";
import { AppSidebar } from "@/app/components/sidebar/Sidebar";
import { BanknotesIcon, Cog6ToothIcon, GlobeAsiaAustraliaIcon, PaperAirplaneIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { SessionGuard } from "@/app/components/SessionGuard";
import { SidebarTrigger } from "@/app/components/sidebar/Trigger";

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
    <div className="flex min-h-svh bg-background">
      <AppSidebar
        config={[
          {
            groupLabel: dictionary.sidebar.platform.label,
            menuItems: [
              {
                icon: <Cog6ToothIcon className="size-4" />,
                label: dictionary.sidebar.platform.settings,
                href: '/settings'
              },
              {
                icon: <PencilSquareIcon className="size-4" />,
                label: dictionary.sidebar.platform.designEngineering,
                href: '/design'
              },
            ],
          },
          {
            groupLabel: dictionary.sidebar.playground.label,
            menuItems: [
              {
                icon: <GlobeAsiaAustraliaIcon className="size-4" />,
                label: dictionary.sidebar.playground.projects,
                href: '/projects'
              },
            ],
          },
          {
            groupLabel: dictionary.sidebar.models.label,
            menuItems: [
              {
                icon: <BanknotesIcon className="size-4" />,
                label: dictionary.sidebar.models.salesMarketing,
                href: '/sales'
              },
              {
                icon: <PaperAirplaneIcon className="size-4" />,
                label: dictionary.sidebar.models.travel,
                href: '/travel'
              },
            ],
          },
        ]}
      />
      <main className="flex-1 p-4 md:p-8 pt-16 md:pt-8 relative">
        <SidebarTrigger />
        <SessionGuard />
        {children}
      </main>
    </div>
  );
}
