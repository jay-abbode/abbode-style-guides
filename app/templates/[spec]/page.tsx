import Link from "next/link";
import { notFound } from "next/navigation";
import { getSpecPage, sampleImageFor } from "@/lib/data";
import { assetUrl } from "@/lib/assets";
import { AssetImage } from "@/components/AssetImage";
import {
  PageShell,
  Overline,
  GuideTitle,
  Section,
  Bullets,
  FactList,
} from "@/components/Guide";
import { DownloadPDF } from "@/components/DownloadPDF";

export const dynamic = "force-dynamic";

export default async function SpecPage({
  params,
}: {
  params: { spec: string };
}) {
  const data = await getSpecPage(params.spec);
  if (!data) notFound();
  const { spec, template, rules, products } = data;

  return (
    <PageShell back={{ href: "/templates", label: "Templates" }}>
      <Overline>{template.template_name} · Spec sheet</Overline>
      <GuideTitle>{spec.spec_name}</GuideTitle>

      <div className="no-print mt-5">
        <DownloadPDF label="Download spec sheet" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[220px,1fr]">
        <AssetImage
          src={assetUrl(sampleImageFor(spec) ?? undefined)}
          alt={`${spec.spec_name} sample`}
          className="h-48 w-full object-contain"
        />
        <Section title="Design">
          <FactList
            facts={[
              { label: "Offering", value: spec.offering },
              { label: "Text size", value: spec.text_size },
              {
                label: "Icons",
                value:
                  spec.icon_count && spec.icon_count !== "0"
                    ? `${spec.icon_count} × ${spec.icon_size}`
                    : "",
              },
              { label: "Arrangement", value: spec.arrangement },
              { label: "Spacing", value: spec.spacing },
            ]}
          />
        </Section>
      </div>

      <Section title="Products using this spec" tier="item">
        {products.length === 0 ? (
          <p className="font-sans text-[15px] text-ink-soft">
            Not assigned to any product yet.
          </p>
        ) : (
          <ul className="flex flex-wrap gap-2.5">
            {products.map((p) => (
              <li key={p.product_id}>
                <Link
                  href={`/matrix/${p.product_id}/${template.template_id}`}
                  className="font-ui focus-ring inline-block rounded-full border border-cream-200 bg-white px-4 py-2 text-sm text-plum transition-colors hover:border-berry hover:text-berry"
                >
                  {p.product_name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {rules.length > 0 && (
        <Section title="Rules">
          <Bullets items={rules.map((r) => r.text)} />
        </Section>
      )}

      {spec.notes && (
        <Section title="Notes">
          <p className="font-sans text-[15px] text-espresso">{spec.notes}</p>
        </Section>
      )}
    </PageShell>
  );
}
