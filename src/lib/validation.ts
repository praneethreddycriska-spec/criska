/** Shared input validation — used on BOTH the client (forms) and the server (APIs). */
import { isValidPhoneNumber } from "libphonenumber-js";

// Local + domain with a letters-only TLD of 2+ chars. Dots allowed but not at
// the edges of a label (the `..` / leading / trailing checks below enforce that).
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

/** Trim; treat null/undefined as "". */
export function cleanText(v: unknown): string {
  return String(v ?? "").trim();
}

/** True when the value is empty or only whitespace. */
export function isBlank(v: unknown): boolean {
  return cleanText(v).length === 0;
}

export function isValidEmail(v: unknown): boolean {
  const s = cleanText(v);
  if (s.length < 5 || s.length > 254) return false;
  if (s.includes("..")) return false; // reject consecutive dots (a@b.....com)
  const at = s.indexOf("@");
  if (at < 1 || at !== s.lastIndexOf("@")) return false; // exactly one @, not first char
  const local = s.slice(0, at);
  const domain = s.slice(at + 1);
  // No dot at the edge of the local part or the domain.
  if (local.startsWith(".") || local.endsWith(".")) return false;
  if (domain.startsWith(".") || domain.endsWith(".") || domain.startsWith("-")) return false;
  return EMAIL_RE.test(s);
}

/**
 * Phone is optional; if present it must be a valid E.164 number
 * (i.e. include the country calling code, e.g. "+919876543210").
 * The PhoneField always submits this format.
 */
export function isValidPhone(v: unknown): boolean {
  const s = cleanText(v);
  if (!s) return true;
  try {
    return isValidPhoneNumber(s);
  } catch {
    return false;
  }
}

/** A required free-text field: non-blank and within a max length. */
export function isValidText(v: unknown, min = 1, max = 4000): boolean {
  const s = cleanText(v);
  return s.length >= min && s.length <= max;
}

/** A person name: has at least one letter (rejects "!!", "12", "----"). */
export function isValidName(v: unknown): boolean {
  const s = cleanText(v);
  return s.length >= 2 && s.length <= 200 && /\p{L}/u.test(s);
}

/** Optional URL field: empty is OK, otherwise must be a real http(s) URL. */
export function isValidHttpUrl(v: unknown): boolean {
  const s = cleanText(v);
  if (!s) return true;
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Returns the URL only if it is a safe http(s) URL, else "". Use at render time
 * so a stored `javascript:`/`data:` URL can never become a live/clickable link.
 */
export function safeHttpUrl(v: unknown): string {
  const s = cleanText(v);
  if (!s) return "";
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:" ? s : "";
  } catch {
    return "";
  }
}

export type FieldErrors = Record<string, string>;

/**
 * Validates the fields common to the contact / consultation / apply forms.
 * Returns a map of field → message (empty map = valid). Pure, so the client
 * and server share the exact same rules.
 */
export function validateLead(input: {
  full_name?: unknown;
  email?: unknown;
  phone?: unknown;
}): FieldErrors {
  const errors: FieldErrors = {};
  if (isBlank(input.full_name)) errors.full_name = "Please enter your name.";
  else if (!isValidName(input.full_name)) errors.full_name = "Please enter a valid name.";
  if (isBlank(input.email)) errors.email = "Please enter your email.";
  else if (!isValidEmail(input.email)) errors.email = "Please enter a valid email address.";
  if (!isValidPhone(input.phone)) errors.phone = "Please enter a valid phone number.";
  return errors;
}
