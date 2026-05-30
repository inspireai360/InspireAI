"use client";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";
import LandingNav from "@/components/LandingNav";

export default function ConsultoriaIA() {
  const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16,1,0.3,1] } } };
  const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };

  return (
    <div className="min-h-screen bg-dark text-white selection:bg-primary/30 selection:text-white">
      {/* Nav */}
      <LandingNav ctaLabel="Solicitar diagnóstico" onCtaClick={() => document.getElementById("contacto-landing")?.scrollIntoView({ behavior:"smooth" })} />

      {/* Hero */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden" style={{ background: "#08091A" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 40% at 50% -10%, rgba(91,98,244,0.2) 0%, transparent 70%)" }} />
        <div className="mx-auto px-6 max-w-4xl relative z-10">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6"
              style={{ background: "rgba(91,98,244,0.1)", color: "#818CF8", border: "1px solid rgba(91,98,244,0.25)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Servicio principal · Inspire Cyber 360
            </motion.div>
            <motion.h1 variants={fadeUp} className="font-heading font-bold text-white mb-6"
              style={{ fontSize: "clamp(2rem,5vw,3.5rem)", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
              Sabemos exactamente qué está frenando tu empresa.<br />
              <span style={{ color: "#818CF8" }}>Ahora te lo decimos.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg mb-8 max-w-2xl" style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
              Auditamos tus 4 áreas clave — ventas, marketing, operaciones y fulfillment — e identificamos
              exactamente qué procesos se pueden automatizar con IA, cuánto te costaría no hacerlo y cómo
              implementarlo de forma segura. Sin informes genéricos: todo termina en Notion, operativo desde el día 1.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => document.getElementById("contacto-landing")?.scrollIntoView({ behavior:"smooth" })}
                className="btn-primary">Solicitar primera llamada gratuita <ArrowRight className="w-4 h-4" /></button>
              <button onClick={() => document.getElementById("proceso")?.scrollIntoView({ behavior:"smooth" })}
                className="btn-secondary">Ver cómo funciona</button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pain point */}
      <section className="py-16 md:py-20" style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="mx-auto px-6 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={stagger}
            className="grid md:grid-cols-3 gap-6">
            {[
              { num: "73%", desc: "de directivos admite que su equipo pierde más de 3h/día en tareas que ya podrían hacerse solas. Sin un mapa claro, no sabes cuáles ni cuánto te cuestan.", color: "#818CF8" },
              { num: "1 de 3", desc: "errores en procesos críticos es evitable. Una factura mal calculada, un lead perdido en WhatsApp, un contrato sin firmar. Pequeños fallos que cuestan clientes.", color: "#E8A24F" },
              { num: "6 meses", desc: "es el plazo medio en el que nuestros clientes ven resultados medibles tras la implementación. Con el roadmap correcto, no hay atajos falsos ni promesas vacías.", color: "#3FB984" },
            ].map((s, i) => (
              <motion.div key={i} variants={fadeUp} className="rounded-2xl p-6" style={{ background: "#0D0E1F", border: `1px solid ${s.color}25` }}>
                <div className="text-4xl font-bold mb-3" style={{ color: s.color, letterSpacing: "-0.04em" }}>{s.num}</div>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Proceso */}
      <section id="proceso" className="py-16 md:py-24">
        <div className="mx-auto px-6 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={fadeUp} className="mb-12">
            <h2 className="font-heading font-bold text-white mb-4" style={{ fontSize: "clamp(1.6rem,4vw,2.5rem)", letterSpacing: "-0.02em" }}>
              El método: 5 fases, entregable real
            </h2>
            <p className="max-w-xl" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
              No hay auditorías de 2 horas con PowerPoint genérico. El Inspire Cyber 360 es un proceso
              estructurado de 4–6 semanas que termina con tu equipo usando los resultados, no archivándolos.
            </p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={stagger} className="grid md:grid-cols-5 gap-4">
            {[
              { n:"01", title:"Kickoff y cuestionarios", desc:"4 cuestionarios de 50 preguntas por área. Los rellena tu equipo en su propio ritmo. Sin reuniones infinitas.", icon:"📋" },
              { n:"02", title:"Auditoría de 4 áreas", desc:"Ventas, marketing, operaciones y fulfillment. Mapeamos cada proceso, identificamos cuellos de botella y cuantificamos el impacto.", icon:"🔍" },
              { n:"03", title:"Detección IA y automatización", desc:"Cruzamos hallazgos con herramientas reales (N8N, Make, Claude API, Zapier). Priorizamos por ROI, no por complejidad técnica.", icon:"⚡" },
              { n:"04", title:"Análisis de ciberseguridad", desc:"Revisamos las integraciones propuestas con criterio de seguridad. Sin esto, automatizar es abrir puertas que no ves.", icon:"🔒" },
              { n:"05", title:"Entrega en Notion + reunión CTO", desc:"Informe operativo con roadmap priorizado. Reunión 1:1 con Timur para resolución de dudas técnicas y arranque.", icon:"🎯" },
            ].map((s, i) => (
              <motion.div key={i} variants={fadeUp} className="rounded-2xl p-5 flex flex-col items-center text-center"
                style={{ background: "#0D0E1F", border: "1px solid rgba(91,98,244,0.2)" }}>
                <div className="text-3xl mb-3">{s.icon}</div>
                <div className="text-xs font-bold mb-1.5" style={{ color: "#818CF8", letterSpacing: "0.08em" }}>{s.n}</div>
                <div className="font-semibold text-white text-sm mb-2">{s.title}</div>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Qué recibes */}
      <section className="py-16 md:py-20" style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="mx-auto px-6 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={stagger}
            className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div variants={fadeUp}>
              <h2 className="font-heading font-bold text-white mb-4" style={{ fontSize: "clamp(1.5rem,4vw,2.25rem)", letterSpacing: "-0.02em" }}>
                El entregable no es un PDF estático
              </h2>
              <p className="mb-6" style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>
                Tu informe vive en Notion. Tu equipo puede abrirlo, actualizarlo y ejecutar tareas
                desde el día siguiente a la reunión de entrega. No hay documentos que se archivan
                sin que nadie los lea.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  "Mapa completo de procesos auditados con impacto económico estimado",
                  "Top 10 oportunidades de automatización priorizadas por ROI",
                  "Informe de ciberseguridad con vulnerabilidades y plan de mitigación",
                  "Roadmap técnico por fases con herramientas y recursos estimados",
                  "Reunión 1:1 de 60 min con el CTO para resolver dudas técnicas",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                    <div className="w-5 h-5 rounded-full grid place-items-center flex-shrink-0 mt-0.5"
                      style={{ background: "rgba(91,98,244,0.2)", border: "1px solid rgba(91,98,244,0.4)" }}>
                      <Check style={{ width:10, height:10, color:"#818CF8" }} />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div variants={fadeUp} className="rounded-2xl overflow-hidden" style={{ background: "#191919", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="flex items-center gap-2 px-4 py-2.5 border-b" style={{ background: "#171717", borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{ background: "#E86F6F" }}/><div className="w-2.5 h-2.5 rounded-full" style={{ background: "#E8A24F" }}/><div className="w-2.5 h-2.5 rounded-full" style={{ background: "#3FB984" }}/></div>
                <span className="text-xs ml-2" style={{ color: "rgba(255,255,255,0.3)" }}>notion.so / Inspire Cyber 360 — Tu empresa</span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-4"><span className="text-lg">📋</span><h3 className="text-sm font-bold text-white">Diagnóstico de Procesos</h3></div>
                <div className="rounded-lg p-3 mb-4 text-xs" style={{ background: "rgba(91,98,244,0.1)", border: "1px solid rgba(91,98,244,0.2)", color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>
                  <strong style={{ color: "white" }}>Resumen ejecutivo:</strong> 12 oportunidades detectadas. Ahorro estimado: 18h/semana y +34.000€/año.
                </div>
                {[["📢 Marketing","Alto","Alta"],["💼 Ventas","Alto","Media"],["⚙️ Operaciones","Medio","Alta"],["🚚 Fulfillment","Medio","Media"]].map(([a,imp,urg]) => (
                  <div key={a} className="flex items-center justify-between py-2 text-xs border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                    <span style={{ color: "rgba(255,255,255,0.65)" }}>{a}</span>
                    <span className="px-1.5 py-0.5 rounded-full" style={{ background: "rgba(63,185,132,0.15)", color: "#3FB984" }}>{imp}</span>
                    <span className="px-1.5 py-0.5 rounded-full" style={{ background: "rgba(232,111,111,0.15)", color: "#E86F6F" }}>{urg}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Precios y garantía */}
      <section className="py-16 md:py-24">
        <div className="mx-auto px-6 max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={stagger}
            className="grid md:grid-cols-2 gap-6">
            <motion.div variants={fadeUp} className="rounded-2xl p-8" style={{ background: "#0D0E1F", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em" }}>Diagnóstico</div>
              <div className="text-4xl font-bold text-white mb-1" style={{ letterSpacing: "-0.03em" }}>1.500€ – 4.500€</div>
              <div className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>según alcance (1 a 4 áreas)</div>
              <div className="flex flex-col gap-3 mb-8">
                {["4–6 semanas de proceso","Informe Notion operativo","Reunión 1:1 con el CTO","Validación de ciberseguridad"].map((f,i) => (
                  <div key={i} className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                    <Check style={{ width:14, height:14, color:"#818CF8" }} />{f}
                  </div>
                ))}
              </div>
              <button onClick={() => document.getElementById("contacto-landing")?.scrollIntoView({ behavior:"smooth" })}
                className="btn-primary w-full">Solicitar diagnóstico <ArrowRight className="w-4 h-4" /></button>
            </motion.div>
            <motion.div variants={fadeUp} className="rounded-2xl p-8" style={{ background: "linear-gradient(135deg,rgba(91,98,244,0.15),rgba(91,98,244,0.04))", border: "1px solid rgba(91,98,244,0.3)" }}>
              <div className="text-3xl mb-4">✅</div>
              <h3 className="font-semibold text-white mb-3 text-lg">Garantía de impacto real</h3>
              <p className="mb-4 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                Si después del diagnóstico completo no identificamos al menos <strong style={{ color:"white" }}>2 procesos con impacto
                real y cuantificable de IA</strong> en tu empresa, te devolvemos el importe íntegro. Sin letras pequeñas,
                sin cláusulas de escape.
              </p>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                Además, si contratas la implementación dentro de los 30 días siguientes a la entrega,
                el 100% del coste del diagnóstico se bonifica.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="mx-auto px-6 max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={fadeUp} className="mb-10">
            <h2 className="font-heading font-bold text-white" style={{ fontSize: "clamp(1.5rem,3vw,2rem)", letterSpacing: "-0.02em" }}>Preguntas frecuentes</h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={stagger} className="flex flex-col gap-4">
            {[
              { q:"¿Para qué tipo de empresa está pensado?", a:"Para PYMEs de entre 5 y 50 empleados en España de cualquier sector. El diagnóstico es especialmente valioso para empresas que ya notan que sus procesos no escalan: equipos saturados, tareas repetitivas, clientes que se pierden en el camino." },
              { q:"¿Cuánto tiempo requiere de mi equipo?", a:"El grueso del trabajo lo hacemos nosotros. Tu equipo dedica aproximadamente 3–4 horas en total: rellenar los cuestionarios de cada área (a su ritmo, sin reuniones) y asistir a la reunión de entrega del informe." },
              { q:"¿Qué pasa si ya tenemos algunas automatizaciones?", a:"Perfecto, partimos de lo que ya tienes. El diagnóstico identifica qué está mal configurado, qué gaps dejan las automatizaciones actuales y dónde hay oportunidades que no estáis aprovechando. Revisamos todo con criterio de seguridad." },
              { q:"¿La implementación está incluida?", a:"No. El diagnóstico y la implementación son servicios separados. El diagnóstico te da el mapa; la implementación construye el camino. Si contratas la implementación en los 30 días siguientes, el diagnóstico se bonifica al 100%." },
            ].map((f, i) => (
              <motion.details key={i} variants={fadeUp} className="rounded-xl overflow-hidden" style={{ background: "#0D0E1F", border: "1px solid rgba(255,255,255,0.07)" }}>
                <summary className="px-5 py-4 cursor-pointer font-medium text-white text-sm">{f.q}</summary>
                <div className="px-5 pb-4 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{f.a}</div>
              </motion.details>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA final */}
      <section id="contacto-landing" className="py-16 md:py-24 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="mx-auto px-6 max-w-2xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="font-heading font-bold text-white mb-4"
              style={{ fontSize: "clamp(1.75rem,4vw,2.75rem)", letterSpacing: "-0.02em" }}>
              Primera llamada gratuita.<br />Sin compromiso.
            </motion.h2>
            <motion.p variants={fadeUp} className="mb-8" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
              En 30 minutos te decimos si el Inspire Cyber 360 tiene sentido para tu empresa y qué puedes
              esperar del diagnóstico. Si no hay encaje real, te lo decimos también.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link href="/#contacto" className="btn-primary inline-flex items-center gap-2">
                Reservar llamada gratuita <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="mt-4 text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                Respuesta en menos de 24h · Sin spam · Sin letra pequeña
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Internal links */}
      <section className="py-12 border-t" style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}>
        <div className="mx-auto px-6 max-w-5xl">
          <p className="text-xs uppercase tracking-widest mb-6 text-center" style={{ color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em" }}>Otros servicios</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { href:"/automatizacion-procesos-ia", label:"Automatización de procesos" },
              { href:"/ciberseguridad-ia-empresas", label:"Ciberseguridad IA" },
              { href:"/formacion-ia-equipos", label:"CRM personalizado" },
            ].map((l) => (
              <Link key={l.href} href={l.href}
                className="rounded-xl px-4 py-3 text-sm font-medium text-center transition-colors"
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
