"use server"

import { db } from "@/lib/db"
import { listings, user as userTable } from "@/lib/db/schema"
import { requireUser } from "@/lib/session"
import { slugify } from "@/lib/slug"
import { and, desc, eq, ilike, or, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import type { ListingWithOwner } from "@/lib/listing-image"

export type ListingFilters = {
  q?: string
  vehicleType?: string
  fromCity?: string
  toCity?: string
}

// ---------- Public reads (only approved listings) ----------

export async function getPublishedListings(
  filters: ListingFilters = {},
): Promise<ListingWithOwner[]> {
  const conditions = [eq(listings.status, "approved")]

  if (filters.q) {
    conditions.push(
      or(
        ilike(listings.title, `%${filters.q}%`),
        ilike(listings.description, `%${filters.q}%`),
        ilike(listings.fromCity, `%${filters.q}%`),
        ilike(listings.toCity, `%${filters.q}%`),
      )!,
    )
  }
  if (filters.vehicleType) conditions.push(ilike(listings.vehicleTypes, `%${filters.vehicleType}%`))
  if (filters.fromCity) conditions.push(eq(listings.fromCity, filters.fromCity))
  if (filters.toCity) conditions.push(eq(listings.toCity, filters.toCity))

  const rows = await db
    .select({
      listing: listings,
      ownerImage: userTable.image,
    })
    .from(listings)
    .leftJoin(userTable, eq(listings.userId, userTable.id))
    .where(and(...conditions))
    .orderBy(desc(listings.createdAt))

  return rows.map((r) => ({ ...r.listing, ownerImage: r.ownerImage }))
}

export async function getListingBySlug(slug: string): Promise<ListingWithOwner | null> {
  const [row] = await db
    .select({
      listing: listings,
      ownerImage: userTable.image,
    })
    .from(listings)
    .leftJoin(userTable, eq(listings.userId, userTable.id))
    .where(and(eq(listings.slug, slug), eq(listings.status, "approved")))
    .limit(1)
  if (!row) return null
  return { ...row.listing, ownerImage: row.ownerImage }
}

export async function incrementViews(id: number) {
  await db
    .update(listings)
    .set({ views: sql`${listings.views} + 1` })
    .where(eq(listings.id, id))
}

export async function getAllPublishedSlugs() {
  const rows = await db
    .select({
      slug: listings.slug,
      updatedAt: listings.updatedAt,
      imageUrl: listings.imageUrl,
      ownerImage: userTable.image,
    })
    .from(listings)
    .leftJoin(userTable, eq(listings.userId, userTable.id))
    .where(eq(listings.status, "approved"))
  return rows
}

// ---------- Authenticated user actions ----------

export async function getMyListings() {
  const user = await requireUser()
  return db
    .select()
    .from(listings)
    .where(eq(listings.userId, user.id))
    .orderBy(desc(listings.createdAt))
}

export type CreateListingInput = {
  title: string
  description: string
  vehicleTypes: string[]
  fromCity: string
  toCity: string
  fromLat?: string | null
  fromLng?: string | null
  toLat?: string | null
  toLng?: string | null
  truckType?: string | null
  price?: number | null
  loadDate?: string | null
  contactName?: string | null
  whatsapp?: string | null
  phone?: string | null
  imageUrl?: string | null
}

export async function createListing(input: CreateListingInput) {
  const user = await requireUser()

  if (!(user as { approved?: boolean }).approved) {
    return {
      ok: false as const,
      error: "Hesabınız henüz onaylanmadı. Admin onayından sonra ilan verebilirsiniz.",
    }
  }

  if (!input.title || !input.description || input.vehicleTypes.length === 0 || !input.fromCity || !input.toCity) {
    return { ok: false as const, error: "Lütfen zorunlu alanları doldurun." }
  }

  if (!input.whatsapp) {
    return { ok: false as const, error: "WhatsApp numarası zorunludur." }
  }

  const base = slugify(`${input.title}-${input.fromCity}-${input.toCity}`) || "ilan"
  const slug = `${base}-${Math.random().toString(36).slice(2, 7)}`

  await db.insert(listings).values({
    userId: user.id,
    slug,
    title: input.title,
    description: input.description,
    vehicleTypes: input.vehicleTypes.join(","),
    fromCity: input.fromCity,
    toCity: input.toCity,
    fromLat: input.fromLat ?? null,
    fromLng: input.fromLng ?? null,
    toLat: input.toLat ?? null,
    toLng: input.toLng ?? null,
    truckType: input.truckType ?? null,
    price: input.price ?? null,
    loadDate: input.loadDate ?? null,
    contactName: input.contactName ?? null,
    whatsapp: input.whatsapp ?? null,
    phone: input.phone ?? null,
    imageUrl: input.imageUrl ?? null,
    status: "pending",
  })

  revalidatePath("/panel")
  revalidatePath("/admin")
  return { ok: true as const }
}

export async function updateMyListingImage(id: number, imageUrl: string | null) {
  const user = await requireUser()
  await db
    .update(listings)
    .set({ imageUrl, updatedAt: new Date() })
    .where(and(eq(listings.id, id), eq(listings.userId, user.id)))
  revalidatePath("/panel")
  revalidatePath("/admin")
  return { ok: true as const }
}

export async function deleteMyListing(id: number) {
  const user = await requireUser()
  await db.delete(listings).where(and(eq(listings.id, id), eq(listings.userId, user.id)))
  revalidatePath("/panel")
}
