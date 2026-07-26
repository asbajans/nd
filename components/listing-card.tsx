import Link from "next/link"
import Image from "next/image"
import { ArrowRight, MapPin, Truck, Eye } from "lucide-react"
import type { Listing } from "@/lib/db/schema"
import { Badge } from "@/components/ui/badge"

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      href={`/ilan/${listing.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-secondary">
        {listing.imageUrl ? (
          <Image
            src={listing.imageUrl || "/placeholder.svg"}
            alt={listing.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <Truck className="h-12 w-12" />
          </div>
        )}
        <Badge className="absolute left-3 top-3 bg-accent text-accent-foreground hover:bg-accent">
          {listing.vehicleType}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-heading text-base font-bold leading-snug text-card-foreground line-clamp-2">
          {listing.title}
        </h3>

        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0 text-accent" />
          <span className="font-medium text-card-foreground">{listing.fromCity}</span>
          <ArrowRight className="h-3.5 w-3.5" />
          <span className="font-medium text-card-foreground">{listing.toCity}</span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="font-heading text-lg font-bold text-primary">
            {listing.price ? `${listing.price.toLocaleString("tr-TR")} ₺` : "Fiyat: Görüşülür"}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Eye className="h-3.5 w-3.5" /> {listing.views}
          </span>
        </div>
      </div>
    </Link>
  )
}
