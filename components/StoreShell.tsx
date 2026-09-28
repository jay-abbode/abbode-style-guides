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
      className={`font-ui focus-ring inline-flex min-h-11 items-center rounded-full px-4 text-[13px] font-semibold uppercase tracking-[0.18em] transition-colors touch-manipulation ${
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
      <header className="sticky top-0 z-40 bg-plum pt-[env(safe-area-inset-top)] shadow-md shadow-plum/20">
        <div
          className={`mx-auto flex ${maxw} items-center justify-between gap-4 px-5 py-3 md:px-8`}
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
              className="font-ui focus-ring ml-2 inline-flex min-h-11 items-center px-2 text-[12px] uppercase tracking-[0.18em] text-pink/70 hover:text-porcelain"
            >
              Full guide
            </Link>
          </nav>
        </div>
      </header>
      <main
        className={`mx-auto ${maxw} px-5 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] md:px-8 md:py-10`}
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
