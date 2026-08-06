import { getSupabase } from "./supabase";
import { site } from "@/content/site";

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

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function getJobs(): Promise<Job[]> {
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
  }));
}

export async function getEvents(): Promise<EventItem[]> {
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

export async function getLeadership(): Promise<Member[]> {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb.from("criska_leadership").select("*").order("sort");
      if (!error && data && data.length > 0) {
        return data.map((r: any) => ({
          id: r.id,
          name: r.name ?? "",
          role: r.role,
          bio: r.bio ?? "",
          image: r.image ?? "",
          linkedin: r.linkedin ?? "#",
          sort: r.sort ?? 0,
        }));
      }
    } catch {
      // fallback
    }
  }
  return site.leadership.members.map((m: any, i: number) => ({
    id: String(i),
    name: m.name ?? "",
    role: m.role,
    bio: m.bio ?? "",
    image: m.image ?? "",
    linkedin: m.linkedin ?? "#",
    sort: i,
  }));
}

export async function getContactInfo(): Promise<ContactInfo> {
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
