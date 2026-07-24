import { unstable_cache } from "next/cache";
import { getSheetsClient } from "@/lib/google";
import { SHEET_ID, SHEET_REVALIDATE_SECONDS } from "@/lib/config";
import type {
  ProductRow,
  TemplateRow,
  SpecRow,
  MatrixRow,
  PlacementRow,
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
        if (!h) return;
        const raw =
          r[i] === undefined || r[i] === null ? "" : String(r[i]).trim();
        // "TBD" is an authoring placeholder, not content. Treat it as empty so
        // unfinished fields are omitted from guides instead of printed.
        obj[h] = raw.toUpperCase() === "TBD" ? "" : raw;
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

export async function getPlacements(): Promise<PlacementRow[]> {
  try {
    return (await cachedTab("Placements")) as unknown as PlacementRow[];
  } catch {
    return [];
  }
}

export async function getRules(): Promise<RuleRow[]> {
  return (await cachedTab("Rules")) as unknown as RuleRow[];
}

/** Resolve a tab's real title, matched case-insensitively. Google Sheets won't
 *  allow two tabs whose names differ only by case, so this safely finds e.g.
 *  "ACCESS" when we look up "access". */
async function findTabTitle(nameLower: string): Promise<string | null> {
  const sheets = getSheetsClient();
  const meta = await sheets.spreadsheets.get({
    spreadsheetId: SHEET_ID,
    fields: "sheets.properties.title",
  });
  const title = (meta.data.sheets ?? [])
    .map((s) => s.properties?.title ?? "")
    .find((t) => t.trim().toLowerCase() === nameLower);
  return title ?? null;
}

/**
 * Sign-in allowlist for the auth layer. The base site is open to any
 * @shopabbode.com account; an "Access" tab (any casing) holds external partner
 * emails who should also be allowed in. No tab => domain users only. The email
 * column is matched loosely (Email / email / E-mail), values need an "@".
 */
export async function getAllowedEmails(): Promise<string[]> {
  try {
    const title = await findTabTitle("access");
    if (!title) return [];
    const rows = await readTabRaw(title);
    return rows
      .map((r) => {
        const key = Object.keys(r).find((k) => /e-?mail/i.test(k));
        return key ? r[key].toLowerCase().trim() : "";
      })
      .filter((e) => e.includes("@"));
  } catch {
    return [];
  }
}
