"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { toast } from "sonner"
import { ImagePlus, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { MAX_IMAGE_BYTES, MAX_IMAGE_BYTES_LABEL } from "@/lib/upload-constants"

async function compressToLimit(file: File, maxBytes: number): Promise<File> {
  // Zaten limit altındaysa aynen döndür
  if (file.size <= maxBytes) return file

  const bitmap = await createImageBitmap(file).catch(async () => {
    // Fallback: <img> ile yükle
    const url = URL.createObjectURL(file)
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image()
        el.onload = () => resolve(el)
        el.onerror = reject
        el.src = url
      })
      const canvas = document.createElement("canvas")
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      canvas.getContext("2d")?.drawImage(img, 0, 0)
      const blob = await new Promise<Blob | null>((res) =>
        canvas.toBlob(res, "image/jpeg", 0.85),
      )
      if (!blob) return file
      return new File([blob], file.name, { type: "image/jpeg" })
    } finally {
      URL.revokeObjectURL(url)
    }
  })

  // createImageBitmap başarılıysa canvas ile kademeli sıkıştır
  let width = (bitmap as ImageBitmap).width ?? 0
  let height = (bitmap as ImageBitmap).height ?? 0
  // createImageBitmap fallback'u File döndürmüş olabilir
  if (bitmap instanceof File) return bitmap as File

  const MAX_DIM = 1280
  const scale = Math.min(1, MAX_DIM / Math.max(width, height))
  width = Math.round(width * scale)
  height = Math.round(height * scale)

  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")
  if (!ctx) return file
  ctx.drawImage(bitmap, 0, 0, width, height)
  ;(bitmap as ImageBitmap).close?.()

  let quality = 0.85
  let blob: Blob | null = null
  for (let i = 0; i < 6; i++) {
    blob = await new Promise<Blob | null>((res) =>
      canvas.toBlob(res, "image/jpeg", quality),
    )
    if (!blob) break
    if (blob.size <= maxBytes) break
    quality -= 0.15
    if (quality <= 0.2) {
      // Boyut hâlâ büyükse çözünürlüğü küçült
      canvas.width = Math.round(canvas.width * 0.8)
      canvas.height = Math.round(canvas.height * 0.8)
      ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height)
      quality = 0.7
    }
  }
  if (!blob) return file
  const ext = "jpg"
  const name = file.name.replace(/\.\w+$/, "") + `.${ext}`
  return new File([blob], name, { type: "image/jpeg" })
}

export function ImageUploader({
  label = "İlan Fotoğrafı",
  value,
  onChange,
}: {
  label?: string
  value: string | null
  onChange: (url: string | null) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handleFile(file: File) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Yalnızca JPG, PNG veya WEBP yükleyin.")
      return
    }
    setUploading(true)
    try {
      let toUpload = file
      // İstemcide 300 KB altına sıkıştır (sunucu yine de doğrular)
      if (file.size > MAX_IMAGE_BYTES) {
        toast.info(`Fotoğraf ${MAX_IMAGE_BYTES_LABEL} altına sıkıştırılıyor...`)
        toUpload = await compressToLimit(file, MAX_IMAGE_BYTES)
      }
      if (toUpload.size > MAX_IMAGE_BYTES) {
        toast.error(`Fotoğraf çok büyük. En fazla ${MAX_IMAGE_BYTES_LABEL} yükleyin.`)
        return
      }
      const form = new FormData()
      form.append("file", toUpload)
      const res = await fetch("/api/upload", { method: "POST", body: form })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast.error(data?.error ?? "Yükleme başarısız.")
        return
      }
      onChange(data.url as string)
      toast.success("Fotoğraf yüklendi.")
    } catch {
      toast.error("Yükleme sırasında hata oluştu.")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label} <span className="font-normal text-muted-foreground">(en fazla {MAX_IMAGE_BYTES_LABEL})</span></Label>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) void handleFile(f)
        }}
      />
      {value ? (
        <div className="relative h-40 w-full overflow-hidden rounded-xl border border-border">
          <Image src={value} alt="Yüklenen fotoğraf önizleme" fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="Fotoğrafı kaldır"
            className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-secondary/50 text-muted-foreground transition-colors hover:border-accent hover:text-foreground disabled:opacity-60"
        >
          {uploading ? <Loader2 className="h-8 w-8 animate-spin" /> : <ImagePlus className="h-8 w-8" />}
          <span className="text-sm font-medium">
            {uploading ? "Yükleniyor..." : "Fotoğraf seç / yükle"}
          </span>
          <span className="text-xs">JPG, PNG, WEBP • maks. {MAX_IMAGE_BYTES_LABEL}</span>
        </button>
      )}
      {!value && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? "Yükleniyor..." : "Dosya Seç"}
        </Button>
      )}
    </div>
  )
}
