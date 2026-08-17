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

export const revalidate = 300; // ISR: cached, refreshed every 5 min (was force-dynamic)
export const fetchCache = "force-cache"; // cache Supabase reads so the page can be ISR

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
