import { NextRequest } from "next/server";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 8;

interface RateLimitEntry {
  count: number;
  start: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export function getRequestIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || req.headers.get("x-forwarded") || "unknown";
}

export function checkRateLimit(req: NextRequest, limit = RATE_LIMIT_MAX_REQUESTS, windowMs = RATE_LIMIT_WINDOW_MS) {
  const ip = getRequestIp(req);
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now - entry.start > windowMs) {
    rateLimitStore.set(ip, { count: 1, start: now });
    return { allowed: true, remaining: limit - 1, reset: now + windowMs };
  }

  if (entry.count >= limit) {
    return {
      allowed: false,
      error: `Too many requests. Please wait ${Math.ceil((windowMs - (now - entry.start)) / 1000)} seconds and try again.`,
    };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count, reset: entry.start + windowMs };
}

export function sanitizeInput(value: unknown, max = 1000) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

const SECRETS_RE = /(password|pass|secret|token|api[-_]?key|private key|ssh-rsa|ssh-dss|-----BEGIN (?:RSA )?PRIVATE KEY-----|-----BEGIN PRIVATE KEY-----|Bearer\s+[A-Za-z0-9\-_\.]+)/i;

export function containsSensitiveData(value: string) {
  return SECRETS_RE.test(value);
}

export function isBotSubmission(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

export function isSameSiteRequest(req: NextRequest, allowedOrigin?: string) {
  if (!allowedOrigin) return true;
  const origin = req.headers.get("origin")?.trim();
  const referer = req.headers.get("referer")?.trim();
  if (origin && origin !== allowedOrigin) return false;
  if (referer && !referer.startsWith(allowedOrigin)) return false;
  return true;
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function isValidPhone(value: string) {
  return /^[+()\d\s\-\.]{6,32}$/.test(value);
}
