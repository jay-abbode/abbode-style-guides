import { notFound } from "next/navigation";
import { getStoreProductPage } from "@/lib/data";
import { assetUrl } from "@/lib/assets";
import { AssetImage } from "@/components/AssetImage";
import {
  StoreShell,
  StoreOverline,
  StoreTitle,
  StoreCard,
  PriceTag,
} from "@/components/StoreShell";

export const dynamic = "force-dynamic";

/** "10 per line, 2 lines (20 characters)" from whatever the spec carries.
 *  Non-numeric values (n/a, var.) fall back to the cap alone. */
function limitText(
  charsPerLine: string,
  maxLines: string,
  charLimit: string,
): string {
  const cpl = Number(charsPerLine);
  const ml = Number(maxLines);
  const cap = charLimit || (cpl && ml ? String(cpl * ml) : "");
  if (cpl && ml) {
    const lines = ml === 1 ? "1 line" : `${ml} lines`;
    return cap
      ? `${cpl} per line, ${lines} (${cap} characters)`
      : `${cpl} per line, ${lines}`;
  }
  return cap ? `${cap} characters` : "";
}

export default async function StoreProductPage({
  params,
}: {
  params: { product: string };
}) {
  const data = await getStoreProductPage(params.product);
  if (!data) notFound();
  const { product, offers } = data;

  return (
    <StoreShell active="products">
      <StoreOverline>Product</StoreOverline>
      <StoreTitle>{product.product_name}</StoreTitle>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[240px,1fr]">
        <StoreCard className="p-3">
          <AssetImage
            src={assetUrl(product.image)}
            alt={product.product_name}
            className="h-48 w-full object-contain md:h-56"
          />
        </StoreCard>
        <div>
          {product.item_notes && (
            <StoreCard>
              <p className="font-sans text-[16px] leading-relaxed text-plum md:text-[17px]">
                {product.item_notes}
              </p>
            </StoreCard>
          )}
        </div>
      </div>

      <div className="mt-10">
        <StoreOverline>Templates</StoreOverline>
        {offers.length === 0 ? (
          <p className="font-sans mt-3 text-plum/70">
            No templates offered on this item yet.
          </p>
        ) : (
          <div className="mt-4 space-y-6">
            {offers.map((o) => {
              const limit = limitText(o.chars_per_line, o.max_lines, o.char_limit);
              const facts = [
                { label: "Limit", value: limit },
                { label: "Layout", value: o.arrangement },
                { label: "Placement", value: o.placement ? o.placement.text : "" },
              ].filter((f) => f.value);
              return (
                <StoreCard key={o.template.template_id} id={o.template.template_id} className="scroll-mt-28">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-2xl text-plum">
                      {o.template.template_name}
                    </h3>
                    <PriceTag>{o.price}</PriceTag>
                  </div>
                  {o.template.description && (
                    <p className="font-sans mt-1 text-[15px] text-cherry">
                      {o.template.description}
                    </p>
                  )}

                  <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-[220px,1fr]">
                    <AssetImage
                      src={assetUrl(o.sample_image ?? undefined)}
                      alt={`${o.template.template_name} sample`}
                      className="h-44 w-full rounded-xl object-contain md:h-52"
                    />
                    <div>
                      {facts.length > 0 && (
                        <dl className="grid grid-cols-1 gap-x-8 gap-y-3">
                          {facts.map((f) => (
                            <div
                              key={f.label}
                              className="flex flex-col border-b border-pink-soft pb-2"
                            >
                              <dt className="font-ui text-[11px] uppercase tracking-wider text-cherry">
                                {f.label}
                              </dt>
                              <dd className="font-sans text-[16px] text-plum md:text-[17px]">
                                {f.value}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      )}
                      {o.rules.length > 0 && (
                        <ul className="font-sans mt-4 space-y-2 text-[15px] leading-relaxed text-plum md:text-[16px]">
                          {o.rules.map((r) => (
                            <li key={r.name} className="flex gap-2.5">
                              <span
                                aria-hidden
                                className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-cherry"
                              />
                              <span>{r.text}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </StoreCard>
              );
            })}
          </div>
        )}
      </div>
    </StoreShell>
  );
}
