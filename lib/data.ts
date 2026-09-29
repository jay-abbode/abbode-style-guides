import {
  getProducts,
  getTemplates,
  getSpecs,
  getMatrix,
  getPlacements,
  getRules,
} from "@/lib/sheets";
import { fillTemplate } from "@/lib/rules";
import { cellImageFor } from "@/lib/assets";
import type {
  ProductRow,
  TemplateRow,
  SpecRow,
  PlacementRow,
  ResolvedPlacement,
  MergedCell,
  StoreOffer,
} from "@/lib/types";

const isActive = (r: { status?: string }) =>
  (r.status ?? "").toLowerCase().trim() !== "inactive" &&
  (r.status ?? "").toLowerCase().trim() !== "archived";

const yes = (v: string) => (v ?? "").toLowerCase().trim() === "yes";
const no = (v: string) => (v ?? "").toLowerCase().trim() === "no";

/** Channel toggles from the Products tab. Only an explicit "no" hides a
 *  product, so a blank column keeps everything visible. */
type Channelled = { status?: string; online?: string; in_store?: string };
const isOnline = (r: Channelled) => isActive(r) && !no(r.online ?? "");
const isInStore = (r: Channelled) => isActive(r) && !no(r.in_store ?? "");

/** Turn a cell's placement_id into something renderable: "Centered", or the
 *  free-text description. Returns null when nothing is set. */
function resolvePlacement(
  placementId: string,
  placements: PlacementRow[],
): ResolvedPlacement | null {
  const p = placements.find((x) => x.placement_id === (placementId ?? "").trim());
  if (!p) return null;
  const image = (p.image ?? "").trim();
  const hasOffsets =
    (p.x_in ?? "").trim() !== "" && (p.y_in ?? "").trim() !== "";
  if (yes(p.centered))
    return { centered: true, positioned: true, text: "Centered", image };
  const text = (p.description ?? "").trim();
  // A placement with offsets from the placement tool is positioned even when
  // nobody has written a description for it yet.
  if (!text && !hasOffsets) return null;
  return { centered: false, positioned: hasOffsets, text, image };
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
  return (await getProducts()).filter(isOnline);
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
  if (!product || !isOnline(product)) return null;

  const offered = matrix
    .filter((m) => m.product_id === productId && isActive(m))
    .map((m) => {
      const spec = specs.find((s) => s.spec_id === m.spec_id);
      const template = templates.find((t) => t.template_id === m.template_id);
      if (!spec || !template || !isOnline(template)) return null;
      const charLimit = limitFor(m.char_limit, spec);
      const maxWidth = (m.max_width ?? "").trim();
      const ctx = mergedContext(product, spec, charLimit, maxWidth);
      return {
        template,
        spec,
        placement: resolvePlacement(m.placement_id, placements),
        char_limit: charLimit,
        max_width: maxWidth,
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
  return templates.filter(isOnline).map((template) => ({
    template,
    specs: specs.filter((s) => s.template_id === template.template_id),
  }));
}

/** A single spec sheet with its parent template, resolved rules, and the
 *  products that use it (via the Matrix). */
export async function getSpecPage(specId: string) {
  const [specs, templates, rules, matrix, products] = await Promise.all([
    getSpecs(),
    getTemplates(),
    getRules(),
    getMatrix(),
    getProducts(),
  ]);
  const spec = specs.find((s) => s.spec_id === specId);
  if (!spec) return null;
  const template = templates.find((t) => t.template_id === spec.template_id);
  if (!template || !isOnline(template)) return null;
  const ctx = mergedContext(null, spec, "", "");

  const coveredIds = new Set(
    matrix
      .filter((m) => m.spec_id === specId && isActive(m))
      .map((m) => m.product_id),
  );
  const coveredProducts = products.filter(
    (p) => coveredIds.has(p.product_id) && isOnline(p),
  );

  return {
    spec,
    template,
    rules: resolveRules(spec, ctx, rules),
    products: coveredProducts,
  };
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
  const rows = products.filter(isOnline).map((p) => ({
    product_id: p.product_id,
    product_name: p.product_name,
  }));
  const cols = templates.filter(isOnline).map((t) => ({
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
  if (!product || !isOnline(product) || !template || !isOnline(template) || !spec)
    return null;

  const charLimit = limitFor(m.char_limit, spec);
  const maxWidth = (m.max_width ?? "").trim();
  const ctx = mergedContext(product, spec, charLimit, maxWidth);
  return {
    product,
    template,
    spec,
    placement: resolvePlacement(m.placement_id, placements),
    char_limit: charLimit,
    max_width: maxWidth,
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
  maxWidth: string,
): Record<string, string> {
  return {
    ...(product ?? {}),
    ...spec,
    char_limit: charLimit,
    max_width: maxWidth,
  } as Record<string, string>;
}

/* ------------------------------------------------------------------------ */
/* Store View: front-of-house cut of the same data. Live cells only, price   */
/* instead of checkmarks, one sample per template, no spec numbers or hoop.  */
/* ------------------------------------------------------------------------ */

export const PRICE_PLACEHOLDER = "$-.--";

/** "$78" as entered, "78" -> "$78", "78.5" -> "$78.50", blank -> placeholder. */
export function formatPrice(raw: string | undefined): string {
  const v = (raw ?? "").trim();
  if (!v) return PRICE_PLACEHOLDER;
  if (v.startsWith("$")) return v;
  const n = Number(v);
  if (Number.isNaN(n)) return v;
  return Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`;
}

/** The sample image for a spec: its `sample_image` when set, otherwise the
 *  naming convention `Signature 1` -> `Signature_1_Template.png`. */
export function sampleImageFor(spec: SpecRow): string | null {
  const explicit = (spec.sample_image ?? "").trim();
  if (explicit) return explicit;
  const name = (spec.spec_name ?? "").trim();
  if (!name) return null;
  return `${name.replace(/\s+/g, "_")}_Template.png`;
}

export async function listStoreProducts(): Promise<ProductRow[]> {
  const [products, templates, matrix] = await Promise.all([
    getProducts(),
    getTemplates(),
    getMatrix(),
  ]);
  const storeTemplates = new Set(
    templates.filter(isInStore).map((t) => t.template_id),
  );
  const withLive = new Set(
    matrix
      .filter((m) => isActive(m) && yes(m.live) && storeTemplates.has(m.template_id))
      .map((m) => m.product_id),
  );
  return products.filter((p) => isInStore(p) && withLive.has(p.product_id));
}

/** Store matrix: live product x template cells carrying a display price. */
export async function getStoreGrid() {
  const [products, templates, matrix] = await Promise.all([
    getProducts(),
    getTemplates(),
    getMatrix(),
  ]);
  const cells: Record<string, { price: string; priced: boolean }> = {};
  const storeTemplates = new Set(
    templates.filter(isInStore).map((t) => t.template_id),
  );
  const liveProducts = new Set<string>();
  const liveTemplates = new Set<string>();
  for (const m of matrix) {
    if (!isActive(m) || !yes(m.live) || !storeTemplates.has(m.template_id)) continue;
    const raw = (m.price ?? "").trim();
    cells[`${m.product_id}|${m.template_id}`] = {
      price: formatPrice(raw),
      priced: raw !== "",
    };
    liveProducts.add(m.product_id);
    liveTemplates.add(m.template_id);
  }
  const rows = products
    .filter((p) => isInStore(p) && liveProducts.has(p.product_id))
    .map((p) => ({
      product_id: p.product_id,
      product_name: p.product_name,
      group: (p.group ?? "").trim(),
    }));
  const cols = templates
    .filter((t) => isInStore(t) && liveTemplates.has(t.template_id))
    .map((t) => ({ template_id: t.template_id, template_name: t.template_name }));
  return { products: rows, templates: cols, cells };
}

/** Store product page: the item plus one offer per live template. */
export async function getStoreProductPage(productId: string) {
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
  if (!product || !isInStore(product)) return null;

  const offers: StoreOffer[] = matrix
    .filter((m) => m.product_id === productId && isActive(m) && yes(m.live))
    .map((m) => {
      const spec = specs.find((s) => s.spec_id === m.spec_id);
      const template = templates.find((t) => t.template_id === m.template_id);
      if (!template || !isInStore(template)) return null;
      const charLimit = spec ? limitFor(m.char_limit, spec) : (m.char_limit ?? "").trim();
      const maxWidth = (m.max_width ?? "").trim();
      const ctx = spec ? mergedContext(product, spec, charLimit, maxWidth) : {};
      const placement = resolvePlacement(m.placement_id, placements);
      return {
        template,
        price: formatPrice(m.price),
        sample_image: spec ? sampleImageFor(spec) : null,
        cell_image:
          spec && placement?.positioned
            ? cellImageFor(product.product_id, spec.spec_id)
            : null,
        chars_per_line: (spec?.chars_per_line ?? "").trim(),
        max_lines: (spec?.max_lines ?? "").trim(),
        char_limit: charLimit,
        arrangement: (spec?.arrangement ?? "").trim(),
        placement,
        rules: spec ? resolveRules(spec, ctx, rules) : [],
      };
    })
    .filter((x): x is StoreOffer => Boolean(x));

  return { product, offers };
}
