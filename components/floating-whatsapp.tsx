import { MessageCircle } from "lucide-react"
import { getSiteSetting } from "@/app/actions/settings"
import { SETTING_WHATSAPP, toWhatsappNumber } from "@/lib/settings"

export async function FloatingWhatsapp() {
  const raw = await getSiteSetting(SETTING_WHATSAPP)
  if (!raw?.trim()) return null

  const waMessage = encodeURIComponent(
    "Merhaba, araç taşıma hakkında bilgi almak istiyorum.",
  )

  return (
    <a
      href={`https://api.whatsapp.com/send?phone=${toWhatsappNumber(raw)}&text=${waMessage}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ile iletişime geçin"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  )
}
