"use client";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function CiberseguridadIA() {
  const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16,1,0.3,1] } } };
  const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };

  return (
    <div className="min-h-screen bg-dark text-white selection:bg-primary/30 selection:text-white">
      <nav className="py-4 border-b border-white/5 bg-[#08091A]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto px-6 max-w-6xl flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Inicio
          </Link>
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="InspireAI" width={30} height={30}
              style={{ width:30, height:30, borderRadius:"50%", objectFit:"cover", flexShrink:0 }} />
            <span className="font-orbitron font-bold text-[1.1rem] tracking-[0.05em] text-white">
              INSPIRE<span style={{ color:"#818CF8" }}>AI</span>
            </span>
          </Link>
          <button onClick={() => document.getElementById("cta-ciber")?.scrollIntoView({ behavior:"smooth" })}
            className="btn-primary-sm hidden md:flex">Solicitar análisis</button>
        </div>
      </nav>

      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden" style={{ background: "#08091A" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 40% at 50% -10%, rgba(232,111,111,0.15) 0%, transparent 70%)" }} />
        <div className="mx-auto px-6 max-w-4xl relative z-10">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6"
              style={{ background: "rgba(232,111,111,0.1)", color: "#E86F6F", border: "1px solid rgba(232,111,111,0.25)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Ciberseguridad en proyectos de IA
            </motion.div>
            <motion.h1 variants={fadeUp} className="font-heading font-bold text-white mb-6"
              style={{ fontSize: "clamp(2rem,5vw,3.5rem)", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
              Automatizar sin revisar la seguridad<br />
              <span style={{ color: "#E86F6F" }}>es abrir puertas que no sabes que existen</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg mb-8 max-w-2xl" style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
              El 60% de las brechas de seguridad en PYMEs vienen de integraciones mal configuradas.
              Conectas herramientas de IA sin revisar qué acceso tienen, dónde van los datos de tus clientes
              y qué pasa si alguien las explota. Lo analizamos nosotros antes de que lo haga otro.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => document.getElementById("cta-ciber")?.scrollIntoView({ behavior:"smooth" })} className="btn-primary">
                Solicitar análisis de seguridad <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Vulnerabilidades reales */}
      <section className="py-16 md:py-24">
        <div className="mx-auto px-6 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={fadeUp} className="mb-10">
            <h2 className="font-heading font-bold text-white mb-3" style={{ fontSize: "clamp(1.5rem,4vw,2.5rem)", letterSpacing: "-0.02em" }}>
              Lo que encontramos en el 80% de los proyectos
            </h2>
            <p style={{ color: "rgba(255,255,255,0.45)", maxWidth: "520px", lineHeight: 1.7 }}>
              No son vulnerabilidades teóricas. Son las que encontramos de forma recurrente
              al revisar integraciones de IA reales en empresas como la tuya.
            </p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={stagger}
            className="grid md:grid-cols-2 gap-5">
            {[
              { title:"APIs sin autenticación o con tokens hardcodeados", risk:"CRÍTICO", desc:"Conectar herramientas de IA con claves de API incrustadas en el código o compartidas por email es la vía de entrada más habitual. Un token expuesto da acceso completo a la herramienta.", color:"#E86F6F" },
              { title:"Datos de clientes en sistemas sin cifrar en tránsito", risk:"CRÍTICO", desc:"Formularios web que mandan datos por HTTP sin HTTPS, integraciones que pasan información de clientes por webhooks sin validación de origen o sin cifrado end-to-end.", color:"#E86F6F" },
              { title:"Permisos excesivos en integraciones de terceros", risk:"ALTO", desc:"Una integración con Google Drive que pide acceso a toda la cuenta en vez de solo a la carpeta necesaria. Un conector de CRM con permisos de admin cuando solo necesita leer contactos.", color:"#E8A24F" },
              { title:"Sin backups verificados de los flujos críticos", risk:"ALTO", desc:"Automatizaciones que mueven datos críticos sin mecanismo de recuperación si algo falla. Si el flujo de facturación se rompe en producción, ¿cuánto tiempo tardáis en detectarlo?", color:"#E8A24F" },
              { title:"RGPD: datos de clientes en herramientas de IA sin base legitimadora", risk:"ALTO", desc:"Pasar nombres, emails o historial de compras a modelos de IA (ChatGPT, Claude) sin revisar si el proveedor cumple RGPD y si tenéis base legal para el tratamiento.", color:"#E8A24F" },
              { title:"Sin logs de auditoría en procesos automatizados críticos", risk:"MEDIO", desc:"Si una automatización envía facturas erróneas, modifica registros de CRM o cancela pedidos, ¿hay un registro de qué pasó exactamente y cuándo? Sin logs, la investigación es imposible.", color:"rgba(255,255,255,0.4)" },
            ].map((v, i) => (
              <motion.div key={i} variants={fadeUp} className="rounded-xl p-5" style={{ background: "#0D0E1F", border: `1px solid ${v.color}25` }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-white">{v.title}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 ml-3" style={{ background: `${v.color}18`, color: v.color, border: `1px solid ${v.color}30` }}>{v.risk}</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Qué hacemos */}
      <section className="py-16 md:py-20" style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="mx-auto px-6 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={stagger}
            className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div variants={fadeUp}>
              <h2 className="font-heading font-bold text-white mb-4" style={{ fontSize: "clamp(1.5rem,3vw,2.25rem)", letterSpacing: "-0.02em" }}>
                Validado por hackers éticos.<br />No es un checklist genérico.
              </h2>
              <p className="mb-4 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                Nuestro análisis de ciberseguridad es parte del Inspire Cyber 360. No es un PDF de buenas
                prácticas que cualquiera puede copiar de internet. Es una revisión real de tus integraciones,
                tus flujos de datos y tus configuraciones actuales, realizada con criterio técnico.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  "Revisión de todas las integraciones activas y sus permisos",
                  "Test de APIs expuestas y validación de autenticación",
                  "Análisis del flujo de datos de clientes (RGPD)",
                  "Revisión de configuración de backups y recovery",
                  "Informe de vulnerabilidades con nivel de riesgo y plan de mitigación priorizado",
                  "Validación de las automatizaciones propuestas antes de implementar",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                    <div className="w-5 h-5 rounded-full grid place-items-center flex-shrink-0 mt-0.5"
                      style={{ background: "rgba(232,111,111,0.15)", border: "1px solid rgba(232,111,111,0.3)" }}>
                      <Check style={{ width:10, height:10, color:"#E86F6F" }} />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div variants={fadeUp} className="rounded-2xl p-7" style={{ background: "#0D0E1F", border: "1px solid rgba(232,111,111,0.2)" }}>
              <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>Ejemplo de hallazgos reales</div>
              {[
                ["API de WhatsApp Business sin validación de origen","CRÍTICO","#E86F6F"],
                ["Token de OpenAI en variable de entorno sin rotación","CRÍTICO","#E86F6F"],
                ["Datos de clientes en Zapier sin cifrar (RGPD)","ALTO","#E8A24F"],
                ["Backups de N8N sin verificación semanal","ALTO","#E8A24F"],
                ["Permisos de Google Sheets: acceso a toda la cuenta","MEDIO","rgba(255,255,255,0.45)"],
              ].map(([vuln, level, color]) => (
                <div key={vuln as string} className="flex items-center justify-between py-2.5 border-b text-xs" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                  <span style={{ color: "rgba(255,255,255,0.6)" }}>{vuln}</span>
                  <span className="ml-3 flex-shrink-0 px-2 py-0.5 rounded-full" style={{ background: `${color}15`, color: color as string }}>{level}</span>
                </div>
              ))}
              <p className="text-xs mt-4" style={{ color: "rgba(255,255,255,0.25)" }}>
                Cada hallazgo incluye descripción técnica, impacto estimado y acción concreta de mitigación.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="mx-auto px-6 max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={fadeUp} className="mb-8">
            <h2 className="font-heading font-bold text-white" style={{ fontSize: "clamp(1.4rem,3vw,2rem)", letterSpacing: "-0.02em" }}>Preguntas frecuentes</h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={stagger} className="flex flex-col gap-3">
            {[
              { q:"¿Necesitamos tener automatizaciones activas para contratar este servicio?", a:"No. El análisis de ciberseguridad es especialmente valioso antes de implementar, no solo después. Si estáis pensando en conectar herramientas de IA, es el momento de revisar cómo hacerlo de forma segura desde el principio." },
              { q:"¿Tenéis acceso a nuestros sistemas?", a:"Solo el mínimo necesario para verificar configuraciones específicas, con vuestro consentimiento explícito en cada paso. No almacenamos credenciales y el acceso se revoca al finalizar el análisis. Nunca pedimos acceso a datos de producción de clientes." },
              { q:"¿El análisis incluye RGPD?", a:"Sí. Revisamos si el tratamiento de datos de clientes en vuestras herramientas de IA tiene base legitimadora, si los proveedores cumplen las garantías del RGPD (transferencias internacionales, DPA firmado) y si existe registro de actividades de tratamiento." },
            ].map((f, i) => (
              <motion.details key={i} variants={fadeUp} className="rounded-xl overflow-hidden" style={{ background: "#0D0E1F", border: "1px solid rgba(255,255,255,0.07)" }}>
                <summary className="px-5 py-4 cursor-pointer font-medium text-white text-sm">{f.q}</summary>
                <div className="px-5 pb-4 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{f.a}</div>
              </motion.details>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta-ciber" className="py-16 md:py-24 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="mx-auto px-6 max-w-2xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="font-heading font-bold text-white mb-4"
              style={{ fontSize: "clamp(1.75rem,4vw,2.75rem)", letterSpacing: "-0.02em" }}>
              Mejor revisarlo antes<br />que después de una brecha
            </motion.h2>
            <motion.p variants={fadeUp} className="mb-8" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
              Una llamada gratuita de 30 minutos para entender vuestro contexto técnico actual
              y ver si tiene sentido un análisis completo.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link href="/#contacto" className="btn-primary inline-flex items-center gap-2">
                Solicitar primera llamada <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-10 border-t" style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}>
        <div className="mx-auto px-6 max-w-5xl">
          <p className="text-xs uppercase tracking-widest mb-5 text-center" style={{ color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em" }}>Otros servicios</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { href:"/consultoria-ia-empresas", label:"Consultoría IA para empresas" },
              { href:"/automatizacion-procesos-ia", label:"Automatización de procesos" },
              { href:"/formacion-ia-equipos", label:"Formación IA para equipos" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="rounded-xl px-4 py-3 text-sm font-medium text-center transition-colors"
                style={{ background: "#0D0E1F", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.55)" }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
