import { NextRequest, NextResponse } from "next/server";

// Rate limit: máx 5 peticiones por IP cada 10 minutos en /api/contact
const LIMIT    = 5;
const WINDOW   = 10 * 60 * 1000; // 10 minutos en ms

const store = new Map<string, { count: number; resetAt: number }>();

// Limpiar entradas antiguas periódicamente
function cleanup() {
  const now = Date.now();
  for (const [key, val] of store.entries()) {
    if (now > val.resetAt) store.delete(key);
  }
}

export function middleware(req: NextRequest) {
  // Solo aplicar a /api/contact
  if (!req.nextUrl.pathname.startsWith("/api/contact")) {
    return NextResponse.next();
  }

  // Obtener IP del cliente
  const ip =
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";

  const now = Date.now();
  cleanup();

  const entry = store.get(ip);

  if (!entry || now > entry.resetAt) {
    // Primera petición o ventana expirada
    store.set(ip, { count: 1, resetAt: now + WINDOW });
    return NextResponse.next();
  }

  if (entry.count >= LIMIT) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return NextResponse.json(
      { success: false, error: "Demasiadas solicitudes. Inténtalo de nuevo en unos minutos." },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": String(LIMIT),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(entry.resetAt / 1000)),
        },
      }
    );
  }

  // Incrementar contador
  entry.count += 1;
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/contact"],
};
