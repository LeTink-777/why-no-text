import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import { PLAN_LIST } from "@/lib/plans";

const bodyFont = Inter({ variable: "--ff-body", subsets: ["latin", "cyrillic"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: `%s — ${SITE.productName}`,
  },
  description: SITE.description,
  keywords: SITE.keywords,
  applicationName: SITE.productName,
  authors: [{ name: SITE.owner.fullName }],
  creator: SITE.owner.fullName,
  publisher: SITE.owner.fullName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: SITE.url,
    siteName: SITE.productName,
    title: SITE.title,
    description: SITE.description,
  },
  twitter: {
    card: "summary",
    title: SITE.title,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  category: "почему он не пишет",
};

export const viewport: Viewport = {
  themeColor: "#0D1117",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      url: SITE.url,
      name: SITE.productName,
      description: SITE.description,
      inLanguage: "ru-RU",
    },
    {
      "@type": "Organization",
      "@id": `${SITE.url}/#org`,
      name: SITE.owner.fullName,
      url: SITE.url,
      email: SITE.owner.email,
      taxID: SITE.owner.inn,
    },
    {
      "@type": "Product",
      "@id": `${SITE.url}/#product`,
      name: SITE.productName,
      description: SITE.description,
      brand: { "@id": `${SITE.url}/#org` },
      offers: PLAN_LIST.map((plan) => ({
        "@type": "Offer",
        name: plan.name,
        price: plan.price,
        priceCurrency: "RUB",
        availability: "https://schema.org/InStock",
        url: SITE.url,
      })),
    },
  ],
};

// Typed explicitly rather than via Next's generated `LayoutProps`, so the
// project also type-checks on a clean checkout before the first build.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className={`${bodyFont.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg text-ink font-body">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
