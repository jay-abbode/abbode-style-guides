import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Abbode Style Guides",
  description:
    "Abbode's internal embroidery style guides — products, templates, and the coverage matrix.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-porcelain text-espresso">{children}</body>
    </html>
  );
}
