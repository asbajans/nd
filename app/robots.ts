import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"

// Yapay zeka tarayıcıları açıkça izinli (zaten `*` ile izinliler;
// burada ayrıca belirtilmesi hem belgeleme hem de gelecekteki
// kısıtlamalara karşı güvence amaçlıdır).
const AI_BOTS = [
  "GPTBot", // OpenAI eğitim tarayıcısı
  "ChatGPT-User", // ChatGPT kullanıcı isteğiyle sayfa okuma
  "OAI-SearchBot", // OpenAI arama
  "ClaudeBot", // Anthropic eğitim tarayıcısı
  "anthropic-ai", // Claude kullanıcı isteğiyle sayfa okuma
  "PerplexityBot", // Perplexity arama
  "Bytespider", // ByteDance (TikTok) / Doubao
  "Google-Extended", // Google AI (Gemini) eğitim kontrolü
  "Applebot-Extended", // Apple Intelligence eğitim kontrolü
  "Meta-ExternalAgent", // Meta AI
  "YouBot", // You.com
  "CCBot", // Common Crawl (birçok LLM eğitim verisi)
  "Diffbot", // Diffbot / AI veri çıkarımı
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/panel", "/api/"],
      },
      ...AI_BOTS.map((bot) => ({
        userAgent: bot,
        allow: "/",
        disallow: ["/admin", "/panel", "/api/"],
      })),
    ],
    sitemap: [`${SITE_URL}/sitemap.xml`, `${SITE_URL}/sitemap_index.xml`],
  }
}
