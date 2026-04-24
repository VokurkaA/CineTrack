"use client"

import {Button, cn, Tooltip} from "@heroui/react";
import {useDictionary} from "../DictionaryContext";
import Bars3Icon from "@heroicons/react/24/solid/esm/Bars3Icon";
import {useSidebar} from "./Sidebar";

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