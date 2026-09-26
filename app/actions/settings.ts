"use server"

import { db } from "@/lib/db"
import { siteSettings } from "@/lib/db/schema"
import { requireAdmin } from "@/lib/session"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function getSiteSetting(key: string): Promise<string | null> {
  try {
    const [row] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, key))
      .limit(1)
    return row?.value ?? null
  } catch {
    // Tablo henüz oluşmamışsa (eski DB) sessizce null dön
    return null
  }
}

export async function setSiteSetting(key: string, value: string | null) {
  await requireAdmin()
  await db
    .insert(siteSettings)
    .values({ key, value, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: siteSettings.key,
      set: { value, updatedAt: new Date() },
    })
  revalidatePath("/")
  revalidatePath("/admin")
  return { ok: true as const }
}
