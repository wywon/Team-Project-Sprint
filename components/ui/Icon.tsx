import React from 'react';

/**
 * 아이콘 세트
 * ─────────────────────────────────────────────────────────────
 * 아이콘 라이브러리를 설치하지 않는다. 24x24 stroke 기반 SVG를 직접 들고 있으면
 * 번들이 가볍고, 굵기·색을 currentColor 로 통일할 수 있다.
 *
 * 새 아이콘을 추가할 때는 반드시 viewBox="0 0 24 24" 기준으로 그리고,
 * 아래 P(공통 stroke 속성)를 펼쳐 쓴다. fill 을 쓰면 색이 따로 놀게 된다.
 *
 * 쓰는 법:  <Icon n="car" s={20} cls="text-ok-500" />
 */

const P = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.9,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export const ICONS: Record<string, React.ReactNode> = {
  check:<path {...P} d="M4.5 12.5l5 5 10-11"/>,
  car:<g {...P}><path d="M4 16v2.5a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5V17M17 17v1.5a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5V16"/><path d="M3.5 16v-3.2c0-.4.1-.7.3-1L5.6 8c.3-.6.9-1 1.6-1h9.6c.7 0 1.3.4 1.6 1l1.8 3.8c.2.3.3.6.3 1V16a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1Z"/><circle cx="7" cy="13.5" r="1"/><circle cx="17" cy="13.5" r="1"/></g>,
  parkingP:<g {...P}><rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M9.5 17V7.5h3.2a3 3 0 0 1 0 6H9.5"/></g>,
  fork:<g {...P}><path d="M6 3v6a2.5 2.5 0 0 0 5 0V3M8.5 11.5V21"/><path d="M17.5 3c-1.4 1.2-2 3-2 5.5 0 1.6.7 2.6 2 3V21"/></g>,
  people:<g {...P}><circle cx="9" cy="8" r="3"/><path d="M3.5 20c.6-3.2 2.9-5 5.5-5s4.9 1.8 5.5 5"/><path d="M16 5.5a3 3 0 0 1 0 5.6M17.5 14.6c2 .6 3.3 2.3 3.8 5"/></g>,
  bookmark:<path {...P} d="M6.5 4h11a1 1 0 0 1 1 1v15l-6.5-4-6.5 4V5a1 1 0 0 1 1-1Z"/>,
  broom:<g {...P}><path d="M14 4l6 6M13.5 8.5L6 16l2 2 7.5-7.5"/><path d="M6 16l-2.5 4.5L8 18"/></g>,
  ban:<g {...P}><circle cx="12" cy="12" r="8.5"/><path d="M6 18L18 6"/></g>,
  question:<g {...P}><circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .8-1 1.5v.4"/><circle cx="12" cy="16.8" r=".9" fill="currentColor" stroke="none"/></g>,
  alert:<g {...P}><path d="M10.3 4.3 2.9 17.2A1.6 1.6 0 0 0 4.3 19.6h15.4a1.6 1.6 0 0 0 1.4-2.4L13.7 4.3a1.6 1.6 0 0 0-2.8 0Z"/><path d="M12 9.5v4"/><circle cx="12" cy="16.4" r=".9" fill="currentColor" stroke="none"/></g>,
  sensor:<g {...P}><circle cx="12" cy="12" r="2.6"/><path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 16.2a6 6 0 0 0 0-8.4M4.9 4.9a10 10 0 0 0 0 14.2M19.1 19.1a10 10 0 0 0 0-14.2"/></g>,
  'sensor-off':<g {...P}><path d="M3 3l18 18"/><circle cx="12" cy="12" r="2.6"/><path d="M7.8 7.8a6 6 0 0 0-.6 7.6M16.2 16.2a6 6 0 0 0 .7-7.5"/></g>,
  bolt:<path {...P} d="M13.5 3 5 13.5h5.5L10 21l8.5-10.5H13L13.5 3Z"/>,
  accessible:<g {...P}><circle cx="12" cy="4.6" r="1.8"/><path d="M8 8.4h8M12 8v5h4l2 6M12 13a4.5 4.5 0 1 0 3.3 7.5"/></g>,
  hand:<g {...P}><path d="M9 11V5.6a1.6 1.6 0 1 1 3.2 0V11m0-1.4a1.6 1.6 0 1 1 3.2 0V12m0-1.2a1.6 1.6 0 1 1 3.2 0V16c0 2.8-2.2 5-5 5h-1.6c-1.7 0-3-.7-4-2L5 15.4a1.6 1.6 0 0 1 2.4-2.1L9 15"/></g>,
  search:<g {...P}><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></g>,
  star:<path fill="currentColor" stroke="none" d="m12 3.8 2.5 5.1 5.6.8-4 3.9 1 5.6-5.1-2.7-5 2.7 1-5.6-4.1-4 5.6-.7L12 3.8Z"/>,
  starO:<path {...P} d="m12 3.8 2.5 5.1 5.6.8-4 3.9 1 5.6-5.1-2.7-5 2.7 1-5.6-4.1-4 5.6-.7L12 3.8Z"/>,
  pin:<g {...P}><path d="M12 21s7-5.8 7-11a7 7 0 1 0-14 0c0 5.2 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/></g>,
  walk:<g {...P}><circle cx="13" cy="4.6" r="1.8"/><path d="M11 21l1.5-5.5L10 13V9l3.5-1.2 2.5 3 2.5 1"/><path d="M10 13l-2.5 3M12.5 15.5 15 21"/></g>,
  compass:<g {...P}><circle cx="12" cy="12" r="8.5"/><path d="m15 9-1.8 4.2L9 15l1.8-4.2L15 9Z"/></g>,
  calendar:<g {...P}><rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 9.5h17M8 3v4m8-4v4"/></g>,
  user:<g {...P}><circle cx="12" cy="8" r="3.5"/><path d="M4.5 20c.7-3.8 3.6-6 7.5-6s6.8 2.2 7.5 6"/></g>,
  chevL:<path {...P} d="M14.5 5 8 12l6.5 7"/>,
  chevR:<path {...P} d="M9.5 5 16 12l-6.5 7"/>,
  chevD:<path {...P} d="M5 9.5 12 16l7-6.5"/>,
  x:<path {...P} d="M6 6l12 12M18 6 6 18"/>,
  refresh:<g {...P}><path d="M20 12a8 8 0 1 1-2.6-5.9"/><path d="M20 4v4.5h-4.5"/></g>,
  clock:<g {...P}><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5.3l3.3 2"/></g>,
  won:<g {...P}><path d="M3.5 8h17M3.5 11.5h17"/><path d="M5.5 8l3 8 3.5-8 3.5 8 3-8"/></g>,
  wifi:<g {...P}><path d="M3.5 9.2a13 13 0 0 1 17 0M6.6 12.6a8.4 8.4 0 0 1 10.8 0M9.7 16a4 4 0 0 1 4.6 0"/><circle cx="12" cy="19" r="1" fill="currentColor" stroke="none"/></g>,
  bell:<g {...P}><path d="M6.5 10a5.5 5.5 0 0 1 11 0c0 4 1.5 5.5 1.5 5.5H5S6.5 14 6.5 10Z"/><path d="M10.2 19a2 2 0 0 0 3.6 0"/></g>,
  dashboard:<g {...P}><rect x="3.5" y="3.5" width="7" height="8.5" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="5" rx="1.5"/><rect x="3.5" y="15.5" width="7" height="5" rx="1.5"/><rect x="13.5" y="11.5" width="7" height="9" rx="1.5"/></g>,
  grid:<g {...P}><rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.5"/><rect x="13" y="3.5" width="7.5" height="7.5" rx="1.5"/><rect x="3.5" y="13" width="7.5" height="7.5" rx="1.5"/><rect x="13" y="13" width="7.5" height="7.5" rx="1.5"/></g>,
  settings:<g {...P}><circle cx="12" cy="12" r="3"/><path d="M19.4 14.4a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1v.2a2 2 0 0 1-4 0v-.1a1.6 1.6 0 0 0-2.8-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7h-.2a2 2 0 0 1 0-4h.1a1.6 1.6 0 0 0 1.1-2.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 2.7-1.1v-.2a2 2 0 0 1 4 0v.1a1.6 1.6 0 0 0 2.8 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1.1 2.7h.2a2 2 0 0 1 0 4h-.1a1.6 1.6 0 0 0-1.4 1Z"/></g>,
  logout:<g {...P}><path d="M15 8V5.5a1.5 1.5 0 0 0-1.5-1.5h-7A1.5 1.5 0 0 0 5 5.5v13A1.5 1.5 0 0 0 6.5 20h7a1.5 1.5 0 0 0 1.5-1.5V16"/><path d="M10 12h10m0 0-3-3m3 3-3 3"/></g>,
  history:<g {...P}><path d="M3.8 12a8.2 8.2 0 1 0 2.4-5.8"/><path d="M3.5 4.5V9H8"/><path d="M12 8v4.3l3 1.8"/></g>,
  plus:<path {...P} d="M12 5v14M5 12h14"/>,
  minus:<path {...P} d="M5 12h14"/>,
  nav:<path {...P} d="m4 12 16-7-7 16-2-7-7-2Z"/>,
  phone:<path {...P} d="M6.5 3.5h3l1.5 4-2 1.4a12 12 0 0 0 5.6 5.6l1.4-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z"/>,
  receipt:<g {...P}><path d="M6 3.5h12v17l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5-2 1.5v-17Z"/><path d="M9 8h6M9 12h6"/></g>,
  pencil:<g {...P}><path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z"/><path d="M14.5 6.5l3 3"/></g>,
  expand:<g {...P}><path d="M4 9V4.5h5M20 15v4.5h-5M20 9V4.5h-5M4 15v4.5h5"/></g>,
  chart:<g {...P}><path d="M4 20V4M4 20h16"/><rect x="7.5" y="12" width="3" height="5" rx="1"/><rect x="13" y="8" width="3" height="9" rx="1"/><rect x="18" y="14" width="2.5" height="3" rx="1"/></g>,
  image:<g {...P}><rect x="3.5" y="4.5" width="17" height="15" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="m4.5 17 4.5-4.5 3.5 3.5 3-3 4 4"/></g>,
  layers:<g {...P}><path d="m12 3 8.5 4.5L12 12 3.5 7.5 12 3Z"/><path d="m3.5 12 8.5 4.5L20.5 12M3.5 16.5 12 21l8.5-4.5"/></g>,
  sparkle:<path {...P} d="M12 3.5 13.6 9 19 10.6 13.6 12.2 12 17.7 10.4 12.2 5 10.6 10.4 9 12 3.5ZM18.5 15.5l.7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7.7-2.3Z"/>
};

export type IconName = keyof typeof ICONS;

export const Icon = ({ n, s = 20, cls = '' }: { n: string; s?: number; cls?: string }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" className={cls} aria-hidden="true">
    {ICONS[n] || null}
  </svg>
);

export default Icon;
