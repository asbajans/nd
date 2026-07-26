import { redirect } from "next/navigation"
import { Users, ClipboardList } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { UserManager } from "@/components/admin/user-manager"
import { ListingManager } from "@/components/admin/listing-manager"
import { getSessionUser } from "@/lib/session"
import { getAllUsers, getAllListings } from "@/app/actions/admin"

export const dynamic = "force-dynamic"
export const metadata = { title: "Admin Paneli", robots: { index: false } }

export default async function AdminPage() {
  const user = await getSessionUser()
  if (!user) redirect("/sign-in")
  if ((user as { role?: string }).role !== "admin") redirect("/panel")

  const [users, listings] = await Promise.all([getAllUsers(), getAllListings()])
  const pendingUsers = users.filter((u) => !u.approved && u.role !== "admin").length
  const pendingListings = listings.filter((l) => l.status === "pending").length

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1 bg-secondary/40">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <h1 className="font-heading text-3xl font-extrabold text-foreground">Admin Paneli</h1>
          <p className="mt-1 text-muted-foreground">
            Kullanıcı onaylarını ve ilanları buradan yönetin.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span className="text-sm">Onay Bekleyen Üye</span>
              </div>
              <p className="mt-2 font-heading text-3xl font-extrabold text-foreground">
                {pendingUsers}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 text-muted-foreground">
                <ClipboardList className="h-4 w-4" />
                <span className="text-sm">Onay Bekleyen İlan</span>
              </div>
              <p className="mt-2 font-heading text-3xl font-extrabold text-foreground">
                {pendingListings}
              </p>
            </div>
          </div>

          <section className="mt-10">
            <h2 className="mb-4 font-heading text-xl font-extrabold text-foreground">
              İlan Yönetimi
            </h2>
            <ListingManager listings={listings} />
          </section>

          <section className="mt-10">
            <h2 className="mb-4 font-heading text-xl font-extrabold text-foreground">
              Kullanıcı Yönetimi
            </h2>
            <UserManager users={users} />
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
