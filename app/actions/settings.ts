"use server"

import { db } from "@/lib/db"
import { siteSettings } from "@/lib/db/schema"
import { requireAdmin } from "@/lib/session"
import { eq, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"

// Portainer'daki migrate servisi volume mount sorunu nedeniyle çalışmayabiliyor.
// Bu yüzden tabloyu uygulama seviyesinde de güvenceye alıyoruz (idempotent).
async function ensureTable() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "site_settings" (
      "key" TEXT PRIMARY KEY NOT NULL,
      "value" TEXT,
      "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
    )
  `)
}

export async function getSiteSetting(key: string): Promise<string | null> {
  try {
    await ensureTable()
    const [row] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, key))
      .limit(1)
    return row?.value ?? null
  } catch {
    return null
  }
}

export async function setSiteSetting(key: string, value: string | null) {
  await requireAdmin()
  await ensureTable()
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
