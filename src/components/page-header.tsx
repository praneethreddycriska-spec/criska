export function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-0 pastel-wash opacity-80" />
      <div className="relative mx-auto max-w-[1200px] px-6 pb-16 pt-36 md:px-10 md:pb-20 md:pt-44">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="font-display mt-4 max-w-[18ch] text-[40px] leading-[1.05] sm:text-[58px]">
          {title}
        </h1>
        {lead && <p className="mt-6 max-w-[60ch] text-[18px] leading-relaxed text-muted">{lead}</p>}
      </div>
    </section>
  );
}
