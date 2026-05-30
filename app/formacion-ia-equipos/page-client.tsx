"use client";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";
import LandingNav from "@/components/LandingNav";

export default function CRMPersonalizado() {
  const fadeUp = { hidden:{opacity:0,y:20}, visible:{opacity:1,y:0,transition:{duration:0.5,ease:[0.16,1,0.3,1]}} };
  const stagger = { hidden:{opacity:0}, visible:{opacity:1,transition:{staggerChildren:0.1}} };

  return (
    <div className="min-h-screen bg-dark text-white selection:bg-primary/30 selection:text-white">
      <LandingNav ctaLabel="Ver demo en vivo" ctaHref="https://crm-demo-inspireai.vercel.app" ctaExternal />

      <section className="relative pt-20 pb-20 md:pt-28 md:pb-28 overflow-hidden" style={{background:"#08091A"}}>
        <div className="absolute inset-0 pointer-events-none" style={{backgroundImage:"radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",backgroundSize:"28px 28px"}} />
        <div className="absolute inset-0 pointer-events-none" style={{background:"radial-gradient(ellipse 80% 50% at 50% -10%, rgba(91,98,244,0.2) 0%, transparent 70%)"}} />
        <div className="mx-auto px-6 max-w-5xl relative z-10">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8"
              style={{background:"rgba(91,98,244,0.1)",color:"#818CF8",border:"1px solid rgba(91,98,244,0.3)",letterSpacing:"0.1em",textTransform:"uppercase"}}>
              ✦ Servicio independiente · CRM a medida
            </motion.div>
            <motion.h1 variants={fadeUp} className="font-heading font-bold text-white mb-6"
              style={{fontSize:"clamp(2.2rem,5.5vw,4rem)",lineHeight:1.08,letterSpacing:"-0.025em",maxWidth:"800px",margin:"0 auto 1.5rem"}}>
              Deja de adaptar tu empresa al CRM.
              <br /><span style={{color:"#818CF8"}}>El CRM se adapta a ti.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-xl mb-10 mx-auto" style={{color:"rgba(255,255,255,0.55)",lineHeight:1.7,maxWidth:"600px"}}>
              Salesforce, HubSpot, Pipedrive — pensados para todas las empresas, por eso no se adaptan bien a ninguna.
              Construimos el CRM exacto para tu proceso de ventas: con tu marca, en tu dominio, con tu terminología.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://crm-demo-inspireai.vercel.app" target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2">
                Ver demo en vivo <ArrowRight className="w-4 h-4" />
              </a>
              <button onClick={() => document.getElementById("cta-crm")?.scrollIntoView({behavior:"smooth"})} className="btn-secondary">
                Quiero mi CRM propio
              </button>
            </motion.div>
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-12" style={{borderTop:"1px solid rgba(255,255,255,0.07)"}}>
            {[
              {num:"0€",label:"de licencia mensual por usuario — es tuyo"},
              {num:"100%",label:"adaptado a tu proceso, nomenclatura y equipo"},
              {num:"Tu dominio",label:"crm.tuempresa.com desde el día 1"},
              {num:"Demo real",label:"puedes verlo funcionando ahora mismo"},
            ].map((s,i) => (
              <motion.div key={i} variants={fadeUp} className="text-center">
                <div className="text-2xl font-bold text-white mb-1" style={{letterSpacing:"-0.02em"}}>{s.num}</div>
                <div className="text-xs" style={{color:"rgba(255,255,255,0.35)"}}>{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* COMPARATIVA */}
      <section className="py-16 md:py-24" style={{background:"rgba(255,255,255,0.015)",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
        <div className="mx-auto px-6 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={stagger} className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeUp}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{color:"#818CF8",letterSpacing:"0.12em"}}>El problema</p>
              <h2 className="font-heading font-bold text-white mb-5" style={{fontSize:"clamp(1.6rem,4vw,2.5rem)",letterSpacing:"-0.02em",lineHeight:1.2}}>
                Con un CRM genérico, tú te adaptas a la herramienta. No al revés.
              </h2>
              <p className="text-sm leading-relaxed mb-4" style={{color:"rgba(255,255,255,0.55)"}}>
                Pasas semanas configurando etapas que no encajan con tu proceso. Usas el 15% de las
                funcionalidades y pagas el 100% del precio. Tu equipo lo usa a regañadientes porque
                no tiene sentido para cómo trabajáis realmente.
              </p>
              <p className="text-sm leading-relaxed" style={{color:"rgba(255,255,255,0.55)"}}>
                Un CRM a medida parte de cómo funciona tu empresa — no de un template — y se construye
                para que tu equipo lo use de verdad desde el primer día.
              </p>
            </motion.div>
            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
              {[
                {label:"CRM genérico (HubSpot / Salesforce)",items:["€200–500/usuario/mes","80% de funciones que no usas","Te adaptas tú al sistema","Datos en sus servidores"],bad:true},
                {label:"CRM a medida — InspireAI",items:["Sin licencias por usuario","Solo lo que necesitas, nada más","El sistema se adapta a ti","Tu base de datos, tu código"],bad:false},
              ].map((col,i) => (
                <div key={i} className="rounded-xl p-5" style={{background:i===0?"rgba(255,255,255,0.03)":"rgba(91,98,244,0.1)",border:i===0?"1px solid rgba(255,255,255,0.07)":"1px solid rgba(91,98,244,0.3)"}}>
                  <div className="text-xs font-semibold mb-4" style={{color:i===0?"rgba(255,255,255,0.35)":"#818CF8",letterSpacing:"0.06em"}}>{col.label}</div>
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

      {/* FUNCIONALIDADES */}
      <section className="py-16 md:py-24">
        <div className="mx-auto px-6 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={fadeUp} className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{color:"#818CF8",letterSpacing:"0.12em"}}>Qué incluye</p>
            <h2 className="font-heading font-bold text-white mb-4" style={{fontSize:"clamp(1.5rem,4vw,2.5rem)",letterSpacing:"-0.02em"}}>
              Lo que tiene el tuyo, adaptado<br />a cómo trabaja tu empresa
            </h2>
            <p style={{color:"rgba(255,255,255,0.45)",maxWidth:"500px",lineHeight:1.7}}>No es una plantilla que adaptamos. Es una aplicación construida desde cero para tu modelo de negocio.</p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={stagger} className="grid md:grid-cols-2 gap-5">
            {[
              {icon:"📊",title:"Dashboard en tiempo real",desc:"KPIs de tu negocio actualizados al instante: revenue, deals activos, close rate, ticket medio. Las métricas que decides que importan, no las que vienen por defecto.",color:"#818CF8"},
              {icon:"🗂️",title:"Pipeline Kanban personalizado",desc:"Las etapas de tu proceso de ventas, con tu terminología. Arrastra deals entre fases con drag & drop. Las columnas las defines tú.",color:"#4F6FE8"},
              {icon:"🔍",title:"Diagnósticos de clientes",desc:"Si ofreces auditorías o servicios de diagnóstico, el CRM gestiona el estado de cada área, guarda cuestionarios y vincula el entregable.",color:"#3FA7A0"},
              {icon:"🔔",title:"Notificaciones automáticas",desc:"Cuando llega un lead desde tu web o un cliente completa un cuestionario, os llega un email al momento a todo el equipo. Sin revisar el CRM manualmente.",color:"#E8A24F"},
              {icon:"👥",title:"Multi-usuario para el equipo",desc:"Cada persona tiene su propio acceso. El sistema muestra quién es responsable de cada contacto y oportunidad.",color:"#818CF8"},
              {icon:"🔗",title:"Conectado a tu web",desc:"El formulario de tu web crea automáticamente el lead en el CRM. Los cuestionarios guardan las respuestas directamente. Sin pasos manuales.",color:"#3FB984"},
            ].map((c,i) => (
              <motion.div key={i} variants={fadeUp} className="rounded-2xl p-6 flex gap-4" style={{background:"#0D0E1F",border:`1px solid ${c.color}20`}}>
                <div className="text-2xl flex-shrink-0">{c.icon}</div>
                <div>
                  <h3 className="font-semibold text-white mb-2 text-sm">{c.title}</h3>
                  <p className="text-sm leading-relaxed" style={{color:"rgba(255,255,255,0.5)"}}>{c.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* DEMO SCREENSHOT */}
      <section className="py-12 border-t border-b" style={{borderColor:"rgba(255,255,255,0.06)",background:"rgba(255,255,255,0.015)"}}>
        <div className="mx-auto px-6 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={fadeUp}>
            <div className="rounded-2xl overflow-hidden" style={{background:"#0A0A1A",border:"1px solid rgba(255,255,255,0.1)",boxShadow:"0 24px 60px -12px rgba(0,0,0,0.7)"}}>
              <div className="flex items-center gap-2 px-4 py-3 border-b" style={{background:"#111122",borderColor:"rgba(255,255,255,0.07)"}}>
                <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full" style={{background:"#E86F6F"}}/><div className="w-3 h-3 rounded-full" style={{background:"#E8A24F"}}/><div className="w-3 h-3 rounded-full" style={{background:"#3FB984"}}/></div>
                <div className="flex-1 flex justify-center">
                  <div className="flex items-center gap-2 px-3 py-1 rounded text-xs" style={{background:"rgba(255,255,255,0.05)",color:"rgba(255,255,255,0.3)"}}>
                    🔒 crm.tuempresa.com
                  </div>
                </div>
              </div>
              <img src="/crm-dashboard.png" alt="Demo CRM a medida — InspireAI" className="w-full" style={{display:"block",objectFit:"cover",objectPosition:"top",maxHeight:"420px"}} />
            </div>
            <p className="text-center mt-4 text-xs" style={{color:"rgba(255,255,255,0.25)"}}>
              Demo real del CRM · datos ficticios ·{" "}
              <a href="https://crm-demo-inspireai.vercel.app" target="_blank" rel="noopener noreferrer" style={{color:"#818CF8"}}>Abrirlo en vivo →</a>
            </p>
          </motion.div>
        </div>
      </section>

      {/* GARANTÍAS */}
      <section className="py-16 md:py-24">
        <div className="mx-auto px-6 max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={fadeUp} className="text-center mb-10">
            <h2 className="font-heading font-bold text-white mb-3" style={{fontSize:"clamp(1.5rem,4vw,2.25rem)",letterSpacing:"-0.02em"}}>
              El precio se define en la primera llamada
            </h2>
            <p style={{color:"rgba(255,255,255,0.45)",maxWidth:"500px",margin:"0 auto",lineHeight:1.7}}>
              Cada CRM es diferente porque cada empresa es diferente. El alcance y el precio se definen juntos, tras entender vuestro proceso real.
            </p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={stagger} className="grid md:grid-cols-3 gap-5">
            {[
              {icon:"🎯",title:"Diagnóstico que se recupera",desc:"Si tenéis el Inspire Cyber 360, el coste del diagnóstico se descuenta íntegramente del desarrollo del CRM si lo contratáis en los 30 días siguientes.",color:"#818CF8"},
              {icon:"🔓",title:"Sin lock-in",desc:"El código es vuestro. Está en vuestro repositorio de GitHub. Podéis llevarlo a cualquier desarrollador sin depender de nosotros.",color:"#3FB984"},
              {icon:"📋",title:"Propuesta sin compromiso",desc:"Primera llamada para entender vuestro proceso. Os enviamos una propuesta con funcionalidades y precio antes de comprometeros a nada.",color:"#E8A24F"},
            ].map((c,i) => (
              <motion.div key={i} variants={fadeUp} className="rounded-2xl p-6" style={{background:"#0D0E1F",border:`1px solid ${c.color}25`}}>
                <div className="text-2xl mb-4">{c.icon}</div>
                <h3 className="font-semibold text-white mb-2">{c.title}</h3>
                <p className="text-sm leading-relaxed" style={{color:"rgba(255,255,255,0.5)"}}>{c.desc}</p>
              </motion.div>
            ))}
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
              {q:"¿Cuánto tiempo tardáis en construirlo?",a:"Entre 4 y 8 semanas desde el kickoff, dependiendo de la complejidad. El proceso incluye una fase de diseño con vosotros (etapas, campos, usuarios) antes de empezar a desarrollar."},
              {q:"¿Podemos añadir funcionalidades después?",a:"Sí. El código está diseñado para escalar. Podemos añadir módulos en cualquier momento. Cada nueva funcionalidad tiene su propio presupuesto."},
              {q:"¿Qué pasa si queremos cambiar de proveedor?",a:"El código es vuestro. Está en vuestro repositorio de GitHub y podéis llevarlo a cualquier desarrollador. No hay lock-in. Lo mismo con los datos: están en vuestra base de datos, exportable en cualquier momento."},
              {q:"¿Funciona en móvil?",a:"Sí. El CRM es responsive y está optimizado para cualquier dispositivo. El pipeline, los diagnósticos y las notificaciones funcionan igual en móvil que en escritorio."},
            ].map((f,i) => (
              <motion.details key={i} variants={fadeUp} className="rounded-xl overflow-hidden" style={{background:"#0D0E1F",border:"1px solid rgba(255,255,255,0.07)"}}>
                <summary className="px-5 py-4 cursor-pointer font-medium text-white text-sm select-none">{f.q}</summary>
                <div className="px-5 pb-4 text-sm leading-relaxed" style={{color:"rgba(255,255,255,0.55)"}}>{f.a}</div>
              </motion.details>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="cta-crm" className="py-20 md:py-28 border-t" style={{borderColor:"rgba(255,255,255,0.06)"}}>
        <div className="mx-auto px-6 max-w-2xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={stagger}>
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest mb-4" style={{color:"#818CF8",letterSpacing:"0.12em"}}>Primera llamada sin coste</motion.p>
            <motion.h2 variants={fadeUp} className="font-heading font-bold text-white mb-5"
              style={{fontSize:"clamp(1.75rem,4vw,3rem)",letterSpacing:"-0.025em",lineHeight:1.1}}>
              Cuéntanos cómo es<br />tu proceso de ventas.
            </motion.h2>
            <motion.p variants={fadeUp} className="mb-8 text-lg" style={{color:"rgba(255,255,255,0.5)",lineHeight:1.7}}>
              Entendemos qué necesitáis, os mostramos la demo en vivo y os damos un presupuesto orientativo. Sin compromiso.
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
            <motion.p variants={fadeUp} className="mt-4 text-xs" style={{color:"rgba(255,255,255,0.2)"}}>Sin spam · Sin compromiso · Respuesta en menos de 24h</motion.p>
          </motion.div>
        </div>
      </section>

      <section className="py-10 border-t" style={{borderColor:"rgba(255,255,255,0.05)",background:"rgba(255,255,255,0.02)"}}>
        <div className="mx-auto px-6 max-w-5xl">
          <p className="text-xs uppercase tracking-widest mb-5 text-center" style={{color:"rgba(255,255,255,0.2)",letterSpacing:"0.1em"}}>Otros servicios</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[{href:"/consultoria-ia-empresas",label:"Consultoría IA"},{href:"/automatizacion-procesos-ia",label:"Automatización"},{href:"/ciberseguridad-ia-empresas",label:"Ciberseguridad IA"}].map(l => (
              <Link key={l.href} href={l.href} className="rounded-xl px-4 py-3 text-sm font-medium text-center"
                style={{background:"#0D0E1F",border:"1px solid rgba(255,255,255,0.07)",color:"rgba(255,255,255,0.5)"}}>{l.label}</Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
