/** Shared input validation — used on BOTH the client (forms) and the server (APIs). */
import { isValidPhoneNumber } from "libphonenumber-js";

// Reasonable, strict-enough email pattern: no spaces, a dot-tld of 2+ chars.
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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
  return s.length >= 5 && s.length <= 254 && EMAIL_RE.test(s);
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
  else if (!isValidText(input.full_name, 2, 200)) errors.full_name = "Name looks too short or too long.";
  if (isBlank(input.email)) errors.email = "Please enter your email.";
  else if (!isValidEmail(input.email)) errors.email = "Please enter a valid email address.";
  if (!isValidPhone(input.phone)) errors.phone = "Please enter a valid phone number.";
  return errors;
}
