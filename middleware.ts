import { NextRequest, NextResponse } from "next/server";

const store = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  store.forEach((val, key) => { if (now > val.resetAt) store.delete(key); });
  const entry = store.get(ip);
  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count += 1;
  return true;
}

function getIp(req: NextRequest): string {
  return req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
}

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const ip   = getIp(req);

  // /api/contact — 5 req / IP / 10 min
  if (path.startsWith("/api/contact")) {
    if (!rateLimit(ip, 5, 10 * 60 * 1000)) {
      return NextResponse.json(
        { success: false, error: "Demasiadas solicitudes. Inténtalo de nuevo en unos minutos." },
        { status: 429 }
      );
    }
  }

  // /api/verify-token — 20 req / IP / 10 min (brute-force protection)
  if (path.startsWith("/api/verify-token")) {
    if (!rateLimit(`vt:${ip}`, 20, 10 * 60 * 1000)) {
      return NextResponse.json(
        { valid: false, error: "Demasiados intentos. Espera unos minutos." },
        { status: 429 }
      );
    }
  }

  // /api/verify-access — 10 req / IP / 10 min (brute-force protection)
  if (path.startsWith("/api/verify-access")) {
    if (!rateLimit(`va:${ip}`, 10, 10 * 60 * 1000)) {
      return NextResponse.json(
        { valid: false, error: "Demasiados intentos. Espera unos minutos." },
        { status: 429 }
      );
    }
  }

  // /api/onboarding/submit — 10 req / IP / 10 min
  if (path.startsWith("/api/onboarding")) {
    if (!rateLimit(`ob:${ip}`, 10, 10 * 60 * 1000)) {
      return NextResponse.json(
        { success: false, error: "Demasiadas solicitudes. Inténtalo de nuevo en unos minutos." },
        { status: 429 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/contact", "/api/verify-token", "/api/verify-access", "/api/onboarding/:path*"],
};
