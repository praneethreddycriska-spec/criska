import { site } from "@/content/site";
import { CKMark } from "@/components/logo";

function Column({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <div className="eyebrow">{title}</div>
      <ul className="mt-5 space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href} className="text-[14.5px] leading-snug text-muted transition-colors hover:text-foreground">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const { footer, brand, contact } = site;
  return (
    <footer className="border-t border-border bg-panel">
      <div className="mx-auto max-w-[1200px] px-6 py-16 md:px-10">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-12">
          <div className="col-span-2 lg:col-span-3">
            <div className="flex items-center gap-3 text-foreground">
              <CKMark className="h-9 w-auto" />
              <span className="text-xl font-semibold uppercase tracking-[0.2em]">{brand.name}</span>
            </div>
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-muted">
              {brand.legalName} — {brand.tagline}. Est. {brand.est}, {brand.location}.
            </p>
            <a href="/contact" className="btn-pill btn-primary mt-6">
              Schedule Consultation
            </a>
          </div>

          <div className="lg:col-span-2">
            <Column title="Quick Links" links={footer.quickLinks} />
          </div>
          <div className="lg:col-span-3">
            <Column title="Our Services" links={footer.services} />
          </div>
          <div className="lg:col-span-2">
            <Column title="Industries" links={footer.industries} />
          </div>
          <div className="lg:col-span-2">
            <Column title="Resources" links={footer.resources} />
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
          <div className="text-[12px] uppercase tracking-[0.1em] text-faint">{footer.fine}</div>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-muted">
            <a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`} className="hover:text-foreground">{contact.phone}</a>
            <a href={`mailto:${contact.emails[0]}`} className="hover:text-foreground">{contact.emails[0]}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
