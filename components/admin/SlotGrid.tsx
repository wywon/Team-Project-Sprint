'use client';

import React, { useMemo } from 'react';
import { Icon } from '@/components/ui/Icon';
import { cx } from '@/lib/format';
import { SLOT } from '@/lib/tokens';
import { slotStatus } from '@/lib/status';
import type { ParkingSlot, PartnerStore } from '@/lib/types';

/**
 * 주차장 배치도
 * ─────────────────────────────────────────────────────────────
 * ★ 관리자 전용이다. 손님 화면에는 배치도를 보여주지 않는다.
 *   손님에게는 "몇 자리 남았는지"만 알려주면 되고, 어느 칸인지까지 알려주면
 *   그 칸이 사라졌을 때 오히려 신뢰가 깨진다.
 *
 * ★ 접근성 — 각 칸은 색 + 아이콘 + 짧은 텍스트 + 빗금 네 가지를 모두 갖는다.
 *   cfg.hatch 를 빼지 말 것.
 *
 * cell: 한 칸의 픽셀 크기. 화면이 좁으면 칸을 줄이지 말고 부모에서 가로 스크롤을 준다.
 */
export const SlotGrid = ({
  store, onSelect, selectedCode, cell = 64,
}: {
  store: PartnerStore;
  onSelect?: (s: ParkingSlot) => void;
  selectedCode?: string | null;
  cell?: number;
}) => {
  const rows = useMemo(() => {
    const m: Record<number, ParkingSlot[]> = {};
    store.parking.slots.forEach((s) => {
      (m[s.row] = m[s.row] || []).push(s);
    });
    return Object.keys(m)
      .sort((a, b) => Number(a) - Number(b))
      .map((k) => m[Number(k)].sort((a, b) => a.col - b.col));
  }, [store.parking.slots]);

  const off = store.sensor === 'offline';
  const widest = rows.length ? Math.max(...rows.map((r) => r.length)) : 0;

  return (
    <div className="space-y-2" style={{ minWidth: widest * (cell + 6) }}>
      {rows.map((row, i) => (
        <React.Fragment key={i}>
          <div className="flex gap-1.5">
            {row.map((s) => {
              const eff = off ? 'offline' : slotStatus(s);
              const isManual = s.manualStatus && s.manualUntil && s.manualUntil > Date.now();
              const cfg = s.type === 'disabled' && eff !== 'occupied' ? SLOT.disabled : SLOT[eff] || SLOT.unknown;
              const sel = selectedCode === s.code;
              return (
                <button
                  key={s.code}
                  onClick={() => onSelect && onSelect(s)}
                  style={{ width: cell, height: cell }}
                  className={cx(
                    'relative rounded-xl border-2 flex flex-col items-center justify-center gap-0.5 transition-all shrink-0',
                    cfg.bg, cfg.border, cfg.hatch,
                    sel && 'ring-4 ring-brand-200 border-brand-500 scale-[1.04] z-10',
                    onSelect && 'hover:scale-[1.04] hover:shadow-card cursor-pointer active:scale-100'
                  )}
                >
                  {s.nearGate && (
                    <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[8px] font-extrabold bg-ink-900 text-white px-1.5 rounded-full">
                      입구
                    </span>
                  )}
                  <span className={cx('tnum text-[11px] font-extrabold leading-none', cfg.text)}>{s.code}</span>
                  <Icon n={cfg.icon} s={15} cls={cfg.text} />
                  <span className={cx('text-[9px] font-extrabold leading-none', cfg.text)}>{cfg.short}</span>
                  {s.type === 'ev' && (
                    <span className="absolute top-1 right-1 text-[8px] font-extrabold text-ok-600 bg-ok-100 px-1 rounded">EV</span>
                  )}
                  {isManual && (
                    <span className="absolute bottom-1 right-1 text-warn-500"><Icon n="hand" s={10} /></span>
                  )}
                </button>
              );
            })}
          </div>
          {i < rows.length - 1 && (
            <div className="h-6 rounded bg-ink-100 border-y border-dashed border-ink-300 grid place-items-center">
              <span className="text-[9px] font-extrabold text-ink-400 tracking-[.2em]">주 행 통 로</span>
            </div>
          )}
        </React.Fragment>
      ))}
      <div className="mt-1 h-6 rounded-lg bg-ink-900 text-white text-[10px] font-extrabold grid place-items-center tracking-[.15em]">
        ▲ 출 입 구
      </div>
    </div>
  );
};

export const SlotLegend = () => (
  <div className="flex flex-wrap gap-x-3 gap-y-1.5">
    {(['available', 'occupied', 'unknown', 'offline', 'manual'] as const).map((k) => {
      const c = SLOT[k];
      return (
        <span key={k} className="inline-flex items-center gap-1 text-[11px] font-bold text-ink-600">
          <span className={cx('w-3.5 h-3.5 rounded border-2 grid place-items-center', c.bg, c.border, c.hatch)}>
            <Icon n={c.icon} s={9} cls={c.text} />
          </span>
          {c.label}
        </span>
      );
    })}
  </div>
);
