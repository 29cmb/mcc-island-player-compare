import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MCC Island Player Compare",
  description: "A simple website for comparing the statistics of 2 MCC Island players!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <SpeedInsights/>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
