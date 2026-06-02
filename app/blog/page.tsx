import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { POSTS } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "Blog de IA para Empresas — Guías prácticas | InspireAI",
  description: "Artículos prácticos sobre IA aplicada a PYMEs españolas: automatización de procesos, consultoría IA, ciberseguridad y casos de uso reales. Sin hype, con datos.",
  alternates: { canonical: "https://inspireai.es/blog" },
  openGraph: {
    title: "Blog InspireAI — IA para empresas sin promesas vacías",
    description: "Guías prácticas sobre IA y automatización para PYMEs en España.",
    url: "https://inspireai.es/blog",
    siteName: "InspireAI",
    locale: "es_ES",
    type: "website",
  },
};

export default function BlogPage() {
  const [featured, ...rest] = POSTS;

  return (
    <div className="min-h-screen bg-dark text-white">
      {/* Nav — píldora flotante */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
        <div className="mx-auto max-w-5xl rounded-2xl px-5 py-3 flex items-center justify-between"
          style={{ background:"rgba(8,9,26,0.92)", backdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.08)", boxShadow:"0 2px 16px rgba(0,0,0,0.25)" }}>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color:"rgba(255,255,255,0.85)" }}>
            <ArrowLeft className="w-4 h-4" /> Inicio
          </Link>
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="InspireAI" width={28} height={28}
              style={{ width:28, height:28, borderRadius:"50%", objectFit:"cover" }} />
            <span className="font-orbitron font-bold text-[1rem] tracking-[0.05em] text-white hidden sm:block">
              INSPIRE<span style={{ color:"#818CF8" }}>AI</span>
            </span>
          </Link>
          <Link href="/#contacto" className="text-sm font-semibold px-4 py-2 rounded-[10px] transition-colors hidden md:block"
            style={{ background:"#5b62f4", color:"#fff" }}>
            Reservar llamada
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-12 md:pt-36 md:pb-16" style={{ background:"#08091A" }}>
        <div className="mx-auto px-6 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{ background:"rgba(91,98,244,0.1)", color:"#818CF8", border:"1px solid rgba(91,98,244,0.25)", letterSpacing:"0.08em", textTransform:"uppercase" }}>
            Blog
          </div>
          <h1 className="font-heading font-bold text-white mb-4"
            style={{ fontSize:"clamp(2rem,5vw,3rem)", letterSpacing:"-0.02em", lineHeight:1.1 }}>
            IA para empresas,<br />
            <span style={{ color:"#818CF8" }}>sin promesas vacías</span>
          </h1>
          <p style={{ color:"rgba(255,255,255,0.5)", maxWidth:"480px", lineHeight:1.7, fontSize:"1.05rem" }}>
            Guías prácticas sobre automatización, consultoría de IA y ciberseguridad para PYMEs españolas.
          </p>
        </div>
      </section>

      {/* Artículos */}
      <section className="pb-20">
        <div className="mx-auto px-6 max-w-5xl">
          {POSTS.length === 0 ? (
            <div className="text-center py-20">
              <h2 className="font-heading font-bold text-white text-2xl mb-3">Próximamente</h2>
              <p style={{ color:"rgba(255,255,255,0.45)", maxWidth:"400px", margin:"0 auto", lineHeight:1.7 }}>
                Los primeros artículos están en camino. Síguenos en LinkedIn para ser el primero en leerlos.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/#contacto" className="btn-primary inline-flex items-center gap-2">
                  Reservar llamada gratuita <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Artículo destacado */}
              {featured && (
                <Link href={`/blog/${featured.slug}`}
                  className="group rounded-2xl overflow-hidden block"
                  style={{ background:"#0D0E1F", border:"1px solid rgba(255,255,255,0.07)" }}>
                  {featured.image && (
                    <div className="relative w-full overflow-hidden" style={{ height:"320px" }}>
                      <Image src={featured.image} alt={featured.imageAlt ?? featured.title}
                        fill className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 960px" priority />
                      <div className="absolute inset-0" style={{ background:"linear-gradient(to top, rgba(13,14,31,0.9) 0%, rgba(13,14,31,0.3) 50%, transparent 100%)" }} />
                      <div className="absolute bottom-5 left-6">
                        <span className="text-xs px-2.5 py-1 rounded-full" style={{ background:"rgba(91,98,244,0.9)", color:"#fff" }}>{featured.category}</span>
                      </div>
                    </div>
                  )}
                  <div className="p-7">
                    <div className="flex items-center gap-3 mb-3">
                      {!featured.image && <span className="text-xs px-2.5 py-1 rounded-full" style={{ background:"rgba(91,98,244,0.12)", color:"#818CF8" }}>{featured.category}</span>}
                      <span className="text-xs" style={{ color:"rgba(255,255,255,0.3)" }}>
                        {new Date(featured.date).toLocaleDateString("es-ES", { day:"numeric", month:"long", year:"numeric" })} · {featured.readTime} min
                      </span>
                    </div>
                    <h2 className="font-heading font-bold text-white mb-3 group-hover:text-[#818CF8] transition-colors"
                      style={{ fontSize:"clamp(1.2rem,2.5vw,1.6rem)", letterSpacing:"-0.02em", lineHeight:1.2 }}>
                      {featured.title}
                    </h2>
                    <p className="text-sm leading-relaxed mb-4" style={{ color:"rgba(255,255,255,0.5)", maxWidth:"640px" }}>{featured.excerpt}</p>
                    <span className="inline-flex items-center gap-2 text-sm font-medium" style={{ color:"#818CF8" }}>
                      Leer artículo <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              )}

              {/* Resto de artículos */}
              {rest.length > 0 && (
                <div className="grid md:grid-cols-2 gap-6">
                  {rest.map((post) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`}
                      className="group rounded-2xl overflow-hidden block"
                      style={{ background:"#0D0E1F", border:"1px solid rgba(255,255,255,0.07)" }}>
                      {post.image && (
                        <div className="relative w-full overflow-hidden" style={{ height:"200px" }}>
                          <Image src={post.image} alt={post.imageAlt ?? post.title}
                            fill className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 480px" />
                          <div className="absolute inset-0" style={{ background:"linear-gradient(to top, rgba(13,14,31,0.8) 0%, transparent 60%)" }} />
                          <div className="absolute bottom-4 left-5">
                            <span className="text-xs px-2.5 py-1 rounded-full" style={{ background:"rgba(91,98,244,0.9)", color:"#fff" }}>{post.category}</span>
                          </div>
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          {!post.image && <span className="text-xs px-2.5 py-1 rounded-full" style={{ background:"rgba(91,98,244,0.12)", color:"#818CF8" }}>{post.category}</span>}
                          <span className="text-xs" style={{ color:"rgba(255,255,255,0.3)" }}>
                            {new Date(post.date).toLocaleDateString("es-ES", { day:"numeric", month:"long", year:"numeric" })} · {post.readTime} min
                          </span>
                        </div>
                        <h2 className="font-heading font-bold text-white mb-2 group-hover:text-[#818CF8] transition-colors"
                          style={{ fontSize:"1.05rem", letterSpacing:"-0.01em", lineHeight:1.3 }}>
                          {post.title}
                        </h2>
                        <p className="text-sm leading-relaxed mb-4" style={{ color:"rgba(255,255,255,0.45)" }}>
                          {post.excerpt.slice(0, 140)}…
                        </p>
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium" style={{ color:"#818CF8" }}>
                          Leer <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <div className="py-10 border-t text-center text-xs" style={{ borderColor:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.25)" }}>
        <Link href="/" style={{ color:"rgba(255,255,255,0.35)" }}>← Volver a inspireai.es</Link>
      </div>
    </div>
  );
}
