import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "吵架判官 - AI评判工具",
  description: "让 AI 充当判官，评判两人吵架谁更有道理",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
      </body>
    </html>
  );
}
