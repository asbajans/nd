"use server"

import { db } from "@/lib/db"
import { listings, user as userTable } from "@/lib/db/schema"
import { requireAdmin } from "@/lib/session"
import { desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

// ---------- Users ----------

export async function getAllUsers() {
  await requireAdmin()
  return db
    .select({
      id: userTable.id,
      name: userTable.name,
      email: userTable.email,
      role: userTable.role,
      approved: userTable.approved,
      createdAt: userTable.createdAt,
    })
    .from(userTable)
    .orderBy(desc(userTable.createdAt))
}

export async function setUserApproval(userId: string, approved: boolean) {
  await requireAdmin()
  await db.update(userTable).set({ approved }).where(eq(userTable.id, userId))
  revalidatePath("/admin")
}

// ---------- Listings ----------

export async function getAllListings() {
  await requireAdmin()
  return db.select().from(listings).orderBy(desc(listings.createdAt))
}

export async function setListingStatus(
  id: number,
  status: "approved" | "pending" | "rejected",
) {
  await requireAdmin()
  const [row] = await db
    .select({ slug: listings.slug })
    .from(listings)
    .where(eq(listings.id, id))
    .limit(1)
  await db
    .update(listings)
    .set({ status, updatedAt: new Date() })
    .where(eq(listings.id, id))
  revalidatePath("/admin")
  revalidatePath("/")
  revalidatePath("/ilanlar")

  // Onaylanan ilanın 6 URL'ini IndexNow ile Bing/Yandex'e anında bildir.
  // Başarısız olursa sessiz geç (admin işlemini engellemez).
  if (status === "approved" && row?.slug) {
    try {
      const { listingUrls, submitIndexNow } = await import("@/lib/indexnow")
      await submitIndexNow(listingUrls(row.slug))
    } catch {
      /* best-effort */
    }
  }
}

export async function adminDeleteListing(id: number) {
  await requireAdmin()
  const [row] = await db
    .select({ slug: listings.slug })
    .from(listings)
    .where(eq(listings.id, id))
    .limit(1)
  await db.delete(listings).where(eq(listings.id, id))
  revalidatePath("/admin")
  revalidatePath("/")
  revalidatePath("/ilanlar")

  // Silinen URL'leri de bildir (motorlar 404'ü görüp dizinden düşer)
  if (row?.slug) {
    try {
      const { listingUrls, submitIndexNow } = await import("@/lib/indexnow")
      await submitIndexNow(listingUrls(row.slug))
    } catch {
      /* best-effort */
    }
  }
}
