import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/sections/footer";
import { PageHeader } from "@/components/page-header";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms of Service — Criska Business Consulting",
  description:
    "The terms that govern your use of criska.in and the services provided by Criska Business Consulting Pvt. Ltd.",
  alternates: { canonical: "https://criska.in/terms" },
};

const UPDATED = "August 2026";

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={[breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Terms of Service", path: "/terms" }])]}
      />
      <Nav />
      <main className="flex-1">
        <PageHeader
          eyebrow="Legal"
          title="Terms of Service"
          lead={`The terms that govern your use of this website and our services. Last updated: ${UPDATED}.`}
        />

        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-[760px] px-6 md:px-10">
            <div className="space-y-9 text-[15px] leading-relaxed text-muted">
              <Block title="1. Acceptance of terms">
                These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the website{" "}
                <strong className="text-foreground">criska.in</strong> and related services provided by{" "}
                <strong className="text-foreground">Criska Business Consulting Pvt. Ltd.</strong>{" "}
                (&ldquo;Criska&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). By accessing or using the site, you agree to be
                bound by these Terms. If you do not agree, please do not use the site.
              </Block>

              <Block title="2. Use of the website">
                You may use the site for lawful purposes only. You agree not to misuse the site, attempt to gain
                unauthorised access to any part of it, interfere with its operation, submit false or misleading
                information, or use it to transmit unlawful, harmful, or infringing content.
              </Block>

              <Block title="3. Submissions">
                When you submit an enquiry, consultation request, or job application, you confirm that the information you
                provide is accurate and that you have the right to share it. Your submissions are handled in accordance
                with our{" "}
                <a href="/privacy" className="text-accent underline underline-offset-2">Privacy Policy</a>.
              </Block>

              <Block title="4. Intellectual property">
                The content on this site — including text, graphics, logos, the Criska name and marks, and design — is
                owned by or licensed to Criska and is protected by applicable intellectual-property laws. You may not
                copy, reproduce, or distribute it without our prior written permission, except for personal, non-commercial
                viewing.
              </Block>

              <Block title="5. Services & engagements">
                Information on this site about our services is provided for general reference and does not constitute a
                binding offer. Any professional engagement is governed by a separate written agreement between you and
                Criska, which will prevail over these Terms in the event of any conflict.
              </Block>

              <Block title="6. Third-party links">
                The site may contain links to third-party websites or services that we do not control. We are not
                responsible for the content, policies, or practices of those third parties, and accessing them is at your
                own risk.
              </Block>

              <Block title="7. Disclaimer">
                The site and its content are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without
                warranties of any kind, whether express or implied, including fitness for a particular purpose and
                non-infringement. We do not warrant that the site will be uninterrupted, error-free, or secure.
              </Block>

              <Block title="8. Limitation of liability">
                To the maximum extent permitted by law, Criska shall not be liable for any indirect, incidental, special,
                or consequential damages, or any loss of data, revenue, or profits, arising from your use of, or inability
                to use, the site.
              </Block>

              <Block title="9. Governing law">
                These Terms are governed by the laws of India, and any disputes shall be subject to the exclusive
                jurisdiction of the courts of Hyderabad, Telangana.
              </Block>

              <Block title="10. Changes to these terms">
                We may revise these Terms from time to time. The &ldquo;last updated&rdquo; date above reflects the latest
                version, and continued use of the site after changes are posted constitutes acceptance of the revised
                Terms.
              </Block>

              <Block title="11. Contact us">
                Questions about these Terms? Contact us at{" "}
                <a href="mailto:info@criska.in" className="text-accent underline underline-offset-2">info@criska.in</a>{" "}
                or <a href="tel:+918121485444" className="text-accent underline underline-offset-2">+91 81214 85444</a>.
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
