import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Kullanım Koşulları",
  robots: { index: false },
}

export default function KullanimKosullariPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h1 className="font-heading text-3xl font-extrabold">Kullanım Koşulları</h1>
          <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Nakliyat Diyarı&apos;nı kullanarak aşağıdaki kullanım koşullarını kabul
              etmiş sayılırsınız.
            </p>
            <h2 className="font-heading text-lg font-bold text-foreground">Hizmet Tanımı</h2>
            <p>
              Nakliyat Diyarı, araç taşıma ve nakliyat hizmeti almak isteyen kullanıcılar
              ile hizmet sağlayıcıları buluşturan bir ilan platformudur. Platform, ilanların
              yayınlanması ve kullanıcılar arasında iletişim sağlanması için aracılık eder.
            </p>
            <h2 className="font-heading text-lg font-bold text-foreground">Kullanıcı Sorumlulukları</h2>
            <p>
              Kullanıcılar verdikleri ilanlarda doğru ve güncel bilgiler sağlamakla
              yükümlüdür. Yanıltıcı veya hukuka aykırı ilanlar yasaktır.
            </p>
            <h2 className="font-heading text-lg font-bold text-foreground">Fikri Mülkiyet</h2>
            <p>
              Sitede yer alan tüm içerik, tasarım ve yazılım Nakliyat Diyarı&apos;na
              aittir. İzinsiz kullanımı yasaktır.
            </p>
            <h2 className="font-heading text-lg font-bold text-foreground">Sorumluluk Reddi</h2>
            <p>
              Nakliyat Diyarı, ilan sağlayıcıları ile ilan verenler arasındaki
              anlaşmazlıklardan sorumlu değildir. Platform yalnızca ilan yayınlama
              ve iletişim kolaylığı sağlar.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
