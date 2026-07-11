import { CRM_COOKIE, getCrmAccessToken } from "@/lib/crm/auth"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const expected = getCrmAccessToken()
  if (!expected) {
    return NextResponse.json(
      { error: "CRM_ACCESS_TOKEN no configurado en el servidor" },
      { status: 503 },
    )
  }

  const { password } = (await req.json()) as { password?: string }
  if (password !== expected) {
    return NextResponse.json({ error: "Clave incorrecta" }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(CRM_COOKIE, expected, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete(CRM_COOKIE)
  return res
}
