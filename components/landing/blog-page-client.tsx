"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, BookOpen, Calendar, Clock, Filter, Sparkles } from "lucide-react";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { SectionDivider } from "@/components/landing/section-divider";
import { blogPosts, BlogPost } from "@/lib/blog-data";

const easePremium = [0.22, 1, 0.36, 1] as const;

const categories = ["Todos", "IA", "Web", "Redes", "Compol"] as const;

export function BlogPageClient() {
  const reduce = useReducedMotion();
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

  // Filter posts
  const filteredPosts = selectedCategory === "Todos"
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

  // Find the featured post (or default to the first one)
  const featuredPost = blogPosts.find(post => post.featured) || blogPosts[0];
  
  // Exclude featured post from the grid if we are showing "Todos" to avoid repetition,
  // or keep it if a specific category is selected
  const gridPosts = selectedCategory === "Todos"
    ? filteredPosts.filter(post => post.slug !== featuredPost.slug)
    : filteredPosts;

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#050506] text-white antialiased">
      <Navigation />

      {/* Bioluminescent spotlights in the background */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-30">
        <div className="absolute top-[-5%] left-[-10%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(236,168,214,0.15)_0%,transparent_70%)] blur-3xl animate-first" />
        <div className="absolute top-[25%] right-[-10%] h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle_at_center,rgba(161,0,242,0.12)_0%,transparent_70%)] blur-3xl animate-second" />
        <div className="absolute top-[50%] left-[-5%] h-[650px] w-[650px] rounded-full bg-[radial-gradient(circle_at_center,rgba(103,232,249,0.12)_0%,transparent_70%)] blur-3xl animate-third" />
        <div className="absolute bottom-[10%] right-[-5%] h-[800px] w-[800px] rounded-full bg-[radial-gradient(circle_at_center,rgba(184,82,33,0.12)_0%,transparent_70%)] blur-3xl animate-fourth" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
        <div className="relative z-10 mx-auto max-w-[1200px] px-6 lg:px-12 text-center">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easePremium }}
            className="inline-flex items-center gap-2 rounded-full border border-[#eca8d6]/30 bg-[#eca8d6]/5 px-4 py-1.5 text-xs font-mono tracking-wider text-[#eca8d6] uppercase"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Cosecha Creativa Blog
          </motion.div>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: easePremium }}
            className="mt-6 font-display text-5xl font-semibold tracking-tight md:text-7xl lg:text-8xl"
          >
            Ideas, <span className="word-gradient italic">Estrategias</span> y Futuro
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: easePremium }}
            className="mx-auto mt-6 max-w-2xl text-[16px] leading-relaxed text-white/70 md:text-[18px]"
          >
            Exploramos el impacto del diseño web premium, la inteligencia artificial aplicada, la comunicación de impacto y el marketing estratégico en el ecosistema digital moderno.
          </motion.p>
        </div>
      </section>

      <SectionDivider color="purple-rose" />

      {/* Featured Post (Only visible if showing 'Todos') */}
      {selectedCategory === "Todos" && featuredPost && (
        <section className="relative py-12 md:py-20 z-10">
          <div className="mx-auto max-w-[1200px] px-6 lg:px-12">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 30 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: easePremium }}
              className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 backdrop-blur-md"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-0">
                {/* Image */}
                <div className="lg:col-span-7 relative h-[280px] sm:h-[400px] lg:h-[500px] w-full overflow-hidden">
                  <img
                    src={featuredPost.coverImage}
                    alt={featuredPost.title}
                    loading="eager"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
                  
                  {/* Category Tag */}
                  <span className="absolute top-6 left-6 rounded-full bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs font-semibold tracking-wide border border-white/20">
                    {featuredPost.category}
                  </span>
                </div>

                {/* Content */}
                <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 text-xs text-white/50">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {featuredPost.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {featuredPost.readTime}
                      </span>
                    </div>

                    <h2 className="font-display text-2xl sm:text-4xl font-semibold leading-tight text-white group-hover:text-[#eca8d6] transition-colors duration-300">
                      <Link href={`/blog/${featuredPost.slug}`}>
                        {featuredPost.title}
                      </Link>
                    </h2>

                    <p className="text-[15px] leading-relaxed text-white/60">
                      {featuredPost.excerpt}
                    </p>
                  </div>

                  {/* Author & Button */}
                  <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Link href="/nosotros" className="hover:opacity-85 transition-opacity">
                        <img
                          src={featuredPost.author.avatar}
                          alt={featuredPost.author.name}
                          className="h-10 w-10 rounded-full object-cover ring-2 ring-white/10"
                        />
                      </Link>
                      <div>
                        <div className="text-sm font-semibold text-white">
                          <a href="https://alechavez.cosechacreativa.com.ar/" target="_blank" rel="noopener noreferrer" className="hover:text-[#eca8d6] transition-colors">
                            {featuredPost.author.name}
                          </a>
                        </div>
                        <div className="text-xs text-white/40">{featuredPost.author.role}</div>
                      </div>
                    </div>

                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white text-black transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {selectedCategory === "Todos" && <SectionDivider color="cyan" />}

      {/* Main Blog Archive & Grid */}
      <section className="relative py-12 md:py-16 z-10">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-12">
          
          {/* Category Filter */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12 border-b border-white/10 pb-8">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-[#eca8d6]" />
              <span className="font-mono text-xs tracking-widest text-[#eca8d6] uppercase">Filtrar por Categoría</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-5 py-2 text-xs font-semibold tracking-wider transition-all ${
                    selectedCategory === category
                      ? "bg-white text-black border border-white"
                      : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
                  }`}
                >
                  {category === "Todos" ? "Todos los artículos" : category}
                </button>
              ))}
            </div>
          </div>

          {/* Posts Grid */}
          <AnimatePresence mode="popLayout">
            <motion.div
              layout={!reduce}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {gridPosts.length > 0 ? (
                gridPosts.map((post, i) => (
                  <motion.article
                    layout={!reduce}
                    initial={reduce ? false : { opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.6, delay: i * 0.05, ease: easePremium }}
                    key={post.slug}
                    className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-5 hover-lift liquid-glass"
                  >
                    <div>
                      {/* Card Image */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <span className="absolute top-4 left-4 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[10px] font-semibold tracking-wide border border-white/10">
                          {post.category}
                        </span>
                      </div>

                      {/* Header Info */}
                      <div className="mt-5 flex items-center gap-4 text-[11px] text-white/40">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="mt-4 font-display text-xl font-semibold leading-snug text-white group-hover:text-[#eca8d6] transition-colors duration-300">
                        <Link href={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h3>

                      {/* Excerpt */}
                      <p className="mt-3 text-sm text-white/50 line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Author & Footer */}
                    <div className="mt-8 pt-5 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Link href="/nosotros" className="hover:opacity-85 transition-opacity">
                          <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="h-8 w-8 rounded-full object-cover ring-1 ring-white/10"
                          />
                        </Link>
                        <div>
                          <div className="text-xs font-semibold text-white">
                            <a href="https://alechavez.cosechacreativa.com.ar/" target="_blank" rel="noopener noreferrer" className="hover:text-[#eca8d6] transition-colors">
                              {post.author.name}
                            </a>
                          </div>
                          <div className="text-[10px] text-white/30">{post.author.role}</div>
                        </div>
                      </div>

                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#eca8d6] group-hover:underline"
                      >
                        Leer
                        <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </motion.article>
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <BookOpen className="h-12 w-12 text-white/20 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white/80">No hay artículos en esta categoría</h3>
                  <p className="text-sm text-white/40 mt-2">Estamos redactando nuevos artículos. ¡Vuelve pronto!</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

        </div>
      </section>

      <SectionDivider color="dark" />

      {/* Mini CTA */}
      <section className="relative py-20 overflow-hidden bg-black/20">
        <div className="relative z-10 mx-auto max-w-[1200px] px-6 text-center lg:px-12">
          <h2 className="font-display text-3xl font-semibold md:text-5xl">
            ¿Quieres transformar tu ecosistema digital?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] text-white/60">
            Escribimos sobre lo que hacemos y hacemos lo que escribimos. Agenda una consulta gratuita con nuestro equipo hoy mismo.
          </p>
          <Link
            href="/contacto"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-gray-900 transition hover:bg-white/90"
          >
            Comenzar mi proyecto
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <SectionDivider color="dark" />

      <FooterSection />
    </main>
  );
}
