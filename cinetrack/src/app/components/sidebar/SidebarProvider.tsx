import React from "react";
import {SidebarContext} from "./Sidebar";

const IS_OPEN_STORAGE_KEY = "sidebar:open";

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