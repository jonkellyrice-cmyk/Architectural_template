import type { Metadata } from "next";
import type { ReactNode } from "react";

import { runtime } from "@/src/composition";

import "./globals.css";

export const metadata: Metadata = {
  title: runtime.config.appName,
  description: "A role-pure, one-way dependency architecture template.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
