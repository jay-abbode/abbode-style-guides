import { getMatrixGrid } from "@/lib/data";
import { PageShell, Overline } from "@/components/Guide";
import { MatrixGrid } from "@/components/MatrixGrid";

export const dynamic = "force-dynamic";

export default async function MatrixPage() {
  const grid = await getMatrixGrid();

  return (
    <PageShell wide back={{ href: "/", label: "Home" }}>
      <Overline>Matrix</Overline>
      <h1 className="font-display mt-2 text-3xl font-medium leading-tight tracking-tight text-plum">
        Product × template grid
      </h1>
      <p className="font-ui mt-2 text-sm text-ink-muted">
        Filled cells are live. Click one to open the merged guide. Hover a cell to trace its row and column.
      </p>

      {grid.products.length === 0 || grid.templates.length === 0 ? (
        <p className="font-sans mt-8 text-ink-soft">
          Add products and templates to the Sheet to build the grid.
        </p>
      ) : (
        <MatrixGrid
          products={grid.products}
          templates={grid.templates}
          cells={grid.cells}
        />
      )}
    </PageShell>
  );
}
