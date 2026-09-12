import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Ethiopic, Noto_Serif } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoEthiopic = Noto_Sans_Ethiopic({
  variable: "--font-noto-ethiopic",
  subsets: ["ethiopic"],
  weight: ["400", "500", "600", "700"],
});

const notoSerif = Noto_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Akebabi (አካባቢ) — Local Business Discovery for Addis Ababa",
  description:
    "Find barber shops, cafes, hotels, salons, and guest houses near you in Addis Ababa. Bilingual, photo-rich, and built for Ethiopia.",
  keywords: [
    "Addis Ababa",
    "Ethiopia",
    "local business",
    "directory",
    "near me",
    "barber",
    "cafe",
    "hotel",
    "Amharic",
    "Akebabi",
  ],
  authors: [{ name: "Akebabi" }],
  openGraph: {
    title: "Akebabi — Local Business Discovery for Addis Ababa",
    description:
      "Find barber shops, cafes, hotels, salons, and guest houses near you in Addis Ababa.",
    siteName: "Akebabi",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoEthiopic.variable} ${notoSerif.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
