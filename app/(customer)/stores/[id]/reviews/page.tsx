'use client';

import React, { use } from 'react';
import { notFound } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { Card, Empty } from '@/components/ui/primitives';
import { SubHeader } from '@/components/customer/Shell';
import { won } from '@/lib/format';
import { useApp } from '@/lib/store';

/**
 * 리뷰 목록
 * ─────────────────────────────────────────────────────────────
 * ★ 여기에는 '리뷰 쓰기' 버튼이 없다.
 *   리뷰는 예약 탭 → 지난 예약 → 영수증 인증을 마친 건에서만 쓸 수 있다.
 *   방문하지 않은 사람이 쓰는 리뷰를 구조적으로 막기 위한 설계다.
 */
export default function ReviewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { getStore, reviews } = useApp();

  const store = getStore(id);
  if (!store) notFound();

  const list = reviews.filter((r) => r.storeId === store.id);

  return (
    <div className="absolute inset-0 bg-ink-50">
      <SubHeader title="리뷰" sub={`${store.name} · ${won(store.reviews)}개`} />

      <div className="absolute inset-0 pt-[92px] overflow-y-auto no-sb p-4 space-y-3">
        <Card className="p-4 flex items-center gap-4">
          <div className="text-center shrink-0">
            <div className="text-[32px] font-extrabold text-ink-900 leading-none tnum">{store.rating}</div>
            <div className="flex justify-center text-warn-400 mt-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Icon key={i} n={i < Math.round(store.rating) ? 'star' : 'starO'} s={12} />
              ))}
            </div>
          </div>
          <div className="grow space-y-1">
            {[5, 4, 3, 2, 1].map((score) => {
              const pct = [72, 19, 6, 2, 1][5 - score];
              return (
                <div key={score} className="flex items-center gap-2">
                  <span className="text-[10.5px] font-bold text-ink-500 w-3 tnum">{score}</span>
                  <div className="grow h-1.5 rounded-full bg-ink-200 overflow-hidden">
                    <div className="h-full bg-warn-300 rounded-full" style={{ width: pct + '%' }} />
                  </div>
                  <span className="text-[10.5px] font-bold text-ink-400 w-7 text-right tnum">{pct}%</span>
                </div>
              );
            })}
          </div>
        </Card>

        {list.length === 0 ? (
          <Empty icon="starO" title="아직 리뷰가 없어요" desc={'첫 방문 후기를 남겨 주세요.\n영수증을 인증하면 리뷰를 쓸 수 있어요.'} />
        ) : (
          list.map((r) => (
            <Card key={r.id} className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-ink-100 grid place-items-center text-[11px] font-extrabold text-ink-500 shrink-0">
                  {r.name.slice(0, 1)}
                </div>
                <div className="grow min-w-0">
                  <div className="text-[12.5px] font-extrabold text-ink-800">{r.name}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="flex text-warn-400">
                      {Array.from({ length: r.rating }).map((_, i) => <Icon key={i} n="star" s={10} />)}
                    </span>
                    <span className="text-[10.5px] font-bold text-ink-400">{r.date}</span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 h-6 px-2 rounded-full bg-ok-50 border border-ok-200 text-[10.5px] font-extrabold text-ok-600 shrink-0">
                  <Icon n="receipt" s={11} />
                  영수증 인증
                </span>
              </div>
              <div className="text-[12.5px] font-medium text-ink-700 leading-relaxed">{r.text}</div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
