import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, ChevronLeft, MapPin } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ContactButtons } from "@/components/contact-buttons"
import { ShareButtons } from "@/components/share-buttons"
import { Badge } from "@/components/ui/badge"
import { MapDisplay } from "@/components/map/map-display"
import { getListingBySlug } from "@/app/actions/listings"
import { SITE_URL, absoluteUrl } from "@/lib/site"
import { resolveListingImage } from "@/lib/listing-image"
import { LISTING_VARIANTS, getListingVariant, isListingVariant } from "@/lib/listing-variants"
import { TRUCK_TYPES } from "@/lib/constants"

export const dynamic = "force-dynamic"

type Params = { slug: string; variant: string }

function variantCopy(variant: string, listing: Awaited<ReturnType<typeof getListingBySlug>>) {
  if (!listing) return { h1: "", intro: "", body: [] as string[] }
  const priceText = listing.price ? `${listing.price.toLocaleString("tr-TR")} ₺` : "Görüşülür"
  const truckLabel = TRUCK_TYPES.find((t) => t.value === listing.truckType)?.label ?? "Belirtilmemiş"
  const vehicleTypes = listing.vehicleTypes ? listing.vehicleTypes.split(",").filter(Boolean) : []

  switch (variant) {
    case "fiyat":
      return {
        h1: `${listing.title} — Fiyat Bilgisi`,
        intro: `${listing.fromCity} - ${listing.toCity} araç taşıma ücreti: ${priceText}.`,
        body: [
          `Bu ilan için belirtilen ücret ${priceText}'dir. Fiyat; araç tipi (${vehicleTypes.join(", ") || "belirtilmemiş"}), güzergah ve yükleme tarihine göre netleşir.`,
          `WhatsApp üzerinden doğrudan yazarak ${listing.fromCity} çıkışlı, ${listing.toCity} varışlı taşıma için net fiyat alın. Kapora, ödeme ve teslim koşullarını telefonda teyit edin.`,
        ],
      }
    case "guzergah":
      return {
        h1: `${listing.title} — Güzergah & Harita`,
        intro: `${listing.fromCity} çıkışlı, ${listing.toCity} varışlı taşıma rotası.`,
        body: [
          `Taşıma ${listing.fromCity} bölgesinden başlar, ${listing.toCity} bölgesinde teslim edilir. İlanda harita konumu işaretliyse aşağıdaki rotayı inceleyin.`,
          `Teslim noktası, saat aralığı ve araç teslim alma koşullarını ilan sahibiyle önceden netleştirin.`,
        ],
      }
    case "ozellikler":
      return {
        h1: `${listing.title} — Taşıma Detayları`,
        intro: `Araç tipleri, çekici tipi ve yükleme bilgileri.`,
        body: [
          `Taşınabilir araç tipleri: ${vehicleTypes.join(", ") || "—"}. Çekici tipi: ${truckLabel}. Yükleme tarihi: ${listing.loadDate || "Esnek / Görüşülür"}.`,
          listing.description,
        ],
      }
    case "yorumlar":
      return {
        h1: `${listing.title} — Değerlendirme`,
        intro: `${listing.fromCity} - ${listing.toCity} ilanı için güvenle iletişim kurma rehberi.`,
        body: [
          `İlan sahibiyle iletişime geçmeden önce WhatsApp numarasını, yükleme tarihini ve ücreti yazılı olarak teyit edin.`,
          `Araç tesliminde fotoğraf çekin, taşıma koşullarını ve teslim adresini önceden netleştirin. Şüpheli durumlarda kapora göndermeyin.`,
        ],
      }
    case "iletisim":
    default:
      return {
        h1: `${listing.title} — İletişim`,
        intro: `${listing.fromCity} - ${listing.toCity} taşıma ilanı için doğrudan iletişim.`,
        body: [
          `Aşağıdaki WhatsApp / telefon butonlarıyla ilan sahibiyle aracısız iletişime geçin. Mesajınızda ${listing.fromCity} - ${listing.toCity} güzergahını ve araç tipinizi belirtin.`,
          `Kişisel bilgilerinizi yalnızca anlaşma aşamasında paylaşın.`,
        ],
      }
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug, variant } = await params
  if (!isListingVariant(variant)) return { title: "Sayfa bulunamadı", robots: { index: false } }
  const listing = await getListingBySlug(slug)
  if (!listing) return { title: "İlan bulunamadı", robots: { index: false } }
  const v = getListingVariant(variant)!
  const canonical = absoluteUrl(`/ilan/${listing.slug}/${v.path}`)
  const title = `${listing.title} — ${v.titleSuffix} (${listing.fromCity}/${listing.toCity})`
  const description = `${listing.title}. ${v.descriptionSuffix(listing.fromCity, listing.toCity)}`.slice(0, 155)
  const img = resolveListingImage(listing, listing.ownerImage)
  const imgAbs = img.startsWith("http") ? img : absoluteUrl(img)
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      locale: "tr_TR",
      url: canonical,
      siteName: "Nakliyat Diyarı",
      title,
      description,
      images: [{ url: imgAbs, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [imgAbs] },
  }
}

export default async function ListingVariantPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug, variant } = await params
  if (!isListingVariant(variant)) notFound()
  const listing = await getListingBySlug(slug)
  if (!listing) notFound()

  const v = getListingVariant(variant)!
  const copy = variantCopy(variant, listing)
  const url = `${SITE_URL}/ilan/${listing.slug}/${v.path}`
  const mainUrl = `${SITE_URL}/ilan/${listing.slug}`
  const img = resolveListingImage(listing, listing.ownerImage)
  const imgAbs = img.startsWith("http") ? img : absoluteUrl(img)
  const vehicleTypes = listing.vehicleTypes ? listing.vehicleTypes.split(",").filter(Boolean) : []
  const hasMap = listing.fromLat && listing.fromLng && listing.toLat && listing.toLng

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${listing.title} — ${v.titleSuffix}`,
    description: v.descriptionSuffix(listing.fromCity, listing.toCity),
    url,
    image: imgAbs,
    isPartOf: { "@type": "WebSite", name: "Nakliyat Diyarı", url: SITE_URL },
    about: {
      "@type": "Service",
      name: listing.title,
      areaServed: [listing.fromCity, listing.toCity],
      provider: { "@type": "Organization", name: "Nakliyat Diyarı", url: SITE_URL },
    },
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "İlanlar", item: `${SITE_URL}/ilanlar` },
      { "@type": "ListItem", position: 3, name: listing.title, item: mainUrl },
      { "@type": "ListItem", position: 4, name: v.titleSuffix, item: url },
    ],
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <nav aria-label="Sayfa yolu" className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Ana Sayfa</Link>
            <span>/</span>
            <Link href="/ilanlar" className="hover:text-foreground">İlanlar</Link>
            <span>/</span>
            <Link href={`/ilan/${listing.slug}`} className="hover:text-foreground">İlan</Link>
            <span>/</span>
            <span className="font-medium text-foreground">{v.titleSuffix}</span>
          </nav>

          <Link
            href={`/ilan/${listing.slug}`}
            className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" /> Ana ilana dön
          </Link>

          <article className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="relative aspect-[16/9] w-full bg-secondary">
              <Image
                src={img}
                alt={`${listing.title} — ${v.titleSuffix}`}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                {vehicleTypes.map((t) => (
                  <Badge key={t} className="bg-accent text-accent-foreground hover:bg-accent">{t}</Badge>
                ))}
              </div>
            </div>

            <div className="p-6 md:p-8">
              <h1 className="font-heading text-2xl font-extrabold text-card-foreground md:text-3xl text-balance">
                {copy.h1}
              </h1>
              <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-accent" />
                {listing.fromCity} <ArrowRight className="h-4 w-4" /> {listing.toCity}
              </p>
              <p className="mt-4 text-lg text-card-foreground leading-relaxed">{copy.intro}</p>
              {copy.body.map((p, i) => (
                <p key={i} className="mt-3 whitespace-pre-line text-muted-foreground leading-relaxed">{p}</p>
              ))}

              {variant === "guzergah" && hasMap && (
                <div className="mt-6">
                  <MapDisplay
                    fromLat={Number(listing.fromLat)}
                    fromLng={Number(listing.fromLng)}
                    toLat={Number(listing.toLat)}
                    toLng={Number(listing.toLng)}
                    fromLabel={listing.fromCity}
                    toLabel={listing.toCity}
                  />
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-6">
                {LISTING_VARIANTS.filter((x) => x.path !== v.path).map((x) => (
                  <Link
                    key={x.key}
                    href={`/ilan/${listing.slug}/${x.path}`}
                    className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-accent hover:text-foreground"
                  >
                    {x.titleSuffix}
                  </Link>
                ))}
              </div>

              {(listing.whatsapp || listing.phone) && (
                <div className="mt-6 border-t border-border pt-6">
                  <h2 className="mb-3 font-heading font-bold text-card-foreground">İletişime Geçin</h2>
                  <ContactButtons whatsapp={listing.whatsapp} phone={listing.phone} title={listing.title} />
                </div>
              )}

              <div className="mt-6 border-t border-border pt-6">
                <ShareButtons url={url} title={`${listing.title} — ${v.titleSuffix}`} />
              </div>
            </div>
          </article>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
