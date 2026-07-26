"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TR_CITIES, VEHICLE_TYPES } from "@/lib/constants"

export function SearchBar({
  defaultValues,
}: {
  defaultValues?: { q?: string; vehicleType?: string; fromCity?: string; toCity?: string }
}) {
  const router = useRouter()
  const [fromCity, setFromCity] = useState(defaultValues?.fromCity ?? "")
  const [toCity, setToCity] = useState(defaultValues?.toCity ?? "")
  const [vehicleType, setVehicleType] = useState(defaultValues?.vehicleType ?? "")

  function submit() {
    const params = new URLSearchParams()
    if (fromCity) params.set("fromCity", fromCity)
    if (toCity) params.set("toCity", toCity)
    if (vehicleType) params.set("vehicleType", vehicleType)
    router.push(`/ilanlar${params.toString() ? `?${params.toString()}` : ""}`)
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-3 shadow-lg">
      <div className="grid gap-3 md:grid-cols-4">
        <Select value={fromCity} onValueChange={setFromCity}>
          <SelectTrigger className="h-12 w-full text-base text-foreground">
            <SelectValue placeholder="Nereden" />
          </SelectTrigger>
          <SelectContent>
            {TR_CITIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={toCity} onValueChange={setToCity}>
          <SelectTrigger className="h-12 w-full text-base text-foreground">
            <SelectValue placeholder="Nereye" />
          </SelectTrigger>
          <SelectContent>
            {TR_CITIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={vehicleType} onValueChange={setVehicleType}>
          <SelectTrigger className="h-12 w-full text-base text-foreground">
            <SelectValue placeholder="Araç Tipi" />
          </SelectTrigger>
          <SelectContent>
            {VEHICLE_TYPES.map((v) => (
              <SelectItem key={v} value={v}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={submit} size="lg" className="h-12 bg-accent text-accent-foreground hover:bg-accent/90">
          <Search className="mr-2 h-5 w-5" />
          İlan Ara
        </Button>
      </div>
    </div>
  )
}
