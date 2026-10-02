"use client";

import { useState } from "react";

type Html2Pdf = (typeof import("html2pdf.js"))["default"];

/** Loads the PDF renderer, retrying once if the chunk failed to load (a stale
 *  tab after a deploy). */
async function loadRenderer(): Promise<Html2Pdf> {
  try {
    return (await import("html2pdf.js")).default;
  } catch {
    await new Promise((r) => setTimeout(r, 400));
    return (await import("html2pdf.js")).default;
  }
}

/** html2canvas ignores `object-fit`, so every contained image in the clone is
 *  given the box it actually occupies on screen: the fitted size, centered. */
function fitImages(original: HTMLElement, clone: Document) {
  const live = Array.from(original.querySelectorAll("img"));
  // html2pdf renders its own copy of <main> inside .html2pdf__container; the
  // clone also holds the untouched page, so look only inside that container.
  const root = clone.querySelector(".html2pdf__container") ?? clone;
  const copies = Array.from(root.querySelectorAll("img"));
  live.forEach((img, i) => {
    const copy = copies[i];
    if (!copy || !img.naturalWidth || !img.naturalHeight) return;
    const box = img.getBoundingClientRect();
    if (!box.width || !box.height) return;
    const k = Math.min(box.width / img.naturalWidth, box.height / img.naturalHeight);
    const w = Math.round(img.naturalWidth * k);
    const h = Math.round(img.naturalHeight * k);
    const wrap = clone.createElement("div");
    wrap.style.cssText = `width:${Math.round(box.width)}px;height:${Math.round(box.height)}px;display:flex;align-items:center;justify-content:center;`;
    copy.style.cssText = `width:${w}px;height:${h}px;object-fit:fill;display:block;`;
    copy.removeAttribute("class");
    copy.parentNode?.insertBefore(wrap, copy);
    wrap.appendChild(copy);
  });
}

/** Saves the guide straight to the browser's downloads as a PDF: the page's
 *  <main> is rendered to letter pages with 0.75in margins, nav and buttons
 *  left out. On failure the error is shown next to the button; nothing opens
 *  the print dialog. */
export function DownloadPDF({ label = "Download PDF" }: { label?: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const main = document.querySelector("main");
      if (!main) throw new Error("Nothing to export on this page");
      const title = document.querySelector("h1")?.textContent?.trim() || "guide";
      const filename =
        title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + ".pdf";
      const html2pdf = await loadRenderer();
      await html2pdf()
        .set({
          margin: [0.75, 0.75, 0.75, 0.75],
          filename,
          image: { type: "jpeg", quality: 0.95 },
          html2canvas: {
            scale: 2,
            useCORS: false,
            logging: false,
            backgroundColor: "#ffffff",
            onclone: (doc: Document) => {
              doc.querySelectorAll(".no-print, header").forEach((n) => n.remove());
              const m = doc.querySelector("main") as HTMLElement | null;
              if (m) {
                m.style.padding = "0";
                m.style.margin = "0";
                m.style.maxWidth = "none";
              }
              fitImages(main, doc);
            },
          },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
          pagebreak: { mode: ["css", "legacy"], avoid: ["section", ".pdf-block", "tr", "img"] },
        })
        .from(main)
        .save();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(`Could not build the PDF: ${msg}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <span className="no-print inline-flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={save}
        disabled={busy}
        className="font-ui focus-ring inline-flex items-center gap-2 rounded-full bg-plum px-4 py-2 text-sm font-semibold text-porcelain transition-colors hover:bg-berry disabled:opacity-60"
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
        {busy ? "Preparing PDF…" : label}
      </button>
      {error && (
        <span role="alert" className="font-ui text-sm text-berry">
          {error}
        </span>
      )}
    </span>
  );
}
