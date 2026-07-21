"use client";

import { useState } from "react";

/** Renders a product image from /api/asset. If the file isn't in the Assets
 *  folder yet, shows a labeled placeholder instead of a broken image. */
export function AssetImage({
  src,
  alt,
  className,
}: {
  src: string | null;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={
          "flex items-center justify-center rounded-xl border border-dashed border-cream-200 bg-parchment text-center " +
          (className ?? "")
        }
      >
        <span className="font-ui px-4 text-xs text-ink-muted">
          {alt} image not uploaded yet
        </span>
      </div>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
