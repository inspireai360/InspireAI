"use client";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { POSTS } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "Blog de IA para Empresas — Guías, casos de uso y recursos | InspireAI",
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

const CATEGORIES = ["Todos", "Automatización", "Consultoría IA", "Ciberseguridad", "Casos de uso"];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-dark text-white">
      {/* Nav */}
      <nav className="py-4 border-b border-white/5 bg-[#08091A]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto px-6 max-w-6xl flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Inicio
          </Link>
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="InspireAI" width={28} height={28}
              style={{ width:28, height:28, borderRadius:"50%", objectFit:"cover" }} />
            <span className="font-orbitron font-bold text-[1rem] tracking-[0.05em] text-white">
              INSPIRE<span style={{ color:"#818CF8" }}>AI</span>
            </span>
          </Link>
          <Link href="/#contacto" className="btn-primary-sm hidden md:flex">Reservar llamada</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-14 md:pt-28 md:pb-20" style={{ background:"#08091A" }}>
        <div className="mx-auto px-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{ background:"rgba(91,98,244,0.1)", color:"#818CF8", border:"1px solid rgba(91,98,244,0.25)", letterSpacing:"0.08em", textTransform:"uppercase" }}>
            Blog
          </div>
          <h1 className="font-heading font-bold text-white mb-4"
            style={{ fontSize:"clamp(2rem,5vw,3rem)", letterSpacing:"-0.02em", lineHeight:1.1 }}>
            IA para empresas,<br />
            <span style={{ color:"#818CF8" }}>sin promesas vacías</span>
          </h1>
          <p style={{ color:"rgba(255,255,255,0.5)", maxWidth:"500px", lineHeight:1.7, fontSize:"1.1rem" }}>
            Guías prácticas sobre automatización de procesos, consultoría de IA y ciberseguridad para PYMEs españolas.
          </p>
        </div>
      </section>

      {/* Artículos */}
      <section className="py-14 md:py-20">
        <div className="mx-auto px-6 max-w-4xl">
          {POSTS.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-6">✍️</div>
              <h2 className="font-heading font-bold text-white text-2xl mb-3">Próximamente</h2>
              <p style={{ color:"rgba(255,255,255,0.45)", maxWidth:"400px", margin:"0 auto", lineHeight:1.7 }}>
                Los primeros artículos están en camino. Síguenos en LinkedIn para ser el primero en leerlos.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/#contacto" className="btn-primary inline-flex items-center gap-2">
                  Reservar llamada gratuita <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/" className="btn-secondary">Ver nuestros servicios</Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-6">
              {POSTS.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}
                  className="group rounded-2xl p-7 flex flex-col md:flex-row gap-5 transition-all"
                  style={{ background:"#0D0E1F", border:"1px solid rgba(255,255,255,0.07)" }}
className="blog-card-hover">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs px-2.5 py-1 rounded-full" style={{ background:"rgba(91,98,244,0.12)", color:"#818CF8" }}>{post.category}</span>
                      <span className="text-xs" style={{ color:"rgba(255,255,255,0.3)" }}>{post.date} · {post.readTime} min</span>
                    </div>
                    <h2 className="font-heading font-bold text-white mb-2 group-hover:text-[#818CF8] transition-colors"
                      style={{ fontSize:"1.2rem", letterSpacing:"-0.01em" }}>{post.title}</h2>
                    <p className="text-sm leading-relaxed" style={{ color:"rgba(255,255,255,0.5)" }}>{post.excerpt}</p>
                  </div>
                  <div className="flex items-center flex-shrink-0 self-center">
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" style={{ color:"rgba(255,255,255,0.3)" }} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer simple */}
      <div className="py-10 border-t text-center text-xs" style={{ borderColor:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.25)" }}>
        <Link href="/" style={{ color:"rgba(255,255,255,0.35)" }}>← Volver a inspireai.es</Link>
      </div>
    </div>
  );
}
