'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { cx } from '@/lib/format';
import { useApp } from '@/lib/store';

/**
 * 개발용 상단 바 — 손님 앱 ↔ 관리자 패널 전환
 * ─────────────────────────────────────────────────────────────
 * ★ 시연과 개발 편의를 위한 것이다. 실제 배포에서는 이 컴포넌트를
 *   두 레이아웃에서 지우면 된다. (지우기 쉬우라고 일부러 한 파일로 뺐다.)
 *
 * 실시간 시뮬레이션 토글도 여기 둔다. 발표 때 "지금 값이 계속 바뀌고 있다"를
 * 보여주거나, 반대로 화면을 설명하는 동안 값을 멈춰 두는 데 쓴다.
 */
export const ModeSwitch = () => {
  const pathname = usePathname();
  const { simOn, setSimOn } = useApp();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <div className="shrink-0 h-14 bg-ink-900 text-white px-6 flex items-center gap-4">
      <div className="flex items-center gap-2.5">
        <span className="w-8 h-8 rounded-lg bg-brand-600 grid place-items-center font-extrabold text-[13px]">S</span>
        <div>
          <div className="text-[14px] font-extrabold leading-none">SPOT</div>
          <div className="text-[10px] font-bold text-white/45 mt-1">개발 모드 · 목업 데이터</div>
        </div>
      </div>

      <div className="grow" />

      <button
        onClick={() => setSimOn(!simOn)}
        className={cx(
          'h-9 px-3.5 rounded-xl text-[12.5px] font-extrabold inline-flex items-center gap-2 transition-colors',
          simOn ? 'bg-ok-500 text-white' : 'bg-white/10 text-white/60'
        )}
      >
        <span className={cx('w-2 h-2 rounded-full', simOn ? 'bg-white animate-pulseDot' : 'bg-white/40')} />
        실시간 시뮬레이션 {simOn ? 'ON' : 'OFF'}
      </button>

      <div className="inline-flex bg-white/10 rounded-xl p-1 gap-0.5">
        <Link
          href="/explore"
          className={cx(
            'h-8 px-3.5 rounded-lg text-[12.5px] font-bold inline-flex items-center gap-1.5 transition-colors',
            !isAdmin ? 'bg-white text-ink-900' : 'text-white/60 hover:text-white'
          )}
        >
          <Icon n="phone" s={15} />
          손님 앱
        </Link>
        <Link
          href="/admin"
          className={cx(
            'h-8 px-3.5 rounded-lg text-[12.5px] font-bold inline-flex items-center gap-1.5 transition-colors',
            isAdmin ? 'bg-white text-ink-900' : 'text-white/60 hover:text-white'
          )}
        >
          <Icon n="dashboard" s={15} />
          관리자 패널
        </Link>
      </div>
    </div>
  );
};
