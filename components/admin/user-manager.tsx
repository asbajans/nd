"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { setUserApproval } from "@/app/actions/admin"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type UserRow = {
  id: string
  name: string
  email: string
  role: string
  approved: boolean
  createdAt: Date | null
}

export function UserManager({ users }: { users: UserRow[] }) {
  const [rows, setRows] = useState(users)
  const [pending, startTransition] = useTransition()

  function toggle(userId: string, approved: boolean) {
    startTransition(async () => {
      try {
        await setUserApproval(userId, approved)
        setRows((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, approved } : u)),
        )
        toast.success(approved ? "Kullanıcı onaylandı." : "Onay kaldırıldı.")
      } catch {
        toast.error("İşlem başarısız.")
      }
    })
  }

  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground">Kayıtlı kullanıcı yok.</p>
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-secondary/60 text-left">
          <tr>
            <th className="px-4 py-3 font-heading font-semibold">Kullanıcı</th>
            <th className="hidden px-4 py-3 font-heading font-semibold sm:table-cell">Rol</th>
            <th className="px-4 py-3 font-heading font-semibold">Durum</th>
            <th className="px-4 py-3 text-right font-heading font-semibold">İşlem</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((u) => (
            <tr key={u.id}>
              <td className="px-4 py-3">
                <div className="font-medium text-card-foreground">{u.name}</div>
                <div className="text-xs text-muted-foreground">{u.email}</div>
              </td>
              <td className="hidden px-4 py-3 sm:table-cell">
                <Badge variant={u.role === "admin" ? "default" : "secondary"}>
                  {u.role === "admin" ? "Admin" : "Üye"}
                </Badge>
              </td>
              <td className="px-4 py-3">
                {u.approved ? (
                  <Badge className="bg-green-600 text-white hover:bg-green-600">Onaylı</Badge>
                ) : (
                  <Badge className="bg-accent text-accent-foreground hover:bg-accent">Bekliyor</Badge>
                )}
              </td>
              <td className="px-4 py-3 text-right">
                {u.role !== "admin" &&
                  (u.approved ? (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pending}
                      onClick={() => toggle(u.id, false)}
                    >
                      Onayı Kaldır
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      disabled={pending}
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                      onClick={() => toggle(u.id, true)}
                    >
                      Onayla
                    </Button>
                  ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
