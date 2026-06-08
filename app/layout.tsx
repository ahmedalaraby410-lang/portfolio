import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Cursor } from "@/components/cursor";
import { LoadingIntro } from "@/components/loading-intro";
import { MouseGlow } from "@/components/mouse-glow";
import { SmoothScroll } from "@/components/smooth-scroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ahmed-alaraby.vercel.app"),
  title: {
    default: "Ahmed Alaraby - Senior UI/UX Designer",
    template: "%s - Ahmed Alaraby"
  },
  description:
    "Senior UI/UX Designer in Egypt designing intuitive digital products across fintech, real estate, government, and enterprise platforms.",
  keywords: [
    "Ahmed Alaraby",
    "Senior UI UX Designer",
    "Product Designer Egypt",
    "Fintech UX",
    "Design Systems",
    "Portfolio"
  ],
  authors: [{ name: "Ahmed Alaraby" }],
  openGraph: {
    title: "Ahmed Alaraby - Senior UI/UX Designer",
    description:
      "Designing intuitive digital products that solve real business problems across fintech, real estate, government, and enterprise platforms.",
    url: "https://ahmed-alaraby.vercel.app",
    siteName: "Ahmed Alaraby Portfolio",
    images: [{ url: "/images/og.png", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmed Alaraby - Senior UI/UX Designer",
    description:
      "Premium product design portfolio for fintech, enterprise, government, and commerce platforms.",
    images: ["/images/og.png"]
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <SmoothScroll />
        <MouseGlow />
        <Cursor />
        <LoadingIntro />
        {children}
      </body>
    </html>
  );
}
