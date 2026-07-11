"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Sparkles, Share2, ChevronRight, Bookmark } from "lucide-react";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { SectionDivider } from "@/components/landing/section-divider";
import { blogPosts, BlogPost } from "@/lib/blog-data";
import { useState } from "react";
import { toast, Toaster } from "sonner";

const easePremium = [0.22, 1, 0.36, 1] as const;

// Helper to render basic inline styles (**bold** and standard links)
function renderInlineStyles(text: string) {
  const parts = text.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    
    // Link matching: [text](url)
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      return (
        <a 
          key={i} 
          href={linkMatch[2]} 
          className="text-[#eca8d6] hover:underline font-medium transition-colors"
          target={linkMatch[2].startsWith("http") ? "_blank" : undefined}
          rel={linkMatch[2].startsWith("http") ? "noopener noreferrer" : undefined}
        >
          {linkMatch[1]}
        </a>
      );
    }

    return part;
  });
}

// Custom parser to translate markdown blocks to fully styled Tailwind React components
function renderContent(text: string) {
  return text.split("\n\n").map((block, idx) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    // Headers (la primera línea es el título; si el párrafo viene pegado
    // con un solo salto de línea, se renderiza aparte como párrafo)
    if (trimmed.startsWith("### ") || trimmed.startsWith("#### ")) {
      const isH3 = trimmed.startsWith("### ");
      const [firstLine, ...restLines] = trimmed.split("\n");
      const headingText = firstLine.replace(/^#+\s+/, "");
      const restText = restLines.join("\n").trim();
      if (!headingText && !restText) return null;
      return (
        <div key={idx}>
          {headingText && (isH3 ? (
            <h3 className="font-display text-2xl sm:text-3xl font-semibold mt-12 mb-4 text-[#eca8d6] leading-tight">
              {headingText}
            </h3>
          ) : (
            <h4 className="font-display text-xl sm:text-2xl font-semibold mt-8 mb-3 text-white leading-tight">
              {headingText}
            </h4>
          ))}
          {restText && (
            <p className="text-[15px] sm:text-[16px] leading-relaxed text-white/75 my-5">
              {renderInlineStyles(restText)}
            </p>
          )}
        </div>
      );
    }

    // Bullet Lists
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const items = trimmed.split("\n").map(item => item.replace(/^[-*]\s+/, ""));
      return (
        <ul key={idx} className="list-disc pl-6 space-y-3 my-6 text-white/70">
          {items.map((item, i) => (
            <li key={i} className="text-[15px] sm:text-[16px] leading-relaxed">
              {renderInlineStyles(item)}
            </li>
          ))}
        </ul>
      );
    }

    // Numbered Lists
    if (trimmed.startsWith("1. ")) {
      const items = trimmed.split("\n").map(item => item.replace(/^\d+\.\s+/, ""));
      return (
        <ol key={idx} className="list-decimal pl-6 space-y-3 my-6 text-white/70">
          {items.map((item, i) => (
            <li key={i} className="text-[15px] sm:text-[16px] leading-relaxed">
              {renderInlineStyles(item)}
            </li>
          ))}
        </ol>
      );
    }

    // Blockquotes
    if (trimmed.startsWith("> ")) {
      return (
        <blockquote key={idx} className="border-l-4 border-[#eca8d6] pl-6 italic my-8 text-white/85 text-lg leading-relaxed bg-[#eca8d6]/5 py-5 pr-5 rounded-r-2xl">
          {renderInlineStyles(trimmed.replace(/^>\s+/, ""))}
        </blockquote>
      );
    }

    // Paragraph
    return (
      <p key={idx} className="text-[15px] sm:text-[16px] leading-relaxed text-white/75 my-5">
        {renderInlineStyles(trimmed)}
      </p>
    );
  });
}

interface BlogPostPageClientProps {
  slug: string;
}

export function BlogPostPageClient({ slug }: BlogPostPageClientProps) {
  const reduce = useReducedMotion();
  const [copied, setCopied] = useState(false);

  // Find current post
  const post = blogPosts.find((p) => p.slug === slug);
  
  if (!post) {
    return notFound();
  }

  // Related posts: same category first, max 3
  const relatedPosts = blogPosts
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => {
      if (a.category === post.category && b.category !== post.category) return -1;
      if (b.category === post.category && a.category !== post.category) return 1;
      return 0;
    })
    .slice(0, 3);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("¡Enlace copiado al portapapeles!", {
        style: {
          background: "#08080c",
          border: "1px solid rgba(236,168,214,0.3)",
          color: "#fff"
        }
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#050506] text-white antialiased">
      <Toaster position="bottom-right" />
      <Navigation />

      {/* Spots in the background */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-30">
        <div className="absolute top-[-5%] left-[-10%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(236,168,214,0.12)_0%,transparent_70%)] blur-3xl animate-first" />
        <div className="absolute top-[30%] right-[-10%] h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle_at_center,rgba(161,0,242,0.1)_0%,transparent_70%)] blur-3xl animate-second" />
        <div className="absolute bottom-[20%] left-[-5%] h-[750px] w-[750px] rounded-full bg-[radial-gradient(circle_at_center,rgba(103,232,249,0.1)_0%,transparent_70%)] blur-3xl animate-third" />
      </div>

      {/* Post Reading Header */}
      <article className="relative z-10 pt-28 pb-16 md:pt-36">
        <div className="mx-auto max-w-[800px] px-6">
          
          {/* Breadcrumb & Back */}
          <div className="flex items-center justify-between gap-4 mb-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-semibold text-white/50 hover:text-white transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              Volver al Blog
            </Link>

            <div className="flex items-center gap-1.5 text-xs text-white/30 font-semibold uppercase tracking-wider">
              <span>Blog</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-[#eca8d6]">{post.category}</span>
            </div>
          </div>

          {/* Article Header info */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-white/50 mb-6">
            <span className="rounded-full bg-[#eca8d6]/10 px-3 py-1 font-semibold tracking-wide border border-[#eca8d6]/20 text-[#eca8d6]">
              {post.category}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {post.readTime}
            </span>
          </div>

          {/* Title */}
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easePremium }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight text-white mb-8"
          >
            {post.title}
          </motion.h1>

          {/* Author info */}
          <div className="flex items-center justify-between border-y border-white/10 py-6 mb-12">
            <div className="flex items-center gap-3">
              <Link href="/nosotros" className="hover:opacity-85 transition-opacity">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-white/10"
                />
              </Link>
              <div>
                <div className="text-sm font-semibold text-white">
                  <a href="https://alechavez.cosechacreativa.com.ar/" target="_blank" rel="noopener noreferrer" className="hover:text-[#eca8d6] transition-colors">
                    {post.author.name}
                  </a>
                </div>
                <div className="text-xs text-white/50">{post.author.role}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="flex items-center justify-center h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
                title="Compartir enlace"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Cover Image */}
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-white/10 mb-12 shadow-2xl">
            <img
              src={post.coverImage}
              alt={post.title}
              loading="eager"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          {/* Article Body */}
          <div className="prose prose-invert max-w-none prose-p:text-white/70 prose-headings:text-white prose-a:text-[#eca8d6] prose-strong:text-white prose-blockquote:border-[#eca8d6]">
            {renderContent(post.content)}
          </div>

          {/* Floating Share Box at the bottom */}
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 text-sm text-white/50">
              <Sparkles className="h-4 w-4 text-[#eca8d6]" />
              <span>¿Te gustó este artículo? Compártelo con tu red de contactos.</span>
            </div>
            
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 rounded-full bg-white text-black px-6 py-3 text-sm font-semibold transition hover:bg-white/90"
            >
              <Share2 className="h-4 w-4" />
              Copiar enlace del artículo
            </button>
          </div>

        </div>
      </article>

      <SectionDivider color="purple-rose" />

      {/* Related Posts Section */}
      <section className="relative py-16 md:py-24 bg-[#030305] z-10">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-12">
          
          <div className="flex items-center justify-between mb-12">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-[#eca8d6]/80">Lecturas recomendadas</p>
              <h2 className="font-display text-3xl font-semibold mt-2 md:text-4xl">Artículos Relacionados</h2>
            </div>
            
            <Link
              href="/blog"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white transition-colors"
            >
              Ver todos los posts
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((rPost) => (
              <article
                key={rPost.slug}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-white/[0.01] p-5 hover-lift liquid-glass"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl">
                    <img
                      src={rPost.coverImage}
                      alt={rPost.title}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute top-4 left-4 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[9px] font-semibold tracking-wide border border-white/10">
                      {rPost.category}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-4 text-[10px] text-white/40">
                    <span>{rPost.date}</span>
                    <span>{rPost.readTime}</span>
                  </div>

                  <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-white group-hover:text-[#eca8d6] transition-colors duration-300 line-clamp-2">
                    <Link href={`/blog/${rPost.slug}`}>
                      {rPost.title}
                    </Link>
                  </h3>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-white/50">
                    <a href="https://alechavez.cosechacreativa.com.ar/" target="_blank" rel="noopener noreferrer" className="hover:text-[#eca8d6] transition-colors">
                      {rPost.author.name}
                    </a>
                  </span>
                  
                  <Link
                    href={`/blog/${rPost.slug}`}
                    className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-[#eca8d6]"
                  >
                    Leer
                    <ChevronRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      <SectionDivider color="dark" />

      <FooterSection />
    </main>
  );
}
