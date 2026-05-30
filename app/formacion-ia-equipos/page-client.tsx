"use client";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function CRMPersonalizado() {
  const fadeUp = { hidden:{ opacity:0, y:20 }, visible:{ opacity:1, y:0, transition:{ duration:0.5, ease:[0.16,1,0.3,1] } } };
  const stagger = { hidden:{ opacity:0 }, visible:{ opacity:1, transition:{ staggerChildren:0.1 } } };

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
          <a href="https://crm-demo-inspireai.vercel.app" target="_blank" rel="noopener noreferrer"
            className="btn-primary-sm hidden md:flex">Ver demo en vivo</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden" style={{ background:"#08091A" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage:"radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize:"28px 28px" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background:"radial-gradient(ellipse 70% 40% at 50% -10%, rgba(91,98,244,0.2) 0%, transparent 70%)" }} />
        <div className="mx-auto px-6 max-w-4xl relative z-10">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6"
              style={{ background:"rgba(91,98,244,0.1)", color:"#818CF8", border:"1px solid rgba(91,98,244,0.25)", letterSpacing:"0.08em", textTransform:"uppercase" }}>
              Servicio independiente · CRM a medida
            </motion.div>
            <motion.h1 variants={fadeUp} className="font-heading font-bold text-white mb-6"
              style={{ fontSize:"clamp(2rem,5vw,3.5rem)", lineHeight:1.1, letterSpacing:"-0.02em" }}>
              Tu propio CRM,<br />
              <span style={{ color:"#818CF8" }}>sin pagar por Salesforce</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg mb-8 max-w-2xl" style={{ color:"rgba(255,255,255,0.6)", lineHeight:1.7 }}>
              Salesforce, HubSpot, Pipedrive — herramientas potentes pero caras, complejas
              y pensadas para todos. Construimos el CRM exacto que necesita tu empresa:
              con tu marca, conectado a tu web, adaptado a tu proceso de ventas.
              Sin licencias por usuario. Sin funciones que no usarás.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
              <a href="https://crm-demo-inspireai.vercel.app" target="_blank" rel="noopener noreferrer" className="btn-primary">
                Ver demo en vivo <ArrowRight className="w-4 h-4" />
              </a>
              <button onClick={() => document.getElementById("cta-crm")?.scrollIntoView({ behavior:"smooth" })} className="btn-secondary">
                Quiero mi CRM propio
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* El problema con los CRM genéricos */}
      <section className="py-16 md:py-20" style={{ background:"rgba(255,255,255,0.02)", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
        <div className="mx-auto px-6 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={stagger}
            className="grid md:grid-cols-3 gap-5">
            {[
              { num:"€200–500", label:"por usuario y mes en Salesforce Enterprise. Para un equipo de 10: hasta 60.000€/año en licencias.", color:"#E86F6F" },
              { num:"80%", label:"de las funciones de un CRM estándar no las usa nunca una PYME. Pero las pagas igual.", color:"#E8A24F" },
              { num:"6 meses", label:"de media tarda un equipo en adaptar un CRM genérico a su proceso real. Si lo consiguen.", color:"#818CF8" },
            ].map((s,i) => (
              <motion.div key={i} variants={fadeUp} className="rounded-2xl p-6" style={{ background:"#0D0E1F", border:`1px solid ${s.color}25` }}>
                <div className="text-4xl font-bold mb-3" style={{ color:s.color, letterSpacing:"-0.04em" }}>{s.num}</div>
                <p className="text-sm leading-relaxed" style={{ color:"rgba(255,255,255,0.5)" }}>{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Qué incluye */}
      <section className="py-16 md:py-24">
        <div className="mx-auto px-6 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={fadeUp} className="mb-12">
            <h2 className="font-heading font-bold text-white mb-3" style={{ fontSize:"clamp(1.5rem,4vw,2.5rem)", letterSpacing:"-0.02em" }}>
              Qué incluye tu CRM
            </h2>
            <p style={{ color:"rgba(255,255,255,0.45)", maxWidth:"520px", lineHeight:1.7 }}>
              No es una plantilla que adaptamos. Es una aplicación construida desde cero
              para tu modelo de negocio, desplegada en tu propio dominio.
            </p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={stagger}
            className="grid md:grid-cols-2 gap-5">
            {[
              { icon:"📊", title:"Dashboard en tiempo real", desc:"KPIs de tu negocio actualizados al instante: revenue, deals activos, close rate, ticket medio. No métricas genéricas — las que tú decides que importan.", color:"#818CF8" },
              { icon:"🗂️", title:"Pipeline Kanban personalizado", desc:"Las etapas de tu proceso de ventas, con tu terminología. Arrastra deals entre fases con drag & drop. Visible en ordenador y móvil.", color:"#4F6FE8" },
              { icon:"🔍", title:"Diagnósticos de clientes", desc:"Si ofreces auditorías o servicios de diagnóstico, el CRM gestiona el estado de cada área auditada, guarda las respuestas de los cuestionarios y vincula el entregable de Notion.", color:"#3FA7A0" },
              { icon:"🔔", title:"Notificaciones automáticas", desc:"Cuando llega un lead desde tu web o un cliente completa un cuestionario, os llega un email al momento a todo el equipo. Sin revisar el CRM manualmente.", color:"#E8A24F" },
              { icon:"👥", title:"Multi-usuario para el equipo", desc:"Cada socio o comercial tiene su propio acceso. El sistema identifica quién hizo qué y muestra el responsable de cada contacto y oportunidad.", color:"#818CF8" },
              { icon:"🔗", title:"Conectado a tu web", desc:"El formulario de contacto de tu web crea automáticamente el lead en el CRM. Los cuestionarios de diagnóstico guardan las respuestas directamente. Sin pasos manuales.", color:"#3FB984" },
            ].map((c,i) => (
              <motion.div key={i} variants={fadeUp} className="rounded-2xl p-6 flex gap-4"
                style={{ background:"#0D0E1F", border:`1px solid ${c.color}20` }}>
                <div className="text-2xl flex-shrink-0">{c.icon}</div>
                <div>
                  <h3 className="font-semibold text-white mb-2 text-sm">{c.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color:"rgba(255,255,255,0.5)" }}>{c.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Demo screenshot */}
      <section className="py-12 border-t border-b" style={{ borderColor:"rgba(255,255,255,0.05)", background:"rgba(255,255,255,0.02)" }}>
        <div className="mx-auto px-6 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={fadeUp}>
            <div className="rounded-2xl overflow-hidden" style={{ background:"#0A0A1A", border:"1px solid rgba(255,255,255,0.1)", boxShadow:"0 24px 60px -12px rgba(0,0,0,0.7)" }}>
              <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ background:"#111122", borderColor:"rgba(255,255,255,0.07)" }}>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background:"#E86F6F" }}/>
                  <div className="w-3 h-3 rounded-full" style={{ background:"#E8A24F" }}/>
                  <div className="w-3 h-3 rounded-full" style={{ background:"#3FB984" }}/>
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="flex items-center gap-2 px-3 py-1 rounded text-xs" style={{ background:"rgba(255,255,255,0.05)", color:"rgba(255,255,255,0.3)" }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    crm.tuempresa.es
                  </div>
                </div>
              </div>
              <img src="/crm-dashboard.png" alt="Demo CRM InspireAI — dashboard personalizado"
                className="w-full" style={{ display:"block", objectFit:"cover", objectPosition:"top", maxHeight:"420px" }} />
            </div>
            <p className="text-center mt-4 text-xs" style={{ color:"rgba(255,255,255,0.25)" }}>
              Demo real del CRM — datos ficticios · <a href="https://crm-demo-inspireai.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color:"#818CF8" }}>Abrirlo en vivo →</a>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stack tecnológico */}
      <section className="py-16 md:py-24">
        <div className="mx-auto px-6 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={stagger}
            className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div variants={fadeUp}>
              <h2 className="font-heading font-bold text-white mb-4" style={{ fontSize:"clamp(1.5rem,3vw,2.25rem)", letterSpacing:"-0.02em" }}>
                Construido con tecnología de última generación
              </h2>
              <p className="mb-5 text-sm leading-relaxed" style={{ color:"rgba(255,255,255,0.55)" }}>
                No es WordPress con plugins. Es una aplicación web moderna, rápida y segura,
                desplegada en tu propio dominio, con tu base de datos privada y actualizaciones
                en tiempo real. Sin terceros que tengan tus datos de clientes.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  "Next.js 14 + TypeScript — rápido, seguro y responsive",
                  "Supabase — base de datos privada con RLS y realtime",
                  "Vercel — desplegado en tu dominio con SSL incluido",
                  "Brevo — notificaciones de leads al instante al equipo",
                  "Código 100% vuestro — sin dependencia de nosotros",
                ].map((item,i) => (
                  <div key={i} className="flex items-start gap-3 text-sm" style={{ color:"rgba(255,255,255,0.65)" }}>
                    <div className="w-5 h-5 rounded-full grid place-items-center flex-shrink-0 mt-0.5"
                      style={{ background:"rgba(91,98,244,0.2)", border:"1px solid rgba(91,98,244,0.4)" }}>
                      <Check style={{ width:10, height:10, color:"#818CF8" }} />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div variants={fadeUp} className="rounded-2xl p-7" style={{ background:"#0D0E1F", border:"1px solid rgba(255,255,255,0.08)" }}>
              <h3 className="font-semibold text-white mb-4">¿Qué lo diferencia de HubSpot?</h3>
              <div className="flex flex-col gap-3">
                {[
                  ["Sin licencias por usuario","HubSpot: desde 90€/usuario/mes"],
                  ["Adaptado a tu proceso","HubSpot: tú te adaptas a él"],
                  ["Tus datos en tu servidor","HubSpot: en los suyos"],
                  ["Pipeline a tu medida","HubSpot: etapas genéricas"],
                  ["Conectado a tu web","HubSpot: requiere integración"],
                  ["Código que es tuyo","HubSpot: te va la suscripción"],
                ].map(([pro, contra]) => (
                  <div key={pro} className="grid grid-cols-2 gap-3 py-2.5 border-b text-xs" style={{ borderColor:"rgba(255,255,255,0.05)" }}>
                    <div className="flex items-center gap-2" style={{ color:"rgba(255,255,255,0.7)" }}>
                      <span style={{ color:"#3FB984" }}>✓</span> {pro}
                    </div>
                    <div style={{ color:"rgba(255,255,255,0.3)" }}>{contra}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Precio */}
      <section className="py-16 md:py-20" style={{ background:"rgba(255,255,255,0.02)", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
        <div className="mx-auto px-6 max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={stagger}
            className="grid md:grid-cols-2 gap-6">
            <motion.div variants={fadeUp} className="rounded-2xl p-8" style={{ background:"#0D0E1F", border:"1px solid rgba(255,255,255,0.08)" }}>
              <div className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color:"rgba(255,255,255,0.35)", letterSpacing:"0.1em" }}>CRM a medida</div>
              <div className="text-4xl font-bold text-white mb-1" style={{ letterSpacing:"-0.03em" }}>3.500€ – 8.000€</div>
              <div className="text-sm mb-5" style={{ color:"rgba(255,255,255,0.4)" }}>según funcionalidades y complejidad</div>
              <div className="flex flex-col gap-3 mb-6">
                {["Dominio propio (crm.tuempresa.com)","Base de datos privada","Pipeline adaptado a tu proceso","Usuarios ilimitados sin coste adicional","Conectado a tu web y formularios","Formación para el equipo incluida","Sin cuota mensual de licencia"].map((f,i) => (
                  <div key={i} className="flex items-center gap-2 text-sm" style={{ color:"rgba(255,255,255,0.65)" }}>
                    <Check style={{ width:14, height:14, color:"#818CF8" }} />{f}
                  </div>
                ))}
              </div>
              <button onClick={() => document.getElementById("cta-crm")?.scrollIntoView({ behavior:"smooth" })}
                className="btn-primary w-full">Quiero mi CRM <ArrowRight className="w-4 h-4" /></button>
            </motion.div>
            <motion.div variants={fadeUp} className="rounded-2xl p-8 flex flex-col gap-5" style={{ background:"linear-gradient(135deg,rgba(91,98,244,0.12),rgba(91,98,244,0.03))", border:"1px solid rgba(91,98,244,0.3)" }}>
              <div>
                <div className="font-semibold text-white mb-2">Si contratas el Inspire Cyber 360 primero</div>
                <p className="text-sm leading-relaxed" style={{ color:"rgba(255,255,255,0.5)" }}>
                  El diagnóstico identifica exactamente qué necesita tu CRM. Si lo contratas
                  dentro de los 30 días siguientes, el coste del diagnóstico se descuenta
                  íntegramente del desarrollo.
                </p>
              </div>
              <div>
                <div className="font-semibold text-white mb-2">¿Necesitáis mantenimiento?</div>
                <p className="text-sm leading-relaxed" style={{ color:"rgba(255,255,255,0.5)" }}>
                  Ofrecemos soporte mensual opcional para mejoras, nuevas funcionalidades e
                  integraciones. El código es vuestro y podéis llevar el mantenimiento con
                  cualquier desarrollador si lo preferís.
                </p>
              </div>
              <a href="https://crm-demo-inspireai.vercel.app" target="_blank" rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center justify-center gap-2 mt-auto">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>
                Ver demo en vivo
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 border-t" style={{ borderColor:"rgba(255,255,255,0.05)" }}>
        <div className="mx-auto px-6 max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={fadeUp} className="mb-8">
            <h2 className="font-heading font-bold text-white" style={{ fontSize:"clamp(1.4rem,3vw,2rem)", letterSpacing:"-0.02em" }}>Preguntas frecuentes</h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={stagger} className="flex flex-col gap-3">
            {[
              { q:"¿Cuánto tiempo tardáis en construirlo?", a:"Entre 4 y 8 semanas desde el kickoff, dependiendo de la complejidad. El proceso incluye una fase de diseño con vosotros (etapas, campos, usuarios) antes de empezar a desarrollar. No construimos sin tener claro qué necesitáis." },
              { q:"¿Podemos añadir funcionalidades después?", a:"Sí. El código está diseñado para escalar. Podemos añadir módulos (facturación, informes avanzados, integraciones con ERPs...) en cualquier momento. Cada nueva funcionalidad tiene su propio presupuesto." },
              { q:"¿Qué pasa si queremos cambiar de proveedor?", a:"El código es vuestro. Está en vuestro repositorio de GitHub y podéis llevarlo a cualquier desarrollador. No hay lock-in. Lo mismo con los datos: están en vuestra base de datos de Supabase, exportable en cualquier momento." },
              { q:"¿Funciona en móvil?", a:"Sí. El CRM es responsive y está optimizado para usar en cualquier dispositivo. El pipeline, los diagnósticos y las notificaciones funcionan igual en móvil que en escritorio." },
            ].map((f,i) => (
              <motion.details key={i} variants={fadeUp} className="rounded-xl overflow-hidden" style={{ background:"#0D0E1F", border:"1px solid rgba(255,255,255,0.07)" }}>
                <summary className="px-5 py-4 cursor-pointer font-medium text-white text-sm">{f.q}</summary>
                <div className="px-5 pb-4 text-sm leading-relaxed" style={{ color:"rgba(255,255,255,0.55)" }}>{f.a}</div>
              </motion.details>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta-crm" className="py-16 md:py-24 border-t" style={{ borderColor:"rgba(255,255,255,0.05)" }}>
        <div className="mx-auto px-6 max-w-2xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="font-heading font-bold text-white mb-4"
              style={{ fontSize:"clamp(1.75rem,4vw,2.75rem)", letterSpacing:"-0.02em" }}>
              Cuéntanos cómo es tu proceso de ventas
            </motion.h2>
            <motion.p variants={fadeUp} className="mb-8" style={{ color:"rgba(255,255,255,0.5)", lineHeight:1.7 }}>
              En 30 minutos entendemos qué necesitáis, os mostramos la demo en vivo y
              os damos un presupuesto orientativo. Sin compromiso.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/#contacto" className="btn-primary inline-flex items-center gap-2">
                Reservar llamada gratuita <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="https://crm-demo-inspireai.vercel.app" target="_blank" rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center gap-2">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>
                Ver demo primero
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-10 border-t" style={{ borderColor:"rgba(255,255,255,0.05)", background:"rgba(255,255,255,0.02)" }}>
        <div className="mx-auto px-6 max-w-5xl">
          <p className="text-xs uppercase tracking-widest mb-5 text-center" style={{ color:"rgba(255,255,255,0.25)", letterSpacing:"0.1em" }}>Otros servicios</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { href:"/consultoria-ia-empresas", label:"Consultoría IA para empresas" },
              { href:"/automatizacion-procesos-ia", label:"Automatización de procesos" },
              { href:"/ciberseguridad-ia-empresas", label:"Ciberseguridad IA" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="rounded-xl px-4 py-3 text-sm font-medium text-center transition-colors"
                style={{ background:"#0D0E1F", border:"1px solid rgba(255,255,255,0.07)", color:"rgba(255,255,255,0.55)" }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
