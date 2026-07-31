import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/sections/footer";
import { PageHeader } from "@/components/page-header";
import { ContactForm } from "@/components/contact-form";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact — Criska Business Consulting",
  description: "Talk to Criska about consulting, software development, staffing, or outsourcing.",
};

export default function ContactPage() {
  const { contact } = site;
  return (
    <>
      <Nav />
      <main className="flex-1">
        <PageHeader eyebrow={contact.eyebrow} title={contact.title} lead={contact.lead} />

        <section className="py-20 md:py-28">
          <div className="mx-auto grid max-w-[1200px] gap-12 px-6 md:grid-cols-12 md:px-10">
            {/* Details */}
            <div className="md:col-span-5">
              <div className="text-[12.5px] uppercase tracking-[0.14em] text-faint">
                {contact.officeLabel}
              </div>
              <h2 className="font-display mt-3 text-[26px]">{contact.company}</h2>
              <address className="mt-4 space-y-1 text-[15.5px] not-italic leading-relaxed text-muted">
                {contact.address.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </address>

              <div className="mt-8 space-y-4">
                <ContactRow label="Phone">
                  <a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`} className="hover:text-foreground">
                    {contact.phone}
                  </a>
                </ContactRow>
                <ContactRow label="Email">
                  <div className="flex flex-col">
                    {contact.emails.map((e) => (
                      <a key={e} href={`mailto:${e}`} className="hover:text-foreground">{e}</a>
                    ))}
                  </div>
                </ContactRow>
                <ContactRow label="Website">
                  <a href={`https://${contact.website}`} className="hover:text-foreground">{contact.website}</a>
                </ContactRow>
              </div>
            </div>

            {/* Form */}
            <div className="md:col-span-6 md:col-start-7">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function ContactRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-6 border-t border-border pt-4">
      <div className="w-20 shrink-0 text-[12.5px] uppercase tracking-[0.12em] text-faint">{label}</div>
      <div className="text-[15.5px] text-foreground">{children}</div>
    </div>
  );
}
