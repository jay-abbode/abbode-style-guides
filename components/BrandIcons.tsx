// Flat, brand-colored SVGs used on the landing buttons. Hex values match the
// Tailwind theme (pink #F2B2AE, plum #671E30, berry #BB3767, sage #D1C68F).

export function PouchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 156 120" className={className} role="img" aria-label="Products">
      <defs>
        <clipPath id="pouch-rc">
          <rect x="11" y="10" width="133" height="100" rx="10" />
        </clipPath>
        <pattern
          id="pouch-waffle"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <rect width="10" height="10" fill="none" />
          <rect x="2" y="2" width="6" height="6" rx="1.4" fill="#671E30" opacity="0.11" />
        </pattern>
      </defs>
      <rect x="11" y="10" width="133" height="100" rx="10" fill="#F2B2AE" />
      <g clipPath="url(#pouch-rc)">
        <rect x="11" y="10" width="133" height="100" fill="url(#pouch-waffle)" />
      </g>
      <rect
        x="11"
        y="10"
        width="133"
        height="100"
        rx="10"
        fill="none"
        stroke="#671E30"
        strokeWidth="1.4"
        opacity="0.5"
      />
    </svg>
  );
}

export function MatrixIcon({ className }: { className?: string }) {
  const cells: { x: number; y: number; fill: string; stroke?: boolean }[] = [];
  // header row (templates = berry), header col (products = sage), corner plum
  cells.push({ x: 25, y: 15, fill: "#671E30" });
  [65, 105, 145].forEach((x) => cells.push({ x, y: 15, fill: "#BB3767" }));
  [55, 95, 135].forEach((y) => cells.push({ x: 25, y, fill: "#D1C68F" }));
  cells.push({ x: 65, y: 55, fill: "#671E30" }); // live cell
  [
    [105, 55],
    [145, 55],
    [65, 95],
    [105, 95],
    [145, 95],
    [65, 135],
    [105, 135],
    [145, 135],
  ].forEach(([x, y]) =>
    cells.push({ x, y, fill: "#FFFCF7", stroke: true }),
  );

  return (
    <svg viewBox="0 0 200 180" className={className} role="img" aria-label="Matrix">
      {cells.map((c, i) => (
        <rect
          key={i}
          x={c.x}
          y={c.y}
          width="30"
          height="30"
          rx="6"
          fill={c.fill}
          stroke={c.stroke ? "#671E30" : undefined}
          strokeWidth={c.stroke ? 2 : undefined}
        />
      ))}
      <path
        d="M74,70 l4,4 l7,-8"
        fill="none"
        stroke="#FFFCF7"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
