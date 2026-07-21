import Link from "next/link";
import { listProducts } from "@/lib/data";
import { PageShell, Overline } from "@/components/Guide";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await listProducts();

  return (
    <PageShell back={{ href: "/", label: "Home" }}>
      <Overline>Products</Overline>
      <h1 className="font-display mt-2 text-3xl font-medium leading-tight tracking-tight text-plum">
        Every item&apos;s style guide
      </h1>

      {products.length === 0 ? (
        <p className="font-sans mt-8 text-ink-soft">
          No active products in the Sheet yet.
        </p>
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {products.map((p) => (
            <li key={p.product_id}>
              <Link
                href={`/products/${p.product_id}`}
                className="focus-ring block rounded-2xl border border-cream-200 bg-white p-5 transition-colors hover:border-berry"
              >
                <span className="font-display text-xl text-plum">
                  {p.product_name}
                </span>
                {p.hoop && p.hoop !== "TBD" && (
                  <span className="font-ui mt-1 block text-xs text-ink-muted">
                    {p.hoop}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
