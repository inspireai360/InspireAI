"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Check, ArrowLeft, AlertCircle } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────

export type QuestionType =
  | "text"
  | "email"
  | "textarea"
  | "radio"
  | "single_select"
  | "select"
  | "multi_select"
  | "scale"
  | "number"
  | "currency"
  | "percentage"
  | "number_group"
  | "fixed";

export interface QuestionOptionObject {
  value: string;
  description?: string;
}
export type QuestionOption = string | QuestionOptionObject;

export interface Question {
  id: string;
  label: string;
  type: QuestionType;
  placeholder?: string;
  options?: QuestionOption[];
  required?: boolean;
  helper?: string;
  fields?: string[];
  value?: string;
  currency?: string;
}

export type AreaKey =
  | "ventas"
  | "marketing"
  | "operaciones"
  | "delivery"
  | "administracion_documentacion";

// ── Option helpers ─────────────────────────────────────────────────────────────

function optVal(opt: QuestionOption): string {
  return typeof opt === "string" ? opt : opt.value;
}

function optDesc(opt: QuestionOption): string | undefined {
  return typeof opt === "string" ? undefined : opt.description;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const AREA_LABELS: Record<AreaKey, string> = {
  ventas: "Ventas",
  marketing: "Marketing",
  operaciones: "Operaciones",
  delivery: "Delivery / Fulfillment",
  administracion_documentacion: "Administración y Documentación",
};

const NO_SINGLE_ID_TYPES: QuestionType[] = [
  "radio",
  "single_select",
  "multi_select",
  "fixed",
  "scale",
  "number_group",
];

// ── Props ──────────────────────────────────────────────────────────────────────

interface OnboardingFormProps {
  area: AreaKey;
  areaTitle: string;
  areaSubtitle: string;
  questions: Question[];
  accessKey: string;
}

interface DatosGenerales {
  empresa: string;
  contacto: string;
  email: string;
  telefono: string;
}

// ── Draft ─────────────────────────────────────────────────────────────────────

const DRAFT_VERSION = "1";
// Bump when question IDs / structure change to prevent restoring stale drafts
const FORM_SCHEMA_VERSION = "1.3";
// Auto-expire drafts older than 14 days
const DRAFT_TTL_MS = 14 * 24 * 60 * 60 * 1000;

interface FormDraft {
  version: string;
  formVersion: string;
  area: AreaKey;
  datos: DatosGenerales;
  respuestas: Record<string, string>;
  observaciones: string;
  savedAt: string;
}

function draftKey(area: AreaKey): string {
  return `inspireai_onboarding_draft_${area}`;
}

function loadDraft(area: AreaKey): FormDraft | null {
  try {
    const raw = localStorage.getItem(draftKey(area));
    if (!raw) return null;
    const draft = JSON.parse(raw) as FormDraft;
    if (draft.version !== DRAFT_VERSION || draft.area !== area) return null;
    if (draft.formVersion !== FORM_SCHEMA_VERSION) {
      localStorage.removeItem(draftKey(area));
      return null;
    }
    if (Date.now() - new Date(draft.savedAt).getTime() > DRAFT_TTL_MS) {
      localStorage.removeItem(draftKey(area));
      return null;
    }
    return draft;
  } catch {
    return null;
  }
}

function persistDraft(
  area: AreaKey,
  datos: DatosGenerales,
  respuestas: Record<string, string>,
  observaciones: string
): string {
  const savedAt = new Date().toISOString();
  const draft: FormDraft = {
    version: DRAFT_VERSION,
    formVersion: FORM_SCHEMA_VERSION,
    area,
    datos,
    respuestas,
    observaciones,
    savedAt,
  };
  try {
    localStorage.setItem(draftKey(area), JSON.stringify(draft));
  } catch {}
  return savedAt;
}

function eraseDraft(area: AreaKey): void {
  try { localStorage.removeItem(draftKey(area)); } catch {}
}

function fmtTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function OnboardingForm({
  area,
  areaTitle,
  areaSubtitle,
  questions,
  accessKey,
}: OnboardingFormProps) {
  const [datos, setDatos] = useState<DatosGenerales>({
    empresa: "",
    contacto: "",
    email: "",
    telefono: "",
  });
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const [observaciones, setObservaciones] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitDebug, setSubmitDebug] = useState<{
    recordId: string;
    tableName: string;
    area: string;
    areaValue: string;
  } | null>(null);

  const [showRestorePrompt, setShowRestorePrompt] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved">("idle");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const isSubmittingRef = useRef(false);

  const clearError = (key: string) =>
    setErrors((prev) => {
      const n = { ...prev };
      delete n[key];
      return n;
    });

  const handleDatos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDatos((prev) => ({ ...prev, [name]: value }));
    clearError(name);
  };

  const handleRespuesta = (id: string, value: string) => {
    setRespuestas((prev) => ({ ...prev, [id]: value }));
    clearError(id);
  };

  const handleMultiSelect = (id: string, val: string, checked: boolean) => {
    setRespuestas((prev) => {
      const current = prev[id] ? prev[id].split(",").filter(Boolean) : [];
      const updated = checked
        ? [...current, val]
        : current.filter((v) => v !== val);
      return { ...prev, [id]: updated.join(",") };
    });
    clearError(id);
  };

  const handleNumberGroup = (id: string, idx: number, value: string) => {
    setRespuestas((prev) => ({ ...prev, [`${id}__${idx}`]: value }));
    clearError(id);
  };

  // Draft load on mount — show restore prompt if non-empty draft exists
  useEffect(() => {
    const draft = loadDraft(area);
    if (!draft) return;
    const hasContent =
      draft.datos.empresa.trim() ||
      draft.datos.contacto.trim() ||
      draft.datos.email.trim() ||
      Object.values(draft.respuestas).some((v) => v.trim()) ||
      draft.observaciones.trim();
    if (!hasContent) return;
    setShowRestorePrompt(true);
    setSavedAt(draft.savedAt);
  }, [area]);

  // Autosave with 1 s debounce — skipped while restore prompt is visible or after submit
  useEffect(() => {
    if (showRestorePrompt || isSubmitted) return;
    const hasContent =
      datos.empresa.trim() ||
      datos.contacto.trim() ||
      datos.email.trim() ||
      Object.values(respuestas).some((v) => v.trim()) ||
      observaciones.trim();
    if (!hasContent) return;
    const timeout = setTimeout(() => {
      const ts = persistDraft(area, datos, respuestas, observaciones);
      setSavedAt(ts);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [datos, respuestas, observaciones, area, showRestorePrompt, isSubmitted]);

  const handleRestoreDraft = () => {
    const draft = loadDraft(area);
    if (!draft) { setShowRestorePrompt(false); return; }
    setDatos(draft.datos);
    setRespuestas(draft.respuestas);
    setObservaciones(draft.observaciones);
    setShowRestorePrompt(false);
  };

  const handleDiscardDraft = () => {
    eraseDraft(area);
    setShowRestorePrompt(false);
    setSavedAt(null);
  };

  const handleSaveNow = () => {
    const ts = persistDraft(area, datos, respuestas, observaciones);
    setSavedAt(ts);
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 3000);
  };

  const handleClearDraft = () => {
    eraseDraft(area);
    setSavedAt(null);
    setSaveStatus("idle");
    setShowClearConfirm(false);
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!datos.empresa.trim()) errs.empresa = "Campo obligatorio";
    if (!datos.contacto.trim()) errs.contacto = "Campo obligatorio";
    if (!datos.email.trim()) {
      errs.email = "Campo obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(datos.email)) {
      errs.email = "Email no válido";
    }
    questions.forEach((q) => {
      if (!q.required || q.type === "fixed") return;
      if (q.type === "number_group") {
        if (!respuestas[`${q.id}__0`]?.trim()) errs[q.id] = "Campo obligatorio";
      } else if (q.type === "multi_select") {
        if (!respuestas[q.id]?.trim()) errs[q.id] = "Selecciona al menos una opción";
      } else {
        if (!respuestas[q.id]?.trim()) errs[q.id] = "Campo obligatorio";
      }
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;
    if (!validate()) {
      document.querySelector("[data-error='true']")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setSubmitError("");

    // Collapse number_group sub-fields into a single formatted string
    const finalRespuestas: Record<string, string> = {};
    questions.forEach((q) => {
      if (q.type === "fixed") return;
      if (q.type === "number_group" && q.fields) {
        const parts = q.fields.map(
          (label, idx) =>
            `${label}: ${respuestas[`${q.id}__${idx}`]?.trim() ?? ""}`
        );
        finalRespuestas[q.id] = parts.join(" | ");
        return;
      }
      const val = respuestas[q.id];
      if (val !== undefined) finalRespuestas[q.id] = val;
    });

    // Full structured list — every non-fixed question with its label, type, and answer
    const respuestasDetalladas = questions
      .filter((q) => q.type !== "fixed")
      .map((q) => ({
        id: q.id,
        label: q.label,
        type: q.type,
        answer: finalRespuestas[q.id] ?? "",
      }));

    try {
      const res = await fetch("/api/onboarding/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessKey,
          area,
          empresa: datos.empresa,
          contacto: datos.contacto,
          email: datos.email,
          telefono: datos.telefono,
          respuestas: finalRespuestas,
          respuestasDetalladas,
          observaciones,
        }),
      });

      const data = (await res.json()) as {
        success: boolean;
        error?: string;
        recordId?: string;
        tableName?: string;
        area?: string;
        areaValue?: string;
      };
      if (!res.ok || !data.success) throw new Error(data.error ?? "Error al enviar");
      if (!data.recordId) throw new Error("No se recibió confirmación del servidor");

      setSubmitDebug({
        recordId: data.recordId,
        tableName: data.tableName ?? "?",
        area: data.area ?? "?",
        areaValue: data.areaValue ?? "?",
      });
      eraseDraft(area);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Ha ocurrido un error. Inténtalo de nuevo."
      );
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  // ── Success screen ──────────────────────────────────────────────────────────

  if (isSubmitted) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{ background: "#09090B" }}
      >
        <div
          className="w-full max-w-md p-10 text-center"
          style={{
            background: "#111115",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "16px",
          }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: "rgba(34,197,94,0.12)" }}
          >
            <Check className="w-8 h-8" style={{ color: "#22C55E" }} />
          </div>
          <h2
            className="font-heading font-bold text-white mb-3"
            style={{ fontSize: "1.5rem" }}
          >
            ¡Cuestionario enviado!
          </h2>
          <p style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>
            Hemos recibido tus respuestas del área de{" "}
            <strong style={{ color: "white" }}>{AREA_LABELS[area]}</strong>.
            <br />
            El equipo de InspireAI las analizará y se pondrá en contacto contigo
            en las próximas 24–48 horas.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-8 text-sm font-medium"
            style={{ color: "#818CF8" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a InspireAI
          </Link>
          {submitDebug && (
            <div
              className="mt-6 text-left rounded-lg px-4 py-3 space-y-1"
              style={{
                background: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.06)",
                fontSize: "0.68rem",
                color: "rgba(255,255,255,0.35)",
                fontFamily: "monospace",
              }}
            >
              <div>record: {submitDebug.recordId}</div>
              <div>tabla: {submitDebug.tableName}</div>
              <div>area: {submitDebug.area} → {submitDebug.areaValue}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen" style={{ background: "#09090B" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 py-4 border-b"
        style={{
          background: "rgba(9,9,11,0.9)",
          backdropFilter: "blur(16px)",
          borderColor: "rgba(255,255,255,0.05)",
        }}
      >
        <div className="mx-auto px-6 max-w-3xl flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm transition-colors"
            style={{ color: "rgba(255,255,255,0.5)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(255,255,255,0.5)")
            }
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Link>
          <span
            className="font-orbitron font-bold tracking-[0.05em] text-white"
            style={{ fontSize: "1rem" }}
          >
            INSPIRE<span style={{ color: "#818CF8" }}>AI</span>
          </span>
          <span
            className="text-xs px-3 py-1 rounded-full"
            style={{
              background: "rgba(91,98,244,0.12)",
              border: "1px solid rgba(91,98,244,0.25)",
              color: "#A5B4FC",
            }}
          >
            {AREA_LABELS[area]}
          </span>
        </div>
      </header>

      <main className="mx-auto px-6 max-w-3xl py-12 md:py-16">

        {/* ── Restore prompt ───────────────────────────────────────────── */}
        {showRestorePrompt && (
          <div
            className="mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl"
            style={{
              background: "rgba(91,98,244,0.08)",
              border: "1px solid rgba(91,98,244,0.25)",
            }}
          >
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: "#A5B4FC" }}>
                Tienes un borrador guardado
              </p>
              {savedAt && (
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Guardado el{" "}
                  {new Date(savedAt).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}{" "}
                  a las {fmtTime(savedAt)}
                </p>
              )}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={handleRestoreDraft}
                className="text-sm px-4 py-2 rounded-lg font-medium"
                style={{
                  background: "rgba(91,98,244,0.2)",
                  border: "1px solid rgba(91,98,244,0.4)",
                  color: "#A5B4FC",
                }}
              >
                Continuar
              </button>
              <button
                type="button"
                onClick={handleDiscardDraft}
                className="text-sm px-4 py-2 rounded-lg"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                Empezar de cero
              </button>
            </div>
          </div>
        )}

        <div className="mb-10">
          <h1
            className="font-heading font-bold text-white mb-3"
            style={{
              fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
              letterSpacing: "-0.02em",
            }}
          >
            {areaTitle}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
            {areaSubtitle}
          </p>
          {!showRestorePrompt && !isSubmitted && (
            <div className="flex items-center gap-3 mt-3">
              <span
                className="text-xs"
                style={{ color: saveStatus === "saved" ? "#4ADE80" : "rgba(255,255,255,0.28)" }}
              >
                {saveStatus === "saved"
                  ? "✓ Guardado"
                  : savedAt
                  ? `Guardado a las ${fmtTime(savedAt)}`
                  : "Sin guardar aún"}
              </span>
              <button
                type="button"
                onClick={handleSaveNow}
                className="ml-auto text-xs transition-colors"
                style={{ color: "rgba(255,255,255,0.3)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
              >
                Guardar progreso
              </button>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-10">

          {/* ── Sección 1: Datos generales ──────────────────────────────── */}
          <section>
            <SectionHeader number="01" title="Datos generales" />
            <div className="space-y-5">
              <FormRow label="Empresa" htmlFor="empresa" error={errors.empresa} required>
                <input
                  id="empresa"
                  name="empresa"
                  value={datos.empresa}
                  onChange={handleDatos}
                  placeholder="Nombre de tu empresa u organización"
                  className={`input-field${errors.empresa ? " error" : ""}`}
                  data-error={!!errors.empresa}
                />
              </FormRow>

              <FormRow
                label="Nombre completo"
                htmlFor="contacto"
                error={errors.contacto}
                required
              >
                <input
                  id="contacto"
                  name="contacto"
                  value={datos.contacto}
                  onChange={handleDatos}
                  placeholder="Tu nombre y apellidos"
                  className={`input-field${errors.contacto ? " error" : ""}`}
                  data-error={!!errors.contacto}
                />
              </FormRow>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormRow label="Email" htmlFor="email" error={errors.email} required>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={datos.email}
                    onChange={handleDatos}
                    placeholder="tu@empresa.com"
                    className={`input-field${errors.email ? " error" : ""}`}
                    data-error={!!errors.email}
                  />
                </FormRow>

                <FormRow label="Teléfono" htmlFor="telefono">
                  <input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    value={datos.telefono}
                    onChange={handleDatos}
                    placeholder="+34 600 000 000"
                    className="input-field"
                  />
                </FormRow>
              </div>
            </div>
          </section>

          {/* ── Sección 2: Diagnóstico del área ─────────────────────────── */}
          <section>
            <SectionHeader
              number="02"
              title={`Diagnóstico de ${AREA_LABELS[area]}`}
            />
            <div className="space-y-8">
              {questions.map((q, idx) => {
                const htmlFor = NO_SINGLE_ID_TYPES.includes(q.type)
                  ? undefined
                  : q.id;
                const selectedVals =
                  q.type === "multi_select"
                    ? (respuestas[q.id] ?? "").split(",").filter(Boolean)
                    : [];

                return (
                  <div key={q.id} data-error={!!errors[q.id]}>
                    <label
                      htmlFor={htmlFor}
                      className="block mb-1.5"
                      style={{
                        color: "rgba(255,255,255,0.85)",
                        fontSize: "0.9rem",
                        fontWeight: 500,
                      }}
                    >
                      <span
                        className="mr-2 font-bold"
                        style={{ color: "#5B62F4", fontSize: "0.75rem" }}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      {q.label}
                      {q.required && (
                        <span style={{ color: "#F87171", marginLeft: "4px" }}>
                          *
                        </span>
                      )}
                    </label>

                    {q.helper && (
                      <p
                        className="mb-2 text-xs"
                        style={{
                          color: "rgba(255,255,255,0.4)",
                          lineHeight: 1.5,
                        }}
                      >
                        {q.helper}
                      </p>
                    )}

                    {/* fixed ─────────────────────────────────────────────── */}
                    {q.type === "fixed" && (
                      <div
                        className="px-4 py-3 rounded-lg text-sm"
                        style={{
                          background: "rgba(91,98,244,0.06)",
                          border: "1px solid rgba(91,98,244,0.15)",
                          color: "rgba(255,255,255,0.7)",
                        }}
                      >
                        {q.value}
                      </div>
                    )}

                    {/* textarea ──────────────────────────────────────────── */}
                    {q.type === "textarea" && (
                      <textarea
                        id={q.id}
                        value={respuestas[q.id] ?? ""}
                        onChange={(e) => handleRespuesta(q.id, e.target.value)}
                        placeholder={q.placeholder}
                        rows={4}
                        className={`input-field resize-none${
                          errors[q.id] ? " error" : ""
                        }`}
                        style={{
                          fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
                        }}
                      />
                    )}

                    {/* text ──────────────────────────────────────────────── */}
                    {q.type === "text" && (
                      <input
                        id={q.id}
                        type="text"
                        value={respuestas[q.id] ?? ""}
                        onChange={(e) => handleRespuesta(q.id, e.target.value)}
                        placeholder={q.placeholder}
                        className={`input-field${errors[q.id] ? " error" : ""}`}
                      />
                    )}

                    {/* email ─────────────────────────────────────────────── */}
                    {q.type === "email" && (
                      <input
                        id={q.id}
                        type="email"
                        value={respuestas[q.id] ?? ""}
                        onChange={(e) => handleRespuesta(q.id, e.target.value)}
                        placeholder={q.placeholder ?? "tu@empresa.com"}
                        className={`input-field${errors[q.id] ? " error" : ""}`}
                      />
                    )}

                    {/* number ────────────────────────────────────────────── */}
                    {q.type === "number" && (
                      <input
                        id={q.id}
                        type="number"
                        value={respuestas[q.id] ?? ""}
                        onChange={(e) => handleRespuesta(q.id, e.target.value)}
                        placeholder={q.placeholder ?? "0"}
                        min={0}
                        className={`input-field w-48${errors[q.id] ? " error" : ""}`}
                      />
                    )}

                    {/* currency ──────────────────────────────────────────── */}
                    {q.type === "currency" && (
                      <div className="flex items-center gap-3">
                        <span
                          className="text-base"
                          style={{ color: "rgba(255,255,255,0.5)" }}
                        >
                          {q.currency ?? "€"}
                        </span>
                        <input
                          id={q.id}
                          type="number"
                          value={respuestas[q.id] ?? ""}
                          onChange={(e) => handleRespuesta(q.id, e.target.value)}
                          placeholder="0"
                          min={0}
                          className={`input-field w-48${errors[q.id] ? " error" : ""}`}
                        />
                      </div>
                    )}

                    {/* percentage ────────────────────────────────────────── */}
                    {q.type === "percentage" && (
                      <div className="flex items-center gap-3">
                        <input
                          id={q.id}
                          type="number"
                          value={respuestas[q.id] ?? ""}
                          onChange={(e) => handleRespuesta(q.id, e.target.value)}
                          placeholder="0"
                          min={0}
                          max={100}
                          className={`input-field w-36${errors[q.id] ? " error" : ""}`}
                        />
                        <span style={{ color: "rgba(255,255,255,0.5)" }}>%</span>
                      </div>
                    )}

                    {/* select ────────────────────────────────────────────── */}
                    {q.type === "select" && (
                      <select
                        id={q.id}
                        value={respuestas[q.id] ?? ""}
                        onChange={(e) => handleRespuesta(q.id, e.target.value)}
                        className={`input-field appearance-none${
                          errors[q.id] ? " error" : ""
                        }`}
                        style={{
                          color: respuestas[q.id]
                            ? "white"
                            : "rgba(255,255,255,0.25)",
                        }}
                      >
                        <option value="" disabled style={{ background: "#09090B" }}>
                          Selecciona una opción
                        </option>
                        {q.options?.map((opt) => {
                          const v = optVal(opt);
                          return (
                            <option
                              key={v}
                              value={v}
                              style={{ background: "#09090B", color: "white" }}
                            >
                              {v}
                            </option>
                          );
                        })}
                      </select>
                    )}

                    {/* radio / single_select ─────────────────────────────── */}
                    {(q.type === "radio" || q.type === "single_select") && (
                      <div className="space-y-2 mt-1">
                        {q.options?.map((opt) => {
                          const v = optVal(opt);
                          const desc = optDesc(opt);
                          const selected = respuestas[q.id] === v;
                          return (
                            <label
                              key={v}
                              className="flex items-start gap-3 cursor-pointer"
                              style={{
                                padding: "10px 14px",
                                borderRadius: "8px",
                                border: `1px solid ${
                                  selected
                                    ? "rgba(91,98,244,0.45)"
                                    : "rgba(255,255,255,0.06)"
                                }`,
                                background: selected
                                  ? "rgba(91,98,244,0.08)"
                                  : "rgba(255,255,255,0.02)",
                                transition: "all 150ms ease",
                              }}
                            >
                              <div
                                className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center"
                                style={{
                                  borderColor: selected
                                    ? "#5B62F4"
                                    : "rgba(255,255,255,0.2)",
                                  background: selected ? "#5B62F4" : "transparent",
                                }}
                              >
                                {selected && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                )}
                              </div>
                              <input
                                type="radio"
                                name={q.id}
                                value={v}
                                checked={selected}
                                onChange={() => handleRespuesta(q.id, v)}
                                className="sr-only"
                              />
                              <div className="flex-1">
                                <span
                                  style={{
                                    color: selected
                                      ? "white"
                                      : "rgba(255,255,255,0.6)",
                                    fontSize: "0.875rem",
                                    display: "block",
                                  }}
                                >
                                  {v}
                                </span>
                                {desc && (
                                  <span
                                    style={{
                                      color: "rgba(255,255,255,0.35)",
                                      fontSize: "0.78rem",
                                      display: "block",
                                      marginTop: "2px",
                                    }}
                                  >
                                    {desc}
                                  </span>
                                )}
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    )}

                    {/* multi_select ──────────────────────────────────────── */}
                    {q.type === "multi_select" && (
                      <div className="space-y-2 mt-1">
                        {q.options?.map((opt) => {
                          const v = optVal(opt);
                          const desc = optDesc(opt);
                          const checked = selectedVals.includes(v);
                          return (
                            <label
                              key={v}
                              className="flex items-start gap-3 cursor-pointer"
                              style={{
                                padding: "10px 14px",
                                borderRadius: "8px",
                                border: `1px solid ${
                                  checked
                                    ? "rgba(91,98,244,0.45)"
                                    : "rgba(255,255,255,0.06)"
                                }`,
                                background: checked
                                  ? "rgba(91,98,244,0.08)"
                                  : "rgba(255,255,255,0.02)",
                                transition: "all 150ms ease",
                              }}
                            >
                              <div
                                className="mt-0.5 flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center"
                                style={{
                                  borderColor: checked
                                    ? "#5B62F4"
                                    : "rgba(255,255,255,0.2)",
                                  background: checked ? "#5B62F4" : "transparent",
                                }}
                              >
                                {checked && (
                                  <Check className="w-2.5 h-2.5 text-white" />
                                )}
                              </div>
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={(e) =>
                                  handleMultiSelect(q.id, v, e.target.checked)
                                }
                                className="sr-only"
                              />
                              <div className="flex-1">
                                <span
                                  style={{
                                    color: checked
                                      ? "white"
                                      : "rgba(255,255,255,0.6)",
                                    fontSize: "0.875rem",
                                    display: "block",
                                  }}
                                >
                                  {v}
                                </span>
                                {desc && (
                                  <span
                                    style={{
                                      color: "rgba(255,255,255,0.35)",
                                      fontSize: "0.78rem",
                                      display: "block",
                                      marginTop: "2px",
                                    }}
                                  >
                                    {desc}
                                  </span>
                                )}
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    )}

                    {/* scale ─────────────────────────────────────────────── */}
                    {q.type === "scale" && (
                      <div className="mt-2">
                        <div className="flex gap-2 flex-wrap">
                          {[1, 2, 3, 4, 5].map((n) => {
                            const selected = respuestas[q.id] === String(n);
                            return (
                              <button
                                key={n}
                                type="button"
                                onClick={() => handleRespuesta(q.id, String(n))}
                                className="w-12 h-12 rounded-lg font-bold text-sm transition-all"
                                style={{
                                  border: `1px solid ${
                                    selected
                                      ? "rgba(91,98,244,0.6)"
                                      : "rgba(255,255,255,0.1)"
                                  }`,
                                  background: selected
                                    ? "rgba(91,98,244,0.15)"
                                    : "rgba(255,255,255,0.02)",
                                  color: selected
                                    ? "white"
                                    : "rgba(255,255,255,0.4)",
                                  cursor: "pointer",
                                }}
                              >
                                {n}
                              </button>
                            );
                          })}
                        </div>
                        <p
                          className="text-xs mt-2"
                          style={{ color: "rgba(255,255,255,0.3)" }}
                        >
                          1 = Necesitan muchas mejoras · 5 = Totalmente optimizadas
                        </p>
                      </div>
                    )}

                    {/* number_group ──────────────────────────────────────── */}
                    {q.type === "number_group" && (
                      <div className="space-y-3 mt-1">
                        {q.fields?.map((fieldLabel, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-4">
                            <label
                              className="text-sm flex-shrink-0"
                              style={{
                                color: "rgba(255,255,255,0.6)",
                                minWidth: "160px",
                              }}
                            >
                              {fieldLabel}
                            </label>
                            <input
                              type="number"
                              value={respuestas[`${q.id}__${fIdx}`] ?? ""}
                              onChange={(e) =>
                                handleNumberGroup(q.id, fIdx, e.target.value)
                              }
                              placeholder="0"
                              min={0}
                              className={`input-field w-32${
                                errors[q.id] ? " error" : ""
                              }`}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {errors[q.id] && (
                      <p
                        className="mt-1.5 text-xs flex items-center gap-1"
                        style={{ color: "#F87171" }}
                      >
                        <AlertCircle className="w-3 h-3" />
                        {errors[q.id]}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── Sección 3: Observaciones adicionales ─────────────────────── */}
          <section>
            <SectionHeader number="03" title="Observaciones adicionales" optional />
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Cualquier información adicional que quieras compartir: contexto específico de tu empresa, prioridades, plazos, etc."
              rows={4}
              className="input-field resize-none"
              style={{ fontFamily: "var(--font-dm-sans), system-ui, sans-serif" }}
            />
          </section>

          {/* ── Error de envío ───────────────────────────────────────────── */}
          {submitError && (
            <div
              className="flex items-start gap-3 p-4 rounded-xl"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.25)",
              }}
            >
              <AlertCircle
                className="w-5 h-5 flex-shrink-0 mt-0.5"
                style={{ color: "#F87171" }}
              />
              <p style={{ color: "#FCA5A5", fontSize: "0.875rem" }}>{submitError}</p>
            </div>
          )}

          {/* ── Botón submit ─────────────────────────────────────────────── */}
          <div className="pt-2 pb-10">
            {savedAt && !showClearConfirm && (
              <div className="mb-4 text-center">
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(true)}
                  className="text-xs"
                  style={{ color: "rgba(255,255,255,0.22)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.22)")}
                >
                  Borrar borrador guardado
                </button>
              </div>
            )}
            {showClearConfirm && (
              <div
                className="mb-4 p-3 rounded-lg text-center text-xs"
                style={{
                  background: "rgba(239,68,68,0.06)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                ¿Seguro? Se perderá el progreso guardado.{" "}
                <button type="button" onClick={handleClearDraft} className="font-medium" style={{ color: "#F87171" }}>
                  Sí, borrar
                </button>{" "}
                ·{" "}
                <button type="button" onClick={() => setShowClearConfirm(false)} style={{ color: "rgba(255,255,255,0.45)" }}>
                  Cancelar
                </button>
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary disabled:opacity-50"
              style={{ borderRadius: "10px", fontSize: "1rem", padding: "16px" }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Enviando cuestionario...
                </span>
              ) : (
                "Enviar cuestionario de diagnóstico"
              )}
            </button>
            <p
              className="text-center mt-3"
              style={{ color: "rgba(255,255,255,0.22)", fontSize: "0.73rem" }}
            >
              El borrador se guarda solo en este dispositivo y no se envía hasta que pulses Enviar.
            </p>
            <p
              className="text-center mt-1"
              style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.78rem" }}
            >
              Tus respuestas se guardan de forma segura y solo las verá el equipo de InspireAI.
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}

// ── Subcomponentes ────────────────────────────────────────────────────────────

function SectionHeader({
  number,
  title,
  optional,
  badge,
}: {
  number: string;
  title: string;
  optional?: boolean;
  badge?: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center gap-3 mb-6 pb-4"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      <span
        className="w-7 h-7 rounded-full flex items-center justify-center font-bold flex-shrink-0"
        style={{
          background: "rgba(91,98,244,0.12)",
          border: "1px solid rgba(91,98,244,0.3)",
          color: "#818CF8",
          fontSize: "0.7rem",
        }}
      >
        {number}
      </span>
      <h2
        className="font-heading font-bold text-white"
        style={{ fontSize: "1.05rem" }}
      >
        {title}
      </h2>
      {badge}
      {optional && (
        <span className="text-xs ml-auto" style={{ color: "rgba(255,255,255,0.3)" }}>
          Opcional
        </span>
      )}
    </div>
  );
}

function FormRow({
  label,
  htmlFor,
  error,
  required,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5" data-error={!!error}>
      <label
        htmlFor={htmlFor}
        className="block"
        style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", fontWeight: 500 }}
      >
        {label}
        {required && (
          <span style={{ color: "#F87171", marginLeft: "4px" }}>*</span>
        )}
      </label>
      {children}
      {error && (
        <p className="text-xs flex items-center gap-1" style={{ color: "#F87171" }}>
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}
