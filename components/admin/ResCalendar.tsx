'use client';

import React, { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Modal } from '@/components/ui/overlays';
import { cx, pad } from '@/lib/format';
import { MONTH_RES } from '@/lib/mock';

/**
 * 예약 달력
 * ─────────────────────────────────────────────────────────────
 * 대시보드의 '오늘 예약' 카드를 누르면 열린다.
 * 어느 날 · 몇 시 · 누가 예약했는지를 한 화면에서 본다.
 * 관리자에게 가장 자주 필요한 조회이므로 1클릭 안에 둔다.
 */
export const ResCalendar = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [ym, setYm] = useState({ y: 2026, m: 8 });
  const [pick, setPick] = useState<string | null>('2026-08-18');

  const first = new Date(ym.y, ym.m - 1, 1).getDay();
  const last = new Date(ym.y, ym.m, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: first }, () => null),
    ...Array.from({ length: last }, (_, i) => i + 1),
  ];

  const move = (d: number) => {
    let { y, m } = ym;
    m += d;
    if (m < 1) { m = 12; y--; }
    if (m > 12) { m = 1; y++; }
    setYm({ y, m });
    setPick(null);
  };

  const list = pick ? MONTH_RES[pick] ?? [] : [];

  return (
    <Modal open={open} onClose={onClose} title="예약 달력" sub="날짜를 누르면 그날 예약을 볼 수 있어요" w="max-w-3xl">
      <div className="flex gap-6">
        {/* 달력 */}
        <div className="w-[420px] shrink-0">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => move(-1)} className="w-9 h-9 rounded-lg hover:bg-ink-100 grid place-items-center text-ink-600" aria-label="이전 달">
              <Icon n="chevL" s={18} />
            </button>
            <div className="text-[15px] font-extrabold text-ink-900 tnum">{ym.y}년 {ym.m}월</div>
            <button onClick={() => move(1)} className="w-9 h-9 rounded-lg hover:bg-ink-100 grid place-items-center text-ink-600" aria-label="다음 달">
              <Icon n="chevR" s={18} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
              <div key={d} className={cx('text-center text-[11px] font-extrabold py-1', i === 0 ? 'text-busy-400' : i === 6 ? 'text-brand-500' : 'text-ink-400')}>
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, i) => {
              if (d === null) return <div key={`e${i}`} />;
              const key = `${ym.y}-${pad(ym.m)}-${pad(d)}`;
              const n = (MONTH_RES[key] ?? []).length;
              const on = pick === key;
              return (
                <button
                  key={key}
                  onClick={() => setPick(key)}
                  className={cx(
                    'h-[54px] rounded-lg border flex flex-col items-center justify-center gap-1 transition-all',
                    on ? 'bg-brand-600 border-brand-600 text-white' : 'bg-white border-ink-200 hover:border-brand-300'
                  )}
                >
                  <span className={cx('text-[13px] font-extrabold tnum', on ? 'text-white' : 'text-ink-800')}>{d}</span>
                  {n > 0 && (
                    <span className={cx('text-[9.5px] font-extrabold px-1.5 rounded-full tnum', on ? 'bg-white/25' : 'bg-brand-50 text-brand-700')}>
                      {n}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 그날 예약 목록 */}
        <div className="grow min-w-0">
          <div className="text-[13.5px] font-extrabold text-ink-900 mb-3">
            {pick ? `${Number(pick.slice(5, 7))}월 ${Number(pick.slice(8))}일 예약` : '날짜를 선택해 주세요'}
            {pick && <span className="text-[12px] font-bold text-ink-400 ml-2 tnum">{list.length}건</span>}
          </div>

          <div className="space-y-2 max-h-[420px] overflow-y-auto thin-sb pr-1">
            {list.length === 0 ? (
              <div className="py-10 text-center text-[12.5px] font-bold text-ink-400">예약이 없는 날이에요</div>
            ) : (
              list.map((r, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-ink-200 bg-white">
                  <span className="text-[13px] font-extrabold text-brand-700 tnum w-[42px] shrink-0">{r.time}</span>
                  <div className="grow min-w-0">
                    <div className="text-[13px] font-extrabold text-ink-900 truncate">{r.name}</div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11.5px] font-extrabold text-ink-500 tnum shrink-0">
                    <Icon n="people" s={13} />
                    {r.party}명
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
