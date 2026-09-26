"use server"

import { db } from "@/lib/db"
import { user as userTable } from "@/lib/db/schema"
import { requireUser } from "@/lib/session"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function updateProfileImage(imageUrl: string | null) {
  const user = await requireUser()
  await db
    .update(userTable)
    .set({ image: imageUrl, updatedAt: new Date() })
    .where(eq(userTable.id, user.id))
  revalidatePath("/panel")
  revalidatePath("/")
  revalidatePath("/ilanlar")
  return { ok: true as const }
}
