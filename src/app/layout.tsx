import type { Metadata } from "next";
import { Suspense } from "react";
import Providers from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Track expenses by category",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-gray-100">
        {/* Redux store creation uses Math.random(), which Next.js only allows at request time */}
        <Suspense>
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}
