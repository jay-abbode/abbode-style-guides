import Link from "next/link";

/** Store View wrapper. Same skeleton as PageShell, flipped palette: plum bar,
 *  pink page, white cards. The wordmark is pink, so it reads on the bar and
 *  would vanish on the page. */
export function StoreShell({
  children,
  active,
  wide,
}: {
  children: React.ReactNode;
  active?: "products" | "matrix";
  wide?: boolean;
}) {
  const maxw = wide ? "max-w-7xl" : "max-w-4xl";
  const tab = (key: "products" | "matrix", href: string, label: string) => (
    <Link
      href={href}
      className={`font-ui focus-ring rounded-full px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.18em] transition-colors ${
        active === key
          ? "bg-pink text-plum"
          : "text-pink hover:bg-cherry hover:text-porcelain"
      }`}
    >
      {label}
    </Link>
  );
  return (
    <div className="min-h-screen bg-pink text-plum">
      <header className="bg-plum">
        <div
          className={`mx-auto flex ${maxw} items-center justify-between gap-4 px-6 py-4`}
        >
          <Link href="/store" className="focus-ring inline-flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/abbode-wordmark.png" alt="abbode" className="h-6 w-auto" />
            <span className="font-ui text-[11px] uppercase tracking-[0.28em] text-pink">
              Store
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            {tab("products", "/store/products", "Products")}
            {tab("matrix", "/store/matrix", "Matrix")}
            <Link
              href="/"
              className="font-ui focus-ring ml-3 text-[11px] uppercase tracking-[0.18em] text-pink/70 hover:text-porcelain"
            >
              Full guide
            </Link>
          </nav>
        </div>
      </header>
      <main className={`mx-auto ${maxw} px-6 py-10`}>{children}</main>
    </div>
  );
}

export function StoreOverline({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-ui text-xs uppercase tracking-[0.28em] text-cherry">
      {children}
    </p>
  );
}

export function StoreTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="font-display mt-2 text-3xl font-medium leading-tight tracking-tight text-plum md:text-4xl">
      {children}
    </h1>
  );
}

/** White card on the pink page. */
export function StoreCard({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={`rounded-2xl border border-pink-deep/40 bg-white p-6 shadow-sm ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

export function PriceTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-ui inline-flex items-center rounded-full bg-plum px-3 py-1 text-sm font-semibold tabular-nums text-pink">
      {children}
    </span>
  );
}
