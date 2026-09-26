import { getAllPublishedSlugs } from "@/app/actions/listings"
import { SITE_URL } from "@/lib/site"

export const dynamic = "force-dynamic"

// llms.txt: yapay zeka asistanlarının siteyi verimli okuması için standart dizin.
// https://llmstxt.org
export async function GET() {
  const lines: string[] = [
    "# Nakliyat Diyarı",
    "",
    "> Türkiye'nin araç taşıma ilan platformu. Oto çekici, otomobil ve araç nakliyat ilanları yayınlanır; ilan sahipleriyle WhatsApp/telefon üzerinden doğrudan iletişim kurulur.",
    "",
    "## Ana Bölümler",
    "",
    `- [Ana Sayfa](${SITE_URL})`,
    `- [Tüm İlanlar](${SITE_URL}/ilanlar)`,
    `- [Nasıl Çalışır](${SITE_URL}/nasil-calisir)`,
    `- [İletişim](${SITE_URL}/iletisim)`,
    "",
    "## Güncel İlanlar",
    "",
  ]

  try {
    const { db } = await import("@/lib/db")
    const { listings } = await import("@/lib/db/schema")
    const { eq, desc } = await import("drizzle-orm")
    const rows = await db
      .select({
        slug: listings.slug,
        title: listings.title,
        description: listings.description,
        fromCity: listings.fromCity,
        toCity: listings.toCity,
        price: listings.price,
      })
      .from(listings)
      .where(eq(listings.status, "approved"))
      .orderBy(desc(listings.createdAt))
      .limit(500)

    for (const l of rows) {
      const price = l.price ? `${l.price.toLocaleString("tr-TR")} ₺` : "Görüşülür"
      const desc = l.description.replace(/\s+/g, " ").slice(0, 200)
      lines.push(
        `- [${l.title} — ${l.fromCity}/${l.toCity} (${price})](${SITE_URL}/ilan/${l.slug}): ${desc}`,
      )
    }
    if (rows.length === 0) lines.push("- Henüz yayında ilan yok.")
  } catch {
    lines.push("- İlan listesi şu an alınamadı, /ilanlar sayfasına bakın.")
  }

  lines.push(
    "",
    "## Notlar",
    "",
    "- İlan detaylarında fiyat, güzergah, taşıma detayları, değerlendirme ve iletişim alt sayfaları bulunur: /ilan/[slug]/fiyat, /guzergah, /ozellikler, /yorumlar, /iletisim.",
    "- İletişim bilgileri her ilanın detay sayfasındaki WhatsApp/telefon butonlarındadır.",
  )

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
