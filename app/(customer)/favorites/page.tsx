'use client';

import React from 'react';
import Link from 'next/link';
import { SubHeader } from '@/components/customer/Shell';
import { Empty, Button } from '@/components/ui/primitives';
import { StoreCard, LotCard } from '@/components/customer/Cards';
import { useApp } from '@/lib/store';

/** 즐겨찾기 — 탐색 화면의 별 아이콘에서 들어온다 */
export default function FavoritesPage() {
  const { stores, lots, favorites } = useApp();
  const favStores = stores.filter((s) => favorites.includes(s.id));
  const favLots = lots.filter((l) => favorites.includes(l.id));
  const empty = favStores.length + favLots.length === 0;

  return (
    <div className="absolute inset-0 bg-ink-50">
      <SubHeader title="즐겨찾기" />
      <div className="absolute inset-0 pt-[92px] overflow-y-auto no-sb p-4 space-y-3">
        {empty ? (
          <Empty
            icon="starO"
            title="아직 저장한 곳이 없어요"
            desc={'자주 가는 식당이나 주차장을 저장해 두면\n여기서 바로 상태를 확인할 수 있어요'}
            action={<Link href="/explore"><Button variant="primary" icon="compass">주변 둘러보기</Button></Link>}
          />
        ) : (
          <>
            {favStores.map((s) => <StoreCard key={s.id} store={s} />)}
            {favLots.map((l) => <LotCard key={l.id} lot={l} />)}
          </>
        )}
      </div>
    </div>
  );
}
