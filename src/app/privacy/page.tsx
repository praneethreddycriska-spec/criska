import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/sections/footer";
import { PageHeader } from "@/components/page-header";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy — Criska Business Consulting",
  description:
    "How Criska Business Consulting collects, uses, and protects the personal information you share through criska.in — contact forms, job applications, and site usage.",
  alternates: { canonical: "https://criska.in/privacy" },
};

const UPDATED = "August 2026";

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={[breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Privacy Policy", path: "/privacy" }])]}
      />
      <Nav />
      <main className="flex-1">
        <PageHeader
          eyebrow="Legal"
          title="Privacy Policy"
          lead={`How we handle the information you share with us. Last updated: ${UPDATED}.`}
        />

        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-[760px] px-6 md:px-10">
            <div className="space-y-9 text-[15px] leading-relaxed text-muted">
              <Block title="1. Who we are">
                This Privacy Policy applies to the website <strong className="text-foreground">criska.in</strong> and
                related services operated by <strong className="text-foreground">Criska Business Consulting Pvt. Ltd.</strong>{" "}
                (&ldquo;Criska&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;), Spacion Business Towers, Madhapur, Hyderabad,
                Telangana 500081, India. It explains what personal information we collect, how we use it, and the choices
                you have.
              </Block>

              <Block title="2. Information we collect">
                We collect information you provide directly to us, including:
                <List
                  items={[
                    "Contact & consultation forms — your name, work email, phone number, company, and message.",
                    "Job applications — your name, email, phone, current company, LinkedIn/portfolio links, experience, screening answers, and any files you submit.",
                    "Communications — records of your correspondence with us.",
                  ]}
                />
                We also automatically collect limited technical data (such as anonymised page-visit counts) to keep the
                site secure and improve it. We do not sell your personal information.
              </Block>

              <Block title="3. How we use your information">
                <List
                  items={[
                    "To respond to your enquiries and provide the services you request.",
                    "To assess and manage job applications through our recruitment (ATS) process.",
                    "To operate, secure, and improve our website and services.",
                    "To comply with legal, tax, and regulatory obligations.",
                  ]}
                />
              </Block>

              <Block title="4. Service providers">
                We use trusted third-party processors to run the site and services, including{" "}
                <strong className="text-foreground">Supabase</strong> (database and storage),{" "}
                <strong className="text-foreground">Cloudinary</strong> (media hosting),{" "}
                <strong className="text-foreground">Vercel</strong> (hosting), and{" "}
                <strong className="text-foreground">Google</strong> (secure sign-in for our administrators). These
                providers process data only on our instructions and under their own security and privacy commitments.
              </Block>

              <Block title="5. Cookies & similar technologies">
                We use a minimal set of essential cookies and local storage required for the site to function (for
                example, remembering your theme preference and securing the admin area). We do not use advertising or
                cross-site tracking cookies.
              </Block>

              <Block title="6. Data retention">
                We keep personal information only for as long as necessary to fulfil the purposes described above, to
                comply with our legal obligations, resolve disputes, and enforce our agreements. Job-application data is
                retained for the duration of the recruitment process and a reasonable period thereafter.
              </Block>

              <Block title="7. Security">
                We apply appropriate technical and organisational measures — including encryption in transit, access
                controls, and a cybersecurity-first approach aligned to recognised standards — to protect your
                information. No method of transmission or storage is completely secure, but we work to protect your data
                and review our practices regularly.
              </Block>

              <Block title="8. Your rights">
                Subject to applicable law, you may request access to, correction of, or deletion of your personal
                information, and object to or restrict certain processing. To exercise these rights, contact us using the
                details below and we will respond within a reasonable timeframe.
              </Block>

              <Block title="9. Children">
                Our services are intended for businesses and individuals aged 18 and over. We do not knowingly collect
                personal information from children.
              </Block>

              <Block title="10. Changes to this policy">
                We may update this Privacy Policy from time to time. The &ldquo;last updated&rdquo; date above reflects
                the latest version, and material changes will be posted on this page.
              </Block>

              <Block title="11. Contact us">
                For any privacy question or request, contact us at{" "}
                <a href="mailto:info@criska.in" className="text-accent underline underline-offset-2">info@criska.in</a>{" "}
                or call <a href="tel:+918121485444" className="text-accent underline underline-offset-2">+91 81214 85444</a>.
                You can also reach us at our corporate office in Madhapur, Hyderabad, India.
              </Block>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-[22px] leading-tight text-foreground">{title}</h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map((it) => (
        <li key={it} className="flex gap-2.5">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}
