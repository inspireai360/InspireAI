"use client";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";
import LandingNav from "@/components/LandingNav";

export default function CiberseguridadIA() {
  const fadeUp = { hidden:{opacity:0,y:20}, visible:{opacity:1,y:0,transition:{duration:0.5,ease:[0.16,1,0.3,1]}} };
  const stagger = { hidden:{opacity:0}, visible:{opacity:1,transition:{staggerChildren:0.1}} };

  return (
    <div className="min-h-screen bg-dark text-white selection:bg-primary/30 selection:text-white">
      <LandingNav ctaLabel="Solicitar análisis" onCtaClick={() => document.getElementById("cta-ciber")?.scrollIntoView({behavior:"smooth"})} />

      <section className="relative pt-20 pb-20 md:pt-28 md:pb-28 overflow-hidden" style={{background:"#08091A"}}>
        <div className="absolute inset-0 pointer-events-none" style={{backgroundImage:"radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",backgroundSize:"28px 28px"}} />
        <div className="absolute inset-0 pointer-events-none" style={{background:"radial-gradient(ellipse 80% 50% at 50% -10%, rgba(232,111,111,0.15) 0%, transparent 70%)"}} />
        <div className="mx-auto px-6 max-w-5xl relative z-10">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8"
              style={{background:"rgba(232,111,111,0.1)",color:"#E86F6F",border:"1px solid rgba(232,111,111,0.3)",letterSpacing:"0.1em",textTransform:"uppercase"}}>
              ✦ Ciberseguridad en proyectos de IA
            </motion.div>
            <motion.h1 variants={fadeUp} className="font-heading font-bold text-white mb-6"
              style={{fontSize:"clamp(2rem,5.5vw,3.75rem)",lineHeight:1.1,letterSpacing:"-0.025em",maxWidth:"820px",margin:"0 auto 1.5rem"}}>
              Automatizar sin revisar la seguridad
              <br /><span style={{color:"#E86F6F"}}>es abrir puertas que no sabes que existen.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-xl mb-10 mx-auto" style={{color:"rgba(255,255,255,0.55)",lineHeight:1.7,maxWidth:"580px"}}>
              El 60% de las brechas en PYMEs vienen de integraciones de IA mal configuradas.
              No de hackers sofisticados — de APIs sin autenticación, datos sin cifrar y permisos que nadie revisó.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => document.getElementById("cta-ciber")?.scrollIntoView({behavior:"smooth"})} className="btn-primary">
                Solicitar análisis de seguridad <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => document.getElementById("vulnerabilidades")?.scrollIntoView({behavior:"smooth"})} className="btn-secondary">
                Ver qué encontramos
              </button>
            </motion.div>
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-12" style={{borderTop:"1px solid rgba(255,255,255,0.07)"}}>
            {[
              {num:"60%",label:"de brechas en PYMEs vienen de integraciones mal configuradas"},
              {num:"80%",label:"de proyectos de IA que revisamos tienen al menos una vulnerabilidad crítica"},
              {num:"0€",label:"coste de prevenir una brecha vs miles en recuperación y sanciones RGPD"},
              {num:"Incluido",label:"en el Inspire Cyber 360 — no es un servicio de relleno"},
            ].map((s,i) => (
              <motion.div key={i} variants={fadeUp} className="text-center">
                <div className="text-2xl font-bold text-white mb-1" style={{letterSpacing:"-0.02em"}}>{s.num}</div>
                <div className="text-xs" style={{color:"rgba(255,255,255,0.35)"}}>{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ENFOQUE */}
      <section className="py-16 md:py-24" style={{background:"rgba(255,255,255,0.015)",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
        <div className="mx-auto px-6 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={stagger} className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeUp}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{color:"#E86F6F",letterSpacing:"0.12em"}}>El enfoque</p>
              <h2 className="font-heading font-bold text-white mb-5" style={{fontSize:"clamp(1.6rem,4vw,2.5rem)",letterSpacing:"-0.02em",lineHeight:1.2}}>
                No es un checklist genérico. Es una revisión real de tus integraciones.
              </h2>
              <p className="text-sm leading-relaxed mb-4" style={{color:"rgba(255,255,255,0.55)"}}>
                Muchas consultoras hacen una "auditoría de seguridad" revisando si tienes antivirus y HTTPS.
                Nosotros revisamos lo que de verdad importa cuando usas IA: qué acceso tienen tus integraciones,
                dónde van los datos de tus clientes, qué pasa si un flujo de N8N se ejecuta con credenciales expuestas.
              </p>
              <p className="text-sm leading-relaxed" style={{color:"rgba(255,255,255,0.55)"}}>
                Este análisis es parte del Inspire Cyber 360 y también se puede contratar de forma independiente
                si ya tienes automatizaciones activas y quieres revisarlas.
              </p>
            </motion.div>
            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
              {[
                {label:"Auditorías genéricas",items:["Verifican HTTPS y antivirus","Sin conocimiento de herramientas de IA","Checklist copiado de internet","No revisan flujos de N8N/Make"],bad:true},
                {label:"InspireAI",items:["Revisamos integraciones reales y sus permisos","Conocemos N8N, Make, APIs de IA","Informe con vulnerabilidades y plan de mitigación","Validamos antes de implementar, no después"],bad:false},
              ].map((col,i) => (
                <div key={i} className="rounded-xl p-5" style={{background:i===0?"rgba(255,255,255,0.03)":"rgba(232,111,111,0.08)",border:i===0?"1px solid rgba(255,255,255,0.07)":"1px solid rgba(232,111,111,0.25)"}}>
                  <div className="text-xs font-semibold mb-4" style={{color:i===0?"rgba(255,255,255,0.35)":"#E86F6F",letterSpacing:"0.06em"}}>{col.label}</div>
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

      {/* VULNERABILIDADES */}
      <section id="vulnerabilidades" className="py-16 md:py-24">
        <div className="mx-auto px-6 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={fadeUp} className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{color:"#E86F6F",letterSpacing:"0.12em"}}>Lo que encontramos</p>
            <h2 className="font-heading font-bold text-white mb-4" style={{fontSize:"clamp(1.5rem,4vw,2.5rem)",letterSpacing:"-0.02em"}}>
              Lo que aparece en el 80%<br />de los proyectos que revisamos
            </h2>
            <p style={{color:"rgba(255,255,255,0.45)",maxWidth:"500px",lineHeight:1.7}}>No son vulnerabilidades teóricas. Son las que encontramos de forma recurrente.</p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={stagger} className="grid md:grid-cols-2 gap-4">
            {[
              {title:"APIs sin autenticación o con tokens hardcodeados",risk:"CRÍTICO",desc:"Un token expuesto da acceso completo a la herramienta. Es la vía de entrada más habitual y la más fácil de evitar si alguien lo revisa antes.",color:"#E86F6F"},
              {title:"Datos de clientes en tránsito sin cifrar",risk:"CRÍTICO",desc:"Webhooks que pasan información de clientes sin validación de origen. Formularios que mandan datos por conexiones sin certificado.",color:"#E86F6F"},
              {title:"Permisos excesivos en integraciones de terceros",risk:"ALTO",desc:"Una integración con Google Drive que pide acceso a toda la cuenta cuando solo necesita una carpeta. Zonas de riesgo que nadie revisó al configurar.",color:"#E8A24F"},
              {title:"RGPD: datos de clientes en herramientas de IA sin base legitimadora",risk:"ALTO",desc:"Pasar nombres, emails o historial de compras a modelos de IA sin verificar si el proveedor cumple RGPD y sin base legal para el tratamiento.",color:"#E8A24F"},
              {title:"Sin backups verificados de flujos críticos",risk:"ALTO",desc:"Automatizaciones que mueven datos críticos sin mecanismo de recuperación. Si el flujo de facturación se rompe, ¿cuánto tardáis en detectarlo?",color:"#E8A24F"},
              {title:"Sin logs de auditoría en procesos automatizados",risk:"MEDIO",desc:"Si una automatización envía facturas erróneas o cancela pedidos, ¿hay registro de qué pasó exactamente? Sin logs, la investigación es imposible.",color:"rgba(255,255,255,0.4)"},
            ].map((v,i) => (
              <motion.div key={i} variants={fadeUp} className="rounded-xl p-5" style={{background:"#0D0E1F",border:`1px solid ${v.color}25`}}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="text-sm font-semibold text-white leading-snug">{v.title}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0" style={{background:`${v.color}18`,color:v.color,border:`1px solid ${v.color}30`}}>{v.risk}</span>
                </div>
                <p className="text-xs leading-relaxed" style={{color:"rgba(255,255,255,0.45)"}}>{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* QUÉ REVISAMOS */}
      <section className="py-16 md:py-24" style={{background:"rgba(255,255,255,0.015)",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
        <div className="mx-auto px-6 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={stagger} className="grid md:grid-cols-2 gap-10 items-start">
            <motion.div variants={fadeUp}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{color:"#E86F6F",letterSpacing:"0.12em"}}>Alcance</p>
              <h2 className="font-heading font-bold text-white mb-5" style={{fontSize:"clamp(1.5rem,3vw,2.25rem)",letterSpacing:"-0.02em",lineHeight:1.2}}>
                Qué revisamos en cada análisis
              </h2>
              <div className="flex flex-col gap-3">
                {[
                  "Inventario de todas las integraciones activas y sus permisos",
                  "Test de APIs expuestas y validación de autenticación",
                  "Análisis del flujo de datos de clientes (cumplimiento RGPD)",
                  "Revisión de configuración de backups y mecanismos de recovery",
                  "Validación de las automatizaciones propuestas antes de implementar",
                  "Informe con nivel de riesgo y plan de mitigación priorizado",
                ].map((item,i) => (
                  <div key={i} className="flex items-start gap-3 text-sm" style={{color:"rgba(255,255,255,0.65)"}}>
                    <div className="w-5 h-5 rounded-full grid place-items-center flex-shrink-0 mt-0.5"
                      style={{background:"rgba(232,111,111,0.15)",border:"1px solid rgba(232,111,111,0.3)"}}>
                      <Check style={{width:10,height:10,color:"#E86F6F"}} />
                    </div>{item}
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div variants={fadeUp} className="rounded-2xl p-6" style={{background:"#0D0E1F",border:"1px solid rgba(232,111,111,0.2)"}}>
              <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{color:"rgba(255,255,255,0.3)",letterSpacing:"0.1em"}}>Ejemplo de informe de hallazgos</div>
              {[
                ["API WhatsApp Business sin validación de origen","CRÍTICO","#E86F6F"],
                ["Token OpenAI sin rotación automática","CRÍTICO","#E86F6F"],
                ["Datos de clientes en Zapier sin cifrar","ALTO","#E8A24F"],
                ["Backups de N8N sin verificación periódica","ALTO","#E8A24F"],
                ["Google Sheets: acceso a toda la cuenta","MEDIO","rgba(255,255,255,0.45)"],
              ].map(([vuln,level,color]) => (
                <div key={vuln as string} className="flex items-center justify-between py-2.5 border-b text-xs" style={{borderColor:"rgba(255,255,255,0.05)"}}>
                  <span style={{color:"rgba(255,255,255,0.6)"}}>{vuln}</span>
                  <span className="ml-3 flex-shrink-0 px-2 py-0.5 rounded-full" style={{background:`${color}15`,color:color as string}}>{level}</span>
                </div>
              ))}
              <p className="text-xs mt-4" style={{color:"rgba(255,255,255,0.25)"}}>Cada hallazgo incluye descripción técnica, impacto estimado y acción concreta de mitigación.</p>
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
              {q:"¿Necesitamos tener automatizaciones activas?",a:"No. El análisis es especialmente valioso antes de implementar. Si estáis pensando en conectar herramientas de IA, es el momento de revisar cómo hacerlo de forma segura desde el principio."},
              {q:"¿Tenéis acceso a nuestros sistemas?",a:"Solo el mínimo necesario para verificar configuraciones específicas, con vuestro consentimiento explícito en cada paso. No almacenamos credenciales y el acceso se revoca al finalizar el análisis."},
              {q:"¿El análisis incluye RGPD?",a:"Sí. Revisamos si el tratamiento de datos de clientes en vuestras herramientas de IA tiene base legitimadora, si los proveedores cumplen las garantías del RGPD y si existe registro de actividades de tratamiento."},
              {q:"¿Qué pasa si ya tenemos automatizaciones en producción?",a:"Perfecto. Las revisamos tal como están, identificamos qué hay que corregir urgentemente y qué puede esperar. Es mejor detectarlo ahora que cuando alguien lo explote."},
            ].map((f,i) => (
              <motion.details key={i} variants={fadeUp} className="rounded-xl overflow-hidden" style={{background:"#0D0E1F",border:"1px solid rgba(255,255,255,0.07)"}}>
                <summary className="px-5 py-4 cursor-pointer font-medium text-white text-sm select-none">{f.q}</summary>
                <div className="px-5 pb-4 text-sm leading-relaxed" style={{color:"rgba(255,255,255,0.55)"}}>{f.a}</div>
              </motion.details>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="cta-ciber" className="py-20 md:py-28 border-t" style={{borderColor:"rgba(255,255,255,0.06)"}}>
        <div className="mx-auto px-6 max-w-2xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={stagger}>
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest mb-4" style={{color:"#E86F6F",letterSpacing:"0.12em"}}>Primera llamada sin coste</motion.p>
            <motion.h2 variants={fadeUp} className="font-heading font-bold text-white mb-5"
              style={{fontSize:"clamp(1.75rem,4vw,3rem)",letterSpacing:"-0.025em",lineHeight:1.1}}>
              Mejor revisarlo antes<br />que después de una brecha.
            </motion.h2>
            <motion.p variants={fadeUp} className="mb-8 text-lg" style={{color:"rgba(255,255,255,0.5)",lineHeight:1.7}}>
              Una llamada para entender vuestro contexto técnico actual y ver si tiene sentido un análisis completo.
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
            {[{href:"/consultoria-ia-empresas",label:"Consultoría IA"},{href:"/automatizacion-procesos-ia",label:"Automatización"},{href:"/crm-personalizado",label:"CRM personalizado"}].map(l => (
              <Link key={l.href} href={l.href} className="rounded-xl px-4 py-3 text-sm font-medium text-center"
                style={{background:"#0D0E1F",border:"1px solid rgba(255,255,255,0.07)",color:"rgba(255,255,255,0.5)"}}>{l.label}</Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
