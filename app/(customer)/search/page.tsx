'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { Segmented, Empty } from '@/components/ui/primitives';
import { StoreCard, PlainStoreCard, LotCard, FoodTile } from '@/components/customer/Cards';
import { PLAIN_STORES } from '@/lib/mock';
import { useApp } from '@/lib/store';

/**
 * 검색 — 전체 화면 레이어
 * ─────────────────────────────────────────────────────────────
 * ★ 탭바를 숨긴다. (TabBar 가 /search 를 탭 경로로 보지 않으므로 자동으로 숨겨진다)
 * ★ 검색 전에는 최근 검색어 + 추천을 보여준다. 빈 화면을 주지 않는 것이 원칙이다.
 * ★ 검색 결과는 분류탭(식당 / 공영주차장) 기준으로 나눠 보여준다.
 */
export default function SearchPage() {
  const router = useRouter();
  const { stores, lots, recent, setRecent } = useApp();
  const [q, setQ] = useState('');
  const [tab, setTab] = useState<'food' | 'lot'>('food');
  const [submitted, setSubmitted] = useState(false);

  const results = useMemo(() => {
    const k = q.trim();
    if (!k) return { food: [], plain: [], lot: [] };
    return {
      food: stores.filter((s) => s.name.includes(k) || s.cat.includes(k)),
      plain: PLAIN_STORES.filter((s) => s.name.includes(k) || s.cat.includes(k)),
      lot: lots.filter((l) => l.name.includes(k) || l.gu.includes(k)),
    };
  }, [q, stores, lots]);

  const submit = (text: string) => {
    const k = text.trim();
    if (!k) return;
    setQ(k);
    setSubmitted(true);
    setRecent((p) => [k, ...p.filter((x) => x !== k)].slice(0, 6));
  };

  const hasResult = submitted && q.trim().length > 0;

  return (
    <div className="absolute inset-0 bg-white flex flex-col">
      {/* 검색 바 — 왼쪽에 뒤로가기 */}
      <div className="shrink-0 pt-12 px-3 pb-3 border-b border-ink-200 flex items-center gap-1.5">
        <button onClick={() => router.back()} aria-label="뒤로" className="w-10 h-10 grid place-items-center text-ink-800 shrink-0">
          <Icon n="chevL" s={21} />
        </button>
        <div className="grow h-11 rounded-xl bg-ink-100 flex items-center gap-2 px-3.5">
          <Icon n="search" s={18} cls="text-ink-400 shrink-0" />
          <input
            autoFocus
            value={q}
            onChange={(e) => { setQ(e.target.value); setSubmitted(false); }}
            onKeyDown={(e) => { if (e.key === 'Enter') submit(q); }}
            placeholder="식당, 공영주차장 검색"
            className="grow bg-transparent outline-none text-[14.5px] font-bold text-ink-900 placeholder:text-ink-400 placeholder:font-medium"
          />
          {q && (
            <button onClick={() => { setQ(''); setSubmitted(false); }} aria-label="지우기" className="text-ink-400 shrink-0">
              <Icon n="x" s={16} />
            </button>
          )}
        </div>
      </div>

      {/* 분류탭 */}
      <div className="shrink-0 px-4 py-3 border-b border-ink-100">
        <Segmented
          full
          value={tab}
          onChange={setTab}
          options={[{ value: 'food', label: '식당' }, { value: 'lot', label: '공영주차장' }]}
        />
      </div>

      <div className="grow overflow-y-auto no-sb">
        {!hasResult ? (
          <>
            {/* 최근 검색어 */}
            <div className="px-4 pt-4">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[13px] font-extrabold text-ink-900">최근 검색어</span>
                <button onClick={() => setRecent([])} className="text-[11.5px] font-bold text-ink-400">전체 삭제</button>
              </div>
              {recent.length ? (
                <div className="flex flex-wrap gap-2">
                  {recent.map((r) => (
                    <button
                      key={r}
                      onClick={() => submit(r)}
                      className="inline-flex items-center gap-1.5 h-8 pl-3 pr-2.5 rounded-full bg-ink-100 text-[12.5px] font-bold text-ink-700"
                    >
                      {r}
                      <span
                        role="button"
                        onClick={(e) => { e.stopPropagation(); setRecent((p) => p.filter((x) => x !== r)); }}
                        className="text-ink-400"
                      >
                        <Icon n="x" s={12} />
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-[12.5px] font-medium text-ink-400 py-2">최근 검색한 내역이 없어요</div>
              )}
            </div>

            {/* 추천 */}
            <div className="pt-6 pb-8">
              <div className="px-4 mb-3">
                <div className="text-[15px] font-extrabold text-ink-900">여기는 어떠세요?</div>
                <div className="text-[12px] font-bold text-ink-500 mt-0.5">지금 자리와 주차가 여유로운 곳이에요</div>
              </div>
              <div className="flex gap-3 overflow-x-auto no-sb px-4">
                {stores.map((s) => <FoodTile key={s.id} store={s} />)}
              </div>
            </div>
          </>
        ) : (
          <div className="p-4 space-y-3">
            {tab === 'food' ? (
              results.food.length + results.plain.length === 0 ? (
                <Empty icon="search" title="검색 결과가 없어요" desc={`'${q}'와 일치하는 식당을 찾지 못했어요.\n다른 이름으로 검색해 보세요.`} />
              ) : (
                <>
                  {results.food.map((s) => <StoreCard key={s.id} store={s} />)}
                  {results.plain.length > 0 && (
                    <>
                      <div className="pt-2 pb-1 text-[12px] font-extrabold text-ink-400">SPOT 미입점 매장</div>
                      {results.plain.map((s) => <PlainStoreCard key={s.id} store={s} />)}
                    </>
                  )}
                </>
              )
            ) : results.lot.length === 0 ? (
              <Empty icon="parkingP" title="검색 결과가 없어요" desc={`'${q}'와 일치하는 공영주차장을 찾지 못했어요.`} />
            ) : (
              results.lot.map((l) => <LotCard key={l.id} lot={l} />)
            )}
          </div>
        )}
      </div>
    </div>
  );
}
