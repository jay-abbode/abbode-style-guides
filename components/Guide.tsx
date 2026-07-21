import Link from "next/link";

/** Top bar with the wordmark (home) and an optional back link, plus a centered
 *  content column. Every page sits inside this. */
export function PageShell({
  children,
  back,
}: {
  children: React.ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <div className="min-h-screen bg-porcelain">
      <header className="border-b border-cream-200">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="focus-ring inline-flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/abbode-wordmark.png" alt="abbode" className="h-6 w-auto" />
            <span className="font-ui text-[11px] uppercase tracking-[0.28em] text-plum">
              Style Guides
            </span>
          </Link>
          {back && (
            <Link
              href={back.href}
              className="font-ui focus-ring text-sm text-ink-soft hover:text-berry"
            >
              ← {back.label}
            </Link>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-10">{children}</main>
    </div>
  );
}

export function Overline({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-ui text-xs uppercase tracking-[0.28em] text-plum">
      {children}
    </p>
  );
}

export function GuideTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="font-display mt-3 text-3xl font-medium leading-tight tracking-tight text-berry md:text-4xl">
      {children}
    </h1>
  );
}

export function DeviationTag({ deviates }: { deviates: boolean }) {
  return deviates ? (
    <span className="font-ui mt-3 inline-block rounded-full bg-pink-soft px-3 py-1 text-xs font-semibold text-cherry">
      Deviates from standard sizing
    </span>
  ) : (
    <span className="font-ui mt-3 inline-block rounded-full bg-sage/30 px-3 py-1 text-xs font-semibold text-olive">
      Does not deviate from standard sizing
    </span>
  );
}

/** A titled section. `tier` tints the heading: design content plum, item
 *  content olive — matching the guide color coding. */
export function Section({
  title,
  tier = "design",
  children,
}: {
  title: string;
  tier?: "design" | "item";
  children: React.ReactNode;
}) {
  const color = tier === "item" ? "text-olive" : "text-plum";
  return (
    <section className="mt-8">
      <h2 className={`font-display text-xl font-medium ${color}`}>{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function Bullets({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="font-sans space-y-2 text-[15px] leading-relaxed text-espresso">
      {items.map((it, i) => (
        <li key={i} className="flex gap-2.5">
          <span aria-hidden className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-pink-deep" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

/** Label / value grid for spec facts. Blank values are skipped. */
export function FactList({
  facts,
}: {
  facts: { label: string; value: string }[];
}) {
  const rows = facts.filter((f) => (f.value ?? "").trim() !== "");
  return (
    <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
      {rows.map((f) => (
        <div key={f.label} className="flex flex-col border-b border-cream-200 pb-2">
          <dt className="font-ui text-[11px] uppercase tracking-wider text-ink-muted">
            {f.label}
          </dt>
          <dd className="font-sans text-[15px] text-espresso">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function LinkButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="font-ui focus-ring inline-flex items-center gap-2 rounded-full border border-cream-200 bg-white px-4 py-2 text-sm font-semibold text-plum transition-colors hover:border-berry hover:text-berry"
    >
      {children}
    </Link>
  );
}
