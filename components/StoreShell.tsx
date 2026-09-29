import Link from "next/link";

/** Store View wrapper. Same skeleton as PageShell, flipped palette: plum bar,
 *  pink page, white cards. The wordmark is pink, so it reads on the bar and
 *  would vanish on the page. Sized for an iPad at arm's length: 44px touch
 *  targets, larger body type, safe-area padding for the home indicator. */
export function StoreShell({
  children,
  active,
  wide,
  tone = "pink",
}: {
  children: React.ReactNode;
  active?: "products" | "matrix";
  wide?: boolean;
  /** Page colour. "olive" for pages that show pink product images, so the
   *  image does not read as a hole through the white card to the pink page. */
  tone?: "pink" | "olive";
}) {
  const maxw = wide ? "max-w-7xl" : "max-w-4xl";
  const page =
    tone === "olive" ? "bg-olive text-porcelain" : "bg-pink text-plum";
  const tab = (key: "products" | "matrix", href: string, label: string) => (
    <Link
      href={href}
      className={`font-ui focus-ring inline-flex min-h-11 items-center rounded-full px-3 text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors touch-manipulation sm:px-4 sm:text-[13px] sm:tracking-[0.18em] ${
        active === key
          ? "bg-pink text-plum"
          : "text-pink hover:bg-cherry hover:text-porcelain"
      }`}
    >
      {label}
    </Link>
  );
  return (
    <div className={`group min-h-screen ${page}`} data-tone={tone}>
      {/* Bar is a fixed 4.25rem tall (plus the notch inset) so the matrix can
          pin its template row right under it. */}
      <header className="sticky top-0 z-40 bg-plum pt-[env(safe-area-inset-top)] shadow-md shadow-plum/20">
        <div
          className={`mx-auto flex h-[4.25rem] ${maxw} items-center justify-between gap-3 px-4 md:px-8`}
        >
          <Link href="/store" className="focus-ring inline-flex min-h-11 shrink-0 items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/abbode-wordmark.png" alt="abbode" className="h-6 w-auto" />
            <span className="font-ui hidden text-[11px] uppercase tracking-[0.28em] text-pink sm:inline">
              Store
            </span>
          </Link>
          <nav className="flex shrink-0 items-center gap-1">
            {tab("products", "/store/products", "Products")}
            {tab("matrix", "/store/matrix", "Matrix")}
            <Link
              href="/"
              className="font-ui focus-ring ml-2 hidden min-h-11 items-center px-2 text-[12px] uppercase tracking-[0.18em] text-pink/70 hover:text-porcelain md:inline-flex"
            >
              Full guide
            </Link>
          </nav>
        </div>
      </header>
      <main
        className={`mx-auto ${maxw} px-5 py-6 pb-[max(2rem,env(safe-area-inset-bottom))] md:px-8 md:py-8`}
      >
        {children}
      </main>
    </div>
  );
}

export function StoreOverline({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-ui text-xs uppercase tracking-[0.28em] text-cherry group-data-[tone=olive]:text-sage">
      {children}
    </p>
  );
}

export function StoreTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="font-display mt-2 text-3xl font-medium leading-tight tracking-tight text-plum group-data-[tone=olive]:text-porcelain md:text-4xl">
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
      className={`rounded-2xl border border-pink-deep/40 bg-white p-5 shadow-sm group-data-[tone=olive]:border-sage/40 md:p-6 ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

export function PriceTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-ui inline-flex items-center rounded-full bg-plum px-3.5 py-1.5 text-base font-semibold tabular-nums text-pink">
      {children}
    </span>
  );
}
