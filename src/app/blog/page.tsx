import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/sections/footer";
import { PageHeader } from "@/components/page-header";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd } from "@/lib/seo";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Blog & Technology Insights — Criska Business Consulting",
  description:
    "Expert insights on AI & Generative AI, cybersecurity resilience, cloud migration, software engineering, and digital transformation.",
  alternates: { canonical: "https://criska.in/blog" },
  keywords: [
    "Criska Blog",
    "Criska Technology Insights",
    "Generative AI Enterprise Articles",
    "Cybersecurity Insights",
    "Cloud Architecture Blog",
  ],
};

export default function BlogPage() {
  const { blog } = site;
  const [lead, ...rest] = blog.featured;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
        ]}
      />
      <Nav />
      <main className="flex-1">
        <PageHeader eyebrow={blog.eyebrow} title={blog.title} lead={blog.lead} />

        {/* Featured */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-6 md:px-10">
            <div className="text-[12.5px] uppercase tracking-[0.14em] text-faint">Featured Articles</div>

            <a href={`/blog/${lead.slug}`} className="group mt-6 block rounded-[var(--radius)] border border-border bg-surface p-8 transition-all hover:border-border-strong hover:shadow-[0_24px_60px_-34px_rgba(0,0,0,0.4)] md:p-12">
              <span className="text-[12.5px] uppercase tracking-[0.12em] text-accent">{lead.category}</span>
              <h2 className="font-display mt-4 max-w-[20ch] text-[32px] leading-tight sm:text-[44px]">{lead.title}</h2>
              <p className="mt-4 max-w-[60ch] text-[16.5px] leading-relaxed text-muted">{lead.excerpt}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-[15px] text-foreground">
                Read more
                <svg className="transition-transform group-hover:translate-x-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </span>
            </a>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {rest.map((post) => (
                <a key={post.title} href={`/blog/${post.slug}`} className="group flex flex-col rounded-[var(--radius)] border border-border bg-surface p-7 transition-all hover:border-border-strong hover:shadow-[0_24px_60px_-34px_rgba(0,0,0,0.4)]">
                  <span className="text-[12px] uppercase tracking-[0.12em] text-accent">{post.category}</span>
                  <h3 className="font-display mt-3 text-[24px] leading-tight">{post.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{post.excerpt}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-[14px] text-foreground">
                    Read more
                    <svg className="transition-transform group-hover:translate-x-1" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="bg-panel py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-6 md:px-10">
            <div className="text-[12.5px] uppercase tracking-[0.14em] text-faint">Blog Categories</div>
            <h2 className="font-display mt-3 text-[30px] leading-tight sm:text-[40px]">Explore by topic</h2>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {blog.categories.map((c) => (
                <div key={c.title} className="rounded-[var(--radius)] border border-border bg-surface p-6">
                  <h3 className="font-display text-[20px] leading-tight">{c.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trending */}
        <section className="border-t border-border py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-6 md:px-10">
            <div className="text-[12.5px] uppercase tracking-[0.14em] text-faint">Trending Topics</div>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {blog.trending.map((t) => (
                <span key={t} className="rounded-full border border-border bg-surface px-4 py-2 text-[14px] text-foreground/80 transition-colors hover:border-border-strong hover:text-foreground">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
