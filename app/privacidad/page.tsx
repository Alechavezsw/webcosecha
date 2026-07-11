import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Política de privacidad | Cosecha Creativa",
  description:
    "Cómo tratamos tus datos personales en sitios web, formularios y servicios de Cosecha Creativa (San Juan, Argentina).",
}

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900">
      <header className="border-b border-gray-200/80 bg-white">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <Link href="/" className="font-display text-xl font-medium tracking-tight text-gray-900 hover:text-gray-700">
            Cosecha Creativa
          </Link>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
            <Link href="/terminos" className="hover:text-gray-900">
              Términos
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
          Política de privacidad
        </h1>
        <p className="mt-3 text-sm text-gray-500">Última actualización: 10 de mayo de 2026</p>

        <article className="mt-10 space-y-8 text-[15px] leading-relaxed text-gray-700 [&_h2]:mt-10 [&_h2]:scroll-mt-24 [&_h2]:border-b [&_h2]:border-gray-200 [&_h2]:pb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-gray-900 [&_h2:first-child]:mt-0 [&_strong]:font-semibold [&_strong]:text-gray-900 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
          <p>
            En Cosecha Creativa (&ldquo;nosotros&rdquo;, &ldquo;la agencia&rdquo;) respetamos tu privacidad. Esta
            política describe de forma general cómo podemos tratar los datos personales que nos
            facilitás al visitar nuestro sitio, completar formularios o contratar nuestros servicios.
            No reemplaza asesoramiento legal; si necesitás un texto a medida para tu negocio, lo
            vemos en el marco del proyecto.
          </p>

          <section>
          <h2>1. Responsable</h2>
          <p>
            El responsable del sitio y de las gestiones asociadas a los formularios de contacto y
            consultas comerciales es Cosecha Creativa, con actividad en San Juan, Argentina. Podés
            contactarnos desde la sección{" "}
            <Link href="/#contacto" className="text-blue-600 underline decoration-blue-600/30 underline-offset-2">
              Contacto
            </Link>{" "}
            del sitio.
          </p>
          </section>

          <section>
          <h2>2. Datos que podemos recibir</h2>
          <p>Según cómo interactúes con nosotros, podemos tratar por ejemplo:</p>
          <ul>
            <li>
              <strong>Datos identificativos y de contacto:</strong> nombre, email, teléfono, empresa
              o proyecto mencionado en el mensaje.
            </li>
            <li>
              <strong>Datos técnicos del navegador:</strong> dirección IP, tipo de dispositivo,
              navegador, páginas visitadas y tiempo aproximado de visita, a través de herramientas
              de analítica si están activas.
            </li>
            <li>
              <strong>Contenido que nos envíes voluntariamente</strong> en formularios, correos o
              reuniones (por ejemplo briefs, enlaces o materiales para cotización).
            </li>
          </ul>
          </section>

          <section>
          <h2>3. Finalidades</h2>
          <p>Usamos esa información para:</p>
          <ul>
            <li>Responder consultas y solicitudes de presupuesto.</li>
            <li>Gestionar la relación comercial y la prestación de servicios contratados.</li>
            <li>Mejorar la experiencia del sitio y entender de forma agregada el tráfico (analítica).</li>
            <li>Cumplir obligaciones legales aplicables cuando corresponda.</li>
          </ul>
          </section>

          <section>
          <h2>4. Base jurídica y conservación</h2>
          <p>
            El tratamiento se basa en tu consentimiento cuando nos escribís o solicitás información,
            en la ejecución de medidas precontractuales o contractuales cuando hay un proyecto en
            curso, y en el interés legítimo de mejorar el sitio cuando la analítica está configurada
            de forma acorde a la normativa vigente.
          </p>
          <p>
            Conservamos los datos el tiempo necesario para esas finalidades y los plazos que imponga
            la ley (por ejemplo obligaciones contables o fiscales cuando hubiera facturación).
          </p>
          </section>

          <section>
          <h2>5. Cesiones y encargados</h2>
          <p>
            No vendemos tus datos personales. Podemos utilizar proveedores tecnológicos (hosting,
            email transaccional, analítica, CRM u otros) que tratan datos por nuestra cuenta y bajo
            instrucciones, en la medida necesaria para operar el sitio y los servicios.
          </p>
          </section>

          <section>
          <h2>6. Tus derechos</h2>
          <p>
            En Argentina, la Ley 25.326 de Protección de Datos Personales y su normativa complementaria
            reconocen derechos de acceso, rectificación, actualización o supresión cuando
            corresponda. Podés ejercerlos contactándonos por los medios indicados en el sitio. También
            podés presentar una reclamo ante la Dirección Nacional de Protección de Datos Personales
            cuando proceda.
          </p>
          </section>

          <section>
          <h2>7. Cookies y tecnologías similares</h2>
          <p>
            El sitio puede usar cookies propias o de terceros para funciones esenciales, preferencias
            o estadísticas. Podés configurar tu navegador para bloquear o eliminar cookies; tené en
            cuenta que algunas partes del sitio podrían no funcionar igual.
          </p>
          </section>

          <section>
          <h2>8. Enlaces a terceros</h2>
          <p>
            Nuestro sitio puede enlazar redes sociales u otros sitios. Esas plataformas tienen sus
            propias políticas de privacidad; te recomendamos leerlas antes de enviarles datos.
          </p>
          </section>

          <section>
          <h2>9. Menores</h2>
          <p>
            Los servicios de la agencia están dirigidos a personas que actúen en nombre de empresas u
            organizaciones. No solicitamos de forma consciente datos de menores de 13 años.
          </p>
          </section>

          <section>
          <h2>10. Cambios en esta política</h2>
          <p>
            Podemos actualizar este texto para reflejar cambios legales o en nuestros procesos. La
            fecha al inicio indica la última revisión relevante.
          </p>
          </section>

          <section>
          <h2>11. Contacto</h2>
          <p>
            Para consultas sobre privacidad o ejercicio de derechos, escribinos desde{" "}
            <Link href="/#contacto" className="text-blue-600 underline decoration-blue-600/30 underline-offset-2">
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
  )
}
