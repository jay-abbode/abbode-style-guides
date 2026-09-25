import type { Metadata, Viewport } from "next";

/** Store View only: lets the iPad run it as a full-screen home-screen app
 *  (plum status bar, no Safari chrome) and extends the layout under the
 *  safe areas so the frozen header can pad itself. */
export const metadata: Metadata = {
  title: "Abbode Store",
  appleWebApp: {
    capable: true,
    title: "Abbode Store",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#671E30",
};

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return <div className="touch-manipulation">{children}</div>;
}
