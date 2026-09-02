import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SpotProvider } from '@/lib/store';

/**
 * 루트 레이아웃
 * ─────────────────────────────────────────────────────────────
 * ★ 이 파일은 손님 앱과 관리자 패널이 공유하는 유일한 레이아웃이다.
 *   여기에는 두 쪽 모두에 해당하는 것만 넣는다 (폰트, 전역 CSS, 전역 상태).
 *   탭바·사이드바처럼 한쪽에만 있는 것은 각 라우트 그룹의 layout.tsx 로 간다.
 *
 * ★ 라우트 그룹이란?
 *   폴더 이름을 괄호로 감싸면 URL 에 나타나지 않는다.
 *     app/(customer)/explore/page.tsx  →  /explore
 *     app/(admin)/admin/hall/page.tsx  →  /admin/hall
 *   URL 은 그대로 두면서 레이아웃만 다르게 줄 수 있다. 이것이 우리가 쓰는 분리 방식이다.
 */

export const metadata: Metadata = {
  title: 'SPOT — 자리 있는지, 차 댈 데 있는지 한 번에',
  description: '대전 원도심 입점 식당의 실시간 좌석·예약과 주차면 센서 기반 실시간 주차를 함께 확인하는 서비스',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        {/* Pretendard — 한글 자간·숫자 가독성이 좋아 실시간 수치가 많은 이 서비스에 맞다 */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="font-sans antialiased text-ink-900">
        <SpotProvider>{children}</SpotProvider>
      </body>
    </html>
  );
}
