"use client"

import { useMemo, useState, useTransition } from "react"
import { ArrowRight, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
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

const PAGE_SIZE = 10

type Filter = "pending" | "approved" | "rejected" | "all"

const FILTERS: { key: Filter; label: string }[] = [
  { key: "pending", label: "Onay Bekleyen" },
  { key: "approved", label: "Yayında" },
  { key: "rejected", label: "Reddedilen" },
  { key: "all", label: "Tümü" },
]

export function ListingManager({ listings }: { listings: Listing[] }) {
  const [rows, setRows] = useState(listings)
  const [filter, setFilter] = useState<Filter>("pending")
  const [page, setPage] = useState(1)
  const [pending, startTransition] = useTransition()

  const filtered = useMemo(
    () => (filter === "all" ? rows : rows.filter((l) => l.status === filter)),
    [rows, filter],
  )
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const counts = useMemo(
    () => ({
      pending: rows.filter((l) => l.status === "pending").length,
      approved: rows.filter((l) => l.status === "approved").length,
      rejected: rows.filter((l) => l.status === "rejected").length,
      all: rows.length,
    }),
    [rows],
  )

  function changeFilter(f: Filter) {
    setFilter(f)
    setPage(1)
  }

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
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => changeFilter(f.key)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === f.key
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border bg-card text-muted-foreground hover:border-accent hover:text-foreground"
            }`}
          >
            {f.label} ({counts[f.key]})
          </button>
        ))}
      </div>

      {pageRows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Bu filtrede ilan yok.</p>
      ) : (
        <div className="space-y-3">
          {pageRows.map((l) => {
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
      )}

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="h-4 w-4" /> Önceki
          </Button>
          <span className="text-sm text-muted-foreground">
            Sayfa {safePage} / {totalPages} ({filtered.length} ilan)
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={safePage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Sonraki <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
