"use client";
import Link from "next/link";
import { ArrowLeft, Menu, X } from "lucide-react";
import { useState } from "react";

const SERVICES = [
  { href: "/consultoria-ia-empresas",    label: "Consultoría IA" },
  { href: "/crm-personalizado",          label: "CRM a medida" },
  { href: "/ciberseguridad-ia-empresas", label: "Ciberseguridad IA" },
  { href: "/automatizacion-procesos-ia", label: "Automatización" },
];

interface LandingNavProps {
  ctaLabel?: string;
  ctaHref?: string;
  ctaExternal?: boolean;
  onCtaClick?: () => void;
}

export default function LandingNav({ ctaLabel = "Solicitar información", ctaHref, ctaExternal, onCtaClick }: LandingNavProps) {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const CtaElement = ({ className }: { className?: string }) => {
    const cls = className ?? "btn-primary-sm";
    if (ctaExternal && ctaHref) return <a href={ctaHref} target="_blank" rel="noopener noreferrer" className={cls}>{ctaLabel}</a>;
    if (ctaHref) return <Link href={ctaHref} className={cls}>{ctaLabel}</Link>;
    if (onCtaClick) return <button onClick={onCtaClick} className={cls}>{ctaLabel}</button>;
    return null;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 transition-all duration-300">
      {/* Píldora principal */}
      <div className="mx-auto max-w-6xl rounded-2xl px-5 py-3 flex items-center justify-between transition-all duration-300"
        style={{
          background: "rgba(8,9,26,0.92)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 2px 16px rgba(0,0,0,0.25)",
        }}>

        {/* Izquierda: volver + logo */}
        <div className="flex items-center gap-5">
          <Link href="/" className="inline-flex items-center gap-2 font-medium text-sm flex-shrink-0 transition-colors"
            style={{ color: "rgba(255,255,255,0.85)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.85)")}>
            <ArrowLeft className="w-4 h-4" /> Inicio
          </Link>
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <img src="/logo.png" alt="InspireAI" width={28} height={28}
              style={{ width:28, height:28, borderRadius:"50%", objectFit:"cover" }} />
            <span className="font-orbitron font-bold text-[1rem] tracking-[0.05em] text-white hidden sm:block">
              INSPIRE<span style={{ color:"#818CF8" }}>AI</span>
            </span>
          </Link>
        </div>

        {/* Derecha desktop: dropdown Servicios + CTA */}
        <div className="hidden md:flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setOpen(o => !o)}
              onBlur={() => setTimeout(() => setOpen(false), 150)}
              className="flex items-center gap-1.5 text-sm font-medium transition-all px-3 py-2 rounded-lg"
              style={{ color: open ? "#fff" : "rgba(255,255,255,0.85)", background: open ? "rgba(255,255,255,0.06)" : "transparent" }}>
              Servicios
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }}>
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
            {open && (
              <div className="absolute top-full right-0 mt-2 rounded-xl overflow-hidden shadow-xl min-w-[210px] z-50"
                style={{ background: "#0F1228", border: "1px solid rgba(255,255,255,0.1)" }}>
                {SERVICES.map((s) => (
                  <Link key={s.href} href={s.href}
                    className="flex items-center px-4 py-3 text-sm border-b last:border-0 transition-colors"
                    style={{ color: "rgba(255,255,255,0.7)", borderColor: "rgba(255,255,255,0.06)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(91,98,244,0.12)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)"; }}>
                    {s.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <CtaElement />
        </div>

        {/* Hamburguesa mobile */}
        <button className="md:hidden text-white p-1" onClick={() => setMobileOpen(o => !o)} aria-label="Menú">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Menú mobile — segunda píldora */}
      {mobileOpen && (
        <div className="md:hidden mx-auto max-w-6xl mt-2 rounded-2xl px-5 pb-5 pt-4 flex flex-col gap-1"
          style={{
            background: "rgba(8,9,26,0.97)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}>
          <p className="text-[11px] font-medium tracking-widest uppercase mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>Servicios</p>
          {SERVICES.map((s) => (
            <Link key={s.href} href={s.href}
              className="block py-2.5 text-sm border-b last:border-0"
              style={{ color: "rgba(255,255,255,0.7)", borderColor: "rgba(255,255,255,0.06)" }}
              onClick={() => setMobileOpen(false)}>
              {s.label}
            </Link>
          ))}
          <div className="mt-4">
            <CtaElement className="btn-primary w-full text-center" />
          </div>
        </div>
      )}
    </nav>
  );
}
