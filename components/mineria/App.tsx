"use client";

import { 
  Pickaxe, 
  TrendingUp, 
  Globe, 
  Users, 
  ArrowRight, 
  Mail, 
  Phone, 
  MapPin,
  Zap,
  Target,
  Search
} from 'lucide-react';
import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// Component Imports
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Services from './components/Services';
import VideoFrame from './components/VideoFrame';
import PostIntroCinematic from './components/PostIntroCinematic';
import Projects from './components/Projects';
import PresenceMap from './components/PresenceMap';

import Contact from './components/Contact';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    title: "Sitio Web",
    description: "Generamos un sitio web con todo lo que el rubro minero necesita.",
    icon: <Globe className="w-10 h-10 text-[#ffb800]" />,
    tag: "01"
  },
  {
    title: "Diseño Gráfico",
    description: "Diseño gráfico profesional para que tu marca no sea una más del montón.",
    icon: <Target className="w-10 h-10 text-[#ffb800]" />,
    tag: "02"
  },
  {
    title: "Posicionamiento Google",
    description: "Posicionamiento SEO con artículos en tu web y gestión de Google MAPS.",
    icon: <Search className="w-10 h-10 text-[#ffb800]" />,
    tag: "03"
  },
  {
    title: "Presencia en LinkedIn",
    description: "Mejoramos tu presencia en LinkedIn para los perfiles empresariales y directivos.",
    icon: <Users className="w-10 h-10 text-[#ffb800]" />,
    tag: "04"
  },
  {
    title: "Inteligencia Artificial",
    description: "Herramientas personalizadas con Inteligencia Artificial para tu empresa.",
    icon: <Zap className="w-10 h-10 text-[#ffb800]" />,
    tag: "05"
  },
  {
    title: "Meta Ads",
    description: "Publicitamos en Meta Ads para generar posicionamiento de marca en el mercado.",
    icon: <TrendingUp className="w-10 h-10 text-[#ffb800]" />,
    tag: "06"
  }
];

const stats = [
  { label: "Proyectos Mineros", value: "50+" },
  { label: "Leads Cualificados", value: "5k+" },
  { label: "ROI Promedio", value: "3.5x" },
  { label: "Presencia Global", value: "5" },
];

const projects = [
  {
    title: "Credencial Corporativa",
    category: "Branding",
    image: "/mineria/moca/CREDENCIAL.jpg.jpeg",
  },
  {
    title: "Folleto Industrial 01",
    category: "Diseño Gráfico",
    image: "/mineria/moca/FOLLETO 01.jpg.jpeg",
  },
  {
    title: "Folleto Industrial 02",
    category: "Diseño Gráfico",
    image: "/mineria/moca/FOLLETO 02.jpg.jpeg",
  },
  {
    title: "Revista Editorial",
    category: "Branding",
    image: "/mineria/moca/REVISTA.jpg.jpeg",
  },
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [, setIsLoading] = useState(true);
  const [preloaderVisible, setPreloaderVisible] = useState(true);
  const [postIntroCinematicVisible, setPostIntroCinematicVisible] = useState(false);
  
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const layoutRootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const servicesCarouselRef = useRef<HTMLDivElement>(null);
  const servicesHorizontalRef = useRef<HTMLDivElement>(null);

  const scrollProgressRef = useRef<HTMLDivElement>(null);
  const projectsSectionRef = useRef<HTMLDivElement>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const heroIntroTlRef = useRef<gsap.core.Timeline | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  // Split Text Helper
  const splitText = (el: HTMLElement) => {
    const text = el.innerText;
    el.innerHTML = text.split("").map(char => 
      `<span class="char">${char === " " ? "&nbsp;" : char}</span>`
    ).join("");
    return el.querySelectorAll(".char");
  };

  useLayoutEffect(() => {
    const lenis = new Lenis();
    lenisRef.current = lenis;
    lenis.scrollTo(0, { immediate: true });
    const stopLenisScrollSync = lenis.on('scroll', ScrollTrigger.update);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    gsap.to(scrollProgressRef.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        scrub: 0.3,
        trigger: "body",
        start: "top top",
        end: "bottom bottom"
      }
    });

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1
      });
      gsap.to(followerRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3
      });
    };
    window.addEventListener('mousemove', moveCursor);

    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      // Hero: en pausa hasta que Preloader termina; sin immediateRender para no aplicar “from” antes de play()
      const heroTl = gsap.timeline({
        paused: true,
        defaults: { immediateRender: false },
      });
      heroIntroTlRef.current = heroTl;
      heroTl.from(".hero-line span", {
        y: 200,
        skewY: 10,
        duration: 1.5,
        stagger: 0.1,
        ease: "power4.out"
      })
      .from(".hero-meta", {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: "power3.out"
      }, "-=1")
      .from(".hero-img-container", {
        clipPath: "inset(100% 0% 0% 0%)",
        duration: 2,
        ease: "expo.inOut"
      }, "-=1.5")
      .from(".hero-img", {
        scale: 1.5,
        duration: 2,
        ease: "expo.out"
      }, "-=2");

      gsap.to(".hero-img", {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        },
        y: 200,
        scale: 1.2
      });

      // Parallax sutil del overlay (scrub suavizado): se desplaza menos que la foto para dar profundidad.
      gsap.fromTo(
        ".hero-gradient-overlay",
        { yPercent: -5 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.15,
          },
        },
      );

      gsap.from(".stat-card", {
        scrollTrigger: {
          trigger: ".stats-container",
          start: "top 80%",
        },
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "power4.out"
      });

      gsap.to(".marquee-inner", {
        xPercent: -50,
        ease: "none",
        duration: 20,
        repeat: -1
      });

      gsap.utils.toArray<HTMLElement>('.reveal-section').forEach((section) => {
        const headings = section.querySelectorAll('.split-heading');
        headings.forEach((heading) => {
          if (section.id === 'cases' || section.id === 'contact' || section.id === 'presencia')
          return;
          const chars = splitText(heading as HTMLElement);

          if (section.id === 'about') {
            gsap.from(chars, {
              scrollTrigger: {
                trigger: heading as HTMLElement,
                start: "top 86%",
              },
              y: 110,
              skewY: 3,
              opacity: 0,
              rotateX: -40,
              stagger: 0.022,
              duration: 1.25,
              ease: "expo.out"
            });
            return;
          }

          gsap.from(chars, {
            scrollTrigger: {
              trigger: heading as HTMLElement,
              start: "top 85%",
            },
            y: 150,
            skewY: 10,
            opacity: 0,
            rotateX: -90,
            stagger: 0.03,
            duration: 1.5,
            ease: "power4.out"
          });

          gsap.to(heading, {
            y: -10,
            duration: 2 + Math.random(),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: Math.random() * 1,
            scrollTrigger: {
              trigger: heading as HTMLElement,
              start: "top 90%",
              toggleActions: "play pause resume pause"
            }
          });
        });

        if (
          section.id === 'cases' ||
          section.id === 'services' ||
          section.id === 'presencia' ||
          section.id === 'about'
        )
          return;

        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
          },
          opacity: 0,
          y: 50,
          duration: 1,
          ease: "power3.out"
        });
      });

      /* Servicios (lg+): el scroll vertical “empuja” el carril hasta la última tarjeta; luego sigue la página */
      mm.add('(min-width: 1024px)', () => {
        const row = servicesHorizontalRef.current;
        const pinRoot = servicesCarouselRef.current;
        if (!row || !pinRoot) return undefined;

        const maxScrollX = () => {
          const clip = row.parentElement;
          if (!clip) return 0;
          return Math.max(0, row.scrollWidth - clip.clientWidth);
        };

        const tween = gsap.to(row, {
          x: () => -maxScrollX(),
          ease: 'none',
          scrollTrigger: {
            trigger: pinRoot,
            start: 'top 96px',
            end: () => `+=${maxScrollX() + 64}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            pinSpacing: true,
          },
        });
        return () => {
          tween.kill();
        };
      });

      ScrollTrigger.refresh();
    }, layoutRootRef);

    const timer = setTimeout(() => setIsLoading(false), 2000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', moveCursor);
      heroIntroTlRef.current = null;
      lenisRef.current = null;
      mm.revert();
      ctx.revert();
      stopLenisScrollSync();
      lenis.destroy();
      clearTimeout(timer);
    };
  }, []);

  const handlePostIntroRevealStart = useCallback(() => {
    requestAnimationFrame(() => {
      heroIntroTlRef.current?.restart(true);
    });
  }, []);

  const handlePostIntroCinematicEnded = useCallback(() => {
    setPostIntroCinematicVisible(false);
  }, []);

  const handlePostIntroSectionNavigate = useCallback((sectionId: string) => {
    setPostIntroCinematicVisible(false);
    heroIntroTlRef.current?.restart(true);
    requestAnimationFrame(() => {
      lenisRef.current?.scrollTo(`#${sectionId}`, {
        offset: -88,
        duration: 0.75,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    });
  }, []);

  const handlePreloaderHandoff = useCallback(() => {
    setPostIntroCinematicVisible(true);
  }, []);

  const handlePreloaderComplete = () => {
    lenisRef.current?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    setPreloaderVisible(false);
  };

  useEffect(() => {
    if (!postIntroCinematicVisible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [postIntroCinematicVisible]);
  const handleMouseEnter = () => {
    gsap.to(followerRef.current, { scale: 2.5, backgroundColor: "rgba(255, 184, 0, 0.1)", duration: 0.3 });
  };

  const handleMouseLeave = () => {
    gsap.to(followerRef.current, { scale: 1, backgroundColor: "transparent", duration: 0.3 });
  };

  return (
    <div ref={layoutRootRef} className="relative min-h-screen font-sans text-white selection:bg-[#ffb800] selection:text-black">
      {preloaderVisible && (
        <Preloader onHandoff={handlePreloaderHandoff} onComplete={handlePreloaderComplete} />
      )}
      {postIntroCinematicVisible && (
        <PostIntroCinematic
          onEnded={handlePostIntroCinematicEnded}
          onSectionNavigate={handlePostIntroSectionNavigate}
          onRevealStart={handlePostIntroRevealStart}
        />
      )}

      {/* Scroll Progress Bar */}
      <div ref={scrollProgressRef} className="fixed top-0 left-0 w-full h-1 bg-[#ffb800] z-[110] origin-left scale-x-0" />

      {/* Noise & Cursor */}
      <div className="noise-bg" />
      <div className="fixed inset-0 z-[1] grid-overlay pointer-events-none" />
      <div className="fixed inset-0 z-[2] grain-overlay pointer-events-none" />
      
      {/* Industrial Frame */}
      <div ref={frameRef} className="fixed inset-10 z-[120] border border-[rgba(255,184,0,0.12)] pointer-events-none hidden lg:block industrial-frame visible rounded-sm shadow-[inset_0_0_60px_rgba(255,184,0,0.03)]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#07080a] px-4 py-0.5 text-[8px] font-mono text-[#ffb800]/35 tracking-[0.5em] uppercase border border-[#ffb800]/10 rounded-sm">
          MineMark Control System v2.6
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-[#07080a] px-4 py-0.5 text-[8px] font-mono text-[#ffb800]/35 tracking-[0.5em] uppercase border border-[#ffb800]/10 rounded-sm">
          Sector: 7G-Extraction-Alpha
        </div>
        <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 rotate-90 bg-[#07080a] px-4 py-0.5 text-[8px] font-mono text-[#ffb800]/35 tracking-[0.5em] uppercase border border-[#ffb800]/10 rounded-sm">
          Status: Operational
        </div>
        <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 -rotate-90 bg-[#07080a] px-4 py-0.5 text-[8px] font-mono text-[#ffb800]/35 tracking-[0.5em] uppercase border border-[#ffb800]/10 rounded-sm">
          Depth: 1,240M
        </div>
      </div>

      <div ref={cursorRef} className="custom-cursor hidden md:block" />
      <div ref={followerRef} className="custom-cursor-follower hidden md:block" />

      <Navbar 
        scrolled={scrolled}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />

      <Hero 
        heroRef={heroRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />

      <Stats 
        stats={stats}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />

      <Services
        servicesRef={servicesRef}
        servicesCarouselRef={servicesCarouselRef}
        horizontalRef={servicesHorizontalRef}
        services={services}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />

      <VideoFrame
        videoSectionRef={videoSectionRef}
        videoRef={videoRef}
      />

      <Projects
        projectsSectionRef={projectsSectionRef}
        projects={projects}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />

      <PresenceMap />

      {/* Marquee */}
      <div className="relative overflow-hidden border-y border-[#ffb800]/15 bg-[#050607] py-16 md:py-24">
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(-35deg, transparent, transparent 18px, rgba(255,184,0,0.35) 18px, rgba(255,184,0,0.35) 19px)' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050607] via-transparent to-[#050607] pointer-events-none z-[1]" />
        <div className="marquee-inner flex whitespace-nowrap relative z-10">
          {[1, 2].map(i => (
            <div key={i} className="flex items-center gap-12 md:gap-20 px-8 md:px-10">
              <span className="text-[clamp(3.5rem,14vw,9rem)] font-display uppercase italic text-white/[0.08] hover:text-[#ffb800]/90 transition-colors duration-500 cursor-default">COSECHA</span>
              <div className="w-14 h-14 md:w-20 md:h-20 bg-[#ffb800] rounded-full shadow-[0_0_40px_rgba(255,184,0,0.25)] shrink-0" />
              <span className="text-[clamp(3.5rem,14vw,9rem)] font-display uppercase italic text-white/[0.08] hover:text-[#ffb800]/90 transition-colors duration-500 cursor-default">CREATIVA</span>
              <div className="w-14 h-14 md:w-20 md:h-20 border-2 border-white/25 rounded-full shrink-0" />
              <span className="text-[clamp(3.5rem,14vw,9rem)] font-display uppercase italic text-white/[0.08] hover:text-[#ffb800]/90 transition-colors duration-500 cursor-default">MINERÍA</span>
              <div className="w-14 h-14 md:w-20 md:h-20 bg-white/90 rounded-full shrink-0 shadow-[0_0_30px_rgba(255,255,255,0.08)]" />
            </div>
          ))}
        </div>
      </div>

      <Contact 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />

      <Footer />
    </div>
  );
}
