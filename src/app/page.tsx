import { Nav } from "@/components/nav";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Services } from "@/components/sections/services";
import { Security } from "@/components/sections/security";
import { Industries } from "@/components/sections/industries";
import { WhyChoose } from "@/components/sections/why-choose";
import { Clients } from "@/components/sections/clients";
import { CtaContact } from "@/components/sections/cta-contact";
import { Footer } from "@/components/sections/footer";

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
        <WhyChoose />
        <Clients />
        <CtaContact />
      </main>
      <Footer />
    </>
  );
}
