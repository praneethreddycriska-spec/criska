/**
 * SEO + GEO helpers — canonical site facts, meta generators, and Schema.org JSON-LD builders.
 * Structured data is the single biggest lever for both rich results (Google)
 * and citations in AI answer engines (ChatGPT/Perplexity/Gemini/Claude — "GEO").
 */

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://criska.org";
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
    latitude: 17.4435,
    longitude: 78.3772,
  },
  areaServed: ["India", "United Kingdom", "United States", "Global"],
  sameAs: [
    "https://www.linkedin.com/company/criska-business-consulting",
    "https://twitter.com/criska_in",
    "https://criska.in",
  ] as string[],
};

/** Expanded keyword registry — mirrors language users and AI engines query with. */
export const SITE_KEYWORDS = [
  "Criska",
  "Criska Business Consulting",
  "Criska Pvt Ltd",
  "Criska Hyderabad",
  "Criska Madhapur",
  "Criska IT Services",
  "Criska Technology Solutions",
  "Criska Careers",
  "Criska ATS",
  "Criska Security",
  "IT services company Hyderabad",
  "AI and Generative AI consulting Hyderabad",
  "cloud infrastructure services India",
  "cybersecurity consulting India UK US",
  "software development company Hyderabad",
  "IT staffing and recruitment partner India",
  "managed IT services company",
  "digital transformation consulting",
  "technology consulting India UK US",
  "Generative AI development partner",
  "ISO 27001 certified IT company Hyderabad",
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
    geo: {
      "@type": "GeoCoordinates",
      latitude: ORG.address.latitude,
      longitude: ORG.address.longitude,
    },
    areaServed: ORG.areaServed,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: ORG.phone,
      email: ORG.email,
      contactType: "customer service",
      areaServed: ["IN", "GB", "US"],
      availableLanguage: ["English", "Telugu", "Hindi"],
    },
    sameAs: ORG.sameAs,
  };
}

export function corporationJsonLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Corporation",
    "@id": `${SITE_URL}/#corporation`,
    name: ORG.name,
    legalName: ORG.legalName,
    url: ORG.url,
    logo: ORG.logo,
    tickerSymbol: "CRISKA",
    description: ORG.description,
    foundingDate: ORG.founded,
    address: {
      "@type": "PostalAddress",
      streetAddress: ORG.address.street,
      addressLocality: ORG.address.city,
      addressRegion: ORG.address.region,
      postalCode: ORG.address.postalCode,
      addressCountry: ORG.address.country,
    },
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
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/careers?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** Local SEO — powers "IT company near me", "Criska Hyderabad", and map surfaces. */
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
    geo: {
      "@type": "GeoCoordinates",
      latitude: ORG.address.latitude,
      longitude: ORG.address.longitude,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:30",
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
        description: j.description || `${j.title} position at ${ORG.name}, Hyderabad office / remote.`,
        employmentType: (j.type || "FULL_TIME").toUpperCase().replace(/[^A-Z]/g, "_"),
        hiringOrganization: {
          "@type": "Organization",
          name: ORG.name,
          sameAs: SITE_URL,
          logo: ORG.logo,
        },
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            streetAddress: ORG.address.street,
            addressLocality: ORG.address.city,
            addressRegion: ORG.address.region,
            postalCode: ORG.address.postalCode,
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
        location: {
          "@type": "Place",
          name: e.location || "Spacion Business Towers, Madhapur, Hyderabad, India",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Hyderabad",
            addressRegion: "Telangana",
            addressCountry: "IN",
          },
        },
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

export function contactPageJsonLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${SITE_URL}/contact/#webpage`,
    url: `${SITE_URL}/contact`,
    name: "Contact Criska Business Consulting",
    description: "Get in touch with Criska for technology services, AI consulting, software engineering, and staffing.",
    mainEntity: { "@id": `${SITE_URL}/#localbusiness` },
  };
}
