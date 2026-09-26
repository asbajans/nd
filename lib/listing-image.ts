import type { Listing } from "@/lib/db/schema"

/**
 * Görsel çözümleme zinciri:
 * 1. İlanın kendi fotoğrafı (imageUrl)
 * 2. İlan sahibinin profil logosu / resmi (ownerImage = user.image)
 * 3. Varsayılan placeholder
 */
export function resolveListingImage(
  listing: Pick<Listing, "imageUrl">,
  ownerImage?: string | null,
): string {
  if (listing.imageUrl?.trim()) return listing.imageUrl
  if (ownerImage?.trim()) return ownerImage
  return "/placeholder.jpg"
}

export type ListingWithOwner = Listing & { ownerImage: string | null }
