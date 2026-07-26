import { Phone, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

function normalizePhone(raw: string) {
  return raw.replace(/[^\d+]/g, "")
}

function toWhatsappNumber(raw: string) {
  let digits = raw.replace(/\D/g, "")
  if (digits.startsWith("0")) digits = "90" + digits.slice(1)
  else if (digits.startsWith("90")) {
    /* already has country code */
  } else if (digits.length === 10) digits = "90" + digits
  return digits
}

export function ContactButtons({
  whatsapp,
  phone,
  title,
}: {
  whatsapp?: string | null
  phone?: string | null
  title: string
}) {
  const waMessage = encodeURIComponent(
    `Merhaba, "${title}" ilanınız hakkında bilgi almak istiyorum.`,
  )

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {whatsapp && (
        <Button
          asChild
          size="lg"
          className="flex-1 bg-[#25D366] text-white hover:bg-[#1eb457]"
        >
          <a
            href={`https://api.whatsapp.com/send?phone=${toWhatsappNumber(whatsapp)}&text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            WhatsApp ile İletişim
          </a>
        </Button>
      )}
      {phone && (
        <Button asChild size="lg" variant="outline" className="flex-1">
          <a href={`tel:${normalizePhone(phone)}`}>
            <Phone className="mr-2 h-5 w-5" />
            {phone}
          </a>
        </Button>
      )}
    </div>
  )
}
