import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/sections/footer";
import { CKMark } from "@/components/logo";

export const metadata = {
  title: "Page not found — Criska",
  description: "The page you're looking for doesn't exist or may have moved.",
};

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="flex-1 grid place-items-center px-6 pb-28 pt-40 text-center">
        <div className="mx-auto max-w-md">
          <CKMark className="mx-auto h-12 w-auto text-foreground" />
          <p className="font-display mt-8 text-[72px] leading-none text-accent/90">404</p>
          <h1 className="font-display mt-2 text-[30px] leading-tight text-foreground">
            Page not found
          </h1>
          <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-muted">
            The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved. Let&rsquo;s get
            you back on track.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/" className="btn-pill btn-primary">
              Back to home
            </Link>
            <Link href="/contact" className="btn-pill btn-ghost">
              Contact us
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
