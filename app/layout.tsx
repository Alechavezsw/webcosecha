import React from "react"
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { CosechaSiteExtras } from '@/components/layout/cosecha-site-extras'
import './globals.css'

// Custom offline font configuration to bypass build-time Google Fonts downloads.
// The actual fonts are imported via the browser in app/globals.css.
const instrumentSans = { variable: "font-instrument" };
const instrumentSerif = { variable: "font-instrument-serif" };
const jetbrainsMono = { variable: "font-jetbrains" };

export const metadata: Metadata = {
  metadataBase: new URL('https://cosechacreativa.com.ar'),
  title: {
    default: 'Cosecha Creativa | Agencia de Marketing Digital y Diseño Web en San Juan',
    template: '%s | Cosecha Creativa',
  },
  description: 'Somos Cosecha Creativa, tu agencia de marketing digital en San Juan. Especialistas en gestión de redes, diseño web, inteligencia artificial y automatizaciones.',
  keywords: 'agencia de marketing digital san juan, diseño web san juan, desarrollo de páginas web, gestión de redes sociales, automatización con n8n, chatbots con inteligencia artificial, agencia de comunicación política san juan, producción audiovisual empresas, branding y diseño gráfico san juan, marketing para constructoras, posicionamiento SEO san juan, marketing integral para empresas',
  generator: 'Cosecha Creativa',
  alternates: {
    canonical: './',
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: 'Cosecha Creativa',
    title: 'Cosecha Creativa | Agencia de Marketing Digital y Diseño Web en San Juan',
    description: 'Estrategia, creatividad y tecnología para potenciar tu presencia digital. Gestión de redes, diseño web, IA y automatizaciones en San Juan.',
    url: 'https://cosechacreativa.com.ar',
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
    ],
    apple: '/apple-icon.png',
  },
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://cosechacreativa.com.ar/#organization",
  name: "Cosecha Creativa",
  url: "https://cosechacreativa.com.ar",
  logo: "https://cosechacreativa.com.ar/icon-light-32x32.png",
  description:
    "Agencia de marketing digital en San Juan, Argentina. Gestión de redes sociales, diseño web, inteligencia artificial, automatizaciones y comunicación política.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "San Juan",
    addressRegion: "San Juan",
    addressCountry: "AR",
  },
  areaServed: "Argentina",
  founder: {
    "@type": "Person",
    name: "Ale Chávez",
  },
}

const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://cosechacreativa.com.ar/#website",
  name: "Cosecha Creativa",
  url: "https://cosechacreativa.com.ar",
  inLanguage: "es-AR",
  publisher: { "@id": "https://cosechacreativa.com.ar/#organization" },
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
        {children}
        <CosechaSiteExtras />
        <Analytics />
      </body>
    </html>
  )
}
