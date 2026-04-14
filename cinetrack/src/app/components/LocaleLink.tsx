"use client";
import { usePathname } from "next/navigation";
import { Link } from "@heroui/react";
import type { ComponentProps } from "react";

type LinkComponent = typeof Link;

export const LocaleLink = (({ href = "", ...props }: ComponentProps<typeof Link>) => {
    const locale = usePathname().split("/")[1];
    return <Link href={`/${locale}${href}`} {...props} />;
}) as LinkComponent;

// Copy static properties (like Icon)
Object.assign(LocaleLink, Link);