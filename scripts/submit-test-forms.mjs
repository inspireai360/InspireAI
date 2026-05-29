// Test submission script for Altair Solutions S.L.
// Submits all 4 questionnaires to the local dev server

const BASE_URL = "http://localhost:3000";
const ACCESS_KEY = "inspireai-2025";

async function submitForm(area, datos, respuestas, observaciones) {
  const body = {
    area,
    accessKey: ACCESS_KEY,
    empresa: datos.empresa,
    contacto: datos.nombre,
    email: datos.email,
    telefono: datos.telefono,
    respuestas,
    observaciones,
  };
  console.log(`\n📤 Submitting area: ${area}...`);

  const res = await fetch(`${BASE_URL}/api/onboarding/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }

  if (res.ok) {
    console.log(`  ✅ OK (${res.status}):`, JSON.stringify(json).slice(0, 200));
  } else {
    console.error(`  ❌ ERROR (${res.status}):`, JSON.stringify(json).slice(0, 400));
  }
  return res.ok;
}

// ─── Datos generales compartidos ─────────────────────────────────────────────
const datosBase = {
  empresa: "Altair Solutions S.L.",
  nombre: "Carlos Mendoza",
  cargo: "CEO",
  email: "cmendoza@altairsolutions.es",
  telefono: "+34 91 456 7890",
};

// ─── DELIVERY ────────────────────────────────────────────────────────────────
const deliveryRespuestas = {
  // Sección 1: Información General del Negocio
  "tu-rol-en-la-empresa": "CEO / Dirección General",
  "numero-de-empleados": "16-50 empleados",
  "principal-servicio-o-producto": "Consultoría e implementación de ERP (Odoo y Microsoft Dynamics) para empresas B2B del sector industrial y distribución",

  // Sección 2: Herramientas y Tecnología Actual
  "herramientas-de-gestion-de-proyectos": "ClickUp para gestión interna de proyectos; HubSpot para seguimiento comercial. No están integradas entre sí",
  "software-de-comunicacion-interna": "Microsoft Teams para comunicación interna y reuniones con clientes; email corporativo en Outlook 365",
  "plataformas-de-entrega-al-cliente": "Portal de cliente en construcción (aún no operativo). Actualmente entregamos por email y reuniones de Teams con acta adjunta",

  // Sección 3: Procesos de Entrega
  "descripcion-del-proceso-de-entrega": "El proceso comienza con el kick-off, seguido de análisis de requisitos (2-3 semanas), configuración del ERP (4-8 semanas), formación de usuarios (1-2 semanas) y aceptación UAT. El cuello de botella principal es la fase de UAT: los clientes tardan entre 2 y 6 semanas en validar porque no tienen un responsable claro asignado",
  "numero-de-proyectos-activos": "8-12 proyectos activos simultáneamente dependiendo del trimestre",
  "frecuencia-de-entregas": "Hitos mensuales por proyecto. Entrega final media: 4-6 meses desde kick-off",

  // Sección 4: Automatización y Eficiencia
  "procesos-manuales-repetitivos": "Generación de actas de reunión (manual en Word), actualización de estado de proyectos en ClickUp y en el informe de dirección (doble entrada), onboarding de nuevos clientes (checklist en Excel)",
  "nivel-de-automatizacion": "Bajo: algunas notificaciones automáticas en ClickUp pero ningún flujo de trabajo automatizado end-to-end",
  "herramientas-de-automatizacion": "Ninguna implementada actualmente. Evaluamos Make (Integromat) para conectar ClickUp con HubSpot",

  // Sección 5: Gestión del Conocimiento
  "documentacion-de-procesos": "Parcial. Tenemos fichas de proyecto en ClickUp y una carpeta compartida en SharePoint, pero sin estructura estandarizada ni versiones claras",
  "conocimiento-critico-concentrado": "Sí. La Directora de Proyectos (Elena Ruiz) concentra el conocimiento metodológico de implementación. Si no está disponible, los proyectos se ralentizan significativamente",
  "capacidad-de-escalabilidad": "Limitada. Para crecer más del 20% tendríamos que contratar 2-3 personas más porque los procesos son muy manuales",

  // Sección 6: Calidad y Satisfacción del Cliente
  "metricas-de-calidad": "60% de proyectos dentro de plazo y presupuesto. Satisfacción media de clientes: 7.8/10 en encuesta post-proyecto",
  "gestion-de-incidencias": "Por email y reunión puntual. Sin sistema de tickets ni SLA definido para incidencias post-go-live",
  "proceso-de-mejora-continua": "Reunión trimestral de retrospectiva interna. Sin proceso sistemático de captura de lecciones aprendidas",

  // Sección 7: Desafíos y Objetivos
  "principales-desafios-operativos": "1. Dependencia de la Directora de Proyectos. 2. UAT lenta por parte del cliente. 3. Doble entrada de datos entre ClickUp y HubSpot. 4. Sin portal de cliente operativo",
  "objetivos-a-corto-plazo": "Implementar integración ClickUp↔HubSpot en 3 meses. Lanzar portal de cliente básico antes de Q3. Estandarizar proceso de onboarding",
  "objetivos-a-largo-plazo": "Escalar a 30 proyectos simultáneos sin contratar más de 5 personas adicionales. Reducir tiempo medio de implementación de 5 meses a 3.5 meses",

  // Sección 8: Recursos y Capacidades
  "presupuesto-para-herramientas": "3.000-5.000€/mes para herramientas y software (actualmente gastamos ~2.200€/mes)",
  "equipo-de-tecnologia": "Sin equipo TI interno. Dependemos de un proveedor externo para infraestructura. El CEO supervisa las decisiones tecnológicas",
  "disposicion-al-cambio": "Alta en dirección, media en equipo técnico (resistencia a cambiar metodología de trabajo)",

  // Sección 9: Métricas Actuales
  "volumen-de-solicitudes": "~40 solicitudes de soporte/mes post-go-live entre todos los clientes activos",
  "tiempo-de-respuesta": "48-72 horas para respuesta inicial. Sin SLA formal",
  "tasa-de-resolucion": "85% de incidencias resueltas en primera respuesta o en menos de 5 días",

  // Sección 10: Cultura y Comunicación
  "frecuencia-de-reunion-equipo": "Reunión de equipo semanal (lunes). Reunión de proyecto con cliente cada 2 semanas",
  "estilo-de-comunicacion": "Formal con clientes (email + acta), informal internamente (Teams). Falta un estándar de comunicación escrita interna",
  "toma-de-decisiones": "Centralizada en el CEO para decisiones estratégicas. El equipo de proyecto tiene autonomía táctica",

  // Sección 11: Madurez Digital
  "nivel-de-madurez-digital": "Intermedio. Usamos herramientas digitales pero de forma aislada, sin integración ni automatización real",
  "iniciativas-digitales-recientes": "Migramos de Trello a ClickUp hace 8 meses. Implementamos HubSpot CRM hace 1 año. Estamos en proceso de construir el portal de cliente",
  "principales-barreras-digitales": "Tiempo del equipo para implementar cambios, falta de un responsable TI interno, y coste de integración entre herramientas",

  // Sección 12: Prioridades
  "area-de-mayor-impacto": "Automatización de la entrega: integrar ClickUp con HubSpot y automatizar el onboarding de cliente tendría el mayor impacto inmediato",
  "quick-wins-identificados": "1. Plantilla estándar de onboarding en ClickUp (1 semana). 2. Automatizar notificación de hitos a cliente vía email (2 semanas). 3. Dashboard de estado de proyectos para cliente en Notion (1 mes)",
  "vision-a-3-años": "Ser la consultora ERP de referencia para empresas industriales de 20-200 empleados en España, con procesos 70% automatizados y capacidad de gestionar 50 proyectos simultáneos",

  // Sección 13: Equipo
  "estructura-del-equipo": "CEO (1), Directora de Proyectos (1), Consultores ERP (6), Desarrolladores (4), Comerciales (2), Admin (1), Soporte post-go-live (2)",
  "roles-criticos": "Directora de Proyectos: única con visión metodológica completa. CEO: único que cierra contratos con clientes enterprise",
  "formacion-del-equipo": "Certificaciones de Odoo y Microsoft (3 consultores). El resto formación on-the-job. Sin plan de formación sistemático",

  // Sección 14: Satisfacción Interna
  "satisfaccion-del-equipo": "Media-alta. Última encuesta: 7.2/10. Principal queja: exceso de trabajo manual y reuniones",
  "rotacion-de-personal": "Baja (1 baja voluntaria en 2 años). Riesgo: si la Directora de Proyectos se va, sería crítico",
  "capacidad-de-trabajo-remoto": "Alta. 100% remoto operativo desde COVID. Oficina en Madrid para reuniones presenciales con clientes",

  // Sección 15: Información adicional
  "informacion-adicional": "Estamos en un momento clave: hemos crecido un 40% en los últimos 18 meses y los procesos actuales ya no escalan. Necesitamos digitalizar y automatizar antes de que el crecimiento se convierta en un problema de calidad",
};

// ─── MARKETING ───────────────────────────────────────────────────────────────
const marketingRespuestas = {
  // Sección 1: Equipo y Responsabilidades
  "equipo-de-marketing": "2 personas: Ana García (Marketing Manager, responsable de estrategia y contenido) y Pablo Torres (especialista en paid media y analítica)",
  "estructura-del-equipo-marketing": "Ana reporta al CEO directamente. Pablo reporta a Ana. Sin agencia externa actualmente (tuvimos una hasta hace 6 meses)",
  "presupuesto-de-marketing": "500-1.000€/mes en paid (principalmente LinkedIn Ads). Herramientas: ~300€/mes",

  // Sección 2: Herramientas y Plataformas
  "herramientas-de-marketing": "LinkedIn Ads, Google Analytics 4, HubSpot (CRM + email marketing), Metricool (scheduling redes sociales), Canva para diseño",
  "integracion-de-herramientas": "Las herramientas son islas. HubSpot recibe leads de formularios web, pero LinkedIn Ads no está conectado a HubSpot. Analytics no está vinculado con HubSpot. Metricool es independiente",
  "crm-marketing": "HubSpot. Se usa principalmente como lista de contactos y para envíos de newsletter, no como herramienta de nurturing real",

  // Sección 3: Generación de Leads
  "canales-de-generacion-de-leads": "LinkedIn Ads (40% de leads), boca a boca y referidos (35%), SEO orgánico (15%), newsletter (10%)",
  "volumen-de-leads": "~20 leads cualificados al mes. En picos de campaña llegamos a 35-40",
  "calidad-de-leads": "Variable. LinkedIn genera leads más cualificados pero más caros. Los referidos tienen la tasa de cierre más alta (70%). Los leads de SEO son los más baratos pero menos cualificados",

  // Sección 4: Contenido y Comunicación
  "estrategia-de-contenido": "Enfoque en educación al mercado sobre digitalización y ERP. Caso de uso tipo: 'Cómo una empresa industrial de 50 empleados redujo sus tiempos de inventario un 40% con Odoo'",
  "frecuencia-de-publicacion": "LinkedIn: 3 posts por semana (lunes, miércoles, viernes). Blog: 1 artículo mensual. Newsletter: 1 al mes a ~450 suscriptores",
  "proceso-de-creacion-de-contenido": "Ana redacta el borrador. Pablo revisa desde perspectiva de audiencia. CEO revisa y aprueba (cuello de botella: 3-4 días de espera). Publicación vía Metricool",

  // Sección 5: Automatización y Flujos
  "automatizacion-de-marketing": "Mínima. Tenemos un email de bienvenida automático cuando alguien descarga nuestro whitepaper. Sin nurturing ni lead scoring",
  "flujos-de-nurturing": "No existe. Los leads entran en HubSpot y quedan en una lista estática hasta que comercial los contacta manualmente",
  "herramientas-de-ia-en-marketing": "ChatGPT para primeros borradores de posts y artículos. Ana hace la edición final. No usamos IA para análisis o personalización",

  // Sección 6: Análisis y Métricas
  "metricas-principales": "Leads generados/mes, coste por lead (objetivo: <80€), tasa de apertura newsletter (~28%), seguidores LinkedIn (+200/mes)",
  "reporting": "Excel mensual manual que Pablo prepara el primer lunes de cada mes. Sin dashboard en tiempo real. El CEO lo revisa en reunión mensual de marketing",
  "atribucion": "No tenemos modelo de atribución. Sabemos de dónde vienen los leads por el formulario de contacto ('¿Cómo nos conociste?'), pero no hay tracking multi-touch",

  // Sección 7: Retos y Objetivos
  "principales-retos-marketing": "1. CEO como cuello de botella en aprobación de contenido. 2. Herramientas desconectadas (no vemos el journey completo del lead). 3. Sin nurturing: perdemos leads que no están listos para comprar. 4. Poco contenido de video (LinkedIn lo penaliza)",
  "objetivos-marketing-corto-plazo": "Reducir tiempo de aprobación de contenido de 3-4 días a 24h. Conectar LinkedIn Ads con HubSpot antes de Q3. Crear 3 flujos de nurturing básicos",
  "objetivos-marketing-largo-plazo": "Posicionarnos como thought leaders en digitalización industrial en España. Reducir dependencia de paid a <30% de leads. Llegar a 50 leads cualificados/mes con el mismo presupuesto",

  // Sección 8: Marca y Posicionamiento
  "propuesta-de-valor": "Somos la consultora ERP que habla el idioma del director de operaciones, no del director de TI. Especialistas en Odoo y Dynamics para empresas industriales que han superado Excel",
  "diferenciacion": "Especialización vertical (industrial/distribución), metodología propia de implementación en 90 días para proyectos estándar, soporte post-go-live incluido en precio",
  "audiencia-objetivo": "Directores de Operaciones y CEOs de empresas industriales y distribución de 20-200 empleados, en España, con facturación entre 3M€ y 30M€",

  // Sección 9: Competencia
  "analisis-competencia": "Competimos con grandes consultoras (SAP, Oracle — pero mucho más caras) y con freelancers de Odoo (más baratos pero sin garantías). Nuestro diferencial es el punto medio: metodología + precio razonable",
  "posicionamiento-actual": "Conocidos en el nicho industrial de Madrid y Cataluña. Sin presencia nacional consolidada. Bien valorados en Google (4.7/5 en 23 reseñas)",
  "share-of-voice": "Bajo a nivel nacional. Mediano en nicho industrial Madrid. Necesitamos invertir más en SEO y relaciones con asociaciones industriales",

  // Sección 10: Canales y Campañas
  "canales-prioritarios": "LinkedIn (principal, B2B), Email (nurturing y newsletter), SEO (largo plazo), Eventos/ferias industriales (2-3 al año)",
  "campañas-recientes": "Q1: campaña LinkedIn 'Digitaliza tu almacén en 90 días' → 45 leads, 8 propuestas, 2 cierres. ROI positivo pero manual de gestionar",
  "estacionalidad": "Septiembre-noviembre y febrero-marzo son los meses más activos. Agosto y diciembre son muy lentos (leads caen un 60%)",

  // Sección 11: Colaboraciones y Partnerships
  "partnerships": "Partner oficial de Odoo (nivel Gold). Relación informal con 2 gestorías que nos recomiendan. Sin acuerdo formal de referidos",
  "relaciones-con-medios": "Ninguna. Hemos publicado 2 artículos como invitados en blogs del sector industrial pero sin estrategia",
  "eventos": "Participamos como ponentes en 1 evento de digitalización industrial al año. Stand en 1 feria (EMAF o similar). Alto impacto pero costoso",

  // Sección 12: Información adicional
  "informacion-adicional-marketing": "El marketing funciona pero es reactivo y manual. Tenemos buena materia prima (casos de éxito reales, equipo que sabe el mercado) pero nos falta la infraestructura para escalar. Si conectáramos las herramientas y automatizáramos el nurturing, creemos que podríamos duplicar leads cualificados con el mismo presupuesto",
};

// ─── VENTAS ──────────────────────────────────────────────────────────────────
const ventasRespuestas = {
  // Sección 1: Equipo Comercial
  "equipo-comercial": "2 comerciales (Javier y Marta) + CEO que cierra cuentas enterprise. Total: 3 personas con rol comercial",
  "estructura-comercial": "Javier: cuentas nuevas (hunter). Marta: gestión de cuentas existentes y upsell (farmer). CEO: cierres enterprise y relaciones estratégicas",
  "experiencia-del-equipo-comercial": "Javier: 3 años en ventas B2B tecnología. Marta: 5 años en gestión de cuentas SaaS. CEO: 12 años, fundador de la empresa",

  // Sección 2: Proceso de Ventas
  "etapas-del-proceso-de-ventas": "1. Calificación (15 min call). 2. Discovery (60 min reunión). 3. Propuesta técnica (7-10 días). 4. Presentación propuesta. 5. Negociación. 6. Firma. Media de pasos: 5-7 interacciones",
  "duracion-del-ciclo-de-ventas": "4-12 semanas según tamaño del cliente. Proyectos <50K€: 4-6 semanas. Enterprise >100K€: 8-12 semanas o más",
  "herramientas-de-ventas": "HubSpot CRM para pipeline y seguimiento. LinkedIn para prospección. Propuestas en Word (sin herramienta de propuestas dedicada). Contratos en Word + firma física o DocuSign",

  // Sección 3: Generación de Pipeline
  "fuentes-de-leads-ventas": "Referidos de clientes existentes (40%), LinkedIn (30%), marketing inbound (20%), eventos (10%)",
  "volumen-pipeline": "Pipeline activo: ~25 oportunidades. Valor total estimado: ~600K€. Distribución: 60% en fase de propuesta o negociación",
  "tasa-de-conversion": "Lead cualificado → propuesta: 40%. Propuesta → cierre: 30%. Overall: ~12% de lead cualificado a cliente",

  // Sección 4: Ticket y Revenue
  "ticket-medio": "45.000€ por proyecto de implementación. Rango: 15.000€ (Odoo básico) a 180.000€ (Dynamics enterprise)",
  "revenue-actual": "Facturación anual: ~1.2M€. Objetivo 2025: 1.8M€. Recurrente (soporte y mantenimiento): 20% del total",
  "estructura-de-precios": "Por proyecto + soporte mensual. La implementación se cobra por hitos (30% inicio, 40% UAT, 30% go-live). El soporte: 500-2.000€/mes según nivel",

  // Sección 5: CRM y Datos
  "uso-del-crm": "HubSpot actualizado irregularmente. Javier lo usa bien. Marta lo usa poco (prefiere Excel). CEO no registra sus conversaciones. Datos incompletos para análisis",
  "calidad-de-datos": "60% de fiabilidad estimada. Problemas: contactos duplicados, oportunidades sin actividad actualizada, campos vacíos en propiedades clave",
  "metricas-de-ventas": "Seguimos: nº de nuevas oportunidades/mes, valor pipeline, tasa de cierre trimestral. No seguimos: velocidad de pipeline, tiempo en cada etapa, actividades por rep",

  // Sección 6: Propuestas y Documentos
  "proceso-de-propuestas": "El consultor técnico diseña la solución (2-3 días). CEO o Javier redactan la propuesta en Word (2-3 días). Revisión interna (1 día). Presentación al cliente. Total: 7-10 días",
  "plantillas-de-propuestas": "Tenemos una plantilla base en Word pero cada propuesta se personaliza mucho. Sin control de versiones. A veces se envía versión incorrecta",
  "tasa-de-exito-propuestas": "30% de propuestas enviadas → cliente. El 45% de las perdidas es por precio. El 30% por elección de otro proveedor. El 25% por proyecto congelado",

  // Sección 7: Negociación y Cierre
  "proceso-de-negociacion": "CEO negocia condiciones en enterprise. Javier tiene margen de descuento del 10% sin aprobación. Descuentos mayores requieren CEO. Sin playbook de negociación formal",
  "objeciones-frecuentes": "1. 'Es caro' (45%). 2. 'No es el momento' (25%). 3. 'Necesitamos más funcionalidades' (15%). 4. 'No tenemos recursos internos para el proyecto' (15%)",
  "tiempo-hasta-primer-pago": "Media: 3 semanas desde firma hasta primer hito facturado. Retraso común: firma de contrato (aprobación legal del cliente)",

  // Sección 8: Retención y Upsell
  "tasa-de-retencion": "92% de clientes renuevan el soporte anual. Upsell: 3-4 expansiones al año (módulos adicionales o segundo sistema)",
  "estrategia-de-upsell": "Reactiva. Marta identifica oportunidades en las reuniones de seguimiento pero sin proceso sistemático de revisión de cuentas",
  "nps-o-satisfaccion": "NPS: +42 (medido una vez al año). Satisfacción post-proyecto: 7.8/10. Principal detractor: retrasos en UAT que el cliente achaca al proveedor",

  // Sección 9: Retos y Objetivos
  "principales-retos-ventas": "1. Dependencia del CEO para cierres enterprise. 2. Pipeline poco predecible (varianza alta de trimestre a trimestre). 3. Propuestas lentas (7-10 días vs. competencia que propone en 3-4 días). 4. CRM subutilizado → datos para análisis poco fiables",
  "objetivos-ventas-corto-plazo": "Reducir tiempo de propuesta a 5 días. Implementar pipeline review semanal estructurado. Conseguir que el 100% de oportunidades estén en HubSpot al día",
  "objetivos-ventas-largo-plazo": "Que Javier pueda cerrar enterprise sin el CEO para el 50% de los casos. Llegar a 30 cierres/año vs. 20 actuales. ARR de soporte que cubra costes fijos de la empresa",

  // Sección 10: Formación y Metodología
  "metodologia-de-ventas": "Sin metodología formal. Javier usa instinto y experiencia. Hemos hecho un taller de SPIN Selling pero no se ha implementado de forma consistente",
  "formacion-comercial": "1 formación externa al año. Roleplay interno ocasional. Sin biblioteca de llamadas grabadas ni best practices documentadas",
  "coaching-comercial": "CEO hace de coach informal en las oportunidades grandes. Sin sesiones regulares de coaching estructurado",

  // Sección 11: Mercado y Competencia
  "segmentos-de-mercado": "Principal: industria manufacturera y distribución, 20-200 empleados, España. Secundario: empresas de servicios profesionales que han superado Excel",
  "competidores-principales": "Freelancers Odoo (precio más bajo), consultoras generalistas (menos especializadas), software verticales del sector (menos flexibles)",
  "ventajas-competitivas": "Especialización sectorial, metodología probada, soporte post-go-live incluido, capacidad bilingüe (ES/EN para multinacionales con sede en España)",

  // Sección 12: Información adicional
  "informacion-adicional-ventas": "El mayor riesgo comercial es la concentración: el CEO es imprescindible en enterprise y el canal de referidos (que da leads de máxima calidad) depende de las relaciones personales del CEO. Si escalamos, necesitamos transferir esa confianza al equipo comercial mediante un proceso más robusto y materiales de venta más potentes",
};

// ─── OPERACIONES (administracion_documentacion) ───────────────────────────────
const operacionesRespuestas = {
  // Sección 1: Estructura Administrativa
  "responsable-administrativo": "Carmen López, Office Manager. Lleva 4 años en la empresa. Es el único punto de contacto para toda la gestión administrativa",
  "tamaño-del-equipo-administrativo": "1 persona (Carmen). El CEO aprueba pagos mayores de 5.000€. Sin back-up si Carmen no está disponible",
  "herramientas-administrativas": "Google Drive (documentos), Factusol (facturación), Excel (control de gastos y contratos), Email (comunicación con proveedores y clientes). Sin ERP propio (paradójicamente, vendemos ERPs pero no tenemos uno)",

  // Sección 2: Gestión Documental
  "sistema-de-archivado": "Google Drive con carpetas por año y cliente. Sin nomenclatura estandarizada. Cada persona nombra los archivos como quiere. Difícil encontrar versiones actuales",
  "control-de-versiones": "No existe. Se trabaja con el último archivo que se recibe. A veces hay confusion entre versiones de contratos",
  "acceso-a-documentos": "Solo Carmen tiene acceso completo. El CEO tiene acceso a carpetas críticas. El equipo de proyecto tiene acceso a sus carpetas de proyecto. No hay gestión de permisos formal",

  // Sección 3: Facturación y Cobros
  "proceso-de-facturacion": "Carmen emite facturas manualmente en Factusol cuando el equipo de proyecto le avisa por email o WhatsApp de que se ha completado un hito. Sin automatización ni alertas proactivas",
  "volumen-de-facturas": "~15 facturas emitidas/mes. ~30 facturas de proveedores recibidas/mes. 12 contratos activos con clientes",
  "plazos-de-cobro": "30-60 días en proyectos. Soporte: domiciliado a mes natural. Tasa de cobro a tiempo: ~75%. El 25% restante requiere recordatorio manual",

  // Sección 4: Gestión de Contratos
  "proceso-de-contratos": "Contratos en Word. Firma por email (escaneado) o DocuSign en enterprise. Sin gestor de contratos. Carmen lleva un Excel con fechas de vencimiento",
  "tipos-de-contratos": "Contrato de implementación (por proyecto), contrato de soporte (anual renovable), NDA (siempre antes del discovery), acuerdo de confidencialidad con proveedores",
  "renovaciones": "Carmen revisa el Excel de contratos el primer lunes de cada mes. Alerta al CEO con 60 días de antelación. Proceso manual y dependiente de que Carmen no se olvide",

  // Sección 5: Tesorería y Pagos
  "control-de-tesoreria": "Excel mensual que Carmen actualiza con ingresos previstos y gastos fijos. Sin herramienta de tesorería dedicada. Previsión a 3 meses máximo",
  "proceso-de-pagos": "Proveedores: Carmen prepara remesa y el CEO aprueba y ejecuta. Nóminas: gestoría externa prepara, CEO aprueba. Gastos de empleados: hoja de Excel + justificante, aprueba CEO",
  "control-de-gastos": "Sin política de gastos escrita. Cada empleado informa de sus gastos a Carmen. Control reactivo (a fin de mes) en lugar de preventivo",

  // Sección 6: Cumplimiento y Regulatorio
  "obligaciones-legales-identificadas": "RGPD (tenemos registro de actividades y contratos con encargados, pero no hay auditoría reciente). Factura electrónica (Ley Crea y Crece — sabemos que viene pero no hemos actuado). Retenciones IRPF y IVA (gestoría lo gestiona). Prevención de riesgos laborales (contrato con empresa de PRL pero sin seguimiento activo)",
  "gestion-de-rgpd": "Básica. Tenemos política de privacidad en la web y cláusulas en contratos. Sin DPO designado (no obligatorio a nuestro tamaño). Último análisis de riesgo: hace 2 años",
  "preparacion-factura-electronica": "Pendiente. Sabemos que es obligatorio pero no hemos iniciado el proceso. Factusol tiene módulo de facturación electrónica disponible. Prioridad para Q3 2025",

  // Sección 7: Automatización Administrativa
  "nivel-de-automatizacion-admin": "Muy bajo (1/5). Todo es manual o requiere intervención de Carmen. La única automatización es el domiciliado bancario para cobros de soporte",
  "procesos-candidatos-automatizacion": "1. Alertas automáticas de vencimiento de contratos. 2. Generación automática de factura al aprobar hito en ClickUp. 3. Recordatorio automático de cobros pendientes. 4. Gastos de empleados vía app (Expensify o similar)",
  "resistencia-al-cambio-admin": "Carmen tiene miedo de perder el control si se automatizan procesos. Necesita formación y participación activa en el diseño de las nuevas herramientas",

  // Sección 8: Proveedores y Partnerships
  "principales-proveedores": "Gestoría (nóminas e impuestos), empresa de PRL, proveedor de hosting (Azure), proveedor de licencias Odoo (Odoo SA), Microsoft (licencias 365)",
  "gestion-de-proveedores": "Sin proceso formal. Relación directa del CEO con proveedores estratégicos. Carmen gestiona facturas y pagos. Sin evaluación anual de proveedores",
  "riesgo-de-proveedor": "Medio. Si la gestoría falla o cambia, tendríamos un problema serio en nóminas e impuestos. Sin contrato de nivel de servicio con proveedores críticos",

  // Sección 9: Riesgos Operativos
  "principales-riesgos-operativos": "1. Carmen = punto de fallo único: si no está, la operación administrativa se para. 2. Sin manual de procedimientos: el conocimiento está solo en su cabeza. 3. Factura electrónica sin implementar. 4. Google Drive sin backup externo verificado",
  "plan-de-contingencia": "Ninguno formal. Si Carmen falta más de 2 días, el CEO intenta asumir las tareas urgentes con soporte de la gestoría",
  "incidentes-recientes": "Carmen estuvo de baja 1 semana el año pasado. Caos: el CEO tuvo que gestionar pagos y facturas, se retrasaron 2 facturas a clientes y se olvidó un vencimiento de contrato",

  // Sección 10: Mejoras Planificadas
  "mejoras-admin-planificadas": "1. Implementar facturación electrónica (Q3 2025). 2. Digitalizar gastos de empleados. 3. Crear manual de procedimientos administrativos. 4. Evaluar si necesitamos un ERP propio (irónico pero real)",
  "presupuesto-admin": "Sin presupuesto específico para digitalización administrativa. Las mejoras compiten con inversiones de negocio. Estimamos necesitar 200-500€/mes en herramientas nuevas",
  "prioridades-admin": "Urgente: factura electrónica y manual de procedimientos. Importante: automatización de alertas y gastos. Deseable: ERP propio o integración de herramientas existentes",
};

// ─── MAIN ────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🚀 Altair Solutions S.L. — Envío de cuestionarios de prueba\n");
  console.log("=".repeat(60));

  const results = [];

  results.push(await submitForm("delivery", datosBase, deliveryRespuestas, "Empresa en fase de crecimiento acelerado. Necesitamos escalar sin perder calidad de entrega. La integración de herramientas y la reducción de dependencias clave son nuestra prioridad inmediata."));

  results.push(await submitForm("marketing", datosBase, marketingRespuestas, "Marketing funciona pero de forma manual e ineficiente. Tenemos los ingredientes (equipo, casos de éxito, presupuesto) pero nos falta la infraestructura digital para escalar. Prioridad: conectar herramientas y automatizar nurturing."));

  results.push(await submitForm("ventas", datosBase, ventasRespuestas, "El mayor riesgo es la concentración en el CEO tanto en cierres como en relaciones. Necesitamos un proceso de ventas más robusto y documentado que permita al equipo comercial crecer sin depender del fundador para cada decisión clave."));

  results.push(await submitForm("administracion_documentacion", datosBase, operacionesRespuestas, "Carmen es un activo imprescindible pero también nuestro mayor riesgo operativo. Necesitamos documentar sus procesos, implementar la factura electrónica antes del plazo legal y reducir la dependencia de una sola persona para toda la operación administrativa."));

  console.log("\n" + "=".repeat(60));
  const ok = results.filter(Boolean).length;
  console.log(`\n📊 Resultado: ${ok}/4 cuestionarios enviados correctamente`);
  if (ok === 4) {
    console.log("✅ Todos los formularios enviados. Ahora ejecuta el diagnóstico Notion:");
    console.log('   node --use-system-ca scripts/create-notion-diagnostic-from-airtable.mjs --client "Altair Solutions" --areas ventas,marketing,operaciones,delivery --dry-run');
  }
}

main().catch(console.error);
