/** @type {import('next').NextConfig} */
const nextConfig = {
  /** Permite correr una segunda instancia dev en paralelo (lock de Next vive en distDir). */
  distDir: process.env.NEXT_DIST_DIR || '.next',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  /** SPA Vite (`Min/`) copiada a `public/mineria` — rutas limpias sin `/index.html`. */
  async redirects() {
    return [
      {
        source: '/fotografia-profesional-en-san-juan',
        destination: '/servicios/foto-y-video',
        permanent: true,
      },
      {
        source: '/fotografia-profesional-en-san-juan/',
        destination: '/servicios/foto-y-video',
        permanent: true,
      },
      {
        source: '/despierta-tu-marca-con-cosecha-creativa-diseno-grafico-que-impacta-y-vende',
        destination: '/servicios/diseno-grafico',
        permanent: true,
      },
      {
        source: '/despierta-tu-marca-con-cosecha-creativa-diseno-grafico-que-impacta-y-vende/',
        destination: '/servicios/diseno-grafico',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      { source: '/mineria', destination: '/mineria/index.html' },
      { source: '/mineria/', destination: '/mineria/index.html' },
    ]
  },
  /** Evita que Chrome / otros navegadores guarden HTML estático en dev (útil en ventana externa). */
  async headers() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'no-store, no-cache, must-revalidate, max-age=0',
            },
          ],
        },
      ]
    }
    return []
  },
}

export default nextConfig
