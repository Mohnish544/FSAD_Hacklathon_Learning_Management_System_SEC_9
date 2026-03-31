import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import { DarkModeToggle } from "@/components/dark-mode-toggle";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduFlow LMS",
  description: "A modern learning management system MVP with student, instructor, and admin workflows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${spaceGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = localStorage.getItem("darkMode");
                const shouldBeDark = stored ? stored === "true" : window.matchMedia("(prefers-color-scheme: dark)").matches;
                if (shouldBeDark) {
                  document.documentElement.classList.add("dark");
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white dark:bg-slate-950">
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-teal-600 to-cyan-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">EF</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white">EduFlow</span>
            </div>
            <DarkModeToggle />
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
