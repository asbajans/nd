import { redirect } from "next/navigation"
import { AuthForm } from "@/components/auth-form"
import { getSessionUser } from "@/lib/session"

export const metadata = { title: "Kayıt Ol", robots: { index: false } }

export default async function SignUpPage() {
  const user = await getSessionUser()
  if (user) redirect("/panel")
  return <AuthForm mode="sign-up" />
}
