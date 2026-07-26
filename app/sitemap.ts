import type { MetadataRoute } from "next"
import { getAllPublishedSlugs } from "@/app/actions/listings"

const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "https://nakliyatdiyari.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/ilanlar`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${SITE_URL}/nasil-calisir`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/iletisim`, changeFrequency: "monthly", priority: 0.5 },
  ]

  let listingRoutes: MetadataRoute.Sitemap = []
  try {
    const slugs = await getAllPublishedSlugs()
    listingRoutes = slugs.map((s) => ({
      url: `${SITE_URL}/ilan/${s.slug}`,
      lastModified: s.updatedAt ?? undefined,
      changeFrequency: "weekly",
      priority: 0.8,
    }))
  } catch {
    // DB unavailable during build — return static routes only
  }

  return [...staticRoutes, ...listingRoutes]
}
