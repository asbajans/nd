import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, Calendar, MapPin, Truck, ChevronLeft, Navigation } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ContactButtons } from "@/components/contact-buttons"
import { ShareButtons } from "@/components/share-buttons"
import { ViewTracker } from "@/components/view-tracker"
import { Badge } from "@/components/ui/badge"
import { MapDisplay } from "@/components/map/map-display"
import { getListingBySlug } from "@/app/actions/listings"
import { TRUCK_TYPES } from "@/lib/constants"

export const dynamic = "force-dynamic"

const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PRODUCTION_URL}`
  : "https://nakliyatdiyari.com"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const listing = await getListingBySlug(slug)
  if (!listing) return { title: "İlan bulunamadı" }

  const description = listing.description.slice(0, 155)
  return {
    title: `${listing.title} — ${listing.fromCity} / ${listing.toCity}`,
    description,
    alternates: { canonical: `/ilan/${listing.slug}` },
    openGraph: {
      title: listing.title,
      description,
      type: "article",
      images: listing.imageUrl ? [listing.imageUrl] : undefined,
    },
  }
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const listing = await getListingBySlug(slug)
  if (!listing) notFound()

  const url = `${SITE_URL}/ilan/${listing.slug}`
  const vehicleTypes = listing.vehicleTypes ? listing.vehicleTypes.split(",").filter(Boolean) : []
  const hasMap = listing.fromLat && listing.fromLng && listing.toLat && listing.toLng
  const truckLabel = TRUCK_TYPES.find((t) => t.value === listing.truckType)?.label

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: `Araç Taşıma - ${vehicleTypes.join(", ")}`,
    name: listing.title,
    description: listing.description,
    areaServed: [listing.fromCity, listing.toCity],
    provider: { "@type": "Organization", name: "Nakliyat Diyarı" },
    ...(listing.price
      ? {
          offers: {
            "@type": "Offer",
            price: listing.price,
            priceCurrency: "TRY",
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <ViewTracker id={listing.id} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <Link
            href="/ilanlar"
            className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" /> Tüm İlanlar
          </Link>

          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="relative aspect-[16/9] w-full bg-secondary">
              {listing.imageUrl ? (
                <Image
                  src={listing.imageUrl || "/placeholder.svg"}
                  alt={listing.title}
                  fill
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <Truck className="h-16 w-16" />
                </div>
              )}
              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                {vehicleTypes.map((v) => (
                  <Badge key={v} className="bg-accent text-accent-foreground hover:bg-accent">
                    {v}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="p-6 md:p-8">
              <h1 className="font-heading text-2xl font-extrabold text-card-foreground md:text-3xl text-balance">
                {listing.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
                <span className="inline-flex items-center gap-2 font-medium">
                  <MapPin className="h-4 w-4 text-accent" />
                  {listing.fromCity}
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  {listing.toCity}
                </span>
                {listing.loadDate && (
                  <span className="inline-flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" /> {listing.loadDate}
                  </span>
                )}
                {truckLabel && (
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Truck className="h-4 w-4" /> {truckLabel}
                  </span>
                )}
              </div>

              <div className="mt-6 rounded-xl bg-secondary p-4">
                <span className="text-sm text-muted-foreground">Ücret</span>
                <p className="font-heading text-2xl font-extrabold text-primary">
                  {listing.price
                    ? `${listing.price.toLocaleString("tr-TR")} ₺`
                    : "Görüşülür"}
                </p>
              </div>

              <div className="mt-6">
                <h2 className="font-heading font-bold text-card-foreground">İlan Açıklaması</h2>
                <p className="mt-2 whitespace-pre-line text-muted-foreground leading-relaxed">
                  {listing.description}
                </p>
              </div>

              {hasMap && (
                <div className="mt-6">
                  <h2 className="mb-3 font-heading font-bold text-card-foreground">
                    Rota
                  </h2>
                  <MapDisplay
                    fromLat={Number(listing.fromLat)}
                    fromLng={Number(listing.fromLng)}
                    toLat={Number(listing.toLat)}
                    toLng={Number(listing.toLng)}
                    fromLabel={listing.fromCity}
                    toLabel={listing.toCity}
                  />
                  <a
                    href={`https://www.google.com/maps/dir/${listing.fromLat},${listing.fromLng}/${listing.toLat},${listing.toLng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
                  >
                    <Navigation className="h-4 w-4" />
                    Google Maps&apos;te aç
                  </a>
                </div>
              )}

              {(listing.whatsapp || listing.phone) && (
                <div className="mt-8 border-t border-border pt-6">
                  <h2 className="mb-3 font-heading font-bold text-card-foreground">
                    İletişime Geçin
                  </h2>
                  <ContactButtons
                    whatsapp={listing.whatsapp}
                    phone={listing.phone}
                    title={listing.title}
                  />
                </div>
              )}

              <div className="mt-8 border-t border-border pt-6">
                <ShareButtons url={url} title={listing.title} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
