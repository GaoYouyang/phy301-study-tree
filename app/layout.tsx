import type { Metadata } from "next";
import "katex/dist/katex.min.css";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: {
    default: "PHY301 重修通关树",
    template: "%s｜PHY301 重修通关树",
  },
  description:
    "从零补齐前置，按依赖学完热力学、经典系综、量子统计与非平衡统计物理。",
  icons: {
    icon: `${basePath}/favicon.svg`,
    shortcut: `${basePath}/favicon.svg`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
