import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
