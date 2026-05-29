import OnboardingPage from "../_components/OnboardingPage";
import type { Question } from "../_components/OnboardingForm";

export const metadata = {
  title: "Auditoría de Delivery | InspireAI",
  robots: "noindex, nofollow",
};

const questions: Question[] = [
  // ── Sección 01: Datos de la Empresa y Estructura ───────────────────────────
  {
    id: "delivery_01_01",
    label: "Nombre de la empresa",
    type: "text",
    required: true,
    helper: "Indica el nombre legal o comercial de tu empresa",
  },
  {
    id: "delivery_01_02",
    label: "Área a auditar",
    type: "fixed",
    value: "Delivery",
    helper: "Este cuestionario está diseñado específicamente para auditar el área de delivery",
  },
  {
    id: "delivery_01_03",
    label: "Tu rol en la empresa",
    type: "single_select",
    options: [
      "CEO / Fundador",
      "COO / Director de Operaciones",
      "Delivery Manager",
      "Customer Success Manager",
      "Project Manager",
      "Account Manager",
      "Otro",
    ],
  },
  {
    id: "delivery_01_04",
    label: "Tamaño del equipo",
    type: "single_select",
    helper: "Número aproximado de personas en tu organización",
    options: [
      "1 - 5 empleados",
      "6 - 15 empleados",
      "16 - 50 empleados",
      "51 - 100 empleados",
      "Más de 100 empleados",
    ],
  },
  {
    id: "delivery_01_05",
    label: "¿Qué producto o servicio entregáis?",
    type: "textarea",
    helper: "Describe brevemente qué es lo que entregáis a vuestros clientes",
  },
  {
    id: "delivery_01_06",
    label: "Organigrama / Estructura del equipo de delivery",
    type: "textarea",
    helper: "Describe la estructura jerárquica del área de delivery: quién reporta a quién, departamentos, etc.",
  },
  {
    id: "delivery_01_07",
    label: "Roles involucrados en el proceso de delivery",
    type: "textarea",
    helper: "Lista todos los roles/personas que participan en la entrega del producto/servicio",
  },

  // ── Sección 02: Herramientas de Control del Delivery ──────────────────────
  {
    id: "delivery_02_01",
    label: "¿Qué herramientas utilizáis para el control del delivery?",
    type: "multi_select",
    helper: "Selecciona todas las herramientas donde gestionáis proyectos, clientes y entregas",
    options: [
      { value: "ClickUp", description: "Gestión de proyectos, tareas y seguimiento de entregas" },
      { value: "Asana", description: "Coordinación de equipos y proyectos de clientes" },
      { value: "Trello", description: "Tableros Kanban para seguimiento visual" },
      { value: "Monday.com", description: "Gestión de work OS y automatizaciones" },
      { value: "Notion", description: "Documentación, wikis y bases de datos de clientes" },
      { value: "HubSpot / CRM", description: "Gestión de relación con clientes y comunicaciones" },
      { value: "Intercom / Zendesk / Freshdesk", description: "Soporte al cliente y tickets" },
      { value: "Hojas de cálculo (Excel / Google Sheets)", description: "Seguimiento manual, reportes de clientes" },
      { value: "Otras herramientas", description: "Especifica cualquier otra herramienta relevante abajo" },
    ],
  },
  {
    id: "delivery_02_02",
    label: "Otras herramientas utilizadas",
    type: "textarea",
    helper: "Si usáis herramientas adicionales no listadas, indícalas aquí",
  },
  {
    id: "delivery_02_03",
    label: "¿Podréis darnos acceso de lectura a las herramientas relevantes?",
    type: "single_select",
    helper: "Necesitamos acceso temporal para analizar flujos, no modificaremos nada",
    options: ["Sí, sin problema", "Solo algunas", "Necesito consultar"],
  },
  {
    id: "delivery_02_04",
    label: "Escenario tecnológico actual",
    type: "textarea",
    helper: "Describe brevemente vuestra infraestructura técnica: hosting, bases de datos, integraciones, APIs, etc.",
  },
  {
    id: "delivery_02_05",
    label: "¿Existe una base de datos del sistema actual?",
    type: "single_select",
    helper: "Si tenéis una base de datos interna, ¿podríais exportar estructura/esquema sin datos sensibles?",
    options: ["Sí, podemos exportar", "No tenemos BD propia", "Tengo que verificar"],
  },
  {
    id: "delivery_02_06",
    label: "¿Existe una fuente de verdad única (Single Source of Truth)?",
    type: "single_select",
    helper: "¿Hay un sistema central donde se consolida toda la información importante o está dispersa en múltiples lugares?",
    options: ["Sí, centralizado", "Parcialmente", "No, dispersa"],
  },

  // ── Sección 03: Proceso de Delivery y Customer Journey ────────────────────
  {
    id: "delivery_03_01",
    label: "¿Cómo entregáis vuestro producto/servicio?",
    type: "textarea",
    helper: "Describe el proceso completo de entrega desde que el cliente compra hasta que recibe el valor",
  },
  {
    id: "delivery_03_02",
    label: "¿Cuáles son los tiempos de entrega del servicio?",
    type: "textarea",
    helper: "Duración típica desde el inicio hasta la entrega completa",
  },
  {
    id: "delivery_03_03",
    label: "Mapeo de la experiencia del cliente (Customer Journey)",
    type: "textarea",
    helper: "Describe las fases: Onboarding → Uso → Soporte → Fidelización",
  },
  {
    id: "delivery_03_04",
    label: "¿Tienes algún diagrama o esquema del proceso de entrega actual?",
    type: "single_select",
    helper: "Sube un documento, imagen o captura que represente cómo funciona actualmente la entrega. Si tienes un diagrama, envíalo por email a auditorias@divisualproject.com referenciando tu empresa",
    options: ["Sí, lo enviaré", "No tengo, pero puedo crear uno", "No existe ninguno"],
  },
  {
    id: "delivery_03_05",
    label: "¿En qué parte del proceso de entrega suelen aparecer más problemas, retrasos o errores?",
    type: "multi_select",
    helper: "Selecciona una o varias opciones donde identificáis cuellos de botella",
    options: [
      { value: "Inicio del onboarding", description: "Retrasos en arrancar con nuevos clientes" },
      { value: "Comunicación entre equipos", description: "Información que se pierde o malinterpreta entre áreas" },
      { value: "Fase de producción/ejecución", description: "Retrasos en la entrega del trabajo principal" },
      { value: "Validación del cliente", description: "El cliente tarda en revisar o aprobar entregables" },
      { value: "Soporte post-entrega", description: "Problemas o dudas que surgen después de entregar" },
      { value: "Otro", description: "Especifica en el campo de abajo" },
    ],
  },
  {
    id: "delivery_03_06",
    label: "Detalle de los cuellos de botella identificados",
    type: "textarea",
    helper: "Describe con más detalle dónde y por qué se producen estos problemas",
  },
  {
    id: "delivery_03_07",
    label: "¿Qué nivel de estandarización tiene vuestro proceso de delivery?",
    type: "single_select",
    helper: "Nos ayuda a priorizar qué automatizaciones son viables",
    options: [
      { value: "Muy estandarizado", description: "Seguimos siempre los mismos pasos" },
      { value: "Parcialmente", description: "Hay excepciones frecuentes" },
      { value: "Poco estandarizado", description: "Cada caso es diferente" },
      { value: "No lo sé", description: "No está documentado" },
    ],
  },
  {
    id: "delivery_03_08",
    label: "¿Cómo definirías el nivel de madurez digital de tu empresa en el área de delivery?",
    type: "single_select",
    options: [
      { value: "Básico", description: "Hojas de cálculo y gestión manual" },
      { value: "Intermedio", description: "Herramientas sin integraciones" },
      { value: "Avanzado", description: "Herramientas integradas con automatizaciones" },
      { value: "Experto", description: "Todo automatizado e integrado" },
    ],
  },
  {
    id: "delivery_03_09",
    label: "¿Tenéis el proceso de delivery documentado?",
    type: "single_select",
    options: ["Sí, bien documentados", "Algunos flujos", "Solo informales", "No existen"],
  },
  {
    id: "delivery_03_10",
    label: "¿Hay dependencia crítica de personas clave en el delivery?",
    type: "single_select",
    helper: "Si el delivery manager o account manager no está disponible 2 semanas, ¿qué impacto tendría?",
    options: ["Parálisis total", "Impacto alto", "Impacto moderado", "Mínimo impacto"],
  },
  {
    id: "delivery_03_11",
    label: "¿Qué roles o personas concentran más conocimiento crítico?",
    type: "textarea",
  },

  // ── Sección 04: Atención al Cliente y Comunicación ────────────────────────
  {
    id: "delivery_04_01",
    label: "¿Qué canales usáis para comunicaros con los clientes durante el delivery?",
    type: "multi_select",
    helper: "Selecciona todos los canales que utilizáis habitualmente",
    options: [
      { value: "Email", description: "Comunicación principal por correo electrónico" },
      { value: "Teléfono", description: "Llamadas de voz para seguimiento o soporte" },
      { value: "WhatsApp / Telegram", description: "Mensajería instantánea con clientes" },
      { value: "Slack / Discord", description: "Canales compartidos con el cliente" },
      { value: "Portal de cliente", description: "Área privada donde el cliente ve su proyecto" },
      { value: "Videollamadas (Zoom, Meet, Teams)", description: "Reuniones virtuales periódicas" },
      { value: "Otro", description: "Especifica en el campo siguiente" },
    ],
  },
  {
    id: "delivery_04_02",
    label: "Otros canales de comunicación",
    type: "textarea",
  },
  {
    id: "delivery_04_03",
    label: "¿Hay tareas repetitivas en la atención al cliente?",
    type: "single_select",
    options: ["Sí, muchas repetitivas", "No, cada caso es único"],
  },
  {
    id: "delivery_04_04",
    label: "¿Cuáles son las tareas/preguntas más repetitivas?",
    type: "textarea",
  },
  {
    id: "delivery_04_05",
    label: "¿Se repiten siempre las mismas dudas? ¿Podrían resolverse automáticamente?",
    type: "single_select",
    options: [
      "Sí, ya automatizadas",
      "Sí, podrían serlo",
      "Algunas sí, otras no",
      "Requieren humano",
    ],
  },
  {
    id: "delivery_04_06",
    label: "¿El cliente recibe comunicaciones automatizadas?",
    type: "single_select",
    options: ["Sí, tenemos automatizaciones", "No, todo es manual"],
  },
  {
    id: "delivery_04_07",
    label: "¿Qué emails/documentos automatizados enviáis actualmente?",
    type: "textarea",
  },
  {
    id: "delivery_04_08",
    label: "¿Existen secuencias de bienvenida o progresión para el cliente?",
    type: "single_select",
    options: ["Sí, completas", "Sí, básicas", "No, pero queremos", "No tenemos"],
  },
  {
    id: "delivery_04_09",
    label: "¿Qué tareas de delivery se realizan actualmente de forma manual y repetitiva?",
    type: "multi_select",
    options: [
      { value: "Administración / Documentación", description: "Crear contratos, rellenar datos, generar documentos" },
      { value: "Comunicación con cliente", description: "Emails de seguimiento, actualizaciones de estado, recordatorios" },
      { value: "Gestión de tareas / proyectos", description: "Crear tareas, asignar responsables, actualizar estados" },
      { value: "Generación de informes", description: "Reportes de progreso, dashboards, métricas" },
      { value: "Otra categoría", description: "Especifica en el campo siguiente" },
    ],
  },
  {
    id: "delivery_04_10",
    label: "Detalle de otras tareas manuales",
    type: "textarea",
  },
  {
    id: "delivery_04_11",
    label: "Si fueras un cliente, ¿qué parte del proceso te parecería más confusa o lenta?",
    type: "textarea",
  },

  // ── Sección 05: Volumen, KPIs y Satisfacción ──────────────────────────────
  {
    id: "delivery_05_01",
    label: "¿Cuántas peticiones o solicitudes de clientes gestionáis?",
    type: "number_group",
    helper: "Incluye emails, tickets, llamadas, mensajes de clientes...",
    fields: ["Por semana", "Por día (promedio)", "Por hora (pico)"],
  },
  {
    id: "delivery_05_02",
    label: "¿Qué KPIs de delivery medís actualmente?",
    type: "textarea",
  },
  {
    id: "delivery_05_03",
    label: "¿Tenéis encuestas o medición de satisfacción del cliente?",
    type: "single_select",
    options: ["Sí, automatizadas", "Sí, manuales", "A veces", "No medimos"],
  },
  {
    id: "delivery_05_04",
    label: "Estado de Reseñas en Google My Business",
    type: "textarea",
  },
  {
    id: "delivery_05_05",
    label: "¿Cuál es el tiempo de respuesta actual a solicitudes de clientes?",
    type: "single_select",
    helper: "Selecciona el tiempo promedio",
    options: [
      "Menos de 1 hora",
      "1 - 4 horas",
      "Mismo día",
      "Siguiente día laborable",
      "2 - 5 días",
      "Más de una semana",
    ],
  },
  {
    id: "delivery_05_06",
    label: "¿Quién recibe las notificaciones en cada área?",
    type: "textarea",
  },
  {
    id: "delivery_05_07",
    label: "¿Tenéis picos de demanda estacionales?",
    type: "single_select",
    options: ["Sí, hay estacionalidad", "No, bastante estable"],
  },
  {
    id: "delivery_05_08",
    label: "Detalle de estacionalidad",
    type: "textarea",
  },
  {
    id: "delivery_05_09",
    label: "¿Cuándo son los picos de demanda?",
    type: "textarea",
  },

  // ── Sección 06: Automatizaciones e IA Actuales ────────────────────────────
  {
    id: "delivery_06_01",
    label: "¿Tenéis automatizaciones o IA integrada actualmente?",
    type: "single_select",
    options: ["Sí, tenemos algunas", "No, aún no"],
  },
  {
    id: "delivery_06_02",
    label: "Detalles de tus automatizaciones actuales",
    type: "textarea",
  },
  {
    id: "delivery_06_03",
    label: "¿Cuáles son vuestras automatizaciones actuales?",
    type: "textarea",
  },
  {
    id: "delivery_06_04",
    label: "¿Qué infraestructura o herramientas utilizáis para automatizar?",
    type: "textarea",
  },
  {
    id: "delivery_06_05",
    label: "¿Hay supervisión humana en las automatizaciones críticas?",
    type: "single_select",
    options: ["Siempre supervisión", "Solo en críticas", "100% automático"],
  },
  {
    id: "delivery_06_06",
    label: "¿Están todas las automatizaciones funcionando de forma óptima?",
    type: "scale",
    helper: "Escala aproximada desde 'necesitan mejoras' hasta 'totalmente optimizadas'",
  },
  {
    id: "delivery_06_07",
    label: "¿Qué problemas o limitaciones tenéis con las automatizaciones actuales?",
    type: "textarea",
  },
  {
    id: "delivery_06_08",
    label: "¿Cuál es el coste operativo mensual de las herramientas de automatización?",
    type: "currency",
    currency: "EUR",
  },
  {
    id: "delivery_06_09",
    label: "Contexto adicional",
    type: "textarea",
  },
  {
    id: "delivery_06_10",
    label: "¿Por qué no habéis implementado automatizaciones hasta ahora?",
    type: "multi_select",
    options: [
      "Falta de tiempo",
      "Falta de conocimiento técnico",
      "Limitación de presupuesto",
      "Lo intentamos pero no funcionó",
      "No era prioridad hasta ahora",
    ],
  },

  // ── Sección 07: Equipos, Preferencias y Criterios de Éxito ───────────────
  {
    id: "delivery_07_01",
    label: "¿Qué otros departamentos interactúan directamente con el área de delivery?",
    type: "multi_select",
    options: [
      { value: "Ventas / Comercial", description: "Traspaso de clientes, información de venta" },
      { value: "Soporte / Atención al cliente", description: "Incidencias, escalaciones, feedback" },
      { value: "Finanzas / Administración", description: "Facturación, cobros, presupuestos" },
      { value: "Marketing", description: "Casos de éxito, testimonios, comunicación" },
      { value: "Producto / Desarrollo", description: "Feedback de clientes, bugs, mejoras" },
      { value: "IT / Sistemas", description: "Configuraciones, integraciones técnicas" },
    ],
  },
  {
    id: "delivery_07_02",
    label: "¿Hay fricciones o pérdidas de información entre áreas?",
    type: "textarea",
  },
  {
    id: "delivery_07_03",
    label: "¿Hay herramientas o tecnologías que preferís utilizar o evitar?",
    type: "multi_select",
    options: [
      "Preferimos herramientas no-code / low-code",
      "Preferimos herramientas en español",
      "Solo herramientas con datos en la UE",
      "Debe integrarse con nuestras herramientas actuales",
      "Priorizamos soluciones de bajo coste",
    ],
  },
  {
    id: "delivery_07_04",
    label: "Detalle de preferencias o restricciones tecnológicas",
    type: "textarea",
  },
  {
    id: "delivery_07_05",
    label: "¿Cómo reacciona el equipo ante la adopción de nuevas herramientas o procesos?",
    type: "single_select",
    options: [
      "Muy abiertos al cambio",
      "Les cuesta pero se adaptan",
      "Hay resistencia o falta tiempo",
      "No lo hemos intentado aún",
    ],
  },
  {
    id: "delivery_07_06",
    label: "¿Cómo definiríais el éxito de esta auditoría?",
    type: "textarea",
  },
  {
    id: "delivery_07_07",
    label: "¿Hay algún requisito imprescindible o deal breaker?",
    type: "textarea",
  },
  {
    id: "delivery_07_08",
    label: "¿Tenéis políticas de ciberseguridad que debamos conocer?",
    type: "single_select",
    options: ["Sí, políticas estrictas", "Básicas / estándar", "No formalizadas"],
  },
  {
    id: "delivery_07_09",
    label: "Detalle de políticas de seguridad (si aplica)",
    type: "textarea",
  },
  {
    id: "delivery_07_10",
    label: "¿Quién aprueba los accesos y permisos en vuestra empresa?",
    type: "textarea",
  },

  // ── Sección 08: Validación del Proceso Actual ─────────────────────────────
  {
    id: "delivery_08_01",
    label: "Cuéntanos el proceso de entrega desde cero, como si fueras tú el cliente",
    type: "textarea",
  },
  {
    id: "delivery_08_02",
    label: "¿Hay pasos que no están escritos pero se hacen siempre?",
    type: "textarea",
  },
  {
    id: "delivery_08_03",
    label: "¿Qué suele pasar cuando algo sale mal?",
    type: "textarea",
  },
  {
    id: "delivery_08_04",
    label: "¿Hay roles ocultos o fuera del radar que participan en el delivery?",
    type: "textarea",
  },

  // ── Sección 09: Excepciones y Casos Especiales ────────────────────────────
  {
    id: "delivery_09_01",
    label: "¿Tenéis procesos diferentes para ciertos tipos de clientes o servicios?",
    type: "single_select",
    options: ["Sí, tenemos variantes", "No, mismo proceso para todos"],
  },
  {
    id: "delivery_09_02",
    label: "Describe las variaciones del proceso según tipo de cliente/servicio",
    type: "textarea",
  },
  {
    id: "delivery_09_03",
    label: "¿Qué hacéis si el cliente no responde?",
    type: "textarea",
  },
  {
    id: "delivery_09_04",
    label: "¿Cómo se manejan entregas urgentes o fuera de proceso?",
    type: "textarea",
  },
  {
    id: "delivery_09_05",
    label: "¿Hay decisiones que se toman sobre la marcha sin criterios claros?",
    type: "textarea",
  },

  // ── Sección 10: Puntos de Fricción y Retraso ──────────────────────────────
  {
    id: "delivery_10_01",
    label: "¿En qué parte del proceso suelen aparecer más retrasos?",
    type: "textarea",
  },
  {
    id: "delivery_10_02",
    label: "¿Dónde se pierden tareas o se generan malentendidos?",
    type: "textarea",
  },
  {
    id: "delivery_10_03",
    label: "¿Hay pasos que nadie quiere hacer o que suelen saltarse?",
    type: "textarea",
  },
  {
    id: "delivery_10_04",
    label: "¿Cuáles son las causas más comunes de errores?",
    type: "textarea",
  },
  {
    id: "delivery_10_05",
    label: "¿Qué mejoras rápidas (quick wins) crees que podrían implementarse ya?",
    type: "textarea",
  },

  // ── Sección 11: Seguimiento y Visibilidad ─────────────────────────────────
  {
    id: "delivery_11_01",
    label: "¿Cómo sabéis internamente en qué estado está cada entrega?",
    type: "single_select",
    options: [
      { value: "Sistema centralizado", description: "Todo en una herramienta" },
      { value: "Varias herramientas", description: "Hay que mirar en varios sitios" },
      { value: "Depende de personas", description: "Hay que preguntar a quien lleva el proyecto" },
      { value: "No tenemos visibilidad clara", description: "Cuesta saber el estado real" },
    ],
  },
  {
    id: "delivery_11_02",
    label: "¿Qué herramientas usáis para el seguimiento interno?",
    type: "textarea",
  },
  {
    id: "delivery_11_03",
    label: "¿El cliente tiene visibilidad del estado de su proyecto?",
    type: "single_select",
    options: [
      "Sí, portal/dashboard",
      "Solo por emails que enviamos",
      "Tiene que preguntar",
      "Acceso a herramienta compartida",
    ],
  },
  {
    id: "delivery_11_04",
    label: "¿Se documenta cada paso o depende de las personas?",
    type: "textarea",
  },
  {
    id: "delivery_11_05",
    label: "¿Qué información te gustaría ver en un dashboard ideal?",
    type: "textarea",
  },

  // ── Sección 12: Capacidad del Equipo y Delegación ─────────────────────────
  {
    id: "delivery_12_01",
    label: "¿Qué pasa si alguien del equipo clave se va o se enferma?",
    type: "textarea",
  },
  {
    id: "delivery_12_02",
    label: "¿Tenéis SOPs o documentación interna por cada flujo?",
    type: "single_select",
    options: [
      "Sí, bien documentados",
      "Algunos flujos",
      "Existen pero desactualizados",
      "No tenemos",
    ],
  },
  {
    id: "delivery_12_03",
    label: "¿Qué tareas podrías delegar hoy si estuvieran mejor estructuradas?",
    type: "textarea",
  },
  {
    id: "delivery_12_04",
    label: "¿Hay gaps de formación interna que afecten al delivery?",
    type: "textarea",
  },

  // ── Sección 13: Proceso Ideal y Visión ────────────────────────────────────
  {
    id: "delivery_13_01",
    label: "Si pudieras rediseñar el proceso desde cero, ¿qué cambiarías?",
    type: "textarea",
  },
  {
    id: "delivery_13_02",
    label: "¿Dónde ves más potencial de mejora o ahorro de tiempo?",
    type: "textarea",
  },
  {
    id: "delivery_13_03",
    label: "¿Qué parte te gustaría que fuera completamente automática?",
    type: "textarea",
  },
  {
    id: "delivery_13_04",
    label: "¿Tenéis algún roadmap tecnológico o planes de cambio previstos?",
    type: "textarea",
  },

  // ── Sección 14: Tecnología y Usabilidad ──────────────────────────────────
  {
    id: "delivery_14_01",
    label: "¿Qué herramienta usas más a diario? ¿Cuál te resulta más difícil?",
    type: "textarea",
  },
  {
    id: "delivery_14_02",
    label: "¿Dónde sentís que hacéis doble trabajo entre herramientas?",
    type: "textarea",
  },
  {
    id: "delivery_14_03",
    label: "¿Qué herramienta te gustaría reemplazar o mejorar?",
    type: "textarea",
  },
  {
    id: "delivery_14_04",
    label: "¿Qué integraciones entre herramientas te gustaría tener?",
    type: "textarea",
  },
  {
    id: "delivery_14_05",
    label: "¿Cuáles son las principales frustraciones tecnológicas del equipo?",
    type: "textarea",
  },

  // ── Sección 15: Comunicación con Cliente y Feedback ──────────────────────
  {
    id: "delivery_15_01",
    label: "¿Qué feedback te suelen dar los clientes sobre el proceso de entrega?",
    type: "textarea",
  },
  {
    id: "delivery_15_02",
    label: "¿Los clientes se sienten informados y acompañados?",
    type: "single_select",
    options: [
      "Muy satisfechos",
      "Satisfechos en general",
      "Hay margen de mejora",
      "Frecuentes quejas",
    ],
  },
  {
    id: "delivery_15_03",
    label: "¿Hay quejas frecuentes o preguntas que se repiten?",
    type: "textarea",
  },
  {
    id: "delivery_15_04",
    label: "¿Qué oportunidades ves para mejorar la comunicación con cliente?",
    type: "textarea",
  },

  // ── Sección AD: Comentarios Adicionales ──────────────────────────────────
  {
    id: "delivery_ad_01",
    label: "¿Cuáles son tus principales prioridades o dolores operativos?",
    type: "textarea",
  },
  {
    id: "delivery_ad_02",
    label: "¿Qué esperas conseguir con esta auditoría?",
    type: "textarea",
  },
  {
    id: "delivery_ad_03",
    label: "¿Algo más que debamos saber?",
    type: "textarea",
  },
];

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default function DeliveryPage({ searchParams }: PageProps) {
  const accessKey =
    typeof searchParams.access === "string" ? searchParams.access : undefined;

  return (
    <OnboardingPage
      area="delivery"
      areaTitle="Auditoría del Área de Delivery"
      areaSubtitle="Comprender cómo se entrega el producto o servicio para optimizar procesos de entrega, escalar sin perder calidad ni control y sin sobrecargar al equipo."
      questions={questions}
      accessKey={accessKey}
    />
  );
}
