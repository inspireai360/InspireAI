"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Lenis from "lenis";
import {
  motion,
  useScroll,
  AnimatePresence,
} from "framer-motion";
import {
  ArrowRight,
  Hourglass,
  Clock,
  ShieldAlert,
  AlertTriangle,
  Check,
  Menu,
  X,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Scroll progress bar ───────────────────────────────────────────────────────
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[60] origin-left bg-primary"
      style={{ scaleX: scrollYProgress, height: "2px" }}
    />
  );
};

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [formState, setFormState] = useState({
    nombre: "",
    email: "",
    telefono: "",
    empresa: "",
    tamanio: "",
    mensaje: "",
    botField: "",
    acceptedTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // ── Calculadora ROI ────────────────────────────────────────────────────────
  const [empleados, setEmpleados] = useState(8);
  const [horasManuales, setHorasManuales] = useState(10);
  const [costeHora, setCosteHora] = useState(18);
  const horasAhorradasMes = Math.round(empleados * horasManuales * 0.42 * 4.3);
  const ahorroMensual = horasAhorradasMes * costeHora;
  const ahorroAnual = ahorroMensual * 12;
  const mesesROI = ahorroMensual > 0 ? Math.max(1, Math.ceil(3500 / ahorroMensual)) : 0;

  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 2.0,
      infinite: false,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ({ scroll }: { scroll: number }) => {
      setIsScrolled(scroll > 50);
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    if (id === "") {
      lenisRef.current?.scrollTo(0, { duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      return;
    }
    const el = document.getElementById(id);
    if (el) lenisRef.current?.scrollTo(el, { offset: -80, duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, type, value, checked } = target;
    const fieldValue = type === "checkbox" ? checked : value;
    setFormState((prev) => ({ ...prev, [name]: fieldValue }));
    if (errors[name]) {
      setErrors((prev) => {
        const n = { ...prev };
        delete n[name];
        return n;
      });
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formState.nombre.trim()) errs.nombre = "El nombre es obligatorio";
    if (!formState.email.trim()) {
      errs.email = "El email es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      errs.email = "Email no válido";
    }
    if (!formState.empresa.trim()) errs.empresa = "La empresa es obligatoria";
    if (!formState.tamanio) errs.tamanio = "Selecciona el tamaño de tu empresa";
    if (!formState.acceptedTerms) errs.acceptedTerms = "Debes aceptar las condiciones";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest" },
        body: JSON.stringify(formState),
      });
      const data = await res.json() as { success: boolean; error?: string };
      if (!res.ok || !data.success) {
        throw new Error(data.error ?? "Error al enviar la solicitud");
      }
      setIsSubmitted(true);
    } catch (err) {
      setErrors({
        submit:
          err instanceof Error
            ? err.message
            : "Ha ocurrido un error. Por favor, inténtalo de nuevo.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };

  return (
    <div className="min-h-screen bg-dark overflow-hidden selection:bg-primary/30 selection:text-white">
      <ScrollProgress />

      {/* ─── Navbar ─────────────────────────────────────────────────────── */}
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "py-3 border-b"
            : "py-5"
        )}
        style={
          isScrolled
            ? {
                background: "rgba(8,9,26,0.85)",
                backdropFilter: "blur(16px)",
                borderColor: "rgba(255,255,255,0.05)",
              }
            : {}
        }
      >
        <div className="mx-auto px-6 max-w-6xl flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollTo("")}
            className="flex items-center gap-2.5"
          >
            <img
              src="/logo.png"
              alt="InspireAI"
              width={32}
              height={32}
              style={{ borderRadius: "50%", display: "block", flexShrink: 0 }}
            />
            <span className="font-orbitron font-bold text-[1.25rem] tracking-[0.05em] text-white">
              INSPIRE<span className="text-[#818CF8]">AI</span>
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: "Problemas", id: "problemas" },
              { label: "Solución", id: "solucion" },
            ].map(({ label, id }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-sm transition-colors duration-150"
                style={{ color: "rgba(255,255,255,0.6)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.6)")
                }
              >
                {label}
              </button>
            ))}
            <div className="relative group">
              <button
                className="text-sm transition-colors duration-150 flex items-center gap-1"
                style={{ color: "rgba(255,255,255,0.6)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.6)")
                }
              >
                Servicios
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
                <div className="rounded-xl overflow-hidden shadow-xl min-w-[220px]"
                  style={{ background: "#0F1228", border: "1px solid rgba(255,255,255,0.1)" }}>
                  {[
                    { href: "/consultoria-ia-empresas", label: "Consultoría IA" },
                    { href: "/automatizacion-procesos-ia", label: "Automatización" },
                    { href: "/ciberseguridad-ia-empresas", label: "Ciberseguridad IA" },
                    { href: "/crm-personalizado", label: "CRM a medida" },
                  ].map((s) => (
                    <a key={s.href} href={s.href}
                      className="flex items-center px-4 py-3 text-sm transition-colors border-b last:border-0"
                      style={{ color: "rgba(255,255,255,0.7)", borderColor: "rgba(255,255,255,0.06)" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(91,98,244,0.1)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)"; }}>
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <Link href="/blog" className="text-sm transition-colors" style={{ color:"rgba(255,255,255,0.6)" }}
              onMouseEnter={e => (e.currentTarget.style.color="white")} onMouseLeave={e => (e.currentTarget.style.color="rgba(255,255,255,0.6)")}>Blog</Link>
            <button
              onClick={() => scrollTo("contacto")}
              className="btn-primary-sm"
            >
              Reservar llamada
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-b"
              style={{
                background: "#0F1228",
                borderColor: "rgba(255,255,255,0.05)",
              }}
            >
              <div className="flex flex-col gap-1 p-6">
                {["problemas", "solucion"].map((id) => (
                  <button
                    key={id}
                    onClick={() => { scrollTo(id); setMobileMenuOpen(false); }}
                    className="text-left py-2 text-sm capitalize"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    {id.charAt(0).toUpperCase() + id.slice(1)}
                  </button>
                ))}
                <div className="border-t mt-2 pt-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <p className="text-[11px] font-medium tracking-widest uppercase mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>Servicios</p>
                  {[
                    { href: "/consultoria-ia-empresas", label: "Consultoría IA" },
                    { href: "/automatizacion-procesos-ia", label: "Automatización" },
                    { href: "/ciberseguridad-ia-empresas", label: "Ciberseguridad IA" },
                    { href: "/crm-personalizado", label: "CRM a medida" },
                  ].map((s) => (
                    <Link key={s.href} href={s.href}
                      className="block py-2 text-sm border-b last:border-0"
                      style={{ color: "rgba(255,255,255,0.6)", borderColor: "rgba(255,255,255,0.06)" }}
                      onClick={() => setMobileMenuOpen(false)}>
                      {s.label}
                    </Link>
                  ))}
                </div>
                <Link href="/blog" className="py-2 text-sm border-t mt-1" style={{ color: "rgba(255,255,255,0.6)", borderColor: "rgba(255,255,255,0.06)" }} onClick={() => setMobileMenuOpen(false)}>
                  Blog
                </Link>
                <button
                  onClick={() => { scrollTo("contacto"); setMobileMenuOpen(false); }}
                  className="btn-primary mt-3"
                >
                  Reservar llamada
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ─── Hero ───────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[90vh] md:min-h-screen flex items-center pt-20 pb-14 md:pt-28 md:pb-20 overflow-hidden"
        style={{ background: "#08091A" }}
      >
        {/* Radial gradient — top-center glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle 900px at 50% -10%, rgba(91,98,244,0.22) 0%, transparent 70%)",
          }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="mx-auto px-6 max-w-6xl relative z-10 w-full">
          <div className="max-w-[800px] mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full"
              style={{
                border: "1px solid rgba(91,98,244,0.4)",
                background: "rgba(91,98,244,0.08)",
              }}
            >
              <span
                style={{
                  color: "#A5B4FC",
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  fontWeight: 500,
                }}
              >
                INTELIGENCIA QUE IMPULSA TU CRECIMIENTO
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-bold text-white mb-6"
              style={{
                fontFamily: "var(--font-inter), system-ui, sans-serif",
                fontSize: "clamp(2rem, 5vw, 3.75rem)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              Tu empresa tiene ineficiencias que la IA ya puede resolver.
            </motion.h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-10 mx-auto"
              style={{
                color: "rgba(255,255,255,0.55)",
                maxWidth: "560px",
                fontSize: "1.125rem",
                lineHeight: 1.65,
              }}
            >
              Auditamos tus procesos, identificamos oportunidades reales de
              automatización y te entregamos un plan concreto para implementarlo
              con seguridad.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button
                onClick={() => scrollTo("contacto")}
                className="btn-primary w-full sm:w-auto"
              >
                Reservar llamada gratuita
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollTo("problemas")}
                className="btn-secondary w-full sm:w-auto"
              >
                Ver cómo funciona
              </button>
            </motion.div>
          </div>
        </div>
      </section>


      <div className="section-divider" />

      {/* ─── Deliverables bento ──────────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto px-6 max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp} className="text-center mb-12 md:mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase mb-5"
              style={{ background: "rgba(91,98,244,0.1)", color: "#818CF8", border: "1px solid rgba(91,98,244,0.25)", letterSpacing: "0.1em" }}>
              Tres entregables reales
            </span>
            <h2 className="font-heading font-bold text-white mb-4" style={{ fontSize: "clamp(1.75rem, 5vw, 3rem)", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
              Lo que detectamos.<br />
              <span style={{ color: "#818CF8" }}>Lo que recibes.</span>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", maxWidth: "480px", margin: "0 auto", lineHeight: 1.7 }}>
              Cada auditoría Inspire Cyber 360 entrega tres documentos operativos listos para usar desde el día siguiente.
            </p>
          </motion.div>

          {/* Bento grid */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}
            className="grid gap-4" style={{ gridTemplateColumns: "repeat(12, 1fr)" }}>

            {/* Calculadora ROI */}
            <motion.div variants={fadeInUp} className="col-span-12 md:col-span-7 rounded-2xl overflow-hidden"
              style={{ background: "#0D0E1F", border: "1px solid rgba(255,255,255,0.07)", minHeight: "360px" }}>
              <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                {/* Left — sliders */}
                <div className="p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>
                      Calcula tu ahorro
                    </div>
                    {/* Slider 1 */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-white">Empleados en tu empresa</span>
                        <span className="text-sm font-bold" style={{ color: "#818CF8" }}>{empleados}</span>
                      </div>
                      <input type="range" min={2} max={100} value={empleados} onChange={e => setEmpleados(+e.target.value)}
                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                        style={{ background: `linear-gradient(to right, #5B62F4 ${(empleados-2)/98*100}%, rgba(255,255,255,0.1) ${(empleados-2)/98*100}%)` }} />
                    </div>
                    {/* Slider 2 */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-white">Horas manuales por empleado / semana</span>
                        <span className="text-sm font-bold" style={{ color: "#818CF8" }}>{horasManuales}h</span>
                      </div>
                      <input type="range" min={3} max={40} value={horasManuales} onChange={e => setHorasManuales(+e.target.value)}
                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                        style={{ background: `linear-gradient(to right, #5B62F4 ${(horasManuales-3)/37*100}%, rgba(255,255,255,0.1) ${(horasManuales-3)/37*100}%)` }} />
                    </div>
                    {/* Slider 3 */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-white">Coste medio por hora (€)</span>
                        <span className="text-sm font-bold" style={{ color: "#818CF8" }}>{costeHora}€</span>
                      </div>
                      <input type="range" min={12} max={60} value={costeHora} onChange={e => setCosteHora(+e.target.value)}
                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                        style={{ background: `linear-gradient(to right, #5B62F4 ${(costeHora-12)/48*100}%, rgba(255,255,255,0.1) ${(costeHora-12)/48*100}%)` }} />
                    </div>
                  </div>
                  <div className="pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    <div className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Horas ahorradas / mes</div>
                    <div className="text-3xl font-bold text-white">{horasAhorradasMes.toLocaleString("es-ES")} <span className="text-lg font-normal" style={{ color: "rgba(255,255,255,0.4)" }}>h / mes</span></div>
                  </div>
                </div>
                {/* Right — results */}
                <div className="p-6 md:p-8 flex flex-col justify-between" style={{ background: "linear-gradient(135deg, rgba(91,98,244,0.15) 0%, rgba(91,98,244,0.03) 100%)" }}>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em" }}>Ahorro anual estimado</div>
                    <div className="text-5xl font-bold text-white mb-1" style={{ letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums" }}>
                      {ahorroAnual.toLocaleString("es-ES")} €
                    </div>
                    <div className="text-base mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>
                      {ahorroMensual.toLocaleString("es-ES")} € al mes
                    </div>
                    <div className="rounded-xl p-4 mb-4" style={{ background: "rgba(63,185,132,0.1)", border: "1px solid rgba(63,185,132,0.25)" }}>
                      <div className="text-xs mb-1" style={{ color: "rgba(63,185,132,0.8)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Recuperas el diagnóstico en</div>
                      <div className="text-2xl font-bold" style={{ color: "#3FB984" }}>
                        {mesesROI === 1 ? "1 mes" : `${mesesROI} meses`}
                      </div>
                      <div className="text-xs mt-1" style={{ color: "rgba(63,185,132,0.6)" }}>
                        Coste estimado diagnóstico Inspire Cyber 360: 3.500€
                      </div>
                    </div>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)", lineHeight: 1.6 }}>
                      Estimación basada en automatizar el 42% de tareas manuales. El resultado real varía según sector y procesos.
                    </p>
                  </div>
                  <button onClick={() => scrollTo("contacto")}
                    className="btn-primary w-full mt-4">
                    Quiero este ahorro <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>

                        {/* Columna derecha */}
            <div className="col-span-12 md:col-span-5 flex flex-col gap-4">
              {/* Stat card */}
              <motion.div variants={fadeInUp} className="rounded-2xl p-6 flex-1"
                style={{ background: "linear-gradient(135deg, rgba(91,98,244,0.18) 0%, rgba(91,98,244,0.04) 100%)", border: "1px solid rgba(91,98,244,0.25)" }}>
                <div className="text-5xl font-bold text-white mb-2" style={{ letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums" }}>+40%</div>
                <div className="font-semibold text-white mb-1">Productividad media</div>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                  Incremento medio que logran nuestros clientes en los 6 meses siguientes a la implementación.
                </p>
              </motion.div>
              {/* Roadmap card */}
              <motion.div variants={fadeInUp} className="rounded-2xl p-6"
                style={{ background: "#0D0E1F", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg grid place-items-center" style={{ background: "rgba(91,98,244,0.15)", border: "1px solid rgba(91,98,244,0.3)" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="2" strokeLinecap="round"><path d="M3 3h18v4H3zM3 10h11v4H3zM3 17h7v4H3z"/></svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Roadmap técnico</div>
                    <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Listo para ejecutar el día 1</div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {[["S1–S3","Auditoría completa","bg-accent"],["S4–S5","Detección IA","bg-accent"],["S6–S8","Implementación","opacity-40"],["S9–S10","Cierre","opacity-40"]].map(([sem, label, cls]) => (
                    <div key={sem} className="flex items-center gap-2.5">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${cls === "bg-accent" ? "" : "opacity-30"}`} style={{ background: cls === "bg-accent" ? "#5B62F4" : "rgba(255,255,255,0.3)" }} />
                      <span className="text-xs flex-1" style={{ color: cls === "opacity-40" ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.7)" }}>{label}</span>
                      <span className="text-xs font-mono" style={{ color: cls === "bg-accent" ? "#818CF8" : "rgba(255,255,255,0.2)" }}>{sem}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Fila inferior — 3 tarjetas */}
            {[
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
                color: "#E86F6F",
                title: "Estudio de vulnerabilidades",
                desc: "Escenarios de riesgo reales con probabilidad y plan de mitigación validado por hackers éticos.",
                stat: "0 brechas sin cubrir"
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>,
                color: "#818CF8",
                title: "Informe en Notion",
                desc: "Un documento operativo vivo — no un PDF estático. Tu equipo puede usarlo desde el primer día.",
                stat: "Acceso inmediato"
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
                color: "#3FB984",
                title: "Reunión 1:1 con el CTO",
                desc: "Sesión de entrega con Timur para revisar el informe, responder dudas y arrancar la implementación.",
                stat: "60 min incluidos"
              }
            ].map((card, i) => (
              <motion.div key={i} variants={fadeInUp} className="col-span-12 md:col-span-4 rounded-2xl p-6"
                style={{ background: "#0D0E1F", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="w-10 h-10 rounded-xl grid place-items-center mb-4" style={{ background: `${card.color}18`, border: `1px solid ${card.color}30`, color: card.color }}>
                  {card.icon}
                </div>
                <div className="font-semibold text-white mb-2">{card.title}</div>
                <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.45)", lineHeight: 1.65 }}>{card.desc}</p>
                <span className="inline-block px-2.5 py-1 rounded-md text-xs font-medium" style={{ background: `${card.color}15`, color: card.color, border: `1px solid ${card.color}25` }}>
                  {card.stat}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ─── Problems ────────────────────────────────────────────────────── */}
      <section id="problemas" className="py-16 md:py-24 scroll-mt-20">
        <div className="mx-auto px-6 max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp} className="mb-12 md:mb-16">
            <h2 className="font-heading font-bold text-white mb-4" style={{ fontSize: "clamp(1.75rem, 5vw, 3rem)", letterSpacing: "-0.02em", lineHeight: 1.15, maxWidth: "700px" }}>
              ¿Reconoces alguno de estos problemas?
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", maxWidth: "520px", lineHeight: 1.7 }}>
              Las ineficiencias invisibles que frenan tu rentabilidad cada día.
            </p>
          </motion.div>

          {/* Bento grid — fila 1 */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}
            className="grid gap-4" style={{ gridTemplateColumns: "repeat(12,1fr)" }}>

            {/* GRANDE — Escenario tiempo (col 8) */}
            <motion.div variants={fadeInUp} className="col-span-12 md:col-span-8 rounded-2xl p-7"
              style={{ background: "#0D0E1F", border: "1px solid rgba(232,162,79,0.22)" }}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl grid place-items-center" style={{ background: "rgba(232,162,79,0.12)", border: "1px solid rgba(232,162,79,0.3)" }}>
                    <Clock style={{ width: "17px", height: "17px", color: "#E8A24F" }} />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(232,162,79,0.8)", letterSpacing: "0.1em" }}>Tiempo perdido</span>
                </div>
                <span className="text-4xl font-bold" style={{ color: "#E8A24F", letterSpacing: "-0.04em" }}>−3.2h</span>
              </div>
              <p className="text-base leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.65)", maxWidth: "520px" }}>
                Son las 9 de la mañana del lunes. Tu equipo lleva 40 minutos revisando WhatsApps del fin de semana, pasando pedidos a Excel y respondiendo consultas que ya respondió el viernes.{" "}
                <span style={{ color: "white", fontWeight: 600 }}>La semana no ha empezado y ya van tarde.</span>
              </p>
              {/* Mini visual — herramientas desconectadas */}
              <div className="flex flex-wrap gap-2">
                {["WhatsApp", "Excel", "Email", "ERP", "Drive"].map((tool, i) => (
                  <span key={tool} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{ background: "rgba(232,162,79,0.08)", border: "1px solid rgba(232,162,79,0.18)", color: "rgba(255,255,255,0.5)" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: i < 2 ? "#E8A24F" : "rgba(255,255,255,0.2)", display: "inline-block" }} />
                    {tool}
                  </span>
                ))}
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{ background: "rgba(232,162,79,0.04)", border: "1px dashed rgba(232,162,79,0.2)", color: "rgba(255,255,255,0.25)" }}>
                  Sin conectar entre sí
                </span>
              </div>
            </motion.div>

            {/* PEQUEÑO — Stat 73% (col 4) */}
            <motion.div variants={fadeInUp} className="col-span-12 md:col-span-4 rounded-2xl p-7 flex flex-col justify-between"
              style={{ background: "linear-gradient(135deg, #0D0E24 0%, #0F1030 100%)", border: "1px solid rgba(91,98,244,0.25)" }}>
              <div>
                <div className="text-7xl font-bold leading-none mb-3" style={{ color: "#818CF8", letterSpacing: "-0.05em" }}>73%</div>
                <p className="text-sm font-medium text-white mb-2">de los directivos</p>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)", lineHeight: 1.65 }}>
                  admite que su equipo pierde más de 3h al día en tareas que ya podrían hacerse solas.
                </p>
              </div>
              <p className="text-xs mt-4" style={{ color: "rgba(255,255,255,0.22)" }}>McKinsey Global Institute, 2024</p>
            </motion.div>

            {/* MEDIO — Error humano (col 6) */}
            <motion.div variants={fadeInUp} className="col-span-12 md:col-span-6 rounded-2xl p-7"
              style={{ background: "#0D0E1F", border: "1px solid rgba(232,111,111,0.22)" }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl grid place-items-center" style={{ background: "rgba(232,111,111,0.12)", border: "1px solid rgba(232,111,111,0.3)" }}>
                    <ShieldAlert style={{ width: "17px", height: "17px", color: "#E86F6F" }} />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(232,111,111,0.8)", letterSpacing: "0.1em" }}>Error humano</span>
                </div>
                <span className="text-3xl font-bold" style={{ color: "#E86F6F", letterSpacing: "-0.04em" }}>1 de 3</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.75 }}>
                El cliente llama furioso. Tu equipo revisa WhatsApp, luego el Excel, luego el email.{" "}
                <span style={{ color: "white", fontWeight: 600 }}>Nadie sabe quién copió mal el dato.</span>{" "}
                El cliente ya no llama para pedir — llama para quejarse.
              </p>
              <p className="text-xs mt-4" style={{ color: "rgba(232,111,111,0.5)" }}>1 de cada 3 errores en procesos manuales es evitable.</p>
            </motion.div>

            {/* MEDIO — Riesgo digital (col 6) */}
            <motion.div variants={fadeInUp} className="col-span-12 md:col-span-6 rounded-2xl p-7"
              style={{ background: "#0D0E1F", border: "1px solid rgba(129,140,248,0.22)" }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl grid place-items-center" style={{ background: "rgba(129,140,248,0.12)", border: "1px solid rgba(129,140,248,0.3)" }}>
                    <AlertTriangle style={{ width: "17px", height: "17px", color: "#818CF8" }} />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(129,140,248,0.8)", letterSpacing: "0.1em" }}>Riesgo digital</span>
                </div>
                <span className="text-3xl font-bold" style={{ color: "#818CF8", letterSpacing: "-0.04em" }}>60%</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.75 }}>
                Conectáis herramientas sin revisar permisos. Los datos de vuestros clientes pasan por APIs que nadie ha auditado.{" "}
                <span style={{ color: "white", fontWeight: 600 }}>No sabéis qué acceso tiene cada integración — hasta que alguien lo descubre por vosotros.</span>
              </p>
              <p className="text-xs mt-4" style={{ color: "rgba(129,140,248,0.5)" }}>El 60% de las brechas en pymes vienen de integraciones mal configuradas.</p>
            </motion.div>

          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ─── Solution timeline ────────────────────────────────────────────── */}
      <section id="solucion" className="py-16 md:py-24 scroll-mt-20">
        <div className="mx-auto px-6 max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp} className="text-center mb-14 md:mb-20">
            <h2 className="font-heading font-bold text-white mb-4" style={{ fontSize: "clamp(1.75rem, 5vw, 3rem)", letterSpacing: "-0.02em" }}>
              Auditoría completa.<br />
              <span style={{ color: "#818CF8" }}>Hoja de ruta accionable.</span>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", maxWidth: "500px", margin: "0 auto", lineHeight: 1.7 }}>
              Analizamos tu empresa, detectamos dónde la IA puede generar impacto real y te entregamos un plan concreto para implementarlo de forma segura.
            </p>
          </motion.div>

          {/* Steps — vertical en móvil, horizontal en desktop */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}
            className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4 relative">
            {/* Línea conectora desktop */}
            <div className="hidden md:block absolute top-[52px] left-[10%] right-[10%] h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(91,98,244,0.4), rgba(91,98,244,0.4), rgba(91,98,244,0.4), transparent)" }} />

            {[
              { n: "01", title: "Auditoría", desc: "4 ejes clave: operaciones, marketing, ventas y delivery.", icon: "🔍", get: "Mapa de procesos actual" },
              { n: "02", title: "Análisis", desc: "Detección de ineficiencias y oportunidades de IA con impacto real.", icon: "⚡", get: "Top 10 quick wins" },
              { n: "03", title: "Ciberseguridad", desc: "Vulnerabilidades en las automatizaciones propuestas.", icon: "🔒", get: "Plan de mitigación" },
              { n: "04", title: "Arquitectura IA", desc: "Roadmap visual para escalar sin cuellos de botella.", icon: "🗺️", get: "Roadmap priorizado" },
              { n: "05", title: "Entrega", desc: "Reunión 1:1 con el CTO + informe Notion operativo.", icon: "🎯", get: "Listo desde el día 1" },
            ].map((step, i) => (
              <motion.div key={i} variants={fadeInUp} className="flex flex-col items-center text-center relative">
                {/* Conector móvil */}
                {i < 4 && (
                  <div className="md:hidden absolute top-[52px] left-1/2 translate-x-[20px] h-6 w-px" style={{ background: "rgba(91,98,244,0.3)" }} />
                )}
                {/* Número + icono */}
                <div className="w-[52px] h-[52px] rounded-2xl grid place-items-center mb-4 relative z-10" style={{ background: "#111133", border: "1.5px solid rgba(91,98,244,0.4)", boxShadow: "0 0 20px rgba(91,98,244,0.15)" }}>
                  <span style={{ fontSize: "1.3rem" }}>{step.icon}</span>
                </div>
                <div className="text-xs font-bold mb-1.5" style={{ color: "#818CF8", letterSpacing: "0.1em" }}>{step.n}</div>
                <div className="font-semibold text-white mb-2 text-sm">{step.title}</div>
                <p className="text-xs mb-3" style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.65 }}>{step.desc}</p>
                <span className="inline-block px-2.5 py-1 rounded-md text-xs" style={{ background: "rgba(91,98,244,0.1)", color: "#818CF8", border: "1px solid rgba(91,98,244,0.2)" }}>
                  ✓ {step.get}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={fadeInUp}
            className="text-center mt-14">
            <button onClick={() => scrollTo("contacto")} className="btn-primary">
              Reservar auditoría gratuita <ArrowRight className="w-4 h-4" />
            </button>
            <p className="mt-3 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
              Sin compromiso · Respuesta en menos de 24h
            </p>
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ─── Inspire Cyber 360 ───────────────────────────────────────────── */}
      <section className="py-16 md:py-24" style={{ background: "radial-gradient(ellipse 80% 50% at 50% 60%, rgba(91,98,244,0.05) 0%, transparent 70%)" }}>
        <div className="mx-auto px-6 max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp} className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase mb-5"
              style={{ background: "rgba(91,98,244,0.1)", color: "#818CF8", border: "1px solid rgba(91,98,244,0.25)", letterSpacing: "0.1em" }}>
              El entregable
            </span>
            <h2 className="font-heading font-bold text-white mb-4" style={{ fontSize: "clamp(1.75rem, 5vw, 3rem)", letterSpacing: "-0.02em" }}>
              Inspire Cyber 360
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", maxWidth: "500px", margin: "0 auto", lineHeight: 1.7 }}>
              Un sistema operativo completo en Notion que tu equipo usa desde el día siguiente a la entrega. No un PDF — un activo vivo de tu empresa.
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { num: "4", label: "áreas auditadas" },
              { num: "+20", label: "procesos analizados" },
              { num: "100%", label: "personalizado" },
              { num: "24h", label: "respuesta media" },
            ].map((s, i) => (
              <motion.div key={i} variants={fadeInUp} className="rounded-xl p-5 text-center"
                style={{ background: "#0D0E1F", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="text-3xl font-bold text-white mb-1" style={{ letterSpacing: "-0.03em" }}>{s.num}</div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{s.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* CRM screenshot + 4 deliverables */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}
            className="grid gap-4 grid-cols-1 md:grid-cols-2">

            {/* Notion deliverable mockup */}
            <motion.div variants={fadeInUp} className="rounded-2xl overflow-hidden"
              style={{ background: "#191919", border: "1px solid rgba(255,255,255,0.1)" }}>
              {/* Notion top bar */}
              <div className="flex items-center gap-2 px-4 py-2.5 border-b" style={{ background: "#191919", borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#E86F6F" }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#E8A24F" }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#3FB984" }} />
                </div>
                <div className="flex-1 flex items-center justify-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12h6M9 16h6M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/></svg>
                  notion.so / Inspire Cyber 360 — [Tu empresa]
                </div>
                <div className="flex items-center gap-1.5">
                  {["LM","TI","ME"].map((i) => (
                    <div key={i} className="w-5 h-5 rounded-full grid place-items-center text-[9px] font-bold" style={{ background: "rgba(91,98,244,0.4)", color: "#fff", border: "1.5px solid #191919" }}>{i}</div>
                  ))}
                </div>
              </div>

              {/* Notion layout — sidebar + content */}
              <div className="flex" style={{ minHeight: "360px" }}>
                {/* Sidebar */}
                <div className="hidden md:flex flex-col w-48 flex-shrink-0 py-3 border-r" style={{ background: "#171717", borderColor: "rgba(255,255,255,0.05)" }}>
                  <div className="px-3 mb-2">
                    <div className="flex items-center gap-2 px-2 py-1 rounded text-xs font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
                      Inspire Cyber 360
                    </div>
                  </div>
                  {[
                    { icon: "📢", label: "01 · Auditorías", active: true },
                    { icon: "⚡", label: "02 · Mapa IA", active: false },
                    { icon: "🔒", label: "03 · Seguridad", active: false },
                    { icon: "🗺️", label: "04 · Roadmap", active: false },
                    { icon: "📋", label: "Resumen ejecutivo", active: false },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2 mx-2 px-2 py-1.5 rounded text-xs"
                      style={{ background: item.active ? "rgba(91,98,244,0.15)" : "transparent", color: item.active ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.4)" }}>
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>

                {/* Main content */}
                <div className="flex-1 p-5 overflow-hidden">
                  {/* Breadcrumb */}
                  <div className="flex items-center gap-1.5 text-xs mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>
                    <span>Inspire Cyber 360</span>
                    <span>/</span>
                    <span style={{ color: "rgba(255,255,255,0.6)" }}>01 · Diagnóstico de Áreas</span>
                  </div>

                  {/* Page title */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">📋</span>
                    <h3 className="text-lg font-bold text-white">Auditoría de Procesos</h3>
                  </div>

                  {/* Summary callout */}
                  <div className="rounded-lg px-4 py-3 mb-4 flex items-start gap-3" style={{ background: "rgba(91,98,244,0.1)", border: "1px solid rgba(91,98,244,0.25)" }}>
                    <span className="text-sm flex-shrink-0 mt-0.5">💡</span>
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                      <strong style={{ color: "rgba(255,255,255,0.85)" }}>Resumen ejecutivo:</strong> Se han identificado 12 oportunidades de automatización con un ahorro estimado de 18h/semana y un impacto económico de +34.000€/año.
                    </p>
                  </div>

                  {/* 4 areas table */}
                  <div className="rounded-lg overflow-hidden mb-4" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="grid grid-cols-3 px-3 py-2 text-xs font-semibold" style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em" }}>
                      <span>ÁREA</span>
                      <span className="text-center">IMPACTO</span>
                      <span className="text-right">URGENCIA</span>
                    </div>
                    {[
                      ["📢 Marketing", "#3FB984", "Alto", "#E86F6F", "Alta"],
                      ["💼 Ventas", "#3FB984", "Alto", "#E8A24F", "Media"],
                      ["⚙️ Operaciones", "#E8A24F", "Medio", "#E86F6F", "Alta"],
                      ["🚚 Fulfillment", "#E8A24F", "Medio", "#E8A24F", "Media"],
                    ].map(([area, ic, impact, uc, urgency]) => (
                      <div key={area as string} className="grid grid-cols-3 px-3 py-2.5 items-center border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                        <span className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>{area}</span>
                        <span className="text-center">
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${ic}18`, color: ic as string, border: `1px solid ${ic}30` }}>{impact}</span>
                        </span>
                        <span className="text-right">
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${uc}18`, color: uc as string, border: `1px solid ${uc}30` }}>{urgency}</span>
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Top oportunidades */}
                  <div className="text-xs font-semibold mb-2" style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Top oportunidades detectadas</div>
                  <div className="flex flex-col gap-1.5">
                    {[
                      ["Automatizar captación y seguimiento de leads", "Marketing", "#3FB984"],
                      ["Gestión de pedidos sin intervención manual", "Operaciones", "#E8A24F"],
                      ["Respuestas automáticas fuera de horario", "Ventas", "#818CF8"],
                    ].map(([task, area, color]) => (
                      <div key={task as string} className="flex items-center gap-2 text-xs">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color as string }} />
                        <span className="flex-1" style={{ color: "rgba(255,255,255,0.65)" }}>{task}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)" }}>{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 4 deliverables grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "📢", title: "Auditorías de Área", desc: "Marketing, Ventas, Operaciones y Delivery con hallazgos concretos.", color: "#E8A24F" },
                { icon: "⚡", title: "Mapa de Automatización", desc: "Cada oportunidad con impacto €, dificultad y urgencia.", color: "#818CF8" },
                { icon: "🔒", title: "Estudio de Seguridad", desc: "Riesgos identificados, probabilidad y plan de mitigación.", color: "#E86F6F" },
                { icon: "🗺️", title: "Roadmap Técnico", desc: "Fases, herramientas y estimación de recursos. Ejecutable.", color: "#3FB984" },
              ].map((d, i) => (
                <motion.div key={i} variants={fadeInUp} className="rounded-xl p-5"
                  style={{ background: "#0D0E1F", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="text-2xl mb-3">{d.icon}</div>
                  <div className="font-semibold text-white text-sm mb-1.5">{d.title}</div>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>{d.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Garantía */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={fadeInUp}
            className="mt-8 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6"
            style={{ background: "linear-gradient(135deg, rgba(91,98,244,0.12) 0%, rgba(91,98,244,0.04) 100%)", border: "1px solid rgba(91,98,244,0.25)" }}>
            <div className="w-14 h-14 rounded-2xl grid place-items-center flex-shrink-0" style={{ background: "rgba(91,98,244,0.2)", border: "1px solid rgba(91,98,244,0.4)" }}>
              <Check className="w-7 h-7" style={{ color: "#818CF8" }} />
            </div>
            <div className="text-center md:text-left">
              <div className="font-semibold text-white mb-1">Garantía de impacto real</div>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                Si no identificamos al menos 2 procesos con impacto real de IA, devolvemos el importe íntegro. Sin letras pequeñas.
              </p>
            </div>
            <button onClick={() => scrollTo("contacto")} className="btn-primary md:ml-auto flex-shrink-0">
              Empezar ahora <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ─── Differentiation cards ───────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto px-6 max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp} className="text-center mb-12">
            <h2 className="font-heading font-bold text-white mb-4" style={{ fontSize: "clamp(1.75rem, 5vw, 2.75rem)", letterSpacing: "-0.02em" }}>
              No somos una consultora tradicional
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", maxWidth: "480px", margin: "0 auto", lineHeight: 1.7 }}>
              La diferencia no está en lo que prometemos — está en lo que entregamos.
            </p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* InspireAI */}
            <motion.div variants={fadeInUp} className="rounded-2xl overflow-hidden"
              style={{ background: "linear-gradient(135deg, rgba(91,98,244,0.12) 0%, rgba(91,98,244,0.03) 100%)", border: "1.5px solid rgba(91,98,244,0.35)" }}>
              <div className="flex items-center gap-3 p-6 pb-5 border-b" style={{ borderColor: "rgba(91,98,244,0.2)" }}>
                <img src="/logo.png" alt="InspireAI" width={28} height={28} style={{ borderRadius: "50%" }} />
                <div>
                  <div className="font-bold text-white">InspireAI</div>
                  <div className="text-xs" style={{ color: "#818CF8" }}>Lo que hacemos</div>
                </div>
                <span className="ml-auto px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: "rgba(91,98,244,0.2)", color: "#818CF8", border: "1px solid rgba(91,98,244,0.4)" }}>
                  Recomendado
                </span>
              </div>
              <div className="p-6 flex flex-col gap-3">
                {[
                  ["Técnico + estratégico", "No solo teoría — implementamos nosotros"],
                  ["Entregable en Notion", "Tu equipo lo usa desde el día 1"],
                  ["Ciberseguridad incluida", "Validado por hackers éticos"],
                  ["100% a medida", "Adaptado a tu stack y proceso"],
                  ["CRM personalizado", "Pipeline, diagnósticos y notificaciones"],
                  ["Garantía de devolución", "Si no hay impacto real, devolvemos"],
                ].map(([title, sub]) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full grid place-items-center flex-shrink-0 mt-0.5" style={{ background: "rgba(91,98,244,0.2)", border: "1px solid rgba(91,98,244,0.4)" }}>
                      <Check style={{ width: "11px", height: "11px", color: "#818CF8" }} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{title}</div>
                      <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Tradicionales */}
            <motion.div variants={fadeInUp} className="rounded-2xl overflow-hidden"
              style={{ background: "#0D0E1F", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center gap-3 p-6 pb-5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="w-7 h-7 rounded-full grid place-items-center" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                </div>
                <div>
                  <div className="font-bold text-white">Consultoras tradicionales</div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Lo que suelen hacer</div>
                </div>
              </div>
              <div className="p-6 flex flex-col gap-3">
                {[
                  ["Generalista y teórico", "Recomendaciones sin implementación"],
                  ["PDF estático", "Un informe que nadie lee después"],
                  ["Checklist genérico", "No específico de tu sector"],
                  ["Plantillas de otro cliente", "Sin adaptación real a ti"],
                  ["Sin herramientas propias", "Dependes de terceros"],
                  ["Sin garantía", "Pagas aunque no haya resultados"],
                ].map(([title, sub]) => (
                  <div key={title} className="flex items-start gap-3 opacity-60">
                    <div className="w-5 h-5 rounded-full grid place-items-center flex-shrink-0 mt-0.5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{title}</div>
                      <div className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

            {/* ─── CRM Section ─────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 overflow-hidden" id="crm">
        <div className="mx-auto px-6 max-w-6xl">

          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-5"
              style={{ background: "rgba(91,98,244,0.12)", color: "#818CF8", border: "1px solid rgba(91,98,244,0.25)" }}>
              ✦ 100% personalizado a tu modelo de negocio
            </span>
            <h2 className="font-heading font-bold text-white mb-4"
              style={{ fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
              Tu propio CRM,<br />
              <span style={{ color: "#818CF8" }}>sin pagar por Salesforce</span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg" style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>
              Lo que ves en la demo está construido para InspireAI. El tuyo se construye para ti:
              con tus etapas de pipeline, tu terminología, tus métricas y conectado a tu web.
              Sin licencias por usuario. Sin funciones que no usarás nunca.
            </p>
          </div>

          {/* Browser mockup con screenshot */}
          <div className="relative mb-12 md:mb-16">
            {/* Glow */}
            <div className="absolute inset-0 rounded-2xl opacity-40 blur-3xl -z-10"
              style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(91,98,244,0.35), transparent 70%)" }} />

            {/* Browser chrome */}
            <div className="rounded-2xl overflow-hidden shadow-2xl"
              style={{ border: "1px solid rgba(255,255,255,0.1)", background: "#0A0A1A" }}>
              {/* Top bar */}
              <div className="flex items-center gap-2 px-4 py-3" style={{ background: "#111122", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: "#E86F6F" }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: "#E8A24F" }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: "#3FB984" }} />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-md text-xs" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.35)" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    demo.crm.inspireai.es
                  </div>
                </div>
              </div>
              {/* Screenshot — tabs */}
              <div className="relative" style={{ aspectRatio: "16/9" }}>
                <img src="/crm-dashboard.png" alt="InspireAI CRM Dashboard"
                  className="w-full h-full object-cover object-top" />
              </div>
            </div>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { icon: "📊", title: "Dashboard en tiempo real", desc: "KPIs, pipeline y actividad actualizados al instante" },
              { icon: "🗂️", title: "Pipeline Kanban", desc: "Arrastra deals entre etapas con drag & drop" },
              { icon: "🔍", title: "Diagnósticos completos", desc: "4 áreas auditadas con respuestas y prioridad" },
              { icon: "🔔", title: "Notificaciones automáticas", desc: "Email inmediato a todo el equipo cuando llega un lead" },
            ].map((f) => (
              <div key={f.title} className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="text-2xl mb-3">{f.icon}</div>
                <div className="font-semibold text-white text-sm mb-1">{f.title}</div>
                <div className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{f.desc}</div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://crm-demo-inspireai.vercel.app/auto-login" target="_blank" rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>
              </svg>
              Ver demo en vivo
            </a>
            <button onClick={() => {
              const el = document.getElementById("contacto");
              el?.scrollIntoView({ behavior: "smooth" });
            }} className="btn-secondary inline-flex items-center gap-2">
              Quiero mi CRM propio
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* ─── Contact form ───────────────────────────────────────────────── */}
      <section id="contacto" className="py-16 md:py-24 scroll-mt-20">
        <div className="mx-auto px-6 max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            className="text-center mb-8 md:mb-12"
          >
            <h2
              className="font-heading font-extrabold text-white mb-3"
              style={{
                fontSize: "clamp(1.5rem, 5vw, 3rem)",
                letterSpacing: "-0.02em",
              }}
            >
              ¿Empezamos?
            </h2>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "1rem" }}>
              Primera consulta gratuita. Sin compromisos.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            className="mx-auto"
            style={{ maxWidth: "600px" }}
          >
            <div
              className="p-6 md:p-10"
              style={{
                background: "#0F1228",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "16px",
              }}
            >
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{ background: "rgba(34,197,94,0.15)" }}
                  >
                    <Check className="w-7 h-7" style={{ color: "#22C55E" }} />
                  </div>
                  <h3
                    className="font-heading font-bold text-white mb-3"
                    style={{ fontSize: "1.5rem" }}
                  >
                    ¡Solicitud recibida!
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.55)" }}>
                    Te contactaremos en menos de 24h en el email indicado.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-8 font-medium transition-colors duration-150 hover:text-white"
                    style={{ color: "#818CF8" }}
                  >
                    Enviar otra solicitud
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <input
                    type="text"
                    name="botField"
                    value={formState.botField}
                    onChange={handleChange}
                    autoComplete="off"
                    tabIndex={-1}
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      left: "-9999px",
                      width: "1px",
                      height: "1px",
                      opacity: 0,
                      pointerEvents: "none",
                    }}
                  />
                  <div>
                    <h3
                      className="font-heading font-bold text-white mb-1"
                      style={{ fontSize: "1.25rem" }}
                    >
                      Reserva tu llamada gratuita
                    </h3>
                    <p
                      style={{
                        color: "rgba(255,255,255,0.55)",
                        fontSize: "0.9rem",
                      }}
                    >
                      Cuéntanos brevemente tu situación y te contactamos en
                      menos de 24h.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label
                        className="block"
                        style={{
                          color: "rgba(255,255,255,0.7)",
                          fontSize: "0.85rem",
                          fontWeight: 500,
                        }}
                      >
                        Nombre completo
                      </label>
                      <input
                        name="nombre"
                        value={formState.nombre}
                        onChange={handleChange}
                        placeholder="Ej: Germán Rodríguez"
                        className={cn("input-field", errors.nombre && "error")}
                      />
                      {errors.nombre && (
                        <p
                          className="text-xs"
                          style={{ color: "#F87171" }}
                        >
                          {errors.nombre}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label
                        className="block"
                        style={{
                          color: "rgba(255,255,255,0.7)",
                          fontSize: "0.85rem",
                          fontWeight: 500,
                        }}
                      >
                        Email profesional
                      </label>
                      <input
                        name="email"
                        type="email"
                        value={formState.email}
                        onChange={handleChange}
                        placeholder="ejemplo@empresa.com"
                        className={cn("input-field", errors.email && "error")}
                      />
                      {errors.email && (
                        <p
                          className="text-xs"
                          style={{ color: "#F87171" }}
                        >
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      className="block"
                      style={{
                        color: "rgba(255,255,255,0.7)",
                        fontSize: "0.85rem",
                        fontWeight: 500,
                      }}
                    >
                      Teléfono
                    </label>
                    <input
                      name="telefono"
                      type="tel"
                      value={formState.telefono}
                      onChange={handleChange}
                      placeholder="+34 600 000 000"
                      className="input-field"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      className="block"
                      style={{
                        color: "rgba(255,255,255,0.7)",
                        fontSize: "0.85rem",
                        fontWeight: 500,
                      }}
                    >
                      Empresa
                    </label>
                    <input
                      name="empresa"
                      value={formState.empresa}
                      onChange={handleChange}
                      placeholder="Nombre de tu organización"
                      className={cn("input-field", errors.empresa && "error")}
                    />
                    {errors.empresa && (
                      <p
                        className="text-xs"
                        style={{ color: "#F87171" }}
                      >
                        {errors.empresa}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label
                      className="block"
                      style={{
                        color: "rgba(255,255,255,0.7)",
                        fontSize: "0.85rem",
                        fontWeight: 500,
                      }}
                    >
                      ¿Cuántas personas trabajan en tu empresa?
                    </label>
                    <select
                      name="tamanio"
                      value={formState.tamanio}
                      onChange={handleChange}
                      className={cn(
                        "input-field appearance-none",
                        errors.tamanio && "error",
                        !formState.tamanio && "placeholder-select"
                      )}
                      style={{
                        color: formState.tamanio
                          ? "white"
                          : "rgba(255,255,255,0.25)",
                      }}
                    >
                      <option
                        value=""
                        disabled
                        style={{
                          background: "#08091A",
                          color: "rgba(255,255,255,0.4)",
                        }}
                      >
                        Selecciona una opción
                      </option>
                      {["1-10", "11-50", "51-200", "200+"].map((v) => (
                        <option
                          key={v}
                          value={v}
                          style={{ background: "#08091A", color: "white" }}
                        >
                          {v}
                        </option>
                      ))}
                    </select>
                    {errors.tamanio && (
                      <p
                        className="text-xs"
                        style={{ color: "#F87171" }}
                      >
                        {errors.tamanio}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label
                      className="block"
                      style={{
                        color: "rgba(255,255,255,0.7)",
                        fontSize: "0.85rem",
                        fontWeight: 500,
                      }}
                    >
                      ¿Qué proceso, problema o área te gustaría mejorar con tecnología o IA?
                    </label>
                    <textarea
                      name="mensaje"
                      value={formState.mensaje}
                      onChange={handleChange}
                      placeholder="Cuéntanos brevemente qué os gustaría mejorar, automatizar o diagnosticar."
                      rows={4}
                      className="input-field resize-none"
                      style={{ lineHeight: "1.5" }}
                    />
                  </div>

                  {errors.submit && (
                    <p style={{ color: "#F87171", fontSize: "0.85rem", textAlign: "center" }}>
                      {errors.submit}
                    </p>
                  )}

                  <div className="flex items-start gap-3">
                    <label className="flex items-start gap-3 text-sm leading-6" style={{ color: "rgba(255,255,255,0.75)" }}>
                      <input
                        type="checkbox"
                        name="acceptedTerms"
                        checked={formState.acceptedTerms}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 rounded border border-white/20 bg-slate-950 text-primary focus:ring-primary"
                      />
                      <span>
                        He leído y acepto la <a href="/politica-de-privacidad" className="underline text-white">política de privacidad</a>.
                      </span>
                    </label>
                  </div>
                  {errors.acceptedTerms && (
                    <p className="text-xs" style={{ color: "#F87171" }}>
                      {errors.acceptedTerms}
                    </p>
                  )}

                                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary disabled:opacity-50"
                    style={{ borderRadius: "8px" }}
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Enviar solicitud"
                    )}
                  </button>

                  <p
                    className="text-center"
                    style={{
                      color: "rgba(255,255,255,0.4)",
                      fontSize: "0.8rem",
                    }}
                  >
                    Al enviar aceptas nuestra{" "}
                    <Link
                      href="/politica-de-privacidad"
                      className="underline hover:text-white transition-colors"
                    >
                      política de privacidad
                    </Link>
                    . Te respondemos en menos de 24h.
                  </p>
                  <p
                    className="text-center"
                    style={{
                      color: "rgba(255,255,255,0.35)",
                      fontSize: "0.72rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    No envíes contraseñas, claves privadas, tokens o secretos en este formulario.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────────────────── */}
      <footer
        className="pt-16 pb-8"
        style={{
          background: "#08091A",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            {/* COLUMN 1 — Brand */}
            <div className="flex flex-col items-start">
              <div className="flex items-center">
                <span className="font-orbitron font-bold text-[1.25rem] tracking-[0.05em] text-white">
                  INSPIRE<span className="text-[#818CF8]">AI</span>
                </span>
              </div>
              <p 
                className="mt-3 text-sm"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                Inteligencia que impulsa tu crecimiento
              </p>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <div 
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/10 bg-white/5"
                  style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem" }}
                >
                  <span>🇪🇸</span> Con sede en España
                </div>
                <div 
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/10 bg-white/5"
                  style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem" }}
                >
                  <span>🔒</span> RGPD Compliant
                </div>
              </div>
            </div>

            {/* COLUMN 2 — Navegación */}
            <div className="flex flex-col">
              <h4 
                className="uppercase tracking-[0.1em] mb-4"
                style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", fontWeight: 600 }}
              >
                Navegación
              </h4>
              <nav className="flex flex-col gap-2.5">
                {[
                  { label: "Problemas", id: "problemas" },
                  { label: "Solución", id: "solucion" },
                  { label: "Reservar llamada", id: "contacto" },
                ].map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollTo(link.id)}
                    className="text-left text-[0.875rem] transition-colors duration-150"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
                  >
                    {link.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* COLUMN 3 — Contacto */}
            <div className="flex flex-col">
              <h4 
                className="uppercase tracking-[0.1em] mb-4"
                style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", fontWeight: 600 }}
              >
                Contacto
              </h4>
              <p 
                className="text-[0.875rem]"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                ¿Tienes dudas antes de reservar?
              </p>
              <button
                onClick={() => scrollTo("contacto")}
                className="mt-4 w-full py-2.5 px-5 rounded-lg font-semibold text-white transition-all duration-200"
                style={{ background: "#5B62F4" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#6B72F6")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#5B62F4")}
              >
                Reservar llamada gratuita
              </button>
            </div>
          </div>

          <div
            className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t"
            style={{
              borderColor: "rgba(255,255,255,0.06)",
            }}
          >
            <div 
              className="text-[0.8rem]"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              © 2025 InspireAI · Todos los derechos reservados
            </div>
            <div className="flex gap-6 text-[0.8rem]" style={{ color: "rgba(255,255,255,0.3)" }}>
              <Link href="/politica-de-privacidad" className="hover:text-white transition-colors">
                Política de privacidad
              </Link>
              <Link href="/aviso-legal" className="hover:text-white transition-colors">
                Aviso legal
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
