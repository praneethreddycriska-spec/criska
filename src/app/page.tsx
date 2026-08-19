import { Nav } from "@/components/nav";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Services } from "@/components/sections/services";
import { Security } from "@/components/sections/security";
import { Industries } from "@/components/sections/industries";
import { TechShowcase } from "@/components/sections/tech-showcase";
import { WhyChoose } from "@/components/sections/why-choose";
import { LeadershipMembers } from "@/components/sections/leadership-members";
import { Clients } from "@/components/sections/clients";
import { CtaContact } from "@/components/sections/cta-contact";
import { Footer } from "@/components/sections/footer";
import { JsonLd } from "@/components/json-ld";
import { serviceListJsonLd, faqJsonLd } from "@/lib/seo";
import { site } from "@/content/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Criska — AI-Enabled Technology Services Partner | Business Consulting",
  description:
    "Criska Business Consulting is an ISO 27001 certified technology partner in Madhapur, Hyderabad, delivering AI & Generative AI, cloud infrastructure, cybersecurity, software development, data analytics, and IT staffing across India, UK, and US since 2014.",
  alternates: { canonical: "https://criska.org/" },
};

export const revalidate = 300; // ISR: cached, refreshed every 5 min

export default function Home() {
  const serviceItems = site.services.items.map((s) => ({ title: s.title, desc: s.desc }));
  const faqItems = (site.faq?.items ?? []).map((f) => ({ q: f.q, a: f.a }));

  return (
    <>
      <JsonLd data={[serviceListJsonLd(serviceItems), faqJsonLd(faqItems)]} />
      <Nav />
      <main className="flex-1">
        <Hero />
        <About />
        <Services />
        <Security />
        <Industries />
        <TechShowcase />
        <WhyChoose />
        <LeadershipMembers />
        <Clients />
        <CtaContact />
      </main>
      <Footer />
    </>
  );
}
