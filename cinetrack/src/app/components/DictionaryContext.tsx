"use client";

import { createContext, useContext, ReactNode, useEffect } from "react";
import { Dictionary, Locale } from "@/lib/get-dictionary";
import { useParams } from "next/navigation";

const DictionaryContext = createContext<Dictionary | null>(null);

export function DictionaryProvider({
  children,
  dictionary,
}: {
  children: ReactNode;
  dictionary: Dictionary;
}) {
  const params = useParams();
  const lang = (Array.isArray(params.lang) ? params.lang[0] : params.lang) as Locale;

  useEffect(() => {
    if (lang) {
      document.cookie = `better-auth-locale=${lang}; path=/; max-age=31536000`;
    }
  }, [lang]);

  return (
    <DictionaryContext.Provider value={dictionary}>
      {children}
    </DictionaryContext.Provider>
  );
}

export function useDictionary() {
  const context = useContext(DictionaryContext);
  if (!context) {
    throw new Error("useDictionary must be used within a DictionaryProvider");
  }
  return context;
}
