import { createClient, type SupabaseClient } from "@supabase/supabase-js"

let cachedAdmin: SupabaseClient | null = null
let cachedAuthed: SupabaseClient | null = null
let authPromise: Promise<SupabaseClient | null> | null = null

function getUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? ""
}

function getAnonKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? ""
}

function getServiceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? ""
}

export function hasSupabaseServiceRole(): boolean {
  return Boolean(getUrl() && getServiceRoleKey())
}

export function isSupabaseConfigured(): boolean {
  if (!getUrl()) return false
  if (getServiceRoleKey()) return true
  // Fallback: login con usuario CRM de Supabase Auth
  return Boolean(
    getAnonKey() &&
      process.env.SUPABASE_CRM_EMAIL?.trim() &&
      process.env.SUPABASE_CRM_PASSWORD?.trim(),
  )
}

/** Client with service role (bypasses RLS). */
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
  const email = process.env.SUPABASE_CRM_EMAIL?.trim()
  const password = process.env.SUPABASE_CRM_PASSWORD?.trim()
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
      return null
    }
    cachedAuthed = client
    return client
  })()

  return authPromise
}

/** Server-only Supabase client for CRM reads/writes. */
export async function getSupabaseAdmin(): Promise<SupabaseClient | null> {
  const service = createServiceClient()
  if (service) return service
  return createPasswordClient()
}

/** Sync helper when caller already knows config is present and prefers service role. */
export function getSupabaseServiceOrNull(): SupabaseClient | null {
  return createServiceClient()
}
