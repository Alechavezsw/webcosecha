export const SOCIAL_PLATFORMS = ["instagram", "facebook", "tiktok", "linkedin"] as const
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number]

export const SOCIAL_PLANS = ["esencial", "growth", "premium"] as const
export type SocialPlan = (typeof SOCIAL_PLANS)[number]

export const SOCIAL_STATUSES = ["activo", "onboarding", "pausa"] as const
export type SocialClientStatus = (typeof SOCIAL_STATUSES)[number]

export const EDITORIAL_STATUSES = ["borrador", "aprobado", "publicado"] as const
export type EditorialStatus = (typeof EDITORIAL_STATUSES)[number]

export type EditorialPiece = {
  id: string
  title: string
  scheduledAt: string
  status: EditorialStatus
  platform?: SocialPlatform
}

export type SocialMetrics = {
  updatedAt: string
  followers?: number
  reach?: number
  engagementRate?: number
  notes?: string
}

export type SocialClient = {
  id: string
  brand: string
  contactName?: string
  contactPhone?: string
  platforms: SocialPlatform[]
  plan: SocialPlan
  status: SocialClientStatus
  postsPerMonth: number
  postsDelivered: number
  nextDelivery?: string
  notes?: string
  tags: string[]
  editorial: EditorialPiece[]
  metrics?: SocialMetrics
  createdAt: string
  updatedAt: string
}

export type SocialClientsStore = {
  clients: SocialClient[]
}
