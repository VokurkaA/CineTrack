import { Providers } from "@/app/providers";
import { getDictionary, Locale } from "@/lib/get-dictionary";
import "../globals.css";
import { Metadata } from "next";
import * as React from "react";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "cs" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = (await params) as { lang: Locale };
  const dictionary = await getDictionary(lang);

  return {
    title: dictionary.common.title,
    description: dictionary.common.description,
  };
}

export default async function LangLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = (await params) as { lang: Locale };
  const dictionary = await getDictionary(lang);

  return (
    <div lang={lang} className="w-full h-full flex flex-col">
      <Providers dictionary={dictionary}>
        {children}
      </Providers>
    </div>
  );
}
