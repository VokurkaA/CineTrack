"use client";

import * as React from "react";
import { cn, Button, Link, Drawer, Avatar, Tooltip, Modal, ToggleButtonGroup, ToggleButton, Key } from "@heroui/react";
import { usePathname } from "next/navigation";
import { Bars3Icon, ChevronUpDownIcon, ComputerDesktopIcon, FilmIcon, MoonIcon, PencilIcon, SunIcon } from "@heroicons/react/24/outline";
import { useDictionary } from "./DictionaryContext";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "next-themes";

const IS_OPEN_STORAGE_KEY = "sidebar:open";

type SidebarContextProps = {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    toggle: () => void;
    isMobile: boolean;
    hydrated: boolean;
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
    const [hydrated, setHydrated] = React.useState(false);

    React.useEffect(() => {
        const stored = localStorage.getItem(IS_OPEN_STORAGE_KEY);
        if (stored !== null) setIsOpen(stored === "true");
        setHydrated(true);

        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) setIsOpen(false);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    React.useEffect(() => {
        if (hydrated && !isMobile) {
            localStorage.setItem(IS_OPEN_STORAGE_KEY, String(isOpen));
        }
    }, [isOpen, isMobile, hydrated]);

    const toggle = React.useCallback(() => setIsOpen((prev) => !prev), []);

    return (
        <SidebarContext.Provider value={{ isOpen, setIsOpen, toggle, isMobile, hydrated }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function SidebarTrigger({ className }: { className?: string }) {
    const { toggle, isMobile, isOpen } = useSidebar();
    const dictionary = useDictionary();

    return (
        <div className={cn(
            "z-50 transition-all duration-300",
            isMobile ? "fixed left-4 top-4" : "absolute left-4 top-4",
            className
        )}>
            <Tooltip>
                <Tooltip.Trigger>
                    <Button
                        isIconOnly
                        variant="ghost"
                        onPress={toggle}
                        aria-label={dictionary.sidebar.toggle}
                        size="sm"
                    >
                        <Bars3Icon className="size-6" />
                    </Button>
                </Tooltip.Trigger>
                <Tooltip.Content showArrow placement="right">
                    <Tooltip.Arrow />
                    {isOpen ? dictionary.sidebar.action.close : dictionary.sidebar.action.open}
                </Tooltip.Content>
            </Tooltip>
        </div>
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
            <nav aria-label={dictionary.sidebar.navigation} className="flex flex-col gap-4 overflow-y-auto">
                <Link href="/" className="no-underline flex items-center gap-2 p-2">
                    <FilmIcon className="size-8 text-primary" />
                    <span className="text-2xl font-black text-foreground tracking-tight">{dictionary.common.title}</span>
                </Link>

                {config.map((group, groupIndex) => (
                    <div key={groupIndex} className="flex flex-col gap-1">
                        <span className="px-2 text-xs font-semibold text-muted uppercase tracking-wider">
                            {group.groupLabel}
                        </span>
                        {group.menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-2 py-2 rounded-xl no-underline text-sm w-full",
                                    pathname === item.href
                                        ? "bg-primary/10 text-primary font-medium"
                                        : "text-foreground hover:bg-surface-secondary"
                                )}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </div>
                ))}
            </nav>
            <SidebarAvatarMenu session={session} />
        </div>
    );
}

function SidebarAvatarMenu({ session }: { session?: ReturnType<typeof authClient.useSession>["data"] }) {
    type ThemeOption = "system" | "dark" | "light";
    const dictionary = useDictionary();
    const { setTheme, theme, forcedTheme } = useTheme();
    const [selectedTheme, setSelectedTheme] = React.useState<ThemeOption>(
        forcedTheme ? (forcedTheme as ThemeOption) : (theme as ThemeOption) ?? "system"
    );

    React.useEffect(() => {
        if (forcedTheme) {
            setSelectedTheme(forcedTheme as ThemeOption);
        } else if (theme) {
            setSelectedTheme(theme as ThemeOption);
        }
    }, [theme, forcedTheme]);

    const handleThemeChange = (keys: Set<Key>) => {
        const selected = [...keys][0] as ThemeOption;
        if (!selected) return;
        setSelectedTheme(selected);
        setTheme(selected);
    };

    return (
        <Modal isOpen>
            <Modal.Trigger>
                <Button
                    variant="ghost"
                    onPress={() => { }}
                    className="relative group p-0 text-left flex h-12 w-full items-center justify-start gap-3 rounded-xl hover:bg-surface-secondary px-2"
                >
                    <Avatar size="sm" className="bg-transparent border border-border">
                        {session?.user?.image ? (
                            <Avatar.Image alt={session.user.name || "Avatar"} src={session.user.image} />
                        ) : (
                            <Avatar.Fallback className="bg-transparent">
                                {session?.user?.name?.[0] || "?"}
                            </Avatar.Fallback>
                        )}
                    </Avatar>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-semibold truncate">{session?.user?.name || dictionary.sidebar.account.placeholder}</span>
                        <span className="text-xs text-muted truncate">{session?.user?.email}</span>
                    </div>
                    <ChevronUpDownIcon className="text-muted size-4 m-0 top-1 right-1 absolute hidden group-hover:block" />
                </Button>
            </Modal.Trigger>
            <Modal.Backdrop variant="opaque">
                <Modal.Container>
                    <Modal.Dialog>
                        <Modal.CloseTrigger />
                        <Modal.Header className="select-none">
                            <Modal.Heading>{dictionary.sidebar.account.placeholder}</Modal.Heading>
                            <Avatar className="group size-20 mx-auto my-4">
                                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/50 opacity-0 transition-opacity group-hover:opacity-100 group-hover:cursor-pointer">
                                    <PencilIcon className="text-foreground size-6" />
                                </div>
                                {session?.user?.image ? (
                                    <Avatar.Image className="size-6" alt={session.user.name || "Avatar"} src={session.user.image} />
                                ) : (
                                    <Avatar.Fallback className="size-6">
                                        {session?.user?.name?.[0] || "?"}
                                    </Avatar.Fallback>
                                )}
                            </Avatar>
                            <p>{dictionary.sidebar.account.title} {session?.user?.name || dictionary.sidebar.account.user}</p>
                        </Modal.Header>
                        <Modal.Body>
                            <p>{session?.user.createdAt && session.user.createdAt.toLocaleDateString()}</p>
                            <p>{session?.user.email}</p>
                            <ToggleButtonGroup
                                size="sm"
                                selectionMode="single"
                                disallowEmptySelection
                                selectedKeys={new Set([selectedTheme])}
                                onSelectionChange={handleThemeChange}
                                isDisabled={!!forcedTheme}
                            >
                                <ToggleButton id="system">
                                    <ComputerDesktopIcon className="size-4 text-foreground" />
                                </ToggleButton>
                                <ToggleButton id="dark">
                                    <ToggleButtonGroup.Separator />
                                    <MoonIcon className="size-4 text-foreground" />
                                </ToggleButton>
                                <ToggleButton id="light">
                                    <ToggleButtonGroup.Separator />
                                    <SunIcon className="size-4 text-foreground" />
                                </ToggleButton>
                            </ToggleButtonGroup>
                            <Button variant="danger-soft" className="mt-4" onPress={() => authClient.signOut()} fullWidth>
                                {dictionary.sidebar.account.signout}
                            </Button>
                            <Modal.Footer></Modal.Footer>
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}
export function AppSidebar({ config }: AppSidebarProps) {
    const { isOpen, setIsOpen, isMobile, hydrated } = useSidebar();
    const dictionary = useDictionary();

    if (isMobile) {
        return (
            <Drawer>
                <Drawer.Backdrop isOpen={isOpen} onOpenChange={setIsOpen}>
                    <Drawer.Content placement="left">
                        <Drawer.Dialog className="p-0 h-full max-w-70" aria-label={dictionary.sidebar.navigation}>
                            <Drawer.Header className="sr-only">
                                <Drawer.Heading>{dictionary.sidebar.navigation}</Drawer.Heading>
                            </Drawer.Header>
                            <Drawer.Body className="p-4">
                                <SidebarContent config={config} />
                            </Drawer.Body>
                        </Drawer.Dialog>
                    </Drawer.Content>
                </Drawer.Backdrop>
            </Drawer>
        );
    }

    return (
        <aside className={cn(
            "bg-surface h-svh flex flex-col border-border border-r overflow-hidden p-4 w-60",
            !hydrated && "transition-none",
            hydrated && "transition-all duration-300",
            !isOpen && "w-0 p-0"
        )}>
            <SidebarContent config={config} />
        </aside>
    );
}