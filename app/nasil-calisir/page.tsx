import type { Metadata } from "next"
import { UserPlus, ShieldCheck, Upload, MessageCircle } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ButtonLink } from "@/components/button-link"

export const metadata: Metadata = {
  title: "Nasıl Çalışır",
  description:
    "Nakliyat Diyarı'nda araç taşıma ilanı vermek ve nakliyecilerle iletişime geçmek nasıl çalışır? Adım adım öğrenin.",
  alternates: { canonical: "/nasil-calisir" },
}

const steps = [
  { icon: UserPlus, title: "1. Kayıt Olun", text: "Ücretsiz hesap oluşturun ve panelinize erişin." },
  { icon: ShieldCheck, title: "2. Onay Alın", text: "Hesabınız admin tarafından hızlıca onaylanır." },
  { icon: Upload, title: "3. İlan Verin", text: "Araç taşıma ilanınızı detaylarıyla yayınlayın." },
  { icon: MessageCircle, title: "4. İletişime Geçin", text: "Müşteriler WhatsApp veya telefonla size ulaşır." },
]

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-border bg-primary text-primary-foreground">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <h1 className="font-heading text-3xl font-extrabold md:text-4xl">Nasıl Çalışır?</h1>
            <p className="mt-2 max-w-2xl text-primary-foreground/80 leading-relaxed">
              Nakliyat Diyarı, araç taşıma ihtiyacı olanlarla nakliyecileri buluşturur.
              Aracı yok, komisyon yok — doğrudan iletişim.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.title} className="rounded-xl border border-border bg-card p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/15 text-accent">
                  <s.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-heading font-bold text-card-foreground">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl bg-secondary p-10 text-center">
            <h2 className="font-heading text-2xl font-extrabold text-foreground">
              Hazır mısınız?
            </h2>
            <p className="max-w-lg text-muted-foreground">
              Hemen kaydolun ve ilk araç taşıma ilanınızı ücretsiz yayınlayın.
            </p>
            <ButtonLink href="/sign-up" size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              Ücretsiz Kayıt Ol
            </ButtonLink>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
