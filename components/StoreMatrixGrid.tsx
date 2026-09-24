"use client";

import Link from "next/link";
import { useState } from "react";

interface Cell {
  price: string;
  priced: boolean;
}
interface Product {
  product_id: string;
  product_name: string;
  group: string;
}
interface Template {
  template_id: string;
  template_name: string;
}
interface Props {
  products: Product[];
  templates: Template[];
  cells: Record<string, Cell>;
}

/** Product x template grid with the retail price in each offered cell.
 *  Unpriced cells show the placeholder in an outlined chip. */
export function StoreMatrixGrid({ products, templates, cells }: Props) {
  const [hover, setHover] = useState<{ p: string; t: string } | null>(null);

  return (
    <div
      className="mt-8 -mx-6 max-h-[calc(100vh-15rem)] overflow-auto px-6"
      onMouseLeave={() => setHover(null)}
    >
      <table className="border-separate border-spacing-1">
        <thead>
          <tr>
            <th className="sticky left-0 top-0 z-30 bg-pink" />
            {templates.map((t) => {
              const active = hover?.t === t.template_id;
              return (
                <th
                  key={t.template_id}
                  className={`font-ui sticky top-0 z-20 w-[84px] bg-pink px-1 pb-2 align-bottom text-center text-[11px] leading-tight transition-colors ${
                    active ? "font-bold text-cherry" : "font-semibold text-plum"
                  }`}
                >
                  {t.template_name}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const rowActive = hover?.p === p.product_id;
            return (
              <tr key={p.product_id}>
                <th
                  className={`font-ui sticky left-0 z-10 w-44 bg-pink pr-3 text-right align-middle text-[11px] leading-tight transition-colors ${
                    rowActive ? "font-bold text-cherry" : "font-semibold text-plum"
                  }`}
                >
                  {p.product_name}
                </th>
                {templates.map((t) => {
                  const c = cells[`${p.product_id}|${t.template_id}`];
                  const colActive = hover?.t === t.template_id;
                  const cross = rowActive || colActive;
                  const isCell = rowActive && colActive;
                  const base =
                    "flex h-10 w-[84px] items-center justify-center rounded-lg text-xs tabular-nums transition-all duration-150";
                  const ring = isCell
                    ? "ring-2 ring-cherry ring-offset-1 ring-offset-pink"
                    : "";
                  const onEnter = () =>
                    setHover({ p: p.product_id, t: t.template_id });

                  if (c) {
                    const chip = c.priced
                      ? "bg-plum font-semibold text-pink hover:scale-105"
                      : "border border-dashed border-plum/60 bg-white/60 font-medium text-plum/70 hover:scale-105";
                    return (
                      <td key={t.template_id} onMouseEnter={onEnter}>
                        <Link
                          href={`/store/products/${p.product_id}#${t.template_id}`}
                          className={`${base} ${chip} ${ring}`}
                          title={`${t.template_name} ${p.product_name}`}
                        >
                          {c.price}
                        </Link>
                      </td>
                    );
                  }
                  return (
                    <td key={t.template_id} onMouseEnter={onEnter}>
                      <div
                        className={`${base} ${ring} ${
                          cross ? "bg-white/50" : "bg-white/25"
                        }`}
                      />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
