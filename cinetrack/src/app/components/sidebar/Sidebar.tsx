"use client";

import * as React from "react";
import {cn, Drawer} from "@heroui/react";
import {FilmIcon,} from "@heroicons/react/24/outline";
import {useDictionary} from "../DictionaryContext";
import {authClient} from "@/lib/auth-client";
import {LocaleLink} from "../LocaleLink";
import {useLocaleRouter} from "@/hooks/useLocaleRouter";
import {AvatarMenu} from "./AvatarMenu";

type SidebarContextProps = {
    isOpen: boolean; setIsOpen: (open: boolean) => void; toggle: () => void; isMobile: boolean; hydrated: boolean;
};

export const SidebarContext = React.createContext<SidebarContextProps | null>(null);

export function useSidebar() {
    const context = React.useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
}

export type AppSidebarProps = {
    config: {
        groupLabel: string; menuItems: {
            icon: React.ReactNode; label: string; href?: string;
        }[]
    }[]
}

function SidebarContent({config}: AppSidebarProps) {
    const dictionary = useDictionary();
    const {data: session} = authClient.useSession();
    const {cleanPathname} = useLocaleRouter();
    const {isMobile, setIsOpen} = useSidebar();

    return (<div className="flex flex-col justify-between h-full w-full text-nowrap overflow-x-hidden">
        <nav aria-label={dictionary.sidebar.navigation} className="flex flex-col gap-4 overflow-y-auto">
            <LocaleLink href="/" aria-label={dictionary.common.title}
                        onPress={() => isMobile && setIsOpen(false)}
                        className="no-underline flex items-center gap-2 p-2">
                <FilmIcon className="size-8 text-primary"/>
                <span
                    className="text-2xl font-black text-foreground tracking-tight">{dictionary.common.title}</span>
            </LocaleLink>

            {config.map((group, groupIndex) => (<div key={groupIndex} className="flex flex-col gap-1">
                        <span className="px-2 text-xs font-semibold text-muted uppercase tracking-wider">
                            {group.groupLabel}
                        </span>
                {group.menuItems.map((item) => (<LocaleLink
                    key={item.href}
                    href={item.href}
                    aria-label={item.label}
                    onPress={() => isMobile && setIsOpen(false)}
                    className={cn("flex items-center gap-3 px-2 py-2 rounded-xl no-underline text-sm w-full", cleanPathname === item.href ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-surface-secondary")}
                >
                    {item.icon}
                    <span>{item.label}</span>
                </LocaleLink>))}
            </div>))}
        </nav>
        <AvatarMenu session={session}/>
    </div>);
}

export function AppSidebar({config}: AppSidebarProps) {
    const {isOpen, setIsOpen, isMobile, hydrated} = useSidebar();
    const dictionary = useDictionary();

    if (isMobile) {
        return (<Drawer>
            <Drawer.Backdrop isOpen={isOpen} onOpenChange={setIsOpen}>
                <Drawer.Content placement="left">
                    <Drawer.Dialog className="p-0 h-full max-w-70" aria-label={dictionary.sidebar.navigation}>
                        <Drawer.Header className="sr-only">
                            <Drawer.Heading>{dictionary.sidebar.navigation}</Drawer.Heading>
                        </Drawer.Header>
                        <Drawer.Body className="p-4">
                            <SidebarContent config={config}/>
                        </Drawer.Body>
                    </Drawer.Dialog>
                </Drawer.Content>
            </Drawer.Backdrop>
        </Drawer>);
    }

    return (<aside
        className={cn("bg-surface h-svh flex flex-col border-border border-r overflow-hidden p-4 w-60", !hydrated && "transition-none", hydrated && "transition-all duration-300", !isOpen && "w-0 p-0")}>
        <SidebarContent config={config}/>
    </aside>);
}