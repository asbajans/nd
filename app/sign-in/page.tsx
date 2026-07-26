import { redirect } from "next/navigation"
import { AuthForm } from "@/components/auth-form"
import { getSessionUser } from "@/lib/session"

export const metadata = { title: "Giriş Yap", robots: { index: false } }

export default async function SignInPage() {
  const user = await getSessionUser()
  if (user) redirect("/panel")
  return <AuthForm mode="sign-in" />
}
