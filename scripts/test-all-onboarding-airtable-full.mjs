// QA script: full Airtable submission test for all 4 onboarding forms
// Usage: node scripts/test-all-onboarding-airtable-full.mjs
// Requires dev server running on localhost:3000

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '..', '.env.local');
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(l => l.trim() && !l.startsWith('#') && l.includes('='))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);

const AIRTABLE_TOKEN = env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = env.AIRTABLE_BASE_ID;
const ENDPOINT = 'http://localhost:3000/api/onboarding/submit';
const ACCESS_KEY = env.ONBOARDING_ACCESS_KEY;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function optVal(opt) { return typeof opt === 'string' ? opt : opt.value; }

function makeAnswer(q) {
  const long = `QA respuesta completa para ${q.id}. Esta es una respuesta larga de validacion para verificar que el contenido llega a Airtable sin truncar. El sistema debe guardar todos los detalles en Observaciones y Respuestas JSON correctamente incluyendo esta respuesta de la pregunta con identificador ${q.id}.`;
  switch (q.type) {
    case 'text':    return `QA texto para ${q.id}`;
    case 'textarea': return long;
    case 'email':   return 'qa@inspireai.test';
    case 'number':  return '42';
    case 'currency': return '2500';
    case 'percentage': return '75';
    case 'scale':   return '4';
    case 'single_select':
    case 'radio':   return q.options && q.options.length > 0 ? optVal(q.options[0]) : 'Opcion QA';
    case 'multi_select':
      return q.options ? q.options.slice(0, 2).map(optVal).join(',') : 'Opcion1 QA,Opcion2 QA';
    case 'number_group':
      return (q.fields ?? []).map((f, i) => `${f}: ${(i + 1) * 100}`).join(' | ');
    default: return `QA answer for ${q.id}`;
  }
}

function buildPayload(area, questions) {
  const nonFixed = questions.filter(q => q.type !== 'fixed');
  const respuestasDetalladas = nonFixed.map(q => ({
    id: q.id, label: q.label, type: q.type, answer: makeAnswer(q),
  }));
  const respuestas = Object.fromEntries(respuestasDetalladas.map(r => [r.id, r.answer]));
  const label = area.charAt(0).toUpperCase() + area.slice(1);
  return {
    accessKey: ACCESS_KEY, area,
    empresa: `QA Full Test ${label}`,
    contacto: 'QA InspireAI',
    email: `qa+${area}@inspireai.test`,
    telefono: '+34 600 000 000',
    respuestas, respuestasDetalladas,
    observaciones: `Observaciones adicionales QA para el area de ${area}. Verificando que toda la informacion llega correctamente a Airtable sin perdida de datos ni truncado.`,
  };
}

async function submitForm(area, questions) {
  const payload = buildPayload(area, questions);
  const res = await fetch(ENDPOINT, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(`Submit fallo: ${data.error}`);
  return { recordId: data.recordId, sent: payload.respuestasDetalladas.length };
}

async function getRecord(tableName, recordId) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(tableName)}/${recordId}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` } });
  if (!res.ok) { const b = await res.text(); throw new Error(`GET ${res.status}: ${b.slice(0, 200)}`); }
  const data = await res.json();
  return data.fields;
}

async function deleteRecord(tableName, recordId) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(tableName)}/${recordId}`;
  const res = await fetch(url, { method: 'DELETE', headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` } });
  if (!res.ok) { const b = await res.text(); throw new Error(`DELETE ${res.status}: ${b.slice(0, 200)}`); }
  return (await res.json()).deleted;
}

// ─── Questions: DELIVERY (103 total, 1 fixed = 102 in respuestasDetalladas) ──

const DELIVERY_QUESTIONS = [
  { id: 'delivery_01_01', label: 'Nombre de la empresa', type: 'text' },
  { id: 'delivery_01_02', label: 'Area a auditar', type: 'fixed' },
  { id: 'delivery_01_03', label: 'Tu rol en la empresa', type: 'single_select', options: ['CEO / Fundador','COO / Director de Operaciones','Delivery Manager','Customer Success Manager','Project Manager','Account Manager','Otro'] },
  { id: 'delivery_01_04', label: 'Tamano del equipo', type: 'single_select', options: ['1 - 5 empleados','6 - 15 empleados','16 - 50 empleados','51 - 100 empleados','Mas de 100 empleados'] },
  { id: 'delivery_01_05', label: 'Que producto o servicio entregais?', type: 'textarea' },
  { id: 'delivery_01_06', label: 'Organigrama / Estructura del equipo de delivery', type: 'textarea' },
  { id: 'delivery_01_07', label: 'Roles involucrados en el proceso de delivery', type: 'textarea' },
  { id: 'delivery_02_01', label: 'Que herramientas utilizais para el control del delivery?', type: 'multi_select', options: [{value:'ClickUp'},{value:'Asana'},{value:'Trello'},{value:'Monday.com'},{value:'Notion'},{value:'HubSpot / CRM'},{value:'Intercom / Zendesk / Freshdesk'},{value:'Hojas de calculo (Excel / Google Sheets)'},{value:'Otras herramientas'}] },
  { id: 'delivery_02_02', label: 'Otras herramientas utilizadas', type: 'textarea' },
  { id: 'delivery_02_03', label: 'Podreis darnos acceso de lectura a las herramientas relevantes?', type: 'single_select', options: ['Si, sin problema','Solo algunas','Necesito consultar'] },
  { id: 'delivery_02_04', label: 'Escenario tecnologico actual', type: 'textarea' },
  { id: 'delivery_02_05', label: 'Existe una base de datos del sistema actual?', type: 'single_select', options: ['Si, podemos exportar','No tenemos BD propia','Tengo que verificar'] },
  { id: 'delivery_02_06', label: 'Existe una fuente de verdad unica (Single Source of Truth)?', type: 'single_select', options: ['Si, centralizado','Parcialmente','No, dispersa'] },
  { id: 'delivery_03_01', label: 'Como entregais vuestro producto/servicio?', type: 'textarea' },
  { id: 'delivery_03_02', label: 'Cuales son los tiempos de entrega del servicio?', type: 'textarea' },
  { id: 'delivery_03_03', label: 'Mapeo de la experiencia del cliente (Customer Journey)', type: 'textarea' },
  { id: 'delivery_03_04', label: 'Tienes algun diagrama o esquema del proceso de entrega actual?', type: 'single_select', options: ['Si, lo enviare','No tengo, pero puedo crear uno','No existe ninguno'] },
  { id: 'delivery_03_05', label: 'En que parte del proceso suelen aparecer mas problemas, retrasos o errores?', type: 'multi_select', options: [{value:'Inicio del onboarding'},{value:'Comunicacion entre equipos'},{value:'Fase de produccion/ejecucion'},{value:'Validacion del cliente'},{value:'Soporte post-entrega'},{value:'Otro'}] },
  { id: 'delivery_03_06', label: 'Detalle de los cuellos de botella identificados', type: 'textarea' },
  { id: 'delivery_03_07', label: 'Que nivel de estandarizacion tiene vuestro proceso de delivery?', type: 'single_select', options: [{value:'Muy estandarizado'},{value:'Parcialmente'},{value:'Poco estandarizado'},{value:'No lo se'}] },
  { id: 'delivery_03_08', label: 'Como definirías el nivel de madurez digital de tu empresa en delivery?', type: 'single_select', options: [{value:'Basico'},{value:'Intermedio'},{value:'Avanzado'},{value:'Experto'}] },
  { id: 'delivery_03_09', label: 'Teneis el proceso de delivery documentado?', type: 'single_select', options: ['Si, bien documentados','Algunos flujos','Solo informales','No existen'] },
  { id: 'delivery_03_10', label: 'Hay dependencia critica de personas clave en el delivery?', type: 'single_select', options: ['Paralisis total','Impacto alto','Impacto moderado','Minimo impacto'] },
  { id: 'delivery_03_11', label: 'Que roles o personas concentran mas conocimiento critico?', type: 'textarea' },
  { id: 'delivery_04_01', label: 'Que canales usais para comunicaros con los clientes durante el delivery?', type: 'multi_select', options: [{value:'Email'},{value:'Telefono'},{value:'WhatsApp / Telegram'},{value:'Slack / Discord'},{value:'Portal de cliente'},{value:'Videollamadas (Zoom, Meet, Teams)'},{value:'Otro'}] },
  { id: 'delivery_04_02', label: 'Otros canales de comunicacion', type: 'textarea' },
  { id: 'delivery_04_03', label: 'Hay tareas repetitivas en la atencion al cliente?', type: 'single_select', options: ['Si, muchas repetitivas','No, cada caso es unico'] },
  { id: 'delivery_04_04', label: 'Cuales son las tareas/preguntas mas repetitivas?', type: 'textarea' },
  { id: 'delivery_04_05', label: 'Se repiten siempre las mismas dudas? Podrian resolverse automaticamente?', type: 'single_select', options: ['Si, ya automatizadas','Si, podrian serlo','Algunas si, otras no','Requieren humano'] },
  { id: 'delivery_04_06', label: 'El cliente recibe comunicaciones automatizadas?', type: 'single_select', options: ['Si, tenemos automatizaciones','No, todo es manual'] },
  { id: 'delivery_04_07', label: 'Que emails/documentos automatizados enviáis actualmente?', type: 'textarea' },
  { id: 'delivery_04_08', label: 'Existen secuencias de bienvenida o progresion para el cliente?', type: 'single_select', options: ['Si, completas','Si, basicas','No, pero queremos','No tenemos'] },
  { id: 'delivery_04_09', label: 'Que tareas de delivery se realizan actualmente de forma manual y repetitiva?', type: 'multi_select', options: [{value:'Administracion / Documentacion'},{value:'Comunicacion con cliente'},{value:'Gestion de tareas / proyectos'},{value:'Generacion de informes'},{value:'Otra categoria'}] },
  { id: 'delivery_04_10', label: 'Detalle de otras tareas manuales', type: 'textarea' },
  { id: 'delivery_04_11', label: 'Si fueras un cliente, que parte del proceso te pareceria mas confusa o lenta?', type: 'textarea' },
  { id: 'delivery_05_01', label: 'Cuantas peticiones o solicitudes de clientes gestionais?', type: 'number_group', fields: ['Por semana','Por dia (promedio)','Por hora (pico)'] },
  { id: 'delivery_05_02', label: 'Que KPIs de delivery medis actualmente?', type: 'textarea' },
  { id: 'delivery_05_03', label: 'Teneis encuestas o medicion de satisfaccion del cliente?', type: 'single_select', options: ['Si, automatizadas','Si, manuales','A veces','No medimos'] },
  { id: 'delivery_05_04', label: 'Estado de Resenas en Google My Business', type: 'textarea' },
  { id: 'delivery_05_05', label: 'Cual es el tiempo de respuesta actual a solicitudes de clientes?', type: 'single_select', options: ['Menos de 1 hora','1 - 4 horas','Mismo dia','Siguiente dia laborable','2 - 5 dias','Mas de una semana'] },
  { id: 'delivery_05_06', label: 'Quien recibe las notificaciones en cada area?', type: 'textarea' },
  { id: 'delivery_05_07', label: 'Teneis picos de demanda estacionales?', type: 'single_select', options: ['Si, hay estacionalidad','No, bastante estable'] },
  { id: 'delivery_05_08', label: 'Detalle de estacionalidad', type: 'textarea' },
  { id: 'delivery_05_09', label: 'Cuando son los picos de demanda?', type: 'textarea' },
  { id: 'delivery_06_01', label: 'Teneis automatizaciones o IA integrada actualmente?', type: 'single_select', options: ['Si, tenemos algunas','No, aun no'] },
  { id: 'delivery_06_02', label: 'Detalles de tus automatizaciones actuales', type: 'textarea' },
  { id: 'delivery_06_03', label: 'Cuales son vuestras automatizaciones actuales?', type: 'textarea' },
  { id: 'delivery_06_04', label: 'Que infraestructura o herramientas utilizais para automatizar?', type: 'textarea' },
  { id: 'delivery_06_05', label: 'Hay supervision humana en las automatizaciones criticas?', type: 'single_select', options: ['Siempre supervision','Solo en criticas','100% automatico'] },
  { id: 'delivery_06_06', label: 'Estan todas las automatizaciones funcionando de forma optima?', type: 'scale' },
  { id: 'delivery_06_07', label: 'Que problemas o limitaciones teneis con las automatizaciones actuales?', type: 'textarea' },
  { id: 'delivery_06_08', label: 'Cual es el coste operativo mensual de las herramientas de automatizacion?', type: 'currency' },
  { id: 'delivery_06_09', label: 'Contexto adicional', type: 'textarea' },
  { id: 'delivery_06_10', label: 'Por que no habeis implementado automatizaciones hasta ahora?', type: 'multi_select', options: ['Falta de tiempo','Falta de conocimiento tecnico','Limitacion de presupuesto','Lo intentamos pero no funciono','No era prioridad hasta ahora'] },
  { id: 'delivery_07_01', label: 'Que otros departamentos interactuan directamente con el area de delivery?', type: 'multi_select', options: [{value:'Ventas / Comercial'},{value:'Soporte / Atencion al cliente'},{value:'Finanzas / Administracion'},{value:'Marketing'},{value:'Producto / Desarrollo'},{value:'IT / Sistemas'}] },
  { id: 'delivery_07_02', label: 'Hay fricciones o perdidas de informacion entre areas?', type: 'textarea' },
  { id: 'delivery_07_03', label: 'Hay herramientas o tecnologias que preferis utilizar o evitar?', type: 'multi_select', options: ['Preferimos herramientas no-code / low-code','Preferimos herramientas en espanol','Solo herramientas con datos en la UE','Debe integrarse con nuestras herramientas actuales','Priorizamos soluciones de bajo coste'] },
  { id: 'delivery_07_04', label: 'Detalle de preferencias o restricciones tecnologicas', type: 'textarea' },
  { id: 'delivery_07_05', label: 'Como reacciona el equipo ante la adopcion de nuevas herramientas o procesos?', type: 'single_select', options: ['Muy abiertos al cambio','Les cuesta pero se adaptan','Hay resistencia o falta tiempo','No lo hemos intentado aun'] },
  { id: 'delivery_07_06', label: 'Como definiríais el exito de esta auditoria?', type: 'textarea' },
  { id: 'delivery_07_07', label: 'Hay algun requisito imprescindible o deal breaker?', type: 'textarea' },
  { id: 'delivery_07_08', label: 'Teneis politicas de ciberseguridad que debamos conocer?', type: 'single_select', options: ['Si, politicas estrictas','Basicas / estandar','No formalizadas'] },
  { id: 'delivery_07_09', label: 'Detalle de politicas de seguridad (si aplica)', type: 'textarea' },
  { id: 'delivery_07_10', label: 'Quien aprueba los accesos y permisos en vuestra empresa?', type: 'textarea' },
  { id: 'delivery_08_01', label: 'Cuentanos el proceso de entrega desde cero, como si fueras tu el cliente', type: 'textarea' },
  { id: 'delivery_08_02', label: 'Hay pasos que no estan escritos pero se hacen siempre?', type: 'textarea' },
  { id: 'delivery_08_03', label: 'Que suele pasar cuando algo sale mal?', type: 'textarea' },
  { id: 'delivery_08_04', label: 'Hay roles ocultos o fuera del radar que participan en el delivery?', type: 'textarea' },
  { id: 'delivery_09_01', label: 'Teneis procesos diferentes para ciertos tipos de clientes o servicios?', type: 'single_select', options: ['Si, tenemos variantes','No, mismo proceso para todos'] },
  { id: 'delivery_09_02', label: 'Describe las variaciones del proceso segun tipo de cliente/servicio', type: 'textarea' },
  { id: 'delivery_09_03', label: 'Que haceis si el cliente no responde?', type: 'textarea' },
  { id: 'delivery_09_04', label: 'Como se manejan entregas urgentes o fuera de proceso?', type: 'textarea' },
  { id: 'delivery_09_05', label: 'Hay decisiones que se toman sobre la marcha sin criterios claros?', type: 'textarea' },
  { id: 'delivery_10_01', label: 'En que parte del proceso suelen aparecer mas retrasos?', type: 'textarea' },
  { id: 'delivery_10_02', label: 'Donde se pierden tareas o se generan malentendidos?', type: 'textarea' },
  { id: 'delivery_10_03', label: 'Hay pasos que nadie quiere hacer o que suelen saltarse?', type: 'textarea' },
  { id: 'delivery_10_04', label: 'Cuales son las causas mas comunes de errores?', type: 'textarea' },
  { id: 'delivery_10_05', label: 'Que mejoras rapidas (quick wins) crees que podrian implementarse ya?', type: 'textarea' },
  { id: 'delivery_11_01', label: 'Como sabeis internamente en que estado esta cada entrega?', type: 'single_select', options: [{value:'Sistema centralizado'},{value:'Varias herramientas'},{value:'Depende de personas'},{value:'No tenemos visibilidad clara'}] },
  { id: 'delivery_11_02', label: 'Que herramientas usais para el seguimiento interno?', type: 'textarea' },
  { id: 'delivery_11_03', label: 'El cliente tiene visibilidad del estado de su proyecto?', type: 'single_select', options: ['Si, portal/dashboard','Solo por emails que enviamos','Tiene que preguntar','Acceso a herramienta compartida'] },
  { id: 'delivery_11_04', label: 'Se documenta cada paso o depende de las personas?', type: 'textarea' },
  { id: 'delivery_11_05', label: 'Que informacion te gustaria ver en un dashboard ideal?', type: 'textarea' },
  { id: 'delivery_12_01', label: 'Que pasa si alguien del equipo clave se va o se enferma?', type: 'textarea' },
  { id: 'delivery_12_02', label: 'Teneis SOPs o documentacion interna por cada flujo?', type: 'single_select', options: ['Si, bien documentados','Algunos flujos','Existen pero desactualizados','No tenemos'] },
  { id: 'delivery_12_03', label: 'Que tareas podrias delegar hoy si estuvieran mejor estructuradas?', type: 'textarea' },
  { id: 'delivery_12_04', label: 'Hay gaps de formacion interna que afecten al delivery?', type: 'textarea' },
  { id: 'delivery_13_01', label: 'Si pudieras redisenar el proceso desde cero, que cambiarias?', type: 'textarea' },
  { id: 'delivery_13_02', label: 'Donde ves mas potencial de mejora o ahorro de tiempo?', type: 'textarea' },
  { id: 'delivery_13_03', label: 'Que parte te gustaria que fuera completamente automatica?', type: 'textarea' },
  { id: 'delivery_13_04', label: 'Teneis algun roadmap tecnologico o planes de cambio previstos?', type: 'textarea' },
  { id: 'delivery_14_01', label: 'Que herramienta usas mas a diario? Cual te resulta mas dificil?', type: 'textarea' },
  { id: 'delivery_14_02', label: 'Donde sentis que haceis doble trabajo entre herramientas?', type: 'textarea' },
  { id: 'delivery_14_03', label: 'Que herramienta te gustaria reemplazar o mejorar?', type: 'textarea' },
  { id: 'delivery_14_04', label: 'Que integraciones entre herramientas te gustaria tener?', type: 'textarea' },
  { id: 'delivery_14_05', label: 'Cuales son las principales frustraciones tecnologicas del equipo?', type: 'textarea' },
  { id: 'delivery_15_01', label: 'Que feedback te suelen dar los clientes sobre el proceso de entrega?', type: 'textarea' },
  { id: 'delivery_15_02', label: 'Los clientes se sienten informados y acompanados?', type: 'single_select', options: ['Muy satisfechos','Satisfechos en general','Hay margen de mejora','Frecuentes quejas'] },
  { id: 'delivery_15_03', label: 'Hay quejas frecuentes o preguntas que se repiten?', type: 'textarea' },
  { id: 'delivery_15_04', label: 'Que oportunidades ves para mejorar la comunicacion con cliente?', type: 'textarea' },
  { id: 'delivery_ad_01', label: 'Cuales son tus principales prioridades o dolores operativos?', type: 'textarea' },
  { id: 'delivery_ad_02', label: 'Que esperas conseguir con esta auditoria?', type: 'textarea' },
  { id: 'delivery_ad_03', label: 'Algo mas que debamos saber?', type: 'textarea' },
];

// ─── Questions: MARKETING (54 total, 1 fixed = 53 in respuestasDetalladas) ──

const MARKETING_QUESTIONS = [
  { id: 'marketing_01_01', label: 'Nombre de la empresa', type: 'text' },
  { id: 'marketing_01_02', label: 'Area a auditar', type: 'fixed' },
  { id: 'marketing_01_03', label: 'Tu rol en la empresa', type: 'single_select', options: ['CEO / Fundador','CMO / Director de Marketing','Marketing Manager','Growth / Performance','Content Manager','Social Media Manager','Otro'] },
  { id: 'marketing_01_04', label: 'Cuantas personas trabajan en marketing?', type: 'number' },
  { id: 'marketing_01_05', label: 'Que hace cada persona?', type: 'textarea' },
  { id: 'marketing_01_06', label: 'Que tareas dependen de UNA SOLA persona?', type: 'textarea' },
  { id: 'marketing_02_01', label: 'Quien ejecuta el marketing?', type: 'textarea' },
  { id: 'marketing_02_02', label: 'Teneis agencia o proveedor externo de marketing?', type: 'single_select', options: ['Si, agencia externa','Mixto','Todo interno'] },
  { id: 'marketing_02_03', label: 'Detalles del proveedor externo', type: 'textarea' },
  { id: 'marketing_02_04', label: 'Nombre de la agencia/proveedor', type: 'text' },
  { id: 'marketing_02_05', label: 'Email de contacto de la agencia', type: 'email' },
  { id: 'marketing_02_06', label: 'Que gestiona la agencia?', type: 'multi_select', options: ['Publicidad de pago (Google Ads, Meta Ads...)','SEO / Posicionamiento','Gestion de redes sociales','Creacion de contenido','Email marketing','Web / Landing pages','Estrategia general'] },
  { id: 'marketing_02_07', label: 'Coste mensual aproximado de la agencia', type: 'currency' },
  { id: 'marketing_03_01', label: 'Que herramientas usais?', type: 'multi_select', options: ['Google Ads','Meta Ads (Facebook/Instagram)','LinkedIn Ads','TikTok Ads','Google Analytics','Google Search Console','SEMrush / Ahrefs / Similar','Mailchimp','Brevo (Sendinblue)','ActiveCampaign','HubSpot','Hootsuite / Buffer / Metricool','Canva','Adobe Creative Suite','WordPress','CRM (Salesforce, Pipedrive, Zoho...)','Excel / Google Sheets'] },
  { id: 'marketing_03_02', label: 'Otras herramientas que useis', type: 'textarea' },
  { id: 'marketing_03_03', label: 'Las herramientas estan conectadas entre si?', type: 'single_select', options: ['Bien integradas','Algunas','Son islas'] },
  { id: 'marketing_04_01', label: 'Quien crea el contenido?', type: 'multi_select', options: ['Equipo interno','Agencia externa','Freelancers','IA (ChatGPT, Jasper...)','El CEO / Fundador'] },
  { id: 'marketing_04_02', label: 'Que tipo de contenido creais?', type: 'multi_select', options: ['Posts para redes sociales','Stories / Reels / TikToks','Articulos de blog / SEO','Emails / Newsletters','Videos (YouTube, webinars...)','Podcast','Creatividades para ads','Lead magnets (ebooks, guias...)'] },
  { id: 'marketing_04_03', label: 'La creacion de contenido es...', type: 'single_select', options: ['100% Manual','Asistida con IA','Muy automatizada'] },
  { id: 'marketing_04_04', label: 'Con que frecuencia publicais contenido?', type: 'text' },
  { id: 'marketing_04_05', label: 'Donde se atasca la creacion de contenido?', type: 'textarea' },
  { id: 'marketing_05_01', label: 'Teneis flujos automaticos de publicacion?', type: 'single_select', options: ['Si, programado','Algo programado','Todo manual'] },
  { id: 'marketing_05_02', label: 'En que canales publicais?', type: 'multi_select', options: ['Instagram','Facebook','LinkedIn','TikTok','YouTube','X (Twitter)','Blog / Web','Email / Newsletter','WhatsApp / Telegram'] },
  { id: 'marketing_05_03', label: 'Como es el proceso de publicacion?', type: 'textarea' },
  { id: 'marketing_06_01', label: 'Las campanas de marketing estan conectadas con el CRM?', type: 'single_select', options: ['Si, conectadas','Parcialmente','No conectadas'] },
  { id: 'marketing_06_02', label: 'Como son las segmentaciones de audiencia?', type: 'single_select', options: ['Segmentacion avanzada','Segmentacion basica','Disparo masivo'] },
  { id: 'marketing_06_03', label: 'Podeis medir que campanas generan ventas reales?', type: 'single_select', options: ['Si, bien medido','Mas o menos','No sabemos'] },
  { id: 'marketing_06_04', label: 'Que problemas teneis con la atribucion?', type: 'textarea' },
  { id: 'marketing_07_01', label: 'Cuantas peticiones/leads generais?', type: 'number_group', fields: ['Por dia','Por semana','Por mes'] },
  { id: 'marketing_07_02', label: 'Hay dias/horas pico de captacion?', type: 'textarea' },
  { id: 'marketing_07_03', label: 'La captacion actual, es escalable?', type: 'single_select', options: ['Si, podemos crecer','Limitada','No, tope humano'] },
  { id: 'marketing_07_04', label: 'Si tuvierais que duplicar leads, que se romperia?', type: 'textarea' },
  { id: 'marketing_08_01', label: 'Usais IA en marketing?', type: 'single_select', options: ['Si, mucho','Algo','No usamos'] },
  { id: 'marketing_08_02', label: 'Para que usais IA?', type: 'multi_select', options: ['Generacion de textos (copy, emails, posts...)','Generacion de imagenes (DALL-E, Midjourney...)','Edicion o generacion de video','Optimizacion SEO','Personalizacion de emails','Optimizacion de anuncios','Chatbot / Atencion automatizada','Analisis de datos / Reportes','A/B Testing automatizado'] },
  { id: 'marketing_08_03', label: 'Que herramientas de IA usais?', type: 'textarea' },
  { id: 'marketing_09_01', label: 'Teneis automatizaciones activas en marketing?', type: 'single_select', options: ['Si, tenemos','No, todo manual'] },
  { id: 'marketing_09_02', label: 'Detalles de automatizaciones', type: 'textarea' },
  { id: 'marketing_09_03', label: 'Que teneis automatizado?', type: 'multi_select', options: ['Email de bienvenida','Secuencias de nurturing','Carrito abandonado','Lead scoring','Publicacion en redes','Reportes automaticos','Sincronizacion con CRM','Retargeting automatico'] },
  { id: 'marketing_09_04', label: 'Que infraestructura/herramientas usais para automatizar?', type: 'textarea' },
  { id: 'marketing_09_05', label: 'Hay supervision humana (human in the loop)?', type: 'single_select', options: ['Siempre revisamos','A veces','100% automatico'] },
  { id: 'marketing_09_06', label: 'Estan optimizadas al 100%?', type: 'single_select', options: ['Si, optimizadas','Mejorables','Necesitan trabajo'] },
  { id: 'marketing_09_07', label: 'Coste operativo mensual de las automatizaciones', type: 'currency' },
  { id: 'marketing_09_08', label: 'Por que no habeis automatizado?', type: 'multi_select', options: ['Falta de tiempo','No sabemos como','Limitacion de presupuesto','No era prioridad','Las herramientas no lo permiten'] },
  { id: 'marketing_10_01', label: 'Que tareas se hacen manualmente?', type: 'multi_select', options: ['Crear posts para redes','Programar publicaciones','Responder comentarios/DMs','Crear y enviar emails','Gestionar campanas de ads','Crear reportes/dashboards','Subir leads al CRM','Buscar ideas/contenido','Editar imagenes/videos','Actualizar la web'] },
  { id: 'marketing_10_02', label: 'Hay acciones que se repiten cada semana/mes?', type: 'textarea' },
  { id: 'marketing_10_03', label: 'Que es lo que MAS frustra al equipo?', type: 'textarea' },
  { id: 'marketing_10_04', label: 'En que se pierde mas tiempo?', type: 'textarea' },
  { id: 'marketing_11_01', label: 'Si pudierais clonar a alguien para hacer UNA tarea 24/7, cual?', type: 'textarea' },
  { id: 'marketing_11_02', label: 'Si tuvierais 2 horas extra al dia, en que las usariais?', type: 'textarea' },
  { id: 'marketing_11_03', label: 'Como definiríais el exito de esta auditoria?', type: 'textarea' },
  { id: 'marketing_11_04', label: 'Presupuesto para mejoras tecnologicas?', type: 'single_select', options: ['<500€/mes','500€-1.000€/mes','1.000€-2.500€/mes','>2.500€/mes','Depende del ROI'] },
  { id: 'marketing_11_05', label: 'Hay resistencia al cambio en el equipo?', type: 'single_select', options: ['Muy abiertos','Se adaptan','Hay resistencia','No lo se'] },
  { id: 'marketing_12_01', label: 'Principales dolores del area de marketing', type: 'textarea' },
  { id: 'marketing_12_02', label: 'Algo mas que debamos saber?', type: 'textarea' },
];

// ─── Questions: VENTAS (59 total, 0 fixed = 59 in respuestasDetalladas) ──────

const VENTAS_QUESTIONS = [
  { id: 'ventas_01_01', label: 'Nombre de la empresa', type: 'text' },
  { id: 'ventas_01_02', label: 'Tu rol en la empresa', type: 'single_select', options: ['Propietario / Dueno','Gerente / Director','Encargado / Manager','Recepcion / Atencion al cliente','Comercial / Ventas','Marketing','Otro'] },
  { id: 'ventas_01_03', label: 'Tamano del equipo', type: 'single_select', options: ['1 - 5 empleados','6 - 15 empleados','16 - 50 empleados','51 - 100 empleados','Mas de 100 empleados'] },
  { id: 'ventas_01_04', label: 'Que ofreceis?', type: 'textarea' },
  { id: 'ventas_01_05', label: 'Quien es vuestro cliente tipico?', type: 'textarea' },
  { id: 'ventas_01_06', label: 'Modelo de venta/servicio', type: 'multi_select', options: ['Atencion presencial en local','Con cita previa / reserva','Servicio a domicilio','Delivery / Take away','Venta online / E-commerce','Venta telefonica'] },
  { id: 'ventas_01_07', label: 'Ticket medio por cliente/visita', type: 'currency' },
  { id: 'ventas_01_08', label: 'Quien atiende a los clientes?', type: 'textarea' },
  { id: 'ventas_01_09', label: 'Que depende de UNA SOLA persona?', type: 'textarea' },
  { id: 'ventas_02_01', label: 'Por que canales llegan los clientes?', type: 'multi_select', options: ['Entran directamente al local (walk-in)','Llamada telefonica','WhatsApp / Telegram','Web propia (reservas/formulario)','Google Maps / Ficha de Google','Redes sociales (Instagram, Facebook...)','Apps de delivery (Glovo, UberEats, JustEat...)','Apps de reservas (TheFork, Doctoralia, Treatwell...)','Publicidad online (Google Ads, Meta Ads...)','Recomendaciones / Boca a boca','Email','Otro'] },
  { id: 'ventas_02_02', label: 'Volumen de clientes/consultas', type: 'number_group', fields: ['Por dia','Por semana','Por mes'] },
  { id: 'ventas_02_03', label: 'Cuales son vuestras horas/dias punta?', type: 'textarea' },
  { id: 'ventas_02_04', label: 'Que canal trae los MEJORES clientes?', type: 'textarea' },
  { id: 'ventas_02_05', label: 'Hay estacionalidad en vuestro negocio?', type: 'textarea' },
  { id: 'ventas_03_01', label: 'Quien atiende al cliente primero?', type: 'textarea' },
  { id: 'ventas_03_02', label: 'Tiempo de respuesta a llamadas/mensajes', type: 'single_select', options: ['Inmediato <5 min','<1 hora','Mismo dia','Variable'] },
  { id: 'ventas_03_03', label: 'Cuando llaman/escriben fuera de horario...', type: 'single_select', options: ['No se responde','Buzon / Email','Autorespuesta'] },
  { id: 'ventas_03_04', label: 'Perdeis clientes por no poder atenderles?', type: 'single_select', options: ['Nunca/Raro','A veces','Con frecuencia'] },
  { id: 'ventas_03_05', label: 'Por que se pierden clientes antes de atenderles?', type: 'textarea' },
  { id: 'ventas_04_01', label: 'Trabajais con reservas/citas previas?', type: 'single_select', options: ['Siempre cita','Mixto','Sin cita'] },
  { id: 'ventas_04_02', label: 'Detalles de reservas', type: 'textarea' },
  { id: 'ventas_04_03', label: 'Como se hacen las reservas?', type: 'multi_select', options: ['Por telefono','Por WhatsApp','Web propia con calendario','App externa (TheFork, Doctoralia, Treatwell...)','En persona / Presencial','DM en redes sociales'] },
  { id: 'ventas_04_04', label: 'Donde apuntais las reservas?', type: 'multi_select', options: ['Agenda de papel / Libreta','Google Calendar / Outlook','Excel / Google Sheets','Software especifico del sector','CRM con agenda'] },
  { id: 'ventas_04_05', label: 'Confirmais las citas antes?', type: 'single_select', options: ['Automatico','Manual','No'] },
  { id: 'ventas_04_06', label: '% de no-shows o cancelaciones tardias', type: 'percentage' },
  { id: 'ventas_05_01', label: 'Guardais datos de vuestros clientes?', type: 'single_select', options: ['Si, completos','Solo basicos','No guardamos'] },
  { id: 'ventas_05_02', label: 'Que haceis para que vuelvan?', type: 'multi_select', options: ['Nada especifico','Tarjeta de puntos / Fidelidad','Descuentos para repetidores','Recordatorios de proxima cita/visita','Newsletter / Emails','WhatsApp con promociones','Felicitacion de cumpleanos','Contenido en redes sociales'] },
  { id: 'ventas_05_03', label: 'Pedis resenas a los clientes?', type: 'single_select', options: ['Si, siempre','A veces','No pedimos'] },
  { id: 'ventas_05_04', label: '% aproximado de clientes que repiten', type: 'percentage' },
  { id: 'ventas_06_01', label: 'Haceis presupuestos personalizados?', type: 'single_select', options: ['Si, siempre','A veces','Precio fijo'] },
  { id: 'ventas_06_02', label: 'Detalles de presupuestos', type: 'textarea' },
  { id: 'ventas_06_03', label: 'Como creais los presupuestos?', type: 'multi_select', options: ['De palabra','Word / Google Docs','Excel / Google Sheets','Software de facturacion','Por WhatsApp'] },
  { id: 'ventas_06_04', label: 'Cuanto tardais en dar un presupuesto?', type: 'text' },
  { id: 'ventas_06_05', label: 'Como cobráis?', type: 'multi_select', options: ['Efectivo','Tarjeta (TPV fisico)','Bizum','Transferencia bancaria','Pago online (Stripe, PayPal...)','Financiacion / Pago fraccionado'] },
  { id: 'ventas_06_06', label: 'Pedis senal/anticipo?', type: 'single_select', options: ['Si','No'] },
  { id: 'ventas_07_01', label: 'Que herramientas usais?', type: 'multi_select', options: ['TPV / Caja registradora','Software especifico del sector','CRM (HubSpot, Pipedrive, Zoho...)','Excel / Google Sheets','Software de facturacion','WhatsApp Business','Google Business Profile','Redes sociales (Instagram, Facebook...)','Email marketing (Mailchimp, Brevo...)','Papel / Agenda fisica','La cabeza / Memoria'] },
  { id: 'ventas_07_02', label: 'Si usais software especifico, cual?', type: 'text' },
  { id: 'ventas_07_03', label: 'Las herramientas estan conectadas entre si?', type: 'single_select', options: ['Integradas','Algunas','Son islas'] },
  { id: 'ventas_07_04', label: 'Hay datos que teneis que meter en varios sitios?', type: 'textarea' },
  { id: 'ventas_08_01', label: 'Que metricas controlais?', type: 'multi_select', options: ['Facturacion total','Ticket medio','Clientes nuevos','Clientes que repiten','Ocupacion / Reservas','No-shows / Cancelaciones','Resenas / Valoracion','No controlamos metricas'] },
  { id: 'ventas_08_02', label: 'Tiempo tipico desde primer contacto hasta servicio/venta', type: 'text' },
  { id: 'ventas_08_03', label: 'De cada 10 personas que preguntan, cuantas compran/reservan?', type: 'number' },
  { id: 'ventas_08_04', label: 'Por que se pierden clientes?', type: 'textarea' },
  { id: 'ventas_09_01', label: 'Teneis algo automatizado?', type: 'single_select', options: ['Si, algo','No, todo manual'] },
  { id: 'ventas_09_02', label: 'Que teneis automatizado?', type: 'multi_select', options: ['Confirmacion automatica de citas/reservas','Recordatorios de citas','Respuestas automaticas (WhatsApp, email...)','Emails de marketing automaticos','Facturacion automatica','Otro'] },
  { id: 'ventas_09_03', label: 'Por que no habeis automatizado?', type: 'multi_select', options: ['Falta de tiempo','No sabemos como','Limitacion de presupuesto','No era prioridad','Miedo a que falle / Desconfianza'] },
  { id: 'ventas_09_04', label: 'Usais IA en el negocio?', type: 'single_select', options: ['Si','No'] },
  { id: 'ventas_09_05', label: 'Si usais IA, para que?', type: 'textarea' },
  { id: 'ventas_10_01', label: 'Cuales de estas tareas se hacen manualmente?', type: 'multi_select', options: ['Responder las mismas preguntas (horarios, precios, disponibilidad...)','Gestionar reservas/citas por telefono o WhatsApp','Confirmar citas/reservas una a una','Enviar recordatorios de citas','Copiar datos de un sitio a otro','Crear facturas/tickets','Publicar en redes sociales','Pedir resenas a clientes','Hacer reportes/cuadres de caja'] },
  { id: 'ventas_10_02', label: 'Que es lo que MAS os frustra del dia a dia?', type: 'textarea' },
  { id: 'ventas_10_03', label: 'Donde se atasca mas el negocio?', type: 'textarea' },
  { id: 'ventas_10_04', label: 'Si tuvierais el DOBLE de clientes, que se romperia?', type: 'textarea' },
  { id: 'ventas_11_01', label: 'Si pudierais clonar a alguien para hacer UNA tarea 24/7, cual?', type: 'textarea' },
  { id: 'ventas_11_02', label: 'Si tuvierais 2 horas extra al dia, en que las usariais?', type: 'textarea' },
  { id: 'ventas_11_03', label: 'Como definiríais el exito de esta auditoria?', type: 'textarea' },
  { id: 'ventas_11_04', label: 'Presupuesto para mejoras tecnologicas?', type: 'single_select', options: ['<200€/mes','200€-500€/mes','500€-1.000€/mes','>1.000€/mes','Depende del ROI'] },
  { id: 'ventas_11_05', label: 'Hay resistencia al cambio en el equipo?', type: 'single_select', options: ['Muy abiertos','Se adaptan','Hay resistencia','No lo se'] },
  { id: 'ventas_12_01', label: 'Principales dolores o problemas del negocio', type: 'textarea' },
  { id: 'ventas_12_02', label: 'Algo mas que debamos saber?', type: 'textarea' },
];

// ─── Questions: OPERACIONES (47 total, 1 fixed = 46 in respuestasDetalladas) ─

const OPERACIONES_QUESTIONS = [
  { id: 'administracion_documentacion_01_01', label: 'Nombre de la empresa', type: 'text' },
  { id: 'administracion_documentacion_01_02', label: 'Area a auditar', type: 'fixed' },
  { id: 'administracion_documentacion_01_03', label: 'Tu rol en la empresa', type: 'single_select', options: ['CEO / Fundador','CFO / Director Financiero','Director de Administracion','Office Manager','Controller / Responsable Contable','Responsable Legal / Compliance','RRHH / Administracion de Personal','Otro'] },
  { id: 'administracion_documentacion_01_04', label: 'Tamano del equipo', type: 'single_select', options: ['1 - 5 empleados','6 - 15 empleados','16 - 50 empleados','51 - 100 empleados','Mas de 100 empleados'] },
  { id: 'administracion_documentacion_01_05', label: 'Organigrama / Estructura del equipo administrativo', type: 'textarea' },
  { id: 'administracion_documentacion_01_06', label: 'Roles involucrados en la gestion administrativa y documental diaria', type: 'textarea' },
  { id: 'administracion_documentacion_02_01', label: 'Que herramientas utilizais para gestion administrativa y documental?', type: 'multi_select', options: [{value:'Google Drive / OneDrive / Dropbox'},{value:'ERP / Software de gestion (Holded, A3, Sage, SAP)'},{value:'Software de facturacion (Factusol, Billin, Quipu)'},{value:'Firma digital (DocuSign, Signaturit, Adobe Sign)'},{value:'Gestor documental (M-Files, Alfresco, DocuWare)'},{value:'Hojas de calculo (Excel / Google Sheets)'},{value:'Email (Gmail, Outlook)'},{value:'Archivo fisico / Documentacion en papel'},{value:'Otras herramientas'}] },
  { id: 'administracion_documentacion_02_02', label: 'Otras herramientas utilizadas', type: 'textarea' },
  { id: 'administracion_documentacion_02_03', label: 'Podreis darnos acceso de lectura a las herramientas relevantes?', type: 'single_select', options: ['Si, sin problema','Solo algunas','Necesito consultar'] },
  { id: 'administracion_documentacion_02_04', label: 'Existe una fuente de verdad unica para la documentacion?', type: 'single_select', options: ['Si, centralizado','Parcialmente','No, dispersa'] },
  { id: 'administracion_documentacion_02_05', label: 'Que porcentaje de vuestra documentacion esta digitalizada?', type: 'single_select', options: ['0-25% digital','26-50% digital','51-75% digital','76-100% digital'] },
  { id: 'administracion_documentacion_03_01', label: 'Teneis procedimientos documentados para la gestion administrativa?', type: 'single_select', options: ['Si, bien documentados','Algunos procesos','Solo informales','No existen'] },
  { id: 'administracion_documentacion_03_02', label: 'Describe los principales flujos de trabajo administrativos', type: 'textarea' },
  { id: 'administracion_documentacion_03_03', label: 'Como gestionais las aprobaciones y firmas?', type: 'single_select', options: ['Digital automatizado','Digital pero manual','Mixto (digital + papel)','Principalmente en papel'] },
  { id: 'administracion_documentacion_03_04', label: 'Hay dependencia critica de personas clave en administracion?', type: 'single_select', options: ['Paralisis total','Impacto alto','Impacto moderado','Minimo impacto'] },
  { id: 'administracion_documentacion_03_05', label: 'Que conocimiento critico esta concentrado en pocas personas?', type: 'textarea' },
  { id: 'administracion_documentacion_04_01', label: 'Ejemplos concretos de tareas administrativas que quereis mejorar', type: 'textarea' },
  { id: 'administracion_documentacion_04_02', label: 'Que tareas documentales se realizan manualmente de forma repetitiva?', type: 'textarea' },
  { id: 'administracion_documentacion_04_03', label: 'Donde se producen los principales cuellos de botella documentales?', type: 'textarea' },
  { id: 'administracion_documentacion_04_04', label: 'Estimacion de tiempo dedicado a tareas administrativas manuales', type: 'single_select', options: ['1 - 5 horas/semana','6 - 15 horas/semana','16 - 30 horas/semana','31 - 50 horas/semana','Mas de 50 horas/semana'] },
  { id: 'administracion_documentacion_04_05', label: 'Que tareas administrativas crees que podria realizar una IA?', type: 'textarea' },
  { id: 'administracion_documentacion_05_01', label: 'Cuantas facturas y documentos gestionais?', type: 'number_group', fields: ['Facturas emitidas / mes','Facturas recibidas / mes','Contratos activos'] },
  { id: 'administracion_documentacion_05_02', label: 'Que KPIs o metricas medis actualmente en administracion?', type: 'textarea' },
  { id: 'administracion_documentacion_05_03', label: 'Cual es el tiempo medio de procesamiento de una factura?', type: 'single_select', options: ['Mismo dia','1 - 2 dias','3 - 5 dias','Mas de una semana','Muy variable'] },
  { id: 'administracion_documentacion_05_04', label: 'Quien gestiona cada tipo de documentacion?', type: 'textarea' },
  { id: 'administracion_documentacion_05_05', label: 'Teneis picos de trabajo administrativo?', type: 'single_select', options: ['Si, hay picos','No, bastante estable'] },
  { id: 'administracion_documentacion_05_06', label: 'Detalle de picos de trabajo', type: 'textarea' },
  { id: 'administracion_documentacion_05_07', label: 'Cuando son los picos de trabajo administrativo?', type: 'textarea' },
  { id: 'administracion_documentacion_06_01', label: 'Teneis automatizaciones en procesos administrativos actualmente?', type: 'single_select', options: ['Si, tenemos algunas','No, aun no'] },
  { id: 'administracion_documentacion_06_02', label: 'Detalles de tus automatizaciones actuales', type: 'textarea' },
  { id: 'administracion_documentacion_06_03', label: 'Cuales son vuestras automatizaciones actuales en administracion?', type: 'textarea' },
  { id: 'administracion_documentacion_06_04', label: 'Que herramientas utilizais para automatizar?', type: 'textarea' },
  { id: 'administracion_documentacion_06_05', label: 'Hay revision humana en los procesos automatizados criticos?', type: 'single_select', options: ['Siempre revision','Solo en criticos','100% automatico'] },
  { id: 'administracion_documentacion_06_06', label: 'Funcionan bien las automatizaciones actuales?', type: 'scale' },
  { id: 'administracion_documentacion_06_07', label: 'Que problemas teneis con las automatizaciones actuales?', type: 'textarea' },
  { id: 'administracion_documentacion_06_08', label: 'Cual es el coste mensual de las herramientas de automatizacion?', type: 'currency' },
  { id: 'administracion_documentacion_06_09', label: 'Contexto adicional', type: 'textarea' },
  { id: 'administracion_documentacion_06_10', label: 'Por que no habeis automatizado procesos administrativos hasta ahora?', type: 'multi_select', options: [{value:'Falta de tiempo'},{value:'Falta de conocimiento'},{value:'Limitacion de presupuesto'},{value:'Lo intentamos pero no funciono'},{value:'No era prioridad hasta ahora'}] },
  { id: 'administracion_documentacion_07_01', label: 'Como definiríais el exito de esta auditoria?', type: 'textarea' },
  { id: 'administracion_documentacion_07_02', label: 'Hay requisitos imprescindibles o restricciones?', type: 'textarea' },
  { id: 'administracion_documentacion_07_03', label: 'Que normativas de cumplimiento os aplican?', type: 'multi_select', options: [{value:'RGPD / LOPD-GDD'},{value:'Factura electronica obligatoria'},{value:'Conservacion fiscal de documentos'},{value:'Auditoria externa / SOC'},{value:'Normativa sectorial especifica'},{value:'No estoy seguro'}] },
  { id: 'administracion_documentacion_07_04', label: 'Teneis politicas de seguridad documental?', type: 'single_select', options: ['Si, formalizadas','Basicas / informales','No tenemos'] },
  { id: 'administracion_documentacion_07_05', label: 'Detalle de politicas de seguridad documental (si aplica)', type: 'textarea' },
  { id: 'administracion_documentacion_07_06', label: 'Quien autoriza el acceso a documentacion sensible?', type: 'textarea' },
  { id: 'administracion_documentacion_ad_01', label: 'Cuales son tus principales dolores en gestion documental?', type: 'textarea' },
  { id: 'administracion_documentacion_ad_02', label: 'Que esperas conseguir con esta auditoria?', type: 'textarea' },
  { id: 'administracion_documentacion_ad_03', label: 'Algo mas que debamos saber?', type: 'textarea' },
];

// ─── Expected counts ──────────────────────────────────────────────────────────

const EXPECTED = {
  delivery:    { total: 103, nonFixed: 102, table: 'Delivery',    airtableArea: 'Delivery' },
  marketing:   { total: 54,  nonFixed: 53,  table: 'Marketing',   airtableArea: 'Marketing' },
  ventas:      { total: 59,  nonFixed: 59,  table: 'Ventas',      airtableArea: 'Ventas' },
  operaciones: { total: 47,  nonFixed: 46,  table: 'Operaciones', airtableArea: 'Operaciones' },
};

const FORMS = [
  { area: 'delivery',    questions: DELIVERY_QUESTIONS },
  { area: 'marketing',   questions: MARKETING_QUESTIONS },
  { area: 'ventas',      questions: VENTAS_QUESTIONS },
  { area: 'operaciones', questions: OPERACIONES_QUESTIONS },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

console.log('QA: Prueba completa de envio a Airtable — 4 formularios');
console.log(`Endpoint: ${ENDPOINT}`);
console.log(`Airtable base: ${AIRTABLE_BASE_ID}`);
console.log('');

const results = [];

for (const { area, questions } of FORMS) {
  const expected = EXPECTED[area];
  const nonFixed = questions.filter(q => q.type !== 'fixed');

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  ${area.toUpperCase()}`);
  console.log(`${'═'.repeat(60)}`);
  console.log(`  Preguntas en array: ${questions.length} (esperado: ${expected.total}) ${questions.length === expected.total ? '✓' : '✗ DISCREPANCIA'}`);
  console.log(`  No-fixed (respuestasDetalladas): ${nonFixed.length} (esperado: ${expected.nonFixed}) ${nonFixed.length === expected.nonFixed ? '✓' : '✗ DISCREPANCIA'}`);

  // Submit
  let recordId, submitError;
  try {
    const r = await submitForm(area, questions);
    recordId = r.recordId;
    console.log(`  → Record creado: ${recordId}`);
  } catch (e) {
    submitError = e.message;
    console.error(`  ✗ Submit fallo: ${submitError}`);
    results.push({ area, submitError, recordId: null });
    continue;
  }

  // Wait briefly to avoid rate limits
  await new Promise(r => setTimeout(r, 800));

  // Verify from Airtable
  let fields, verifyError;
  try {
    console.log(`  → Verificando en Airtable tabla "${expected.table}"...`);
    fields = await getRecord(expected.table, recordId);
  } catch (e) {
    verifyError = e.message;
    console.error(`  ✗ Verificacion fallo: ${verifyError}`);
    results.push({ area, verifyError, recordId });
    continue;
  }

  // Parse fields
  const respuestasJSONRaw = fields['Respuestas JSON'] ?? '';
  const observaciones = fields['Observaciones'] ?? '';
  const areaValue     = fields['Area'] ?? '';
  const estado        = fields['Estado'] ?? '';
  const prioridad     = fields['Prioridad'] ?? '';

  let actualCount = -1;
  let jsonOk = false;
  try {
    const parsed = JSON.parse(respuestasJSONRaw);
    actualCount = parsed?.respuestasDetalladas?.length ?? -1;
    jsonOk = actualCount === expected.nonFixed;
  } catch { /* bad JSON */ }

  const areaOk   = areaValue === expected.airtableArea;
  const estadoOk = estado === 'Nuevo';
  const obsLen   = observaciones.length;
  const obsOk    = obsLen > 2000;

  console.log(`  Respuestas JSON → respuestasDetalladas.length: ${actualCount} (esperado: ${expected.nonFixed}) ${jsonOk ? '✓' : '✗'}`);
  console.log(`  Area Airtable: "${areaValue}" (esperado: "${expected.airtableArea}") ${areaOk ? '✓' : '✗'}`);
  console.log(`  Estado: "${estado}" ${estadoOk ? '✓' : '✗'}`);
  console.log(`  Prioridad: "${prioridad}"`);
  console.log(`  Observaciones chars: ${obsLen} ${obsOk ? '✓ (> 2000, no truncado)' : '✗ (puede estar truncado)'}`);

  results.push({
    area,
    recordId,
    table: expected.table,
    totalEsperado: expected.total,
    nonFixedEsperado: expected.nonFixed,
    actualCount,
    jsonOk,
    areaValue,
    areaOk,
    estadoOk,
    prioridad,
    obsLen,
  });

  // Delete record
  await new Promise(r => setTimeout(r, 400));
  try {
    console.log(`  → Borrando registro ${recordId}...`);
    const deleted = await deleteRecord(expected.table, recordId);
    console.log(`  ✓ Borrado: ${deleted}`);
  } catch (e) {
    console.error(`  ✗ Error al borrar: ${e.message} — BORRAR MANUALMENTE: ${recordId}`);
  }
}

// ─── Results table ────────────────────────────────────────────────────────────

console.log(`\n\n${'═'.repeat(90)}`);
console.log('TABLA DE RESULTADOS FINALES');
console.log(`${'═'.repeat(90)}`);
console.log(
  'Área'.padEnd(14) +
  'Esp.'.padEnd(6) +
  'Guardadas'.padEnd(11) +
  'Obs.chars'.padEnd(11) +
  'Tabla'.padEnd(14) +
  'Area AT'.padEnd(14) +
  'Resultado'
);
console.log('─'.repeat(90));

for (const r of results) {
  if (r.submitError) {
    console.log(`${r.area.padEnd(14)}${'—'.padEnd(6)}${'—'.padEnd(11)}${'—'.padEnd(11)}${'—'.padEnd(14)}${'—'.padEnd(14)}FALLO SUBMIT: ${r.submitError}`);
    continue;
  }
  if (r.verifyError) {
    console.log(`${r.area.padEnd(14)}${String(r.nonFixedEsperado).padEnd(6)}${'?'.padEnd(11)}${'?'.padEnd(11)}${r.table.padEnd(14)}${'?'.padEnd(14)}FALLO VERIFY: ${r.verifyError}`);
    continue;
  }
  const ok = r.jsonOk && r.areaOk && r.estadoOk && r.obsLen > 2000;
  console.log(
    r.area.padEnd(14) +
    String(r.nonFixedEsperado).padEnd(6) +
    String(r.actualCount).padEnd(11) +
    String(r.obsLen).padEnd(11) +
    r.table.padEnd(14) +
    r.areaValue.padEnd(14) +
    (ok ? '✓ OK' : '✗ REVISAR')
  );
}

console.log(`${'═'.repeat(90)}`);
console.log('\nResumen:');
const allOk = results.every(r => !r.submitError && !r.verifyError && r.jsonOk && r.areaOk && r.estadoOk && r.obsLen > 2000);
console.log(`  1. ¿Todas las respuestas llegaron? ${allOk ? '✓ SI' : '✗ NO — revisar tabla'}`);
console.log(`  2. ¿Observaciones guarda pregunta + respuesta? ${results.every(r => r.obsLen > 2000) ? '✓ SI (> 2000 chars en todos)' : '✗ NO'}`);
console.log(`  3. ¿Respuestas JSON guarda respuestasDetalladas completo? ${results.every(r => r.jsonOk) ? '✓ SI' : '✗ NO'}`);
console.log('\n  Records creados y borrados:');
for (const r of results) {
  console.log(`    ${r.area}: ${r.recordId ?? 'n/a'} → ${r.submitError || r.verifyError ? 'ERROR' : 'BORRADO OK'}`);
}
