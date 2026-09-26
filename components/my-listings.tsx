"use client"

import { useState } from "react"
import Image from "next/image"
import { Trash2, ArrowRight, ImagePlus, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import type { Listing } from "@/lib/db/schema"
import { deleteMyListing, updateMyListingImage } from "@/app/actions/listings"
import { Button } from "@/components/ui/button"
import { ButtonLink } from "@/components/button-link"
import { Badge } from "@/components/ui/badge"
import { MAX_IMAGE_BYTES, MAX_IMAGE_BYTES_LABEL } from "@/lib/upload-constants"

const STATUS: Record<string, { label: string; className: string }> = {
  approved: { label: "Yayında", className: "bg-green-600 text-white hover:bg-green-600" },
  pending: { label: "Onay Bekliyor", className: "bg-accent text-accent-foreground hover:bg-accent" },
  rejected: { label: "Reddedildi", className: "bg-destructive text-white hover:bg-destructive" },
}

export function MyListings({ listings }: { listings: Listing[] }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState<number | null>(null)
  const [uploadingId, setUploadingId] = useState<number | null>(null)

  async function handleDelete(id: number) {
    if (!confirm("Bu ilanı silmek istediğinize emin misiniz?")) return
    setDeleting(id)
    try {
      await deleteMyListing(id)
      toast.success("İlan silindi.")
      router.refresh()
    } catch {
      toast.error("İlan silinemedi.")
    } finally {
      setDeleting(null)
    }
  }

  async function handleImage(id: number, file: File | null, remove = false) {
    if (remove) {
      setUploadingId(id)
      try {
        await updateMyListingImage(id, null)
        toast.success("İlan fotoğrafı kaldırıldı.")
        router.refresh()
      } catch {
        toast.error("Kaldırılamadı.")
      } finally {
        setUploadingId(null)
      }
      return
    }
    if (!file) return
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Yalnızca JPG, PNG veya WEBP yükleyin.")
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error(`Dosya çok büyük. En fazla ${MAX_IMAGE_BYTES_LABEL} yükleyin.`)
      return
    }
    setUploadingId(id)
    try {
      const form = new FormData()
      form.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: form })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast.error(data?.error ?? "Yükleme başarısız.")
        return
      }
      await updateMyListingImage(id, data.url as string)
      toast.success("İlan fotoğrafı güncellendi.")
      router.refresh()
    } catch {
      toast.error("Yükleme sırasında hata oluştu.")
    } finally {
      setUploadingId(null)
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
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary">
                {l.imageUrl ? (
                  <Image src={l.imageUrl} alt={l.title} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <ImagePlus className="h-5 w-5" />
                  </div>
                )}
                {uploadingId === l.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-heading font-bold text-card-foreground">{l.title}</h3>
                  <Badge className={status.className}>{status.label}</Badge>
                </div>
                <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                  {l.fromCity} <ArrowRight className="h-3 w-3" /> {l.toCity} · {l.vehicleTypes?.split(",").filter(Boolean).join(", ") || "—"}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <label className="cursor-pointer text-xs font-medium text-accent hover:underline">
                    {l.imageUrl ? "Fotoğrafı değiştir" : "Fotoğraf yükle"} (maks. {MAX_IMAGE_BYTES_LABEL})
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      disabled={uploadingId === l.id}
                      onChange={(e) => {
                        const f = e.target.files?.[0] ?? null
                        void handleImage(l.id, f)
                        e.target.value = ""
                      }}
                    />
                  </label>
                  {l.imageUrl && (
                    <button
                      type="button"
                      disabled={uploadingId === l.id}
                      onClick={() => void handleImage(l.id, null, true)}
                      className="text-xs text-muted-foreground hover:text-destructive hover:underline disabled:opacity-50"
                    >
                      Kaldır
                    </button>
                  )}
                </div>
              </div>
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
