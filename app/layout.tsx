import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AR Model Viewer",
  description: "Visualize GLB and USDZ models in the browser and AR",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
