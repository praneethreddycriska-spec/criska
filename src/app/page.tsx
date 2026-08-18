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
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Criska — AI-Enabled Technology Services Partner",
  description:
    "Criska helps organizations grow through AI & Generative AI, cloud, cybersecurity, software & product engineering, data & analytics, IT infrastructure, staffing and consulting — delivered across India, the UK, and the US since 2014.",
  alternates: { canonical: "/" },
};

export const revalidate = 300; // ISR: cached, refreshed every 5 min (was force-dynamic)

export default function Home() {
  return (
    <>
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
