'use client';

import React, { Suspense, use } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { Button, Card } from '@/components/ui/primitives';
import { fmtDateK } from '@/lib/format';
import { useApp } from '@/lib/store';

/** 예약 완료 */
function Done({ storeId }: { storeId: string }) {
  const params = useSearchParams();
  const rid = params.get('rid') ?? '';
  const { getStore, getRes } = useApp();
  const store = getStore(storeId);
  const res = getRes(rid);

  return (
    <div className="absolute inset-0 bg-white flex flex-col">
      <div className="grow flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-ok-50 grid place-items-center text-ok-500 mb-5 animate-popIn">
          <Icon n="check" s={40} />
        </div>
        <div className="text-[22px] font-extrabold text-ink-900">예약이 확정되었어요</div>
        <div className="text-[13px] font-bold text-ink-500 mt-2 leading-relaxed">
          예약 내역은 <b className="text-ink-800">예약 탭</b>에서 언제든 확인하실 수 있어요
        </div>

        {res && store && (
          <Card className="w-full p-4 mt-6 text-left">
            <div className="text-[16px] font-extrabold text-ink-900">{store.name}</div>
            <div className="text-[12.5px] font-bold text-ink-500 mt-1">{store.addr}</div>
            <div className="mt-3 pt-3 border-t border-ink-100 space-y-2">
              {[
                ['calendar', `${fmtDateK(res.date)} ${res.time}`],
                ['people', `${res.party}명 · ${res.seatType}`],
                ['car', store.parking.fee],
              ].map(([i, v]) => (
                <div key={v} className="flex items-center gap-2.5">
                  <Icon n={i} s={15} cls="text-ink-400 shrink-0" />
                  <span className="text-[12.5px] font-bold text-ink-700">{v}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="w-full mt-4 rounded-2xl bg-brand-50 border border-brand-100 p-4 text-left">
          <div className="flex items-center gap-2 mb-2">
            <Icon n="bell" s={16} cls="text-brand-600" />
            <span className="text-[12.5px] font-extrabold text-brand-800">앞으로 이렇게 알려드려요</span>
          </div>
          <ul className="space-y-1.5 text-[11.5px] font-medium text-brand-800/85 leading-relaxed">
            <li>· 출발하실 시간이 되면 알림을 보내드려요.</li>
            <li>· 방문 30분 전에 주차 상황을 알려드려요.</li>
            <li>· 예약 시간 10분이 지나면 자동으로 취소돼요.</li>
            <li>· 변경·취소는 방문 2시간 전까지 앱에서 가능해요.</li>
          </ul>
        </div>
      </div>

      <div className="shrink-0 px-4 pb-8 pt-3 space-y-2">
        <Link href={`/reservations/${rid}`} className="block">
          <Button variant="primary" size="lg" full icon="calendar">예약 상세 보기</Button>
        </Link>
        <Link href="/explore" className="block">
          <Button variant="ghost" size="lg" full>홈으로</Button>
        </Link>
      </div>
    </div>
  );
}

export default function ReserveDonePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <Suspense fallback={<div className="absolute inset-0 bg-white" />}>
      <Done storeId={id} />
    </Suspense>
  );
}
