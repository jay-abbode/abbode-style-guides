import { notFound } from "next/navigation";
import { getMergedCell, sampleImageFor } from "@/lib/data";
import { assetUrl } from "@/lib/assets";
import { CellImages } from "@/components/CellImages";
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
import { imageSizeFor, guideBox } from "@/components/imageSize";

export const dynamic = "force-dynamic";

export default async function MergedCellPage({
  params,
}: {
  params: { product: string; template: string };
}) {
  const cell = await getMergedCell(params.product, params.template);
  if (!cell) notFound();
  const { product, template, spec, placement, cell_images, max_width, max_height, rules } =
    cell;
  const deviates = (product.deviates ?? "").toLowerCase().trim() === "yes";
  const box = guideBox[imageSizeFor(product.product_id)];

  return (
    <PageShell back={{ href: "/matrix", label: "Matrix" }}>
      <Overline>Cell guide</Overline>
      <GuideTitle>
        {template.template_name} {product.product_name}
      </GuideTitle>
      <DeviationTag deviates={deviates} />

      <div className="no-print mt-5">
        <DownloadPDF label="Download guide" />
      </div>

      <div className={`mt-6 grid grid-cols-1 gap-6 ${cell_images.length > 1 ? box.wide : box.cols}`}>
        <CellImages
          images={cell_images}
          fallbackSrc={assetUrl(sampleImageFor(spec) ?? undefined)}
          alt={`${template.template_name} sample`}
          className={box.img}
        />
        <div className="space-y-8">
          <Section title="Design">
            <FactList
              facts={[
                { label: "Offering", value: spec.offering },
                { label: "Text size", value: spec.text_size },
                { label: "Characters per line", value: spec.chars_per_line },
                { label: "Max lines", value: spec.max_lines },
                {
                  label: "Icons",
                  value:
                    spec.icon_count && spec.icon_count !== "0"
                      ? `${spec.icon_count} × ${spec.icon_size}`
                      : "",
                },
                { label: "Arrangement", value: spec.arrangement },
                { label: "Spacing", value: spec.spacing },
                { label: "Max width", value: max_width },
                { label: "Max height", value: max_height },
              ]}
            />
            {rules.length > 0 && (
              <div className="mt-4">
                <Bullets items={rules.map((r) => r.text)} />
              </div>
            )}
          </Section>

          <Section title="Placement" tier="item">
            <FactList
              facts={[
                { label: "Placement", value: placement ? placement.text : "" },
              ]}
            />
            {product.item_notes && (
              <div className="mt-4">
                <Bullets items={[product.item_notes]} />
              </div>
            )}
          </Section>
        </div>
      </div>

      <div className="no-print mt-10 flex flex-wrap gap-3">
        <LinkButton href={`/templates/${spec.spec_id}`}>
          Spec sheet
        </LinkButton>
        <LinkButton href={`/products/${product.product_id}`}>
          Product guide
        </LinkButton>
      </div>
    </PageShell>
  );
}
