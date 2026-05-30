"use client";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";
import LandingNav from "@/components/LandingNav";

export default function ConsultoriaIA() {
  const fadeUp = { hidden:{ opacity:0, y:20 }, visible:{ opacity:1, y:0, transition:{ duration:0.5, ease:[0.16,1,0.3,1] } } };
  const stagger = { hidden:{ opacity:0 }, visible:{ opacity:1, transition:{ staggerChildren:0.1 } } };

  return (
    <div className="min-h-screen bg-dark text-white selection:bg-primary/30 selection:text-white">
      <LandingNav ctaLabel="Solicitar diagnóstico" onCtaClick={() => document.getElementById("contacto-landing")?.scrollIntoView({ behavior:"smooth" })} />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative pt-20 pb-20 md:pt-28 md:pb-28 overflow-hidden" style={{ background:"#08091A" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage:"radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize:"28px 28px" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background:"radial-gradient(ellipse 80% 50% at 50% -10%, rgba(91,98,244,0.22) 0%, transparent 70%)" }} />
        <div className="mx-auto px-6 max-w-5xl relative z-10">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8"
              style={{ background:"rgba(91,98,244,0.1)", color:"#818CF8", border:"1px solid rgba(91,98,244,0.3)", letterSpacing:"0.1em", textTransform:"uppercase" }}>
              ✦ Inspire Cyber 360 — Nuestro producto estrella
            </motion.div>
            <motion.h1 variants={fadeUp} className="font-heading font-bold text-white mb-6"
              style={{ fontSize:"clamp(2.2rem,5.5vw,4rem)", lineHeight:1.08, letterSpacing:"-0.025em", maxWidth:"800px", margin:"0 auto 1.5rem" }}>
              Sabemos exactamente qué está frenando tu empresa.
              <br /><span style={{ color:"#818CF8" }}>Ahora te lo decimos.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-xl mb-10 mx-auto" style={{ color:"rgba(255,255,255,0.55)", lineHeight:1.7, maxWidth:"600px" }}>
              Auditamos tus 4 áreas clave, identificamos oportunidades reales de IA con impacto económico
              estimado y te entregamos un roadmap operativo en Notion. Sin PowerPoints. Sin teoría. Sin promesas vacías.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => document.getElementById("contacto-landing")?.scrollIntoView({ behavior:"smooth" })} className="btn-primary">
                Solicitar primera llamada gratuita <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => document.getElementById("proceso")?.scrollIntoView({ behavior:"smooth" })} className="btn-secondary">
                Ver el proceso
              </button>
            </motion.div>
          </motion.div>

          {/* Stat strip */}
          <motion.div initial="hidden" animate="visible" variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-12"
            style={{ borderTop:"1px solid rgba(255,255,255,0.07)" }}>
            {[
              { num:"4–6 sem.", label:"Duración del proceso" },
              { num:"4 áreas", label:"Ventas · Marketing · Ops · Delivery" },
              { num:"100%", label:"Personalizado a tu sector" },
              { num:"Garantía", label:"Devolución si no hay impacto real" },
            ].map((s,i) => (
              <motion.div key={i} variants={fadeUp} className="text-center">
                <div className="text-2xl font-bold text-white mb-1" style={{ letterSpacing:"-0.02em" }}>{s.num}</div>
                <div className="text-xs" style={{ color:"rgba(255,255,255,0.35)" }}>{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── QUÉ ES EL INSPIRE CYBER 360 ─────────────────────────────────────── */}
      <section className="py-16 md:py-24" style={{ background:"rgba(255,255,255,0.015)", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
        <div className="mx-auto px-6 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={stagger}
            className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeUp}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color:"#818CF8", letterSpacing:"0.12em" }}>El diagnóstico</p>
              <h2 className="font-heading font-bold text-white mb-5" style={{ fontSize:"clamp(1.6rem,4vw,2.5rem)", letterSpacing:"-0.02em", lineHeight:1.2 }}>
                Lo que otras consultoras llaman "diagnóstico" es un PDF que nadie usa después.
              </h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color:"rgba(255,255,255,0.55)" }}>
                El Inspire Cyber 360 es diferente: no viene a explicarte qué es la IA ni a venderte 
                cursos. Viene a mapear tu empresa concreta — tus procesos, tu stack, tu equipo — 
                y a decirte exactamente dónde puedes ganar tiempo, dinero y margen con automatización real.
              </p>
              <p className="text-sm leading-relaxed" style={{ color:"rgba(255,255,255,0.55)" }}>
                El entregable no es un documento. Es un sistema operativo en Notion que tu equipo 
                puede abrir al día siguiente de la reunión y empezar a usar.
              </p>
            </motion.div>
            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
              {[
                { label:"Consultoras tradicionales", items:["PDF de 80 páginas que nadie lee","Recomendaciones genéricas del sector","Sin validación técnica real","Facturan por horas, no por impacto"] , bad:true },
                { label:"Inspire Cyber 360", items:["Entregable en Notion operativo","Oportunidades priorizadas por ROI","Ciberseguridad validada en cada propuesta","Garantía de devolución si no hay impacto"] , bad:false },
              ].map((col,i) => (
                <div key={i} className="rounded-xl p-5" style={{ background: i===0 ? "rgba(255,255,255,0.03)" : "rgba(91,98,244,0.1)", border: i===0 ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(91,98,244,0.3)" }}>
                  <div className="text-xs font-semibold mb-4" style={{ color: i===0 ? "rgba(255,255,255,0.35)" : "#818CF8", letterSpacing:"0.06em" }}>{col.label}</div>
                  {col.items.map((item,j) => (
                    <div key={j} className="flex items-start gap-2 mb-2.5 text-xs" style={{ color: i===0 ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.75)" }}>
                      <span style={{ color: i===0 ? "rgba(232,111,111,0.6)" : "#3FB984", flexShrink:0 }}>{i===0 ? "✗" : "✓"}</span>
                      {item}
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── LAS 4 ÁREAS ──────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto px-6 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={fadeUp} className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color:"#818CF8", letterSpacing:"0.12em" }}>Alcance</p>
            <h2 className="font-heading font-bold text-white mb-4" style={{ fontSize:"clamp(1.5rem,4vw,2.5rem)", letterSpacing:"-0.02em" }}>
              4 áreas, 200 preguntas,<br />cero suposiciones
            </h2>
            <p style={{ color:"rgba(255,255,255,0.45)", maxWidth:"520px", lineHeight:1.7 }}>
              Tu equipo rellena cuestionarios específicos por área antes de que nos reunamos.
              Llegamos al kickoff ya sabiendo qué funciona, qué falla y dónde está el dinero.
            </p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={stagger}
            className="grid md:grid-cols-2 gap-5">
            {[
              { icon:"💼", area:"Ventas", color:"#818CF8",
                desc:"Cómo captáis leads, qué pasa con los que no responden, cuánto tarda un deal en cerrarse y dónde se escapan clientes que no deberían escaparse.",
                ejemplos:["Seguimiento automático de leads sin respuesta","Propuestas generadas sin intervención manual","CRM actualizado solo tras cada interacción"] },
              { icon:"📢", area:"Marketing", color:"#E8A24F",
                desc:"Canales, conversión, contenido. Si gastáis en ads o no, si sabéis de dónde vienen vuestros mejores clientes y si el tiempo que invertís en marketing da retorno real.",
                ejemplos:["Atribución de leads por canal","Publicación automatizada en múltiples plataformas","Respuestas automáticas fuera de horario"] },
              { icon:"⚙️", area:"Operaciones", color:"#3FB984",
                desc:"Los procesos del día a día que se hacen a mano: pedidos, facturación, contratos, comunicación interna. Dónde se pierde tiempo y dónde se cometen errores evitables.",
                ejemplos:["Pedidos de WhatsApp al sistema sin tocar teclado","Facturación automática al confirmar entrega","Contratos generados desde plantilla en segundos"] },
              { icon:"🚚", area:"Fulfillment / Delivery", color:"#E86F6F",
                desc:"Desde que se acepta un pedido hasta que llega al cliente. Coordinación, tracking, incidencias y satisfacción post-entrega.",
                ejemplos:["Tracking automático con aviso al cliente","Gestión de incidencias sin cadena de WhatsApps","Encuestas de satisfacción automatizadas"] },
            ].map((a,i) => (
              <motion.div key={i} variants={fadeUp} className="rounded-2xl p-6" style={{ background:"#0D0E1F", border:`1px solid ${a.color}20` }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{a.icon}</span>
                  <h3 className="font-semibold text-white">{a.area}</h3>
                  <div className="ml-auto w-2 h-2 rounded-full" style={{ background:a.color }} />
                </div>
                <p className="text-sm mb-4 leading-relaxed" style={{ color:"rgba(255,255,255,0.5)" }}>{a.desc}</p>
                <div className="flex flex-col gap-1.5">
                  {a.ejemplos.map((ej,j) => (
                    <div key={j} className="flex items-start gap-2 text-xs" style={{ color:"rgba(255,255,255,0.55)" }}>
                      <span style={{ color:a.color, flexShrink:0 }}>→</span>{ej}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PROCESO 5 FASES ───────────────────────────────────────────────────── */}
      <section id="proceso" className="py-16 md:py-24" style={{ background:"rgba(255,255,255,0.015)", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
        <div className="mx-auto px-6 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={fadeUp} className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color:"#818CF8", letterSpacing:"0.12em" }}>El proceso</p>
            <h2 className="font-heading font-bold text-white mb-4" style={{ fontSize:"clamp(1.5rem,4vw,2.5rem)", letterSpacing:"-0.02em" }}>
              4–6 semanas. Sin reuniones infinitas.
            </h2>
            <p style={{ color:"rgba(255,255,255,0.45)", maxWidth:"500px", lineHeight:1.7 }}>
              Tu equipo invierte unas 4 horas en total. El resto lo hacemos nosotros.
            </p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={stagger}
            className="flex flex-col gap-3">
            {[
              { n:"01", icon:"📋", title:"Cuestionarios por área", time:"Semanas 1–2",
                desc:"Tu equipo rellena 4 cuestionarios de ~50 preguntas cada uno, en su propio ritmo y sin reuniones previas. Capturamos la realidad de vuestros procesos sin filtros ni preparación." },
              { n:"02", icon:"🔍", title:"Auditoría y análisis", time:"Semanas 2–4",
                desc:"Procesamos las respuestas, mapeamos los procesos críticos, cruzamos con benchmarks del sector e identificamos las oportunidades con mayor ROI. Aquí es donde separamos lo que vale de lo que suena bien." },
              { n:"03", icon:"🔒", title:"Validación de ciberseguridad", time:"Semana 4",
                desc:"Cada automatización propuesta pasa por un análisis de seguridad. No implementamos nada que abra vulnerabilidades. Esta fase no la hace ninguna otra consultora de IA." },
              { n:"04", icon:"🗺️", title:"Roadmap técnico priorizado", time:"Semana 5",
                desc:"Un plan de implementación con fases, herramientas concretas, estimación de tiempo y recursos. Priorizado por impacto económico, no por complejidad técnica." },
              { n:"05", icon:"🎯", title:"Entrega + reunión 1:1 con el CTO", time:"Semana 5–6",
                desc:"Reunión de 60 minutos con Timur para presentar el informe, responder dudas técnicas y definir los próximos pasos. El Notion queda operativo para vuestro equipo ese mismo día." },
            ].map((s,i) => (
              <motion.div key={i} variants={fadeUp}
                className="rounded-xl p-5 flex gap-5 items-start"
                style={{ background:"#0D0E1F", border:"1px solid rgba(255,255,255,0.07)" }}>
                <div className="w-11 h-11 rounded-xl grid place-items-center flex-shrink-0"
                  style={{ background:"rgba(91,98,244,0.12)", border:"1px solid rgba(91,98,244,0.25)" }}>
                  <span className="text-lg">{s.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold" style={{ color:"rgba(91,98,244,0.7)", letterSpacing:"0.06em" }}>{s.n}</span>
                      <h3 className="font-semibold text-white text-sm">{s.title}</h3>
                    </div>
                    <span className="text-xs flex-shrink-0" style={{ color:"rgba(255,255,255,0.25)" }}>{s.time}</span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color:"rgba(255,255,255,0.5)" }}>{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── EL ENTREGABLE ─────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto px-6 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={stagger}
            className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div variants={fadeUp}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color:"#818CF8", letterSpacing:"0.12em" }}>El entregable</p>
              <h2 className="font-heading font-bold text-white mb-5" style={{ fontSize:"clamp(1.5rem,4vw,2.25rem)", letterSpacing:"-0.02em", lineHeight:1.2 }}>
                No un PDF. Un sistema operativo para tu empresa.
              </h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color:"rgba(255,255,255,0.55)" }}>
                El informe vive en Notion. Tu equipo puede abrirlo, actualizar el estado de cada
                tarea, asignar responsables y hacer seguimiento desde el día siguiente a la entrega.
                No hay documentos que se archivan sin que nadie los lea.
              </p>
              <div className="flex flex-col gap-3 mt-5">
                {[
                  "Mapa completo de los procesos auditados con impacto económico estimado",
                  "Top oportunidades de automatización priorizadas por ROI",
                  "Informe de ciberseguridad con vulnerabilidades y plan de mitigación",
                  "Roadmap técnico por fases con herramientas y recursos",
                  "Reunión 1:1 de 60 min con el CTO incluida",
                ].map((item,i) => (
                  <div key={i} className="flex items-start gap-3 text-sm" style={{ color:"rgba(255,255,255,0.65)" }}>
                    <div className="w-5 h-5 rounded-full grid place-items-center flex-shrink-0 mt-0.5"
                      style={{ background:"rgba(91,98,244,0.18)", border:"1px solid rgba(91,98,244,0.35)" }}>
                      <Check style={{ width:10, height:10, color:"#818CF8" }} />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Notion mockup */}
            <motion.div variants={fadeUp} className="rounded-2xl overflow-hidden"
              style={{ background:"#191919", border:"1px solid rgba(255,255,255,0.1)", boxShadow:"0 20px 60px -12px rgba(0,0,0,0.6)" }}>
              <div className="flex items-center gap-2 px-4 py-2.5 border-b" style={{ background:"#171717", borderColor:"rgba(255,255,255,0.06)" }}>
                <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{ background:"#E86F6F" }}/><div className="w-2.5 h-2.5 rounded-full" style={{ background:"#E8A24F" }}/><div className="w-2.5 h-2.5 rounded-full" style={{ background:"#3FB984" }}/></div>
                <span className="text-xs ml-2" style={{ color:"rgba(255,255,255,0.25)" }}>notion.so / Inspire Cyber 360 — Tu empresa</span>
                <div className="flex items-center gap-1 ml-auto">
                  {["LL","TI","ME"].map(i => <div key={i} className="w-5 h-5 rounded-full grid place-items-center text-[9px] font-bold" style={{ background:"rgba(91,98,244,0.4)", color:"#fff" }}>{i}</div>)}
                </div>
              </div>
              <div className="flex" style={{ minHeight:"300px" }}>
                <div className="hidden md:flex flex-col w-44 flex-shrink-0 py-3 border-r" style={{ background:"#171717", borderColor:"rgba(255,255,255,0.05)" }}>
                  {[["📋","01 · Diagnóstico",true],["⚡","02 · Mapa IA",false],["🔒","03 · Seguridad",false],["🗺️","04 · Roadmap",false],["📊","Resumen ejecutivo",false]].map(([icon,label,active]) => (
                    <div key={label as string} className="flex items-center gap-2 mx-2 px-2 py-1.5 rounded text-xs"
                      style={{ background: active ? "rgba(91,98,244,0.15)" : "transparent", color: active ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.35)" }}>
                      {icon}<span>{label}</span>
                    </div>
                  ))}
                </div>
                <div className="flex-1 p-5">
                  <div className="flex items-center gap-2 mb-4"><span>📋</span><h3 className="text-sm font-bold text-white">Diagnóstico de Procesos</h3></div>
                  <div className="rounded-lg px-4 py-3 mb-4 text-xs" style={{ background:"rgba(91,98,244,0.1)", border:"1px solid rgba(91,98,244,0.25)", color:"rgba(255,255,255,0.65)", lineHeight:1.6 }}>
                    <strong style={{ color:"white" }}>Resumen ejecutivo:</strong> 12 oportunidades detectadas. Ahorro estimado: 18h/semana y +34.000€/año de impacto directo.
                  </div>
                  {[["💼 Ventas","Alto","Alta","#818CF8"],["📢 Marketing","Alto","Media","#E8A24F"],["⚙️ Operaciones","Medio","Alta","#E86F6F"],["🚚 Fulfillment","Medio","Media","#3FB984"]].map(([area,imp,urg,color]) => (
                    <div key={area as string} className="flex items-center justify-between py-2 text-xs border-b" style={{ borderColor:"rgba(255,255,255,0.05)" }}>
                      <span style={{ color:"rgba(255,255,255,0.65)" }}>{area}</span>
                      <span className="px-1.5 py-0.5 rounded-full" style={{ background:`${color}18`, color:color as string }}>{imp}</span>
                      <span style={{ color:"rgba(255,255,255,0.35)" }}>{urg}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── GARANTÍAS ─────────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24" style={{ background:"rgba(255,255,255,0.015)", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
        <div className="mx-auto px-6 max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={fadeUp} className="text-center mb-10">
            <h2 className="font-heading font-bold text-white mb-3" style={{ fontSize:"clamp(1.5rem,4vw,2.25rem)", letterSpacing:"-0.02em" }}>
              El precio se define en la primera llamada
            </h2>
            <p style={{ color:"rgba(255,255,255,0.45)", maxWidth:"500px", margin:"0 auto", lineHeight:1.7 }}>
              El alcance del diagnóstico varía según el número de áreas y la complejidad de la empresa.
              En la primera llamada entendemos vuestro contexto y os damos una propuesta concreta.
            </p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={stagger}
            className="grid md:grid-cols-3 gap-5">
            {[
              { icon:"✅", title:"Garantía de impacto real", desc:"Si no identificamos al menos 2 procesos con impacto real y cuantificable en tu empresa, devolvemos el importe íntegro. Sin letras pequeñas.", color:"#818CF8" },
              { icon:"🎯", title:"Diagnóstico que se recupera", desc:"Si decides avanzar con la implementación en los 30 días siguientes a la entrega, el 100% del coste del diagnóstico se descuenta.", color:"#3FB984" },
              { icon:"📋", title:"Propuesta sin compromiso", desc:"Primera llamada gratuita para entender vuestro contexto. Os enviamos una propuesta con alcance y precio antes de comprometeros a nada.", color:"#E8A24F" },
            ].map((c,i) => (
              <motion.div key={i} variants={fadeUp} className="rounded-2xl p-6" style={{ background:"#0D0E1F", border:`1px solid ${c.color}25` }}>
                <div className="text-2xl mb-4">{c.icon}</div>
                <h3 className="font-semibold text-white mb-2">{c.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color:"rgba(255,255,255,0.5)" }}>{c.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────────── */}
      <section className="py-16 border-t" style={{ borderColor:"rgba(255,255,255,0.06)" }}>
        <div className="mx-auto px-6 max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={fadeUp} className="mb-10">
            <h2 className="font-heading font-bold text-white" style={{ fontSize:"clamp(1.4rem,3vw,2rem)", letterSpacing:"-0.02em" }}>Preguntas frecuentes</h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={stagger} className="flex flex-col gap-3">
            {[
              { q:"¿Para qué tipo de empresa está pensado?", a:"Para PYMEs de entre 5 y 50 empleados en España de cualquier sector. El diagnóstico tiene especial valor para empresas que ya notan que sus procesos no escalan: equipos saturados, tareas repetitivas, clientes que se pierden en el camino." },
              { q:"¿Cuánto tiempo requiere de mi equipo?", a:"El grueso del trabajo lo hacemos nosotros. Tu equipo dedica aproximadamente 3–4 horas en total: rellenar los cuestionarios (a su ritmo, sin reuniones previas) y asistir a la reunión de entrega del informe." },
              { q:"¿Qué pasa si ya tenemos algunas automatizaciones?", a:"Perfecto punto de partida. El diagnóstico identifica qué está mal configurado, qué gaps dejan las automatizaciones actuales y dónde hay oportunidades que no estáis aprovechando. Revisamos todo con criterio de seguridad." },
              { q:"¿La implementación está incluida?", a:"No. El diagnóstico y la implementación son servicios separados. El diagnóstico te da el mapa; la implementación construye el camino. Si contratas la implementación dentro de los 30 días siguientes, el diagnóstico se bonifica al 100%." },
              { q:"¿Qué diferencia esto de contratar a un consultor freelance?", a:"Timur es CTO con experiencia técnica real en N8N, Make, Claude API y arquitectura de sistemas. No te vende una presentación bonita — te entrega un roadmap que él mismo podría implementar. La diferencia está en que auditamos con criterio de quien va a construirlo, no de quien va a explicarlo." },
            ].map((f,i) => (
              <motion.details key={i} variants={fadeUp} className="rounded-xl overflow-hidden" style={{ background:"#0D0E1F", border:"1px solid rgba(255,255,255,0.07)" }}>
                <summary className="px-5 py-4 cursor-pointer font-medium text-white text-sm select-none">{f.q}</summary>
                <div className="px-5 pb-4 text-sm leading-relaxed" style={{ color:"rgba(255,255,255,0.55)" }}>{f.a}</div>
              </motion.details>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────────────────────────────────── */}
      <section id="contacto-landing" className="py-20 md:py-28 border-t" style={{ borderColor:"rgba(255,255,255,0.06)" }}>
        <div className="mx-auto px-6 max-w-2xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={stagger}>
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color:"#818CF8", letterSpacing:"0.12em" }}>
              Primera llamada sin coste
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-heading font-bold text-white mb-5"
              style={{ fontSize:"clamp(1.75rem,4vw,3rem)", letterSpacing:"-0.025em", lineHeight:1.1 }}>
              Si tiene sentido para tu empresa,<br />te lo decimos en la primera llamada.
            </motion.h2>
            <motion.p variants={fadeUp} className="mb-8 text-lg" style={{ color:"rgba(255,255,255,0.5)", lineHeight:1.7 }}>
              Y si no lo tiene, también. Preferimos no perder tu tiempo ni el nuestro.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/#contacto" className="btn-primary inline-flex items-center gap-2">
                Reservar llamada gratuita <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <motion.p variants={fadeUp} className="mt-4 text-xs" style={{ color:"rgba(255,255,255,0.2)" }}>
              Sin spam · Sin compromiso · Respuesta en menos de 24h
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── INTERNAL LINKS ────────────────────────────────────────────────────── */}
      <section className="py-10 border-t" style={{ borderColor:"rgba(255,255,255,0.05)", background:"rgba(255,255,255,0.02)" }}>
        <div className="mx-auto px-6 max-w-5xl">
          <p className="text-xs uppercase tracking-widest mb-5 text-center" style={{ color:"rgba(255,255,255,0.2)", letterSpacing:"0.1em" }}>Otros servicios</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { href:"/automatizacion-procesos-ia", label:"Automatización de procesos" },
              { href:"/ciberseguridad-ia-empresas", label:"Ciberseguridad IA" },
              { href:"/formacion-ia-equipos", label:"CRM personalizado" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="rounded-xl px-4 py-3 text-sm font-medium text-center transition-colors"
                style={{ background:"#0D0E1F", border:"1px solid rgba(255,255,255,0.07)", color:"rgba(255,255,255,0.5)" }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
