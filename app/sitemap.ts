import type { MetadataRoute } from "next"
import { blogPosts, postDateToISO } from "@/lib/blog-data"

const BASE_URL = "https://cosechacreativa.com.ar"

const staticRoutes: Array<{
  path: string
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]
  priority: number
}> = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/servicios", changeFrequency: "monthly", priority: 0.9 },
  { path: "/blog", changeFrequency: "daily", priority: 0.9 },
  { path: "/nosotros", changeFrequency: "monthly", priority: 0.8 },
  { path: "/contacto", changeFrequency: "yearly", priority: 0.8 },
  { path: "/compol", changeFrequency: "monthly", priority: 0.7 },
  { path: "/mineria", changeFrequency: "monthly", priority: 0.6 },
  { path: "/nube", changeFrequency: "monthly", priority: 0.6 },
  { path: "/privacidad", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terminos", changeFrequency: "yearly", priority: 0.3 },
  { path: "/seguridad", changeFrequency: "yearly", priority: 0.3 },
]

const serviceSlugs = [
  "ai-first",
  "apps",
  "consultoria-estrategica",
  "diseno-grafico",
  "diseno-web",
  "ecommerce",
  "eventos",
  "foto-y-video",
  "gestion-de-redes-sociales",
  "ia",
  "identidad-de-marca",
  "nube",
  "publicidad-paga-en-redes",
  "seo",
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    ...staticRoutes.map(({ path, changeFrequency, priority }) => ({
      url: `${BASE_URL}${path}`,
      lastModified,
      changeFrequency,
      priority,
    })),
    ...serviceSlugs.map((slug) => ({
      url: `${BASE_URL}/servicios/${slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...blogPosts.map((post) => {
      const publishedISO = postDateToISO(post.date)
      return {
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: publishedISO ? new Date(publishedISO) : lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }
    }),
  ]
}
