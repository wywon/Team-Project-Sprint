'use client';

import React from 'react';
import { Icon } from '@/components/ui/Icon';
import { cx } from '@/lib/format';
import { levelOf, lotStats, parkStats, seatStats } from '@/lib/status';
import type { PartnerStore, PlainStore, PublicLot } from '@/lib/types';

/**
 * 지도 캔버스 (대체 구현)
 * ─────────────────────────────────────────────────────────────
 * ★ MVP에서는 실제 지도 SDK를 붙이지 않는다.
 *   네이버/카카오 지도 SDK는 키 발급·도메인 등록·좌표계 변환이 필요해서
 *   5주 일정에서 리스크가 크다. 대신 CSS 격자 배경 위에 퍼센트 좌표로 마커를 얹는다.
 *
 * ★ 나중에 진짜 지도로 바꿀 때
 *   이 파일 하나만 교체하면 된다. 마커 컴포넌트(LotMarker/PartnerMarker/PlainMarker)는
 *   좌표만 받으므로 SDK의 CustomOverlay 안에 그대로 넣을 수 있다.
 *   store.lat/lng 를 퍼센트가 아니라 실제 위경도로 바꾸는 것이 유일한 변경점이다.
 */

export const MapCanvas = ({ children }: { children: React.ReactNode }) => (
  <div className="absolute inset-0 map-grid overflow-hidden">
    {/* 도로 (장식) */}
    <div className="road-h" style={{ top: '38%', left: 0, right: 0 }} />
    <div className="road-h" style={{ top: '72%', left: 0, right: 0 }} />
    <div className="road-v" style={{ left: '30%', top: 0, bottom: 0 }} />
    <div className="road-v" style={{ left: '68%', top: 0, bottom: 0 }} />
    {children}
  </div>
);

const anchor = (lat: number, lng: number): React.CSSProperties => ({
  position: 'absolute',
  top: `${lat}%`,
  left: `${lng}%`,
  transform: 'translate(-50%,-100%)',
});

/** 공영주차장 마커 — 잔여 대수를 숫자로 바로 보여준다 */
export const LotMarker = ({
  lot, on, onClick,
}: { lot: PublicLot; on?: boolean; onClick?: () => void }) => {
  const lv = levelOf(lotStats(lot));
  return (
    <button style={anchor(lot.lat, lot.lng)} onClick={onClick} className={cx('z-20', on && 'z-40')}>
      <span
        className={cx(
          'flex items-center gap-1 h-8 pl-1.5 pr-2.5 rounded-full shadow-mk border-2 border-white transition-transform',
          lv.cls, on && 'scale-110'
        )}
      >
        <Icon n="parkingP" s={16} />
        <span className="text-[12.5px] font-extrabold tnum">{lot.available}</span>
      </span>
      <span className="block w-2 h-2 rotate-45 -mt-1 mx-auto border-2 border-white" style={{ background: 'currentColor' }} />
    </button>
  );
};

/** 입점 식당 마커 — 좌석과 주차를 한 칩에 같이 담는다 */
export const PartnerMarker = ({
  store, on, onClick,
}: { store: PartnerStore; on?: boolean; onClick?: () => void }) => {
  const ss = seatStats(store);
  const ps = parkStats(store);
  return (
    <button style={anchor(store.lat, store.lng)} onClick={onClick} className={cx('z-20', on && 'z-40')}>
      <span
        className={cx(
          'flex items-center gap-1.5 h-9 pl-2 pr-2.5 rounded-full bg-white shadow-mk border-2 transition-transform',
          on ? 'border-brand-600 scale-110' : 'border-ink-900/10'
        )}
      >
        <span className="w-5 h-5 rounded-full bg-food-400 text-white grid place-items-center shrink-0">
          <Icon n="fork" s={12} />
        </span>
        <span className="text-[12px] font-extrabold text-ink-900 max-w-[86px] truncate">{store.name}</span>
        <span className="flex items-center gap-0.5">
          <span className={cx('text-[11px] font-extrabold tnum', ss.available > 0 ? 'text-ok-500' : 'text-busy-500')}>
            {ss.available}
          </span>
          <span className="text-ink-300 text-[10px]">·</span>
          <span className={cx('text-[11px] font-extrabold tnum', ps.offline ? 'text-off-400' : (ps.available ?? 0) > 0 ? 'text-ok-500' : 'text-busy-500')}>
            {ps.offline ? '—' : ps.available}
          </span>
        </span>
      </span>
      <span className="block w-2 h-2 rotate-45 -mt-1 mx-auto bg-white border-r-2 border-b-2 border-ink-900/10" />
    </button>
  );
};

/** 미입점 식당 마커 — 상호명만. 눌러도 상세로 가지 않는다 */
export const PlainMarker = ({ store }: { store: PlainStore }) => (
  <div style={anchor(store.lat, store.lng)} className="z-10 pointer-events-none">
    <span className="flex items-center gap-1 h-6 px-2 rounded-full bg-white/85 border border-ink-200">
      <span className="w-1.5 h-1.5 rounded-full bg-ink-400" />
      <span className="text-[11px] font-bold text-ink-500 max-w-[80px] truncate">{store.name}</span>
    </span>
  </div>
);

/** 내 위치 */
export const MeMarker = ({ lat = 50, lng = 50 }: { lat?: number; lng?: number }) => (
  <div style={{ position: 'absolute', top: `${lat}%`, left: `${lng}%`, transform: 'translate(-50%,-50%)' }} className="z-30 pointer-events-none">
    <span className="block w-4 h-4 rounded-full bg-brand-600 border-[3px] border-white shadow-mk" />
  </div>
);
