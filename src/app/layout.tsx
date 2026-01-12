import type { Metadata } from "next";
import { headers } from "next/headers";
import { Outfit } from "next/font/google";
import "./globals.css";

import { getMarketingPage, normalizeMarketingPath } from "@/lib/marketing-content";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Patientli - The Healthcare Marketing Solution for Growing Practices",
  description: "Patientli helps healthcare practices connect with more patients and thrive with modern brands, websites and marketing strategies.",
  keywords: ["healthcare marketing", "dental marketing", "medical website design", "practice growth"],
  openGraph: {
    title: "Patientli - The Healthcare Marketing Solution for Growing Practices",
    description: "Patientli helps healthcare practices connect with more patients and thrive with modern brands, websites and marketing strategies.",
    url: "https://www.patient.li",
    siteName: "Patientli",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const nextUrl =
    headerList.get("x-pathname") ||
    headerList.get("next-url") ||
    headerList.get("x-nextjs-rewritten-path") ||
    headerList.get("x-matched-path") ||
    "/";
  const pathname = normalizeMarketingPath(new URL(nextUrl, "http://localhost").pathname);
  const marketingEntry = getMarketingPage(pathname);
  const marketingClass = marketingEntry?.bodyClass ?? "";
  const bodyClass = [
    outfit.variable,
    "antialiased",
    marketingEntry ? "marketing-site" : "",
    marketingClass,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <html lang="en">
      <body className={bodyClass}>
        {children}
      </body>
    </html>
  );
}
