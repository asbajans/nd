import { SITE_URL } from "@/lib/site"
import sitemap from "@/app/sitemap"

export const dynamic = "force-dynamic"

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

/**
 * Eski /sitemap_index.xml adresiyle Search Console'a eklenmiş kayıtlar için
 * uyumluluk rotası. Next.js varsayılan olarak /sitemap.xml üretir; bu rota
 * aynı içeriği sitemap index formatında sunar, böylece eski gönderim 404/“getirilemedi”
 * hatası vermez.
 *
 * Doğrusu: Search Console'a https://www.nakliyatdiyari.com/sitemap.xml ekleyin.
 */
export async function GET() {
  const entries = await sitemap()

  const urlset = entries
    .map((e) => {
      const images = ((e as { images?: string[] }).images ?? [])
        .map((img) => `    <image:image><image:loc>${escapeXml(img)}</image:loc></image:image>`)
        .join("\n")
      const lastmod = e.lastModified
        ? `    <lastmod>${escapeXml(new Date(e.lastModified).toISOString())}</lastmod>\n`
        : ""
      const changefreq = e.changeFrequency ? `    <changefreq>${escapeXml(e.changeFrequency)}</changefreq>\n` : ""
      const priority = e.priority !== undefined ? `    <priority>${e.priority}</priority>\n` : ""
      return `  <url>\n    <loc>${escapeXml(e.url)}</loc>\n${lastmod}${changefreq}${priority}${images ? `${images}\n` : ""}  </url>`
    })
    .join("\n")

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n` +
    `${urlset}\n` +
    `</urlset>`

  // Ayrıca index görünümü isteyen tarayıcılar için sitemapindex alternatifi değil;
  // Google urlset'i doğrudan kabul eder.
  void SITE_URL

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
