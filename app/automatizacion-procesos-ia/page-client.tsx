"use client";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";
import LandingNav from "@/components/LandingNav";

export default function AutomatizacionProcesos() {
  const fadeUp = { hidden:{opacity:0,y:20}, visible:{opacity:1,y:0,transition:{duration:0.5,ease:[0.16,1,0.3,1]}} };
  const stagger = { hidden:{opacity:0}, visible:{opacity:1,transition:{staggerChildren:0.1}} };

  return (
    <div className="min-h-screen bg-dark text-white selection:bg-primary/30 selection:text-white">
      <LandingNav ctaLabel="Solicitar diagnóstico" onCtaClick={() => document.getElementById("cta-auto")?.scrollIntoView({behavior:"smooth"})} />

      {/* HERO */}
      <section className="relative pt-20 pb-20 md:pt-28 md:pb-28 overflow-hidden" style={{background:"#08091A"}}>
        <div className="absolute inset-0 pointer-events-none" style={{backgroundImage:"radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",backgroundSize:"28px 28px"}} />
        <div className="absolute inset-0 pointer-events-none" style={{background:"radial-gradient(ellipse 80% 50% at 50% -10%, rgba(232,162,79,0.18) 0%, transparent 70%)"}} />
        <div className="mx-auto px-6 max-w-5xl relative z-10">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8"
              style={{background:"rgba(232,162,79,0.1)",color:"#E8A24F",border:"1px solid rgba(232,162,79,0.3)",letterSpacing:"0.1em",textTransform:"uppercase"}}>
              ✦ Automatización de procesos con IA
            </motion.div>
            <motion.h1 variants={fadeUp} className="font-heading font-bold text-white mb-6"
              style={{fontSize:"clamp(2.2rem,5.5vw,4rem)",lineHeight:1.08,letterSpacing:"-0.025em",maxWidth:"800px",margin:"0 auto 1.5rem"}}>
              Lo que hoy hace tu equipo a mano,
              <br /><span style={{color:"#E8A24F"}}>mañana puede hacerse solo.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-xl mb-10 mx-auto" style={{color:"rgba(255,255,255,0.55)",lineHeight:1.7,maxWidth:"600px"}}>
              Pedidos por WhatsApp que nadie pasa al sistema. Facturas que se generan a mano.
              Leads que se pierden porque nadie hace seguimiento. Lo identificamos, lo priorizamos
              y lo automatizamos con herramientas reales: N8N, Make, Claude API.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => document.getElementById("cta-auto")?.scrollIntoView({behavior:"smooth"})} className="btn-primary">
                Identificar qué automatizar <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => document.getElementById("casos")?.scrollIntoView({behavior:"smooth"})} className="btn-secondary">
                Ver casos de uso reales
              </button>
            </motion.div>
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-12"
            style={{borderTop:"1px solid rgba(255,255,255,0.07)"}}>
            {[
              {num:"3.2h",label:"perdidas por empleado al día en tareas repetitivas"},
              {num:"42%",label:"de esas horas se pueden automatizar con herramientas actuales"},
              {num:"18h",label:"de media semanales que recuperan nuestros clientes"},
              {num:"Sin código",label:"N8N y Make no requieren programar"},
            ].map((s,i) => (
              <motion.div key={i} variants={fadeUp} className="text-center">
                <div className="text-2xl font-bold text-white mb-1" style={{letterSpacing:"-0.02em"}}>{s.num}</div>
                <div className="text-xs" style={{color:"rgba(255,255,255,0.35)"}}>{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* QUÉ AUTOMATIZAMOS */}
      <section className="py-16 md:py-24" style={{background:"rgba(255,255,255,0.015)",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
        <div className="mx-auto px-6 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={stagger}
            className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeUp}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{color:"#E8A24F",letterSpacing:"0.12em"}}>El enfoque</p>
              <h2 className="font-heading font-bold text-white mb-5" style={{fontSize:"clamp(1.6rem,4vw,2.5rem)",letterSpacing:"-0.02em",lineHeight:1.2}}>
                Primero el diagnóstico. Luego la automatización.
              </h2>
              <p className="text-sm leading-relaxed mb-4" style={{color:"rgba(255,255,255,0.55)"}}>
                Automatizar sin saber qué automatizar es el error más común. Antes de escribir
                una sola línea de flujo en N8N, mapeamos tus procesos reales, cuantificamos el
                impacto de cada uno y priorizamos por ROI. Sin diagnóstico, acabas automatizando
                lo urgente, no lo importante.
              </p>
              <p className="text-sm leading-relaxed" style={{color:"rgba(255,255,255,0.55)"}}>
                Trabajamos con las herramientas que ya tienes — o con las que tienen más sentido
                para tu caso — y entregamos flujos funcionando en producción, no demos que hay
                que adaptar.
              </p>
            </motion.div>
            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
              {[
                {label:"Agencias de automatización",items:["Venden herramientas, no soluciones","Flujos que no se adaptan a tu proceso","Sin criterio de seguridad","Sin seguimiento post-entrega"],bad:true},
                {label:"InspireAI",items:["Diagnóstico antes de implementar","N8N self-hosted: el código es tuyo","Seguridad validada en cada flujo","Monitorización incluida el primer mes"],bad:false},
              ].map((col,i) => (
                <div key={i} className="rounded-xl p-5" style={{background:i===0?"rgba(255,255,255,0.03)":"rgba(232,162,79,0.08)",border:i===0?"1px solid rgba(255,255,255,0.07)":"1px solid rgba(232,162,79,0.25)"}}>
                  <div className="text-xs font-semibold mb-4" style={{color:i===0?"rgba(255,255,255,0.35)":"#E8A24F",letterSpacing:"0.06em"}}>{col.label}</div>
                  {col.items.map((item,j) => (
                    <div key={j} className="flex items-start gap-2 mb-2.5 text-xs" style={{color:i===0?"rgba(255,255,255,0.4)":"rgba(255,255,255,0.75)"}}>
                      <span style={{color:i===0?"rgba(232,111,111,0.6)":"#3FB984",flexShrink:0}}>{i===0?"✗":"✓"}</span>{item}
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CASOS DE USO */}
      <section id="casos" className="py-16 md:py-24">
        <div className="mx-auto px-6 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={fadeUp} className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{color:"#E8A24F",letterSpacing:"0.12em"}}>Qué automatizamos</p>
            <h2 className="font-heading font-bold text-white mb-4" style={{fontSize:"clamp(1.5rem,4vw,2.5rem)",letterSpacing:"-0.02em"}}>
              Casos reales por área,<br />con herramientas reales
            </h2>
            <p style={{color:"rgba(255,255,255,0.45)",maxWidth:"500px",lineHeight:1.7}}>
              No hay una automatización genérica que sirva para todos. Estas son las más frecuentes entre nuestros clientes.
            </p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={stagger}
            className="grid md:grid-cols-2 gap-5">
            {[
              {icon:"💼",area:"Ventas y captación",color:"#818CF8",items:[
                "Seguimiento automático de leads sin respuesta (N8N + email/WhatsApp)",
                "Notificación al equipo cuando llega un lead web en menos de 2 min",
                "Propuestas generadas automáticamente desde formulario (Claude API)",
                "CRM actualizado tras cada interacción sin intervención manual",
              ]},
              {icon:"⚙️",area:"Operaciones y pedidos",color:"#E8A24F",items:[
                "Pedidos de WhatsApp → sistema de gestión sin tocar teclado (N8N + OCR)",
                "Albaranes y facturas generados automáticamente al confirmar entrega",
                "Alertas proactivas al cliente con estado de su pedido",
                "Inventario actualizado en tiempo real sin entrada manual",
              ]},
              {icon:"📋",area:"Administración",color:"#3FB984",items:[
                "Contratos generados desde plantilla al rellenar un formulario",
                "Recordatorios de renovación con 30/15/7 días de antelación",
                "Facturas de proveedores procesadas y categorizadas sin entrada manual",
                "Informes semanales generados y enviados automáticamente",
              ]},
              {icon:"📢",area:"Marketing y contenido",color:"#E86F6F",items:[
                "Publicación en múltiples portales desde una única fuente de datos",
                "Respuestas automáticas fuera de horario con contexto real del negocio",
                "Informes de rendimiento de campañas sin abrir dashboards manualmente",
                "Seguimiento de leads post-contenido sin trabajo manual",
              ]},
            ].map((c,i) => (
              <motion.div key={i} variants={fadeUp} className="rounded-2xl p-6" style={{background:"#0D0E1F",border:`1px solid ${c.color}20`}}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{c.icon}</span>
                  <h3 className="font-semibold text-white">{c.area}</h3>
                  <div className="ml-auto w-2 h-2 rounded-full" style={{background:c.color}} />
                </div>
                <div className="flex flex-col gap-2">
                  {c.items.map((item,j) => (
                    <div key={j} className="flex items-start gap-2 text-sm" style={{color:"rgba(255,255,255,0.55)"}}>
                      <span style={{color:c.color,flexShrink:0}}>→</span>{item}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={fadeUp} className="mt-8">
            <p className="text-xs uppercase tracking-widest mb-4 text-center" style={{color:"rgba(255,255,255,0.2)",letterSpacing:"0.1em"}}>Herramientas con las que trabajamos</p>
            <div className="flex flex-wrap justify-center gap-2.5">
              {["N8N (self-hosted)","Make","Claude API","OpenAI API","WhatsApp Business API","Google Workspace","Notion API","Holded","Signaturit","Stripe"].map(t => (
                <span key={t} className="px-3 py-1.5 rounded-full text-xs" style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.45)"}}>{t}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* PROCESO */}
      <section className="py-16 md:py-24" style={{background:"rgba(255,255,255,0.015)",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
        <div className="mx-auto px-6 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={fadeUp} className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{color:"#E8A24F",letterSpacing:"0.12em"}}>El proceso</p>
            <h2 className="font-heading font-bold text-white mb-4" style={{fontSize:"clamp(1.5rem,4vw,2.5rem)",letterSpacing:"-0.02em"}}>
              De cero a automatizaciones en producción
            </h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={stagger} className="flex flex-col gap-3">
            {[
              {n:"01",icon:"🔍",title:"Diagnóstico de procesos",time:"4–6 semanas",desc:"Primero mapeamos qué se hace a mano, cuánto cuesta en tiempo real y dónde está el ROI. Sin diagnóstico, automatizar es disparar a ciegas."},
              {n:"02",icon:"🗺️",title:"Diseño de flujos",time:"1–2 semanas",desc:"Mapeamos cada automatización como flujo de trabajo antes de construir nada. Incluye escenarios de error, dependencias y dónde necesita validación humana."},
              {n:"03",icon:"⚡",title:"Implementación y pruebas",time:"2–4 semanas",desc:"Construcción en N8N o Make. Pruebas en paralelo con los procesos actuales. Formación básica al equipo que lo va a usar. Nada se sube a producción sin test."},
              {n:"04",icon:"📊",title:"Monitorización y ajuste",time:"4 semanas",desc:"Las primeras semanas son críticas. Monitorizamos que los flujos funcionan en producción real y ajustamos lo necesario. Incluido en el precio de implementación."},
            ].map((s,i) => (
              <motion.div key={i} variants={fadeUp} className="rounded-xl p-5 flex gap-5 items-start" style={{background:"#0D0E1F",border:"1px solid rgba(255,255,255,0.07)"}}>
                <div className="w-11 h-11 rounded-xl grid place-items-center flex-shrink-0" style={{background:"rgba(232,162,79,0.1)",border:"1px solid rgba(232,162,79,0.25)"}}>
                  <span className="text-lg">{s.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold" style={{color:"rgba(232,162,79,0.7)",letterSpacing:"0.06em"}}>{s.n}</span>
                      <h3 className="font-semibold text-white text-sm">{s.title}</h3>
                    </div>
                    <span className="text-xs flex-shrink-0" style={{color:"rgba(255,255,255,0.25)"}}>{s.time}</span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{color:"rgba(255,255,255,0.5)"}}>{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* PROPUESTA */}
      <section className="py-16 md:py-20 border-t" style={{borderColor:"rgba(255,255,255,0.06)"}}>
        <div className="mx-auto px-6 max-w-3xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={stagger}>
            <motion.div variants={fadeUp} className="inline-flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-12" style={{background:"rgba(255,255,255,0.12)"}} />
              <span className="text-xs font-semibold uppercase tracking-widest" style={{color:"rgba(255,255,255,0.35)",letterSpacing:"0.12em"}}>Precio</span>
              <div className="h-px w-12" style={{background:"rgba(255,255,255,0.12)"}} />
            </motion.div>
            <motion.h2 variants={fadeUp} className="font-heading font-bold text-white mb-4"
              style={{fontSize:"clamp(1.5rem,3.5vw,2.25rem)",letterSpacing:"-0.02em"}}>
              Solicita una propuesta
            </motion.h2>
            <motion.p variants={fadeUp} className="mb-8" style={{color:"rgba(255,255,255,0.45)",lineHeight:1.7,maxWidth:"440px",margin:"0 auto 2rem"}}>
              El alcance y el precio se definen en la primera llamada, según vuestro caso concreto.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link href="/#contacto" className="btn-primary inline-flex items-center gap-2">
                Reservar llamada gratuita <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>


      {/* FAQ */}
      <section className="py-16 border-t" style={{borderColor:"rgba(255,255,255,0.06)"}}>
        <div className="mx-auto px-6 max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={fadeUp} className="mb-10">
            <h2 className="font-heading font-bold text-white" style={{fontSize:"clamp(1.4rem,3vw,2rem)",letterSpacing:"-0.02em"}}>Preguntas frecuentes</h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={stagger} className="flex flex-col gap-3">
            {[
              {q:"¿Necesitamos cambiar nuestro software actual?",a:"En la mayoría de casos, no. Trabajamos sobre vuestras herramientas existentes y las conectamos. Si hay una que claramente hay que sustituir, os lo decimos antes de cobrar nada."},
              {q:"¿Qué pasa si una automatización falla?",a:"Diseñamos todos los flujos con gestión de errores explícita: si algo falla, se notifica al responsable y el proceso vuelve al camino manual. Nunca automatizamos sin un fallback claro."},
              {q:"¿Cuánto tiempo tarda en verse el retorno?",a:"Los primeros flujos en producción suelen verse en 3–6 semanas tras el diagnóstico. El ahorro de tiempo es inmediato; el impacto económico suele ser medible en 1–3 meses."},
              {q:"¿Podemos empezar con una sola automatización?",a:"Sí. Tras el diagnóstico priorizamos las oportunidades por impacto y esfuerzo. Podemos empezar por las 2–3 que dan más resultado con menos inversión y ir ampliando."},
            ].map((f,i) => (
              <motion.details key={i} variants={fadeUp} className="rounded-xl overflow-hidden" style={{background:"#0D0E1F",border:"1px solid rgba(255,255,255,0.07)"}}>
                <summary className="px-5 py-4 cursor-pointer font-medium text-white text-sm select-none">{f.q}</summary>
                <div className="px-5 pb-4 text-sm leading-relaxed" style={{color:"rgba(255,255,255,0.55)"}}>{f.a}</div>
              </motion.details>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta-auto" className="py-20 md:py-28 border-t" style={{borderColor:"rgba(255,255,255,0.06)"}}>
        <div className="mx-auto px-6 max-w-2xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={stagger}>
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest mb-4" style={{color:"#E8A24F",letterSpacing:"0.12em"}}>Primera llamada sin coste</motion.p>
            <motion.h2 variants={fadeUp} className="font-heading font-bold text-white mb-5"
              style={{fontSize:"clamp(1.75rem,4vw,3rem)",letterSpacing:"-0.025em",lineHeight:1.1}}>
              Empieza por saber<br />qué merece la pena automatizar.
            </motion.h2>
            <motion.p variants={fadeUp} className="mb-8 text-lg" style={{color:"rgba(255,255,255,0.5)",lineHeight:1.7}}>
              Te decimos qué procesos tienen más impacto en tu sector y si tiene sentido avanzar con un diagnóstico completo.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link href="/#contacto" className="btn-primary inline-flex items-center gap-2">
                Reservar llamada gratuita <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <motion.p variants={fadeUp} className="mt-4 text-xs" style={{color:"rgba(255,255,255,0.2)"}}>Sin spam · Sin compromiso · Respuesta en menos de 24h</motion.p>
          </motion.div>
        </div>
      </section>

      <section className="py-10 border-t" style={{borderColor:"rgba(255,255,255,0.05)",background:"rgba(255,255,255,0.02)"}}>
        <div className="mx-auto px-6 max-w-5xl">
          <p className="text-xs uppercase tracking-widest mb-5 text-center" style={{color:"rgba(255,255,255,0.2)",letterSpacing:"0.1em"}}>Otros servicios</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[{href:"/consultoria-ia-empresas",label:"Consultoría IA"},{href:"/ciberseguridad-ia-empresas",label:"Ciberseguridad IA"},{href:"/formacion-ia-equipos",label:"CRM personalizado"}].map(l => (
              <Link key={l.href} href={l.href} className="rounded-xl px-4 py-3 text-sm font-medium text-center"
                style={{background:"#0D0E1F",border:"1px solid rgba(255,255,255,0.07)",color:"rgba(255,255,255,0.5)"}}>{l.label}</Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
