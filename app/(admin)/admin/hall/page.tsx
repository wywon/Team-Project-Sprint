'use client';

import React, { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Badge, Button, Card, LiveStamp } from '@/components/ui/primitives';
import { ConfirmModal } from '@/components/ui/overlays';
import { AdminTopbar } from '@/components/admin/Sidebar';
import { TableMap } from '@/components/admin/TableMap';
import { cx } from '@/lib/format';
import { ADMIN_STORE_ID, TABLE } from '@/lib/tokens';
import { useApp } from '@/lib/store';
import type { StoreTable } from '@/lib/types';

/**
 * 홀 운영
 * ─────────────────────────────────────────────────────────────
 * ★ 화면을 배치도 중심으로 구성한다.
 *   상단 요약 라벨, '즉시 안내가능 좌석' 버튼, 빈자리/사용중 필터 칩을 전부 없앴다.
 *   그 정보들은 배치도를 보면 이미 다 보이므로 두 번 말하는 셈이었다.
 *
 * ★ 배치도에 '정리 중'을 표시하지 않는다.
 *   퇴장 처리하면 40초 뒤 자동으로 빈 자리가 되므로 관리자가 신경 쓸 일이 아니다.
 *
 * ★ '노쇼' 버튼을 '취소'로 바꿨다.
 *   미방문 처리는 시스템이 자동으로 한다. 관리자가 손으로 누르는 건
 *   손님이 전화로 못 온다고 알려온 경우이고, 그건 '취소'다.
 *
 * ★ 잘못 누름 방지 — 되돌릴 수 없는 동작(예약 취소, 이용 불가)만 확인 모달을 띄우고,
 *   되돌릴 수 있는 동작(입장/퇴장)은 토스트에 '되돌리기'를 붙인다.
 *   모든 것에 모달을 띄우면 관리자가 확인 버튼을 기계적으로 누르게 되어 오히려 위험하다.
 */
export default function AdminHallPage() {
  const { getStore, setTable, adminRes, setAdminRes, pushToast } = useApp();
  const [sel, setSel] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<null | { type: 'disable' | 'cancelRes'; table: StoreTable }>(null);

  const store = getStore(ADMIN_STORE_ID);
  if (!store) return null;

  const table = sel ? store.tables.find((t) => t.id === sel) ?? null : null;

  const act = (t: StoreTable, next: Partial<StoreTable>, label: string, tone: 'ok' | 'warn' | 'busy' | 'brand') => {
    const prev: Partial<StoreTable> = {
      status: t.status, guest: t.guest, since: t.since, resAt: t.resAt, resName: t.resName, resParty: t.resParty,
    };
    setTable(store.id, t.id, next, { who: '최영호', msg: `${t.seats}인석 ${label}`, tone });
    pushToast({
      title: label, desc: '5분 내 되돌릴 수 있어요', tone, icon: 'check',
      actionLabel: '되돌리기',
      onAction: () => setTable(store.id, t.id, prev, { who: '시스템', msg: '변경 취소', tone: 'off' }),
    });
    setSel(null);
  };

  return (
    <>
      <AdminTopbar title="홀 운영" />

      <div className="grow overflow-hidden bg-ink-50 flex">
        {/* 배치도 */}
        <div className="grow overflow-y-auto thin-sb p-7">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="text-[15px] font-extrabold text-ink-900">테이블 배치도</div>
              <LiveStamp updated={store.tablesUpdated} />
            </div>

            <div className="rounded-2xl bg-ink-50 border border-ink-200 p-6">
              <div className="text-[10px] font-extrabold text-ink-400 tracking-[.25em] text-center mb-4">창 　 측</div>
              <TableMap store={store} cols={4} onSelect={(t) => setSel(t.id)} selectedId={sel} />
              <div className="mt-5 h-8 rounded-lg bg-ink-900 text-white text-[10px] font-extrabold grid place-items-center tracking-[.2em]">
                ▲ 출 입 구 · 카 운 터
              </div>
            </div>

            {/* 선택한 테이블의 빠른 동작 */}
            {table && (
              <div className="mt-5 rounded-2xl border-2 border-brand-300 bg-brand-50 p-4 animate-popIn">
                <div className="flex items-center gap-4 flex-wrap">
                  <div
                    className={cx(
                      'w-14 h-14 rounded-xl border-2 grid place-items-center shrink-0',
                      TABLE[table.status === 'cleaning' ? 'available' : table.status].bg,
                      TABLE[table.status === 'cleaning' ? 'available' : table.status].border
                    )}
                  >
                    <span className="text-[16px] font-extrabold text-ink-800 tnum">{table.seats}</span>
                  </div>

                  <div className="grow min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[16px] font-extrabold text-ink-900">{table.seats}인석</span>
                      <Badge
                        tone={
                          table.status === 'available' || table.status === 'cleaning' ? 'ok'
                            : table.status === 'occupied' ? 'busy'
                            : table.status === 'reserved' ? 'brand' : 'off'
                        }
                        icon={TABLE[table.status === 'cleaning' ? 'available' : table.status].icon}
                        size="sm"
                      >
                        {TABLE[table.status === 'cleaning' ? 'available' : table.status].label}
                      </Badge>
                    </div>
                    <div className="text-[12px] font-bold text-ink-500 mt-1 tnum">
                      {table.status === 'occupied' && table.since ? `${table.since}부터 · ${table.guest}명`
                        : table.status === 'reserved' ? `${table.resName} · ${table.resAt} · ${table.resParty}명`
                        : '비어 있음'}
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    {(table.status === 'available' || table.status === 'cleaning') && (
                      <>
                        <Button variant="ok" icon="people" onClick={() => act(table, { status: 'occupied', guest: table.seats, since: '지금' }, '입장 처리', 'ok')}>
                          입장
                        </Button>
                        <Button variant="outline" icon="ban" onClick={() => setConfirm({ type: 'disable', table })}>
                          이용 불가
                        </Button>
                      </>
                    )}
                    {table.status === 'occupied' && (
                      <Button variant="primary" icon="check" onClick={() => act(table, { status: 'cleaning', guest: null, since: null, cleaningAt: Date.now() }, '퇴장 처리', 'brand')}>
                        퇴장
                      </Button>
                    )}
                    {table.status === 'reserved' && (
                      <>
                        <Button variant="ok" icon="people" onClick={() => act(table, { status: 'occupied', guest: table.resParty ?? 2, since: '지금', resAt: null, resName: null, resParty: null }, '예약 손님 입장', 'ok')}>
                          입장
                        </Button>
                        <Button variant="outline" onClick={() => setConfirm({ type: 'cancelRes', table })}>
                          예약 취소
                        </Button>
                      </>
                    )}
                    {table.status === 'disabled' && (
                      <Button variant="ok" icon="check" onClick={() => act(table, { status: 'available' }, '이용 가능으로 변경', 'ok')}>
                        다시 사용
                      </Button>
                    )}
                  </div>
                </div>

                {table.status === 'occupied' && (
                  <div className="mt-3 pt-3 border-t border-brand-200 text-[11.5px] font-medium text-ink-600 leading-relaxed">
                    퇴장 처리하면 정리 시간을 거쳐 <b>40초 뒤 자동으로 빈 자리</b>가 됩니다. 따로 누르실 필요 없어요.
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* 오늘 예약 */}
        <aside className="w-[340px] shrink-0 border-l border-ink-200 bg-white overflow-y-auto thin-sb">
          <div className="p-5 border-b border-ink-200">
            <div className="text-[14px] font-extrabold text-ink-900">오늘 예약</div>
            <div className="text-[11.5px] font-bold text-ink-500 mt-1 tnum">
              도착 예정 {adminRes.filter((r) => r.status === 'upcoming').length} ·
              착석 {adminRes.filter((r) => r.status === 'seated').length} ·
              미방문 {adminRes.filter((r) => r.status === 'noshow').length}
            </div>
          </div>

          <div className="px-4 py-3 bg-ink-50 border-b border-ink-200 flex items-start gap-2">
            <Icon n="question" s={14} cls="text-ink-400 shrink-0 mt-0.5" />
            <div className="text-[11.5px] font-medium text-ink-600 leading-relaxed">
              예약 시간에서 <b>10분이 지나면 자동으로 미방문 처리</b>돼요. 예약 변경은 손님이 앱에서 합니다.
            </div>
          </div>

          <div className="p-4 space-y-2">
            {adminRes.map((r) => (
              <div
                key={r.id}
                className={cx(
                  'p-3.5 rounded-xl border',
                  r.status === 'noshow' ? 'border-ink-200 bg-ink-50 opacity-70' : 'border-ink-200 bg-white'
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-extrabold text-brand-700 tnum shrink-0">{r.time}</span>
                  <span className="text-[13px] font-extrabold text-ink-900 grow truncate">{r.name}</span>
                  <span className="text-[11.5px] font-extrabold text-ink-500 tnum shrink-0">{r.party}명</span>
                </div>

                <div className="text-[11px] font-bold text-ink-400 mt-1 tnum">
                  {r.phone} · {r.status === 'upcoming' ? r.eta : r.status === 'seated' ? '착석' : '미방문'}
                </div>
                {r.memo && <div className="text-[11.5px] font-medium text-ink-500 mt-1.5">{r.memo}</div>}

                {r.status === 'upcoming' && (
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="ok" size="sm" full icon="check"
                      onClick={() => {
                        setAdminRes((p) => p.map((x) => (x.id === r.id ? { ...x, status: 'seated' as const, eta: '-' } : x)));
                        pushToast({ title: `${r.name} 입장 처리`, tone: 'ok', icon: 'check' });
                      }}
                    >
                      입장
                    </Button>
                    {/* 노쇼 → 취소 */}
                    <Button
                      variant="outline" size="sm" full
                      onClick={() => {
                        setAdminRes((p) => p.map((x) => (x.id === r.id ? { ...x, status: 'noshow' as const, eta: '-' } : x)));
                        pushToast({
                          title: `${r.name} 예약 취소`, tone: 'busy', icon: 'x',
                          actionLabel: '되돌리기',
                          onAction: () => setAdminRes((p) => p.map((x) => (x.id === r.id ? { ...x, status: 'upcoming' as const, eta: r.eta } : x))),
                        });
                      }}
                    >
                      취소
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>
      </div>

      <ConfirmModal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title={confirm?.type === 'disable' ? '이 자리를 이용 불가로 설정할까요?' : '예약을 취소할까요?'}
        sub={
          confirm?.type === 'disable'
            ? '손님 앱에서도 이용 불가로 표시되며 예약을 받을 수 없어요.'
            : '고객에게 취소 알림이 발송되고 되돌릴 수 없어요.'
        }
        confirmLabel={confirm?.type === 'disable' ? '이용 불가 설정' : '예약 취소'}
        danger
        onConfirm={() => {
          if (!confirm) return;
          const t = confirm.table;
          if (confirm.type === 'disable') act(t, { status: 'disabled' }, '이용 불가로 변경', 'warn');
          else act(t, { status: 'available', resAt: null, resName: null, resParty: null }, '예약 취소', 'busy');
        }}
      />
    </>
  );
}
