import type { MetadataRoute } from "next"

const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "https://nakliyatdiyari.com"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/panel", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
