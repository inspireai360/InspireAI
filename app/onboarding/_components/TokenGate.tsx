"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export interface ClientData {
  empresa: string;
  contacto: string;
  email: string;
  telefono: string;
}

interface VerifyResponse {
  valid: boolean;
  recordId?: string;
  empresa?: string;
  contacto?: string;
  email?: string;
  telefono?: string;
  error?: string;
}

type GateState =
  | { status: "loading" }
  | { status: "valid"; clientData: ClientData; tokenRecordId: string }
  | { status: "invalid"; error: string }
  | { status: "no-token" };

const CACHE_KEY = "inspireai_token_cache";

interface CachedSession {
  token: string;
  area: string;
  recordId: string;
  clientData: ClientData;
}

function readCache(token: string, area: string): CachedSession | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw) as CachedSession;
    if (cached.token === token && cached.area === area) return cached;
    return null;
  } catch {
    return null;
  }
}

function writeCache(session: CachedSession) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(session));
  } catch {
    // sessionStorage no disponible
  }
}

interface TokenGateProps {
  area: string;
  token: string | undefined;
  children: (clientData: ClientData, tokenRecordId: string) => React.ReactNode;
}

export default function TokenGate({ area, token, children }: TokenGateProps) {
  const [state, setState] = useState<GateState>({ status: "loading" });

  useEffect(() => {
    if (!token) {
      setState({ status: "no-token" });
      return;
    }

    // Intentar recuperar sesión cacheada para no re-validar en cada recarga
    const cached = readCache(token, area);
    if (cached) {
      setState({
        status: "valid",
        clientData: cached.clientData,
        tokenRecordId: cached.recordId,
      });
      return;
    }

    // Validar contra el backend
    let cancelled = false;

    async function verify() {
      try {
        const res = await fetch(
          `/api/verify-token?token=${encodeURIComponent(token!)}&area=${encodeURIComponent(area)}`
        );
        const data: VerifyResponse = await res.json();

        if (cancelled) return;

        if (data.valid && data.recordId) {
          const clientData: ClientData = {
            empresa: data.empresa ?? "",
            contacto: data.contacto ?? "",
            email: data.email ?? "",
            telefono: data.telefono ?? "",
          };
          writeCache({ token: token!, area, recordId: data.recordId, clientData });
          setState({ status: "valid", clientData, tokenRecordId: data.recordId });
        } else {
          setState({ status: "invalid", error: data.error ?? "Enlace no válido" });
        }
      } catch {
        if (!cancelled) {
          setState({ status: "invalid", error: "Error de conexión. Inténtalo de nuevo." });
        }
      }
    }

    verify();
    return () => { cancelled = true; };
  }, [token, area]);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (state.status === "loading") {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-white/10 border-t-[#5B62F4] rounded-full animate-spin" />
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.875rem" }}>
            Verificando enlace...
          </p>
        </div>
      </div>
    );
  }

  // ── Sin token en URL ────────────────────────────────────────────────────
  if (state.status === "no-token") {
    return <InvalidLinkScreen message="No se encontró un token de acceso en este enlace." />;
  }

  // ── Token inválido / expirado / ya usado ────────────────────────────────
  if (state.status === "invalid") {
    return <InvalidLinkScreen message={state.error} />;
  }

  // ── Token válido — renderizar formulario ────────────────────────────────
  return <>{children(state.clientData, state.tokenRecordId)}</>;
}

// ── Pantalla de error ────────────────────────────────────────────────────────

function InvalidLinkScreen({ message }: { message: string }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "#09090B" }}
    >
      {/* Dot grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 w-full max-w-sm text-center">
        <Link href="/" className="inline-block mb-10">
          <span className="font-orbitron font-bold text-[1.4rem] tracking-[0.05em] text-white">
            INSPIRE<span style={{ color: "#818CF8" }}>AI</span>
          </span>
        </Link>

        <div
          className="p-8"
          style={{
            background: "#111115",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "16px",
          }}
        >
          {/* Icono de advertencia */}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#F87171"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>

          <h1
            className="font-heading font-bold text-white mb-3"
            style={{ fontSize: "1.2rem" }}
          >
            Enlace no válido
          </h1>
          <p
            className="mb-6"
            style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem", lineHeight: 1.6 }}
          >
            {message}
          </p>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem" }}>
            Si crees que es un error, contacta con el equipo de InspireAI para
            recibir un nuevo enlace personalizado.
          </p>
        </div>

        <Link
          href="/"
          className="inline-block mt-6 text-sm transition-colors"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          Volver a inspireai.es →
        </Link>
      </div>
    </div>
  );
}
