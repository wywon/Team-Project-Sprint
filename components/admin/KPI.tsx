'use client';

import React from 'react';
import { Icon } from '@/components/ui/Icon';
import { Card } from '@/components/ui/primitives';
import { cx } from '@/lib/format';

/**
 * 관리자 대시보드의 숫자 카드
 * ─────────────────────────────────────────────────────────────
 * ★ 관리자는 3초 안에 매장 상황을 파악해야 한다.
 *   그래서 숫자를 크게(34px) 두고, 설명은 작게 아래에 붙인다.
 *   카드 하나에 숫자를 여러 개 넣고 싶으면 breakdown 을 쓴다 (구분선 아래로 내려간다).
 */
export const KPI = ({
  label, value, unit, sub, tone = 'brand', icon, breakdown, onClick, actionLabel,
}: {
  label: string;
  value: React.ReactNode;
  unit?: string;
  sub?: string;
  tone?: 'brand' | 'ok' | 'busy' | 'warn' | 'off' | 'unk';
  icon: string;
  breakdown?: [string, React.ReactNode, string][];
  onClick?: () => void;
  actionLabel?: string;
}) => {
  const c = {
    brand: 'text-brand-600 bg-brand-50', ok: 'text-ok-500 bg-ok-50', busy: 'text-busy-500 bg-busy-50',
    warn: 'text-warn-500 bg-warn-50', off: 'text-off-500 bg-off-50', unk: 'text-unk-500 bg-unk-50',
  }[tone];

  return (
    <Card
      className={cx('p-5', onClick && 'hover:border-brand-300 hover:shadow-pop transition-all cursor-pointer')}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-[12.5px] font-extrabold text-ink-500">{label}</span>
        <span className={cx('w-8 h-8 rounded-lg grid place-items-center', c)}>
          <Icon n={icon} s={17} />
        </span>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-[34px] font-extrabold text-ink-900 leading-none tnum">{value}</span>
        {unit && <span className="text-[14px] font-extrabold text-ink-400">{unit}</span>}
      </div>

      {sub && <div className="text-[11.5px] font-bold text-ink-500 mt-2">{sub}</div>}

      {breakdown && (
        <div className="flex gap-3 mt-3 pt-3 border-t border-ink-200">
          {breakdown.map(([l, v, cc]) => (
            <div key={l}>
              <div className={cx('text-[16px] font-extrabold leading-none tnum', cc)}>{v}</div>
              <div className="text-[10.5px] font-bold text-ink-500 mt-1">{l}</div>
            </div>
          ))}
        </div>
      )}

      {actionLabel && (
        <div className="mt-3 pt-3 border-t border-ink-200 flex items-center gap-1 text-[11.5px] font-extrabold text-brand-700">
          {actionLabel}
          <Icon n="chevR" s={13} />
        </div>
      )}
    </Card>
  );
};

/** 통계 화면의 막대 그래프 */
export const StatBar = ({
  items, valueKey, max, tone = 'bg-brand-500', unit = '건', h = 118,
}: {
  items: Record<string, string | number>[];
  valueKey: string;
  max: number;
  tone?: string;
  unit?: string;
  h?: number;
}) => (
  <div className="flex items-end gap-2" style={{ height: h + 34 }}>
    {items.map((it, i) => {
      const v = Number(it[valueKey]);
      const pct = Math.round((v / max) * 100);
      return (
        <div key={i} className="grow flex flex-col items-center justify-end gap-1.5 min-w-0">
          <span className="text-[10.5px] font-extrabold text-ink-600 tnum">{v}{unit}</span>
          <div className="w-full rounded-t-lg bg-ink-100 flex items-end" style={{ height: h }}>
            <div className={cx('w-full rounded-t-lg transition-all duration-700', tone)} style={{ height: pct + '%' }} />
          </div>
          <span className="text-[10.5px] font-bold text-ink-500 tnum">{it.d ?? it.h}</span>
        </div>
      );
    })}
  </div>
);

/** 라벨 : 값 한 줄 */
export const StatRow = ({
  label, value, sub, tone = 'text-ink-900',
}: { label: string; value: React.ReactNode; sub?: string; tone?: string }) => (
  <div className="flex items-baseline justify-between py-2.5 border-b border-ink-100 last:border-0">
    <span className="text-[12.5px] font-bold text-ink-600">{label}</span>
    <span className="text-right">
      <span className={cx('text-[15px] font-extrabold tnum', tone)}>{value}</span>
      {sub && <span className="text-[11px] font-bold text-ink-400 ml-1.5">{sub}</span>}
    </span>
  </div>
);
