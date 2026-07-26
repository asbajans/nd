"use client"

import Link from "next/link"
import { Truck, Menu, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ButtonLink } from "@/components/button-link"
import { useSession, signOut } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()
  const role = (session?.user as { role?: string } | undefined)?.role

  async function handleSignOut() {
    await signOut()
    router.push("/")
    router.refresh()
  }

  const nav = (
    <>
      <Link href="/ilanlar" className="text-sm font-medium hover:text-accent transition-colors">
        İlanlar
      </Link>
      <Link href="/nasil-calisir" className="text-sm font-medium hover:text-accent transition-colors">
        Nasıl Çalışır
      </Link>
      <Link href="/iletisim" className="text-sm font-medium hover:text-accent transition-colors">
        İletişim
      </Link>
    </>
  )

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-primary text-primary-foreground">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Truck className="h-5 w-5" />
          </span>
          <span className="font-heading text-lg font-extrabold tracking-tight">
            Nakliyat Diyarı
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">{nav}</nav>

        <div className="hidden items-center gap-2 md:flex">
          {session?.user ? (
            <>
              {role === "admin" && (
                <ButtonLink href="/admin" variant="secondary" size="sm">
                  Admin
                </ButtonLink>
              )}
              <ButtonLink href="/panel" variant="secondary" size="sm">
                Panelim
              </ButtonLink>
              <Button
                onClick={handleSignOut}
                size="sm"
                variant="ghost"
                className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                Çıkış
              </Button>
            </>
          ) : (
            <>
              <ButtonLink
                href="/sign-in"
                size="sm"
                variant="ghost"
                className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                Giriş
              </ButtonLink>
              <ButtonLink href="/sign-up" size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                İlan Ver
              </ButtonLink>
            </>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menüyü aç/kapat"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-primary-foreground/10 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4">
            {nav}
            <div className="flex flex-col gap-2 pt-2">
              {session?.user ? (
                <>
                  {role === "admin" && (
                    <ButtonLink href="/admin" variant="secondary" size="sm">
                      Admin Paneli
                    </ButtonLink>
                  )}
                  <ButtonLink href="/panel" variant="secondary" size="sm">
                    Panelim
                  </ButtonLink>
                  <Button onClick={handleSignOut} size="sm" variant="outline">
                    Çıkış Yap
                  </Button>
                </>
              ) : (
                <>
                  <ButtonLink href="/sign-in" variant="secondary" size="sm">
                    Giriş Yap
                  </ButtonLink>
                  <ButtonLink href="/sign-up" size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                    Kayıt Ol / İlan Ver
                  </ButtonLink>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
