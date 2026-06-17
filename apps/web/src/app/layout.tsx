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
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body>
        <header className="site-header">
          <a className="brand-link" href="/">
            Kick
          </a>
          <nav aria-label="주요 화면">
            <a href="/week">위클리보드</a>
            <a href="/products">탐색</a>
            <a href="/contest">콘테스트</a>
            <a className="header-cta" href="/products">
              제품 둘러보기
            </a>
          </nav>
        </header>
        {children}
        <footer className="site-footer">
          <p>킥(Kick) — 말 한마디로 제품을 런칭하는 플랫폼 · 데모</p>
        </footer>
      </body>
    </html>
  );
}
