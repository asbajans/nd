import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function getSessionUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user ?? null
}

export async function requireUser() {
  const user = await getSessionUser()
  if (!user) throw new Error("Unauthorized")
  return user
}

export async function requireAdmin() {
  const user = await requireUser()
  if ((user as { role?: string }).role !== "admin") {
    throw new Error("Forbidden")
  }
  return user
}
