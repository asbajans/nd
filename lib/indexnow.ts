import { SITE_URL } from "@/lib/site"
import { LISTING_VARIANTS } from "@/lib/listing-variants"

// IndexNow (Bing, Yandex, Seznam...): URL değişikliklerini arama motorlarına
// anında bildirir. Google IndexNow'u desteklemez; Google için Search Console +
// sitemap + iç linkler kullanılır. Anahtar herkese açıktır (sır değil).
export const INDEXNOW_KEY = "7df746594c7445869c69a2ce2c5d05836532efb3ac5e43df"

export function listingUrls(slug: string): string[] {
  const main = `${SITE_URL}/ilan/${slug}`
  return [main, ...LISTING_VARIANTS.map((v) => `${main}/${v.path}`)]
}

export async function submitIndexNow(urls: string[]): Promise<boolean> {
  if (urls.length === 0) return false
  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: new URL(SITE_URL).host,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: urls.slice(0, 10000),
      }),
    })
    return res.ok
  } catch {
    return false
  }
}
