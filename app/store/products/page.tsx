import Link from "next/link";
import { listStoreProducts } from "@/lib/data";
import { StoreShell, StoreOverline } from "@/components/StoreShell";

export const dynamic = "force-dynamic";

export default async function StoreProductsPage() {
  const products = await listStoreProducts();

  // Group by the Products tab `group` column, in first-seen order.
  const groups: { name: string; items: typeof products }[] = [];
  for (const p of products) {
    const name = (p.group ?? "").trim() || "Other";
    let g = groups.find((x) => x.name === name);
    if (!g) {
      g = { name, items: [] };
      groups.push(g);
    }
    g.items.push(p);
  }

  return (
    <StoreShell active="products">
      <StoreOverline>Products</StoreOverline>
      <h1 className="font-display mt-2 text-3xl font-medium leading-tight tracking-tight text-plum">
        What each item offers
      </h1>

      {products.length === 0 ? (
        <p className="font-sans mt-8 text-plum/70">No live products yet.</p>
      ) : (
        <div className="mt-8 space-y-10">
          {groups.map((g) => (
            <section key={g.name}>
              <h2 className="font-ui text-xs uppercase tracking-[0.28em] text-cherry">
                {g.name}
              </h2>
              <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {g.items.map((p) => (
                  <li key={p.product_id}>
                    <Link
                      href={`/store/products/${p.product_id}`}
                      className="focus-ring block rounded-2xl border border-pink-deep/40 bg-white p-5 transition-colors hover:border-plum"
                    >
                      <span className="font-display text-xl text-plum">
                        {p.product_name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </StoreShell>
  );
}
