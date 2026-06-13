import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { CookieConsent } from "@/components/shared/CookieConsent";
import { SiteAnalytics } from "@/components/shared/SiteAnalytics";
import { siteConfig } from "@/lib/data";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Paste show notes, get podcast SEO pack`,
    template: `%s · ${siteConfig.name}`,
  },
  description:
    "Paste podcast show notes or upload audio — get an SEO blog draft, FAQ blocks, social scripts, and a 7-day publish schedule. Free podcast-to-blog repurposing for indie hosts.",
  keywords: [
    "podcast content repurposing",
    "podcast SEO article generator",
    "turn podcast into blog",
    "automated podcast show notes",
    "podcast content growth workflow",
    "podcast social media pack",
    "repurpose podcast audio",
    "how to turn podcast into blog post",
    "best tools to repurpose podcast episodes",
    "podcast SEO tips for beginners",
    "automatic podcast show notes generator",
    "podcast social media content ideas",
    "audio to blog",
    "podcast content repurposing",
    "social script generator",
    "localized publishing schedule",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Paste show notes, get podcast SEO pack`,
    description:
      "Paste show notes or upload audio — SEO article draft, social scripts, and publish schedule from one podcast episode.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — podcast SEO & title tools`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Paste show notes, get podcast SEO pack`,
    description:
      "Generate SEO-ready articles, social scripts, and publish plans from podcast show notes or audio.",
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#161922",
};

function SiteJsonLd() {
  const base = siteConfig.url.replace(/\/$/, "");
  const payload = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        url: base,
        name: siteConfig.name,
        description:
          "English-language tools to turn podcast episodes into SEO drafts, social scripts, and publishing schedules.",
        inLanguage: "en-US",
      },
      {
        "@type": "Organization",
        "@id": `${base}/#organization`,
        name: siteConfig.name,
        url: base,
        contactPoint: {
          "@type": "ContactPoint",
          email: siteConfig.contactEmail,
          contactType: "customer support",
          availableLanguage: ["English"],
        },
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";

  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrains.variable} min-h-screen font-sans [padding-left:env(safe-area-inset-left)] [padding-right:env(safe-area-inset-right)]`}
      >
        <SiteJsonLd />
        <Header />
        <main>{children}</main>
        <Footer />
        <CookieConsent />
        <SiteAnalytics measurementId={gaMeasurementId} />
      </body>
    </html>
  );
}
