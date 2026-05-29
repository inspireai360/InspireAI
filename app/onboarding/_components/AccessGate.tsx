"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

type GateState =
  | { status: "loading" }
  | { status: "valid"; key: string }
  | { status: "invalid"; error: string }
  | { status: "needs-password" };

const SESSION_KEY = "inspireai_access";

interface AccessGateProps {
  accessKey: string | undefined;
  children: (verifiedKey: string) => React.ReactNode;
}

export default function AccessGate({ accessKey, children }: AccessGateProps) {
  const [state, setState] = useState<GateState>({ status: "loading" });
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem(SESSION_KEY);

      if (accessKey) {
        if (cached === accessKey) {
          setState({ status: "valid", key: accessKey });
          return;
        }
        verifyKey(accessKey);
      } else if (cached) {
        setState({ status: "valid", key: cached });
      } else {
        setState({ status: "needs-password" });
      }
    } catch {
      if (accessKey) {
        verifyKey(accessKey);
      } else {
        setState({ status: "needs-password" });
      }
    }
  }, [accessKey]);

  async function verifyKey(key: string) {
    setState({ status: "loading" });
    try {
      const res = await fetch(`/api/verify-access?key=${encodeURIComponent(key)}`);
      const data = (await res.json()) as { valid: boolean; error?: string };
      if (data.valid) {
        try { sessionStorage.setItem(SESSION_KEY, key); } catch { /* ignore */ }
        setState({ status: "valid", key });
      } else {
        setState({ status: "invalid", error: data.error ?? "Clave de acceso incorrecta" });
      }
    } catch {
      setState({ status: "invalid", error: "Error de conexión. Inténtalo de nuevo." });
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = password.trim();
    if (!trimmed) {
      setPasswordError("Introduce la clave de acceso");
      return;
    }
    setIsChecking(true);
    setPasswordError("");
    try {
      const res = await fetch(`/api/verify-access?key=${encodeURIComponent(trimmed)}`);
      const data = (await res.json()) as { valid: boolean; error?: string };
      if (data.valid) {
        try { sessionStorage.setItem(SESSION_KEY, trimmed); } catch { /* ignore */ }
        setState({ status: "valid", key: trimmed });
      } else {
        setPasswordError("Clave de acceso incorrecta");
      }
    } catch {
      setPasswordError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setIsChecking(false);
    }
  }

  if (state.status === "loading") {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-white/10 border-t-[#5B62F4] rounded-full animate-spin" />
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.875rem" }}>
            Verificando acceso...
          </p>
        </div>
      </div>
    );
  }

  if (state.status === "invalid") {
    return <AccessDeniedScreen message={state.error} />;
  }

  if (state.status === "needs-password") {
    return (
      <PasswordScreen
        password={password}
        setPassword={setPassword}
        error={passwordError}
        isChecking={isChecking}
        onSubmit={handlePasswordSubmit}
      />
    );
  }

  return <>{children(state.key)}</>;
}

function PasswordScreen({
  password,
  setPassword,
  error,
  isChecking,
  onSubmit,
}: {
  password: string;
  setPassword: (v: string) => void;
  error: string;
  isChecking: boolean;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "#09090B" }}
    >
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="relative z-10 w-full max-w-sm">
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
          <h1
            className="font-heading font-bold text-white mb-2"
            style={{ fontSize: "1.2rem" }}
          >
            Acceso restringido
          </h1>
          <p
            className="mb-6"
            style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.875rem", lineHeight: 1.6 }}
          >
            Introduce la clave de acceso que te ha proporcionado el equipo de InspireAI.
          </p>
          <form onSubmit={onSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Clave de acceso"
              className="input-field"
              autoFocus
            />
            {error && (
              <p className="text-xs flex items-center gap-1" style={{ color: "#F87171" }}>
                <AlertCircle className="w-3 h-3" />
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={isChecking}
              className="w-full btn-primary disabled:opacity-50"
              style={{ borderRadius: "8px", padding: "12px", fontSize: "0.9rem" }}
            >
              {isChecking ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verificando...
                </span>
              ) : (
                "Acceder"
              )}
            </button>
          </form>
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

function AccessDeniedScreen({ message }: { message: string }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "#09090B" }}
    >
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
            Acceso no permitido
          </h1>
          <p
            className="mb-6"
            style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem", lineHeight: 1.6 }}
          >
            {message}
          </p>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem" }}>
            Si crees que es un error, contacta con el equipo de InspireAI para
            recibir el enlace correcto.
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
