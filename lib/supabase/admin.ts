import { createClient, type SupabaseClient } from "@supabase/supabase-js"

let cachedAdmin: SupabaseClient | null = null
let cachedAuthed: SupabaseClient | null = null
let authPromise: Promise<SupabaseClient | null> | null = null

function cleanEnv(value: string | undefined): string {
  const v = value?.trim() ?? ""
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    return v.slice(1, -1).trim()
  }
  return v
}

function getUrl() {
  return cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL)
}

function getAnonKey() {
  return cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

function getServiceRoleKey() {
  return cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY)
}

export function hasSupabaseServiceRole(): boolean {
  return Boolean(getUrl() && getServiceRoleKey())
}

/** True when we expect Supabase (URL set). On Vercel we must not fall back to disk. */
export function wantsSupabase(): boolean {
  return Boolean(getUrl())
}

export function isSupabaseConfigured(): boolean {
  if (!getUrl()) return false
  if (getServiceRoleKey()) return true
  return Boolean(
    getAnonKey() &&
      cleanEnv(process.env.SUPABASE_CRM_EMAIL) &&
      cleanEnv(process.env.SUPABASE_CRM_PASSWORD),
  )
}

export function supabaseConfigError(): string | null {
  if (!getUrl()) return null
  if (isSupabaseConfigured()) return null
  return (
    "Supabase URL configurada pero faltan credenciales de escritura. " +
    "En Vercel agregá SUPABASE_SERVICE_ROLE_KEY (recomendado) o " +
    "SUPABASE_CRM_EMAIL + SUPABASE_CRM_PASSWORD + NEXT_PUBLIC_SUPABASE_ANON_KEY."
  )
}

function createServiceClient(): SupabaseClient | null {
  const url = getUrl()
  const key = getServiceRoleKey()
  if (!url || !key) return null
  if (cachedAdmin) return cachedAdmin
  cachedAdmin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return cachedAdmin
}

async function createPasswordClient(): Promise<SupabaseClient | null> {
  const url = getUrl()
  const anon = getAnonKey()
  const email = cleanEnv(process.env.SUPABASE_CRM_EMAIL)
  const password = cleanEnv(process.env.SUPABASE_CRM_PASSWORD)
  if (!url || !anon || !email || !password) return null

  if (cachedAuthed) return cachedAuthed
  if (authPromise) return authPromise

  authPromise = (async () => {
    const client = createClient(url, anon, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
    const { error } = await client.auth.signInWithPassword({ email, password })
    if (error) {
      console.error("[supabase] CRM auth failed:", error.message)
      authPromise = null
      throw new Error(`Supabase login CRM falló: ${error.message}`)
    }
    cachedAuthed = client
    return client
  })()

  return authPromise
}

/** Server-only Supabase client for CRM reads/writes. */
export async function getSupabaseAdmin(): Promise<SupabaseClient | null> {
  const incomplete = supabaseConfigError()
  if (incomplete) throw new Error(incomplete)

  const service = createServiceClient()
  if (service) return service

  if (!isSupabaseConfigured()) return null
  return createPasswordClient()
}

export function getSupabaseServiceOrNull(): SupabaseClient | null {
  return createServiceClient()
}
