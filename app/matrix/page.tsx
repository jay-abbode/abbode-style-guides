import Link from "next/link";
import { getMatrixGrid } from "@/lib/data";
import { PageShell, Overline } from "@/components/Guide";

export const dynamic = "force-dynamic";

export default async function MatrixPage() {
  const grid = await getMatrixGrid();

  return (
    <PageShell back={{ href: "/", label: "Home" }}>
      <Overline>Matrix</Overline>
      <h1 className="font-display mt-2 text-3xl font-medium tracking-tight text-plum">
        Product × template grid
      </h1>
      <p className="font-ui mt-2 text-sm text-ink-muted">
        Filled cells are live. Click one to open the merged guide.
      </p>

      {grid.products.length === 0 || grid.templates.length === 0 ? (
        <p className="font-sans mt-8 text-ink-soft">
          Add products and templates to the Sheet to build the grid.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="border-separate border-spacing-1">
            <thead>
              <tr>
                <th className="sticky left-0 bg-porcelain" />
                {grid.templates.map((t) => (
                  <th
                    key={t.template_id}
                    className="font-ui px-2 pb-2 align-bottom text-xs font-semibold text-berry"
                  >
                    <span className="block whitespace-nowrap">
                      {t.template_name}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grid.products.map((p) => (
                <tr key={p.product_id}>
                  <th className="font-ui sticky left-0 bg-porcelain pr-3 text-right text-xs font-semibold text-olive">
                    <span className="block whitespace-nowrap">
                      {p.product_name}
                    </span>
                  </th>
                  {grid.templates.map((t) => {
                    const c = grid.cell(p.product_id, t.template_id);
                    const base =
                      "flex h-10 w-16 items-center justify-center rounded-lg text-xs";
                    if (c.live) {
                      return (
                        <td key={t.template_id}>
                          <Link
                            href={`/matrix/${p.product_id}/${t.template_id}`}
                            className={`${base} focus-ring bg-plum font-semibold text-porcelain transition-transform hover:scale-105`}
                            title={`${p.product_name} × ${t.template_name}`}
                          >
                            ✓
                          </Link>
                        </td>
                      );
                    }
                    if (c.offered) {
                      return (
                        <td key={t.template_id}>
                          <div
                            className={`${base} border border-cream-200 bg-white text-ink-muted`}
                            title="Offered, not yet live"
                          >
                            ·
                          </div>
                        </td>
                      );
                    }
                    return (
                      <td key={t.template_id}>
                        <div className={`${base} bg-parchment/60`} />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageShell>
  );
}
