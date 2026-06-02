import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { POSTS } from "@/lib/blog-posts";

interface Props { params: { slug: string }; }

export async function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = POSTS.find((p) => p.slug === params.slug);
  if (!post) return {};
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: { canonical: "https://inspireai.es/blog/" + post.slug },
    openGraph: {
      title: post.metaTitle, description: post.metaDescription,
      url: "https://inspireai.es/blog/" + post.slug,
      siteName: "InspireAI", locale: "es_ES", type: "article",
      publishedTime: post.date,
    },
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = POSTS.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org", "@type": "Article",
    headline: post.title, description: post.metaDescription,
    datePublished: post.date, dateModified: post.date,
    author: { "@type": "Organization", name: "InspireAI", url: "https://inspireai.es" },
    publisher: { "@type": "Organization", name: "InspireAI",
      logo: { "@type": "ImageObject", url: "https://inspireai.es/logo.png" } },
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://inspireai.es/blog/" + post.slug },
    keywords: post.keywords.join(", "),
  };

  return (
    <div className="min-h-screen bg-dark text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {/* Nav — píldora flotante */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
        <div className="mx-auto max-w-4xl rounded-2xl px-5 py-3 flex items-center justify-between"
          style={{ background:"rgba(8,9,26,0.92)", backdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.08)", boxShadow:"0 2px 16px rgba(0,0,0,0.25)" }}>
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color:"rgba(255,255,255,0.85)" }}>
            <ArrowLeft className="w-4 h-4" /> Blog
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

      <article className="pt-28 pb-20">
        <div className="mx-auto px-6 max-w-3xl">
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-xs px-2.5 py-1 rounded-full" style={{ background:"rgba(91,98,244,0.12)", color:"#818CF8" }}>{post.category}</span>
              <span className="text-xs" style={{ color:"rgba(255,255,255,0.3)" }}>
                {new Date(post.date).toLocaleDateString("es-ES", { day:"numeric", month:"long", year:"numeric" })} &middot; {post.readTime} min
              </span>
            </div>
            <h1 className="font-heading font-bold text-white mb-5"
              style={{ fontSize:"clamp(1.75rem,4vw,2.75rem)", letterSpacing:"-0.025em", lineHeight:1.15 }}>
              {post.title}
            </h1>
            <p className="text-lg" style={{ color:"rgba(255,255,255,0.55)", lineHeight:1.7 }}>{post.excerpt}</p>
            <div className="mt-5 pt-5 border-t flex flex-wrap gap-2" style={{ borderColor:"rgba(255,255,255,0.07)" }}>
              {post.keywords.slice(0,4).map(k => (
                <span key={k} className="text-xs px-2.5 py-1 rounded-full" style={{ background:"rgba(255,255,255,0.05)", color:"rgba(255,255,255,0.35)", border:"1px solid rgba(255,255,255,0.08)" }}>{k}</span>
              ))}
            </div>
          </header>

          {/* Imagen hero del artículo */}
          {post.image && (
            <div className="rounded-2xl overflow-hidden mb-12" style={{ height:"360px" }}>
              <img src={post.image} alt={post.imageAlt ?? post.title}
                className="w-full h-full object-cover" />
            </div>
          )}
          <div className="prose-inspirai" dangerouslySetInnerHTML={{ __html: post.content || "" }} />
          {post.relatedService && (
            <div className="mt-14 rounded-2xl p-7" style={{ background:"linear-gradient(135deg,rgba(91,98,244,0.12),rgba(91,98,244,0.03))", border:"1px solid rgba(91,98,244,0.25)" }}>
              <h3 className="font-semibold text-white mb-3">Aplícalo en tu empresa</h3>
              <p className="text-sm mb-4" style={{ color:"rgba(255,255,255,0.55)", lineHeight:1.65 }}>
                InspireAI analiza tus procesos e identifica exactamente dónde y cómo implementar estas mejoras. Primera llamada gratuita, sin compromiso.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/#contacto" className="btn-primary inline-flex items-center gap-2">
                  Reservar llamada gratuita <ArrowRight className="w-4 h-4" />
                </Link>
                {post.relatedServiceUrl && (
                  <Link href={post.relatedServiceUrl} className="btn-secondary">Ver servicio de {post.relatedService}</Link>
                )}
              </div>
            </div>
          )}
          <div className="mt-12 pt-8 border-t flex items-center justify-between" style={{ borderColor:"rgba(255,255,255,0.07)" }}>
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm hover:text-white transition-colors" style={{ color:"rgba(255,255,255,0.4)" }}>
              <ArrowLeft className="w-4 h-4" /> Todos los artículos
            </Link>
            <Link href="/#contacto" className="text-sm" style={{ color:"rgba(91,98,244,0.8)" }}>Reservar llamada →</Link>
          </div>
        </div>
      </article>
    </div>
  );
}
