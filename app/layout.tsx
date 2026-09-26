import type { Metadata, Viewport } from "next"
import { Inter, Poppins } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { SITE_URL, absoluteUrl } from "@/lib/site"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
})

const siteUrl = SITE_URL

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Nakliyat Diyarı",
  url: SITE_URL,
  logo: absoluteUrl("/icon.svg"),
  description:
    "Türkiye'nin araç taşıma ilan platformu. Oto çekici, otomobil ve araç nakliyat ilanları.",
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Nakliyat Diyarı — Araç Taşıma İlanları",
    template: "%s | Nakliyat Diyarı",
  },
  description:
    "Türkiye'nin araç taşıma ilan platformu. Oto çekici, otomobil ve araç nakliyat ilanlarını ücretsiz görüntüleyin, ilan verin ve nakliyecilerle doğrudan WhatsApp üzerinden iletişime geçin.",
  keywords: [
    "araç taşıma",
    "oto çekici",
    "otomobil nakliyat",
    "araç nakliyat ilanları",
    "araba taşıma",
    "çekici ilanları",
    "şehirler arası araç taşıma",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: SITE_URL,
    siteName: "Nakliyat Diyarı",
    title: "Nakliyat Diyarı — Araç Taşıma İlanları",
    description:
      "Oto çekici, otomobil ve araç nakliyat ilanları. İlan verin, WhatsApp ile iletişime geçin.",
    images: [
      {
        url: absoluteUrl("/hero-cta.png"),
        width: 1200,
        height: 630,
        alt: "Nakliyat Diyarı — Araç Taşıma İlanları",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nakliyat Diyarı — Araç Taşıma İlanları",
    description:
      "Oto çekici, otomobil ve araç nakliyat ilanları. İlan verin, WhatsApp ile iletişime geçin.",
    images: [absoluteUrl("/hero-cta.png")],
  },
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#1f2a4d",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" className={`light ${inter.variable} ${poppins.variable}`}>
      <body className="bg-background font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  )
}
