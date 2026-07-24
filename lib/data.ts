import {
  getProducts,
  getTemplates,
  getSpecs,
  getMatrix,
  getPlacements,
  getRules,
} from "@/lib/sheets";
import { fillTemplate } from "@/lib/rules";
import type {
  ProductRow,
  TemplateRow,
  SpecRow,
  PlacementRow,
  ResolvedPlacement,
  MergedCell,
} from "@/lib/types";

const isActive = (r: { status?: string }) =>
  (r.status ?? "").toLowerCase().trim() !== "inactive" &&
  (r.status ?? "").toLowerCase().trim() !== "archived";

const yes = (v: string) => (v ?? "").toLowerCase().trim() === "yes";

/** Turn a cell's placement_id into something renderable: "Centered", or the
 *  free-text description. Returns null when nothing is set. */
function resolvePlacement(
  placementId: string,
  placements: PlacementRow[],
): ResolvedPlacement | null {
  const p = placements.find((x) => x.placement_id === (placementId ?? "").trim());
  if (!p) return null;
  if (yes(p.centered)) return { centered: true, text: "Centered" };
  const text = (p.description ?? "").trim();
  return text ? { centered: false, text } : null;
}

/** A cell's character limit: its own value when set, otherwise the spec's
 *  default. Lets one spec-level value cover every surface that uses it. */
const limitFor = (cell: string, spec: { char_limit?: string }) =>
  (cell ?? "").trim() || (spec.char_limit ?? "").trim();

/** Resolve the Rules a spec references (its overflow_rule, comma-separated ok),
 *  filling each rule's braces from the merged context. */
function resolveRules(
  spec: SpecRow,
  ctx: Record<string, string>,
  rules: { rule_id: string; rule_name: string; rule_text: string }[],
) {
  const ids = (spec.overflow_rule ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return ids
    .map((id) => rules.find((r) => r.rule_id === id))
    .filter((r): r is NonNullable<typeof r> => Boolean(r))
    .map((r) => ({ name: r.rule_name, text: fillTemplate(r.rule_text, ctx) }));
}

export async function listProducts(): Promise<ProductRow[]> {
  return (await getProducts()).filter(isActive);
}

/** A product page: the item plus every spec it's offered with (via Matrix). */
export async function getProductPage(productId: string) {
  const [products, specs, matrix, templates, placements, rules] =
    await Promise.all([
      getProducts(),
      getSpecs(),
      getMatrix(),
      getTemplates(),
      getPlacements(),
      getRules(),
    ]);
  const product = products.find((p) => p.product_id === productId);
  if (!product) return null;

  const offered = matrix
    .filter((m) => m.product_id === productId && isActive(m))
    .map((m) => {
      const spec = specs.find((s) => s.spec_id === m.spec_id);
      const template = templates.find((t) => t.template_id === m.template_id);
      if (!spec || !template) return null;
      const charLimit = limitFor(m.char_limit, spec);
      const ctx = mergedContext(product, spec, charLimit);
      return {
        template,
        spec,
        placement: resolvePlacement(m.placement_id, placements),
        char_limit: charLimit,
        live: yes(m.live),
        rules: resolveRules(spec, ctx, rules),
      };
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  return { product, offered };
}

/** Templates grouped with their specs. */
export async function listTemplatesWithSpecs() {
  const [templates, specs] = await Promise.all([getTemplates(), getSpecs()]);
  return templates.filter(isActive).map((template) => ({
    template,
    specs: specs.filter((s) => s.template_id === template.template_id),
  }));
}

/** A single spec sheet with its parent template and resolved rules. */
export async function getSpecPage(specId: string) {
  const [specs, templates, rules] = await Promise.all([
    getSpecs(),
    getTemplates(),
    getRules(),
  ]);
  const spec = specs.find((s) => s.spec_id === specId);
  if (!spec) return null;
  const template = templates.find((t) => t.template_id === spec.template_id);
  if (!template) return null;
  const ctx = mergedContext(null, spec, "");
  return { spec, template, rules: resolveRules(spec, ctx, rules) };
}

/** The full matrix: products (rows) x templates (cols) with cell state.
 *  Returns a serializable cells map keyed by `${product_id}|${template_id}`
 *  so it can be handed to a client component. */
export async function getMatrixGrid() {
  const [products, templates, matrix, specs] = await Promise.all([
    getProducts(),
    getTemplates(),
    getMatrix(),
    getSpecs(),
  ]);
  const rows = products.filter(isActive).map((p) => ({
    product_id: p.product_id,
    product_name: p.product_name,
  }));
  const cols = templates.filter(isActive).map((t) => ({
    template_id: t.template_id,
    template_name: t.template_name,
  }));
  const cells: Record<
    string,
    { offered: boolean; live: boolean; spec_id: string; char_limit: string }
  > = {};
  for (const m of matrix) {
    if (!isActive(m)) continue;
    cells[`${m.product_id}|${m.template_id}`] = {
      offered: true,
      live: yes(m.live),
      spec_id: m.spec_id,
      char_limit: limitFor(
        m.char_limit,
        specs.find((s) => s.spec_id === m.spec_id) ?? {},
      ),
    };
  }
  return { products: rows, templates: cols, cells };
}

/** A merged product x template cell, ready to render. */
export async function getMergedCell(
  productId: string,
  templateId: string,
): Promise<MergedCell | null> {
  const [products, templates, specs, matrix, placements, rules] =
    await Promise.all([
      getProducts(),
      getTemplates(),
      getSpecs(),
      getMatrix(),
      getPlacements(),
      getRules(),
    ]);
  const m = matrix.find(
    (x) => x.product_id === productId && x.template_id === templateId,
  );
  if (!m) return null;
  const product = products.find((p) => p.product_id === productId);
  const template = templates.find((t) => t.template_id === templateId);
  const spec = specs.find((s) => s.spec_id === m.spec_id);
  if (!product || !template || !spec) return null;

  const charLimit = limitFor(m.char_limit, spec);
  const ctx = mergedContext(product, spec, charLimit);
  return {
    product,
    template,
    spec,
    placement: resolvePlacement(m.placement_id, placements),
    char_limit: charLimit,
    live: yes(m.live),
    rules: resolveRules(spec, ctx, rules),
  };
}

/** Flatten a product + spec + char limit into a single {key: value} context
 *  that rule templates draw their braces from. */
function mergedContext(
  product: ProductRow | null,
  spec: SpecRow,
  charLimit: string,
): Record<string, string> {
  return {
    ...(product ?? {}),
    ...spec,
    char_limit: charLimit,
  } as Record<string, string>;
}
