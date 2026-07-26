"use client"

import { useEffect, useRef } from "react"
import { incrementViews } from "@/app/actions/listings"

export function ViewTracker({ id }: { id: number }) {
  const done = useRef(false)
  useEffect(() => {
    if (done.current) return
    done.current = true
    incrementViews(id).catch(() => {})
  }, [id])
  return null
}
