'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { Chip } from '@/components/ui/primitives';
import { MapCanvas, LotMarker, PartnerMarker, PlainMarker, MeMarker } from '@/components/customer/MapCanvas';
import { StoreCard, LotCard } from '@/components/customer/Cards';
import { cx } from '@/lib/format';
import { PLAIN_STORES } from '@/lib/mock';
import { useApp } from '@/lib/store';

/**
 * 탐색 (첫 화면)
 * ─────────────────────────────────────────────────────────────
 * ★ 왜 지도가 전체 화면인가
 *   이 서비스의 판단 기준은 "여기서 가까운가 + 자리 있나 + 차 댈 데 있나"다.
 *   세 값은 전부 공간과 묶여 있으므로 목록보다 지도가 먼저다.
 *   목록은 지도를 가리지 않도록 하단 시트로 겹쳐 올린다.
 *
 * ★ 검색창은 absolute 로 지도 위에 띄운다. 지도 높이를 깎지 않기 위해서다.
 *
 * URL 파라미터로 상태를 받는다 (다른 화면에서 돌아올 때 필터/초점을 복원하기 위함)
 *   ?filter=food|lot|all   ?focus=<id>   ?q=<검색어>
 *
 * ★ Suspense 로 감싸는 이유 — 빼면 `npm run build` 가 실패한다
 *   useSearchParams() 는 주소창의 ?뒤쪽을 읽는데, 그건 브라우저에서만 알 수 있는 값이다.
 *   Next.js 는 빌드할 때 페이지를 미리 HTML로 만들어 두려고 하는데,
 *   그 시점에는 ?뒤쪽을 모르므로 "여기는 나중에 채울 자리"라고 표시해 줘야 한다.
 *   그 표시가 <Suspense> 다. 없으면 빌드가 이 에러로 멈춘다:
 *     useSearchParams() should be wrapped in a suspense boundary at page "/explore"
 *
 *   ※ npm run dev 에서는 이 에러가 안 난다. 빌드할 때만 난다.
 *     useSearchParams() 를 새로 쓰는 화면이 생기면 똑같이 감싸 줄 것.
 */
export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="absolute inset-0 map-grid" />}>
      <ExploreView />
    </Suspense>
  );
}

function ExploreView() {
  const router = useRouter();
  const params = useSearchParams();
  const { stores, lots, favorites } = useApp();

  const filter = params.get('filter') ?? 'all';
  const focusId = params.get('focus');
  const query = params.get('q') ?? '';

  const [sel, setSel] = useState<string | null>(focusId);

  const showLots = filter === 'all' || filter === 'lot';
  const showFood = filter === 'all' || filter === 'food';

  const setFilter = (v: string) => {
    const p = new URLSearchParams(Array.from(params.entries()));
    if (v === 'all') p.delete('filter');
    else p.set('filter', v);
    router.replace(`/explore?${p.toString()}`);
  };

  const selStore = stores.find((s) => s.id === sel);
  const selLot = lots.find((l) => l.id === sel);

  return (
    <div className="absolute inset-0">
      <MapCanvas>
        <MeMarker lat={50} lng={50} />
        {showLots && lots.map((l) => (
          <LotMarker key={l.id} lot={l} on={sel === l.id} onClick={() => setSel(l.id)} />
        ))}
        {showFood && PLAIN_STORES.map((s) => <PlainMarker key={s.id} store={s} />)}
        {showFood && stores.map((s) => (
          <PartnerMarker key={s.id} store={s} on={sel === s.id} onClick={() => setSel(s.id)} />
        ))}
      </MapCanvas>

      {/* 검색창 + 즐겨찾기 — 지도 위에 절대 위치 */}
      <div className="absolute top-0 left-0 right-0 z-40 pt-12 px-4">
        <div className="flex items-center gap-2">
          <Link
            href="/search"
            className="grow h-12 rounded-2xl bg-white shadow-pop border border-ink-200 flex items-center gap-2.5 px-4"
          >
            <Icon n="search" s={19} cls="text-ink-400 shrink-0" />
            <span className={cx('text-[14px] font-bold truncate', query ? 'text-ink-900' : 'text-ink-400')}>
              {query || '식당, 공영주차장 검색'}
            </span>
          </Link>
          <Link
            href="/favorites"
            aria-label="즐겨찾기"
            className="w-12 h-12 rounded-2xl bg-white shadow-pop border border-ink-200 grid place-items-center shrink-0 text-warn-400"
          >
            <Icon n={favorites.length ? 'star' : 'starO'} s={21} />
          </Link>
        </div>

        {/* 필터 칩 */}
        <div className="flex gap-2 mt-3 overflow-x-auto no-sb -mx-4 px-4">
          <Chip active={filter === 'all'} onClick={() => setFilter('all')}>전체</Chip>
          <Chip active={filter === 'lot'} icon="parkingP" onClick={() => setFilter('lot')} count={lots.length}>
            공영주차장
          </Chip>
          <Chip active={filter === 'food'} icon="fork" onClick={() => setFilter('food')} count={stores.length}>
            식당주차장
          </Chip>
        </div>
      </div>

      {/* 하단 시트 — 선택한 마커가 있으면 그 카드만, 없으면 전체 목록 */}
      <div className="absolute left-0 right-0 bottom-[76px] z-30 px-4 pb-3">
        {selStore ? (
          <div className="animate-popIn">
            <StoreCard store={selStore} />
          </div>
        ) : selLot ? (
          <div className="animate-popIn">
            <LotCard lot={selLot} />
          </div>
        ) : (
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-ink-200 shadow-pop px-4 py-3 flex items-center gap-2.5">
            <Icon n="compass" s={18} cls="text-brand-600 shrink-0" />
            <div className="grow text-[12.5px] font-bold text-ink-700 leading-snug">
              지도에서 <b className="text-ink-900">숫자가 붙은 표시</b>를 누르면
              <br />
              좌석과 주차 상황을 함께 볼 수 있어요
            </div>
          </div>
        )}
      </div>

      {/* 선택 해제 */}
      {sel && (
        <button
          onClick={() => setSel(null)}
          className="absolute right-4 bottom-[190px] z-30 w-11 h-11 rounded-full bg-white shadow-pop border border-ink-200 grid place-items-center text-ink-500"
          aria-label="선택 해제"
        >
          <Icon n="x" s={18} />
        </button>
      )}
    </div>
  );
}
