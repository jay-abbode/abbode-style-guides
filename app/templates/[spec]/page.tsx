import { notFound } from "next/navigation";
import { getSpecPage } from "@/lib/data";
import {
  PageShell,
  Overline,
  GuideTitle,
  Section,
  Bullets,
  FactList,
} from "@/components/Guide";

export const dynamic = "force-dynamic";

export default async function SpecPage({
  params,
}: {
  params: { spec: string };
}) {
  const data = await getSpecPage(params.spec);
  if (!data) notFound();
  const { spec, template, rules } = data;

  return (
    <PageShell back={{ href: "/templates", label: "Templates" }}>
      <Overline>{template.template_name} · Spec sheet</Overline>
      <GuideTitle>{spec.spec_name}</GuideTitle>

      <Section title="Design">
        <FactList
          facts={[
            { label: "Offering", value: spec.offering },
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
            { label: "Characters per line", value: spec.chars_per_line },
            { label: "Max lines", value: spec.max_lines },
            { label: "Max text width", value: spec.max_text_width },
          ]}
        />
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
