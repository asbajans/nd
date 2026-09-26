import type { MetadataRoute } from "next"
import { getAllPublishedSlugs } from "@/app/actions/listings"
import { SITE_URL, absoluteUrl } from "@/lib/site"
import { LISTING_VARIANTS } from "@/lib/listing-variants"

// Sitemap her saat tazelenir (ilan + varyant sayfaları dinamik)
export const revalidate = 3600

function toAbsoluteImage(img: string | null | undefined): string | null {
  if (!img?.trim()) return null
  const trimmed = img.trim()
  if (trimmed.startsWith("http")) return trimmed
  return absoluteUrl(trimmed.startsWith("/") ? trimmed : `/${trimmed}`)
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/ilanlar`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${SITE_URL}/nasil-calisir`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/iletisim`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/gizlilik`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/kullanim-kosullari`, changeFrequency: "yearly", priority: 0.2 },
  ]

  let listingRoutes: MetadataRoute.Sitemap = []
  try {
    const rows = await getAllPublishedSlugs()
    listingRoutes = rows.flatMap((s) => {
      const mainImage = toAbsoluteImage(s.imageUrl ?? s.ownerImage)
      const main: MetadataRoute.Sitemap[number] = {
        url: `${SITE_URL}/ilan/${s.slug}`,
        lastModified: s.updatedAt ?? undefined,
        changeFrequency: "weekly",
        priority: 0.8,
        ...(mainImage ? { images: [mainImage] } : {}),
      }
      // Her ilan için 5 farklı senaryo sayfası
      const variants: MetadataRoute.Sitemap = LISTING_VARIANTS.map((v) => ({
        url: `${SITE_URL}/ilan/${s.slug}/${v.path}`,
        lastModified: s.updatedAt ?? undefined,
        changeFrequency: v.changeFrequency,
        priority: v.priority,
        ...(mainImage ? { images: [mainImage] } : {}),
      }))
      return [main, ...variants]
    })
  } catch {
    // DB unavailable during build — return static routes only
  }

  return [...staticRoutes, ...listingRoutes]
}
