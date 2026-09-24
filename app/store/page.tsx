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
      className="focus-ring group flex flex-col items-center rounded-3xl border border-pink-deep/40 bg-white px-6 pb-6 pt-7 shadow-sm transition-all hover:-translate-y-1.5 hover:border-plum hover:shadow-lg"
    >
      <div className="flex h-[148px] w-full items-center justify-center">
        {children}
      </div>
      <span className="font-display mt-4 text-2xl font-medium text-plum">
        {label}
      </span>
      <span className="font-ui mt-1 text-[12.5px] tracking-wide text-cherry">
        {desc}
      </span>
    </Link>
  );
}

export default function StoreHome() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-pink px-6 py-14">
      <div className="w-full max-w-3xl text-center">
        <header className="mb-2">
          <div className="mx-auto inline-block rounded-full bg-plum px-8 py-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/abbode-wordmark.png"
              alt="abbode"
              className="mx-auto h-10 w-auto md:h-12"
            />
          </div>
          <p className="font-ui mt-4 text-xs uppercase tracking-[0.34em] text-plum">
            Store
          </p>
          <hr className="mx-auto mt-6 h-0.5 w-14 border-0 bg-plum" />
        </header>

        <nav className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Card href="/store/products" label="Products" desc="What each item offers">
            <PouchIcon className="h-full w-auto" />
          </Card>
          <Card href="/store/matrix" label="Matrix" desc="Prices by product and template">
            <MatrixIcon className="h-full w-auto" />
          </Card>
        </nav>

        <p className="font-ui mt-10 text-xs uppercase tracking-[0.18em] text-plum/60">
          <Link href="/" className="focus-ring hover:text-plum">
            Full guide
          </Link>
        </p>
      </div>
    </main>
  );
}
