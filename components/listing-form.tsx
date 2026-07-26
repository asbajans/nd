"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createListing } from "@/app/actions/listings"
import { TR_CITIES, VEHICLE_TYPES } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function ListingForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [vehicleType, setVehicleType] = useState("")
  const [fromCity, setFromCity] = useState("")
  const [toCity, setToCity] = useState("")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.currentTarget)

    const priceRaw = String(form.get("price") ?? "").trim()

    const res = await createListing({
      title: String(form.get("title")),
      description: String(form.get("description")),
      vehicleType,
      fromCity,
      toCity,
      price: priceRaw ? Number(priceRaw) : null,
      loadDate: String(form.get("loadDate") ?? "") || null,
      contactName: String(form.get("contactName") ?? "") || null,
      whatsapp: String(form.get("whatsapp") ?? "") || null,
      phone: String(form.get("phone") ?? "") || null,
    })

    setLoading(false)

    if (res.ok) {
      toast.success("İlanınız alındı! Admin onayından sonra yayınlanacaktır.")
      router.push("/panel")
      router.refresh()
    } else {
      toast.error(res.error)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">İlan Başlığı *</Label>
        <Input
          id="title"
          name="title"
          required
          placeholder="Örn: İstanbul - Ankara Otomobil Taşıma"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Araç Tipi *</Label>
          <Select value={vehicleType} onValueChange={setVehicleType} required>
            <SelectTrigger>
              <SelectValue placeholder="Seçin" />
            </SelectTrigger>
            <SelectContent>
              {VEHICLE_TYPES.map((v) => (
                <SelectItem key={v} value={v}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Nereden *</Label>
          <Select value={fromCity} onValueChange={setFromCity} required>
            <SelectTrigger>
              <SelectValue placeholder="Şehir seçin" />
            </SelectTrigger>
            <SelectContent>
              {TR_CITIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Nereye *</Label>
          <Select value={toCity} onValueChange={setToCity} required>
            <SelectTrigger>
              <SelectValue placeholder="Şehir seçin" />
            </SelectTrigger>
            <SelectContent>
              {TR_CITIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">Ücret (₺) — opsiyonel</Label>
          <Input id="price" name="price" type="number" min="0" placeholder="Örn: 5000" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="loadDate">Yükleme Tarihi — opsiyonel</Label>
          <Input id="loadDate" name="loadDate" placeholder="Örn: 15 Mart / Hafta içi" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Açıklama *</Label>
        <Textarea
          id="description"
          name="description"
          required
          rows={5}
          placeholder="Taşınacak aracın detayları, rota, koşullar vb."
        />
      </div>

      <div className="rounded-xl border border-border bg-secondary/50 p-4">
        <h3 className="font-heading font-bold text-foreground">İletişim Bilgileri</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Bu bilgiler ilan detayında iletişim butonlarında kullanılır.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="contactName">İlan Sahibi Adı</Label>
            <Input id="contactName" name="contactName" placeholder="Görünen ad" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp Numarası</Label>
            <Input id="whatsapp" name="whatsapp" placeholder="05XX XXX XX XX" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefon</Label>
            <Input id="phone" name="phone" placeholder="05XX XXX XX XX" />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        size="lg"
        className="w-full bg-accent text-accent-foreground hover:bg-accent/90 md:w-auto"
      >
        {loading ? "Gönderiliyor..." : "İlanı Yayına Gönder"}
      </Button>
    </form>
  )
}
