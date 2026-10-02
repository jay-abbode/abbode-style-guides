// Row shapes mirror the tabs in the "Abbode Style Guides Data" Sheet.
// Every value arrives from Sheets as a string; downstream code treats them as such.

export interface ProductRow {
  product_id: string;
  product_name: string;
  /** Display group for the product list (Pouches, Charms, Apparel...). */
  group: string;
  base_product_name_nb: string;
  hoop: string;
  sew_field: string;
  deviates: string;
  item_placement: string;
  item_notes: string;
  overflow_floor: string;
  image: string;
  status: string;
  /** Sold on abbode.com. Blank or "yes" shows the product in the main view;
   *  "no" hides it there. */
  online: string;
  /** Sold in the physical store. Blank or "yes" shows the product in Store
   *  View; "no" hides it there. */
  in_store: string;
}

export interface TemplateRow {
  template_id: string;
  template_name: string;
  tier_color: string;
  design_template_type: string;
  description: string;
  status: string;
  /** Offered on abbode.com. Blank or "yes" shows the template in the main
   *  view; "no" hides it there. */
  online: string;
  /** Offered in the physical store. Blank or "yes" shows the template in
   *  Store View; "no" hides it there. */
  in_store: string;
}

export interface SpecRow {
  spec_id: string;
  template_id: string;
  spec_name: string;
  offering: string;
  text_size: string;
  icon_count: string;
  icon_size: string;
  arrangement: string;
  spacing: string;
  chars_per_line: string;
  max_lines: string;
  /** Default character limit for every cell using this spec. A Matrix row's
   *  own char_limit overrides it when set. */
  char_limit: string;
  overflow_rule: string;
  notes: string;
  /** Filename of the rendered sample for this spec, shown in Store View.
   *  Blank falls back to `<Spec Name with underscores>_Template.png`. */
  sample_image: string;
}

export interface MatrixRow {
  product_id: string;
  template_id: string;
  spec_id: string;
  placement_id: string;
  char_limit: string;
  /** Max design width for this product x template cell. Width lives at the
   *  intersection, not on the spec. */
  max_width: string;
  /** Cell-level text limits (Oct 2026). When set they override the spec's
   *  values for this product x template; blank falls back to the spec. */
  text_size?: string;
  chars_per_line?: string;
  max_lines?: string;
  /** Retail price for this product x template, as displayed in Store View.
   *  Blank renders as the placeholder. */
  price: string;
  live: string;
  status: string;
}

export interface PlacementRow {
  placement_id: string;
  product_id: string;
  centered: string;
  description: string;
  /** Diagram filename for this placement; falls back to the product image. */
  image: string;
  /** Overlay position, filled in from the placement tool. Blank until set. */
  anchor?: string;
  x_in?: string;
  y_in?: string;
  rotation_deg?: string;
}

export interface RuleRow {
  rule_id: string;
  rule_name: string;
  rule_text: string;
  /** Store View wording: states the rule rather than instructing. Blank = nothing shown in the store. */
  store_text?: string;
}

/** A placement resolved for display: either "Centered" or its description. */
export interface ResolvedPlacement {
  placement_id: string;
  centered: boolean;
  /** True when the overlay position is known: centered, or offsets filled in.
   *  Cells on unpositioned placements show the spec sample, not the overlay. */
  positioned: boolean;
  text: string;
  /** Short caption for side-by-side images: the description up to its first
   *  comma or full stop ("Top of wrist"). */
  label: string;
  image: string;
}

/** One image of a cell. A cell with several placements (a Matrix
 *  placement_id of "a; b") shows one image per placement, side by side. */
export interface CellImage {
  src: string;
  caption: string;
}

// A single joined product x template cell, ready to render.
export interface MergedCell {
  product: ProductRow;
  template: TemplateRow;
  spec: SpecRow;
  placement: ResolvedPlacement | null;
  placements: ResolvedPlacement[];
  /** Overlay per positioned placement; empty when nothing is positioned. */
  cell_images: CellImage[];
  char_limit: string;
  max_width: string;
  live: boolean;
  rules: { name: string; text: string }[];
}

/** One template offered on a product, trimmed to what front of house needs. */
export interface StoreOffer {
  template: TemplateRow;
  price: string;
  sample_image: string | null;
  /** Overlay of the spec on the product, only when its placement is positioned. */
  cell_image: string | null;
  /** One overlay per positioned placement, side by side when there are several. */
  cell_images: CellImage[];
  chars_per_line: string;
  max_lines: string;
  char_limit: string;
  arrangement: string;
  placement: ResolvedPlacement | null;
  rules: { name: string; text: string }[];
}
