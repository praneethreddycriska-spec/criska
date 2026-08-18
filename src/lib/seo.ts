/**
 * SEO + GEO helpers — canonical site facts and Schema.org JSON-LD builders.
 * Structured data is the single biggest lever for both rich results (Google)
 * and citations in AI answer engines (ChatGPT/Perplexity/Gemini/Claude — "GEO").
 */

export const SITE_URL = "https://criska.in";
export const SITE_NAME = "Criska";

export const ORG = {
  name: "Criska Business Consulting",
  legalName: "Criska Business Consulting Pvt. Ltd.",
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
  founded: "2014",
  phone: "+91 8121485444",
  email: "info@criska.in",
  description:
    "Criska Business Consulting is an AI-enabled technology services partner — AI & Generative AI, cloud, cybersecurity, software & product engineering, data & analytics, IT infrastructure, staffing and consulting — serving clients across India, the UK, and the US since 2014.",
  address: {
    street: "H No 1-98/5/2A, Spacion Business Towers, Madhapur, Shaikpet",
    city: "Hyderabad",
    region: "Telangana",
    postalCode: "500081",
    country: "IN",
  },
  areaServed: ["India", "United Kingdom", "United States"],
  // Add verified profile URLs here as they exist (LinkedIn, etc.) — strengthens the entity.
  sameAs: [] as string[],
};

/** Keywords used across metadata — mirrors the language people/LLMs search with. */
export const SITE_KEYWORDS = [
  "Criska",
  "Criska Business Consulting",
  "IT services company Hyderabad",
  "AI and Generative AI consulting",
  "cloud infrastructure services",
  "cybersecurity services",
  "software development company",
  "IT staffing and talent",
  "managed IT services",
  "digital transformation partner",
  "technology consulting India UK US",
];

type Json = Record<string, unknown>;

export function organizationJsonLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: ORG.name,
    legalName: ORG.legalName,
    url: ORG.url,
    logo: ORG.logo,
    description: ORG.description,
    foundingDate: ORG.founded,
    email: ORG.email,
    telephone: ORG.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: ORG.address.street,
      addressLocality: ORG.address.city,
      addressRegion: ORG.address.region,
      postalCode: ORG.address.postalCode,
      addressCountry: ORG.address.country,
    },
    areaServed: ORG.areaServed,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: ORG.phone,
      email: ORG.email,
      contactType: "sales",
      areaServed: ["IN", "GB", "US"],
      availableLanguage: ["English"],
    },
    ...(ORG.sameAs.length ? { sameAs: ORG.sameAs } : {}),
  };
}

export function websiteJsonLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en",
  };
}

/** Local SEO — helps "IT company near me / in Hyderabad" and map surfaces. */
export function localBusinessJsonLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#localbusiness`,
    name: ORG.name,
    image: ORG.logo,
    url: ORG.url,
    telephone: ORG.phone,
    email: ORG.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: ORG.address.street,
      addressLocality: ORG.address.city,
      addressRegion: ORG.address.region,
      postalCode: ORG.address.postalCode,
      addressCountry: ORG.address.country,
    },
    areaServed: ORG.areaServed,
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

export function faqJsonLd(items: { q: string; a: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

export function serviceListJsonLd(services: { title: string; desc: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Criska technology & consulting services",
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: s.title,
        description: s.desc,
        provider: { "@id": `${SITE_URL}/#organization` },
        areaServed: ORG.areaServed,
      },
    })),
  };
}

export function jobPostingsJsonLd(
  jobs: { id: string; title: string; description: string; department?: string; location?: string; type?: string }[],
): Json {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: jobs.map((j, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "JobPosting",
        title: j.title,
        description: j.description || `${j.title} at ${ORG.name}.`,
        employmentType: (j.type || "FULL_TIME").toUpperCase().replace(/[^A-Z]/g, "_"),
        hiringOrganization: { "@type": "Organization", name: ORG.name, sameAs: SITE_URL, logo: ORG.logo },
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: ORG.address.city,
            addressRegion: ORG.address.region,
            addressCountry: ORG.address.country,
          },
        },
        applicantLocationRequirements: { "@type": "Country", name: "India" },
        directApply: true,
      },
    })),
  };
}

export function eventListJsonLd(
  events: { title: string; overview: string; date: string; location?: string }[],
): Json {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: events.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Event",
        name: e.title,
        description: e.overview,
        startDate: e.date,
        location: { "@type": "Place", name: e.location || "Hyderabad, India" },
        organizer: { "@id": `${SITE_URL}/#organization` },
      },
    })),
  };
}

export function articleJsonLd(post: {
  slug: string;
  title: string;
  excerpt?: string;
  date?: string;
  author?: string;
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || "",
    ...(post.date ? { datePublished: post.date } : {}),
    author: { "@type": post.author ? "Person" : "Organization", name: post.author || ORG.name },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    inLanguage: "en",
  };
}
