import type { Metadata } from "next";
import { fontUrls } from "@/lib/branding";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "FileForge — Convert Any File Format, Instantly",
  description:
    "Browser-based file converter for documents, spreadsheets, and images. Fast, private, and easy to use.",
  keywords: [
    "file converter",
    "pdf converter",
    "image converter",
    "docx to pdf",
    "jpg to png",
    "heic to jpg",
    "xlsx to csv",
    "csv to json",
  ],
  openGraph: {
    title: "FileForge — Convert Any File Format, Instantly",
    description:
      "Reliable browser-based conversion tools for images, documents, spreadsheets, and PDFs.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FileForge — Convert Any File Format, Instantly",
    description:
      "Reliable browser-based conversion tools for images, documents, spreadsheets, and PDFs.",
  },
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icon", type: "image/png" }],
    apple: [{ url: "/apple-icon", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased dark"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        <link
          rel="preconnect"
          href="https://api.fontshare.com"
          crossOrigin=""
        />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin=""
        />
        <link href={fontUrls.clashDisplay} rel="stylesheet" />
        <link href={fontUrls.satoshi} rel="stylesheet" />
        <link href={fontUrls.jetBrainsMono} rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-[#111111] text-[#FAFAF7] font-body">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
