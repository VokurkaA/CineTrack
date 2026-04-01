"use client";

import { Button, cn, Drawer, Separator, Tooltip, Input, Skeleton, useMediaQuery } from "@heroui/react"
import { Icon } from "@iconify/react";
import * as React from "react"
import { useDictionary } from "./DictionaryContext";
import { authClient } from "@/lib/auth-client";
import { useRouter, useParams } from "next/navigation";

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

type SidebarContextProps = {
    state: "expanded" | "collapsed"
    open: boolean
    setOpen: (open: boolean) => void
    openMobile: boolean
    setOpenMobile: (open: boolean) => void
    isMobile: boolean
    toggleSidebar: () => void
}
const SidebarContext = React.createContext<SidebarContextProps | null>(null)

export function useSidebar() {
    const context = React.useContext(SidebarContext)
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider.")
    }
    return context
}

export function SidebarProvider({
    defaultOpen = true,
    open: openProp,
    onOpenChange: setOpenProp,
    className,
    style,
    children,
    ...props
}: React.ComponentProps<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
}) {
    const isMobile = useMediaQuery(`(max-width: ${SIDEBAR_WIDTH_MOBILE})`)
    const [openMobile, setOpenMobile] = React.useState(false)

    // This is the internal state of the sidebar.
    // We use openProp and setOpenProp for control from outside the component.
    const [_open, _setOpen] = React.useState(defaultOpen)
    const open = openProp ?? _open
    const setOpen = React.useCallback(
        (value: boolean | ((value: boolean) => boolean)) => {
            const openState = typeof value === "function" ? value(open) : value
            if (setOpenProp) {
                setOpenProp(openState)
            } else {
                _setOpen(openState)
            }
            // This sets the cookie to keep the sidebar state.
            document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
        },
        [setOpenProp, open]
    )

    // Helper to toggle the sidebar.
    const toggleSidebar = React.useCallback(() => {
        return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open)
    }, [isMobile, setOpen, setOpenMobile])

    // Adds a keyboard shortcut to toggle the sidebar.
    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (
                event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
                (event.metaKey || event.ctrlKey)
            ) {
                event.preventDefault()
                toggleSidebar()
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [toggleSidebar])

    // We add a state so that we can do data-state="expanded" or "collapsed".
    // This makes it easier to style the sidebar with Tailwind classes.
    const state = open ? "expanded" : "collapsed"
    const contextValue = React.useMemo<SidebarContextProps>(
        () => ({
            state,
            open,
            setOpen,
            isMobile,
            openMobile,
            setOpenMobile,
            toggleSidebar,
        }),
        [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    )

    return (
        <SidebarContext.Provider value={contextValue}>
            <div
                data-slot="sidebar-wrapper"
                style={
                    {
                        "--sidebar-width": SIDEBAR_WIDTH,
                        "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                        ...style,
                    } as React.CSSProperties
                }
                className={cn(
                    "group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-background-secondary",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        </SidebarContext.Provider>
    )
}

export const Sidebar = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div"> & {
        side?: "left" | "right"
        variant?: "sidebar" | "floating" | "inset"
        collapsible?: "offcanvas" | "icon" | "none"
    }
>(({ side = "left", variant = "sidebar", collapsible = "offcanvas", className, children, ...props }, ref) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar()
    const dictionary = useDictionary()

    if (collapsible === "none") {
        return (
            <div
                data-slot="sidebar"
                className={cn(
                    "flex h-full w-(--sidebar-width) flex-col bg-background text-foreground",
                    className
                )}
                ref={ref}
                {...props}
            >
                {children}
            </div>
        )
    }

    if (isMobile) {
        return (
            <Drawer>
                <Drawer.Backdrop isOpen={openMobile} onOpenChange={setOpenMobile}>
                    <Drawer.Content placement={side}>
                        <Drawer.Dialog className="w-(--sidebar-width) bg-background p-0 text-foreground outline-none">
                            <Drawer.Header className="sr-only">
                                <Drawer.Heading>{dictionary.sidebar.toggle}</Drawer.Heading>
                            </Drawer.Header>
                            <Drawer.Body className="p-0">
                                <div className="flex h-full w-full flex-col">{children}</div>
                            </Drawer.Body>
                        </Drawer.Dialog>
                    </Drawer.Content>
                </Drawer.Backdrop>
            </Drawer>
        )
    }

    return (
        <div
            ref={ref}
            className="group peer hidden text-foreground md:block"
            data-state={state}
            data-collapsible={state === "collapsed" ? collapsible : ""}
            data-variant={variant}
            data-side={side}
            data-slot="sidebar"
        >
            {/* This is what handles the sidebar gap on desktop */}
            <div
                data-slot="sidebar-gap"
                className={cn(
                    "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
                    "group-data-[collapsible=offcanvas]:w-0",
                    "group-data-[side=right]:rotate-180",
                    variant === "floating" || variant === "inset"
                        ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
                        : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
                )}
            />
            <div
                data-slot="sidebar-container"
                data-side={side}
                className={cn(
                    "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear data-[side=left]:left-0 data-[side=left]:group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)] data-[side=right]:right-0 data-[side=right]:group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)] md:flex",
                    // Adjust the padding for floating and inset variants.
                    variant === "floating" || variant === "inset"
                        ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
                        : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-border group-data-[side=right]:border-border group-data-[side=left]:border-r group-data-[side=right]:border-l",
                    className
                )}
                {...props}
            >
                <div
                    data-sidebar="sidebar"
                    data-slot="sidebar-inner"
                    className="flex size-full flex-col bg-surface group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:shadow-sm group-data-[variant=floating]:ring-1 group-data-[variant=floating]:ring-border"
                >
                    {children}
                </div>
            </div>
        </div>
    )
})
Sidebar.displayName = "Sidebar"

export function SidebarTrigger({
    className,
    onPress,
    ...props
}: React.ComponentProps<typeof Button>) {
    const { toggleSidebar } = useSidebar()
    const dictionary = useDictionary()
    return (
        <Button
            data-sidebar="trigger"
            data-slot="sidebar-trigger"
            variant="ghost"
            size="md"
            className={cn("size-8 p-0", className)}
            onPress={(event) => {
                onPress?.(event)
                toggleSidebar()
            }}
            {...props}
        >
            <Icon className="text-foreground" icon="lucide:panel-left" width="20" height="20" />
            <span className="sr-only">{dictionary.sidebar.toggle}</span>
        </Button>
    )
}

export function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="sidebar-header"
            data-sidebar="header"
            className={cn("flex flex-col gap-2 p-2", className)}
            {...props}
        />
    )
}

export function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="sidebar-footer"
            data-sidebar="footer"
            className={cn("flex flex-col gap-2 p-2", className)}
            {...props}
        />
    )
}

export function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="sidebar-content"
            data-sidebar="content"
            className={cn(
                "no-scrollbar flex min-h-0 flex-1 flex-col gap-0 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
                className
            )}
            {...props}
        />
    )
}

export function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="sidebar-group"
            data-sidebar="group"
            className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
            {...props}
        />
    )
}

export function SidebarGroupLabel({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="sidebar-group-label"
            data-sidebar="group-label"
            className={cn(
                "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-muted outline-none ring-focus transition-[margin,opaicty] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
                "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
                className
            )}
            {...props}
        />
    )
}

export function SidebarGroupAction({
    className,
    ...props
}: React.ComponentProps<typeof Button>) {
    return (
        <Button
            data-slot="sidebar-group-action"
            data-sidebar="group-action"
            variant="ghost"
            className={cn(
                "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-foreground outline-none ring-focus transition-transform hover:bg-surface-hover focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
                // Increases the hit area of the button on mobile.
                "after:absolute after:-inset-2 after:md:hidden",
                "group-data-[collapsible=icon]:hidden",
                className
            )}
            {...props}
        />
    )
}

export function SidebarGroupContent({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="sidebar-group-content"
            data-sidebar="group-content"
            className={cn("w-full text-sm", className)}
            {...props}
        />
    )
}

export function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
    return (
        <ul
            data-slot="sidebar-menu"
            data-sidebar="menu"
            className={cn("flex w-full min-w-0 flex-col gap-1", className)}
            {...props}
        />
    )
}

export function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
    return (
        <li
            data-slot="sidebar-menu-item"
            data-sidebar="menu-item"
            className={cn("group/menu-item relative", className)}
            {...props}
        />
    )
}

export function SidebarMenuButton({
    isActive = false,
    size = "md",
    tooltip,
    className,
    ...props
}: React.ComponentProps<typeof Button> & {
    isActive?: boolean
    tooltip?: string | (Omit<React.ComponentProps<typeof Tooltip>, "children"> & { content: React.ReactNode })
}) {
    const { isMobile, state } = useSidebar()

    const button = (
        <Button
            data-sidebar="menu-button"
            data-slot="sidebar-menu-button"
            data-size={size}
            data-active={isActive}
            variant="ghost"
            className={cn(
                "flex w-full items-center justify-start gap-2 overflow-hidden px-2 py-1 text-left outline-none ring-focus transition-[width,height,padding] hover:bg-surface-hover focus-visible:ring-2 active:bg-surface-tertiary disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 data-[active=true]:bg-accent data-[active=true]:text-accent-foreground data-[active=true]:font-medium data-[state=open]:hover:bg-surface-hover group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span]:last:truncate [&>svg]:size-4 [&>svg]:shrink-0",
                size === "sm" && "h-7 text-xs",
                size === "md" && "h-8 text-sm",
                size === "lg" && "h-12 text-sm group-data-[collapsible=icon]:p-0!",
                className
            )}
            {...props}
        />
    )

    if (!tooltip) {
        return button
    }

    if (typeof tooltip === "string") {
        tooltip = { content: tooltip }
    }

    const { content, ...tooltipProps } = tooltip

    return (
        <Tooltip
            isDisabled={state !== "collapsed" || isMobile}
            {...(tooltipProps as Omit<React.ComponentProps<typeof Tooltip>, "children">)}
        >
            <Tooltip.Trigger>
                {button}
            </Tooltip.Trigger>
            <Tooltip.Content placement="right">
                {content}
            </Tooltip.Content>
        </Tooltip>
    )
}

export function SidebarMenuAction({
    className,
    showOnHover = false,
    ...props
}: React.ComponentProps<typeof Button> & {
    showOnHover?: boolean
}) {
    return (
        <Button
            data-slot="sidebar-menu-action"
            data-sidebar="menu-action"
            variant="ghost"
            className={cn(
                "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-foreground outline-none ring-focus transition-transform hover:bg-surface-hover focus-visible:ring-2 peer-hover/menu-button:text-foreground [&>svg]:size-4 [&>svg]:shrink-0",
                // Increases the hit area of the button on mobile.
                "after:absolute after:-inset-2 after:md:hidden",
                "group-data-[collapsible=icon]:hidden",
                showOnHover &&
                "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0",
                className
            )}
            {...props}
        />
    )
}

export function SidebarMenuBadge({
    className,
    ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="sidebar-menu-badge"
            data-sidebar="menu-badge"
            className={cn(
                "pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-foreground transition-transform duration-200 ease-linear",
                "group-data-[collapsible=icon]:hidden",
                className
            )}
            {...props}
        />
    )
}

export function SidebarMenuSub({ className, ...props }: React.ComponentProps<"ul">) {
    return (
        <ul
            data-slot="sidebar-menu-sub"
            data-sidebar="menu-sub"
            className={cn(
                "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-separator px-2.5 py-0.5",
                "group-data-[collapsible=icon]:hidden",
                className
            )}
            {...props}
        />
    )
}

export function SidebarMenuSubItem({ ...props }: React.ComponentProps<"li">) {
    return <li {...props} />
}

export function SidebarMenuSubButton({
    size = "md",
    isActive,
    className,
    ...props
}: React.ComponentProps<typeof Button> & {
    isActive?: boolean
    size?: "sm" | "md"
}) {
    return (
        <Button
            data-sidebar="menu-sub-button"
            data-slot="sidebar-menu-sub-button"
            data-size={size}
            data-active={isActive}
            variant="ghost"
            className={cn(
                "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-foreground outline-none ring-focus hover:bg-surface-hover focus-visible:ring-2 active:bg-surface-tertiary disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span]:last:truncate [&>svg]:size-4 [&>svg]:shrink-0",
                "data-[active=true]:bg-accent data-[active=true]:text-accent-foreground",
                size === "sm" && "text-xs",
                size === "md" && "text-sm",
                "group-data-[collapsible=icon]:hidden",
                className
            )}
            {...props}
        />
    )
}

export function SidebarMenuSkeleton({
    showIcon = false,
    className,
    ...props
}: React.ComponentProps<"div"> & {
    showIcon?: boolean
}) {
    return (
        <div
            data-slot="sidebar-menu-skeleton"
            data-sidebar="menu-skeleton"
            className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)}
            {...props}
        >
            {showIcon && (
                <Skeleton
                    className="size-4 rounded-md"
                />
            )}
            <Skeleton
                className="h-4 flex-1 max-w-[70%]"
            />
        </div>
    )
}

export function SidebarRail({ className, ...props }: React.ComponentProps<"button">) {
    const { toggleSidebar } = useSidebar()
    const dictionary = useDictionary()

    return (
        <button
            data-sidebar="rail"
            data-slot="sidebar-rail"
            aria-label={dictionary.sidebar.toggle}
            tabIndex={-1}
            onClick={toggleSidebar}
            title={dictionary.sidebar.toggle}
            className={cn(
                "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-0.5 hover:after:bg-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
                "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
                "[[data-side=left][data-state=expanded]_&]:cursor-w-resize [[data-side=right][data-state=expanded]_&]:cursor-e-resize",
                "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-background-secondary",
                "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
                "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
                className
            )}
            {...props}
        />
    )
}

export function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
    return (
        <main
            data-slot="sidebar-inset"
            className={cn(
                "relative flex min-h-svh flex-1 flex-col bg-background",
                "peer-data-[variant=inset]:min-h-[calc(100svh-(--spacing(4)))] peer-data-[variant=inset]:flex-1 peer-data-[variant=inset]:md:m-2 peer-data-[variant=inset]:md:ml-0 peer-data-[variant=inset]:md:rounded-xl peer-data-[variant=inset]:md:shadow",
                className
            )}
            {...props}
        />
    )
}

export function SidebarSeparator({
    className,
    ...props
}: React.ComponentProps<typeof Separator>) {
    return (
        <Separator
            data-slot="sidebar-separator"
            data-sidebar="separator"
            className={cn("mx-2 w-auto bg-separator", className)}
            {...props}
        />
    )
}

export function SidebarInput({
    className,
    ...props
}: React.ComponentProps<typeof Input>) {
    const dictionary = useDictionary()
    return (
        <Input
            data-slot="sidebar-input"
            data-sidebar="input"
            placeholder={dictionary.nav.search}
            className={cn(
                "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-focus",
                className
            )}
            {...props}
        />
    )
}

type AppSidebarProps = { config: { groupLabel: string, menuItems: { icon: string, label: string }[] }[] }

export function AppSidebar({ config }: AppSidebarProps) {
    const dictionary = useDictionary()
    const router = useRouter()
    const params = useParams()
    const lang = params.lang as string
    const { data: session } = authClient.useSession()

    const handleLogout = async () => {
        await authClient.signOut()
        router.push(`/${lang}/login`)
        router.refresh()
    }

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-2 px-2 py-1">
                    <div className="flex size-6 items-center justify-center rounded-sm bg-accent text-accent-foreground">
                        <Icon icon="lucide:command" width="14" height="14" />
                    </div>
                    <span className="font-semibold">{dictionary.common.title}</span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                {config.map((group, index) => (
                    <SidebarGroup key={index}>
                        <SidebarGroupLabel>{group.groupLabel}</SidebarGroupLabel>
                        {group.menuItems.map((item, itemIndex) => (
                            <SidebarMenu key={itemIndex}>
                                <SidebarMenuItem>
                                    <SidebarMenuButton tooltip={item.label}>
                                        <Icon icon={item.icon} />
                                        <span>{item.label}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        ))}
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <Icon icon="lucide:user" />
                            <span>{session?.user?.name || dictionary.sidebar.myAccount}</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton onPress={handleLogout} className="text-danger">
                            <Icon icon="lucide:log-out" />
                            <span>{lang === 'cs' ? 'Odhlásit se' : 'Logout'}</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
