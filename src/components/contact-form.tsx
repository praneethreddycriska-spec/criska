"use client";

import { useState } from "react";
import { site } from "@/content/site";

const services = site.services.items.map((s) => s.title);

export function ContactForm() {
  const { contact } = site;
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Front-end only for now — wired to a backend in the admin/API phase.
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-[var(--radius)] border border-border bg-surface p-10 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-accent-soft text-accent">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3 className="font-display mt-5 text-[26px]">Thank you — we'll be in touch.</h3>
        <p className="mt-2 text-[15px] text-muted">
          Your inquiry has reached the Criska team. Expect a reply shortly.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[var(--radius)] border border-border bg-surface p-7 shadow-[0_30px_80px_-50px_rgba(10,22,34,0.4)] md:p-9"
    >
      <div className="mb-7">
        <h2 className="font-display text-[26px] leading-tight">Send us a message</h2>
        <p className="mt-1.5 text-[14px] text-muted">Fill in the details below and our team will get back to you.</p>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Full Name" name="name" required />
        <Field label="Company Name" name="company" />
        <Field label="Email Address" name="email" type="email" required />
        <Field label="Phone Number" name="phone" type="tel" />
        <div className="sm:col-span-2">
          <Label>Service Interested In</Label>
          <select
            name="service"
            className="mt-2 w-full rounded-xl border border-border bg-paper px-4 py-3 text-[15px] text-foreground outline-none transition hover:border-border-strong focus:border-foreground focus:ring-2 focus:ring-accent/30"
            defaultValue=""
          >
            <option value="" disabled>Select a service…</option>
            {services.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <Label>Project Requirements</Label>
          <textarea
            name="requirements"
            rows={3}
            className="mt-2 w-full rounded-xl border border-border bg-paper px-4 py-3 text-[15px] text-foreground outline-none transition hover:border-border-strong focus:border-foreground focus:ring-2 focus:ring-accent/30"
            placeholder="Tell us about scope, timeline, and goals…"
          />
        </div>
        <div className="sm:col-span-2">
          <Label>Message</Label>
          <textarea
            name="message"
            rows={3}
            className="mt-2 w-full rounded-xl border border-border bg-paper px-4 py-3 text-[15px] text-foreground outline-none transition hover:border-border-strong focus:border-foreground focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>
      <div className="mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <button type="submit" className="btn-pill btn-primary w-full sm:w-auto">
          {contact.submitLabel}
        </button>
        <span className="text-[12.5px] text-faint">We respect your privacy. No spam, ever.</span>
      </div>
    </form>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-[12.5px] uppercase tracking-[0.12em] text-faint">{children}</label>;
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        type={type}
        name={name}
        required={required}
        className="mt-2 w-full rounded-xl border border-border bg-paper px-4 py-3 text-[15px] text-foreground outline-none transition hover:border-border-strong focus:border-foreground focus:ring-2 focus:ring-accent/30"
      />
    </div>
  );
}
