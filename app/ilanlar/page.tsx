import type { Metadata } from "next"
import { Truck } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { SearchBar } from "@/components/search-bar"
import { ListingCard } from "@/components/listing-card"
import { getPublishedListings } from "@/app/actions/listings"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Araç Taşıma İlanları",
  description:
    "Şehirler arası araç taşıma, oto çekici ve otomobil nakliyat ilanları. İlleri ve araç tipini seçerek arayın, nakliyecilerle doğrudan iletişime geçin.",
  alternates: { canonical: "/ilanlar" },
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ fromCity?: string; toCity?: string; vehicleType?: string; q?: string }>
}) {
  const params = await searchParams
  const listings = await getPublishedListings(params)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="border-b border-border bg-primary text-primary-foreground">
          <div className="mx-auto max-w-6xl px-4 py-10">
            <h1 className="font-heading text-3xl font-extrabold md:text-4xl">
              Araç Taşıma İlanları
            </h1>
            <p className="mt-2 text-primary-foreground/80">
              Türkiye genelinde oto çekici ve araç nakliyat ilanları
            </p>
            <div className="mt-6">
              <SearchBar defaultValues={params} />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12">
          <p className="mb-6 text-sm text-muted-foreground">
            {listings.length} ilan bulundu
          </p>

          {listings.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card py-20 text-center">
              <Truck className="h-12 w-12 text-muted-foreground" />
              <p className="mt-4 font-medium text-foreground">Aramanıza uygun ilan bulunamadı</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Farklı şehir veya araç tipi seçerek tekrar deneyin.
              </p>
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
