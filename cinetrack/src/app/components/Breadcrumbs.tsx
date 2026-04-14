"use client";

import { Breadcrumbs as HeroBreadcrumbs } from "@heroui/react";
import { useLocaleRouter } from "@/hooks/useLocaleRouter";

interface BreadcrumbsProps {
    labelFormatter?: (segment: string) => string | null;
    homeLabel?: string;
    showHome?: boolean;
}

function defaultLabelFormatter(segment: string): string {
    return segment
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function DynamicBreadcrumbs({
    labelFormatter,
    homeLabel = "Home",
    showHome = true,
}: BreadcrumbsProps) {
    const { cleanPathname } = useLocaleRouter();

    const segments = cleanPathname.split("/").filter(Boolean);

    type Crumb = { label: string; href: string | undefined };

    const crumbs: Crumb[] = [];

    if (showHome) {
        crumbs.push({ label: homeLabel, href: `/` });
    }

    segments.forEach((seg, index) => {
        const decoded = decodeURIComponent(seg);
        const fmt = labelFormatter ?? defaultLabelFormatter;
        const label = fmt(decoded);

        if (label === null) return;

        const isLast = index === segments.length - 1;
        const href = isLast
            ? undefined
            : `/${segments.slice(0, index + 1).join("/")}`;

        crumbs.push({ label, href });
    });

    if (crumbs.length <= 1) return null;

    return (
        <HeroBreadcrumbs>
            {crumbs.map(({ label, href }) => (
                <HeroBreadcrumbs.Item
                    key={href || label}
                    href={href}
                >
                    {label}
                </HeroBreadcrumbs.Item>
            ))}
        </HeroBreadcrumbs>
    );
}