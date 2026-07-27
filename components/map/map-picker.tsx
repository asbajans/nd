"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface MapPickerProps {
  position: [number, number] | null
  onChange: (lat: number, lng: number) => void
  placeholder?: string
}

export function MapPicker({ position, onChange, placeholder }: MapPickerProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const map = L.map(containerRef.current, {
      center: [39.0, 35.0],
      zoom: 6,
      zoomControl: true,
    })

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
    }).addTo(map)

    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng
      setMarker(lat, lng)
      onChange(lat, lng)
    })

    mapRef.current = map

    return () => {
      map.remove()
    }
  }, [])

  function setMarker(lat: number, lng: number) {
    if (markerRef.current) markerRef.current.remove()
    const icon = L.divIcon({
      className: "",
      html: `<div style="width:28px;height:40px;position:relative;transform:translate(-50%,-100%)"><svg viewBox="0 0 28 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.27 21.73 0 14 0z" fill="#2563eb"/><path d="M14 4C9.04 4 5 8.04 5 13c0 7 9 17 9 17s9-10 9-17c0-4.96-4.04-9-9-9z" fill="#fff"/><circle cx="14" cy="13" r="5" fill="#2563eb"/></svg></div>`,
      iconSize: [28, 40],
      iconAnchor: [14, 40],
    })
    markerRef.current = L.marker([lat, lng], { icon }).addTo(mapRef.current!)
    mapRef.current?.setView([lat, lng], mapRef.current.getZoom())
  }

  async function searchLocation() {
    const q = inputRef.current?.value.trim()
    if (!q) return

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5&countrycodes=tr`,
        { headers: { "User-Agent": "NakliyatDiyari/1.0" } }
      )
      const data = await res.json()
      if (data.length > 0) {
        const { lat, lon, display_name } = data[0]
        const latNum = Number.parseFloat(lat)
        const lngNum = Number.parseFloat(lon)
        setMarker(latNum, lngNum)
        onChange(latNum, lngNum)
        if (inputRef.current) inputRef.current.value = display_name
      }
    } catch {
      // ignore
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault()
      searchLocation()
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder ?? "Adres ara..."}
          onKeyDown={handleKeyDown}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        <button
          type="button"
          onClick={searchLocation}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-accent px-3 py-1 text-sm font-medium text-accent-foreground hover:bg-accent/90"
        >
          Ara
        </button>
      </div>
      <div ref={containerRef} className="h-48 w-full rounded-md border border-border" />
      {position && (
        <p className="text-xs text-muted-foreground">
          {position[0].toFixed(4)}, {position[1].toFixed(4)}
        </p>
      )}
    </div>
  )
}
