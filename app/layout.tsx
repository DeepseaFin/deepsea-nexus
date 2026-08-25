import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "DNOS Platform",
  description: "Deepsea Nexus Operating System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      style={
        {
          "--font-geist-sans": '"IBM Plex Sans", "Segoe UI", sans-serif',
          "--font-geist-mono": "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        } as React.CSSProperties
      }
    >
      <body className="min-h-full flex flex-col">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
