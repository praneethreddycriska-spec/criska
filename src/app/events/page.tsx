import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/sections/footer";
import { PageHeader } from "@/components/page-header";
import { JsonLd } from "@/components/json-ld";
import { eventListJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { getEvents } from "@/lib/data";
import { site } from "@/content/site";
import { EventsExplorer } from "@/components/events-explorer";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Tech Events, Workshops & Culture — Criska Business Consulting",
  description:
    "Explore tech talks, Generative AI workshops, hackathons, and culture events hosted at Criska Business Consulting, Madhapur, Hyderabad.",
  alternates: { canonical: "https://criska.in/events" },
  keywords: [
    "Criska Events",
    "Criska Tech Talks Hyderabad",
    "Criska Hackathons",
    "Generative AI Workshop Hyderabad",
    "Criska Office Culture",
  ],
};

export const revalidate = 300; // ISR: cached, refreshed every 5 min

export default async function EventsPage() {
  const { events } = site;
  const items = await getEvents();
  return (
    <>
      <JsonLd
        data={[
          eventListJsonLd(
            items.map((e) => ({
              title: e.title,
              overview: e.overview,
              date: e.date,
              location: e.location,
            })),
          ),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Events", path: "/events" },
          ]),
        ]}
      />
      <Nav />
      <main className="flex-1">
        <PageHeader eyebrow={events.eyebrow} title={events.title} lead={events.lead} />

        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-6 md:px-10">
            <Suspense fallback={null}>
              <EventsExplorer items={items} />
            </Suspense>

            {/* CTA */}
            <div className="mt-10 rounded-[var(--radius)] bg-panel p-10 text-center">
              <h2 className="font-display text-[28px] leading-tight">Want to be part of it?</h2>
              <p className="mx-auto mt-2 max-w-md text-[15px] text-muted">
                We&apos;re always meeting great people. Explore open roles or say hello.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <a href="/careers" className="btn-pill btn-primary">View careers</a>
                <a href="/contact" className="btn-pill btn-ghost">Get in touch</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
