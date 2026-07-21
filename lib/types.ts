// Row shapes mirror the tabs in the "Abbode Style Guides Data" Sheet.
// Every value arrives from Sheets as a string; downstream code treats them as such.

export interface ProductRow {
  product_id: string;
  product_name: string;
  base_product_name_nb: string;
  hoop: string;
  sew_field: string;
  deviates: string;
  item_placement: string;
  item_notes: string;
  overflow_floor: string;
  image: string;
  status: string;
}

export interface TemplateRow {
  template_id: string;
  template_name: string;
  tier_color: string;
  design_template_type: string;
  description: string;
  status: string;
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
  max_text_width: string;
  overflow_rule: string;
  notes: string;
}

export interface MatrixRow {
  product_id: string;
  template_id: string;
  spec_id: string;
  char_limit: string;
  live: string;
  status: string;
}

export interface RuleRow {
  rule_id: string;
  rule_name: string;
  rule_text: string;
}

// A single joined product x template cell, ready to render.
export interface MergedCell {
  product: ProductRow;
  template: TemplateRow;
  spec: SpecRow;
  char_limit: string;
  live: boolean;
  rules: { name: string; text: string }[];
}
