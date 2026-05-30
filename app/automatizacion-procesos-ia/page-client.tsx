"use client";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function AutomatizacionProcesos() {
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
          <button onClick={() => document.getElementById("cta-auto")?.scrollIntoView({ behavior:"smooth" })}
            className="btn-primary-sm hidden md:flex">Solicitar diagnóstico</button>
        </div>
      </nav>

      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden" style={{ background: "#08091A" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 40% at 50% -10%, rgba(91,98,244,0.2) 0%, transparent 70%)" }} />
        <div className="mx-auto px-6 max-w-4xl relative z-10">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6"
              style={{ background: "rgba(232,162,79,0.1)", color: "#E8A24F", border: "1px solid rgba(232,162,79,0.25)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Automatización de procesos con IA
            </motion.div>
            <motion.h1 variants={fadeUp} className="font-heading font-bold text-white mb-6"
              style={{ fontSize: "clamp(2rem,5vw,3.5rem)", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
              Tu equipo pierde horas en tareas<br />
              <span style={{ color: "#E8A24F" }}>que ya pueden hacerse solas</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg mb-8 max-w-2xl" style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
              Pedidos por WhatsApp que nadie pasa al sistema. Facturas que se generan a mano.
              Leads que se pierden porque nadie hace seguimiento. Lo identificamos, lo priorizamos
              y lo automatizamos con herramientas reales: N8N, Make, Claude API.
              Sin promesas de startup. Con impacto medible en semanas.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => document.getElementById("cta-auto")?.scrollIntoView({ behavior:"smooth" })} className="btn-primary">
                Identificar qué automatizar <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => document.getElementById("casos")?.scrollIntoView({ behavior:"smooth" })} className="btn-secondary">
                Ver casos de uso reales
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* El problema con datos */}
      <section className="py-16 md:py-20" style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="mx-auto px-6 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={stagger}
            className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div variants={fadeUp}>
              <h2 className="font-heading font-bold text-white mb-4" style={{ fontSize: "clamp(1.5rem,3vw,2.25rem)", letterSpacing: "-0.02em" }}>
                Son las 9 del lunes.<br />Tu equipo ya va tarde.
              </h2>
              <p className="mb-4 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                40 minutos revisando WhatsApps del fin de semana. Pedidos en papel que hay que pasar al sistema.
                Confirmaciones de cita que alguien tiene que enviar una a una. Facturas generadas en Excel
                que luego hay que subir al software. <strong style={{ color: "white" }}>Cada empleado pierde de media 3.2h al día
                en este tipo de tareas.</strong>
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                El coste no es solo el tiempo: es el error humano en el traspaso, el cliente que no recibe
                confirmación y cancela, el informe de fin de mes que nadie tiene tiempo de hacer bien.
              </p>
            </motion.div>
            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
              {[
                { num:"3.2h", label:"perdidas por empleado al día en tareas repetitivas", color:"#E8A24F" },
                { num:"42%", label:"de esas horas se pueden automatizar con herramientas actuales", color:"#3FB984" },
                { num:"18h", label:"de media semanales que recuperan nuestros clientes tras la implementación", color:"#818CF8" },
                { num:"6 sem.", label:"plazo medio desde diagnóstico hasta primeras automatizaciones activas", color:"#E8A24F" },
              ].map((s, i) => (
                <div key={i} className="rounded-xl p-5" style={{ background: "#0D0E1F", border: `1px solid ${s.color}25` }}>
                  <div className="text-3xl font-bold mb-2" style={{ color: s.color, letterSpacing: "-0.03em" }}>{s.num}</div>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{s.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Casos de uso reales */}
      <section id="casos" className="py-16 md:py-24">
        <div className="mx-auto px-6 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={fadeUp} className="mb-12">
            <h2 className="font-heading font-bold text-white mb-3" style={{ fontSize: "clamp(1.5rem,4vw,2.5rem)", letterSpacing: "-0.02em" }}>
              Qué automatizamos y con qué
            </h2>
            <p style={{ color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: "520px" }}>
              No hay una automatización genérica que sirva para todos. Estas son las más frecuentes
              entre nuestros clientes, con las herramientas reales que usamos.
            </p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={stagger}
            className="grid md:grid-cols-2 gap-5">
            {[
              {
                area:"Ventas y captación",
                color:"#818CF8",
                items:[
                  "Seguimiento automático de leads que no responden (N8N + email/WhatsApp)",
                  "Notificación inmediata al equipo cuando entra un lead web (en menos de 2 min)",
                  "Propuestas generadas automáticamente desde un formulario (Claude API + Google Docs)",
                  "CRM actualizado sin intervención manual tras cada interacción",
                ]
              },
              {
                area:"Operaciones y pedidos",
                color:"#E8A24F",
                items:[
                  "Pedidos recibidos por WhatsApp → sistema de gestión sin tocar teclado (N8N + OCR)",
                  "Albaranes y facturas generados automáticamente al confirmar entrega",
                  "Rutas de reparto optimizadas cada mañana sin trabajo manual",
                  "Alertas proactivas al cliente con estado de su pedido (sin que llame)",
                ]
              },
              {
                area:"Administración y RRHH",
                color:"#3FB984",
                items:[
                  "Contabilidad: facturas de proveedores procesadas y categorizadas sin entrada manual",
                  "Contratos generados desde plantilla al rellenar un formulario (Notion + firma digital)",
                  "Recordatorios de renovación de contratos con 30/15/7 días de antelación",
                  "Informes de rendimiento semanales generados y enviados solos",
                ]
              },
              {
                area:"Marketing y contenido",
                color:"#E86F6F",
                items:[
                  "Publicación de productos en múltiples portales desde una única fuente de datos",
                  "Respuestas automáticas fuera de horario con contexto real del negocio (Claude API)",
                  "Informes de rendimiento de campañas sin abrir dashboards manualmente",
                  "Newsletter mensual generada a partir de los contenidos del mes (Claude + Mailchimp)",
                ]
              },
            ].map((c, i) => (
              <motion.div key={i} variants={fadeUp} className="rounded-2xl p-6" style={{ background: "#0D0E1F", border: `1px solid ${c.color}20` }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: c.color, letterSpacing: "0.08em" }}>{c.area}</span>
                </div>
                <div className="flex flex-col gap-2.5">
                  {c.items.map((item, j) => (
                    <div key={j} className="flex items-start gap-2 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: c.color }} />
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Herramientas */}
      <section className="py-12 border-t border-b" style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}>
        <div className="mx-auto px-6 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={fadeUp}>
            <p className="text-xs uppercase tracking-widest mb-6 text-center" style={{ color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em" }}>Herramientas con las que trabajamos</p>
            <div className="flex flex-wrap justify-center gap-3">
              {["N8N (self-hosted)","Make","Claude API","OpenAI API","Zapier","Google Workspace","Notion API","WhatsApp Business API","Stripe","Holded","Signaturit"].map((tool) => (
                <span key={tool} className="px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}>
                  {tool}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Proceso */}
      <section className="py-16 md:py-24">
        <div className="mx-auto px-6 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={fadeUp} className="mb-10">
            <h2 className="font-heading font-bold text-white mb-3" style={{ fontSize: "clamp(1.5rem,4vw,2.25rem)", letterSpacing: "-0.02em" }}>
              Cómo lo hacemos
            </h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={stagger} className="flex flex-col gap-4">
            {[
              { n:"01", title:"Diagnóstico previo", desc:"Primero auditamos tus procesos con el Inspire Cyber 360. Identificamos las automatizaciones con mayor ROI, dificultad técnica real y quick wins. Sin diagnóstico, automatizar a ciegas crea deuda técnica.", time:"4–6 semanas" },
              { n:"02", title:"Diseño de flujos", desc:"Mapeamos cada automatización como un flujo de trabajo antes de escribir una sola línea de código. Incluye escenarios de error, dependencias de datos y validación humana donde es necesaria.", time:"1–2 semanas" },
              { n:"03", title:"Implementación y pruebas", desc:"Construcción en N8N o Make según el caso. Pruebas en paralelo con los procesos actuales. Formación básica al equipo que va a usarlo.", time:"2–4 semanas" },
              { n:"04", title:"Monitorización y ajuste", desc:"Las primeras semanas son críticas. Monitorizamos que los flujos funcionan en producción real y ajustamos lo que sea necesario. Incluido en el precio de implementación.", time:"4 semanas" },
            ].map((s, i) => (
              <motion.div key={i} variants={fadeUp} className="rounded-xl p-5 flex gap-5 items-start"
                style={{ background: "#0D0E1F", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="w-10 h-10 rounded-xl grid place-items-center flex-shrink-0" style={{ background: "rgba(91,98,244,0.15)", border: "1px solid rgba(91,98,244,0.3)" }}>
                  <span className="text-xs font-bold" style={{ color: "#818CF8" }}>{s.n}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4 mb-1.5">
                    <h3 className="font-semibold text-white text-sm">{s.title}</h3>
                    <span className="text-xs flex-shrink-0" style={{ color: "rgba(255,255,255,0.3)" }}>{s.time}</span>
                  </div>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.65 }}>{s.desc}</p>
                </div>
              </motion.div>
            ))}
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
              { q:"¿Necesitamos cambiar nuestro software actual?", a:"En la mayoría de casos, no. Trabajamos sobre vuestras herramientas existentes (Holded, Sage, Gmail, WhatsApp Business, Shopify...) y las conectamos entre sí. Si hay una herramienta que claramente hay que sustituir, os lo decimos antes de cobrar nada." },
              { q:"¿Qué pasa si una automatización falla?", a:"Diseñamos todos los flujos con gestión de errores explícita: si algo falla, se notifica al responsable y el proceso vuelve al camino manual. Nunca automatizamos sin un fallback claro." },
              { q:"¿Cuánto cuesta implementar las automatizaciones?", a:"Depende del número y complejidad de los flujos. Tras el diagnóstico os damos un presupuesto detallado. En términos generales, paquetes de implementación de 3 meses oscilan entre 4.000€ y 15.000€. Si el diagnóstico identifica que el ROI no justifica la inversión, os lo decimos." },
              { q:"¿Las automatizaciones son nuestras o dependemos de vosotros?", a:"Son completamente vuestras. Trabajamos con N8N self-hosted (en vuestro servidor) o Make con vuestra cuenta. Os formamos para que podáis hacer ajustes menores sin depender de nosotros. Nada de lock-in." },
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
      <section id="cta-auto" className="py-16 md:py-24 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="mx-auto px-6 max-w-2xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="font-heading font-bold text-white mb-4"
              style={{ fontSize: "clamp(1.75rem,4vw,2.75rem)", letterSpacing: "-0.02em" }}>
              Empieza por saber qué automatizar
            </motion.h2>
            <motion.p variants={fadeUp} className="mb-8" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
              En la primera llamada gratuita te decimos qué procesos tienen más impacto en tu sector
              y si tiene sentido avanzar con un diagnóstico completo.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link href="/#contacto" className="btn-primary inline-flex items-center gap-2">
                Reservar primera llamada <ArrowRight className="w-4 h-4" />
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
              { href:"/ciberseguridad-ia-empresas", label:"Ciberseguridad IA" },
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
