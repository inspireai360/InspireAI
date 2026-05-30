import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Política de Privacidad | InspireAI",
  description: "Política de privacidad y protección de datos de InspireAI.",
};

export default function PoliticaPrivacidad() {
  return (
    <div className="min-h-screen bg-dark text-white selection:bg-primary/30 selection:text-white pb-24">
      {/* Navbar */}
      <nav className="py-5 border-b border-white/5 bg-[#09090B]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto px-6 max-w-4xl flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
          <Link href="/" className="font-orbitron font-bold text-[1.25rem] tracking-[0.05em] text-white">
            INSPIRE<span className="text-[#818CF8]">AI</span>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="mx-auto px-6 max-w-3xl mt-16 md:mt-24">
        <header className="mb-12">
          <h1 className="font-heading font-bold text-3xl md:text-5xl mb-4">
            Política de Privacidad
          </h1>
          <p className="text-white/50 text-sm">
            Última actualización: {new Date().toLocaleDateString("es-ES")}
          </p>
        </header>

        <div className="space-y-10 text-white/70 text-base leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-4">
              1. Información del Responsable
            </h2>
            <p className="mb-4">
              En cumplimiento de la Ley 34/2002, de 11 de julio, de servicios de la sociedad de la información y de comercio electrónico (LSSI-CE), así como en el Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo, de 27 de abril de 2016 (RGPD), y la Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD), se le informa de que el responsable del tratamiento de los datos recabados en este sitio web es InspireAI (en adelante, &quot;el Titular&quot; o &quot;InspireAI&quot;).
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Denominación comercial:</strong> InspireAI</li>
              <li><strong>Correo electrónico:</strong> inspireaiagency.contact@gmail.com</li>
              <li><strong>Actividad:</strong> Consultoría de IA y desarrollo de automatizaciones</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">
              2. Finalidad del tratamiento de los datos
            </h2>
            <p className="mb-4">
              Los datos personales recabados a través de nuestro formulario de contacto o durante la prestación de servicios serán utilizados para las siguientes finalidades:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Responder a las consultas, mensajes y solicitudes enviadas por los usuarios.</li>
              <li>Prestar los servicios de auditoría e implementación de soluciones de IA.</li>
              <li>Enviar comunicaciones comerciales, novedades y promociones (siempre que el usuario haya dado su consentimiento expreso).</li>
              <li>Gestión del contacto comercial y la atención al cliente.</li>
            </ul>
            <p>
              El usuario garantiza que los datos aportados son verdaderos, exactos, completos y actualizados, siendo responsable de cualquier daño o perjuicio, directo o indirecto, que pudiera ocasionarse como consecuencia del incumplimiento de tal obligación.
            </p>
            <p className="mt-4 text-sm text-white/50">
              Por razones de seguridad, no envíe contraseñas, claves privadas, tokens o secretos a través de los formularios. Si necesita compartir información sensible, contacte primero con InspireAI y use un canal seguro.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">
              3. Legitimación para el tratamiento
            </h2>
            <p className="mb-4">
              La base legal para el tratamiento de sus datos es su consentimiento expreso al momento de enviar el formulario de contacto o la ejecución de un contrato de prestación de servicios. Para el envío de comunicaciones comerciales, la base legitimadora será igualmente su consentimiento explícito o el interés legítimo en caso de ser ya cliente, de acuerdo con la LSSI-CE.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">
              4. Conservación de los datos
            </h2>
            <p className="mb-4">
              Los datos personales proporcionados se conservarán mientras se mantenga la relación mercantil o no solicite su supresión. Cuando los datos ya no sean necesarios para la finalidad para la que fueron recabados, se mantendrán bloqueados el tiempo estrictamente necesario para el cumplimiento de obligaciones legales y la atención de posibles responsabilidades derivadas del tratamiento.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">
              5. Comunicación de datos
            </h2>
            <p className="mb-4">
              Generalmente, los datos no se comunicarán a terceros, salvo obligación legal o cuando sea estrictamente necesario para la prestación del servicio (por ejemplo, pasarelas de pago, proveedores de hosting, o servicios en la nube necesarios para nuestra actividad). En dichos casos, InspireAI garantiza que se tomarán las medidas oportunas para asegurar un nivel de protección adecuado conforme a la normativa de protección de datos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">
              6. Derechos de los usuarios
            </h2>
            <p className="mb-4">
              Cualquier persona tiene derecho a obtener confirmación sobre si InspireAI está tratando datos personales que le conciernen. Los usuarios tienen derecho a:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li><strong>Acceder</strong> a sus datos personales.</li>
              <li>Solicitar la <strong>rectificación</strong> de datos inexactos o, en su caso, solicitar su <strong>supresión</strong> cuando ya no sean necesarios.</li>
              <li>Solicitar la <strong>limitación del tratamiento</strong> de sus datos.</li>
              <li><strong>Oponerse</strong> al tratamiento.</li>
              <li>Solicitar la <strong>portabilidad</strong> de los datos.</li>
            </ul>
            <p>
              Puede ejercer estos derechos enviando un correo electrónico a inspireaiagency.contact@gmail.com, identificándose debidamente e indicando de forma expresa el concreto derecho que se quiere ejercer. Además, tiene derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD) si considera que el tratamiento no se ajusta a la normativa vigente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">
              7. Medidas de seguridad
            </h2>
            <p className="mb-4">
              De acuerdo con lo establecido en el RGPD, InspireAI ha adoptado las medidas técnicas y organizativas necesarias para garantizar la seguridad y confidencialidad de los datos personales, evitando su alteración, pérdida, tratamiento o acceso no autorizado. Esto incluye auditorías de ciberseguridad sobre nuestros propios sistemas, dada la naturaleza de nuestros servicios tecnológicos.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
