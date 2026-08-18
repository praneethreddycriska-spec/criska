import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/sections/footer";
import { PageHeader } from "@/components/page-header";
import { JsonLd } from "@/components/json-ld";
import { eventListJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { getEvents } from "@/lib/data";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Events — Criska Business Consulting",
  description: "Tech talks, workshops, hackathons, and celebrations at Criska's Hyderabad office.",
  alternates: { canonical: "/events" },
};

export const revalidate = 300; // ISR: cached, refreshed every 5 min (was force-dynamic)

export default async function EventsPage() {
  const { events } = site;
  const items = await getEvents();
  return (
    <>
      <JsonLd data={[eventListJsonLd(items.map((e) => ({ title: e.title, overview: e.overview, date: e.date, location: e.location }))), breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Events", path: "/events" }])]} />
      <Nav />
      <main className="flex-1">
        <PageHeader eyebrow={events.eyebrow} title={events.title} lead={events.lead} />

        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-6 md:px-10">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((ev) => (
                <article
                  key={ev.id}
                  className="group flex flex-col overflow-hidden rounded-[var(--radius)] border border-border bg-surface transition-all duration-300 hover:border-border-strong hover:shadow-[0_24px_60px_-34px_rgba(0,0,0,0.4)]"
                >
                  {/* Image / placeholder */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-panel">
                    {ev.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={ev.image}
                        alt={ev.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <EventPlaceholder />
                    )}
                    <span className="absolute left-4 top-4 rounded-full bg-paper/90 px-3 py-1 text-[11.5px] font-medium tracking-wide text-foreground backdrop-blur">
                      {ev.tag}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-7">
                    <div className="flex items-center gap-2 text-[12.5px] text-faint">
                      <span>{ev.date}</span>
                      <span aria-hidden>·</span>
                      <span>{ev.location}</span>
                    </div>
                    <h2 className="font-display mt-3 text-[23px] leading-tight">{ev.title}</h2>
                    <p className="mt-2.5 text-[14.5px] leading-relaxed text-muted">{ev.overview}</p>
                  </div>
                </article>
              ))}
            </div>

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

function EventPlaceholder() {
  return (
    <div className="grid h-full w-full place-items-center bg-[linear-gradient(135deg,var(--panel),var(--panel-2))] text-faint">
      <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 9h18M8 2v4M16 2v4" />
        <circle cx="8.5" cy="14" r="1.2" fill="currentColor" stroke="none" />
        <path d="M11 16l2-2 3 3" />
      </svg>
    </div>
  );
}
