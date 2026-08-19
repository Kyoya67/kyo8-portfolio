import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KYO8 — Backend / Infrastructure Engineer",
  description:
    "Kyoya's portfolio — backend and infrastructure engineering. Go, AWS, Terraform, and low-level systems.",
};

const THEME_INIT = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var theme = stored === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" data-theme="dark" className={`${geistMono.variable} h-full`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body className="min-h-full flex flex-col bg-bg text-fg antialiased selection:bg-fg selection:text-bg">
        <div className="pointer-events-none fixed inset-0 z-50 noise-overlay" />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
