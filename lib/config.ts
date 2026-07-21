// The backend Sheet and Assets folder live in the "STYLE GUIDE BACKEND" shared drive.
// IDs can be overridden with env vars; defaults point at the drive we set up.

export const SHEET_ID =
  process.env.STYLE_GUIDE_SHEET_ID ||
  "1GxnciAjeX2evwaXiHa8btevwyuLq_L-wl9W3wOEAvOA";

export const ASSETS_FOLDER_ID =
  process.env.STYLE_GUIDE_ASSETS_FOLDER_ID ||
  "1m82WZ2UflZt6bA2VQkWRR8c1Dlxojzte";

// How long (seconds) reads of the Sheet are cached before a fresh pull.
// This is the "edit shows up after a short refresh" window.
export const SHEET_REVALIDATE_SECONDS = 60;
