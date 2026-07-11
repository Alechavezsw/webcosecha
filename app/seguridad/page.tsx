import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Seguridad | Cosecha Creativa",
  description:
    "Prácticas generales de seguridad en nuestro sitio, proyectos y canales de contacto. Cosecha Creativa, San Juan, Argentina.",
};

export default function SeguridadPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900">
      <header className="border-b border-gray-200/80 bg-white">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <Link
            href="/"
            className="font-display text-xl font-medium tracking-tight text-gray-900 hover:text-gray-700"
          >
            Cosecha Creativa
          </Link>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
            <Link href="/privacidad" className="hover:text-gray-900">
              Privacidad
            </Link>
            <Link href="/terminos" className="hover:text-gray-900">
              Términos
            </Link>
            <Link href="/#contacto" className="hover:text-gray-900">
              Contacto
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12 lg:px-8 lg:py-16">
        <p className="font-mono text-sm uppercase tracking-widest text-gray-500">Confianza</p>
        <h1 className="cc-section-title mt-2 font-semibold text-gray-900 sm:text-4xl">
          Seguridad
        </h1>
        <p className="mt-3 text-sm text-gray-500">Última actualización: 11 de mayo de 2026</p>

        <article className="mt-10 space-y-8 text-[15px] leading-relaxed text-gray-700 [&_h2]:mt-10 [&_h2]:scroll-mt-24 [&_h2]:border-b [&_h2]:border-gray-200 [&_h2]:pb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-gray-900 [&_h2:first-child]:mt-0 [&_strong]:font-semibold [&_strong]:text-gray-900 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
          <p>
            En Cosecha Creativa tomamos en serio la protección de la información y la continuidad de
            los servicios. Esta página resume, a modo orientativo, algunas líneas generales sobre
            seguridad en relación con nuestro sitio y con la forma habitual de trabajar en proyectos
            digitales. No sustituye un acuerdo contractual ni un informe técnico formal.
          </p>

          <section>
            <h2>1. Sitio web y comunicaciones</h2>
            <p>
              El sitio se sirve sobre conexión cifrada (HTTPS) cuando el proveedor de hosting y la
              configuración lo permiten. Te recomendamos no enviar contraseñas, datos bancarios ni
              información altamente sensible por formularios de contacto genéricos; para esos casos
              conviene acordar un canal seguro concreto con tu interlocutor en la agencia.
            </p>
          </section>

          <section>
            <h2>2. Proyectos y datos de clientes</h2>
            <p>
              En cada encargo definimos con el cliente qué información se maneja, dónde se aloja y
              qué responsabilidades corresponden a cada parte (por ejemplo credenciales de acceso,
              copias de respaldo o cumplimiento normativo sectorial). Las medidas concretas dependen
              del alcance, del presupuesto y de las plataformas elegidas.
            </p>
          </section>

          <section>
            <h2>3. Buenas prácticas habituales</h2>
            <p>En desarrollo y operación procuramos, cuando aplica al proyecto:</p>
            <ul>
              <li>Usar entornos y permisos acotados para accesos técnicos.</li>
              <li>Mantener dependencias y componentes actualizados en la medida acordada con el cliente.</li>
              <li>Evitar exponer en público claves API, tokens o datos personales innecesarios.</li>
              <li>Documentar entregas y puntos de contacto para incidentes o dudas de seguridad.</li>
            </ul>
          </section>

          <section>
            <h2>4. Reporte de vulnerabilidades</h2>
            <p>
              Si detectás un problema de seguridad relacionado con nuestro sitio o con un servicio que
              identifiques claramente como operado por nosotros, escribinos desde{" "}
              <Link
                href="/#contacto"
                className="text-blue-600 underline decoration-blue-600/30 underline-offset-2"
              >
                Contacto
              </Link>{" "}
              con el mayor detalle posible (sin explotar el fallo más allá de lo necesario para
              demostrarlo). Valoramos el aviso responsable y trataremos de responder en un plazo
              razonable.
            </p>
          </section>

          <section>
            <h2>5. Privacidad y datos personales</h2>
            <p>
              El tratamiento de datos personales se describe en nuestra{" "}
              <Link
                href="/privacidad"
                className="text-blue-600 underline decoration-blue-600/30 underline-offset-2"
              >
                Política de privacidad
              </Link>
              . Los{" "}
              <Link
                href="/terminos"
                className="text-blue-600 underline decoration-blue-600/30 underline-offset-2"
              >
                Términos y condiciones
              </Link>{" "}
              regulan el uso del sitio.
            </p>
          </section>

          <section>
            <h2>6. Contacto</h2>
            <p>
              Para consultas sobre seguridad en un proyecto o sobre esta página, podés escribirnos
              desde{" "}
              <Link
                href="/#contacto"
                className="text-blue-600 underline decoration-blue-600/30 underline-offset-2"
              >
                Contacto
              </Link>
              .
            </p>
          </section>
        </article>
      </main>

      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-3xl px-6 text-center text-sm text-gray-500 lg:px-8">
          <Link href="/" className="hover:text-gray-800">
            Volver al inicio
          </Link>
        </div>
      </footer>
    </div>
  );
}
