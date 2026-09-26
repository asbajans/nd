// Tekil kanonik domain — Search Console'da bu adres kullanılmalı:
// https://www.nakliyatdiyari.com
export const SITE_URL = "https://www.nakliyatdiyari.com"

export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`
}
