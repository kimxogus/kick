import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "kick",
  description: "제품 제작자와 탐색자를 위한 MVP 런칭 플랫폼",
  icons: {
    icon: "/favicon.svg"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
