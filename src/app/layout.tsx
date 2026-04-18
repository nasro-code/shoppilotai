import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AutoCommerce AI - Dashboard",
  description: "Advanced AI Customer Support Automation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-[#0B0F1A] text-gray-100 flex" suppressHydrationWarning>
        <Sidebar />
        <div className="flex-1 ml-64 flex flex-col min-h-screen">
          <TopNav />
          <main className="p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
