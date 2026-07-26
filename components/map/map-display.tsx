"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface MapDisplayProps {
  fromLat: number
  fromLng: number
  toLat: number
  toLng: number
  fromLabel: string
  toLabel: string
}

export function MapDisplay({ fromLat, fromLng, toLat, toLng, fromLabel, toLabel }: MapDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const map = L.map(containerRef.current, {
      center: [(fromLat + toLat) / 2, (fromLng + toLng) / 2],
      zoom: 8,
      zoomControl: true,
    })

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
    }).addTo(map)

    const fromIcon = L.divIcon({
      className: "",
      html: `<div style="background:#22c55e;color:white;padding:4px 8px;border-radius:6px;font-size:12px;font-weight:600;white-space:nowrap;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.3)">${fromLabel}</div>`,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    })

    const toIcon = L.divIcon({
      className: "",
      html: `<div style="background:#ef4444;color:white;padding:4px 8px;border-radius:6px;font-size:12px;font-weight:600;white-space:nowrap;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.3)">${toLabel}</div>`,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    })

    L.marker([fromLat, fromLng], { icon: fromIcon }).addTo(map)
    L.marker([toLat, toLng], { icon: toIcon }).addTo(map)

    const bounds = L.latLngBounds([fromLat, fromLng], [toLat, toLng])
    map.fitBounds(bounds, { padding: [50, 50] })

    return () => {
      map.remove()
    }
  }, [fromLat, fromLng, toLat, toLng, fromLabel, toLabel])

  return <div ref={containerRef} className="h-64 w-full rounded-xl border border-border" />
}
