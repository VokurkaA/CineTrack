"use client";

import { createContext, useContext, ReactNode } from "react";
import { Dictionary } from "@/lib/get-dictionary";

const DictionaryContext = createContext<Dictionary | null>(null);

export function DictionaryProvider({
  children,
  dictionary,
}: {
  children: ReactNode;
  dictionary: Dictionary;
}) {
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
