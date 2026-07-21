import { unstable_cache } from "next/cache";
import { getSheetsClient } from "@/lib/google";
import { SHEET_ID, SHEET_REVALIDATE_SECONDS } from "@/lib/config";
import type {
  ProductRow,
  TemplateRow,
  SpecRow,
  MatrixRow,
  RuleRow,
} from "@/lib/types";

/**
 * Read one tab and turn its rows into objects keyed by the header row.
 * The first row is treated as headers; blank rows are dropped.
 */
async function readTabRaw(tab: string): Promise<Record<string, string>[]> {
  const sheets = getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: tab,
    valueRenderOption: "UNFORMATTED_VALUE",
  });

  const rows = (res.data.values ?? []) as string[][];
  if (rows.length < 2) return [];

  const headers = rows[0].map((h) => String(h ?? "").trim());
  return rows
    .slice(1)
    .filter((r) => r.some((c) => String(c ?? "").trim() !== ""))
    .map((r) => {
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => {
        if (h) obj[h] = r[i] === undefined || r[i] === null ? "" : String(r[i]);
      });
      return obj;
    });
}

/**
 * Cached tab read. `unstable_cache` gives us the short refresh window: edits in
 * the Sheet appear after at most SHEET_REVALIDATE_SECONDS, without a redeploy.
 */
function cachedTab(tab: string) {
  return unstable_cache(() => readTabRaw(tab), ["style-guide-tab", tab], {
    revalidate: SHEET_REVALIDATE_SECONDS,
    tags: ["style-guide-sheet", `tab:${tab}`],
  })();
}

export async function getProducts(): Promise<ProductRow[]> {
  return (await cachedTab("Products")) as unknown as ProductRow[];
}

export async function getTemplates(): Promise<TemplateRow[]> {
  return (await cachedTab("Templates")) as unknown as TemplateRow[];
}

export async function getSpecs(): Promise<SpecRow[]> {
  return (await cachedTab("Specs")) as unknown as SpecRow[];
}

export async function getMatrix(): Promise<MatrixRow[]> {
  return (await cachedTab("Matrix")) as unknown as MatrixRow[];
}

export async function getRules(): Promise<RuleRow[]> {
  return (await cachedTab("Rules")) as unknown as RuleRow[];
}

/**
 * Sign-in allowlist for the auth layer. The base site is open to any
 * @shopabbode.com account; if you later add an "Access" tab with an `email`
 * column (external partners), those addresses are allowed too. No tab => none.
 */
export async function getAllowedEmails(): Promise<string[]> {
  try {
    const rows = await readTabRaw("Access");
    return rows
      .map((r) => (r.email || r.Email || "").toLowerCase().trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}
