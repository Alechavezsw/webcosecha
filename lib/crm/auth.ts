import { cookies } from "next/headers"

export const CRM_COOKIE = "crm_session"

export function getCrmAccessToken() {
  return process.env.CRM_ACCESS_TOKEN?.trim() ?? ""
}

export async function isCrmAuthenticated(): Promise<boolean> {
  const expected = getCrmAccessToken()
  if (!expected) return false
  const jar = await cookies()
  return jar.get(CRM_COOKIE)?.value === expected
}
