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
      <body>
        <header className="site-header">
          <a className="brand-link" href="/">
            kick
          </a>
          <nav aria-label="주요 화면">
            <a href="/">Weekly</a>
            <a href="/contest">Contest</a>
            <a href="/maker">Maker</a>
          </nav>
        </header>
        {children}
        <footer className="site-footer">
          <p>kick은 agent와 함께 제품 소개를 정리하고, 좋은 제품을 더 빠르게 발견하는 런칭 플랫폼입니다.</p>
        </footer>
      </body>
    </html>
  );
}
