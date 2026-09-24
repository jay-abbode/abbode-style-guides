import { getStoreGrid } from "@/lib/data";
import { StoreShell, StoreOverline } from "@/components/StoreShell";
import { StoreMatrixGrid } from "@/components/StoreMatrixGrid";

export const dynamic = "force-dynamic";

export default async function StoreMatrixPage() {
  const grid = await getStoreGrid();

  return (
    <StoreShell wide active="matrix">
      <StoreOverline>Matrix</StoreOverline>
      <h1 className="font-display mt-2 text-3xl font-medium leading-tight tracking-tight text-plum">
        Prices by product and template
      </h1>

      {grid.products.length === 0 || grid.templates.length === 0 ? (
        <p className="font-sans mt-8 text-plum/70">No live products yet.</p>
      ) : (
        <StoreMatrixGrid
          products={grid.products}
          templates={grid.templates}
          cells={grid.cells}
        />
      )}
    </StoreShell>
  );
}
