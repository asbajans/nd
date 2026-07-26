"use client"

import { useState, useTransition } from "react"
import { ArrowRight, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { Listing } from "@/lib/db/schema"
import { setListingStatus, adminDeleteListing } from "@/app/actions/admin"
import { Button } from "@/components/ui/button"
import { ButtonLink } from "@/components/button-link"
import { Badge } from "@/components/ui/badge"

const STATUS: Record<string, { label: string; className: string }> = {
  approved: { label: "Yayında", className: "bg-green-600 text-white hover:bg-green-600" },
  pending: { label: "Bekliyor", className: "bg-accent text-accent-foreground hover:bg-accent" },
  rejected: { label: "Reddedildi", className: "bg-destructive text-white hover:bg-destructive" },
}

export function ListingManager({ listings }: { listings: Listing[] }) {
  const [rows, setRows] = useState(listings)
  const [pending, startTransition] = useTransition()

  function updateStatus(id: number, status: "approved" | "pending" | "rejected") {
    startTransition(async () => {
      try {
        await setListingStatus(id, status)
        setRows((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
        toast.success("İlan durumu güncellendi.")
      } catch {
        toast.error("İşlem başarısız.")
      }
    })
  }

  function remove(id: number) {
    if (!confirm("Bu ilanı kalıcı olarak silmek istediğinize emin misiniz?")) return
    startTransition(async () => {
      try {
        await adminDeleteListing(id)
        setRows((prev) => prev.filter((l) => l.id !== id))
        toast.success("İlan silindi.")
      } catch {
        toast.error("İlan silinemedi.")
      }
    })
  }

  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground">Henüz ilan yok.</p>
  }

  return (
    <div className="space-y-3">
      {rows.map((l) => {
        const status = STATUS[l.status] ?? STATUS.pending
        return (
          <div key={l.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-heading font-bold text-card-foreground">{l.title}</h3>
                  <Badge className={status.className}>{status.label}</Badge>
                </div>
                <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                  {l.fromCity} <ArrowRight className="h-3 w-3" /> {l.toCity} · {l.vehicleTypes?.split(",").filter(Boolean).join(", ") || "—"}
                  {l.price ? ` · ${l.price.toLocaleString("tr-TR")} ₺` : ""}
                </p>
                <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{l.description}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-3">
              {l.status !== "approved" && (
                <Button
                  size="sm"
                  disabled={pending}
                  className="bg-green-600 text-white hover:bg-green-700"
                  onClick={() => updateStatus(l.id, "approved")}
                >
                  Onayla / Yayınla
                </Button>
              )}
              {l.status !== "rejected" && (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={pending}
                  onClick={() => updateStatus(l.id, "rejected")}
                >
                  Reddet
                </Button>
              )}
              {l.status === "approved" && (
                <ButtonLink href={`/ilan/${l.slug}`} size="sm" variant="outline">
                  Görüntüle
                </ButtonLink>
              )}
              <Button
                size="sm"
                variant="ghost"
                disabled={pending}
                className="ml-auto text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => remove(l.id)}
              >
                <Trash2 className="mr-1 h-4 w-4" /> Sil
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
