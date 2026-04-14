"use client";

import * as React from "react";
import {
    Avatar,
    Button,
    Chip,
    cn,
    Description,
    Drawer,
    FieldError,
    Form,
    Input,
    Key,
    Label,
    ListBox,
    Modal,
    Popover,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip
} from "@heroui/react";
import {
    Bars3Icon,
    ChevronUpDownIcon,
    ComputerDesktopIcon,
    FilmIcon,
    MoonIcon,
    PencilIcon,
    SunIcon
} from "@heroicons/react/24/outline";
import {useDictionary} from "./DictionaryContext";
import {authClient} from "@/lib/auth-client";
import {useTheme} from "next-themes";
import {LocaleLink} from "./LocaleLink";
import {useLocaleRouter} from "@/hooks/useLocaleRouter";

const IS_OPEN_STORAGE_KEY = "sidebar:open";

type SidebarContextProps = {
    isOpen: boolean; setIsOpen: (open: boolean) => void; toggle: () => void; isMobile: boolean; hydrated: boolean;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

export function useSidebar() {
    const context = React.useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
}

export function SidebarProvider({children}: { children: React.ReactNode }) {
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

    return (<SidebarContext.Provider value={{isOpen, setIsOpen, toggle, isMobile, hydrated}}>
        {children}
    </SidebarContext.Provider>);
}

export function SidebarTrigger({className}: { className?: string }) {
    const {toggle, isMobile, isOpen} = useSidebar();
    const dictionary = useDictionary();

    return (<div
        className={cn("z-50 transition-all duration-300", isMobile ? "fixed left-4 top-4" : "absolute left-4 top-4", className)}>
        <Tooltip>
            <Tooltip.Trigger>
                <Button
                    isIconOnly
                    variant="ghost"
                    onPress={toggle}
                    aria-label={dictionary.sidebar.toggle}
                    size="sm"
                >
                    <Bars3Icon className="size-6"/>
                </Button>
            </Tooltip.Trigger>
            <Tooltip.Content showArrow placement="right">
                <Tooltip.Arrow/>
                {isOpen ? dictionary.sidebar.action.close : dictionary.sidebar.action.open}
            </Tooltip.Content>
        </Tooltip>
    </div>);
}

type AppSidebarProps = {
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

    return (<div className="flex flex-col justify-between h-full w-full text-nowrap overflow-x-hidden">
        <nav aria-label={dictionary.sidebar.navigation} className="flex flex-col gap-4 overflow-y-auto">
            <LocaleLink href="/" aria-label={dictionary.common.title} className="no-underline flex items-center gap-2 p-2">
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
                    className={cn("flex items-center gap-3 px-2 py-2 rounded-xl no-underline text-sm w-full", cleanPathname === item.href ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-surface-secondary")}
                >
                    {item.icon}
                    <span>{item.label}</span>
                </LocaleLink>))}
            </div>))}
        </nav>
        <SidebarAvatarMenu session={session}/>
    </div>);
}

function SidebarAvatarMenu({session}: { session?: ReturnType<typeof authClient.useSession>["data"] }) {
    type ThemeOption = "system" | "dark" | "light";
    const dictionary = useDictionary();
    const userRole = session?.user.role;
    const {setTheme, theme, forcedTheme} = useTheme();
    const [selectedTheme, setSelectedTheme] = React.useState<ThemeOption>(forcedTheme ? (forcedTheme as ThemeOption) : (theme as ThemeOption) ?? "system");

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

    return (<Modal>
        <Modal.Trigger>
            <Button
                variant="ghost"
                className="relative group p-0 text-left flex h-12 w-full items-center justify-start gap-3 rounded-xl hover:bg-surface-secondary px-2"
            >
                <Avatar size="sm" className="bg-transparent border border-border">
                    {session?.user?.image ? (<Avatar.Image
                        alt={session?.user?.name || "Avatar"}
                        src={session?.user?.image || ""}
                        referrerPolicy="no-referrer"
                    />) : (<Avatar.Fallback className="bg-transparent">
                        {session?.user?.name?.[0] || "?"}
                    </Avatar.Fallback>)}
                </Avatar>
                <div className="flex flex-col overflow-hidden">
                        <span
                            className="text-sm font-semibold truncate">{session?.user?.name || dictionary.sidebar.account.placeholder}</span>
                    <span className="text-xs text-muted truncate">{session?.user?.email}</span>
                </div>
                <ChevronUpDownIcon
                    className="text-muted size-4 m-0 top-1 right-1 absolute hidden group-hover:block"/>
            </Button>
        </Modal.Trigger>
        <Modal.Backdrop variant="opaque">
            <Modal.Container placement="top">
                <Modal.Dialog aria-label={dictionary.sidebar.account.placeholder}>
                    <Modal.CloseTrigger aria-label={dictionary.common.close}/>
                    <Modal.Header className="select-none">
                        <Modal.Heading>{dictionary.sidebar.account.placeholder}</Modal.Heading>
                        <AvatarSidebarAvatar session={session}/>
                        <Chip className="w-min" variant="soft" color={userRole === 'admin' ? 'warning' : 'accent'}>
                            {userRole}
                        </Chip>
                        <Label>{dictionary.sidebar.account.title} {session?.user?.name || dictionary.sidebar.account.user}</Label>
                    </Modal.Header>
                    <Modal.Body className="flex flex-col gap-2">
                        <Description>{session?.user.createdAt && session.user.createdAt.toLocaleDateString()}</Description>
                        <Description>{session?.user.email}</Description>
                        <ToggleButtonGroup
                            size="sm"
                            selectionMode="single"
                            disallowEmptySelection
                            selectedKeys={new Set([selectedTheme])}
                            onSelectionChange={handleThemeChange}
                            isDisabled={!!forcedTheme}
                            aria-label={dictionary.sidebar.account.placeholder}
                        >
                            <ToggleButton id="system" aria-label={dictionary.sidebar.theme.system}>
                                <ComputerDesktopIcon className="size-4 text-foreground"/>
                            </ToggleButton>
                            <ToggleButton id="dark" aria-label={dictionary.sidebar.theme.dark}>
                                <ToggleButtonGroup.Separator/>
                                <MoonIcon className="size-4 text-foreground"/>
                            </ToggleButton>
                            <ToggleButton id="light" aria-label={dictionary.sidebar.theme.light}>
                                <ToggleButtonGroup.Separator/>
                                <SunIcon className="size-4 text-foreground"/>
                            </ToggleButton>
                        </ToggleButtonGroup>
                        <Button
                            variant="danger-soft"
                            className="mt-4"
                            onPress={async () => {
                                await authClient.signOut();
                            }}
                            fullWidth
                        >
                            {dictionary.sidebar.account.signout}
                        </Button>
                        <Modal.Footer></Modal.Footer>
                    </Modal.Body>
                </Modal.Dialog>
            </Modal.Container>
        </Modal.Backdrop>
    </Modal>)
}

const AvatarSidebarAvatar = ({session}: { session?: ReturnType<typeof authClient.useSession>["data"] }) => {
    const dictionary = useDictionary();
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const image = formData.get("image") as string;
        if (image) {
            await authClient.updateUser({image});
            setIsModalOpen(false);
        }
    }

    return (<Avatar className="group size-20 mx-auto my-4">
        <Popover isOpen={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <Popover.Trigger>
                <Button variant='ghost'
                        isIconOnly
                        className="absolute z-50 inset-0 h-full w-full scale-110 flex items-center justify-center rounded-full bg-background/50 opacity-0 transition-opacity
                                        group-hover:opacity-100 group-hover:cursor-pointer"
                        aria-label={dictionary.sidebar.account.editAvatar}
                >
                    <PencilIcon className="text-foreground size-6"/>
                </Button>
            </Popover.Trigger>
            <Popover.Content>
                <Popover.Dialog aria-label={dictionary.sidebar.account.editAvatar}>
                    <ListBox 
                        aria-label={dictionary.sidebar.account.editAvatar}
                        onAction={(key) => {
                            setIsPopoverOpen(false);
                            if (key === 'remove') authClient.updateUser({image: ''});
                            if (key === 'upload') setIsModalOpen(true);
                        }}
                    >
                        <ListBox.Item id="remove" textValue={dictionary.sidebar.account.removeAvatar}>
                            <Label>{dictionary.sidebar.account.removeAvatar}</Label>
                            <ListBox.ItemIndicator/>
                        </ListBox.Item>
                        <ListBox.Item id="upload" textValue={dictionary.sidebar.account.uploadAvatar}>
                            <Label>{dictionary.sidebar.account.uploadAvatar}</Label>
                            <ListBox.ItemIndicator/>
                        </ListBox.Item>
                    </ListBox>
                </Popover.Dialog>
            </Popover.Content>
        </Popover>

        <Modal>
            <Modal.Backdrop variant='blur' isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
                <Modal.Container>
                    <Modal.Dialog aria-label={dictionary.sidebar.account.uploadAvatar}>
                        <Modal.CloseTrigger aria-label={dictionary.common.close}/>
                        <Modal.Header className='my-4'>
                            <Modal.Heading>{dictionary.sidebar.account.uploadAvatar}</Modal.Heading>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                                <TextField
                                    name="image"
                                    fullWidth
                                    validate={(value) => {
                                        if (!value) return true;
                                        const regex = /^https?:\/\/\S+$/i;
                                        if (!regex.test(value)) {
                                            return dictionary.sidebar.account.invalidUrl;
                                        }
                                        return true;
                                    }}
                                >
                                    <Label>{dictionary.sidebar.account.uploadAvatar}</Label>
                                    <Input variant='secondary' placeholder="https://..." type="url"/>
                                    <FieldError/>
                                </TextField>
                                <Button type='submit' fullWidth>{dictionary.common.ok}</Button>
                            </Form>
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>

        {session?.user?.image ? (<Avatar.Image
            alt={session?.user?.name || "Avatar"}
            src={session?.user?.image || ""}
            referrerPolicy="no-referrer"
        />) : (<Avatar.Fallback className="size-6">
            {session?.user?.name?.[0] || "?"}
        </Avatar.Fallback>)}
    </Avatar>)
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