import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { LocaleProvider } from "@/lib/i18n/LocaleProvider";
import { getProfileOrFallback } from "@/lib/api/profile";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const TITLE = "KYO8 — Backend / Infrastructure Engineer";
const DESCRIPTION =
  "Kyoya's portfolio — backend and infrastructure engineering. Go, AWS, Terraform, and low-level systems.";

export const metadata: Metadata = {
  metadataBase: new URL("https://kyo8.dev"),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: "kyo8.dev",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

const THEME_INIT = `
(function () {
  try {
    var theme = localStorage.getItem("theme") === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", theme);
    var locale = localStorage.getItem("locale") === "en" ? "en" : "ja";
    document.documentElement.lang = locale;
  } catch (e) {}
})();
`;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const profile = await getProfileOrFallback();

  return (
    <html
      lang="ja"
      data-theme="dark"
      className={`${geistMono.variable} h-full`}
      suppressHydrationWarning
    > 
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body className="min-h-full flex flex-col bg-bg text-fg antialiased selection:bg-fg selection:text-bg">
        <div className="pointer-events-none fixed inset-0 z-50 noise-overlay" />
        <LocaleProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer profile={profile} />
        </LocaleProvider>
      </body>
    </html>
  );
}
