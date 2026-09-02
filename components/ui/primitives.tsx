'use client';

import React from 'react';
import { Icon } from './Icon';
import { cx, agoText, freshness } from '@/lib/format';

/**
 * 공용 UI 부품
 * ─────────────────────────────────────────────────────────────
 * ★ 화면 파일 안에서 <button className="h-11 px-4 bg-brand-600 ..."> 처럼
 *   직접 스타일을 쓰지 말고 반드시 여기 부품을 쓴다.
 *   그래야 나중에 버튼 모양을 한 번에 바꿀 수 있고, 화면마다 미묘하게 달라지지 않는다.
 *
 * ★ Figma 에서도 이 목록을 그대로 컴포넌트로 만들면 디자인과 코드가 1:1로 맞는다.
 */

/* ── Button ─────────────────────────────────────────────── */

type ButtonVariant = 'primary' | 'food' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'ok' | 'warn' | 'dark';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
  iconRight?: string;
  full?: boolean;
}

const BTN_VARIANT: Record<ButtonVariant, string> = {
  primary:   'bg-brand-600 text-white hover:bg-brand-700 shadow-[0_1px_2px_rgba(31,79,216,.35)]',
  food:      'bg-food-400 text-white hover:bg-food-500',
  secondary: 'bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-100',
  ghost:     'text-ink-600 hover:bg-ink-100',
  outline:   'bg-white border border-ink-300 text-ink-800 hover:bg-ink-50',
  danger:    'bg-busy-500 text-white hover:bg-busy-600',
  ok:        'bg-ok-500 text-white hover:bg-ok-600',
  warn:      'bg-warn-400 text-warn-900 hover:bg-warn-300',
  dark:      'bg-ink-900 text-white hover:bg-ink-800',
};

const BTN_SIZE: Record<ButtonSize, string> = {
  xs: 'h-7 px-2.5 text-[11px] rounded-lg',
  sm: 'h-9 px-3 text-[13px]',
  md: 'h-11 px-4 text-[14px]',
  lg: 'h-[52px] px-5 text-[15px]',
};

export const Button = ({
  variant = 'primary', size = 'md', icon, iconRight, full, children, className, ...rest
}: ButtonProps) => (
  <button
    className={cx(
      'inline-flex items-center justify-center gap-1.5 font-bold rounded-xl transition-all active:scale-[.975] disabled:opacity-40 disabled:pointer-events-none select-none',
      BTN_VARIANT[variant], BTN_SIZE[size], full && 'w-full', className
    )}
    {...rest}
  >
    {icon && <Icon n={icon} s={size === 'lg' ? 20 : size === 'xs' ? 14 : 17} />}
    {children}
    {iconRight && <Icon n={iconRight} s={size === 'lg' ? 20 : 16} />}
  </button>
);

/* ── Badge ──────────────────────────────────────────────── */

type Tone = 'brand' | 'ok' | 'busy' | 'warn' | 'unk' | 'off' | 'food' | 'ink';

const BADGE_TONE: Record<Tone, { soft: string; solid: string }> = {
  brand: { soft: 'bg-brand-50 text-brand-700 border-brand-200', solid: 'bg-brand-600 text-white border-brand-600' },
  ok:    { soft: 'bg-ok-50 text-ok-600 border-ok-200',          solid: 'bg-ok-500 text-white border-ok-500' },
  busy:  { soft: 'bg-busy-50 text-busy-600 border-busy-200',    solid: 'bg-busy-500 text-white border-busy-500' },
  warn:  { soft: 'bg-warn-50 text-warn-600 border-warn-200',    solid: 'bg-warn-400 text-warn-900 border-warn-400' },
  unk:   { soft: 'bg-unk-50 text-unk-600 border-unk-200',       solid: 'bg-unk-500 text-white border-unk-500' },
  off:   { soft: 'bg-off-50 text-off-600 border-off-200',       solid: 'bg-off-500 text-white border-off-500' },
  food:  { soft: 'bg-food-50 text-food-600 border-food-200',    solid: 'bg-food-400 text-white border-food-400' },
  ink:   { soft: 'bg-ink-100 text-ink-600 border-ink-200',      solid: 'bg-ink-900 text-white border-ink-900' },
};

export const Badge = ({
  tone = 'brand', icon, children, size = 'md', solid = false, className,
}: {
  tone?: Tone; icon?: string; children: React.ReactNode; size?: 'sm' | 'md'; solid?: boolean; className?: string;
}) => (
  <span
    className={cx(
      'inline-flex items-center gap-1 rounded-full border font-extrabold whitespace-nowrap',
      size === 'sm' ? 'h-6 px-2 text-[11px]' : 'h-7 px-2.5 text-[12px]',
      solid ? BADGE_TONE[tone].solid : BADGE_TONE[tone].soft,
      className
    )}
  >
    {icon && <Icon n={icon} s={size === 'sm' ? 12 : 14} />}
    {children}
  </span>
);

/* ── Card ───────────────────────────────────────────────── */

export const Card = ({ className, children, ...r }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cx('bg-white rounded-2xl border border-ink-200 shadow-card', className)} {...r}>
    {children}
  </div>
);

/* ── LiveStamp ──────────────────────────────────────────────
   ★ 실시간 수치를 보여주는 화면에는 반드시 이걸 같이 놓는다.
     "이 숫자가 정말 지금 상태인가?"에 답해 주는 장치다. */

export const LiveStamp = ({
  updated, offline, compact,
}: { updated: number; offline?: boolean; compact?: boolean }) => {
  const [now, setNow] = React.useState(0);
  React.useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(t);
  }, []);

  // 서버 렌더 시점에는 시각을 모른다 → 자리만 잡아 둔다 (hydration 오류 방지)
  if (!now || !updated) {
    return <span className="text-[11px] font-bold text-ink-400">확인 중…</span>;
  }
  if (offline) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-off-500">
        <Icon n="sensor-off" s={13} />
        연결 끊김
      </span>
    );
  }

  const f = freshness(now - updated);
  const color = f.tone === 'ok' ? 'text-ok-500' : f.tone === 'warn' ? 'text-warn-600' : f.tone === 'off' ? 'text-off-500' : 'text-ink-500';

  return (
    <span className={cx('inline-flex items-center gap-1 font-bold', compact ? 'text-[10.5px]' : 'text-[11px]', color)}>
      {!f.warn && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulseDot" />}
      {f.warn && <Icon n="alert" s={12} />}
      {f.label} · {agoText(now - updated)}
    </span>
  );
};

/* ── Chip (필터 칩) ─────────────────────────────────────── */

export const Chip = ({
  active, icon, children, count, onClick, className,
}: {
  active?: boolean; icon?: string; children: React.ReactNode; count?: number;
  onClick?: () => void; className?: string;
}) => (
  <button
    onClick={onClick}
    className={cx(
      'shrink-0 inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full text-[13px] font-bold border transition-all active:scale-[.97]',
      active ? 'bg-ink-900 text-white border-ink-900 shadow-card' : 'bg-white text-ink-600 border-ink-300 hover:border-ink-400',
      className
    )}
  >
    {icon && <Icon n={icon} s={15} />}
    {children}
    {count != null && (
      <span className={cx('tnum text-[11px] font-extrabold px-1.5 rounded-full', active ? 'bg-white/20' : 'bg-ink-100 text-ink-500')}>
        {count}
      </span>
    )}
  </button>
);

/* ── Segmented (탭 전환) ────────────────────────────────── */

export const Segmented = <T extends string>({
  value, onChange, options, size = 'md', full,
}: {
  value: T; onChange: (v: T) => void;
  options: { value: T; label: string }[];
  size?: 'sm' | 'md'; full?: boolean;
}) => (
  <div className={cx('inline-flex bg-ink-100 rounded-xl p-1 gap-0.5', size === 'sm' && 'p-[3px]', full && 'w-full')}>
    {options.map((o) => (
      <button
        key={o.value}
        onClick={() => onChange(o.value)}
        className={cx(
          'rounded-lg font-bold transition-all whitespace-nowrap', full && 'grow',
          size === 'sm' ? 'px-2.5 h-7 text-[12px]' : 'px-3.5 h-9 text-[13px]',
          value === o.value ? 'bg-white text-ink-900 shadow-card' : 'text-ink-500 hover:text-ink-700'
        )}
      >
        {o.label}
      </button>
    ))}
  </div>
);

/* ── Gauge (이용률 막대) ────────────────────────────────── */

export const Gauge = ({
  used, total, tone = 'brand', label, sub, big,
}: {
  used: number; total: number; tone?: 'ok' | 'busy' | 'warn' | 'brand' | 'off';
  label: string; sub?: string; big?: boolean;
}) => {
  const pct = total ? Math.round((used / total) * 100) : 0;
  const bar = { ok: 'bg-ok-500', busy: 'bg-busy-500', warn: 'bg-warn-400', brand: 'bg-brand-600', off: 'bg-off-400' }[tone];
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className={cx('font-bold text-ink-600', big ? 'text-[13px]' : 'text-[12px]')}>{label}</span>
        <span className="tnum text-[12px] font-extrabold text-ink-800">
          {pct}% <span className="text-ink-400 font-bold">({used}/{total})</span>
        </span>
      </div>
      <div className={cx('w-full bg-ink-200 rounded-full overflow-hidden', big ? 'h-2.5' : 'h-1.5')}>
        <div className={cx('h-full rounded-full transition-all duration-700', bar)} style={{ width: pct + '%' }} />
      </div>
      {sub && <div className="text-[11px] text-ink-500 mt-1 font-medium">{sub}</div>}
    </div>
  );
};

/* ── Empty / Skeleton ───────────────────────────────────── */

export const Empty = ({
  icon = 'search', title, desc, action,
}: { icon?: string; title: string; desc?: string; action?: React.ReactNode }) => (
  <div className="py-14 px-6 text-center">
    <div className="w-14 h-14 rounded-2xl bg-ink-100 grid place-items-center mx-auto mb-3 text-ink-400">
      <Icon n={icon} s={26} />
    </div>
    <div className="text-[15px] font-extrabold text-ink-800">{title}</div>
    {desc && <div className="text-[12.5px] text-ink-500 mt-1.5 leading-relaxed whitespace-pre-line">{desc}</div>}
    {action && <div className="mt-4 flex justify-center">{action}</div>}
  </div>
);

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cx('skel animate-shimmer rounded-lg', className)} />
);
