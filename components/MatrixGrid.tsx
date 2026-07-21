"use client";

import Link from "next/link";
import { useRef, useState } from "react";

interface Cell {
  offered: boolean;
  live: boolean;
  spec_id: string;
  char_limit: string;
}
interface Product {
  product_id: string;
  product_name: string;
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

const TOOLTIP_DELAY_MS = 1500;

export function MatrixGrid({ products, templates, cells }: Props) {
  const [hover, setHover] = useState<{ p: string; t: string } | null>(null);
  const [tip, setTip] = useState<{
    x: number;
    y: number;
    label: string;
    sub: string;
  } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelTip = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    setTip(null);
  };

  const enter = (e: React.MouseEvent, p: Product, t: Template) => {
    setHover({ p: p.product_id, t: t.template_id });
    cancelTip();
    const r = e.currentTarget.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top;
    const c = cells[`${p.product_id}|${t.template_id}`];
    const sub = !c
      ? "Not offered"
      : c.char_limit && c.char_limit !== "TBD"
        ? c.char_limit
        : c.live
          ? "Live"
          : "Offered, not yet live";
    timer.current = setTimeout(() => {
      setTip({ x, y, label: `${p.product_name} × ${t.template_name}`, sub });
    }, TOOLTIP_DELAY_MS);
  };

  return (
    <div
      className="mt-8 -mx-6 overflow-x-auto px-6"
      onMouseLeave={() => {
        setHover(null);
        cancelTip();
      }}
    >
      <table className="border-separate border-spacing-1">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-porcelain" />
            {templates.map((t) => {
              const active = hover?.t === t.template_id;
              return (
                <th
                  key={t.template_id}
                  className={`font-ui w-[76px] px-1 pb-2 align-bottom text-center text-[11px] leading-tight transition-colors ${
                    active ? "font-bold text-cherry" : "font-semibold text-berry"
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
                  className={`font-ui sticky left-0 z-10 w-40 bg-porcelain pr-3 text-right align-middle text-[11px] leading-tight transition-colors ${
                    rowActive ? "font-bold text-cherry" : "font-semibold text-olive"
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
                    "flex h-10 w-[76px] items-center justify-center rounded-lg text-xs transition-all duration-150";
                  const ring = isCell
                    ? "ring-2 ring-berry ring-offset-1 ring-offset-porcelain"
                    : "";
                  const handlers = {
                    onMouseEnter: (e: React.MouseEvent) => enter(e, p, t),
                  };

                  if (c?.live) {
                    return (
                      <td key={t.template_id} {...handlers}>
                        <Link
                          href={`/matrix/${p.product_id}/${t.template_id}`}
                          className={`${base} bg-plum font-semibold text-porcelain hover:scale-105 ${ring}`}
                        >
                          ✓
                        </Link>
                      </td>
                    );
                  }
                  if (c?.offered) {
                    return (
                      <td key={t.template_id} {...handlers}>
                        <div
                          className={`${base} border text-ink-muted ${ring} ${
                            cross
                              ? "border-pink-deep bg-pink-soft"
                              : "border-cream-200 bg-white"
                          }`}
                        >
                          ·
                        </div>
                      </td>
                    );
                  }
                  return (
                    <td key={t.template_id} {...handlers}>
                      <div
                        className={`${base} ${ring} ${
                          cross ? "bg-pink-soft/70" : "bg-parchment/60"
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

      {tip && (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full animate-fade-in rounded-lg bg-espresso px-3 py-1.5 text-center shadow-lg"
          style={{ left: tip.x, top: tip.y - 8 }}
        >
          <div className="font-ui whitespace-nowrap text-xs font-semibold text-porcelain">
            {tip.label}
          </div>
          <div className="font-ui whitespace-nowrap text-[10px] text-pink">
            {tip.sub}
          </div>
        </div>
      )}
    </div>
  );
}
