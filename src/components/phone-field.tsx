"use client";

import { useId, useMemo } from "react";
import {
  getCountries,
  getCountryCallingCode,
  getExampleNumber,
  type CountryCode,
} from "libphonenumber-js";
import examples from "libphonenumber-js/examples.mobile.json";

/** ISO-3166 alpha-2 → 🇮🇳 flag emoji via regional-indicator code points. */
function flagOf(iso: string): string {
  return iso.replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

const regionNames =
  typeof Intl !== "undefined" && "DisplayNames" in Intl
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null;

function nameOf(iso: string): string {
  try {
    return regionNames?.of(iso) ?? iso;
  } catch {
    return iso;
  }
}

/** Sorted country list (name asc), with India surfaced to the top. */
export function useCountryList() {
  return useMemo(() => {
    const list = getCountries().map((iso) => ({
      iso,
      name: nameOf(iso),
      dial: getCountryCallingCode(iso as CountryCode),
      flag: flagOf(iso),
    }));
    list.sort((a, b) => a.name.localeCompare(b.name));
    // Pull the common ones to the top.
    const top = ["IN", "US", "GB", "AE", "AU", "CA", "SG"];
    list.sort((a, b) => {
      const ai = top.indexOf(a.iso);
      const bi = top.indexOf(b.iso);
      if (ai === -1 && bi === -1) return 0;
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
    return list;
  }, []);
}

/** E.164 caps national significant digits at 15; use that as a safe default. */
const DEFAULT_DIGIT_CAP = 15;

/** Cache of derived national-digit caps, computed once per country ISO code. */
const digitCapCache = new Map<string, number>();

/**
 * Derive the expected national-number digit length for a country from
 * libphonenumber-js example (mobile) metadata. This covers ALL supported
 * countries dynamically instead of a hardcoded list. Results are cached so the
 * example lookup runs at most once per country. Falls back to E.164's max of
 * 15 national significant digits if no example is available or the lookup throws.
 */
function digitCapFor(country: string): number {
  const cached = digitCapCache.get(country);
  if (cached !== undefined) return cached;

  let cap = DEFAULT_DIGIT_CAP;
  try {
    const len = getExampleNumber(country as CountryCode, examples)?.nationalNumber
      .length;
    if (typeof len === "number" && len > 0) cap = len;
  } catch {
    cap = DEFAULT_DIGIT_CAP;
  }

  digitCapCache.set(country, cap);
  return cap;
}

/**
 * Strip disallowed characters, then truncate so the string carries at most
 * `cap` digits. Only digits, spaces and parentheses are kept — the national
 * field must NOT accept a leading minus/negative sign or a "+" (the country
 * calling code is chosen separately), so those are stripped on input.
 */
function sanitizePhoneInput(raw: string, cap: number): string {
  const cleaned = raw.replace(/[^\d\s()]/g, "");
  let digitCount = 0;
  let out = "";
  for (const ch of cleaned) {
    const isDigit = ch >= "0" && ch <= "9";
    if (isDigit) {
      if (digitCount >= cap) continue; // drop extra digits beyond the cap
      digitCount += 1;
    }
    out += ch;
  }
  return out;
}

/** Build the E.164 string (e.g. "+919876543210") from a country + typed number. */
export function toE164(country: string, national: string): string {
  const digits = national.replace(/\D/g, "");
  if (!digits) return "";
  try {
    return `+${getCountryCallingCode(country as CountryCode)}${digits}`;
  } catch {
    return `+${digits}`;
  }
}

export function PhoneField({
  label = "Phone Number",
  required = false,
  country,
  onCountryChange,
  value,
  onChange,
  error,
  labelClass = "text-[12.5px] uppercase tracking-[0.12em] text-faint",
}: {
  label?: string;
  required?: boolean;
  country: string;
  onCountryChange: (iso: string) => void;
  value: string; // the national number the user typed
  onChange: (v: string) => void;
  error?: string;
  labelClass?: string;
}) {
  const countries = useCountryList();
  const digitCap = digitCapFor(country);
  const inputId = useId();

  const base =
    "rounded-xl border bg-paper text-[15px] text-foreground outline-none transition focus:ring-2";
  const state = error
    ? "border-[#c0564f] focus:border-[#c0564f] focus:ring-[#c0564f]/30"
    : "border-border hover:border-border-strong focus:border-foreground focus:ring-accent/30";

  return (
    <div>
      <label htmlFor={inputId} className={labelClass}>
        {label}
        {required && <span className="text-accent"> *</span>}
      </label>
      <div className="mt-2 flex gap-2">
        <select
          aria-label="Country calling code"
          value={country}
          onChange={(e) => onCountryChange(e.target.value)}
          className={`${base} ${state} w-[7.5rem] shrink-0 px-2.5 py-3`}
        >
          {countries.map((c) => (
            // Flag + dial only. On systems that render flag emoji you get "🇮🇳 +91";
            // on systems that DON'T (e.g. Windows), the flag falls back to the ISO
            // letters ("IN +91") — so we must NOT also print c.iso or it shows twice.
            <option key={c.iso} value={c.iso}>
              {c.flag} +{c.dial}
            </option>
          ))}
        </select>
        <input
          id={inputId}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          aria-invalid={!!error}
          value={value}
          onChange={(e) => onChange(sanitizePhoneInput(e.target.value, digitCap))}
          maxLength={digitCap + 6}
          placeholder="98765 43210"
          className={`${base} ${state} w-full px-4 py-3`}
        />
      </div>
      {error && <p className="mt-1.5 text-[12.5px]" style={{ color: "#c0564f" }}>{error}</p>}
    </div>
  );
}
