import Link from "next/link";
import { PouchIcon, MatrixIcon } from "@/components/BrandIcons";

function Card({
  href,
  label,
  desc,
  children,
}: {
  href: string;
  label: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="focus-ring group flex flex-col items-center rounded-3xl border border-cream-200 bg-white px-6 pb-6 pt-7 shadow-sm transition-all hover:-translate-y-1.5 hover:border-berry hover:shadow-lg"
    >
      <div className="flex h-[148px] w-full items-center justify-center">
        {children}
      </div>
      <span className="font-display mt-4 text-2xl font-medium text-plum">
        {label}
      </span>
      <span className="font-ui mt-1 text-[12.5px] tracking-wide text-ink-muted">
        {desc}
      </span>
    </Link>
  );
}

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-porcelain px-6 py-14">
      <div className="w-full max-w-4xl text-center">
        <header className="mb-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/abbode-wordmark.png"
            alt="abbode"
            className="mx-auto h-14 w-auto md:h-16"
          />
          <p className="font-ui mt-3 text-xs uppercase tracking-[0.34em] text-plum">
            Style Guides
          </p>
          <hr className="mx-auto mt-6 h-0.5 w-14 border-0 bg-pink" />
        </header>

        <nav className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Card href="/products" label="Products" desc="Every item's style guide">
            <PouchIcon className="h-full w-auto" />
          </Card>
          <Card href="/templates" label="Templates" desc="Specs grouped by family">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/templates-mark.png"
              alt="abbode wordmark with stitched a"
              className="max-h-[130px] w-auto"
            />
          </Card>
          <Card href="/matrix" label="Matrix" desc="Product × template grid">
            <MatrixIcon className="h-full w-auto" />
          </Card>
        </nav>
      </div>
    </main>
  );
}
