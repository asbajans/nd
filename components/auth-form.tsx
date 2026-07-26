"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Truck } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isSignUp = mode === "sign-up"

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const email = String(form.get("email"))
    const password = String(form.get("password"))
    const name = String(form.get("name") ?? "")

    try {
      if (isSignUp) {
        const { error } = await authClient.signUp.email({ email, password, name })
        if (error) throw new Error(error.message)
      } else {
        const { error } = await authClient.signIn.email({ email, password })
        if (error) throw new Error(error.message)
      }
      router.push("/panel")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Truck className="h-5 w-5" />
          </span>
          <span className="font-heading text-xl font-extrabold text-foreground">
            Nakliyat Diyarı
          </span>
        </Link>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
          <h1 className="font-heading text-2xl font-extrabold text-card-foreground">
            {isSignUp ? "İlan vermek için kayıt olun" : "Giriş yapın"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isSignUp
              ? "Kaydınız admin onayından sonra ilan verebilir hale gelir."
              : "Panelinize erişmek için giriş yapın."}
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name">Ad Soyad</Label>
                <Input id="name" name="name" required placeholder="Ad Soyad" autoComplete="name" />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="ornek@eposta.com"
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                placeholder="En az 8 karakter"
                autoComplete={isSignUp ? "new-password" : "current-password"}
              />
            </div>

            {error && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              size="lg"
            >
              {loading ? "Lütfen bekleyin..." : isSignUp ? "Kayıt Ol" : "Giriş Yap"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isSignUp ? "Zaten hesabınız var mı? " : "Hesabınız yok mu? "}
            <Link
              href={isSignUp ? "/sign-in" : "/sign-up"}
              className="font-semibold text-primary hover:underline"
            >
              {isSignUp ? "Giriş yapın" : "Kayıt olun"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
