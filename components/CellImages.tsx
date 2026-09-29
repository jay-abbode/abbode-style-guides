import { AssetImage } from "@/components/AssetImage";
import { assetUrl } from "@/lib/assets";
import type { CellImage } from "@/lib/types";

/** One or more item images side by side. Several images (a cuff from the top
 *  and from the bottom) share the row equally and carry a caption each; a
 *  single image renders as before. `fallbackSrc` stands in for any image that
 *  has not been uploaded yet. */
export function CellImages({
  images,
  fallbackSrc,
  alt,
  className,
  captionClassName,
  tone = "guide",
}: {
  images: CellImage[];
  fallbackSrc?: string | null;
  alt: string;
  className?: string;
  captionClassName?: string;
  tone?: "guide" | "store";
}) {
  if (images.length === 0) {
    return (
      <AssetImage src={null} fallbackSrc={fallbackSrc} alt={alt} className={className} />
    );
  }
  if (images.length === 1) {
    return (
      <AssetImage
        src={assetUrl(images[0].src)}
        fallbackSrc={fallbackSrc}
        alt={alt}
        className={className}
      />
    );
  }
  const cap =
    captionClassName ??
    (tone === "store"
      ? "font-ui mt-2 text-center text-[11px] uppercase tracking-wider text-cherry"
      : "font-ui mt-2 text-center text-[11px] uppercase tracking-wider text-ink-muted");
  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${images.length}, minmax(0, 1fr))` }}>
      {images.map((im, i) => (
        <figure key={`${im.src}-${i}`} className="m-0 min-w-0">
          <AssetImage
            src={assetUrl(im.src)}
            fallbackSrc={fallbackSrc}
            alt={im.caption ? `${alt}, ${im.caption}` : alt}
            className={className}
          />
          {im.caption && <figcaption className={cap}>{im.caption}</figcaption>}
        </figure>
      ))}
    </div>
  );
}
