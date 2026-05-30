"use client";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function FormacionIA() {
  const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16,1,0.3,1] } } };
  const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };

  return (
    <div className="min-h-screen bg-dark text-white selection:bg-primary/30 selection:text-white">
      <nav className="py-4 border-b border-white/5 bg-[#08091A]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto px-6 max-w-6xl flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Inicio
          </Link>
          <Link href="/" className="font-orbitron font-bold text-[1.1rem] tracking-[0.05em] text-white">
            INSPIRE<span className="text-[#818CF8]">AI</span>
          </Link>
          <button onClick={() => document.getElementById("cta-form")?.scrollIntoView({ behavior:"smooth" })}
            className="btn-primary-sm hidden md:flex">Solicitar información</button>
        </div>
      </nav>

      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden" style={{ background: "#08091A" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 40% at 50% -10%, rgba(63,185,132,0.15) 0%, transparent 70%)" }} />
        <div className="mx-auto px-6 max-w-4xl relative z-10">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6"
              style={{ background: "rgba(63,185,132,0.1)", color: "#3FB984", border: "1px solid rgba(63,185,132,0.25)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Formación IA para equipos de empresa
            </motion.div>
            <motion.h1 variants={fadeUp} className="font-heading font-bold text-white mb-6"
              style={{ fontSize: "clamp(2rem,5vw,3.5rem)", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
              Tu equipo ya usa IA.<br />
              <span style={{ color: "#3FB984" }}>La pregunta es si la usa bien</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg mb-8 max-w-2xl" style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
              ChatGPT para escribir emails que suenan a robot. Prompts copiados de internet que
              dan resultados mediocres. Resistencia del equipo porque nadie les ha enseñado a
              usarlo de verdad. La formación en IA que impartimos es práctica, específica para
              vuestro sector y con casos reales del día a día de vuestra empresa.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => document.getElementById("cta-form")?.scrollIntoView({ behavior:"smooth" })} className="btn-primary">
                Solicitar propuesta formativa <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => document.getElementById("modulos")?.scrollIntoView({ behavior:"smooth" })} className="btn-secondary">
                Ver módulos
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Para quién */}
      <section className="py-16 md:py-20" style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="mx-auto px-6 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={fadeUp} className="mb-10">
            <h2 className="font-heading font-bold text-white mb-3" style={{ fontSize: "clamp(1.5rem,4vw,2.5rem)", letterSpacing: "-0.02em" }}>
              Para quién es esta formación
            </h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={stagger}
            className="grid md:grid-cols-3 gap-5">
            {[
              { icon:"👥", title:"Equipos de 5 a 30 personas", desc:"Tamaño ideal para formación en grupo con casos prácticos del sector. Suficiente diversidad de roles para que la formación tenga impacto real en distintos departamentos.", color:"#3FB984" },
              { icon:"🏢", title:"Cualquier sector", desc:"La formación se adapta a vuestro contexto: los ejercicios prácticos usan documentos, procesos y situaciones reales de vuestra empresa, no ejemplos genéricos sacados de un libro.", color:"#818CF8" },
              { icon:"🎯", title:"Todos los niveles", desc:"Desde el directivo que quiere entender qué decisiones puede tomar con IA hasta el empleado que la va a usar a diario. Los módulos se organizan según el perfil de cada participante.", color:"#E8A24F" },
            ].map((c, i) => (
              <motion.div key={i} variants={fadeUp} className="rounded-2xl p-6" style={{ background: "#0D0E1F", border: `1px solid ${c.color}25` }}>
                <div className="text-3xl mb-4">{c.icon}</div>
                <h3 className="font-semibold text-white mb-2">{c.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{c.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Módulos */}
      <section id="modulos" className="py-16 md:py-24">
        <div className="mx-auto px-6 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={fadeUp} className="mb-10">
            <h2 className="font-heading font-bold text-white mb-3" style={{ fontSize: "clamp(1.5rem,4vw,2.5rem)", letterSpacing: "-0.02em" }}>
              Qué aprende el equipo
            </h2>
            <p style={{ color: "rgba(255,255,255,0.45)", maxWidth: "520px", lineHeight: 1.7 }}>
              Cuatro módulos que van de lo conceptual a lo aplicado. Cada uno termina
              con ejercicios prácticos usando herramientas reales.
            </p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={stagger} className="flex flex-col gap-4">
            {[
              {
                n:"Módulo 1", title:"IA aplicada al negocio — qué es real y qué es hype",
                dur:"3h", nivel:"Todos los perfiles",
                desc:"Qué puede hacer la IA hoy (y qué no puede). Casos de uso reales en empresas del mismo sector. Cómo identificar qué procesos de vuestra empresa son candidatos a automatizarse. Por qué la IA no sustituye roles sino que cambia cómo se ejecutan.",
                items:["Casos reales del sector","Ejercicio: mapeo de procesos automatizables en la propia empresa","Q&A con el equipo técnico de InspireAI"],
                color:"#3FB984"
              },
              {
                n:"Módulo 2", title:"Prompting avanzado — resultados que sirven para algo",
                dur:"4h", nivel:"Todos los perfiles",
                desc:"Por qué los prompts genéricos dan resultados mediocres. Técnicas avanzadas de prompting (chain of thought, few-shot, role prompting). Cómo crear plantillas de prompts para las tareas más frecuentes del equipo. Ejercicios con ChatGPT, Claude y Gemini.",
                items:["20+ ejercicios prácticos con casos reales","Creación de biblioteca de prompts para la empresa","Diferencias entre modelos según el caso de uso"],
                color:"#818CF8"
              },
              {
                n:"Módulo 3", title:"Herramientas de automatización — N8N y Make sin código",
                dur:"6h", nivel:"Perfiles técnicos y operaciones",
                desc:"Cómo funcionan N8N y Make sin necesidad de programar. Construcción de flujos simples: desde WhatsApp al CRM, desde formulario web a email, desde Excel a Notion. Gestión de errores y monitorización básica. Cuándo escalar a un desarrollador.",
                items:["Cada participante construye su primer flujo funcional","Conectar herramientas que ya usáis en la empresa","Alta del equipo en N8N self-hosted o Make"],
                color:"#E8A24F"
              },
              {
                n:"Módulo 4", title:"IA generativa en el trabajo diario — casos por departamento",
                dur:"4h", nivel:"Por departamento",
                desc:"Sesiones específicas por área: ventas (propuestas, seguimientos, análisis de llamadas), marketing (contenidos, análisis de campañas, copywriting), operaciones (documentación, reportes, gestión de incidencias). Cada sesión usa documentos y situaciones reales del equipo.",
                items:["Sesión específica por departamento","Entrega de plantillas listas para usar","Manual de uso IA para el equipo (en Notion)"],
                color:"#E86F6F"
              },
            ].map((m, i) => (
              <motion.div key={i} variants={fadeUp} className="rounded-2xl overflow-hidden" style={{ background: "#0D0E1F", border: `1px solid ${m.color}20` }}>
                <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)", background: `${m.color}08` }}>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: m.color, letterSpacing: "0.08em" }}>{m.n}</span>
                    <h3 className="font-semibold text-white text-sm">{m.title}</h3>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{m.dur}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full hidden md:block" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}>{m.nivel}</span>
                  </div>
                </div>
                <div className="px-6 py-5 grid md:grid-cols-2 gap-4">
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{m.desc}</p>
                  <div className="flex flex-col gap-2">
                    {m.items.map((item, j) => (
                      <div key={j} className="flex items-start gap-2 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: m.color }} />{item}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Formato y precio */}
      <section className="py-16 md:py-20" style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="mx-auto px-6 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={stagger}
            className="grid md:grid-cols-2 gap-6">
            <motion.div variants={fadeUp} className="rounded-2xl p-7" style={{ background: "#0D0E1F", border: "1px solid rgba(255,255,255,0.08)" }}>
              <h3 className="font-semibold text-white mb-4">Formato</h3>
              <div className="flex flex-col gap-3">
                {[
                  ["📍 Modalidad","Presencial en vuestras oficinas o remoto vía Zoom"],
                  ["👥 Grupo","De 4 a 20 personas por sesión"],
                  ["⏱ Duración total","De 1 día intensivo (todos los módulos) a 4 sesiones semanales de 3–4h"],
                  ["📋 Material","Documentación en Notion, plantillas de prompts y acceso a grabaciones"],
                  ["🗣 Idioma","Español"],
                  ["📍 Ubicación","España (presencial) o cualquier país (remoto)"],
                ].map(([k,v]) => (
                  <div key={k as string} className="flex items-start gap-3 text-sm py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)" }}>
                    <span className="font-medium text-white w-32 flex-shrink-0">{k}</span>{v}
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div variants={fadeUp} className="rounded-2xl p-7" style={{ background: "linear-gradient(135deg,rgba(63,185,132,0.12),rgba(63,185,132,0.03))", border: "1px solid rgba(63,185,132,0.25)" }}>
              <h3 className="font-semibold text-white mb-4">Precio orientativo</h3>
              <div className="text-4xl font-bold text-white mb-2" style={{ letterSpacing: "-0.03em" }}>Desde 1.200€</div>
              <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.45)" }}>por sesión o módulo · precio final según empresa y alcance</p>
              <div className="flex flex-col gap-2.5 mb-6">
                {[
                  "Propuesta personalizada tras llamada de 30 min",
                  "Precio cerrado por empresa, no por persona",
                  "Material incluido (Notion + plantillas)",
                  "Posibilidad de bonificación FUNDAE (formación continua)",
                ].map((f,i) => (
                  <div key={i} className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                    <Check style={{ width:14, height:14, color:"#3FB984" }} />{f}
                  </div>
                ))}
              </div>
              <button onClick={() => document.getElementById("cta-form")?.scrollIntoView({ behavior:"smooth" })}
                className="btn-primary w-full">Solicitar propuesta</button>
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
              { q:"¿Qué nivel técnico necesita tener el equipo?", a:"Ninguno. La formación está diseñada para que cualquier persona pueda seguirla, independientemente de si tiene perfil técnico o no. Los módulos 3 y 4 sí son más técnicos, pero seguibles para cualquier usuario avanzado de herramientas digitales." },
              { q:"¿Podemos hacer solo algunos módulos?", a:"Sí. Podéis contratar módulos sueltos según vuestras necesidades. Lo habitual es empezar con los módulos 1 y 2 para toda la empresa y luego hacer el 3 solo con los perfiles de operaciones." },
              { q:"¿La formación se puede bonificar a través de FUNDAE?", a:"En muchos casos sí. Os ayudamos a gestionar la bonificación si vuestra empresa cotiza a la Seguridad Social y tiene crédito de formación disponible. Consultadnos en la llamada inicial." },
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
      <section id="cta-form" className="py-16 md:py-24 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="mx-auto px-6 max-w-2xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="font-heading font-bold text-white mb-4"
              style={{ fontSize: "clamp(1.75rem,4vw,2.75rem)", letterSpacing: "-0.02em" }}>
              Cuéntanos cómo es vuestro equipo
            </motion.h2>
            <motion.p variants={fadeUp} className="mb-8" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
              En 30 minutos entendemos vuestro contexto, os recomendamos los módulos
              con más impacto y os enviamos propuesta con precio cerrado.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link href="/#contacto" className="btn-primary inline-flex items-center gap-2">
                Hablar con el equipo <ArrowRight className="w-4 h-4" />
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
              { href:"/ciberseguridad-ia-empresas", label:"Ciberseguridad IA" },
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
