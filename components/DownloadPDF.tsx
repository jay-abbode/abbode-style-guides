"use client";

/** Opens the browser's print dialog. With the print styles in globals.css, the
 *  saved PDF is the guide alone — nav, buttons, and this control are hidden.
 *  Choose "Save as PDF" as the destination. */
export function DownloadPDF({ label = "Download PDF" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print font-ui focus-ring inline-flex items-center gap-2 rounded-full bg-plum px-4 py-2 text-sm font-semibold text-porcelain transition-colors hover:bg-berry"
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 3v12" />
        <path d="m7 10 5 5 5-5" />
        <path d="M5 21h14" />
      </svg>
      {label}
    </button>
  );
}
