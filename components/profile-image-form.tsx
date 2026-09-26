"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { updateProfileImage } from "@/app/actions/profile"
import { ImageUploader } from "@/components/image-uploader"

export function ProfileImageForm({ currentImage }: { currentImage: string | null }) {
  const router = useRouter()
  const [value, setValue] = useState<string | null>(currentImage)
  const [saving, setSaving] = useState(false)

  async function onSave() {
    setSaving(true)
    try {
      await updateProfileImage(value)
      toast.success(
        value
          ? "Profil logonuz kaydedildi. Fotoğrafsız ilanlarınızda bu görsel gösterilecek."
          : "Profil logosu kaldırıldı.",
      )
      router.refresh()
    } catch {
      toast.error("Kaydedilemedi.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-border bg-secondary">
          {value ? (
            <Image src={value} alt="Profil logosu" fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
              Logo yok
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Firma logonuzu veya istediğiniz bir resmi yükleyin (en fazla 300 KB).
          İlanınıza fotoğraf eklemezseniz bu görsel otomatik gösterilir.
        </p>
      </div>
      <ImageUploader label="Profil Logosu / Varsayılan İlan Görseli" value={value} onChange={setValue} />
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90 disabled:opacity-60"
      >
        {saving ? "Kaydediliyor..." : "Logoyu Kaydet"}
      </button>
    </div>
  )
}
