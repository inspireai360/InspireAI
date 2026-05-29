import OnboardingPage from "../_components/OnboardingPage";
import type { Question } from "../_components/OnboardingForm";

export const metadata = {
  title: "Auditoría de Administración y Documentación | InspireAI",
  robots: "noindex, nofollow",
};

const questions: Question[] = [
  // ── Sección 01: Datos de la Empresa y Estructura Administrativa ──────────
  {
    id: "administracion_documentacion_01_01",
    label: "Nombre de la empresa",
    type: "text",
    required: true,
    helper: "Indica el nombre legal o comercial de tu empresa",
  },
  {
    id: "administracion_documentacion_01_02",
    label: "Área a auditar",
    type: "fixed",
    value: "Administración y Documentación",
    helper: "Campo fijo del cuestionario de administración y documentación",
  },
  {
    id: "administracion_documentacion_01_03",
    label: "Tu rol en la empresa",
    type: "single_select",
    options: [
      "CEO / Fundador",
      "CFO / Director Financiero",
      "Director de Administración",
      "Office Manager",
      "Controller / Responsable Contable",
      "Responsable Legal / Compliance",
      "RRHH / Administración de Personal",
      "Otro",
    ],
  },
  {
    id: "administracion_documentacion_01_04",
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
    id: "administracion_documentacion_01_05",
    label: "Organigrama / Estructura del equipo administrativo",
    type: "textarea",
    helper: "Describe la estructura del área de administración: quién reporta a quién, funciones principales, etc.",
  },
  {
    id: "administracion_documentacion_01_06",
    label: "Roles involucrados en la gestión administrativa y documental diaria",
    type: "textarea",
    helper: "Lista todos los roles/personas que participan en procesos administrativos, facturación, archivo y documentación",
  },

  // ── Sección 02: Herramientas y Gestión Documental ─────────────────────────
  {
    id: "administracion_documentacion_02_01",
    label: "¿Qué herramientas utilizáis para gestión administrativa y documental?",
    type: "multi_select",
    helper: "Selecciona todas las herramientas donde almacenáis documentos, facturas, contratos, etc.",
    options: [
      { value: "Google Drive / OneDrive / Dropbox", description: "Almacenamiento de documentos, contratos, archivos compartidos" },
      { value: "ERP / Software de gestión (Holded, A3, Sage, SAP)", description: "Facturación, contabilidad, gestión empresarial integrada" },
      { value: "Software de facturación (Factusol, Billin, Quipu)", description: "Emisión de facturas, presupuestos, albaranes" },
      { value: "Firma digital (DocuSign, Signaturit, Adobe Sign)", description: "Firma electrónica de contratos y documentos" },
      { value: "Gestor documental (M-Files, Alfresco, DocuWare)", description: "Sistema especializado de gestión documental y archivo" },
      { value: "Hojas de cálculo (Excel / Google Sheets)", description: "Control de facturas, seguimiento de pagos, listados" },
      { value: "Email (Gmail, Outlook)", description: "Recepción de facturas, comunicación con proveedores/clientes" },
      { value: "Archivo físico / Documentación en papel", description: "Archivadores, carpetas físicas, documentos originales" },
      { value: "Otras herramientas", description: "Especifica cualquier otra herramienta relevante abajo" },
    ],
  },
  {
    id: "administracion_documentacion_02_02",
    label: "Otras herramientas utilizadas",
    type: "textarea",
    helper: "Si usáis herramientas adicionales no listadas, indícalas aquí",
  },
  {
    id: "administracion_documentacion_02_03",
    label: "¿Podréis darnos acceso de lectura a las herramientas relevantes?",
    type: "single_select",
    helper: "Necesitamos acceso temporal para analizar flujos documentales, no modificaremos nada",
    options: ["Sí, sin problema", "Solo algunas", "Necesito consultar"],
  },
  {
    id: "administracion_documentacion_02_04",
    label: "¿Existe una fuente de verdad única para la documentación?",
    type: "single_select",
    helper: "¿Hay un sistema central donde se consolida toda la documentación importante o está dispersa en múltiples lugares?",
    options: ["Sí, centralizado", "Parcialmente", "No, dispersa"],
  },
  {
    id: "administracion_documentacion_02_05",
    label: "¿Qué porcentaje de vuestra documentación está digitalizada?",
    type: "single_select",
    helper: "Considera facturas, contratos, albaranes, documentación de empleados, etc.",
    options: ["0-25% digital", "26-50% digital", "51-75% digital", "76-100% digital"],
  },

  // ── Sección 03: Flujos Documentales y Procesos Administrativos ───────────
  {
    id: "administracion_documentacion_03_01",
    label: "¿Tenéis procedimientos documentados para la gestión administrativa?",
    type: "single_select",
    helper: "Procedimientos escritos para facturación, archivo, aprobaciones, gestión de contratos, etc.",
    options: [
      "Sí, bien documentados",
      "Algunos procesos",
      "Solo informales",
      "No existen",
    ],
  },
  {
    id: "administracion_documentacion_03_02",
    label: "Describe los principales flujos de trabajo administrativos",
    type: "textarea",
    helper: "Describe paso a paso cómo funcionan vuestros procesos principales de gestión documental",
  },
  {
    id: "administracion_documentacion_03_03",
    label: "¿Cómo gestionáis las aprobaciones y firmas?",
    type: "single_select",
    helper: "¿Existen niveles de aprobación? ¿Se usan firmas digitales o físicas?",
    options: [
      "Digital automatizado",
      "Digital pero manual",
      "Mixto (digital + papel)",
      "Principalmente en papel",
    ],
  },
  {
    id: "administracion_documentacion_03_04",
    label: "¿Hay dependencia crítica de personas clave en administración?",
    type: "single_select",
    helper: "Si la persona de administración no está disponible 2 semanas, ¿qué impacto tendría en facturas, pagos, contratos?",
    options: ["Parálisis total", "Impacto alto", "Impacto moderado", "Mínimo impacto"],
  },
  {
    id: "administracion_documentacion_03_05",
    label: "¿Qué conocimiento crítico está concentrado en pocas personas?",
    type: "textarea",
    helper: "¿Qué procesos o información solo conoce una persona? Contraseñas, accesos, procedimientos especiales...",
  },

  // ── Sección 04: Tareas Administrativas a Mejorar ─────────────────────────
  {
    id: "administracion_documentacion_04_01",
    label: "Ejemplos concretos de tareas administrativas que queréis mejorar",
    type: "textarea",
    helper: "Describe 3-5 tareas específicas relacionadas con documentación, facturación o archivo que os gustaría optimizar",
  },
  {
    id: "administracion_documentacion_04_02",
    label: "¿Qué tareas documentales se realizan manualmente de forma repetitiva?",
    type: "textarea",
    helper: "Describe las tareas que se repiten diaria o semanalmente y que consumen tiempo del equipo administrativo",
  },
  {
    id: "administracion_documentacion_04_03",
    label: "¿Dónde se producen los principales cuellos de botella documentales?",
    type: "textarea",
    helper: "¿Qué procesos o aprobaciones ralentizan la gestión documental? ¿Dónde se acumulan documentos pendientes?",
  },
  {
    id: "administracion_documentacion_04_04",
    label: "Estimación de tiempo dedicado a tareas administrativas manuales",
    type: "single_select",
    helper: "¿Cuántas horas semanales estimas que el equipo dedica a tareas documentales repetitivas?",
    options: [
      "1 - 5 horas/semana",
      "6 - 15 horas/semana",
      "16 - 30 horas/semana",
      "31 - 50 horas/semana",
      "Más de 50 horas/semana",
    ],
  },
  {
    id: "administracion_documentacion_04_05",
    label: "¿Qué tareas administrativas crees que podría realizar una IA?",
    type: "textarea",
    helper: "Piensa en extracción de datos de facturas, clasificación de documentos, generación de informes, respuesta a consultas...",
  },

  // ── Sección 05: Volumen Documental y KPIs ────────────────────────────────
  {
    id: "administracion_documentacion_05_01",
    label: "¿Cuántas facturas y documentos gestionáis?",
    type: "number_group",
    helper: "Incluye facturas emitidas, facturas recibidas, contratos, albaranes y otros documentos administrativos",
    fields: ["Facturas emitidas / mes", "Facturas recibidas / mes", "Contratos activos"],
  },
  {
    id: "administracion_documentacion_05_02",
    label: "¿Qué KPIs o métricas medís actualmente en administración?",
    type: "textarea",
    helper: "Indicadores clave que utilizáis para medir el rendimiento del área administrativa",
  },
  {
    id: "administracion_documentacion_05_03",
    label: "¿Cuál es el tiempo medio de procesamiento de una factura?",
    type: "single_select",
    helper: "Desde que llega una factura hasta que está registrada y archivada",
    options: ["Mismo día", "1 - 2 días", "3 - 5 días", "Más de una semana", "Muy variable"],
  },
  {
    id: "administracion_documentacion_05_04",
    label: "¿Quién gestiona cada tipo de documentación?",
    type: "textarea",
    helper: "Describe cómo está repartida la responsabilidad de los diferentes tipos de documentos",
  },
  {
    id: "administracion_documentacion_05_05",
    label: "¿Tenéis picos de trabajo administrativo?",
    type: "single_select",
    helper: "¿Hay momentos del mes/año donde el volumen de documentación aumenta significativamente?",
    options: ["Sí, hay picos", "No, bastante estable"],
  },
  {
    id: "administracion_documentacion_05_06",
    label: "Detalle de picos de trabajo",
    type: "textarea",
  },
  {
    id: "administracion_documentacion_05_07",
    label: "¿Cuándo son los picos de trabajo administrativo?",
    type: "textarea",
  },

  // ── Sección 06: Automatizaciones e IA Actuales ────────────────────────────
  {
    id: "administracion_documentacion_06_01",
    label: "¿Tenéis automatizaciones en procesos administrativos actualmente?",
    type: "single_select",
    helper: "Incluye cualquier tipo de automatización: OCR de facturas, workflows de aprobación, alertas automáticas, etc.",
    options: ["Sí, tenemos algunas", "No, aún no"],
  },
  {
    id: "administracion_documentacion_06_02",
    label: "Detalles de tus automatizaciones actuales",
    type: "textarea",
  },
  {
    id: "administracion_documentacion_06_03",
    label: "¿Cuáles son vuestras automatizaciones actuales en administración?",
    type: "textarea",
    helper: "Describe qué procesos documentales tenéis automatizados",
  },
  {
    id: "administracion_documentacion_06_04",
    label: "¿Qué herramientas utilizáis para automatizar?",
    type: "textarea",
    helper: "Software con OCR, integraciones entre sistemas, etc.",
  },
  {
    id: "administracion_documentacion_06_05",
    label: "¿Hay revisión humana en los procesos automatizados críticos?",
    type: "single_select",
    helper: "¿Se revisan manualmente las facturas leídas por OCR antes de contabilizarlas? ¿Se aprueban pagos automáticos?",
    options: ["Siempre revisión", "Solo en críticos", "100% automático"],
  },
  {
    id: "administracion_documentacion_06_06",
    label: "¿Funcionan bien las automatizaciones actuales?",
    type: "scale",
    helper: "Arrastra el slider para indicar el nivel de satisfacción. Escala aproximada de muchos errores a funcionan perfectamente.",
  },
  {
    id: "administracion_documentacion_06_07",
    label: "¿Qué problemas tenéis con las automatizaciones actuales?",
    type: "textarea",
  },
  {
    id: "administracion_documentacion_06_08",
    label: "¿Cuál es el coste mensual de las herramientas de automatización?",
    type: "currency",
    currency: "EUR",
    helper: "Suma de suscripciones a software de facturación, OCR, firma digital, etc.",
  },
  {
    id: "administracion_documentacion_06_09",
    label: "Contexto adicional",
    type: "textarea",
  },
  {
    id: "administracion_documentacion_06_10",
    label: "¿Por qué no habéis automatizado procesos administrativos hasta ahora?",
    type: "multi_select",
    options: [
      { value: "Falta de tiempo", description: "El día a día no deja margen para proyectos de mejora" },
      { value: "Falta de conocimiento", description: "No sabemos qué herramientas usar o por dónde empezar" },
      { value: "Limitación de presupuesto", description: "No hemos priorizado inversión en este área" },
      { value: "Lo intentamos pero no funcionó", description: "Probamos herramientas pero no dieron buen resultado" },
      { value: "No era prioridad hasta ahora", description: "Otras áreas del negocio tenían más urgencia" },
    ],
  },

  // ── Sección 07: Criterios de Éxito, Cumplimiento y Seguridad ─────────────
  {
    id: "administracion_documentacion_07_01",
    label: "¿Cómo definiríais el éxito de esta auditoría?",
    type: "textarea",
    helper: "¿Qué resultados concretos esperáis obtener en la gestión documental y administrativa?",
  },
  {
    id: "administracion_documentacion_07_02",
    label: "¿Hay requisitos imprescindibles o restricciones?",
    type: "textarea",
    helper: "Requisitos legales, de auditoría, técnicos o de presupuesto que debamos conocer",
  },
  {
    id: "administracion_documentacion_07_03",
    label: "¿Qué normativas de cumplimiento os aplican?",
    type: "multi_select",
    helper: "Selecciona todas las normativas o estándares que debéis cumplir",
    options: [
      { value: "RGPD / LOPD-GDD", description: "Protección de datos personales" },
      { value: "Factura electrónica obligatoria", description: "Ley Crea y Crece, facturación B2B" },
      { value: "Conservación fiscal de documentos", description: "Obligación de guardar facturas y documentación contable" },
      { value: "Auditoría externa / SOC", description: "Requisitos de auditores externos, controles internos" },
      { value: "Normativa sectorial específica", description: "Sanidad, finanzas, seguros, administración pública, etc." },
      { value: "No estoy seguro", description: "Necesito asesoramiento sobre qué normativas nos aplican" },
    ],
  },
  {
    id: "administracion_documentacion_07_04",
    label: "¿Tenéis políticas de seguridad documental?",
    type: "single_select",
    helper: "Control de acceso a documentos sensibles, clasificación de información, políticas de retención",
    options: ["Sí, formalizadas", "Básicas / informales", "No tenemos"],
  },
  {
    id: "administracion_documentacion_07_05",
    label: "Detalle de políticas de seguridad documental (si aplica)",
    type: "textarea",
    helper: "Describe cómo controláis el acceso a documentos sensibles, políticas de backup, etc.",
  },
  {
    id: "administracion_documentacion_07_06",
    label: "¿Quién autoriza el acceso a documentación sensible?",
    type: "textarea",
    helper: "Persona o rol responsable de autorizar accesos a documentos confidenciales",
  },

  // ── Sección AD: Comentarios Adicionales ──────────────────────────────────
  {
    id: "administracion_documentacion_ad_01",
    label: "¿Cuáles son tus principales \"dolores\" en gestión documental?",
    type: "textarea",
    helper: "¿Qué te gustaría resolver de forma prioritaria? ¿Qué te quita el sueño?",
  },
  {
    id: "administracion_documentacion_ad_02",
    label: "¿Qué esperas conseguir con esta auditoría?",
    type: "textarea",
    helper: "Ayúdanos a alinear expectativas y enfocar el diagnóstico",
  },
  {
    id: "administracion_documentacion_ad_03",
    label: "¿Algo más que debamos saber?",
    type: "textarea",
  },
];

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default function OperacionesPage({ searchParams }: PageProps) {
  const accessKey =
    typeof searchParams.access === "string" ? searchParams.access : undefined;

  return (
    <OnboardingPage
      area="operaciones"
      areaTitle="Auditoría de Administración y Documentación"
      areaSubtitle="Analizaremos cómo gestionáis la documentación, los procesos administrativos y el cumplimiento normativo para identificar oportunidades de automatización y mejora operativa."
      questions={questions}
      accessKey={accessKey}
    />
  );
}
