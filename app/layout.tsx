import React from "react"
import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { CosechaSiteExtras } from '@/components/layout/cosecha-site-extras'
import './globals.css'

// Custom offline font configuration to bypass build-time Google Fonts downloads.
// The actual fonts are imported via the browser in app/globals.css.
const instrumentSans = { variable: "font-instrument" };
const instrumentSerif = { variable: "font-instrument-serif" };
const jetbrainsMono = { variable: "font-jetbrains" };

const SITE_URL = "https://cosechacreativa.com.ar"
const SITE_NAME = "Cosecha Creativa"
const SITE_DESCRIPTION =
  "Agencia de marketing digital en San Juan, Argentina. Gestión de redes sociales, diseño web, SEO, publicidad, branding, inteligencia artificial y automatizaciones."

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#050505" },
    { media: "(prefers-color-scheme: light)", color: "#050505" },
  ],
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Agencia de Marketing Digital y Diseño Web en San Juan`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Ale Chávez", url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "marketing",
  keywords: [
    "agencia de marketing digital San Juan",
    "diseño web San Juan",
    "gestión de redes sociales",
    "SEO San Juan",
    "publicidad en redes",
    "branding",
    "inteligencia artificial empresas",
    "automatización n8n",
    "chatbots",
    "comunicación política San Juan",
    "Cosecha Creativa",
  ],
  generator: SITE_NAME,
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "es-AR": SITE_URL,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Agencia de Marketing Digital y Diseño Web en San Juan`,
    description:
      "Estrategia, creatividad y tecnología para potenciar tu presencia digital. Gestión de redes, diseño web, IA y automatizaciones en San Juan.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Marketing digital en San Juan`,
    description:
      "Redes, web, SEO, branding e IA para marcas que quieren crecer en San Juan y Argentina.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-light-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-dark-32x32.png", sizes: "32x32", type: "image/png", media: "(prefers-color-scheme: dark)" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.svg",
  },
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/apple-icon.png`,
  image: `${SITE_URL}/opengraph-image`,
  description: SITE_DESCRIPTION,
  address: {
    "@type": "PostalAddress",
    addressLocality: "San Juan",
    addressRegion: "San Juan",
    addressCountry: "AR",
  },
  areaServed: {
    "@type": "Country",
    name: "Argentina",
  },
  founder: {
    "@type": "Person",
    name: "Ale Chávez",
  },
  sameAs: [
    "https://www.instagram.com/cosecha.creativa/",
    "https://www.facebook.com/profile.php?id=61551889621823",
    "https://www.linkedin.com/in/manuel-alejandro-chávez-1316aa241",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: "+54-9-264-546-8012",
      email: "contacto@cosechacreativa.com.ar",
      areaServed: "AR",
      availableLanguage: ["Spanish"],
    },
  ],
}

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#localbusiness`,
  name: SITE_NAME,
  url: SITE_URL,
  image: `${SITE_URL}/opengraph-image`,
  description: SITE_DESCRIPTION,
  priceRange: "$$",
  telephone: "+54-9-264-546-8012",
  email: "contacto@cosechacreativa.com.ar",
  address: {
    "@type": "PostalAddress",
    addressLocality: "San Juan",
    addressRegion: "San Juan",
    addressCountry: "AR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -31.5375,
    longitude: -68.5364,
  },
  areaServed: "San Juan, Argentina",
  parentOrganization: { "@id": `${SITE_URL}/#organization` },
}

const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: "es-AR",
  description: SITE_DESCRIPTION,
  publisher: { "@id": `${SITE_URL}/#organization` },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es-AR">
      <body className={`${instrumentSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
        {children}
        <CosechaSiteExtras />
        <Analytics />
      </body>
    </html>
  )
}
