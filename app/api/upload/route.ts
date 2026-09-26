import { NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { mkdir, writeFile } from "fs/promises"
import path from "path"
import { getSessionUser } from "@/lib/session"
import {
  ALLOWED_IMAGE_EXTS,
  ALLOWED_IMAGE_MIMES,
  MAX_IMAGE_BYTES,
} from "@/lib/upload-constants"

export const runtime = "nodejs"

function extFromMime(mime: string): string | null {
  if (mime === "image/jpeg") return "jpg"
  if (mime === "image/png") return "png"
  if (mime === "image/webp") return "webp"
  return null
}

export async function POST(req: Request) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 })
  }

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json({ error: "Form okunamadı." }, { status: 400 })
  }

  const file = form.get("file")
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 })
  }

  if (!(ALLOWED_IMAGE_MIMES as readonly string[]).includes(file.type)) {
    return NextResponse.json(
      { error: "Yalnızca JPG, PNG veya WEBP yükleyin." },
      { status: 400 },
    )
  }

  const bytes = await file.arrayBuffer()
  if (bytes.byteLength === 0) {
    return NextResponse.json({ error: "Boş dosya." }, { status: 400 })
  }

  // Tüm görseller için üst sınır: 300 KB (sunucu tarafı kesin kontrol)
  if (bytes.byteLength > MAX_IMAGE_BYTES) {
    return NextResponse.json(
      { error: `Dosya çok büyük. En fazla 300 KB yükleyebilirsiniz.` },
      { status: 413 },
    )
  }

  const ext = extFromMime(file.type)
  if (!ext || !(ALLOWED_IMAGE_EXTS as readonly string[]).includes(ext)) {
    return NextResponse.json({ error: "Desteklenmeyen dosya uzantısı." }, { status: 400 })
  }

  const dir = path.join(process.cwd(), "public", "uploads")
  await mkdir(dir, { recursive: true })
  const name = `${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`
  await writeFile(path.join(dir, name), Buffer.from(bytes))

  return NextResponse.json({ url: `/uploads/${name}` })
}
