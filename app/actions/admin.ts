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
  await db.update(listings).set({ status }).where(eq(listings.id, id))
  revalidatePath("/admin")
  revalidatePath("/")
  revalidatePath("/ilanlar")
}

export async function adminDeleteListing(id: number) {
  await requireAdmin()
  await db.delete(listings).where(eq(listings.id, id))
  revalidatePath("/admin")
  revalidatePath("/")
  revalidatePath("/ilanlar")
}
