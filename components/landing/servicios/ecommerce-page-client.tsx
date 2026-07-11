"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  CreditCard,
  Globe,
  Heart,
  Plus,
  Rocket,
  Search,
  Share2,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
  Store,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { FlowArt, FlowSection } from "@/components/landing/flow-art";
import {
  ECOMMERCE_LOGOS_PAYMENT,
  ECOMMERCE_LOGOS_PLATFORM,
  ECOMMERCE_LOGOS_SOCIAL,
  ECOMMERCE_LOGOS_WHATSAPP,
  EcommerceBrandLogoRow,
} from "@/components/landing/servicios/ecommerce-brand-logos";
import { WhatsAppMark } from "@/components/icons/whatsapp-mark";
import { cn } from "@/lib/utils";
import { getWhatsAppHref } from "@/lib/whatsapp";

/** Fondos sólidos por panel — contraste fuerte para el efecto FlowArt. */
const solid = {
  hero: "bg-[#2d2657] text-white",
  vitrina: "bg-[#0b0b12] text-white",
  incluye: "bg-[#14532d] text-white",
  pagos: "bg-[#9a3412] text-white",
  redes: "bg-[#155e75] text-white",
  escala: "bg-[#5b21b6] text-white",
  beneficios: "bg-[#9f1239] text-white",
  cierre: "bg-[#eca8d6] text-gray-900",
} as const;

function BulletList({
  items,
  accentClass,
}: {
  items: readonly string[];
  accentClass?: string;
}) {
  return (
    <ul className="space-y-3">
      {items.map((t) => (
        <li
          key={t}
          className="flex gap-3 text-[14px] leading-relaxed text-white/85 sm:text-[15px]"
        >
          <Check
            className={cn("mt-0.5 h-4 w-4 shrink-0 text-[#eca8d6]", accentClass)}
            strokeWidth={2.5}
            aria-hidden
          />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

function BulletListLight({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((t) => (
        <li key={t} className="flex gap-3 text-[14px] leading-relaxed text-gray-800 sm:text-[15px]">
          <Check
            className="mt-0.5 h-4 w-4 shrink-0 text-violet-700"
            strokeWidth={2.5}
            aria-hidden
          />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

function FrostCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[1.75rem] border border-white/15 bg-black/25 p-8 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.45)] backdrop-blur-md sm:p-10",
        className,
      )}
    >
      {children}
    </div>
  );
}

function FrostCardLight({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-[1.75rem] border border-gray-900/10 bg-white/55 p-8 shadow-[0_28px_90px_-48px_rgba(0,0,0,0.18)] backdrop-blur-md sm:p-10",
        className,
      )}
    >
      {children}
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  eyebrow,
  title,
  subtitle,
  dark = true,
}: {
  icon: React.ComponentType<{ className?: string }>;
  eyebrow: string;
  title: string;
  subtitle?: string;
  dark?: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <span
          className={cn(
            "inline-flex h-14 w-14 items-center justify-center rounded-2xl border shadow-lg",
            dark
              ? "border-white/25 bg-white/10 text-[#eca8d6]"
              : "border-gray-900/15 bg-white text-violet-700 shadow-gray-900/10",
          )}
        >
          <Icon className="h-7 w-7" aria-hidden />
        </span>
        <span
          className={cn(
            "font-mono text-[11px] font-semibold uppercase tracking-[0.35em]",
            dark ? "text-white/55" : "text-gray-600",
          )}
        >
          {eyebrow}
        </span>
      </div>
      <h2
        className={cn(
          "font-display text-[clamp(1.75rem,4vw,3rem)] font-semibold leading-[1.08] tracking-tight",
          dark ? "text-white" : "text-gray-900",
        )}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={cn(
            "max-w-2xl text-lg leading-relaxed sm:text-xl",
            dark ? "text-white/75" : "text-gray-700",
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

/** Productos reales de clientes (fotos en `public/MOCUP/`) — distintos rubros para
 *  mostrar que la tienda sirve a cualquier negocio. */
const VITRINA_PRODUCTS = [
  {
    img: "/MOCUP/carrusel-difusores_09.jpg",
    cat: "Aromas",
    name: "Difusor Saphirus · Melocotón",
    price: "$6.900",
    old: "$8.200",
    rating: 5,
    badge: null as string | null,
  },
  {
    img: "/MOCUP/carrusel_01.jpg",
    cat: "Bodega",
    name: "Malbec Carrascosa",
    price: "$9.800",
    old: null as string | null,
    rating: 5,
    badge: "Top ventas",
  },
  {
    img: "/MOCUP/carrusel-1080x1350_01.jpg",
    cat: "Gastronomía",
    name: "Combo 2 Burgers + Fritas",
    price: "$14.000",
    old: null as string | null,
    rating: 5,
    badge: "Promo",
  },
  {
    img: "/MOCUP/carrusel-difusores_13.jpg",
    cat: "Aromas",
    name: "Difusor Palo Santo",
    price: "$6.900",
    old: null as string | null,
    rating: 4,
    badge: "Nuevo",
  },
  {
    img: "/MOCUP/carrusel_03.jpg",
    cat: "Bodega",
    name: "Torrontés Viognier Dulce",
    price: "$8.500",
    old: "$9.900",
    rating: 5,
    badge: null,
  },
  {
    img: "/MOCUP/carrusel-1080x1350_02.jpg",
    cat: "Gastronomía",
    name: "Bien Pipón · Delivery",
    price: "Ver carta",
    old: null as string | null,
    rating: 5,
    badge: null,
  },
] as const;

const VITRINA_CATS = ["Inicio", "Catálogo", "Ofertas", "Contacto"] as const;

function StarRow({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} de 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            "h-3 w-3",
            i <= rating ? "fill-amber-400 text-amber-400" : "fill-white/15 text-white/15",
          )}
          aria-hidden
        />
      ))}
    </span>
  );
}

/** Mock de tienda online: header con buscador + carrito y grilla de productos reales. */
function StorefrontShowcase() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <SectionTitle
        icon={Store}
        eyebrow="Vitrina"
        title="Así se ve tu tienda vendiendo"
        subtitle="Productos reales de clientes de distintos rubros — cada uno con su catálogo, precios, carrito y compra en pocos toques."
      />

      <div className="overflow-hidden rounded-[1.75rem] border border-white/12 bg-white/[0.025] shadow-[0_40px_120px_-50px_rgba(0,0,0,0.8)] backdrop-blur-md">
        {/* Barra superior de la tienda */}
        <div className="flex flex-wrap items-center gap-3 border-b border-white/10 bg-black/45 px-4 py-3 sm:px-6 sm:py-3.5">
          <span className="flex items-center gap-2 font-display text-base font-semibold tracking-tight text-white">
            <span className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#eca8d6] to-[#a100f2] text-white">
              <ShoppingBag className="size-4" aria-hidden />
            </span>
            Tu Tienda
          </span>

          <div className="order-3 flex min-w-[180px] flex-1 items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-3.5 py-2 text-white/45 sm:order-2">
            <Search className="size-4 shrink-0" aria-hidden />
            <span className="truncate text-[13px]">Buscar productos…</span>
          </div>

          <nav className="order-2 hidden items-center gap-5 text-[13px] font-medium text-white/65 sm:order-3 md:flex">
            {VITRINA_CATS.map((c, i) => (
              <span key={c} className={cn(i === 0 ? "text-white" : "transition-colors hover:text-white")}>
                {c}
              </span>
            ))}
          </nav>

          <span className="relative ml-auto inline-flex size-9 items-center justify-center rounded-full border border-white/12 bg-white/[0.05] text-white sm:ml-0">
            <ShoppingCart className="size-4" aria-hidden />
            <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-[#eca8d6] text-[10px] font-bold text-gray-900">
              3
            </span>
          </span>
        </div>

        {/* Grilla de productos */}
        <div className="grid grid-cols-2 gap-3 p-3 sm:gap-4 sm:p-5 lg:grid-cols-3">
          {VITRINA_PRODUCTS.map((p) => (
            <article
              key={p.name}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/30 transition-all duration-300 hover:-translate-y-1 hover:border-[#eca8d6]/35 hover:shadow-[0_28px_70px_-36px_rgba(236,168,214,0.4)]"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={p.img}
                  alt={p.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 320px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {p.badge ? (
                  <span className="absolute left-2.5 top-2.5 rounded-full bg-[#eca8d6] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-gray-900 shadow-lg">
                    {p.badge}
                  </span>
                ) : null}
                <span className="absolute right-2.5 top-2.5 flex size-8 items-center justify-center rounded-full bg-black/45 text-white/80 backdrop-blur-md transition-colors hover:text-[#eca8d6]">
                  <Heart className="size-4" aria-hidden />
                </span>
                <span className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/55 to-transparent" />
              </div>

              <div className="flex flex-1 flex-col gap-2 p-3 sm:p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white/55">
                    {p.cat}
                  </span>
                  <StarRow rating={p.rating} />
                </div>
                <h4 className="line-clamp-2 text-[13px] font-semibold leading-snug text-white sm:text-sm">
                  {p.name}
                </h4>
                <div className="mt-auto flex items-end justify-between gap-2 pt-1">
                  <span className="flex items-baseline gap-1.5">
                    <span className="font-display text-base font-bold text-white sm:text-lg">{p.price}</span>
                    {p.old ? <span className="text-[11px] text-white/40 line-through">{p.old}</span> : null}
                  </span>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-gray-900 transition-colors hover:bg-[#eca8d6] sm:text-xs"
                    aria-label={`Agregar ${p.name} al carrito`}
                  >
                    <Plus className="size-3.5" aria-hidden />
                    Agregar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Pie de la tienda */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-white/10 bg-black/30 px-5 py-3 text-[11px] text-white/45">
          <span className="inline-flex items-center gap-1.5"><CreditCard className="size-3.5" aria-hidden /> Pago seguro</span>
          <span className="inline-flex items-center gap-1.5"><Rocket className="size-3.5" aria-hidden /> Envíos a todo el país</span>
          <span className="inline-flex items-center gap-1.5"><WhatsAppMark className="size-3.5" aria-hidden /> Consultá por WhatsApp</span>
        </div>
      </div>
    </div>
  );
}

export function EcommercePageClient() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0a0a0c] font-sans antialiased">
      <Navigation />

      <FlowArt aria-label="Servicio de e-commerce Cosecha Creativa">
        {/* 1 · Hero */}
        <FlowSection aria-label="Introducción" innerClassName={solid.hero}>
          <div className="flex max-w-4xl flex-col gap-10">
            <Link
              href="/servicios/diseno-web"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Diseño web
            </Link>

            <SectionTitle
              icon={ShoppingBag}
              eyebrow="Servicio"
              title="E-commerce que vende de verdad"
              subtitle="Creamos tiendas online listas para vender."
            />

            <FrostCard>
              <div className="space-y-5 text-[15px] leading-relaxed text-white/82 sm:text-[17px]">
                <p>
                  En Cosecha Creativa desarrollamos tiendas online profesionales para que tu negocio
                  pueda vender por internet de forma simple, segura y escalable.
                </p>
                <p>
                  No hacemos solo una &ldquo;tiendita linda&rdquo;. Creamos una plataforma comercial
                  pensada para mostrar tus productos, recibir pedidos, cobrar online, organizar el
                  catálogo y facilitar la compra desde cualquier dispositivo.
                </p>
                <p className="border-l-4 border-[#eca8d6] pl-5 font-medium text-white">
                  Tu e-commerce puede integrarse con redes sociales, WhatsApp, medios de pago,
                  envíos, stock, campañas publicitarias y automatización.
                </p>
              </div>
            </FrostCard>
          </div>
          <div aria-hidden className="h-6 shrink-0" />
        </FlowSection>

        {/* 1.5 · Vitrina — mock de tienda con productos reales */}
        <FlowSection aria-label="Vitrina de tu tienda" innerClassName={solid.vitrina}>
          <StorefrontShowcase />
          <div aria-hidden className="h-6 shrink-0" />
        </FlowSection>

        {/* 2 · Qué incluye */}
        <FlowSection aria-label="Qué incluye el servicio" innerClassName={solid.incluye}>
          <div className="flex max-w-4xl flex-col gap-10">
            <SectionTitle
              icon={Globe}
              eyebrow="Paquete base"
              title="¿Qué incluye nuestro servicio?"
              subtitle="Diseño y desarrollo de tienda online, pensado para conversión."
            />
            <FrostCard>
              <h3 className="mb-3 font-display text-xl font-semibold text-white sm:text-2xl">
                Diseño y desarrollo de tienda online
              </h3>
              <p className="mb-8 text-white/75">
                Creamos una tienda adaptada a la identidad de tu marca, con una experiencia clara
                para el usuario y enfocada en vender.
              </p>
              <p className="mb-4 cc-eyebrow-accent">
                Incluye
              </p>
              <BulletList
                items={[
                  "Diseño visual personalizado.",
                  "Catálogo de productos.",
                  "Categorías y filtros.",
                  "Carrito de compras.",
                  "Página de producto.",
                  "Página de contacto.",
                  "Integración con WhatsApp.",
                  "Diseño responsive para celular, tablet y computadora.",
                  "Configuración básica de SEO.",
                  "Carga inicial de productos.",
                  "Botones de compra y consulta rápida.",
                ]}
              />
              <EcommerceBrandLogoRow
                eyebrow="Integración incluida"
                items={ECOMMERCE_LOGOS_WHATSAPP}
              />
            </FrostCard>
          </div>
          <div aria-hidden className="h-6 shrink-0" />
        </FlowSection>

        {/* 3 · Pagos y envíos */}
        <FlowSection aria-label="Pagos y envíos" innerClassName={solid.pagos}>
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
            <FrostCard>
              <div className="mb-6 inline-flex rounded-xl border border-white/20 bg-amber-500/15 p-3 text-amber-100">
                <CreditCard className="h-8 w-8" aria-hidden />
              </div>
              <h3 className="mb-4 font-display text-xl font-semibold text-white sm:text-2xl">
                Integración con medios de pago
              </h3>
              <p className="mb-8 text-white/75">
                Configuramos la tienda para que puedas recibir pagos online de manera profesional.
              </p>
              <p className="mb-4 cc-eyebrow-accent">
                Podemos integrar
              </p>
              <BulletList
                items={[
                  "Mercado Pago.",
                  "Transferencia bancaria.",
                  "Pago en efectivo.",
                  "Cupones de descuento.",
                  "Promociones.",
                  "Métodos de pago personalizados.",
                ]}
              />
              <EcommerceBrandLogoRow
                eyebrow="Ejemplo de medio de pago"
                items={ECOMMERCE_LOGOS_PAYMENT}
              />
            </FrostCard>
            <FrostCard>
              <div className="mb-6 inline-flex rounded-xl border border-white/20 bg-orange-400/15 p-3 text-orange-100">
                <Rocket className="h-8 w-8" aria-hidden />
              </div>
              <h3 className="mb-4 font-display text-xl font-semibold text-white sm:text-2xl">
                Gestión de envíos y entregas
              </h3>
              <p className="mb-8 text-white/75">
                Tu tienda puede estar preparada para vender con retiro en local, delivery propio o
                envíos a distintas zonas.
              </p>
              <p className="mb-4 cc-eyebrow-accent">
                Configuramos
              </p>
              <BulletList
                items={[
                  "Retiro en tienda.",
                  "Envío local.",
                  "Envío provincial o nacional.",
                  "Costos de envío por zona.",
                  "Envío gratis desde cierto monto.",
                  "Mensajes automáticos para el cliente.",
                  "Información clara sobre tiempos de entrega.",
                ]}
              />
            </FrostCard>
          </div>
          <div aria-hidden className="h-6 shrink-0" />
        </FlowSection>

        {/* 4 · Redes y automatización */}
        <FlowSection aria-label="Redes y automatización" innerClassName={solid.redes}>
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
            <FrostCard>
              <div className="mb-6 inline-flex rounded-xl border border-white/20 bg-cyan-400/15 p-3 text-cyan-100">
                <Share2 className="h-8 w-8" aria-hidden />
              </div>
              <h3 className="mb-4 font-display text-xl font-semibold text-white sm:text-2xl">
                Tienda conectada con redes sociales
              </h3>
              <p className="mb-8 text-white/75">
                Integramos tu e-commerce con tu ecosistema digital para que no sea una isla
                perdida en internet.
              </p>
              <p className="mb-4 cc-eyebrow-accent">
                Podemos conectar
              </p>
              <BulletList
                items={[
                  "Instagram.",
                  "Facebook.",
                  "WhatsApp Business.",
                  "Meta Pixel.",
                  "Google Analytics.",
                  "Google Tag Manager.",
                  "Campañas de Meta Ads.",
                  "Email marketing.",
                  "Automatizaciones.",
                ]}
              />
              <EcommerceBrandLogoRow
                eyebrow="Herramientas y plataformas"
                items={ECOMMERCE_LOGOS_SOCIAL}
              />
            </FrostCard>
            <FrostCard>
              <div className="mb-6 inline-flex rounded-xl border border-white/20 bg-teal-400/15 p-3 text-teal-100">
                <Zap className="h-8 w-8" aria-hidden />
              </div>
              <h3 className="mb-4 font-display text-xl font-semibold text-white sm:text-2xl">
                Automatizaciones para vender mejor
              </h3>
              <p className="mb-8 text-white/75">
                Herramientas inteligentes para mejorar la gestión y la atención al cliente.
              </p>
              <p className="mb-4 cc-eyebrow-accent">
                Ejemplos
              </p>
              <BulletList
                items={[
                  "Aviso automático de nuevos pedidos.",
                  "Mensajes por WhatsApp.",
                  "Recuperación de carritos abandonados.",
                  "Correos automáticos.",
                  "Segmentación de clientes.",
                  "Reportes de ventas.",
                  "Actualización de stock.",
                  "Integración con planillas o sistemas internos.",
                  "Chatbot para preguntas frecuentes.",
                ]}
              />
            </FrostCard>
          </div>
          <div aria-hidden className="h-6 shrink-0" />
        </FlowSection>

        {/* 5 · Escalable y plataformas */}
        <FlowSection aria-label="Escalabilidad y tecnologías" innerClassName={solid.escala}>
          <div className="mx-auto flex max-w-4xl flex-col gap-10">
            <SectionTitle
              icon={TrendingUp}
              eyebrow="Crecimiento"
              title="Escalable y con la tecnología correcta"
            />
            <FrostCard>
              <h3 className="mb-4 font-display text-xl font-semibold text-white sm:text-2xl">
                E-commerce escalable
              </h3>
              <p className="mb-8 text-white/75">
                Desarrollamos tiendas que pueden empezar simples y crecer con tu negocio.
              </p>
              <p className="mb-4 cc-eyebrow-accent">
                Podés sumar después
              </p>
              <BulletList
                items={[
                  "Más productos.",
                  "Múltiples categorías.",
                  "Gestión avanzada de stock.",
                  "Panel de clientes.",
                  "Sistema de puntos o fidelización.",
                  "Mayoristas y minoristas.",
                  "Precios especiales por usuario.",
                  "Facturación.",
                  "Integración con sistemas de gestión.",
                  "App web progresiva.",
                  "Inteligencia artificial para recomendaciones.",
                ]}
              />
            </FrostCard>
            <FrostCard>
              <h3 className="mb-4 font-display text-xl font-semibold text-white sm:text-2xl">
                Plataformas que podemos trabajar
              </h3>
              <p className="mb-8 text-white/75">
                Según negocio, presupuesto y necesidad:
              </p>
              <BulletList
                items={[
                  "WordPress + WooCommerce.",
                  "Tienda Nube.",
                  "Shopify.",
                  "Desarrollo a medida.",
                  "Next.js con backend personalizado.",
                  "Supabase / Firebase.",
                  "Integraciones con APIs externas.",
                ]}
              />
              <EcommerceBrandLogoRow
                eyebrow="Logos de referencia"
                items={ECOMMERCE_LOGOS_PLATFORM}
              />
              <p className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4 text-sm italic text-white/70">
                Elegimos la tecnología según el objetivo comercial, no por capricho técnico — aunque
                a veces el capricho se disfraza de &ldquo;arquitectura escalable&rdquo;.
              </p>
            </FrostCard>
          </div>
          <div aria-hidden className="h-6 shrink-0" />
        </FlowSection>

        {/* 6 · Beneficios */}
        <FlowSection aria-label="Beneficios de trabajar con nosotros" innerClassName={solid.beneficios}>
          <div className="mx-auto flex max-w-4xl flex-col gap-10">
            <SectionTitle
              icon={Sparkles}
              eyebrow="Valor agregado"
              title="Por qué tu tienda con nosotros"
              subtitle="Menos fricción para vos y más claridad para tu cliente."
            />
            <FrostCard>
              <p className="mb-8 text-white/75">
                No entregamos solo código: entregamos una pieza del negocio que tiene que funcionar
                todos los días.
              </p>
              <p className="mb-4 cc-eyebrow-accent">
                Beneficios
              </p>
              <BulletList
                items={[
                  "Experiencia en ventas online y conversión.",
                  "Arquitectura pensada para escalar sin rehacer todo.",
                  "Integraciones con pagos, envíos y marketing.",
                  "Soporte claro y comunicación directa.",
                  "Performance y SEO como parte del paquete.",
                  "Capacitación para que puedas gestionar tu catálogo.",
                  "Documentación y handoff ordenado.",
                ]}
              />
            </FrostCard>
          </div>
          <div aria-hidden className="h-6 shrink-0" />
        </FlowSection>

        {/* 7 · Cierre y contacto */}
        <FlowSection aria-label="Próximo paso" innerClassName={solid.cierre}>
          <div className="mx-auto flex max-w-3xl flex-col gap-10">
            <SectionTitle
              icon={ShoppingBag}
              dark={false}
              eyebrow="Siguiente paso"
              title="¿Listo para vender online?"
              subtitle="Contanos tu rubro, volumen de productos y si ya tenés marca o catálogo; armamos una propuesta alineada a tu presupuesto."
            />
            <FrostCardLight>
              <p className="mb-8 text-lg leading-relaxed text-gray-800">
                Tu e-commerce puede ser el próximo canal que multiplique ventas — sin sacrificar la
                identidad de tu marca.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                <Link
                  href="/#contacto"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-8 py-4 text-base font-semibold text-[#eca8d6] shadow-lg shadow-gray-900/25 transition hover:bg-gray-800"
                >
                  Pedir propuesta
                  <ArrowUpRight className="h-5 w-5" aria-hidden />
                </Link>
                <a
                  href={getWhatsAppHref("E-commerce / tienda online")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-900/15 bg-white px-8 py-4 text-base font-semibold text-gray-900 shadow-sm transition hover:border-gray-900/25 hover:bg-gray-50"
                >
                  <WhatsAppMark className="h-5 w-5 shrink-0" aria-hidden />
                  WhatsApp
                </a>
              </div>
              <p className="mt-8 text-center text-sm text-gray-600">
                También podés volver a{" "}
                <Link href="/servicios/diseno-web" className="font-medium text-violet-800 underline-offset-4 hover:underline">
                  diseño web
                </Link>{" "}
                o explorar el resto de servicios desde el menú.
              </p>
            </FrostCardLight>
          </div>
          <div aria-hidden className="h-6 shrink-0" />
        </FlowSection>
      </FlowArt>

      <FooterSection />
    </div>
  );
}
