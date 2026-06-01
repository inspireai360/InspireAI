import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Aviso Legal | InspireAI",
  description: "Aviso legal general y condiciones de uso de InspireAI.",
  alternates: {
    canonical: "https://inspireai.es/aviso-legal",
  },
  robots: { index: false, follow: false },
};

export default function AvisoLegal() {
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
            Aviso Legal
          </h1>
          <p className="text-white/50 text-sm">
            Última actualización: {new Date().toLocaleDateString("es-ES")}
          </p>
        </header>

        <div className="space-y-10 text-white/70 text-base leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-4">
              1. Datos Identificativos
            </h2>
            <p className="mb-4">
              En cumplimiento con el deber de información recogido en el artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSICE), se reflejan a continuación los siguientes datos:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Empresa titular del sitio web:</strong> InspireAI</li>
              <li><strong>Correo electrónico de contacto:</strong> inspireaiagency.contact@gmail.com</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">
              2. Usuarios y Condiciones de Uso
            </h2>
            <p className="mb-4">
              El acceso y/o uso de este portal web de InspireAI atribuye la condición de USUARIO, que acepta, desde dicho acceso y/o uso, las Condiciones Generales de Uso aquí reflejadas. Estas condiciones serán de aplicación independientemente de las Condiciones Generales de Contratación que en su caso resulten de obligado cumplimiento.
            </p>
            <p>
              El usuario se compromete a hacer un uso adecuado de los contenidos y servicios que InspireAI ofrece a través de su portal, y con carácter enunciativo pero no limitativo, a no emplearlos para incurrir en actividades ilícitas, ilegales o contrarias a la buena fe y al orden público, ni para provocar daños en los sistemas físicos y lógicos de la empresa titular, de sus proveedores o de terceras personas.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">
              3. Propiedad Intelectual e Industrial
            </h2>
            <p className="mb-4">
              InspireAI por sí o como cesionaria, es titular de todos los derechos de propiedad intelectual e industrial de su página web, así como de los elementos contenidos en la misma (a título enunciativo, imágenes, sonido, audio, vídeo, software o textos; marcas o logotipos, combinaciones de colores, estructura y diseño, selección de materiales usados, programas de ordenador necesarios para su funcionamiento, acceso y uso, etc.).
            </p>
            <p className="mb-4">
              Todos los derechos reservados. En virtud de lo dispuesto en los artículos 8 y 32.1, párrafo segundo, de la Ley de Propiedad Intelectual, quedan expresamente prohibidas la reproducción, la distribución y la comunicación pública, incluida su modalidad de puesta a disposición, de la totalidad o parte de los contenidos de esta página web, con fines comerciales, en cualquier soporte y por cualquier medio técnico, sin la autorización de InspireAI.
            </p>
            <p>
              El USUARIO deberá abstenerse de suprimir, alterar, eludir o manipular cualquier dispositivo de protección o sistema de seguridad que estuviera instalado en las páginas de InspireAI.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">
              4. Exclusión de Garantías y Responsabilidad
            </h2>
            <p className="mb-4">
              InspireAI no se hace responsable, en ningún caso, de los daños y perjuicios de cualquier naturaleza que pudieran ocasionar, a título enunciativo: errores u omisiones en los contenidos, falta de disponibilidad del portal o la transmisión de virus o programas maliciosos o lesivos en los contenidos, a pesar de haber adoptado todas las medidas tecnológicas necesarias para evitarlo.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">
              5. Modificaciones
            </h2>
            <p className="mb-4">
              InspireAI se reserva el derecho de efectuar sin previo aviso las modificaciones que considere oportunas en su portal, pudiendo cambiar, suprimir o añadir tanto los contenidos y servicios que se presten a través de la misma como la forma en la que éstos aparezcan presentados o localizados en su portal.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">
              6. Enlaces
            </h2>
            <p className="mb-4">
              En el caso de que en la página web se dispusiesen enlaces o hipervínculos hacía otros sitios de Internet, InspireAI no ejercerá ningún tipo de control sobre dichos sitios y contenidos. En ningún caso InspireAI asumirá responsabilidad alguna por los contenidos de algún enlace perteneciente a un sitio web ajeno, ni garantizará la disponibilidad técnica, calidad, fiabilidad, exactitud, amplitud, veracidad, validez y constitucionalidad de cualquier material o información contenida en ninguno de dichos hipervínculos u otros sitios de Internet.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">
              7. Derecho de Exclusión y Generalidades
            </h2>
            <p className="mb-4">
              InspireAI se reserva el derecho a denegar o retirar el acceso al portal y/o los servicios ofrecidos sin necesidad de preaviso, a instancia propia o de un tercero, a aquellos usuarios que incumplan las presentes Condiciones Generales de Uso.
            </p>
            <p>
              InspireAI perseguirá el incumplimiento de las presentes condiciones así como cualquier utilización indebida de su portal ejerciendo todas las acciones civiles y penales que le puedan corresponder en derecho.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">
              8. Legislación Aplicable y Jurisdicción
            </h2>
            <p className="mb-4">
              La relación entre InspireAI y el USUARIO se regirá por la normativa española vigente y cualquier controversia se someterá a los Juzgados y tribunales de la ciudad correspondiente al domicilio principal del titular, salvo que la ley disponga otra cosa.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
