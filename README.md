# SPOT

> 대전 원도심 입점 식당의 **실시간 좌석·예약**과 **주차면 센서 기반 실시간 주차**를 한 앱에서 확인하는 서비스

`SPOT_v3_프로토타입.html` 의 UI를 Next.js App Router 프로젝트로 옮긴 초안입니다.
하나의 Next 앱 안에서 **라우트 그룹**으로 손님 앱과 관리자 패널을 나눴습니다.

---

## 1. 시작하기

```bash
pnpm install      # 또는 npm install
pnpm dev          # http://localhost:3000
```

| 주소 | 화면 |
|---|---|
| `/` | `/explore` 로 리다이렉트 |
| `/explore` | 손님 앱 첫 화면 |
| `/admin` | 관리자 패널 대시보드 |

화면 맨 위 검은 바에서 **손님 앱 ↔ 관리자 패널**을 오갈 수 있습니다.
이 바는 개발용이며 `components/ModeSwitch.tsx` 하나만 지우면 사라집니다.

> **DB·환경변수가 필요 없습니다.** 1~3주차에는 `lib/mock.ts` 만 보고 화면을 만듭니다.

---

## 2. 폴더 구조

```
app/
├ layout.tsx              ★ 두 앱이 공유하는 유일한 레이아웃 (폰트·전역 CSS·전역 상태)
├ globals.css
├ page.tsx                → /explore 리다이렉트
│
├ (customer)/             ← 괄호 = URL에 안 나옴. 손님 앱 그룹
│  ├ layout.tsx           PhoneChrome + TabBar        [담당 A]
│  ├ explore/             /explore      지도 첫 화면
│  ├ search/              /search       전체화면 검색
│  ├ favorites/           /favorites    즐겨찾기
│  ├ lots/[id]/           /lots/L1      공영주차장 상세
│  ├ stores/[id]/         /stores/s1    식당 상세
│  │  ├ seats/            /stores/s1/seats     실시간 좌석
│  │  └ reviews/          /stores/s1/reviews   리뷰 목록
│  ├ reserve/[id]/        /reserve/s1          예약 3단계
│  │  └ done/             /reserve/s1/done     예약 완료
│  ├ parking/             /parking      주차 탭
│  ├ reservations/        /reservations 예약 목록
│  │  └ [id]/             /reservations/r1     예약 상세
│  │     └ review/        /reservations/r1/review  리뷰 작성
│  └ my/                  /my           마이페이지
│
└ (admin)/                ← 관리자 그룹
   ├ layout.tsx           Sidebar + 데스크톱 셸        [담당 B]
   └ admin/
      ├ page.tsx          /admin           대시보드
      ├ hall/             /admin/hall      홀 운영
      ├ parking/          /admin/parking   주차 관리
      └ store/            /admin/store     매장 관리 (정보·테이블·주차장·통계)

components/
├ ui/                     ★ 공용 부품. 화면에서 직접 스타일 쓰지 말고 여기 걸 쓴다  [담당 C]
│  ├ Icon.tsx             SVG 아이콘 48종
│  ├ primitives.tsx       Button Badge Card Chip Segmented Gauge Empty Skeleton LiveStamp
│  └ overlays.tsx         BottomSheet Modal NavSheet ToastHost ConfirmModal
├ customer/
│  ├ Shell.tsx            PhoneChrome TabBar SubHeader StickyCta
│  ├ Cards.tsx            StoreCard PlainStoreCard LotCard FoodTile
│  └ MapCanvas.tsx        지도 대체 구현 + 마커 3종
├ admin/
│  ├ Sidebar.tsx          AdminSidebar AdminTopbar
│  ├ SlotGrid.tsx         주차장 배치도 + 범례
│  ├ TableMap.tsx         테이블 배치도
│  ├ KPI.tsx              KPI StatBar StatRow
│  └ ResCalendar.tsx      예약 달력 모달
└ ModeSwitch.tsx          개발용 상단 바 (배포 시 삭제)

lib/                      ★ 여기가 계약서다. 바꾸려면 팀과 상의       [담당 C]
├ types.ts                도메인 타입 = 나중에 Prisma 모델이 될 모양
├ tokens.ts               상태 → 색·아이콘·라벨 매핑 / 탭·사이드바 정의
├ format.ts               cx, won, agoText, freshness …  순수 함수
├ status.ts               slotStatus, seatStats, parkStats, levelOf …  비즈니스 로직
├ mock.ts                 목업 데이터 (4주차에 API로 교체)
└ store.tsx               전역 상태 Context + 실시간 시뮬레이터
```

---

## 3. 왜 모노레포가 아니라 라우트 그룹인가

| | 단일 앱 + 라우트 그룹 (선택) | Turborepo + 앱 2개 |
|---|---|---|
| 설치·빌드 | `pnpm dev` 하나 | 워크스페이스·파이프라인 설정 필요 |
| 공용 부품 | `@/components` 로 바로 import | `packages/ui` 만들고 빌드 연결 |
| 배포 | Vercel 프로젝트 1개 | 2개 + 도메인 분리 |
| 새로 배울 개념 | 없음 | pnpm workspace, turbo.json, 패키지 참조 |

5주 · 비전공자 4명이라는 조건에서는 배울 게 없는 쪽이 맞습니다.
관리자만 따로 배포해야 할 상황이 오면 `(admin)` 폴더만 새 앱으로 옮기면 되므로,
지금 선택이 나중을 막지도 않습니다.

**라우트 그룹이란** 폴더 이름을 괄호로 감싸면 URL에 나타나지 않는 Next.js 기능입니다.
`app/(customer)/explore/page.tsx` → `/explore`. URL은 그대로 두고 레이아웃만 다르게 줍니다.

---

## 4. 작업 분담

| 담당 | 폴더 | 다른 사람과 겹치지 않음 |
|---|---|---|
| **A** 손님 앱 | `app/(customer)/**` | ✅ |
| **B** 관리자 패널 | `app/(admin)/**` | ✅ |
| **C** 공용 부품·데이터 | `components/ui/**`, `lib/**` | ✅ |
| **D** 센서 | `detector/` (별도 · Python) | ✅ 접점은 `/api/detect` 하나 |

같은 파일을 두 사람이 고칠 일이 구조적으로 없습니다. 충돌이 나면 분담이 잘못된 것입니다.

### 만드는 순서 (권장)

1. **C** 가 `lib/` 와 `components/ui/` 를 먼저 확정 → A·B가 기다리지 않게
2. **A** `/explore` → `/stores/[id]` → `/reserve/[id]` → 나머지
3. **B** `/admin` → `/admin/hall` → `/admin/parking` → `/admin/store`
4. 4주차: `lib/mock.ts` import 를 `fetch('/api/...')` 로 교체

---

## 5. 4주차에 실제 데이터로 바꾸는 법

지금은 화면이 `lib/mock.ts` 를 직접 읽습니다. 바꿀 곳은 두 군데뿐입니다.

**① `lib/store.tsx` 의 시뮬레이터 `useEffect` 를 폴링으로 교체**

```ts
// 지금 (시뮬레이터)
useEffect(() => { const t = setInterval(() => { /* 랜덤으로 상태 바꿈 */ }, 3500); ... }, []);

// 바꾼 뒤 (3초 폴링)
useEffect(() => {
  const t = setInterval(async () => {
    const res = await fetch('/api/stores');
    setStores(await res.json());
  }, 3000);
  return () => clearInterval(t);
}, []);
```

WebSocket 대신 폴링을 쓰는 이유: 학습·디버깅 비용이 크게 줄고, 3초 간격이면 체감 차이가 거의 없습니다.

**② `api.setTable(...)` 같은 함수 안을 fetch 로 교체**

```ts
setTable: async (storeId, tableId, patch) => {
  await fetch(`/api/admin/tables/${tableId}`, { method: 'PATCH', body: JSON.stringify(patch) });
  // 폴링이 곧 최신 상태를 가져오므로 화면 코드는 손대지 않는다
}
```

**화면 파일(`app/**/page.tsx`)은 한 줄도 고치지 않습니다.** 그러라고 상태를 한 곳에 모아 뒀습니다.

### 만들 API 8개

```
GET   /api/stores                       목록 (지도·탐색)
GET   /api/stores/[id]                  상세 + 좌석 + 주차면
POST  /api/reservations                 예약 생성
GET   /api/reservations?phone=          내 예약
POST  /api/reservations/[id]/cancel     예약 취소
PATCH /api/admin/tables/[id]            테이블 상태 변경
PATCH /api/admin/slots/[id]             주차면 수동 지정
POST  /api/detect                       ★ 센서 팀(D)이 호출
```

`POST /api/detect` 규격 — **D가 알아야 할 유일한 것**

```json
{ "storeId": "s1", "slots": [{ "code": "A1", "status": "occupied" }] }
```

---

## 6. 손대면 안 되는 설계 규칙

이 규칙들은 화면을 예쁘게 하려는 게 아니라 **신뢰를 지키기 위한 것**입니다.

1. **예약 과정에 테이블 번호를 노출하지 않는다.** 손님은 테이블을 고르지 않습니다. 자리 배정은 매장이 결정합니다.
2. **`unknown`(확인 중) 주차면을 이용 가능 수에 넣지 않는다.** — `lib/status.ts` 의 `parkStats()`
3. **센서가 죽으면 `available` 을 `0`이 아니라 `null` 로 준다.** `0`은 "만차", `null`은 "모른다"입니다. 완전히 다른 이야기입니다.
4. **색만으로 상태를 전달하지 않는다.** 색 + 아이콘 + 텍스트 + 빗금(`hatch-*`) 네 가지를 항상 함께 씁니다.
5. **부정 상태에는 반드시 대안 CTA를 둔다.** "만차입니다"로 끝내지 않습니다.
6. **손님 화면에 CCTV/센서/기술 용어를 노출하지 않는다.** 손님이 이해할 상태는 다섯 개뿐: 주차 가능 / 주차 중 / 만차 / 확인 중 / 확인 불가.
7. **실시간 수치 옆에는 항상 `<LiveStamp>` 를 둔다.** "이 숫자가 지금 상태인가?"에 답해야 합니다.

---

## 7. Hydration 주의사항

Next.js는 서버에서 HTML을 먼저 만들고 브라우저에서 이어받습니다.
두 결과가 다르면 콘솔에 hydration 에러가 납니다. **원인은 대부분 둘 중 하나입니다.**

- `Date.now()` / `new Date()` 를 렌더 중에 호출 → 서버와 브라우저 시각이 다름
- `Math.random()` 을 렌더 중에 호출 → 값이 다름

그래서 이 프로젝트는 이렇게 처리합니다.

- 목업의 timestamp 는 전부 `0`으로 시작하고, `SpotProvider` 가 마운트된 뒤 한 번 채웁니다.
- `useNow()` 는 서버 렌더 때 `0`을 반환합니다. `now &&` 로 감싸서 쓰세요.
- `<LiveStamp>` 는 시각을 모를 때 "확인 중…"을 보여줍니다.
- 목업의 예약 달력·시간 가능 여부는 난수가 아니라 **인덱스 기반**으로 계산합니다.

---

## 8. 아직 없는 것 (의도적)

| 없는 것 | 이유 / 언제 |
|---|---|
| 실제 지도 SDK | 키 발급·좌표계 리스크. `MapCanvas.tsx` 하나만 교체하면 됩니다 |
| 로그인 | MVP 범위 밖. 4주차에 관리자 비밀번호 1개로 |
| Prisma·DB | 1~3주차는 목업으로 충분. 4주차에 붙입니다 |
| 결제 | Phase 2. 마이페이지의 차량 정보가 그 포석입니다 |
| 이미지 업로드 | 히어로는 그라디언트로 대체 중 |
