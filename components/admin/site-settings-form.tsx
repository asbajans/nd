"use client"

import { useState } from "react"
import { toast } from "sonner"
import { MessageCircle } from "lucide-react"
import { setSiteSetting } from "@/app/actions/settings"
import { SETTING_WHATSAPP } from "@/lib/settings"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SiteSettingsForm({ initialWhatsapp }: { initialWhatsapp: string | null }) {
  const [value, setValue] = useState(initialWhatsapp ?? "")
  const [saving, setSaving] = useState(false)

  async function onSave() {
    setSaving(true)
    try {
      await setSiteSetting(SETTING_WHATSAPP, value.trim() || null)
      toast.success("WhatsApp numarası kaydedildi. Ana sayfadaki buton güncellendi.")
    } catch {
      toast.error("Kaydedilemedi.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-card-foreground">
        <MessageCircle className="h-4 w-4 text-accent" />
        Ana Sayfa WhatsApp Butonu
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Buraya yazdığınız numara ana sayfada yüzen WhatsApp butonunda kullanılır.
        Boş bırakırsanız buton gizlenir.
      </p>
      <div className="space-y-2">
        <Label htmlFor="site-whatsapp">WhatsApp Numarası</Label>
        <Input
          id="site-whatsapp"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="05XX XXX XX XX"
          className="max-w-xs"
        />
      </div>
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90 disabled:opacity-60"
      >
        {saving ? "Kaydediliyor..." : "Kaydet"}
      </button>
    </div>
  )
}
