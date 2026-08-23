import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/lib/auth/AuthContext";
import AuthGate from "@/components/AuthGate";
import AdminHeader from "@/components/AdminHeader";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KYO8 Admin",
  description: "Admin panel for kyo8.dev",
};

const THEME_INIT = `
(function () {
  try {
    var theme = localStorage.getItem("theme") === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-theme="dark" className={`${geistMono.variable} h-full`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body className="min-h-full flex flex-col bg-bg text-fg antialiased selection:bg-fg selection:text-bg">
        <div className="pointer-events-none fixed inset-0 z-50 noise-overlay" />
        <AuthProvider>
          <AdminHeader />
          <AuthGate>
            <main className="flex-1">{children}</main>
          </AuthGate>
        </AuthProvider>
      </body>
    </html>
  );
}
