"use client";
import {usePathname} from "next/navigation";
import {Link, LinkIcon, LinkRoot} from "@heroui/react";
import type {ComponentProps} from "react";
import {forwardRef} from "react";

const LocaleLinkBase = forwardRef<HTMLAnchorElement, ComponentProps<typeof Link>>(function LocaleLink({
                                                                                                          href = "",
                                                                                                          ...props
                                                                                                      }, ref) {
    const locale = usePathname().split("/")[1];
    return <Link ref={ref} href={`/${locale}${href}`} {...props} />;
});

/**
 * Compound component for localized links.
 * Inherits all HeroUI Link properties and static components.
 */
export const LocaleLink = Object.assign(LocaleLinkBase, {
    displayName: "LocaleLink", Icon: LinkIcon, Root: LinkRoot,
}) as unknown as typeof Link;