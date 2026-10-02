/** Image box sizes per product. Large items (a beach towel, a sweatshirt)
 *  make the design tiny in the standard box, so they get a bigger one.
 *  Lives in components/ so Tailwind picks up the class names. */
export type ImageSize = "base" | "lg" | "xl";

const SIZE: Record<string, ImageSize> = {
  "beach-towel": "xl",
  sweater: "lg",
  sweatshirt: "lg",
  "canvas-tote": "lg",
  "terry-tote": "lg",
};

export const imageSizeFor = (productId: string): ImageSize => SIZE[productId] ?? "base";

/** Guide pages (matrix cell, product): grid columns and image height. */
export const guideBox = {
  base: { cols: "md:grid-cols-[220px,1fr]", wide: "md:grid-cols-[440px,1fr]", img: "h-48 w-full object-contain" },
  lg: { cols: "md:grid-cols-[320px,1fr]", wide: "md:grid-cols-[560px,1fr]", img: "h-72 w-full object-contain" },
  xl: { cols: "md:grid-cols-[460px,1fr]", wide: "md:grid-cols-[640px,1fr]", img: "h-[28rem] w-full object-contain" },
} as const;

/** Store View product header card. */
export const storeHeaderBox = {
  base: { card: "md:w-[240px]", wide: "md:w-[480px]", img: "h-40 w-full object-contain md:h-56" },
  lg: { card: "md:w-[340px]", wide: "md:w-[560px]", img: "h-56 w-full object-contain md:h-80" },
  xl: { card: "md:w-[460px]", wide: "md:w-[640px]", img: "h-72 w-full object-contain md:h-[28rem]" },
} as const;

/** Store View template cards. */
export const storeCellBox = {
  base: { cols: "sm:grid-cols-[200px,1fr] md:grid-cols-[240px,1fr]", wide: "sm:grid-cols-[360px,1fr] md:grid-cols-[440px,1fr]", img: "h-44 w-full rounded-xl object-contain sm:h-48 md:h-60" },
  lg: { cols: "sm:grid-cols-[280px,1fr] md:grid-cols-[340px,1fr]", wide: "sm:grid-cols-[440px,1fr] md:grid-cols-[560px,1fr]", img: "h-60 w-full rounded-xl object-contain sm:h-72 md:h-80" },
  xl: { cols: "sm:grid-cols-[360px,1fr] md:grid-cols-[460px,1fr]", wide: "sm:grid-cols-[520px,1fr] md:grid-cols-[640px,1fr]", img: "h-72 w-full rounded-xl object-contain sm:h-80 md:h-[28rem]" },
} as const;
