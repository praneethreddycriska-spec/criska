import { unstable_cache } from "next/cache";
import { getSupabase } from "./supabase";
import { site } from "@/content/site";
import type { ScreeningQuestion } from "@/types/ats";

export type Job = {
  id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  description: string;
  applyUrl: string;
  isOpen: boolean;
  sort: number;
  requirements: string[];
  screeningQuestions: ScreeningQuestion[];
};

export type EventItem = {
  id: string;
  title: string;
  tag: string;
  date: string;
  location: string;
  overview: string;
  image: string;
  link: string;
  sort: number;
};

export type Member = {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin: string;
  sort: number;
};

export type ContactInfo = {
  company: string;
  officeLabel: string;
  address: string[];
  phone: string;
  emails: string[];
  website: string;
};

export type ServiceItem = {
  id: string;
  icon: string;
  title: string;
  desc: string;
  includes: string[];
  extra?: { label: string; items: string[] };
  sort: number;
};

/* eslint-disable @typescript-eslint/no-explicit-any */

// Cache DB reads so public pages render fast (and can be ISR) instead of doing a
// Supabase round-trip on every request. Admin never uses these — it reads live.
// Function declarations below are hoisted, so referencing them here is fine.
export const getJobs = unstable_cache(getJobsImpl, ["getJobs"], { revalidate: 60, tags: ["jobs"] });
export const getEvents = unstable_cache(getEventsImpl, ["getEvents"], { revalidate: 300, tags: ["events"] });
export const getLeadership = unstable_cache(getLeadershipImpl, ["getLeadership"], { revalidate: 300, tags: ["leadership"] });
export const getServices = unstable_cache(getServicesImpl, ["getServices"], { revalidate: 300, tags: ["services"] });
export const getContactInfo = unstable_cache(getContactInfoImpl, ["getContactInfo"], { revalidate: 300, tags: ["contact"] });

async function getJobsImpl(): Promise<Job[]> {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data: criskaData, error: criskaErr } = await sb.from("criska_jobs").select("*").order("sort");
      if (!criskaErr && criskaData && criskaData.length > 0) {
        return criskaData.map((r: any) => ({
          id: r.id,
          title: r.title,
          department: r.department ?? "",
          type: r.type ?? "",
          location: r.location ?? "",
          description: r.description ?? "",
          applyUrl: r.apply_url ?? "",
          isOpen: r.is_open ?? true,
          sort: r.sort ?? 0,
          requirements: Array.isArray(r.requirements) ? r.requirements : [],
          screeningQuestions: Array.isArray(r.screening_questions) ? r.screening_questions : [],
        }));
      }

      // Check job_postings as alternative
      const { data: postData, error: postErr } = await sb.from("job_postings").select("*");
      if (!postErr && postData && postData.length > 0) {
        return postData.map((r: any, i: number) => ({
          id: r.id,
          title: r.title,
          department: r.department ?? "",
          type: r.type ?? "",
          location: r.location ?? "",
          description: r.description ?? "",
          applyUrl: "",
          isOpen: r.status === "published",
          sort: i,
          requirements: Array.isArray(r.requirements) ? r.requirements : [],
          screeningQuestions: Array.isArray(r.screening_questions) ? r.screening_questions : [],
        }));
      }
    } catch {
      // ignore & fallback
    }
  }

  // fallback to static
  return site.careers.roles.map((r, i) => ({
    id: String(i),
    title: r.title,
    department: "",
    type: r.type,
    location: "",
    description: "",
    applyUrl: r.applyUrl ?? "",
    isOpen: true,
    sort: i,
    requirements: [],
    screeningQuestions: [],
  }));
}

async function getEventsImpl(): Promise<EventItem[]> {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb.from("criska_events").select("*").order("sort");
      if (!error && data && data.length > 0) {
        return data.map((r: any) => ({
          id: r.id,
          title: r.title,
          tag: r.tag ?? "",
          date: r.date_label ?? "",
          location: r.location ?? "",
          overview: r.overview ?? "",
          image: r.image ?? "",
          link: r.link ?? "",
          sort: r.sort ?? 0,
        }));
      }
    } catch {
      // fallback
    }
  }
  return site.events.items.map((e: any, i: number) => ({
    id: String(i),
    title: e.title,
    tag: e.tag,
    date: e.date,
    location: e.location,
    overview: e.overview,
    image: e.image ?? "",
    link: "",
    sort: i,
  }));
}

async function getLeadershipImpl(): Promise<Member[]> {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb.from("criska_leadership").select("*").order("sort");
      if (!error && data && data.length > 0) {
        return data
          .map((r: any) => ({
            id: r.id,
            name: r.name ?? "",
            role: r.role,
            bio: r.bio ?? "",
            image: r.image ?? "",
            linkedin: r.linkedin ?? "#",
            sort: r.sort ?? 0,
          }))
          .filter((m) => (m.name || "").trim().length > 0 || (m.role || "").trim().length > 0);
      }
    } catch {
      // fallback
    }
  }
  return site.leadership.members
    .map((m: any, i: number) => ({
      id: String(i),
      name: m.name ?? "",
      role: m.role,
      bio: m.bio ?? "",
      image: m.image ?? "",
      linkedin: m.linkedin ?? "#",
      sort: i,
    }))
    .filter((m) => (m.name || "").trim().length > 0 || (m.role || "").trim().length > 0);
}

async function getServicesImpl(): Promise<ServiceItem[]> {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb.from("criska_services").select("*").order("sort");
      if (!error && data && data.length > 0) {
        return data.map((r: any) => ({
          id: r.id,
          icon: r.icon ?? "consulting",
          title: r.title ?? "",
          desc: r.description ?? "",
          includes: Array.isArray(r.includes) ? r.includes : [],
          extra:
            r.extra_label && Array.isArray(r.extra_items) && r.extra_items.length > 0
              ? { label: r.extra_label, items: r.extra_items }
              : undefined,
          sort: r.sort ?? 0,
        }));
      }
    } catch {
      // fall back to static content
    }
  }
  return (site.services.items as any[]).map((s, i) => ({
    id: String(i),
    icon: s.icon,
    title: s.title,
    desc: s.desc,
    includes: s.includes ?? [],
    extra: s.extra,
    sort: i,
  }));
}

async function getContactInfoImpl(): Promise<ContactInfo> {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb.from("criska_contact").select("*").eq("id", 1).maybeSingle();
      if (!error && data) {
        return {
          company: data.company,
          officeLabel: data.office_label ?? "Corporate Office",
          address: Array.isArray(data.address) ? data.address : [],
          phone: data.phone ?? "",
          emails: Array.isArray(data.emails) ? data.emails : [],
          website: data.website ?? "",
        };
      }
    } catch {
      // fallback
    }
  }
  const c = site.contact;
  return {
    company: c.company,
    officeLabel: c.officeLabel,
    address: c.address,
    phone: c.phone,
    emails: c.emails,
    website: c.website,
  };
}
