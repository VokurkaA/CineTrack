"use client";

import { Breadcrumbs as HeroBreadcrumbs } from "@heroui/react";
import { usePathname } from "next/navigation";

interface BreadcrumbsProps {
    locales?: string[];
    labelFormatter?: (segment: string) => string | null;
    homeLabel?: string;
    showHome?: boolean;
}

const DEFAULT_LOCALE_RE = /^[a-z]{2}(-[a-zA-Z]{2,4})?$/;

function isLocaleSegment(segment: string, locales?: string[]): boolean {
    if (locales?.length) return locales.includes(segment);
    return DEFAULT_LOCALE_RE.test(segment);
}

function defaultLabelFormatter(segment: string): string {
    return segment
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function DynamicBreadcrumbs({
    locales,
    labelFormatter,
    homeLabel = "Home",
    showHome = true,
}: BreadcrumbsProps) {
    const pathname = usePathname();

    const rawSegments = pathname.split("/").filter(Boolean);

    const segments =
        rawSegments.length > 0 && isLocaleSegment(rawSegments[0], locales)
            ? rawSegments.slice(1)
            : rawSegments;

    const localePrefix =
        rawSegments.length > 0 && isLocaleSegment(rawSegments[0], locales)
            ? `/${rawSegments[0]}`
            : "";

    type Crumb = { label: string; href: string | undefined };

    const crumbs: Crumb[] = [];

    if (showHome) {
        crumbs.push({ label: homeLabel, href: `${localePrefix}/` });
    }

    segments.forEach((seg, index) => {
        const decoded = decodeURIComponent(seg);
        const fmt = labelFormatter ?? defaultLabelFormatter;
        const label = fmt(decoded);

        if (label === null) return;

        const isLast = index === segments.length - 1;
        const href = isLast
            ? undefined
            : `${localePrefix}/${segments.slice(0, index + 1).join("/")}`;

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