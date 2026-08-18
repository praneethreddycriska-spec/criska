import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/sections/footer";
import { JsonLd } from "@/components/json-ld";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { site } from "@/content/site";

export function generateStaticParams() {
  return site.blog.featured.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = site.blog.featured.find((p) => p.slug === slug);
  if (!post) return { title: "Article — Criska" };
  return {
    title: `${post.title} — Criska`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: { type: "article", title: post.title, description: post.excerpt, url: `/blog/${slug}` },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = site.blog.featured.find((p) => p.slug === slug);
  if (!post) notFound();

  const related = site.blog.featured.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <>
      <JsonLd data={[articleJsonLd({ slug, title: post.title, excerpt: post.excerpt }), breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }, { name: post.title, path: `/blog/${slug}` }])]} />
      <Nav />
      <main className="flex-1">
        <article className="mx-auto max-w-[760px] px-6 pb-20 pt-36 md:pt-44">
          <a href="/blog" className="text-[14px] text-muted transition-colors hover:text-foreground">
            ← Back to Blog
          </a>
          <div className="mt-8 text-[12.5px] uppercase tracking-[0.14em] text-accent">{post.category}</div>
          <h1 className="font-display mt-4 text-[38px] leading-[1.08] sm:text-[52px]">{post.title}</h1>
          <p className="mt-6 text-[19px] leading-relaxed text-muted">{post.excerpt}</p>

          <div className="mt-10 space-y-6 border-t border-border pt-10">
            {post.body.map((p, i) => (
              <p key={i} className="text-[17.5px] leading-[1.7] text-foreground/85">{p}</p>
            ))}
          </div>

          <div className="mt-14 rounded-[var(--radius)] border border-border bg-panel p-8 text-center">
            <h2 className="font-display text-[26px]">Ready to put this into practice?</h2>
            <p className="mx-auto mt-2 max-w-md text-[15px] text-muted">
              Talk to Criska about how these ideas apply to your organization.
            </p>
            <a href="/contact" className="btn-pill btn-primary mt-6">Schedule Consultation</a>
          </div>
        </article>

        {related.length > 0 && (
          <section className="border-t border-border py-16">
            <div className="mx-auto max-w-[1200px] px-6 md:px-10">
              <div className="eyebrow">More insights</div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {related.map((p) => (
                  <a key={p.slug} href={`/blog/${p.slug}`} className="group rounded-[var(--radius)] border border-border bg-surface p-7 transition-all hover:border-border-strong hover:shadow-[0_24px_60px_-34px_rgba(0,0,0,0.4)]">
                    <span className="text-[12px] uppercase tracking-[0.12em] text-accent">{p.category}</span>
                    <h3 className="font-display mt-3 text-[22px] leading-tight">{p.title}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-muted">{p.excerpt}</p>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
