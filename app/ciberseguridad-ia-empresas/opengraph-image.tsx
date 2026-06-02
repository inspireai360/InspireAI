export { size, contentType } from "@/lib/og-service-image";
import { generateServiceOG } from "@/lib/og-service-image";

export const alt = "Ciberseguridad en Proyectos de IA | InspireAI";

export default function Image() {
  return generateServiceOG(
    "Ciberseguridad en Proyectos de IA",
    "Auditamos las vulnerabilidades de tus integraciones antes de que alguien las explote.",
    ["Hackers éticos", "RGPD", "Análisis de APIs"],
    "#E86F6F"
  );
}
