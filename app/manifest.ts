import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nakliyat Diyarı — Araç Taşıma İlanları",
    short_name: "Nakliyat Diyarı",
    description:
      "Türkiye'nin araç taşıma ilan platformu. Oto çekici ve araç nakliyat ilanları.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1f2a4d",
    lang: "tr",
    icons: [
      { src: "/icon-light-32x32.png", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  }
}
