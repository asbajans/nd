import { redirect } from "next/navigation"
import { Clock, CheckCircle2 } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ListingForm } from "@/components/listing-form"
import { MyListings } from "@/components/my-listings"
import { getSessionUser } from "@/lib/session"
import { getMyListings } from "@/app/actions/listings"

export const dynamic = "force-dynamic"
export const metadata = { title: "Panelim", robots: { index: false } }

export default async function PanelPage() {
  const user = await getSessionUser()
  if (!user) redirect("/sign-in")

  const approved = (user as { approved?: boolean }).approved === true
  const listings = await getMyListings()

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1 bg-secondary/40">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <h1 className="font-heading text-3xl font-extrabold text-foreground">Panelim</h1>
          <p className="mt-1 text-muted-foreground">Merhaba {user.name}, ilanlarınızı buradan yönetin.</p>

          {approved ? (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
              <CheckCircle2 className="h-4 w-4" />
              Hesabınız onaylı. İlan verebilirsiniz.
            </div>
          ) : (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-foreground">
              <Clock className="h-4 w-4 text-accent" />
              Hesabınız admin onayı bekliyor. Onaylandıktan sonra ilanlarınız yayına alınabilir.
            </div>
          )}

          <section className="mt-8 rounded-2xl border border-border bg-card p-6 md:p-8">
            <h2 className="font-heading text-xl font-extrabold text-card-foreground">
              Yeni İlan Ver
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              İlanınız gönderildikten sonra admin onayıyla yayına alınır.
            </p>
            <div className="mt-6">
              <ListingForm />
            </div>
          </section>

          <section className="mt-10">
            <h2 className="mb-4 font-heading text-xl font-extrabold text-foreground">
              İlanlarım ({listings.length})
            </h2>
            <MyListings listings={listings} />
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
