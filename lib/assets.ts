/** Map an image filename from the Sheet to the route that streams it from the
 *  Assets folder in Drive. Returns null when there's no image set. */
export function assetUrl(name: string | undefined): string | null {
  const n = (name ?? "").trim();
  if (!n) return null;
  return `/api/asset/${encodeURIComponent(n)}`;
}
