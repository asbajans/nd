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

    function pinIcon(color: string, label: string) {
      return L.divIcon({
        className: "",
        html: `<div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-100%)"><svg width="30" height="42" viewBox="0 0 30 42" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 0C6.72 0 0 6.72 0 15c0 11.25 15 27 15 27s15-15.75 15-27C30 6.72 23.28 0 15 0z" fill="${color}"/><circle cx="15" cy="14" r="7" fill="#fff"/><circle cx="15" cy="14" r="4" fill="${color}"/></svg><span style="background:${color};color:white;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;white-space:nowrap;margin-top:-8px;border:1px solid white;box-shadow:0 1px 4px rgba(0,0,0,.2)">${label}</span></div>`,
        iconSize: [30, 60],
        iconAnchor: [15, 60],
      })
    }

    L.marker([fromLat, fromLng], { icon: pinIcon("#22c55e", fromLabel) }).addTo(map)
    L.marker([toLat, toLng], { icon: pinIcon("#ef4444", toLabel) }).addTo(map)

    const bounds = L.latLngBounds([fromLat, fromLng], [toLat, toLng])
    map.fitBounds(bounds, { padding: [50, 50] })

    return () => {
      map.remove()
    }
  }, [fromLat, fromLng, toLat, toLng, fromLabel, toLabel])

  return <div ref={containerRef} className="h-64 w-full rounded-xl border border-border" />
}
