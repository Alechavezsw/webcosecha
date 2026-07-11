import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos y condiciones | Cosecha Creativa",
  description:
    "Condiciones generales de uso del sitio web de Cosecha Creativa (San Juan, Argentina).",
};

export default function TerminosPage() {
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
            <Link href="/seguridad" className="hover:text-gray-900">
              Seguridad
            </Link>
            <Link href="/#contacto" className="hover:text-gray-900">
              Contacto
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12 lg:px-8 lg:py-16">
        <p className="font-mono text-sm uppercase tracking-widest text-gray-500">Legal</p>
        <h1 className="cc-section-title mt-2 font-semibold text-gray-900 sm:text-4xl">
          Términos y condiciones de uso
        </h1>
        <p className="mt-3 text-sm text-gray-500">Última actualización: 10 de mayo de 2026</p>

        <article className="mt-10 space-y-8 text-[15px] leading-relaxed text-gray-700 [&_h2]:mt-10 [&_h2]:scroll-mt-24 [&_h2]:border-b [&_h2]:border-gray-200 [&_h2]:pb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-gray-900 [&_h2:first-child]:mt-0 [&_strong]:font-semibold [&_strong]:text-gray-900 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
          <p>
            El presente documento regula el acceso y uso del sitio web operado por Cosecha Creativa
            (&ldquo;la agencia&rdquo;, &ldquo;nosotros&rdquo;) en adelante. Al navegar o utilizar este sitio
            aceptás estos términos. Si no estás de acuerdo, te pedimos no utilizar el sitio.
          </p>

          <section>
            <h2>1. Objeto</h2>
            <p>
              El sitio tiene carácter informativo y comercial: presenta servicios de marketing
              digital, desarrollo, consultoría y productos relacionados, y ofrece canales de contacto
              (por ejemplo formularios o enlaces a correo o mensajería).
            </p>
          </section>

          <section>
            <h2>2. Uso permitido</h2>
            <p>Te comprometés a utilizar el sitio de forma lícita y a no:</p>
            <ul>
              <li>Intentar acceder a sistemas, cuentas o áreas restringidas sin autorización.</li>
              <li>
                Introducir virus, rastrear de forma abusiva, saturar el servicio o interferir con su
                funcionamiento.
              </li>
              <li>
                Reproducir, extraer o reutilizar de forma masiva el contenido del sitio (scraping) sin
                permiso expreso.
              </li>
            </ul>
          </section>

          <section>
            <h2>3. Propiedad intelectual</h2>
            <p>
              Los textos, imágenes, logotipos, diseño, código y demás contenidos del sitio salvo
              indicación en contrario son propiedad de Cosecha Creativa o de sus licenciantes y están
              protegidos por la legislación aplicable. No confieren licencia alguna salvo lo estrictamente
              necesario para visualizar el sitio en tu navegador.
            </p>
          </section>

          <section>
            <h2>4. Información y disponibilidad</h2>
            <p>
              La información publicada tiene fines orientativos y puede cambiar sin previo aviso. No
              garantizamos que el sitio esté libre de errores o disponible de forma ininterrumpida.
              Las cotizaciones y alcances de proyectos se formalizan por los medios que acuerdes con la
              agencia (propuesta, contrato u orden de trabajo).
            </p>
          </section>

          <section>
            <h2>5. Limitación de responsabilidad</h2>
            <p>
              En la medida permitida por la ley aplicable, Cosecha Creativa no será responsable por
              daños indirectos, lucro cesante o pérdida de datos derivados del uso o la imposibilidad de
              uso del sitio. Los enlaces a sitios de terceros se ofrecen como conveniencia; su contenido y
              políticas son responsabilidad de sus titulares.
            </p>
          </section>

          <section>
            <h2>6. Datos personales</h2>
            <p>
              El tratamiento de datos personales que nos envíes a través del sitio se describe en nuestra{" "}
              <Link
                href="/privacidad"
                className="text-blue-600 underline decoration-blue-600/30 underline-offset-2"
              >
                Política de privacidad
              </Link>
              .
            </p>
          </section>

          <section>
            <h2>7. Modificaciones</h2>
            <p>
              Podemos actualizar estos términos ocasionalmente. La fecha indicada al inicio refleja la
              última revisión relevante. El uso continuado del sitio después de cambios implica la
              aceptación de la versión vigente.
            </p>
          </section>

          <section>
            <h2>8. Ley aplicable y jurisdicción</h2>
            <p>
              Estos términos se interpretan conforme las leyes de la República Argentina. Para cualquier
              controversia, las partes se someten a los tribunales ordinarios con competencia en la
              provincia de San Juan, salvo normas imperativas en contrario.
            </p>
          </section>

          <section>
            <h2>9. Contacto</h2>
            <p>
              Para consultas sobre estos términos, podés escribirnos desde{" "}
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
