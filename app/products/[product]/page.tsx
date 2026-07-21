import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductPage } from "@/lib/data";
import { assetUrl } from "@/lib/assets";
import { AssetImage } from "@/components/AssetImage";
import {
  PageShell,
  Overline,
  GuideTitle,
  DeviationTag,
  Section,
  Bullets,
  FactList,
  LinkButton,
} from "@/components/Guide";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: { product: string };
}) {
  const data = await getProductPage(params.product);
  if (!data) notFound();
  const { product, offered } = data;
  const deviates = (product.deviates ?? "").toLowerCase().trim() === "yes";

  return (
    <PageShell back={{ href: "/products", label: "Products" }}>
      <Overline>Product guide</Overline>
      <GuideTitle>{product.product_name}</GuideTitle>
      <DeviationTag deviates={deviates} />

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[220px,1fr]">
        <AssetImage
          src={assetUrl(product.image)}
          alt={product.product_name}
          className="h-48 w-full object-contain"
        />
        <div>
          <Section title="Placement" tier="item">
            <Bullets
              items={[
                product.item_placement,
                product.item_notes,
                product.hoop && product.hoop !== "TBD"
                  ? `Hoop: ${product.hoop}`
                  : "Hoop: to be confirmed",
                product.sew_field && product.sew_field !== "TBD"
                  ? `Sew field: ${product.sew_field}`
                  : "Sew field: to be confirmed",
              ].filter(Boolean)}
            />
          </Section>
        </div>
      </div>

      <div className="mt-10">
        <Overline>Available templates</Overline>
        {offered.length === 0 ? (
          <p className="font-sans mt-3 text-ink-soft">
            No templates offered on this item yet.
          </p>
        ) : (
          <div className="mt-4 space-y-6">
            {offered.map(({ template, spec, char_limit, rules }) => (
              <div
                key={spec.spec_id}
                className="rounded-2xl border border-cream-200 bg-white p-6"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-2xl text-berry">
                    {template.template_name}
                  </h3>
                  <span className="font-ui text-xs uppercase tracking-wider text-ink-muted">
                    {spec.spec_name}
                  </span>
                </div>

                <div className="mt-4">
                  <FactList
                    facts={[
                      { label: "Offering", value: spec.offering },
                      { label: "Character limit", value: char_limit },
                      { label: "Text size", value: spec.text_size },
                      {
                        label: "Icons",
                        value:
                          spec.icon_count && spec.icon_count !== "0"
                            ? `${spec.icon_count} · ${spec.icon_size}`
                            : "",
                      },
                      { label: "Arrangement", value: spec.arrangement },
                      { label: "Spacing", value: spec.spacing },
                      { label: "Max text width", value: spec.max_text_width },
                    ]}
                  />
                </div>

                {rules.length > 0 && (
                  <div className="mt-4">
                    <Bullets items={rules.map((r) => r.text)} />
                  </div>
                )}

                <div className="mt-5 flex flex-wrap gap-3">
                  <LinkButton href={`/templates/${spec.spec_id}`}>
                    View full spec
                  </LinkButton>
                  <LinkButton
                    href={`/matrix/${product.product_id}/${template.template_id}`}
                  >
                    View merged cell
                  </LinkButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
