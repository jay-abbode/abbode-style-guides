import { notFound } from "next/navigation";
import { getMergedCell } from "@/lib/data";
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
import { DownloadPDF } from "@/components/DownloadPDF";

export const dynamic = "force-dynamic";

export default async function MergedCellPage({
  params,
}: {
  params: { product: string; template: string };
}) {
  const cell = await getMergedCell(params.product, params.template);
  if (!cell) notFound();
  const { product, template, spec, char_limit, rules } = cell;
  const deviates = (product.deviates ?? "").toLowerCase().trim() === "yes";

  return (
    <PageShell back={{ href: "/matrix", label: "Matrix" }}>
      <Overline>
        {product.product_name} · {template.template_name}
      </Overline>
      <GuideTitle>
        {template.template_name} {product.product_name}
      </GuideTitle>
      <DeviationTag deviates={deviates} />

      <div className="no-print mt-5">
        <DownloadPDF label="Download guide" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[220px,1fr]">
        <AssetImage
          src={assetUrl(product.image)}
          alt={product.product_name}
          className="h-48 w-full object-contain"
        />
        <div className="space-y-8">
          <Section title="Design">
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
            {rules.length > 0 && (
              <div className="mt-4">
                <Bullets items={rules.map((r) => r.text)} />
              </div>
            )}
          </Section>

          <Section title="Placement" tier="item">
            <Bullets
              items={[
                product.item_placement,
                product.item_notes,
                product.hoop && product.hoop !== "TBD"
                  ? `Hoop: ${product.hoop}`
                  : "Hoop: to be confirmed",
              ].filter(Boolean)}
            />
          </Section>
        </div>
      </div>

      <div className="no-print mt-10 flex flex-wrap gap-3">
        <LinkButton href={`/templates/${spec.spec_id}`}>
          View full spec sheet
        </LinkButton>
        <LinkButton href={`/products/${product.product_id}`}>
          View product
        </LinkButton>
      </div>
    </PageShell>
  );
}
