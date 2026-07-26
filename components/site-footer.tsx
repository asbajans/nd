import Link from "next/link"
import { Truck } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <Truck className="h-5 w-5" />
            </span>
            <span className="font-heading text-lg font-extrabold">Nakliyat Diyarı</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-primary-foreground/70 leading-relaxed">
            Türkiye&apos;nin araç taşıma ilan platformu. Oto çekici, otomobil ve araç
            nakliyat ilanlarını ücretsiz görüntüleyin, ilan verin ve doğrudan iletişime geçin.
          </p>
        </div>

        <div>
          <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-accent">
            Keşfet
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/70">
            <li><Link href="/ilanlar" className="hover:text-accent">Tüm İlanlar</Link></li>
            <li><Link href="/nasil-calisir" className="hover:text-accent">Nasıl Çalışır</Link></li>
            <li><Link href="/sign-up" className="hover:text-accent">İlan Ver</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-accent">
            Kurumsal
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/70">
            <li><Link href="/iletisim" className="hover:text-accent">İletişim</Link></li>
            <li><Link href="/gizlilik" className="hover:text-accent">Gizlilik Politikası</Link></li>
            <li><Link href="/kullanim-kosullari" className="hover:text-accent">Kullanım Koşulları</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} Nakliyat Diyarı. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  )
}
