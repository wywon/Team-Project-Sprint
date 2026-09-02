/**
 * 순수 함수 모음 — 상태도 없고 React도 모른다.
 * 서버 컴포넌트/클라이언트 컴포넌트 어디서든 import 해도 된다.
 */

/** 조건부 클래스 결합. clsx 를 설치하지 않기 위한 최소 구현 */
export const cx = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(' ');

export const pad = (n: number) => String(n).padStart(2, '0');

/** a 이상 b 이하 정수. 목업 시뮬레이터에서만 쓴다 */
export const rnd = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));

export const fmtTime = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

export const won = (n: number) => n.toLocaleString('ko-KR');

/** 거리(m) → 도보 분. 성인 보행속도 약 67 m/분 */
export const walkMin = (m: number) => Math.max(1, Math.round(m / 67));

/** 경과 시간을 사람이 읽는 문구로 */
export function agoText(ms: number): string {
  const s = Math.floor(ms / 1000);
  if (s < 10) return '방금 전';
  if (s < 60) return `${s}초 전`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}분 전`;
  return `${Math.floor(m / 60)}시간 전`;
}

/**
 * 데이터 신선도
 * ─────────────────────────────────────────────────────────────
 * 실시간 서비스에서 가장 중요한 UX 장치다.
 * "이 숫자가 정말 지금 상태인가?"를 사용자가 스스로 판단할 수 있어야 한다.
 * 화면에 실시간 수치를 띄우는 곳에는 반드시 이 결과를 함께 표시할 것.
 */
export function freshness(ms: number): { label: string; warn: boolean; tone: string } {
  if (ms < 30_000)  return { label: '실시간',       warn: false, tone: 'ok' };
  if (ms < 120_000) return { label: '최근 기준',    warn: false, tone: 'ink' };
  if (ms < 300_000) return { label: '갱신 지연',    warn: true,  tone: 'warn' };
  return { label: '오래된 정보', warn: true, tone: 'off' };
}

/** 'YYYY-MM-DD' → '8월 24일 (월)' */
export function fmtDateK(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const dow = ['일', '월', '화', '수', '목', '금', '토'][new Date(y, m - 1, d).getDay()];
  return `${m}월 ${d}일 (${dow})`;
}
