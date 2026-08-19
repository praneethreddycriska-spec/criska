import type { Metadata } from "next";
import { EB_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { IntroSplash } from "@/components/intro-splash";
import { RouteTransition } from "@/components/route-transition";
import { VisitTracker } from "@/components/visit-tracker";
import { JsonLd } from "@/components/json-ld";
import {
  organizationJsonLd,
  websiteJsonLd,
  localBusinessJsonLd,
  corporationJsonLd,
  SITE_URL,
  SITE_KEYWORDS,
} from "@/lib/seo";

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

// Fallback sans (guaranteed) — Switzer loads over this from Fontshare.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Criska — AI-Enabled Technology Services Partner | Business Consulting",
    template: "%s · Criska",
  },
  description:
    "Criska Business Consulting — trusted IT services, staffing & consulting since 2014, now an AI-enabled technology services partner across India, the UK, and the US. Specializing in AI & Generative AI, cloud, cybersecurity, software engineering, and managed IT.",
  keywords: SITE_KEYWORDS,
  applicationName: "Criska",
  authors: [{ name: "Criska Business Consulting", url: SITE_URL }],
  creator: "Criska Business Consulting",
  publisher: "Criska Business Consulting",
  category: "Technology Consulting",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: "Criska Business Consulting",
    url: SITE_URL,
    locale: "en_US",
    title: "Criska — AI-Enabled Technology Services Partner",
    description:
      "Trusted IT partner since 2014, now AI-enabled. AI & Generative AI, cloud, cybersecurity, software, staffing & consulting across India, the UK, and the US.",
    images: [
      {
        url: `${SITE_URL}/icon.svg`,
        width: 1200,
        height: 630,
        alt: "Criska Business Consulting",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Criska — AI-Enabled Technology Services Partner",
    description:
      "AI-enabled technology services partner since 2014 — AI, cloud, security, software, data, staffing & consulting.",
    images: [`${SITE_URL}/icon.svg`],
  },
  other: {
    "geo.region": "IN-TG",
    "geo.placename": "Hyderabad, Telangana, India",
    "geo.position": "17.4435;78.3772",
    ICBM: "17.4435, 78.3772",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${ebGaramond.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=switzer@400,500,600&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <JsonLd
          data={[
            organizationJsonLd(),
            websiteJsonLd(),
            localBusinessJsonLd(),
            corporationJsonLd(),
          ]}
        />
        <ThemeProvider>{children}</ThemeProvider>
        <IntroSplash />
        <RouteTransition />
        <VisitTracker />
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
