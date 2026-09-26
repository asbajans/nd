export const SETTING_WHATSAPP = "whatsapp_number"

export function toWhatsappNumber(raw: string): string {
  let digits = raw.replace(/\D/g, "")
  if (digits.startsWith("0")) digits = "90" + digits.slice(1)
  else if (digits.length === 10) digits = "90" + digits
  return digits
}
