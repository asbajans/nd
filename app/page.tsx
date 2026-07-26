import Image from "next/image"
import { ShieldCheck, Zap, MapPinned, Truck } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { SearchBar } from "@/components/search-bar"
import { ListingCard } from "@/components/listing-card"
import { ButtonLink } from "@/components/button-link"
import { getPublishedListings } from "@/app/actions/listings"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const listings = (await getPublishedListings()).slice(0, 6)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-primary text-primary-foreground">
          <Image
            src="/hero-cta.png"
            alt="Otoyolda araç taşıyan çekici tır"
            fill
            priority
            className="object-cover opacity-25"
          />
          <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-28">
            <h1 className="max-w-3xl font-heading text-4xl font-extrabold leading-tight text-balance md:text-5xl lg:text-6xl">
              Aracınızı güvenle taşıtın, en uygun nakliyeciyi bulun
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-primary-foreground/80 leading-relaxed text-pretty">
              Türkiye&apos;nin araç taşıma ilan platformu. Oto çekici ve araç nakliyat
              ilanlarını ücretsiz görüntüleyin, kendi ilanınızı verin ve nakliyecilerle
              doğrudan WhatsApp üzerinden iletişime geçin.
            </p>
            <div className="mt-8">
              <SearchBar />
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-b border-border bg-card">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 md:grid-cols-3">
            {[
              { icon: ShieldCheck, title: "Güvenilir İlanlar", text: "Tüm ilanlar yayına alınmadan önce kontrol edilir." },
              { icon: Zap, title: "Doğrudan İletişim", text: "Aracı olmadan WhatsApp veya telefonla anında iletişim." },
              { icon: MapPinned, title: "Tüm Türkiye", text: "81 il arasında şehirler arası araç taşıma ilanları." },
            ].map((f) => (
              <div key={f.title} className="flex gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
                  <f.icon className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-heading font-bold text-card-foreground">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Latest listings */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-heading text-2xl font-extrabold text-foreground md:text-3xl">
                Öne Çıkan İlanlar
              </h2>
              <p className="mt-2 text-muted-foreground">En son eklenen araç taşıma ilanları</p>
            </div>
            <ButtonLink href="/ilanlar" variant="outline" className="hidden sm:inline-flex">
              Tümünü Gör
            </ButtonLink>
          </div>

          {listings.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          ) : (
            <div className="mt-8 flex flex-col items-center rounded-xl border border-dashed border-border bg-card py-16 text-center">
              <Truck className="h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">Henüz yayında ilan bulunmuyor.</p>
              <ButtonLink href="/sign-up" className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90">
                İlk İlanı Sen Ver
              </ButtonLink>
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <ButtonLink href="/ilanlar" variant="outline">
              Tüm İlanları Gör
            </ButtonLink>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-secondary">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-16 text-center">
            <h2 className="max-w-2xl font-heading text-2xl font-extrabold text-foreground md:text-3xl text-balance">
              Nakliyeci misiniz? İlanınızı ücretsiz yayınlayın
            </h2>
            <p className="max-w-xl text-muted-foreground leading-relaxed">
              Kaydolun, admin onayından sonra araç taşıma ilanlarınızı yayınlayın ve
              müşterilere doğrudan ulaşın.
            </p>
            <ButtonLink href="/sign-up" size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              Hemen İlan Ver
            </ButtonLink>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
