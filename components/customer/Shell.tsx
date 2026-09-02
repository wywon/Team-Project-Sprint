'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { cx } from '@/lib/format';
import { TABS } from '@/lib/tokens';

/**
 * 손님 앱 셸
 * ─────────────────────────────────────────────────────────────
 * PhoneChrome : 데스크톱 브라우저에서 볼 때 모바일 기기처럼 감싸 주는 틀.
 *               실제 배포 때는 이 래퍼만 걷어내면 그대로 모바일 웹이 된다.
 * TabBar      : 탐색 · 주차 · 예약 · 마이
 * SubHeader   : 한 뎁스 들어간 화면의 상단 바 (뒤로가기 포함)
 */

export const PhoneChrome = ({ children }: { children: React.ReactNode }) => (
  <div className="relative w-[390px] h-[844px] bg-white rounded-[44px] shadow-phone border-[10px] border-ink-900 overflow-hidden shrink-0">
    {/* 상태 표시줄 (장식) */}
    <div className="absolute top-0 left-0 right-0 h-11 z-[70] flex items-end justify-between px-7 pb-1 pointer-events-none">
      <span className="text-[13px] font-extrabold text-ink-900 tnum">12:30</span>
      <div className="absolute left-1/2 -translate-x-1/2 top-1.5 w-[92px] h-[26px] bg-ink-900 rounded-full" />
      <div className="flex items-center gap-1 text-ink-900">
        <Icon n="wifi" s={14} />
        <div className="w-[22px] h-[11px] rounded-[3px] border-[1.5px] border-ink-900 p-[1.5px]">
          <div className="w-[70%] h-full bg-ink-900 rounded-[1px]" />
        </div>
      </div>
    </div>
    {children}
    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-[130px] h-[5px] rounded-full bg-ink-900/85 z-[70] pointer-events-none" />
  </div>
);

/**
 * 하단 탭바.
 * ★ 규칙 — 한 뎁스 깊어지면 탭바를 숨긴다.
 *   단 '주차' 탭은 목록이 곧 그 탭의 내용이므로 탭바를 유지한다.
 *   숨김 여부는 아래 TAB_ROUTES 에 있는 경로인지로만 판단한다.
 */
const TAB_ROUTES: string[] = TABS.map((t) => t.href);

export function useIsTabRoute(): boolean {
  const pathname = usePathname();
  return TAB_ROUTES.includes(pathname);
}

export const TabBar = () => {
  const pathname = usePathname();
  if (!TAB_ROUTES.includes(pathname)) return null;

  return (
    <nav className="absolute bottom-0 left-0 right-0 h-[76px] bg-white/95 backdrop-blur-xl border-t border-ink-200 flex items-start pt-1.5 px-2 z-30">
      {TABS.map((t) => {
        const on = pathname === t.href;
        return (
          <Link
            key={t.key}
            href={t.href}
            className={cx('grow flex flex-col items-center gap-0.5 py-1.5 rounded-xl transition-colors', on ? 'text-brand-600' : 'text-ink-400')}
          >
            <Icon n={t.icon} s={23} />
            <span className="text-[10.5px] font-extrabold">{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

/** 한 뎁스 들어간 화면의 상단 바 */
export const SubHeader = ({
  title, sub, right, transparent, onBack,
}: {
  title?: string; sub?: string; right?: React.ReactNode; transparent?: boolean; onBack?: () => void;
}) => {
  const router = useRouter();
  return (
    <div
      className={cx(
        'absolute top-0 left-0 right-0 z-20 pt-11 px-2 pb-2 flex items-center gap-1',
        transparent ? 'bg-transparent' : 'bg-white/95 backdrop-blur-xl border-b border-ink-200'
      )}
    >
      <button
        onClick={() => (onBack ? onBack() : router.back())}
        aria-label="뒤로"
        className={cx('w-10 h-10 rounded-full grid place-items-center shrink-0', transparent ? 'bg-white/90 shadow-card text-ink-900' : 'text-ink-800')}
      >
        <Icon n="chevL" s={21} />
      </button>
      <div className="grow min-w-0 px-1">
        {title && <div className="text-[16px] font-extrabold text-ink-900 truncate">{title}</div>}
        {sub && <div className="text-[11.5px] font-bold text-ink-500 truncate">{sub}</div>}
      </div>
      {right}
    </div>
  );
};

/** 화면 하단에 고정되는 CTA 영역 */
export const StickyCta = ({ children, tabbar }: { children: React.ReactNode; tabbar?: boolean }) => (
  <div
    className={cx(
      'absolute left-0 right-0 z-30 px-4 pt-3 pb-6 bg-gradient-to-t from-white via-white to-white/0',
      tabbar ? 'bottom-[76px]' : 'bottom-0'
    )}
  >
    {children}
  </div>
);
