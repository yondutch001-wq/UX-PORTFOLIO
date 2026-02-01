import "./globals.css";
import { ReactNode } from "react";
import { Manrope, Sora } from "next/font/google";
import AppHeader from "@/components/layout/app-header";
import AppFooter from "@/components/layout/app-footer";

const displayFont = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"]
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"]
});

export const metadata = {
  title: "DVTCH | UI/UX Designer",
  description:
    "UI/UX designer crafting clear, conversion-ready digital experiences and scalable design systems."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="min-h-screen text-ink" suppressHydrationWarning>
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <div className="page-shell">
          <AppHeader />

          <main id="content" className="min-h-screen">
            {children}
          </main>

          <AppFooter />
        </div>
      </body>
    </html>
  );
}
