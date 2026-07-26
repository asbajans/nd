"use client"

import { useState } from "react"
import { Trash2, ArrowRight } from "lucide-react"
import { toast } from "sonner"
import type { Listing } from "@/lib/db/schema"
import { deleteMyListing } from "@/app/actions/listings"
import { Button } from "@/components/ui/button"
import { ButtonLink } from "@/components/button-link"
import { Badge } from "@/components/ui/badge"

const STATUS: Record<string, { label: string; className: string }> = {
  approved: { label: "Yayında", className: "bg-green-600 text-white hover:bg-green-600" },
  pending: { label: "Onay Bekliyor", className: "bg-accent text-accent-foreground hover:bg-accent" },
  rejected: { label: "Reddedildi", className: "bg-destructive text-white hover:bg-destructive" },
}

export function MyListings({ listings }: { listings: Listing[] }) {
  const [deleting, setDeleting] = useState<number | null>(null)

  async function handleDelete(id: number) {
    if (!confirm("Bu ilanı silmek istediğinize emin misiniz?")) return
    setDeleting(id)
    try {
      await deleteMyListing(id)
      toast.success("İlan silindi.")
    } catch {
      toast.error("İlan silinemedi.")
    } finally {
      setDeleting(null)
    }
  }

  if (listings.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
        <p className="text-muted-foreground">Henüz ilanınız yok.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {listings.map((l) => {
        const status = STATUS[l.status] ?? STATUS.pending
        return (
          <div
            key={l.id}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-heading font-bold text-card-foreground">{l.title}</h3>
                <Badge className={status.className}>{status.label}</Badge>
              </div>
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                {l.fromCity} <ArrowRight className="h-3 w-3" /> {l.toCity} · {l.vehicleType}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {l.status === "approved" && (
                <ButtonLink href={`/ilan/${l.slug}`} variant="outline" size="sm">
                  Görüntüle
                </ButtonLink>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(l.id)}
                disabled={deleting === l.id}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
