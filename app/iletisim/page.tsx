import type { Metadata } from "next"
import { MessageCircle, HelpCircle, Upload } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ButtonLink } from "@/components/button-link"

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Nakliyat Diyarı ile iletişime geçin. İlanlarla ilgili sorularınız için bize ulaşın.",
  alternates: { canonical: "/iletisim" },
}

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-border bg-primary text-primary-foreground">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <h1 className="font-heading text-3xl font-extrabold md:text-4xl">İletişim</h1>
            <p className="mt-2 max-w-2xl text-primary-foreground/80 leading-relaxed">
              Platform ile ilgili sorularınız için aşağıdaki yöntemlerle bize ulaşabilirsiniz.
              İlan sahipleriyle iletişim için ilgili ilanın detay sayfasındaki iletişim
              butonlarını kullanın.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-16">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-6 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-accent/15 text-accent">
                <MessageCircle className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-heading font-bold text-card-foreground">İlan Sahibiyle İletişim</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Her ilanın detay sayfasında WhatsApp ve telefon butonları bulunur.
              </p>
              <ButtonLink href="/ilanlar" variant="outline" size="sm" className="mt-4">
                İlanlara Git
              </ButtonLink>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-accent/15 text-accent">
                <Upload className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-heading font-bold text-card-foreground">İlan Vermek</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Ücretsiz kaydolun, onaydan sonra ilanınızı yayınlayın.
              </p>
              <ButtonLink href="/sign-up" variant="outline" size="sm" className="mt-4">
                Kayıt Ol
              </ButtonLink>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-accent/15 text-accent">
                <HelpCircle className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-heading font-bold text-card-foreground">Nasıl Çalışır?</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Platformun işleyişi hakkında merak ettikleriniz.
              </p>
              <ButtonLink href="/nasil-calisir" variant="outline" size="sm" className="mt-4">
                Detaylar
              </ButtonLink>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
