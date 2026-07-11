"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function CrmLoginForm() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch("/api/crm/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      const data = (await res.json()) as { error?: string }
      if (!res.ok) {
        setError(data.error ?? "No se pudo iniciar sesión")
        return
      }
      router.push("/crm")
      router.refresh()
    } catch {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={(e) => void submit(e)} className="w-full max-w-sm space-y-4">
      <div>
        <label htmlFor="crm-password" className="mb-2 block text-sm text-white/60">
          Clave de acceso
        </label>
        <Input
          id="crm-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Clave de acceso"
          className="h-11 border-white/15 bg-white/[0.06] text-white"
          autoComplete="current-password"
          required
        />
      </div>
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      <Button
        type="submit"
        disabled={loading || !password}
        className="w-full bg-[#eca8d6] text-black hover:bg-[#f0b8e0]"
      >
        {loading ? "Entrando…" : "Entrar al CRM"}
      </Button>
    </form>
  )
}
