"use client";

import { ThemeProvider } from "next-themes";
import { Toast } from "@heroui/react";
import { ReactNode } from "react";
import { DictionaryProvider } from "./components/DictionaryContext";
import { Dictionary } from "@/lib/get-dictionary";
import { SidebarProvider } from "./components/sidebar/SidebarProvider";

export function Providers({ children, dictionary }: { children: ReactNode; dictionary: Dictionary }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      // forcedTheme="light"
      // disableTransitionOnChange
    >
      <DictionaryProvider dictionary={dictionary}>
        <Toast.Provider placement="top start">
        </Toast.Provider>
        <SidebarProvider>
          {children}
        </SidebarProvider>
      </DictionaryProvider>
    </ThemeProvider>
  );
}

