/** Map an image filename from the Sheet to the route that streams it from the
 *  Assets folder in Drive. Returns null when there's no image set. */
export function assetUrl(name: string | undefined): string | null {
  const n = (name ?? "").trim();
  if (!n) return null;
  return `/api/asset/${encodeURIComponent(n)}`;
}

/** Overlay image for a matrix cell: the spec sample rendered on the product,
 *  named `<product_id>__<spec_id>.png` in the Assets folder. */
export function cellImageFor(productId: string, specId: string): string {
  return `${productId}__${specId}.png`;
}

/** Overlay for one placement of a multi-placement cell, named
 *  `<placement_id>__<spec_id>.png` (sweater-cuff-p1__monogram-2.png). */
export function placementImageFor(placementId: string, specId: string): string {
  return `${placementId}__${specId}.png`;
}
