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

  // iPad and up: the grid fits the page width, the page itself scrolls, and
  // the template row sticks under the plum bar. Phones: the grid scrolls
  // sideways inside its own box with the product column pinned.
  return (
    <div
      className="-mx-5 mt-6 overflow-x-auto overscroll-x-contain px-5 md:mx-0 md:overflow-visible md:px-0"
      onMouseLeave={() => setHover(null)}
    >
      <table className="border-separate border-spacing-1 md:w-full md:table-fixed">
        <thead>
          <tr>
            <th
              className={`sticky left-0 z-30 w-28 bg-pink md:top-[calc(4.25rem+env(safe-area-inset-top))] md:w-[100px] lg:w-[132px]`}
            />
            {templates.map((t) => {
              const active = hover?.t === t.template_id;
              return (
                <th
                  key={t.template_id}
                  className={`font-ui z-20 w-[84px] bg-pink px-0.5 pb-2 align-bottom text-center text-[11px] leading-tight transition-colors md:sticky md:top-[calc(4.25rem+env(safe-area-inset-top))] md:w-auto md:pt-2 md:text-[10.5px] md:tracking-tight lg:text-[12px] lg:tracking-normal ${
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
                  className={`font-ui sticky left-0 z-10 bg-pink pr-2 text-right align-middle text-[11px] leading-tight transition-colors md:pr-3 md:text-[12px] ${
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
                    "flex h-11 w-full min-w-[52px] items-center justify-center rounded-lg text-[13px] tabular-nums transition-all duration-150 touch-manipulation md:h-12 md:text-sm";
                  const ring = isCell
                    ? "ring-2 ring-cherry ring-offset-1 ring-offset-pink"
                    : "";
                  const onEnter = () =>
                    setHover({ p: p.product_id, t: t.template_id });

                  if (c) {
                    const chip = c.priced
                      ? "bg-plum font-semibold text-pink hover:scale-105 active:scale-95"
                      : "border border-dashed border-plum/60 bg-white/60 font-medium text-plum/70 hover:scale-105 active:scale-95";
                    return (
                      <td key={t.template_id} className="p-0" onMouseEnter={onEnter}>
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
                    <td key={t.template_id} className="p-0" onMouseEnter={onEnter}>
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
