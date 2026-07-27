import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  robots: { index: false },
}

export default function GizlilikPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h1 className="font-heading text-3xl font-extrabold">Gizlilik Politikası</h1>
          <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Nakliyat Diyarı olarak kişisel verilerinizin gizliliğine önem vermekteyiz.
              Bu gizlilik politikası, sitemizi ziyaret ettiğinizde veya hizmetlerimizi
              kullandığınızda hangi bilgilerin toplandığını, nasıl kullanıldığını ve
              korunduğunu açıklamaktadır.
            </p>
            <h2 className="font-heading text-lg font-bold text-foreground">Toplanan Bilgiler</h2>
            <p>
              Hesap oluştururken ad, e-posta adresi ve iletişim bilgileriniz toplanır.
              İlan verirken sağladığınız WhatsApp numarası, telefon ve konum bilgileri
              diğer kullanıcılarla paylaşılır.
            </p>
            <h2 className="font-heading text-lg font-bold text-foreground">Bilgilerin Kullanımı</h2>
            <p>
              Toplanan bilgiler, ilanlarınızın yayınlanması, kullanıcılar arasında
              iletişim sağlanması ve hizmet kalitesinin artırılması amacıyla kullanılır.
            </p>
            <h2 className="font-heading text-lg font-bold text-foreground">İletişim</h2>
            <p>
              Gizlilik politikamız hakkında sorularınız için iletişim sayfamızdan
              bize ulaşabilirsiniz.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
