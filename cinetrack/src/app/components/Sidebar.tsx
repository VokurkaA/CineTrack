"use client";

import * as React from "react";
import { cn, Button, Link, Drawer, Avatar, ListBox, Label, Header } from "@heroui/react";
import { usePathname } from "next/navigation";
import { Bars3Icon, ChevronUpDownIcon, FilmIcon } from "@heroicons/react/24/outline";
import { useDictionary } from "./DictionaryContext";
import { authClient } from "@/lib/auth-client";

type SidebarContextProps = {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    toggle: () => void;
    isMobile: boolean;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

export function useSidebar() {
    const context = React.useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = React.useState(true);
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) setIsOpen(false);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const toggle = React.useCallback(() => setIsOpen((prev) => !prev), []);

    return (
        <SidebarContext.Provider value={{ isOpen, setIsOpen, toggle, isMobile }}>
            {children}
        </SidebarContext.Provider>
    );
}

/**
 * SidebarTrigger
 */
export function SidebarTrigger({ className }: { className?: string }) {
    const { toggle, isMobile } = useSidebar();
    const dictionary = useDictionary();

    return (
        <Button
            isIconOnly
            variant="ghost"
            onPress={toggle}
            aria-label={dictionary.sidebar.toggle}
            className={cn(
                "z-50 transition-all duration-300",
                isMobile ? "fixed left-4 top-4" : "absolute left-4 top-4",
                className
            )}
            size="sm"
        >
            <Bars3Icon className="size-6" />
        </Button>
    );
}

type AppSidebarProps = {
    config: {
        groupLabel: string;
        menuItems: {
            icon: React.ReactNode;
            label: string;
            href?: string;
        }[]
    }[]
}

function SidebarContent({ config }: AppSidebarProps) {
    const dictionary = useDictionary();
    const { data: session } = authClient.useSession();
    const pathname = usePathname();

    return (
        <div className="flex flex-col justify-between h-full w-full text-nowrap overflow-x-hidden">
            <div className="flex flex-col gap-4 overflow-y-auto">
                <Link href="/" className="no-underline flex items-center gap-2 p-2">
                    <FilmIcon className="size-8 text-primary" />
                    <span className="text-2xl font-black text-foreground tracking-tight">{dictionary.common.title}</span>
                </Link>
                <ListBox
                    selectionMode="single"
                    className="flex-1 p-0"
                    selectedKeys={new Set([pathname])}
                >
                    {config.map((group, groupIndex) => (
                        <ListBox.Section key={groupIndex}>
                            <Header>{group.groupLabel}</Header>

                            {group.menuItems.map((item) => (
                                <ListBox.Item
                                    href={item.href}
                                    id={item.href}
                                    key={item.href}
                                    textValue={item.label}
                                    className="gap-3"
                                >
                                    {item.icon}
                                    <Label>{item.label}</Label>
                                </ListBox.Item>
                            ))}
                        </ListBox.Section>
                    ))}
                </ListBox>
            </div>
            <Button
                variant="ghost"
                className="relative group p-0 text-left flex h-12 w-full items-center justify-start gap-3 rounded-xl hover:bg-surface-secondary px-2">
                <Avatar size="sm" className="bg-transparent border border-border">
                    {session?.user?.image ? (
                        <Avatar.Image alt={session.user.name || "Avatar"} src={session.user.image} />
                    ) : (
                        <Avatar.Fallback className="bg-transparent">
                            {session?.user?.name?.[0] || "?"}
                        </Avatar.Fallback>)}
                </Avatar>
                <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-semibold truncate">{session?.user?.name || dictionary.sidebar.myAccount}</span>
                    <span className="text-xs text-muted truncate">{session?.user?.email}</span>
                </div>
                <ChevronUpDownIcon className="text-muted size-4 m-0 top-1 right-1 absolute hidden group-hover:block" />
            </Button>
        </div>
    );
}

export function AppSidebar({ config }: AppSidebarProps) {
    const { isOpen, setIsOpen, isMobile } = useSidebar();

    if (isMobile) {
        return (
            <Drawer>
                <Drawer.Backdrop isOpen={isOpen} onOpenChange={setIsOpen}>
                    <Drawer.Content placement="left">
                        <Drawer.Dialog className="p-0 h-full max-w-70">
                            <Drawer.Body className="p-4">
                                <SidebarContent config={config} />
                            </Drawer.Body>
                        </Drawer.Dialog>
                    </Drawer.Content>
                </Drawer.Backdrop>
            </Drawer>
        )
    }

    return (
        <aside className={cn(
            "bg-surface h-svh flex flex-col border-border border-r overflow-hidden p-4 w-60 transition-all duration-300",
            !isOpen && "w-0 p-0 border-r-0"
        )}>
            <SidebarContent config={config} />
        </aside>
    );
}
