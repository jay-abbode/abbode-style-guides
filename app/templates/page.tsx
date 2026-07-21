import Link from "next/link";
import { listTemplatesWithSpecs } from "@/lib/data";
import { PageShell, Overline } from "@/components/Guide";

export const dynamic = "force-dynamic";

export default async function TemplatesPage() {
  const groups = await listTemplatesWithSpecs();

  return (
    <PageShell back={{ href: "/", label: "Home" }}>
      <Overline>Templates</Overline>
      <h1 className="font-display mt-2 text-3xl font-medium leading-tight tracking-tight text-plum">
        Specs grouped by family
      </h1>

      {groups.length === 0 ? (
        <p className="font-sans mt-8 text-ink-soft">
          No active templates in the Sheet yet.
        </p>
      ) : (
        <div className="mt-8 space-y-8">
          {groups.map(({ template, specs }) => (
            <section key={template.template_id}>
              <div className="flex items-baseline gap-3">
                <h2 className="font-display text-2xl text-berry">
                  {template.template_name}
                </h2>
                {template.description && (
                  <span className="font-ui text-xs text-ink-muted">
                    {template.description}
                  </span>
                )}
              </div>
              {specs.length === 0 ? (
                <p className="font-sans mt-2 text-sm text-ink-muted">
                  No specs yet.
                </p>
              ) : (
                <ul className="mt-3 flex flex-wrap gap-2.5">
                  {specs.map((s) => (
                    <li key={s.spec_id}>
                      <Link
                        href={`/templates/${s.spec_id}`}
                        className="font-ui focus-ring inline-block rounded-full border border-cream-200 bg-white px-4 py-2 text-sm text-plum transition-colors hover:border-berry hover:text-berry"
                      >
                        {s.spec_name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      )}
    </PageShell>
  );
}
