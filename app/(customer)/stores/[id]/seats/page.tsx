'use client';

import React, { use } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { Button, Card, Gauge, LiveStamp } from '@/components/ui/primitives';
import { SubHeader, StickyCta } from '@/components/customer/Shell';
import { cx } from '@/lib/format';
import { seatStats } from '@/lib/status';
import { SEAT_BUSY } from '@/lib/mock';
import { useApp } from '@/lib/store';

/**
 * 실시간 좌석 현황
 * ─────────────────────────────────────────────────────────────
 * ★ 테이블 배치도를 보여주지 않는다.
 *   손님이 "3번 테이블이 비었네"까지 알 필요가 없고, 알면 오히려
 *   그 자리를 기대하게 되어 매장의 자리 배정 자유를 뺏는다.
 *   보여줄 것은 "몇 자리 비었나"와 "언제 가면 한가한가" 두 가지다.
 *
 * ★ 상태는 이용 가능 / 사용 중 / 정리 중 세 가지로만 단순화한다.
 *   예약(reserved)은 손님 입장에서 사용 중과 다를 게 없어 합쳐서 센다.
 */
export default function SeatStatusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { getStore } = useApp();

  const store = getStore(id);
  if (!store) notFound();

  const ss = seatStats(store);
  const best = SEAT_BUSY.reduce((a, b) => (b.v < a.v ? b : a));
  const peak = SEAT_BUSY.reduce((a, b) => (b.v > a.v ? b : a));
  const maxV = Math.max(...SEAT_BUSY.map((h) => h.v));

  return (
    <div className="absolute inset-0 bg-ink-50">
      <SubHeader title="실시간 좌석 현황" sub={store.name} right={<div className="pr-2"><LiveStamp updated={store.tablesUpdated} /></div>} />

      <div className="absolute inset-0 pt-[92px] pb-[104px] overflow-y-auto no-sb">
        <div className="p-4 space-y-3">
          {/* 세 가지 상태 */}
          <Card className="p-4">
            <div className="text-[13px] font-extrabold text-ink-900 mb-3">지금 상태</div>
            <div className="grid grid-cols-3 gap-2">
              {([
                ['이용 가능', ss.available, 'check', 'text-ok-500', 'bg-ok-50 border-ok-200'],
                ['사용 중', ss.occupied, 'people', 'text-busy-500', 'bg-busy-50 border-busy-200'],
                ['정리 중', ss.cleaning, 'broom', 'text-warn-500', 'bg-warn-50 border-warn-200'],
              ] as const).map(([l, v, i, c, bg]) => (
                <div key={l} className={cx('rounded-xl border py-3 text-center', bg)}>
                  <Icon n={i} s={17} cls={cx('mx-auto mb-1.5', c)} />
                  <div className={cx('text-[24px] font-extrabold tnum leading-none', c)}>{v}</div>
                  <div className="text-[10.5px] font-bold text-ink-600 mt-1.5">{l}</div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <Gauge
                used={ss.occupied}
                total={ss.total}
                tone={ss.available === 0 ? 'busy' : ss.available <= 2 ? 'warn' : 'ok'}
                label="좌석 이용률"
                big
                sub={
                  ss.available === 0
                    ? '지금은 대기가 필요해요. 예약하고 가시는 걸 추천해요.'
                    : `가장 큰 빈 자리는 ${ss.maxParty}인석이에요.`
                }
              />
            </div>
          </Card>

          {/* 시간대별 혼잡도 */}
          <Card className="p-4">
            <div className="text-[13px] font-extrabold text-ink-900 mb-1">시간대별 혼잡도</div>
            <div className="text-[11.5px] font-bold text-ink-500 mb-4">최근 4주 평균이에요</div>

            <div className="flex items-end gap-1.5" style={{ height: 116 }}>
              {SEAT_BUSY.map((h) => {
                const pct = Math.round((h.v / maxV) * 100);
                const tone = h.v >= 80 ? 'bg-busy-400' : h.v >= 50 ? 'bg-warn-300' : 'bg-ok-300';
                return (
                  <div key={h.h} className="grow flex flex-col items-center justify-end gap-1 min-w-0">
                    <div className="w-full rounded-t bg-ink-100 flex items-end" style={{ height: 82 }}>
                      <div className={cx('w-full rounded-t transition-all duration-700', tone)} style={{ height: pct + '%' }} />
                    </div>
                    <span className="text-[9.5px] font-bold text-ink-500 tnum">{h.h}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-3 mt-3">
              {[['여유', 'bg-ok-300'], ['보통', 'bg-warn-300'], ['혼잡', 'bg-busy-400']].map(([l, c]) => (
                <span key={l} className="inline-flex items-center gap-1.5 text-[11px] font-bold text-ink-600">
                  <span className={cx('w-3 h-3 rounded', c)} />
                  {l}
                </span>
              ))}
            </div>
          </Card>

          {/* 추천 시간 */}
          <Card className="p-4 border-2 border-brand-200 bg-brand-50">
            <div className="flex items-start gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-brand-600 text-white grid place-items-center shrink-0">
                <Icon n="sparkle" s={18} />
              </span>
              <div>
                <div className="text-[13px] font-extrabold text-brand-800">
                  {best.h}시쯤 가시면 가장 여유로워요
                </div>
                <div className="text-[11.5px] font-medium text-brand-800/80 mt-1 leading-relaxed">
                  {peak.h}시는 가장 붐비는 시간이에요. 이 시간에 방문하실 거라면 미리 예약해 두시는 걸 추천해요.
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <StickyCta>
        <Button variant="primary" size="lg" full icon="calendar" onClick={() => router.push(`/reserve/${store.id}`)}>
          예약하기
        </Button>
      </StickyCta>
    </div>
  );
}
