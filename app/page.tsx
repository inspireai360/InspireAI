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

  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    // keep Framer Motion scroll tracking in sync
    lenis.on("scroll", () => {
      setIsScrolled(window.scrollY > 50);
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
      lenisRef.current?.scrollTo(0, { duration: 1.4 });
      return;
    }
    const el = document.getElementById(id);
    if (el) lenisRef.current?.scrollTo(el, { offset: -80, duration: 1.4 });
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
              <div className="flex flex-col gap-3 p-6">
                {["problemas", "solucion"].map((id) => (
                  <button
                    key={id}
                    onClick={() => scrollTo(id)}
                    className="text-left py-2 text-sm capitalize"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    {id.charAt(0).toUpperCase() + id.slice(1)}
                  </button>
                ))}
                <button
                  onClick={() => scrollTo("contacto")}
                  className="btn-primary mt-2"
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

      {/* ─── Visual demos ───────────────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto px-6 max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2
              className="font-heading font-bold text-white mb-4"
              style={{ fontSize: "clamp(1.5rem, 5vw, 3rem)", letterSpacing: "-0.02em" }}
            >
              Así es lo que detectamos
            </h2>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "1rem", maxWidth: "480px", margin: "0 auto", lineHeight: 1.65 }}>
              Tres entregables reales de cada auditoría Inspire Cyber 360.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* ── Card 1: IA Opportunities table ── */}
            <motion.div
              variants={fadeInUp}
              style={{ background: "#0F1228", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", overflow: "hidden" }}
            >
              <div style={{ padding: "20px 20px 0", background: "rgba(91,98,244,0.04)" }}>
                <div style={{ background: "#08091A", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px 8px 0 0", overflow: "hidden" }}>
                  <div style={{ display: "flex", padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)", gap: "8px" }}>
                    {["Proceso", "Impacto", "Urgencia"].map((h, i) => (
                      <span key={h} style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.6rem", letterSpacing: "0.06em", flex: i === 0 ? 2 : 1 }}>{h.toUpperCase()}</span>
                    ))}
                  </div>
                  {[
                    { proceso: "Gestión de emails", impacto: "Alto", ic: "#22C55E", urgencia: "Alta", uc: "#EF4444" },
                    { proceso: "CRM y captación", impacto: "Alto", ic: "#22C55E", urgencia: "Media", uc: "#F59E0B" },
                    { proceso: "Facturación", impacto: "Medio", ic: "#F59E0B", urgencia: "Media", uc: "#F59E0B" },
                    { proceso: "Onboarding", impacto: "Medio", ic: "#F59E0B", urgencia: "Baja", uc: "#22C55E" },
                  ].map((row, i, arr) => (
                    <div key={i} style={{ display: "flex", padding: "8px 12px", borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", alignItems: "center", gap: "8px" }}>
                      <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.7rem", flex: 2 }}>{row.proceso}</span>
                      <span style={{ color: row.ic, fontSize: "0.68rem", fontWeight: 600, flex: 1 }}>{row.impacto}</span>
                      <span style={{ color: row.uc, fontSize: "0.68rem", fontWeight: 600, flex: 1 }}>{row.urgencia}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ padding: "20px" }}>
                <h3 className="font-heading font-bold text-white mb-2" style={{ fontSize: "1rem" }}>Detección IA & Automatización</h3>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.83rem", lineHeight: 1.6 }}>
                  Mapa de procesos automatizables con impacto económico, dificultad técnica y nivel de urgencia. Sabes exactamente por dónde empezar.
                </p>
              </div>
            </motion.div>

            {/* ── Card 2: Cybersecurity risk ── */}
            <motion.div
              variants={fadeInUp}
              style={{ background: "#0F1228", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", overflow: "hidden" }}
            >
              <div style={{ padding: "20px 20px 0", background: "rgba(91,98,244,0.04)" }}>
                <div style={{ background: "#08091A", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px 8px 0 0", padding: "16px" }}>
                  <div style={{ marginBottom: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.6rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Riesgo global</span>
                      <span style={{ color: "#F59E0B", fontSize: "0.65rem", fontWeight: 700 }}>Medio-Alto</span>
                    </div>
                    <div style={{ height: "5px", background: "rgba(255,255,255,0.06)", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ width: "68%", height: "100%", background: "linear-gradient(90deg, #22C55E 0%, #F59E0B 50%, #EF4444 100%)", borderRadius: "3px" }} />
                    </div>
                  </div>
                  {[
                    { label: "Riesgo alto", count: 3, color: "#EF4444" },
                    { label: "Riesgo medio", count: 7, color: "#F59E0B" },
                    { label: "Riesgo bajo", count: 4, color: "#22C55E" },
                  ].map((risk, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: i < 2 ? "6px" : 0, padding: "7px 10px", background: "rgba(255,255,255,0.03)", borderRadius: "6px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: risk.color, flexShrink: 0 }} />
                        <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.7rem" }}>{risk.label}</span>
                      </div>
                      <span style={{ color: risk.color, fontWeight: 700, fontSize: "0.78rem" }}>{risk.count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ padding: "20px" }}>
                <h3 className="font-heading font-bold text-white mb-2" style={{ fontSize: "1rem" }}>Estudio de Vulnerabilidades</h3>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.83rem", lineHeight: 1.6 }}>
                  Análisis de ciberseguridad con escenarios de riesgo reales, probabilidad y plan de mitigación inmediata validado por hackers éticos.
                </p>
              </div>
            </motion.div>

            {/* ── Card 3: Roadmap timeline ── */}
            <motion.div
              variants={fadeInUp}
              style={{ background: "#0F1228", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", overflow: "hidden" }}
            >
              <div style={{ padding: "20px 20px 0", background: "rgba(91,98,244,0.04)" }}>
                <div style={{ background: "#08091A", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px 8px 0 0", padding: "18px 16px" }}>
                  {[
                    { fase: "Diagnóstico inicial", semana: "S1–S3", done: true },
                    { fase: "Detección de IA", semana: "S4–S5", done: true },
                    { fase: "Implementación", semana: "S6–S8", done: false },
                    { fase: "Validación y cierre", semana: "S9–S10", done: false },
                  ].map((step, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: i < 3 ? "4px" : 0 }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, paddingTop: "2px" }}>
                        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: step.done ? "#5B62F4" : "rgba(255,255,255,0.1)", border: step.done ? "none" : "1px solid rgba(255,255,255,0.2)", flexShrink: 0 }} />
                        {i < 3 && <div style={{ width: "1px", height: "22px", background: "rgba(255,255,255,0.07)" }} />}
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flex: 1, paddingBottom: i < 3 ? "4px" : 0 }}>
                        <span style={{ color: step.done ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)", fontSize: "0.72rem", fontWeight: step.done ? 600 : 400 }}>{step.fase}</span>
                        <span style={{ color: step.done ? "rgba(91,98,244,0.8)" : "rgba(255,255,255,0.2)", fontSize: "0.65rem", fontWeight: 500 }}>{step.semana}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ padding: "20px" }}>
                <h3 className="font-heading font-bold text-white mb-2" style={{ fontSize: "1rem" }}>Roadmap Técnico</h3>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.83rem", lineHeight: 1.6 }}>
                  Plan de implementación priorizado con fases, herramientas recomendadas y estimación de tiempo y recursos. Listo para ejecutar desde el día 1.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ─── Problems ───────────────────────────────────────────────────── */}
      <section id="problemas" className="py-16 md:py-24 scroll-mt-20">
        <div className="mx-auto px-6 max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            className="text-center mb-10 md:mb-16"
          >
            <h2
              className="font-heading font-bold text-white mb-4"
              style={{
                fontSize: "clamp(1.5rem, 5vw, 3rem)",
                letterSpacing: "-0.02em",
              }}
            >
              ¿Reconoces alguno de estos problemas?
            </h2>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "1rem" }}>
              Las ineficiencias invisibles que frenan tu rentabilidad diaria.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: <Clock className="w-6 h-6" style={{ color: "#5B62F4" }} />,
                number: "01",
                title: "Tiempo perdido",
                body: "Tus equipos dedican horas a tareas repetitivas que ya podrían automatizarse, frenando la productividad y el crecimiento.",
              },
              {
                icon: (
                  <ShieldAlert
                    className="w-6 h-6"
                    style={{ color: "#5B62F4" }}
                  />
                ),
                number: "02",
                title: "Error humano",
                body: "Los procesos manuales generan fallos evitables. El error humano es inevitable; su impacto en tu empresa, no.",
              },
              {
                icon: (
                  <AlertTriangle
                    className="w-6 h-6"
                    style={{ color: "#5B62F4" }}
                  />
                ),
                number: "03",
                title: "Riesgo digital",
                body: "Una integración de IA mal optimizada puede abrir brechas en tus sistemas. Los ciberdelincuentes no perdonan.",
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="card-hover relative"
                style={{
                  background: "#0F1228",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "16px",
                  padding: "32px",
                }}
              >
                <div
                  className="absolute top-6 right-6 font-bold"
                  style={{
                    fontSize: "0.7rem",
                    color: "rgba(255,255,255,0.12)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {card.number}
                </div>
                <div className="mb-5">{card.icon}</div>
                <h3
                  className="font-heading font-bold text-white mb-3"
                  style={{ fontSize: "1.125rem" }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    color: "rgba(255,255,255,0.55)",
                    fontSize: "0.9rem",
                    lineHeight: 1.6,
                  }}
                >
                  {card.body}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ─── Solution timeline ──────────────────────────────────────────── */}
      <section id="solucion" className="py-16 md:py-24 scroll-mt-20">
        <div className="mx-auto px-6 max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            className="text-center mb-12 md:mb-20"
          >
            <h2
              className="font-heading font-bold text-white mb-4"
              style={{
                fontSize: "clamp(1.5rem, 5vw, 3rem)",
                letterSpacing: "-0.02em",
              }}
            >
              Auditoría completa. Hoja de ruta accionable.
            </h2>
            <p
              className="mx-auto"
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: "1rem",
                maxWidth: "560px",
                lineHeight: 1.65,
              }}
            >
              Analizamos tu empresa, detectamos dónde la IA puede generar
              impacto real y te entregamos un plan concreto para implementarlo de
              forma segura.
            </p>
          </motion.div>

          <div className="relative">
            {/* Connector line — horizontal on lg, vertical on mobile */}
            <div
              className="absolute hidden lg:block"
              style={{
                top: "20px",
                left: "80px",
                right: "80px",
                height: "1px",
                background: "rgba(255,255,255,0.08)",
              }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-6 relative z-10">
              {[
                {
                  step: "01",
                  title: "Auditoría",
                  desc: "Analizamos los 4 ejes clave: operaciones, marketing, ventas y delivery.",
                },
                {
                  step: "02",
                  title: "Análisis",
                  desc: "Detectamos ineficiencias y oportunidades de implementación de IA.",
                },
                {
                  step: "03",
                  title: "Ciberseguridad",
                  desc: "Estudiamos vulnerabilidades y definimos cómo blindar cada propuesta.",
                },
                {
                  step: "04",
                  title: "Arquitectura IA",
                  desc: "Diseñamos un roadmap visual para escalar sin cuellos de botella.",
                },
                {
                  step: "05",
                  title: "Entrega",
                  desc: "Reunión 1:1 con nuestro CTO + informe operativo en Notion desde el día 1.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex flex-col items-start lg:items-center text-left lg:text-center"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-6 flex-shrink-0"
                    style={{
                      background: "rgba(91,98,244,0.12)",
                      border: "1px solid rgba(91,98,244,0.3)",
                      color: "#818CF8",
                    }}
                  >
                    {item.step}
                  </div>
                  <h4
                    className="font-heading font-bold text-white mb-2"
                    style={{ fontSize: "1rem" }}
                  >
                    {item.title}
                  </h4>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.55)",
                      fontSize: "0.875rem",
                      lineHeight: 1.6,
                    }}
                  >
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ─── Inspire Cyber 360 mockup ───────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto px-6 max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2
              className="font-heading font-bold text-white mb-4"
              style={{ fontSize: "clamp(1.5rem, 5vw, 3rem)", letterSpacing: "-0.02em" }}
            >
              El entregable: Inspire Cyber 360
            </h2>
            <p
              className="mx-auto"
              style={{ color: "rgba(255,255,255,0.55)", fontSize: "1rem", maxWidth: "540px", lineHeight: 1.65 }}
            >
              Un informe operativo completo en Notion que tu equipo puede usar desde el día 1.
              No un PDF estático — un sistema vivo con todos los hallazgos, oportunidades y el roadmap técnico.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeInUp}
            className="mx-auto"
            style={{ maxWidth: "820px" }}
          >
            {/* Notion-style card */}
            <div
              style={{
                background: "#0F1228",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
                overflow: "hidden",
              }}
            >
              {/* Card header */}
              <div
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  padding: "20px 28px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  background: "rgba(91,98,244,0.06)",
                }}
              >
                <img
                  src="/logo.png"
                  alt="InspireAI logo"
                  width={28}
                  height={28}
                  style={{ borderRadius: "50%", flexShrink: 0 }}
                />
                <span style={{ color: "rgba(255,255,255,0.9)", fontWeight: 600, fontSize: "0.95rem" }}>
                  Inspire Cyber 360
                </span>
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.85rem" }}>·</span>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}>
                  [Tu empresa]
                </span>
                <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
                  {["Auditoría", "En progreso"].map((tag) => (
                    <span
                      key={tag}
                      style={{
                        background: "rgba(91,98,244,0.15)",
                        color: "#a5b4fc",
                        fontSize: "0.7rem",
                        padding: "3px 10px",
                        borderRadius: "999px",
                        border: "1px solid rgba(91,98,244,0.3)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* 4 sections */}
              <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 0 }}>
                {[
                  {
                    num: "01",
                    icon: "📢",
                    title: "Auditorías de Área",
                    desc: "Análisis en profundidad de Marketing, Ventas, Fulfilment y Administración. Identificamos qué funciona, qué falla y dónde se pierde dinero cada semana.",
                    tags: ["Marketing", "Ventas", "Operaciones"],
                  },
                  {
                    num: "02",
                    icon: "⚡",
                    title: "Detección IA & Automatización",
                    desc: "Mapa completo de oportunidades con impacto económico estimado, dificultad técnica y nivel de urgencia. Priorizado para que sepas por dónde empezar.",
                    tags: ["Impacto", "Dificultad", "Urgencia"],
                  },
                  {
                    num: "03",
                    icon: "🔒",
                    title: "Estudio de Vulnerabilidades",
                    desc: "Análisis de ciberseguridad con escenarios de riesgo reales, probabilidad de ocurrencia y plan de mitigación inmediata validado por hackers éticos.",
                    tags: ["Riesgo", "Mitigación", "Probabilidad"],
                  },
                  {
                    num: "04",
                    icon: "🗺️",
                    title: "Roadmap Técnico",
                    desc: "Plan de implementación priorizado con fases, herramientas recomendadas y estimación de recursos. Listo para ejecutar desde el día siguiente a la entrega.",
                    tags: ["Fases", "Herramientas", "Timeline"],
                  },
                ].map((section, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "24px 28px",
                      borderRight: i % 2 === 0 ? "1px solid rgba(255,255,255,0.05)" : "none",
                      borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                      <span style={{ fontSize: "1.1rem" }}>{section.icon}</span>
                      <span
                        style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.06em" }}
                      >
                        {section.num}
                      </span>
                      <span style={{ color: "white", fontWeight: 700, fontSize: "0.95rem" }}>
                        {section.title}
                      </span>
                    </div>
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.83rem", lineHeight: 1.6, marginBottom: "12px" }}>
                      {section.desc}
                    </p>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {section.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            color: "rgba(255,255,255,0.4)",
                            fontSize: "0.68rem",
                            padding: "2px 8px",
                            borderRadius: "4px",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Card footer */}
              <div
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  padding: "14px 28px",
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.78rem" }}>
                  Entregado en Notion · Reunión 1:1 con CTO incluida · Disponible desde el día 1
                </span>
                <button
                  onClick={() => scrollTo("contacto")}
                  className="btn-primary-sm"
                  style={{ marginLeft: "auto", whiteSpace: "nowrap" }}
                >
                  Quiero el mío
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ─── Differentiation cards ──────────────────────────────────────── */}
      <section
        className="py-16 md:py-24"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(91,98,244,0.04) 0%, transparent 70%)",
        }}
      >
        <div className="mx-auto px-6 max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            className="text-center mb-10 md:mb-16"
          >
            <h2
              className="font-heading font-bold text-white"
              style={{
                fontSize: "clamp(1.5rem, 5vw, 3rem)",
                letterSpacing: "-0.02em",
              }}
            >
              No somos una consultoría más
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
          >
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto"
              style={{ maxWidth: "900px" }}
            >
              {/* ── Left card — InspireAI ── */}
              <div
                style={{
                  background: "rgba(91,98,244,0.08)",
                  border: "1px solid rgba(91,98,244,0.35)",
                  borderRadius: "16px",
                  padding: "32px",
                }}
              >
                {/* Badge */}
                <span
                  style={{
                    background: "rgba(91,98,244,0.15)",
                    color: "#A5B4FC",
                    fontSize: "0.7rem",
                    padding: "4px 10px",
                    borderRadius: "999px",
                    display: "inline-block",
                    marginBottom: "12px",
                  }}
                >
                  ✦ Recomendado
                </span>
                {/* Title */}
                <div
                  className="font-heading"
                  style={{
                    color: "#818CF8",
                    fontWeight: 800,
                    fontSize: "1.25rem",
                  }}
                >
                  InspireAI
                </div>
                {/* Divider */}
                <div
                  style={{
                    borderTop: "1px solid rgba(91,98,244,0.2)",
                    margin: "20px 0",
                  }}
                />
                {/* Rows */}
                {[
                  { label: "Enfoque", value: "Técnico + estratégico" },
                  { label: "Entrega", value: "Informe usable en Notion" },
                  { label: "Ciberseguridad", value: "Validado por hackers éticos" },
                  { label: "Personalización", value: "100% adaptado a tu stack" },
                ].map((row, i, arr) => (
                  <div
                    key={i}
                    style={{
                      padding: "14px 0",
                      borderBottom:
                        i < arr.length - 1
                          ? "1px solid rgba(255,255,255,0.05)"
                          : "none",
                    }}
                  >
                    <div
                      style={{
                        color: "rgba(255,255,255,0.4)",
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: "4px",
                      }}
                    >
                      {row.label}
                    </div>
                    <div
                      style={{
                        color: "white",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                      }}
                    >
                      <span style={{ color: "#22C55E" }}>✓ </span>
                      {row.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Right card — Tradicionales ── */}
              <div
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "16px",
                  padding: "32px",
                }}
              >
                {/* Title */}
                <div
                  className="font-heading"
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontWeight: 700,
                    fontSize: "1.25rem",
                  }}
                >
                  Consultoras tradicionales
                </div>
                {/* Divider */}
                <div
                  style={{
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                    margin: "20px 0",
                  }}
                />
                {/* Rows */}
                {[
                  { label: "Enfoque", value: "Generalista y teórico" },
                  { label: "Entrega", value: "PDF estático" },
                  { label: "Ciberseguridad", value: "Checklist genérico" },
                  { label: "Personalización", value: "Plantillas genéricas" },
                ].map((row, i, arr) => (
                  <div
                    key={i}
                    style={{
                      padding: "14px 0",
                      borderBottom:
                        i < arr.length - 1
                          ? "1px solid rgba(255,255,255,0.05)"
                          : "none",
                    }}
                  >
                    <div
                      style={{
                        color: "rgba(255,255,255,0.4)",
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: "4px",
                      }}
                    >
                      {row.label}
                    </div>
                    <div
                      style={{
                        color: "rgba(255,255,255,0.3)",
                        fontWeight: 400,
                        fontSize: "0.95rem",
                      }}
                    >
                      <span style={{ color: "rgba(255,255,255,0.2)" }}>— </span>
                      {row.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />



      <div className="section-divider" />

      {/* ─── CRM Section ─────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 overflow-hidden" id="crm">
        <div className="mx-auto px-6 max-w-6xl">

          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-5"
              style={{ background: "rgba(91,98,244,0.12)", color: "#818CF8", border: "1px solid rgba(91,98,244,0.25)" }}>
              ✦ Entregable incluido en la implementación
            </span>
            <h2 className="font-heading font-bold text-white mb-4"
              style={{ fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
              Tu CRM a medida,<br />
              <span style={{ color: "#818CF8" }}>listo desde el día 1</span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg" style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>
              Cada implementación incluye un CRM personalizado con tu marca, conectado a tu web y listo para usar.
              Pipeline visual, diagnósticos auditados, notificaciones en tiempo real — sin costes extra de software.
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
            <a href="https://demo.crm.inspireai.es" target="_blank" rel="noopener noreferrer"
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
              Quiero mi CRM personalizado
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
              ¿Listo para escalar sin fricciones?
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
