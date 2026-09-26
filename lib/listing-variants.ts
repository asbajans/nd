import type { MetadataRoute } from "next"

export type ListingVariantKey = "fiyat" | "guzergah" | "ozellikler" | "yorumlar" | "iletisim"

export const LISTING_VARIANTS: {
  key: ListingVariantKey
  path: string
  titleSuffix: string
  descriptionSuffix: (fromCity: string, toCity: string) => string
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]
  priority: number
}[] = [
  {
    key: "fiyat",
    path: "fiyat",
    titleSuffix: "Fiyat Bilgisi",
    descriptionSuffix: (fromCity, toCity) =>
      `${fromCity} - ${toCity} araç taşıma fiyatı, ücret detayları ve ödeme koşulları.`,
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    key: "guzergah",
    path: "guzergah",
    titleSuffix: "Güzergah & Harita",
    descriptionSuffix: (fromCity, toCity) =>
      `${fromCity} - ${toCity} taşıma güzergahı, rota haritası ve teslim noktaları.`,
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    key: "ozellikler",
    path: "ozellikler",
    titleSuffix: "Taşıma Detayları",
    descriptionSuffix: (fromCity, toCity) =>
      `${fromCity} - ${toCity} araç taşıma detayları: araç tipleri, çekici tipi ve yükleme tarihi.`,
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    key: "yorumlar",
    path: "yorumlar",
    titleSuffix: "Değerlendirme",
    descriptionSuffix: (fromCity, toCity) =>
      `${fromCity} - ${toCity} nakliyat ilanı hakkında değerlendirme, güven ve iletişim ipuçları.`,
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    key: "iletisim",
    path: "iletisim",
    titleSuffix: "İletişim",
    descriptionSuffix: (fromCity, toCity) =>
      `${fromCity} - ${toCity} araç taşıma ilanı için WhatsApp ve telefon ile doğrudan iletişim.`,
    changeFrequency: "weekly",
    priority: 0.7,
  },
]

export function isListingVariant(v: string): v is ListingVariantKey {
  return LISTING_VARIANTS.some((x) => x.path === v)
}

export function getListingVariant(path: string) {
  return LISTING_VARIANTS.find((x) => x.path === path)
}
