"use client";

import { useState } from "react";

/** Renders an image from /api/asset. If the file isn't in the Assets folder
 *  yet, tries `fallbackSrc` (when given), then shows a labeled placeholder
 *  instead of a broken image. */
export function AssetImage({
  src,
  fallbackSrc,
  alt,
  className,
}: {
  src: string | null;
  fallbackSrc?: string | null;
  alt: string;
  className?: string;
}) {
  const [current, setCurrent] = useState<string | null>(src ?? fallbackSrc ?? null);
  const [failed, setFailed] = useState(false);

  if (!current || failed) {
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
      src={current}
      alt={alt}
      className={className}
      onError={() => {
        if (fallbackSrc && current !== fallbackSrc) setCurrent(fallbackSrc);
        else setFailed(true);
      }}
    />
  );
}
