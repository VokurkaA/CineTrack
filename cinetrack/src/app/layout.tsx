import { Suspense } from "react";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning className="h-full w-full bg-background transition-all antialiased">
      <body suppressHydrationWarning className="w-full h-full">
        <Suspense>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
